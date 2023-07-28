import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import "./login.scss";
import { handleLogin } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../redux/authentication/authenticationSlice';

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        // console.log('Received values of form: ', values);
        const { username, password } = values;
        setIsSubmit(true)
        let res = await handleLogin(username, password, 5000);
        setIsSubmit(false)
        console.log("check res and user info", res)
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token)
            dispatch(loginAction(res.data.user))
            message.success("Login successfully!")
            navigate("/")
        } else {
            notification.error({
                message: "Something went wrong...",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }

    };
    return (
        <div className='login-page'>
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className='heading'>
                            <h2 className="text text-large">Đăng Nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[{
                                    required: true,
                                    message: 'Please input your Email!',
                                },]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{
                                    required: true,
                                    message: 'Please input your Password!',
                                },]}
                            >
                                <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a className="login-form-forgot" href="">
                                    Forgot password
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button" loading={isSubmit}>
                                    Log in
                                </Button>
                                Or <a href="">register now!</a>
                            </Form.Item>
                        </Form>
                    </section>
                </div>
            </main >

        </div >
    );
};
export default LoginPage;