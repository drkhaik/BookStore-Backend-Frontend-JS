import ImageGallery from "react-image-gallery";
import { useState, useRef } from "react";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { Button, Rate, InputNumber, Avatar, Row, Col, Space } from 'antd';
import './ViewDetail.scss';
import { FaShippingFast } from "react-icons/fa";
import { PlusOutlined, ShopTwoTone, StarFilled, MinusOutlined } from '@ant-design/icons';
import ModalGallery from "./ModalGallery";
import { BsCartPlus } from 'react-icons/bs';
import BookLoader from "./BookLoader";

const ViewDetail = (props) => {
    const { dataBook } = props;
    const [quantity, setQuantity] = useState(1)

    const [isOpenModal, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refGallery = useRef(null);

    const images = dataBook?.images ?? [];
    console.log("cehck data book", dataBook.price / 0.8)

    const handleOnClickGallery = () => {
        setIsModalOpen(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
        //  refGallery?.current?.fullScreen()
    }

    const onChange = (value) => {
    };
    console.log('changed', quantity);

    return (
        <>
            <div className="detail-book-page">
                <div className="detail-book-wrapper">
                    {dataBook && dataBook._id
                        ?
                        <Row>
                            <Col xs={0} sm={0} md={24} lg={10} className="image-gallery-book" style={{ padding: '10px' }}>
                                <div>
                                    <ImageGallery
                                        // use ref to connect directly to that component, use function of that component
                                        ref={refGallery}
                                        items={images}
                                        // autoPlay={true}
                                        // showThumbnails={true }
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        slideOnThumbnailOver={true}
                                        showNav={false}
                                        onClick={() => handleOnClickGallery()}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={0} className="image-gallery-book" style={{ padding: '10px' }}>
                                <div>
                                    <ImageGallery
                                        // use ref to connect directly to that component, use function of that component
                                        ref={refGallery}
                                        items={images}
                                        autoPlay={false}
                                        showThumbnails={false}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        // slideOnThumbnailOver={true}
                                        showNav={false}
                                    />
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={14} className="detail-book-info" style={{ borderLeft: '1px solid #eaeaea' }} >
                                <Row>
                                    <Col span={24} style={{ padding: 10 }}>
                                        <div className="header-title">
                                            <div className="author">
                                                Tác giả: <span className="author-name">{dataBook.author} </span>
                                            </div>
                                            <div className="book-name">
                                                {dataBook.mainText}
                                            </div>
                                            <div className="rating">
                                                <Rate value={5} allowHalf disabled style={{ color: '#ffce3d', fontSize: 16 }} />
                                                <span style={{ fontSize: '14px', marginLeft: '10px', fontWeight: '300', cursor: 'pointer' }}>(Xem đánh giá)</span>
                                                <span style={{ fontSize: '14px', marginLeft: '10px', fontWeight: '300' }}>Đã bán {dataBook.sold}</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} style={{ padding: 10 }}>
                                        <div className="detail">
                                            <div className="price-badge">
                                                <span className="price">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price)}
                                                </span>
                                                <span className="old-price">
                                                    {/* price / 80%= old price */}
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price / 0.8)}
                                                </span>
                                                <span className="discount"> -20% </span>
                                            </div>
                                            <div className="shipping">
                                                Giao đến <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}> Q1, P.Bến Nghé, Hồ Chí Minh </span>
                                                <div className="ship-fee"><FaShippingFast /> Vận chuyển: 15.000đ</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={8} style={{ padding: 10, border: '1px solid #eaeaea' }}>
                                        <div className="book-supplier">
                                            <div className="info-supplier">
                                                <Avatar
                                                    size={'large'}
                                                    src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                                                />
                                                <span className="name" style={{ marginLeft: '0.6rem', fontWeight: 'bold' }}>Saigon Books Official</span>
                                                <div className="rating">
                                                    <div className="item rate">
                                                        <div>4.8/5 <StarFilled style={{ color: '#ffc120', fontSize: '15px' }} /></div>
                                                        <div className="sub-title">5.6+ </div>
                                                    </div>
                                                    <div className="item follow">
                                                        <div>5.2k+</div>
                                                        <div className="sub-title">Theo dõi </div>
                                                    </div>
                                                    <div className="item response">
                                                        <div>66%</div>
                                                        <div className="sub-title">Phản hồi </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="">
                                                {/* @media screen and (max-width: 1200px){ */}
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={12} className="col">
                                                        <Button className="button">
                                                            <ShopTwoTone /> <span> Xem Shop</span>
                                                        </Button>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={12} className="col">
                                                        <Button className="button">
                                                            <PlusOutlined /> <span> Theo Dõi</span>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={12} style={{ padding: 10 }}>
                                        <div className="quantity">
                                            <span className='title' style={{ marginRight: '10px' }}>Số lượng</span>
                                            <span className='input-number'>
                                                <button ><MinusOutlined /></button>
                                                <input defaultValue={1} />
                                                <button><PlusOutlined /></button>
                                            </span>
                                        </div>
                                    </Col>
                                    <Col md={24}>
                                        <div className='buy' style={{ padding: 10 }}>
                                            <button className='cart'>
                                                <BsCartPlus className='icon-cart' />
                                                <span>Thêm vào giỏ hàng</span>
                                            </button>
                                            <button className='now'>Mua ngay</button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        :
                        <BookLoader />
                    }
                </div>

            </div>

            <ModalGallery
                isOpenModal={isOpenModal}
                setIsModalOpen={setIsModalOpen}
                images={images}
                currentIndex={currentIndex}
                title={dataBook.mainText}
            />

        </>
    )
}

export default ViewDetail;