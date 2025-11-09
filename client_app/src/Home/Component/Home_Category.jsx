import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SaleAPI from '../../API/SaleAPI';

Home_Category.propTypes = {
  GET_id_modal: PropTypes.func
};

Home_Category.defaultProps = {
  GET_id_modal: () => {}
};

function Home_Category(props) {
  const { GET_id_modal } = props;

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    initialSlide: 0,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 600,  settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 } },
      { breakpoint: 480,  settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  const [product_category, set_product_category] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SaleAPI.getList();
        set_product_category(Array.isArray(response) ? response : []);
      } catch (e) {
        console.error('SaleAPI.getList error:', e);
        set_product_category([]);
      }
    };
    fetchData();
  }, []);

  // Lọc bỏ item thiếu id_product để không bị lỗi null
  const items = (product_category || []).filter(
    (v) => v && v.id_product && typeof v.id_product === 'object'
  );

  // helper format tiền VND
  const fmtVND = (n) => n.toLocaleString('vi-VN') + ' VNĐ';

  return (
    <div className="product-area pt-60 pb-50">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="li-product-tab">
              <ul className="nav li-product-menu">
                <li><a className="active" data-toggle="tab" href="#"><span>Sale</span></a></li>
              </ul>
            </div>
          </div>
        </div>
        <Slider {...settings}>
          {items.map((value, index) => {
            const p = value.id_product; // an toàn vì đã filter ở trên
            const keyVal = value._id || p._id || index;

            const basePrice = Number(p.price_product) || 0;
            const promo = Number(value.promotion) || 0;
            const discounted = Math.max(0, Math.round(basePrice * (1 - promo / 100)));

            const detailHref = p?._id ? `/detail/${p._id}` : '#';
            const imageSrc = p?.image || '/placeholder.png';
            const name = p?.name_product || 'Sản phẩm';

            return (
              <div
                className="col-lg-12 animate__animated animate__zoomIn col_product"
                style={{ zIndex: '999', height: '30rem' }}
                key={keyVal}
              >
                <div className="single-product-wrap">
                  <div className="product-image">
                    {p?._id ? (
                      <Link to={detailHref}>
                        <img src={imageSrc} alt={name} />
                      </Link>
                    ) : (
                      <img src={imageSrc} alt={name} />
                    )}
                    {promo > 0 && <span className="sticker">-{promo}%</span>}
                  </div>

                  <div className="product_desc">
                    <div className="product_desc_info">
                      <div className="product-review">
                        <h5 className="manufacturer">
                          {p?._id ? (
                            <Link to={detailHref}>{name}</Link>
                          ) : (
                            <span>{name}</span>
                          )}
                        </h5>
                        <div className="rating-box">
                          <ul className="rating">
                            <li><i className="fa fa-star-o"></i></li>
                            <li><i className="fa fa-star-o"></i></li>
                            <li><i className="fa fa-star-o"></i></li>
                            <li className="no-star"><i className="fa fa-star-o"></i></li>
                            <li className="no-star"><i className="fa fa-star-o"></i></li>
                          </ul>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between price-box">
                        <del className="new-price">{fmtVND(basePrice)}</del>
                        <span className="new-price" style={{ color: 'red' }}>
                          {fmtVND(discounted)}
                        </span>
                      </div>
                    </div>

                    <div className="add_actions">
                      <ul className="add-actions-link">
                        <li>
                          <button
                            type="button"
                            title="quick view"
                            className="links-details btn btn-link p-0"
                            data-toggle="modal"
                            data-target={p?._id ? `#${p._id}` : undefined}
                            disabled={!p?._id}
                            onClick={() => {
                              if (!p?._id) return;
                              GET_id_modal(p._id, discounted);
                            }}
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}

export default Home_Category;
