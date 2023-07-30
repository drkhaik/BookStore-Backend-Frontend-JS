
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Divider, message, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { handleUpdateUser } from '../../../services/api';

const UpdateUser = (props) => {
    const { openModalUpdate, setOpenModalUpdate, fetchUserWithPagination, dataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        const { _id, fullName, phone } = values;
        console.log("check value", values)
        setIsSubmit(true)
        const res = await handleUpdateUser(_id, fullName, phone)
        if (res && res.data) {
            message.success("Update successfully!");
            form.resetFields();
            setOpenModalUpdate(false);
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

    useEffect(() => {
        form.setFieldsValue(dataUpdate)
    }, [dataUpdate]);


    return (
        <>
            <Modal
                title="Update User"
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => setOpenModalUpdate(false)}
                okText='Update'
                confirmLoading={isSubmit}
            // maskClosable={false}
            >
                <Divider />
                <Form
                    name="Edit user"
                    style={{ maxWidth: 600, margin: '0 auto' }}
                    onFinish={onFinish}
                    form={form}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        hidden
                        labelCol={{ span: 24 }}
                        label="Id"
                        name="_id"
                        rules={[{ required: true, message: 'Please input your fullname!' }]}
                    >
                        <Input />
                    </Form.Item>

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
                        disable={true}
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input disabled />
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
export default UpdateUser;