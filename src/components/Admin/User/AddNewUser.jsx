
import React, { useState } from 'react';
import { Button, Modal, Form, Input, Divider, message, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { handleCreateBook } from '../../../services/api';

const AddNewUser = (props) => {
    const { openModal, setOpenModal, fetchUserWithPagination } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        console.log("check value", values)
        setIsSubmit(true)
        let res = await handleCreateNewUser(fullName, email, password, phone)
        if (res?.data?._id) {
            message.success("Add new successfully!");
            form.resetFields();
            setOpenModal(false);
            fetchUserWithPagination();
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

                title="Add New User"
                open={openModal}
                onOk={() => form.submit()}
                onCancel={() => setOpenModal(false)}
                okText='Add'
                confirmLoading={isSubmit}
            // maskClosable={false}
            >
                <Divider />
                <Form
                    name="basic"
                    style={{ maxWidth: 600, margin: '0 auto' }}
                    onFinish={onFinish}
                    form={form}
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
                    {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
                            Register
                        </Button>
                    </Form.Item> */}
                </Form>
            </Modal>
        </>
    );
};
export default AddNewUser;