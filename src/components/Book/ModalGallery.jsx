import { Modal, Row, Col, Image } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ImageGallery from "react-image-gallery";

const ModalGallery = (props) => {
    const { isOpenModal, setIsModalOpen, images, title, currentIndex } = props;
    const refGallery = useRef();
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        if (isOpenModal) {
            setActiveIndex(currentIndex)
        }
    }, [isOpenModal, currentIndex])
    return (
        <>
            <Modal
                open={isOpenModal}
                // onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                centered
                footer={null}
                closable={false} //hide close button
                width={'80vw'}
                className="modal-gallery"
            >
                <Row gutter={[20, 20]}>
                    <Col span={18}>
                        <ImageGallery
                            ref={refGallery}
                            items={images}
                            autoPlay={false}
                            showPlayButton={false}
                            showThumbnails={false}
                            showFullscreenButton={false}
                            slideOnThumbnailOver={true}
                            startIndex={currentIndex}
                            onSlide={(index) => setActiveIndex(index)}
                            slideDuration={0}
                        // thumbnailPosition="bottom"
                        // slideDuration={2}
                        // showNav={true}
                        />
                    </Col>
                    <Col span={6}>
                        <div>{title}</div>
                        <Row gutter={[20, 20]}>
                            {images?.map((item, index) => {
                                return (
                                    <Col key={`image ${index}`}>
                                        <Image
                                            wrapperClassName={"img-normal"}
                                            width={90}
                                            height={90}
                                            src={item.original}
                                            preview={false}
                                            onClick={() => {
                                                // use function slideToIndex of ImageGallery via Ref
                                                refGallery.current.slideToIndex(index);
                                            }}
                                        />
                                        <div className={activeIndex === index ? "active" : ""}></div>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Col>
                </Row>


            </Modal>

        </>
    )
}

export default ModalGallery;