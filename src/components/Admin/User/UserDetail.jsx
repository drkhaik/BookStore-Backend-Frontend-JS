import { Drawer, Badge, Descriptions } from 'antd';
import React from 'react';
import moment from 'moment';

const UserDetail = (props) => {
    const { userInfo, openDetailUser, setOpenDetailUser } = props;

    return (
        <Drawer
            title="Detail Info"
            placement="right"
            onClose={() => setOpenDetailUser(false)}
            open={openDetailUser}
            width={'50vw'}
            column={1}
        >

            <Descriptions title={userInfo.fullName} bordered>
                <Descriptions.Item label="Id" span={4}>{userInfo._id}</Descriptions.Item>
                <Descriptions.Item label="Full name" span={4}>{userInfo.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email" span={4}>{userInfo.email}</Descriptions.Item>
                <Descriptions.Item label="Phone" span={4}>
                    {userInfo.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Role" span={4}>
                    <Badge status="processing" text={userInfo.role} />
                </Descriptions.Item>
                <Descriptions.Item label="Created At" span={4}>
                    {moment(userInfo.createdAt).format('DD-MM-YY HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At" span={4}>
                    {moment(userInfo.updatedAt).format('DD-MM-YY HH:mm:ss')}
                </Descriptions.Item>

            </Descriptions>
        </Drawer>

    );
};
export default UserDetail;