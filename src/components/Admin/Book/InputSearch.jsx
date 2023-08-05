import { Button, Form, Input, Select } from 'antd';
import React from 'react';

const InputSearch = (props) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        // console.log(values);
        let { mainText, author, category } = values;
        let query = "";
        if (mainText) {
            query += `&mainText=/${mainText}/i`;
        }
        if (author) {
            query += `&author=/${author}/i`;
        }
        if (category) {
            query += `&category=/${category}/i`;
        }
        if (query) {
            props.searchBook(query);
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
                    name="mainText"
                    label="Name"
                    style={{ width: '30%' }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="author"
                    label="Author"
                    style={{ width: '30%' }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
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