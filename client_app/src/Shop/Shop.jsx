import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string'
import Product from '../API/Product';
import CategoryAPI from '../API/CategoryAPI';
import { Link, useParams } from 'react-router-dom';
import Products from './Component/Products';
import Pagination from './Component/Pagination';
import Search from './Component/Search';
import './ShopFilter.css';

Shop.propTypes = {

};

function Shop(props) {

    const { id } = useParams()

    const [products, setProducts] = useState([])
    const [sort, setSort] = useState('')

    // State cho filter
    const [priceRange, setPriceRange] = useState({ min: 0, max: 999999999 })
    const [selectedSizes, setSelectedSizes] = useState([])

    //Tổng số trang
    const [totalPage, setTotalPage] = useState()

    //Từng trang hiện tại
    const [pagination, setPagination] = useState({
        page: '1',
        count: '9',
        search: '',
        category: id
    })


    //Hàm này dùng để thay đổi state pagination.page
    //Nó sẽ truyền xuống Component con và nhận dữ liệu từ Component con truyền lên
    const handlerChangePage = (value) => {
        console.log("Value: ", value)

        //Sau đó set lại cái pagination để gọi chạy làm useEffect gọi lại API pagination
        setPagination({
            page: value,
            count: pagination.count,
            search: pagination.search,
            category: pagination.category
        })
    }

    //Gọi hàm để load ra sản phẩm theo pagination dữ vào id params 
    useEffect(() => {

        const fetchData = async () => {

            const params = {
                page: pagination.page,
                count: pagination.count,
                search: pagination.search,
                category: id
            }

            const query = '?' + queryString.stringify(params)

            const response = await Product.Get_Pagination(query)
            console.log(response)

            setProducts(response)


            // Gọi API để tính tổng số trang cho từng loại sản phẩm
            const params_total_page = {
                id_category: id
            }

            const query_total_page = '?' + queryString.stringify(params_total_page)

            const response_total_page = await Product.Get_Category_Product(query_total_page)

            //Tính tổng số trang = tổng số sản phẩm / số lượng sản phẩm 1 trang
            const totalPage = Math.ceil(parseInt(response_total_page.length) / parseInt(pagination.count))
            console.log(totalPage)

            setTotalPage(totalPage)

        }

        fetchData()

    }, [id])

    //Gọi hàm để load ra sản phẩm theo pagination dữ vào id params 
    useEffect(() => {

        const fetchData = async () => {

            const params = {
                page: pagination.page,
                count: pagination.count,
                search: pagination.search,
                category: id
            }

            const query = '?' + queryString.stringify(params)

            const response = await Product.Get_Pagination(query)
            console.log(response)

            setProducts(response)

        }

        fetchData()

    }, [pagination])


    // State cho tất cả categories
    const [categories, setCategories] = useState([])

    // Gọi API để load tất cả categories
    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await CategoryAPI.getAll()
                console.log("Categories:", response)
                setCategories(response)
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }

        fetchCategories()

    }, [])


    const handler_Search = (value) => {
        console.log("Search: ", value)
        
        setPagination({
            page: pagination.page,
            count: pagination.count,
            search: value,
            category: pagination.category
        })

    }

    // Handler cho sort
    const handlerChangeSort = (e) => {
        setSort(e.target.value)
    }

    // Handler cho price range filter
    const handlerPriceRangeChange = (min, max) => {
        setPriceRange({ min, max })
    }

    // Handler cho size filter
    const handlerSizeChange = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size))
        } else {
            setSelectedSizes([...selectedSizes, size])
        }
    }

    // Reset filters
    const resetFilters = () => {
        setPriceRange({ min: 0, max: 999999999 })
        setSelectedSizes([])
    }



    return (
        <div>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li className="active">Shop</li>
                        </ul>
                    </div>
                </div>
            </div>


            <div className="li-main-blog-page li-main-blog-details-page pt-60 pb-60 pb-sm-45 pb-xs-45">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 order-lg-1 order-2">
                            <div className="li-blog-sidebar-wrapper">
                                <div className="li-blog-sidebar">
                                    <div className="li-sidebar-search-form">
                                        <Search handler_Search={handler_Search} />
                                    </div>
                                </div>
                                <div className="li-blog-sidebar pt-25">
                                    <h4 className="li-blog-sidebar-title">All Product</h4>
                                    <ul className="li-blog-archive">
                                        <li><Link to="/shop/all" style={id === 'all' ? { cursor: 'pointer', color: '#fed700' } : { cursor: 'pointer' }}>All</Link></li>
                                    </ul>
                                </div>
                                <div className="li-blog-sidebar pt-25">
                                    <h4 className="li-blog-sidebar-title">Categories</h4>
                                    <ul className="li-blog-archive">
                                        {
                                            categories && categories.map(value => (
                                                <li key={value._id}>
                                                    <Link 
                                                        to={`/shop/${value._id}`} 
                                                        style={id === value._id ? { cursor: 'pointer', color: '#fed700', fontWeight: '600' } : { cursor: 'pointer' }}
                                                    >
                                                        {value.category}
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="li-blog-sidebar pt-25">
                                    <h4 className="li-blog-sidebar-title">Price Range</h4>
                                    <ul className="li-blog-archive li-price-filter">
                                        <li>
                                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <input 
                                                    type="radio" 
                                                    name="priceRange" 
                                                    checked={priceRange.min === 0 && priceRange.max === 999999999}
                                                    onChange={() => handlerPriceRangeChange(0, 999999999)}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                All Prices
                                            </label>
                                        </li>
                                        <li>
                                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <input 
                                                    type="radio" 
                                                    name="priceRange" 
                                                    checked={priceRange.min === 0 && priceRange.max === 500000}
                                                    onChange={() => handlerPriceRangeChange(0, 500000)}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                Under 500,000 VND
                                            </label>
                                        </li>
                                        <li>
                                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <input 
                                                    type="radio" 
                                                    name="priceRange" 
                                                    checked={priceRange.min === 500000 && priceRange.max === 1000000}
                                                    onChange={() => handlerPriceRangeChange(500000, 1000000)}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                500,000 - 1,000,000 VND
                                            </label>
                                        </li>
                                        <li>
                                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <input 
                                                    type="radio" 
                                                    name="priceRange" 
                                                    checked={priceRange.min === 1000000 && priceRange.max === 2000000}
                                                    onChange={() => handlerPriceRangeChange(1000000, 2000000)}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                1,000,000 - 2,000,000 VND
                                            </label>
                                        </li>
                                        <li>
                                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <input 
                                                    type="radio" 
                                                    name="priceRange" 
                                                    checked={priceRange.min === 2000000 && priceRange.max === 999999999}
                                                    onChange={() => handlerPriceRangeChange(2000000, 999999999)}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                Above 2,000,000 VND
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                                <div className="li-blog-sidebar pt-25">
                                    <h4 className="li-blog-sidebar-title">Size</h4>
                                    <ul className="li-blog-archive li-size-filter">
                                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                            <li key={size}>
                                                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedSizes.includes(size)}
                                                        onChange={() => handlerSizeChange(size)}
                                                        style={{ marginRight: '8px' }}
                                                    />
                                                    {size}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                    {(priceRange.min !== 0 || priceRange.max !== 999999999 || selectedSizes.length > 0) && (
                                        <button 
                                            onClick={resetFilters}
                                            style={{
                                                marginTop: '15px',
                                                padding: '8px 16px',
                                                backgroundColor: '#fed700',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                width: '100%'
                                            }}
                                        >
                                            Reset Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 order-1 order-lg-2">
                            <div className="shop-top-bar">
                                <div className="product-select-box">
                                    <div className="product-short">
                                        <p>Sort By:</p>
                                        <select className="nice-select" value={sort} onChange={handlerChangeSort}>
                                            <option value="">Relevance</option>
                                            <option value="DownToUp">Price (Low &gt; High)</option>
                                            <option value="UpToDown">Price (High &gt; Low)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="shop-products-wrapper">
                                <div className="tab-content">
                                    <div id="grid-view" className="tab-pane active" role="tabpanel">
                                        <div className="product-area shop-product-area">
                                            <Products 
                                                products={products} 
                                                sort={sort} 
                                                priceRange={priceRange}
                                                selectedSizes={selectedSizes}
                                            />
                                        </div>
                                    </div>
                                    <div className="paginatoin-area">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6">
                                                <p>Showing 1-9 of 9 item(s)</p>
                                            </div>
                                            <Pagination pagination={pagination} handlerChangePage={handlerChangePage} totalPage={totalPage} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;