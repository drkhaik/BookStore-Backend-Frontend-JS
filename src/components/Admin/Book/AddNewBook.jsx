
import React, { useEffect, useState } from 'react';
import { Upload, Modal, Form, Input, Divider, message, notification, Select, InputNumber, Row, Col } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { handleCreateBook, handleGetBookCategory, handleUploadBookImg } from '../../../services/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const AddNewBook = (props) => {
    const { openModalAddBook, setOpenModalAddBook, fetchBookWithPagination } = props;
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

    // console.log("check render")
    // const onChange = (value) => {
    //     console.log(`selected ${value}`);
    // };

    // const onSearch = (value) => {
    //     console.log('search:', value);
    // };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };


    const handlePreview = async (file) => {
        // console.log("check file of handle preview", file)
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
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
        // console.log(">>> check values: ", values);
        // console.log(">>> check data thumbnail: ", dataThumbnail);
        // console.log(">>> check data thumbnail to create: ", dataThumbnail[0].name);
        // console.log(">>> check data slider: ", dataSlider);
        let slider = dataSlider.map(item => item.name)
        // console.log(">>> check data slider to create: ", slider);
        // return;
        const { mainText, author, price, category, quantity, sold } = values;
        setIsSubmit(true)
        let d = {
            "thumbnail": dataThumbnail[0].name,
            "slider": slider,
            "mainText": mainText,
            "author": author,
            "price": price,
            "sold": sold,
            "quantity": quantity,
            "category": category,
        };
        // const jsonString = JSON.stringify(d);
        // console.log("check d", d);
        // console.log("check json", jsonString);
        let res = await handleCreateBook(d)
        if (res && res.data) {
            message.success("Add new book successfully!");
            form.resetFields();
            setOpenModalAddBook(false);
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


    return (
        <>
            <Modal
                title="Add New Book"
                open={openModalAddBook}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalAddBook(false)
                    form.resetFields();
                    setDataSlider([]);
                    setDataThumbnail([])
                }}
                okText='Add'
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
                    //https://stackoverflow.com/questions/61244343/defaultvalue-of-input-not-working-correctly-on-ant-design
                    initialValues={{
                        ["sold"]: 0
                    }}
                >
                    <Row gutter={16}>
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
                                //https://www.cnblogs.com/Freya0607/p/15935728.html
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
                                    onChange={handleChange}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
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
export default AddNewBook;