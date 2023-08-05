
import React, { useEffect, useState } from 'react';
import { Upload, Modal, Form, Input, Divider, message, notification, Select, InputNumber, Row, Col } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { handleGetBookCategory, handleUploadBookImg, handleUpdateBook } from '../../../services/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const UpdateBook = (props) => {
    const { openModalUpdate, setOpenModalUpdate, bookInfo, fetchBookWithPagination } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState();
    const [listCategory, setListCategory] = useState([]);

    const [dataSlider, setDataSlider] = useState([]);
    const [dataThumbnail, setDataThumbnail] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [initForm, setInitForm] = useState(null);

    useEffect(() => {
        const getBookCategory = async () => {
            const res = await handleGetBookCategory();
            if (res && res.data) {
                let d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        getBookCategory();
    }, [])

    useEffect(() => {
        if (bookInfo && bookInfo._id) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: bookInfo.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookInfo.thumbnail}`,
                }
            ]
            const arrSlider = bookInfo?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                }
            })
            const init = {
                _id: bookInfo._id,
                mainText: bookInfo.mainText,
                author: bookInfo.author,
                price: bookInfo.price,
                category: bookInfo.category,
                quantity: bookInfo.quantity,
                sold: bookInfo.sold,
                // fileList is controlled by Form
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider },
            }
            setInitForm(init)
            setDataThumbnail(arrThumbnail);
            setDataSlider(arrSlider);
            form.setFieldsValue(init);
        }
        // clean phase => component will unmount
        return () => {
            form.resetFields();
            // console.log("check return useEffect")
        }

    }, [bookInfo])

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handlePreview = async (file) => {
        // console.log("check file", file);
        if (!file.url && !file.preview && file.originFileObj) {
            // file.preview = await getBase64(file.originFileObj);
            getBase64(file.originFileObj, (url) => {
                setPreviewImage(url);
                setPreviewOpen(true);
                setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            });
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await handleUploadBookImg(file);
        // console.log("check file before set thumbnail", file);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Upload file failed!');
        }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await handleUploadBookImg(file);
        // console.log("check multiple file before set slider", file);
        if (res && res.data) {
            //copy previous state => upload multiple images
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Upload file failed!');
        }
    }

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    }

    const onFinish = async (values) => {
        // console.log("check value 123", values);
        // return;
        let slider = dataSlider.map(item => item.name)
        const { mainText, author, price, category, quantity, sold } = values;
        setIsSubmit(true)
        let d = {
            "thumbnail": dataThumbnail[0].name,
            "slider": slider,
            "mainText": mainText,
            "author": author,
            "price": price,
            "category": category,
            "quantity": quantity,
            "sold": sold,
        };
        let res = await handleUpdateBook(d, values._id);
        if (res && res.data) {
            message.success("Update successfully!");
            form.resetFields();
            setOpenModalUpdate(false);
            setDataSlider([]);
            setDataThumbnail([])
            await fetchBookWithPagination();
        } else {
            notification.error({
                message: "Something went wrong...",
                description: res.message,
                duration: 5
            })
        }
        setIsSubmit(false)
    };

    // console.log("check initialBookInfo", bookInfo)
    return (
        <>
            <Modal
                title="Update Book Info"
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false)
                    // form.resetFields();
                    // setInitForm(null)
                }}
                okText='Update'
                confirmLoading={isSubmit}
                // maskClosable={false}
                width="60vw"
                centered={true}
                forceRender={true}
            >
                <Divider />

                <Form
                    name="basic"
                    style={{ maxWidth: "100%", margin: '0 auto' }}
                    onFinish={onFinish}
                    form={form}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Form.Item
                            hidden
                            labelCol={{ span: 24 }}
                            label="Id"
                            name="_id"
                        >
                            <Input />
                        </Form.Item>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Name"
                                name="mainText"
                                rules={[{ required: true, message: 'Please input name of the book!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Author"
                                name="author"
                                rules={[{ required: true, message: 'Please input the author!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: 'Please input the price!' }]}
                            >
                                <InputNumber
                                    addonAfter="VND"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: 'Please input the price!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select category"
                                    value={null}
                                    allowClear
                                    // onChange={onChange}
                                    // onSearch={onSearch}
                                    // filterOption={(input, option) =>
                                    //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    // }
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: 'Please input the quantity!' }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Sold"
                                name="sold"
                                rules={[{ required: true, message: 'Please input the quantity of items sold(if any)!' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thumbnail"
                                name="thumbnail"
                                // valuePropName="fileList"
                                rules={[{ required: true, message: 'Please upload the thumbnail!' }]}
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    // showUploadList={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                    // fileList gan co dinh file, con defaultFileList co the chinh sua dc file
                                    defaultFileList={initForm?.thumbnail?.fileList ?? []}
                                // fileList={dataThumbnail ?? []}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8, }} > Upload </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Upload Slider"
                                name="slider"
                            // valuePropName="fileList"
                            >
                                <Upload
                                    name="slider"
                                    multiple
                                    listType="picture-card"
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onChange={(info) => handleChange(info, "slider")}
                                    onRemove={(file) => handleRemoveFile(file, "slider")}
                                    // fileList gan co dinh file, con defaultFileList co the chinh sua dc file
                                    defaultFileList={initForm?.slider?.fileList ?? []}
                                // fileList={dataSlider ?? []}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8, }} >Upload </div>
                                    </div>
                                </Upload>

                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};
export default UpdateBook;