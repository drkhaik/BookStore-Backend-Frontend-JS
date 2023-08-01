import { Drawer, Badge, Descriptions, Divider, Upload, Modal, Button } from 'antd';
import { PlusOutlined, EditTwoTone } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

// const srcAvt = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`;

const BookDetail = (props) => {
    const { bookInfo, openDetailBook, setOpenDetailBook } = props;

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (bookInfo) {
            let imgThumbnail = {}, imgSlider = [];
            if (bookInfo.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: bookInfo.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookInfo.thumbnail}`,
                }
            }
            if (bookInfo.slider && bookInfo.slider.length > 0) {
                bookInfo.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider]);
        }
        // console.log("check render")
    }, [bookInfo])

    const handlePreview = async (file) => {
        // console.log("check file", file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    // const HeaderDrawer = () => {
    //     return (
    //         <>
    //             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    //                 <span>Detail Book</span>
    //                 <span style={{ display: 'flex', gap: 15 }}>
    //                     <Button
    //                         shape="circle"
    //                         size='large'
    //                         icon={<EditTwoTone twoToneColor="#f6910b" />}
    //                         style={{ fontSize: 18 }}
    //                     // onClick={() => handleExportData()}
    //                     >
    //                     </Button>
    //                 </span>
    //             </div>
    //         </>
    //     )
    // }

    return (
        <Drawer
            title="Detail Book"
            placement="right"
            onClose={() => setOpenDetailBook(false)}
            open={openDetailBook}
            width={'50vw'}
            column={1}
        >
            <Descriptions bordered>
                <Descriptions.Item label="Id" span={4}>{bookInfo._id}</Descriptions.Item>
                <Descriptions.Item label="Name" span={4}>{bookInfo.mainText}</Descriptions.Item>
                <Descriptions.Item label="Category" span={4}>
                    <Badge status="processing" text={bookInfo.category} />
                </Descriptions.Item>
                <Descriptions.Item label="Author" span={4}>{bookInfo.author} </Descriptions.Item>
                <Descriptions.Item label="Price" span={4}>{bookInfo.price} </Descriptions.Item>
                <Descriptions.Item label="Sold" span={2}>{bookInfo.sold} </Descriptions.Item>
                <Descriptions.Item label="Quantity" span={2}>{bookInfo.quantity}</Descriptions.Item>
                <Descriptions.Item label="Created At" span={2}>
                    {moment(bookInfo.createdAt).format('DD-MM-YY HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At" span={2}>
                    {moment(bookInfo.updatedAt).format('DD-MM-YY HH:mm:ss')}
                </Descriptions.Item>
            </Descriptions>
            <Divider orientation='left'>Book Images</Divider>
            <Upload
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={
                    { showRemoveIcon: false }
                }
            >
                {/* abc */}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%', }} src={previewImage}
                />
            </Modal>
        </Drawer>

    );
};
export default BookDetail;