import React, { useState } from 'react';
import { Button, Modal, Tabs, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';


const Account = (props) => {
    const { isModalAccountOpen, setIsModalAccountOpen } = props;
    const handleOk = () => {
        setIsModalAccountOpen(false);
    };
    const handleCancel = () => {
        setIsModalAccountOpen(false);
    };

    const onChangeTabs = (key) => {
        // console.log(key);
    };

    const items = [
        {
            key: 'info',
            label: `Cập nhật thông tin`,
            children: <UserInfo setIsModalAccountOpen={setIsModalAccountOpen} />,
        },
        {
            key: 'password',
            label: `Đổi mật khẩu`,
            children: <ChangePassword setIsModalAccountOpen={setIsModalAccountOpen} />,
        },
    ];


    return (
        <>
            <Modal title="Thông tin tài khoản"
                open={isModalAccountOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={'50vw'}
                footer={null}
            >
                <Tabs defaultActiveKey="info" items={items} onChange={onChangeTabs} />
            </Modal>
        </>
    );
};
export default Account;