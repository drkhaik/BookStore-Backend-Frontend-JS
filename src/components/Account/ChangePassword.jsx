import { Button, Row, Col, Avatar, Form, Upload, Input, message, notification } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { handleCallAPIChangePassword } from '../../services/api';

const ChangePassword = (props) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const user = useSelector(state => state.authentication.user)
    const onFinish = async (values) => {
        console.log('Success:', values);
        const { email, oldPassword, newPassword } = values;
        setIsSubmit(true);
        const res = await handleCallAPIChangePassword(email, oldPassword, newPassword);
        // console.log("check res", res);
        if (res && res.data) {
            message.success("Cập nhật mật khẩu thành công!");
            form.setFieldValue("oldPassword", "");
            form.setFieldValue("newPassword", "");
            props.setIsModalAccountOpen(false);
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra...",
                description: res.message,
            })
        }
        setIsSubmit(false);
    };

    return (
        <div style={{ minHeight: 350, marginTop: '2rem' }}>
            <Row style={{ justifyContent: 'center' }}>
                <Col sm={24} md={16}>
                    <Form
                        name="change_password"
                        form={form}
                        // labelCol={{ span: 8, }}
                        // wrapperCol={{ span: 16, }}
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            initialValue={user.email}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu cũ"
                            name="oldPassword"
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                        >

                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ChangePassword;