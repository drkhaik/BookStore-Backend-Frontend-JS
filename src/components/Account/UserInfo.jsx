
import { Button, Row, Col, Avatar, Form, Upload, Input, Divider, message, notification } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleCallAPIUploadAvatar, handleUpdateUserInfo } from '../../services/api';
import { doUploadUserInfo } from '../../redux/authentication/authenticationSlice';

const UserInfo = (props) => {
    const user = useSelector(state => state.authentication.user);
    // console.log("chekc user", user);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
    const [isSubmit, setIsSubmit] = useState(false);

    const srcAvt = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`;

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

    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        const res = await handleCallAPIUploadAvatar(file);
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            // dispatch(doUploadAvatarAction({ avatar: newAvatar }));
            setUserAvatar(newAvatar);
            onSuccess('Ok');
        } else {
            onError('Upload file failed!');
        }
    }

    const propsUpload = {
        name: 'avatar',
        maxCount: 1,
        multiple: false,
        customRequest: handleUploadAvatar,
        beforeUpload: beforeUpload,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    }

    const onFinish = async (values) => {
        setIsSubmit(true);
        const { fullName, phone } = values;
        // sau khi reload, se lay data dc luu tu res, roi fetch chu ko phai data trong redux
        // da upload anh thanh cong nen lay dc file anh, nhung ko upload dc data tren server
        const res = await handleUpdateUserInfo(fullName, phone, userAvatar, user.id);
        // console.log("check d", d);
        if (res && res.data) {
            // console.log("check res: ", res);
            dispatch(doUploadUserInfo({ avatar: userAvatar, fullName, phone }));
            message.success("Cập nhật thông tin thành công!");
            localStorage.removeItem('access_token');
            props.setIsModalAccountOpen(false);
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra...",
            })
        }
        setIsSubmit(false);
    };

    return (
        <div style={{ minHeight: 350, marginTop: '2rem' }}>
            <Row>
                <Col sm={24} md={8}>
                    <Row gutter={[30, 30]} style={{ justifyContent: 'center' }}>
                        <Col span={24}>
                            <Avatar
                                size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160 }}
                                icon={<UserOutlined />}
                                shape='circle'
                                src={srcAvt}
                            />
                        </Col>
                        <Col span={24}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                <Col sm={24} md={16}>
                    <Form
                        form={form}
                        name="update_info"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            initialValue={user.email}
                        // rules={[
                        //     {
                        //         pattern: adsasd,
                        //         message: 'Please input your username!',
                        //     },
                        // ]}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="Tên hiển thị"
                            name="fullName"
                            initialValue={user.fullName}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    pattern: /^[0-9]+$/,
                                    message: 'Số điện thoại không được chứa kí tự đặc biệt!',
                                }
                            ]}
                            initialValue={user.phone}
                        >

                            <Input prefix="+84" />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit" loading={isSubmit} style={{ marginTop: '2rem' }}>
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default UserInfo;