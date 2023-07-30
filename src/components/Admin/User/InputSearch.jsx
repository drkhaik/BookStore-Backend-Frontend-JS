import { Button, Form, Input, Select } from 'antd';
import React from 'react';

const InputSearch = (props) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        console.log(values);
        let { fullName, email, role } = values;
        let query = "";
        if (fullName) {
            query += `&fullName=/${fullName}/i`;
        }
        if (email) {
            query += `&email=/${email}/i`;
        }
        if (role) {
            query += `&role=/${role}/i`;
        }
        if (query) {
            props.searchUser(query);
        }
    };
    const onReset = () => {
        form.resetFields();
        props.setFilter("");
    };

    return (

        <Form
            labelCol={{ span: 24 }}
            // wrapperCol={{ span: 24 }}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{ display: 'flex', flexDirection: 'column' }}

        >
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                <Form.Item
                    name="fullName"
                    label="Full name"
                    style={{ width: '30%' }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    style={{ width: '30%' }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    style={{ width: '30%' }}
                >
                    <Input />
                </Form.Item>
            </div>



            <div style={{ display: 'flex', marginBottom: 20, justifyContent: 'end', gap: 20 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                    Reset
                </Button>

            </div>
        </Form >
    );
};
export default InputSearch;