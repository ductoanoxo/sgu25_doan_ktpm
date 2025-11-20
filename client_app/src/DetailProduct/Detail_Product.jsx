import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useParams } from 'react-router';
import Product from '../API/Product';
import { useDispatch, useSelector } from 'react-redux';
import { stringify } from 'query-string';
import { addCart } from '../Redux/Action/ActionCart';
import { changeCount } from '../Redux/Action/ActionCount';
import { Link } from 'react-router-dom';
import Cart from '../API/CartAPI';
import CommentAPI from '../API/CommentAPI';
import CartsLocal from '../Share/CartsLocal';
import SaleAPI from '../API/SaleAPI';

Detail_Product.propTypes = {

};

function Detail_Product(props) {

    const { id } = useParams()

    const [product, set_product] = useState({})

    const dispatch = useDispatch()

    //id_user được lấy từ redux
    const id_user = useSelector(state => state.Cart.id_user)

    // Get count từ redux khi user chưa đăng nhập
    const count_change = useSelector(state => state.Count.isLoad)

    const [sale, setSale] = useState()
    
    const [relatedProducts, setRelatedProducts] = useState([]) // FR-011: Related products

    // Hàm này dùng để gọi API hiển thị sản phẩm
    useEffect(() => {

        const fetchData = async () => {

            const response = await Product.Get_Detail_Product(id)

            set_product(response)

            const resDetail = await SaleAPI.checkSale(id)
            
            if (resDetail.msg === "Thanh Cong"){
                setSale(resDetail.sale)
            }
            
            // FR-011: Fetch related products (same category, exclude current product)
            if (response.id_category && response.id_category._id) {
                const categoryId = response.id_category._id
                console.log('Fetching related products for category:', categoryId); // Debug
                
                const relatedRes = await Product.Get_Category_Product(`?id_category=${categoryId}`)
                console.log('Related products response:', relatedRes); // Debug
                
                // Filter out current product and limit to 4 items
                const filtered = relatedRes.filter(p => p._id !== id).slice(0, 4)
                console.log('Filtered related products:', filtered); // Debug
                setRelatedProducts(filtered)
            } else {
                console.log('No category found for product:', response); // Debug
            }

        }

        fetchData()

    }, [id])


    const [count, set_count] = useState(1)

    const [show_success, set_show_success] = useState(false)

    const [size, set_size] = useState('S')

    // Tính số lượng sản phẩm đã có trong giỏ hàng
    const [quantityInCart, setQuantityInCart] = useState(0)

    useEffect(() => {
        const existingCarts = JSON.parse(localStorage.getItem('carts') || '[]')
        const existingProduct = existingCarts.find(item => 
            item.id_product === id && item.size === size
        )
        setQuantityInCart(existingProduct ? parseInt(existingProduct.count) : 0)
    }, [id, size, count_change]) // Re-calculate when cart changes

    // Hàm này dùng để thêm vào giỏ hàng
    const handler_addcart = (e) => {

        e.preventDefault()

        // Kiểm tra hết hàng
        if (!product.number || product.number === 0) {
            alert('Sản phẩm này hiện đã hết hàng!')
            return
        }

        // Kiểm tra số lượng đặt không vượt quá tồn kho
        if (count > product.number) {
            alert(`Chỉ còn ${product.number} sản phẩm trong kho!`)
            set_count(product.number)
            return
        }

        // Kiểm tra số lượng đã có trong giỏ hàng
        const existingCarts = JSON.parse(localStorage.getItem('carts') || '[]')
        const existingProduct = existingCarts.find(item => 
            item.id_product === id && item.size === size
        )
        
        const currentQuantityInCart = existingProduct ? parseInt(existingProduct.count) : 0
        const totalQuantity = currentQuantityInCart + parseInt(count)

        // Kiểm tra tổng số lượng (đã có + mới thêm) không vượt quá tồn kho
        if (totalQuantity > product.number) {
            const availableToAdd = product.number - currentQuantityInCart
            if (availableToAdd <= 0) {
                alert(`Bạn đã có ${currentQuantityInCart} sản phẩm trong giỏ hàng. Không thể thêm nữa!`)
                return
            } else {
                alert(`Bạn đã có ${currentQuantityInCart} sản phẩm trong giỏ. Chỉ có thể thêm tối đa ${availableToAdd} sản phẩm nữa!`)
                return
            }
        }

        const data = {
            id_cart: Math.random().toString(),
            id_product: id,
            name_product: product.name_product,
            price_product: sale ? parseInt(sale.id_product.price_product) - ((parseInt(sale.id_product.price_product) * parseInt(sale.promotion)) / 100) : product.price_product,
            count: count,
            image: product.image,
            size: size,
        }

        CartsLocal.addProduct(data)

        const action_count_change = changeCount(count_change)
        dispatch(action_count_change)

        set_show_success(true)

        setTimeout(() => {
            set_show_success(false)
        }, 1000)

    }



    // Hàm này dùng để giảm số lượng
    const downCount = () => {
        if (count === 1) {
            return
        }

        set_count(count - 1)
    }

    const upCount = () => {
        // Kiểm tra không cho tăng quá số lượng tồn kho trừ đi số lượng đã có trong giỏ
        const maxCanAdd = product.number - quantityInCart
        if (product.number && count >= maxCanAdd) {
            if (maxCanAdd <= 0) {
                alert(`Bạn đã có ${quantityInCart} sản phẩm trong giỏ. Không thể thêm nữa!`)
            }
            return
        }
        set_count(count + 1)
    }


    // State dùng để mở modal
    const [modal, set_modal] = useState(false)

    // State thông báo lỗi comment
    const [error_comment, set_error_comment] = useState(false)

    const [star, set_star] = useState(1)

    const [comment, set_comment] = useState('')

    const [validation_comment, set_validation_comment] = useState(false)

    // state load comment
    const [load_comment, set_load_comment] = useState(true)

    // State list_comment
    const [list_comment, set_list_comment] = useState([])

    // Hàm này dùng để gọi API post comment sản phẩm của user
    const handler_Comment = () => {

        if (!sessionStorage.getItem('id_user')) { // Khi khách hàng chưa đăng nhập

            set_error_comment(true)

        } else { // Khi khách hàng đã đăng nhập

            if (!comment) {
                set_validation_comment(true)
                return
            }

            const data = {
                id_user: sessionStorage.getItem('id_user'),
                content: comment,
                star: star
            }

            const post_data = async () => {

                const response = await CommentAPI.post_comment(data, id)

                console.log(response)

                set_load_comment(true)

                set_comment('')

                set_modal(false)

            }

            post_data()

        }

        setTimeout(() => {
            set_error_comment(false)
        }, 1500)

    }


    // Hàm này dùng để GET API load ra những comment của sản phẩm
    useEffect(() => {

        if (load_comment) {
            const fetchData = async () => {

                const response = await CommentAPI.get_comment(id)
                
                console.log('Comment data:', response)
                response.forEach((comment, index) => {
                    console.log(`Comment ${index}:`, comment)
                    console.log(`User data:`, comment.id_user)
                })

                set_list_comment(response)

            }

            fetchData()

            set_load_comment(false)
        }

    }, [load_comment])


    return (
        <div>
            {
                show_success &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Bạn Đã Thêm Hàng Thành Công!</h4>
                    </div>
                </div>
            }
            {
                error_comment &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff', backgroundColor: '#f84545' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Vui Lòng Kiểm Tra Lại Đăng Nhập!</h4>
                    </div>
                </div>
            }


            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">Detail</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="content-wraper">
                <div className="container">
                    <div className="row single-product-area">
                        <div className="col-lg-5 col-md-6">
                            <div className="product-details-left">
                                <div className="product-details-images slider-navigation-1">
                                    <div className="lg-image">
                                        <img src={product.image} alt="product image" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7 col-md-6">
                            <div className="product-details-view-content pt-60">
                                <div className="product-info">
                                    <h2>{product.name_product}</h2>
                                    <div className="price-box pt-20">
                                        {
                                            sale ? (<del className="new-price new-price-2" style={{ color: '#525252'}}>{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(product.price_product)+ ' VNĐ'}</del>) :
                                            <span className="new-price new-price-2">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(product.price_product)+ ' VNĐ'}</span>
                                        }
                                        <br />
                                        {
                                            sale && (
                                                <span className="new-price new-price-2">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'})
                                                .format(parseInt(sale.id_product.price_product) - ((parseInt(sale.id_product.price_product) * parseInt(sale.promotion)) / 100)) + ' VNĐ'}</span>
                                            )
                                        }
                                    </div>
                                    <div className="stock-info pt-20 pb-20">
                                        <div style={{ fontSize: '16px', fontWeight: '500' }}>
                                            <span style={{ color: '#666' }}>Tình trạng: </span>
                                            {product.number === 0 ? (
                                                <span style={{ color: '#ff0000', fontWeight: 'bold' }}>Hết hàng</span>
                                            ) : product.number < 5 ? (
                                                <span style={{ color: '#ff9800', fontWeight: 'bold' }}>Chỉ còn {product.number || 0} sản phẩm</span>
                                            ) : (
                                                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Còn hàng ({product.number || 0} sản phẩm)</span>
                                            )}
                                        </div>
                                        {quantityInCart > 0 && (
                                            <div style={{ fontSize: '14px', marginTop: '8px', color: '#2196f3' }}>
                                                <i className="fa fa-shopping-cart" style={{ marginRight: '5px' }}></i>
                                                Bạn đã có <strong>{quantityInCart}</strong> sản phẩm (size {size}) trong giỏ hàng
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-desc">
                                        <p>
                                            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel harum tenetur delectus nam quam assumenda? Soluta vitae tempora ratione excepturi doloremque, repudiandae ullam, eum corporis, itaque dolor aperiam enim aspernatur.
                                            </span>
                                        </p>
                                    </div>
                                    <div className="product-variants">
                                        <div className="produt-variants-size">
                                            <label>Size</label>
                                            <select className="nice-select" onChange={(e) => set_size(e.target.value)}>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="single-add-to-cart">
                                        <form action="#" className="cart-quantity">
                                            <div className="quantity">
                                                <label>Quantity</label>
                                                <div className="cart-plus-minus">
                                                    <input 
                                                        className="cart-plus-minus-box" 
                                                        value={count} 
                                                        type="text" 
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value) || 1
                                                            const maxCanAdd = product.number - quantityInCart
                                                            
                                                            if (value < 1) {
                                                                set_count(1)
                                                            } else if (product.number && value > maxCanAdd) {
                                                                set_count(maxCanAdd > 0 ? maxCanAdd : 0)
                                                                if (maxCanAdd <= 0) {
                                                                    alert(`Bạn đã có ${quantityInCart} sản phẩm trong giỏ. Không thể thêm nữa!`)
                                                                } else {
                                                                    alert(`Chỉ có thể thêm tối đa ${maxCanAdd} sản phẩm nữa!`)
                                                                }
                                                            } else {
                                                                set_count(value)
                                                            }
                                                        }} 
                                                        disabled={!product.number || product.number === 0}
                                                    />
                                                    <div className="dec qtybutton" onClick={downCount}><i className="fa fa-angle-down"></i></div>
                                                    <div className="inc qtybutton" onClick={upCount}><i className="fa fa-angle-up"></i></div>
                                                </div>
                                            </div>
                                            {product.number === 0 ? (
                                                <a 
                                                    href="#" 
                                                    className="add-to-cart" 
                                                    style={{ 
                                                        backgroundColor: '#ccc', 
                                                        cursor: 'not-allowed',
                                                        pointerEvents: 'none'
                                                    }}
                                                >
                                                    Hết hàng
                                                </a>
                                            ) : (
                                                <a href="#" className="add-to-cart" type="submit" onClick={handler_addcart}>Add to cart</a>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-area pt-35">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="li-product-tab">
                                <ul className="nav li-product-menu">
                                    <li><a className="active" data-toggle="tab" href="#description"><span>Description</span></a></li>
                                    <li><a data-toggle="tab" href="#reviews"><span>Reviews</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="description" className="tab-pane active show" role="tabpanel">
                            <div className="product-description">
                                <span>The best is yet to come! Give your walls a voice with a framed poster. This aesthethic, optimistic poster will look great in your desk or in an open-space office. Painted wooden frame with passe-partout for more depth.</span>
                            </div>
                        </div>
                        <div id="reviews" className="tab-pane" role="tabpanel">
                            <div className="product-reviews">
                                <div className="product-details-comment-block">
                                    <div style={{ overflow: 'auto', height: '10rem' }}>
                                        {
                                            list_comment && list_comment.map(value => (

                                                <div className="comment-author-infos pt-25" key={value._id}>
                                                    <span>{value && value.id_user ? value.id_user.fullname : 'Unknown'} <div style={{ fontWeight: '400' }}>{value ? value.content : ''}</div></span>
                                                    <ul className="rating">
                                                        <li><i className={value && value.star > 0 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                        <li><i className={value && value.star > 1 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                        <li><i className={value && value.star > 2 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                        <li><i className={value && value.star > 3 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                        <li><i className={value && value.star > 4 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                    </ul>
                                                </div>

                                            ))
                                        }
                                    </div>

                                    <div className="review-btn" style={{ marginTop: '2rem' }}>
                                        <a className="review-links" style={{ cursor: 'pointer', color: '#fff' }} onClick={() => set_modal(true)}>Write Your Review!</a>
                                    </div>
                                    <Modal onHide={() => set_modal(false)} show={modal} className="modal fade modal-wrapper">
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <h3 className="review-page-title">Write Your Review</h3>
                                                    <div className="modal-inner-area row">
                                                        <div className="col-lg-6">
                                                            <div className="li-review-product">
                                                                <img src={product.image} alt="Li's Product" style={{ width: '20rem' }} />
                                                                <div className="li-review-product-desc">
                                                                    <p className="li-product-name">Today is a good day Framed poster</p>
                                                                    <p>
                                                                        <span>Beach Camera Exclusive Bundle - Includes Two Samsung Radiant 360 R3 Wi-Fi Bluetooth Speakers. Fill The Entire Room With Exquisite Sound via Ring Radiator Technology. Stream And Control R3 Speakers Wirelessly With Your Smartphone. Sophisticated, Modern Design </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="li-review-content">
                                                                <div className="feedback-area">
                                                                    <div className="feedback">
                                                                        <h3 className="feedback-title">Our Feedback</h3>
                                                                        <form action="#">
                                                                            <p className="your-opinion">
                                                                                <label>Your Rating</label>
                                                                                <span>
                                                                                    <select className="star-rating" onChange={(e) => set_star(e.target.value)}>
                                                                                        <option value="1">1</option>
                                                                                        <option value="2">2</option>
                                                                                        <option value="3">3</option>
                                                                                        <option value="4">4</option>
                                                                                        <option value="5">5</option>
                                                                                    </select>
                                                                                </span>
                                                                            </p>
                                                                            <p className="feedback-form">
                                                                                <label htmlFor="feedback">Your Review</label>
                                                                                <textarea id="feedback" name="comment" cols="45" rows="8" aria-required="true" onChange={(e) => set_comment(e.target.value)}></textarea>
                                                                                {
                                                                                    validation_comment && <span style={{ color: 'red' }}>* This is required!</span>
                                                                                }
                                                                            </p>
                                                                            <div className="feedback-input">
                                                                                <div className="feedback-btn pb-15">
                                                                                    <a className="close" onClick={() => set_modal(false)}>Close</a>
                                                                                    <a style={{ cursor: 'pointer' }} onClick={handler_Comment}>Submit</a>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FR-011: Related Products Section */}
            {console.log('Rendering related products, count:', relatedProducts.length)}
            {relatedProducts.length > 0 ? (
                <div className="related-products-area pt-60 pb-50" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-title text-center mb-40">
                                    <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Sản phẩm liên quan</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {relatedProducts.map((relatedProduct) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mt-40" key={relatedProduct._id}>
                                    <div className="single-product-wrap">
                                        <div className="product-image" style={{ position: 'relative' }}>
                                            <Link to={`/detail/${relatedProduct._id}`}>
                                                <img 
                                                    src={relatedProduct.image} 
                                                    alt={relatedProduct.name_product}
                                                    style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                                />
                                            </Link>
                                            {relatedProduct.id_sale && relatedProduct.id_sale.sale > 0 && (
                                                <span className="sticker">-{relatedProduct.id_sale.sale}%</span>
                                            )}
                                        </div>
                                        <div className="product_desc">
                                            <div className="product_desc_info">
                                                <div className="product-review">
                                                    <h5 className="manufacturer">
                                                        <Link to={`/detail/${relatedProduct._id}`}>
                                                            {relatedProduct.name_product}
                                                        </Link>
                                                    </h5>
                                                </div>
                                                <div className="price-box">
                                                    {relatedProduct.id_sale && relatedProduct.id_sale.sale > 0 ? (
                                                        <>
                                                            <span className="new-price" style={{ color: 'red', fontWeight: 'bold' }}>
                                                                {new Intl.NumberFormat('vi-VN', {style: 'decimal', decimal: 'VND'}).format(
                                                                    relatedProduct.price_product - (relatedProduct.price_product * relatedProduct.id_sale.sale / 100)
                                                                ) + ' VNĐ'}
                                                            </span>
                                                            <br />
                                                            <del style={{ color: '#999', fontSize: '14px' }}>
                                                                {new Intl.NumberFormat('vi-VN', {style: 'decimal', decimal: 'VND'}).format(relatedProduct.price_product) + ' VNĐ'}
                                                            </del>
                                                        </>
                                                    ) : (
                                                        <span className="new-price">
                                                            {new Intl.NumberFormat('vi-VN', {style: 'decimal', decimal: 'VND'}).format(relatedProduct.price_product) + ' VNĐ'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Detail_Product;