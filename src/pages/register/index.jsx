import React, { useState } from 'react';
// import './index.css';
import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { handleRegister } from '../../services/api';


const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsSubmit(true)
        let res = await handleRegister(fullName, email, password, phone)
        setIsSubmit(false)
        if (res?.data?._id) {
            message.success("Register successfully!")
            navigate("/login")
        } else {
            notification.error({
                message: "Something went wrong...",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    // const onFinishFailed = (errorInfo) => {
    //     console.log('Failed:', errorInfo);
    // };
    return (

        <div className='register-page'>
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className='heading'>
                            <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="basic"
                            style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Fullname"
                                name="fullName"
                                rules={[{ required: true, message: 'Please input your fullname!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Phone"
                                name="phone"
                                rules={[{ required: true, message: 'Please input your phone number!' }]}
                            >
                                <Input />
                            </Form.Item>

                            {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Register
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">Have an account?
                                <span>
                                    <Link to='/login' > Log in </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main >

        </div >

    )
};

export default RegisterPage;