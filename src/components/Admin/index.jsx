import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ExceptionOutlined,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  HeartTwoTone,
  DownOutlined,
  MinusSquareTwoTone,
  RightSquareTwoTone,
  LeftSquareTwoTone

} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Dropdown, Space, message } from 'antd';
import './LayoutAdmin.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useNavigate, Link } from 'react-router-dom';
// import { logoutAction } from '../../redux/authentication/authenticationSlice';
import { handleLogoutReduxThunk } from '../../redux/authentication/authenticationSlice';


const { Header, Content, Footer, Sider } = Layout;
const itemsSidebar = [
  {
    label: <Link to='/admin'>Dashboard</Link>,
    key: 'dashboard',
    icon: <AppstoreOutlined />
  },
  {
    label: <span>Manager Users</span>,
    // key: 'dashboard',
    icon: <UserOutlined />,
    children: [
      {
        label: <Link to='/admin/user'>CRUD</Link>,
        key: 'crud',
        icon: <TeamOutlined />,
      },
      {
        label: 'Files1',
        key: 'file1',
        icon: <TeamOutlined />,
      }
    ]
  },
  {
    label: <Link to='/admin/book'>Manager Books</Link>,
    key: 'book',
    icon: <ExceptionOutlined />
  },
  {
    label: <Link to='/admin/order'>Manager Orders</Link>,
    key: 'order',
    icon: <DollarCircleOutlined />
  },
];

const LayoutAdmin = () => {
  const user = useSelector(state => state.authentication.user);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogoutAction = () => {
    dispatch(handleLogoutReduxThunk());
    message.success("Log out successfully!");
    navigate("/");
  }
  const [collapsed, setCollapsed] = useState(false);

  const itemsDropdown = [
    {
      label: <a href="">Quản lý tài khoản</a>,
      key: '0',
    },
    {
      label: <p onClick={() => handleLogoutAction()} style={{ margin: 0 }}>Đăng xuất</p>,
      key: '1',
    },
  ];

  // const handleTestMenu = (e) => {
  //   console.log("check event", e)
  // }

  return (
    <Layout
      style={{ minHeight: '100vh' }}
      className="layout-admin"
    >
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 14, textAlign: 'center', fontSize: 17 }}>Admin</div>
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          defaultSelectedKeys={[activeMenu]}
          mode="inline"
          items={itemsSidebar}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>

      <Layout>
        <div className='admin-header'>
          <span style={{ fontSize: 24 }}>
            {React.createElement(collapsed ? RightSquareTwoTone : LeftSquareTwoTone, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            {/* <button onClick={() => { setCollapsed(!collapsed) }} ><MinusSquareTwoTone /></button> */}
          </span>
          <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Welcome {user?.fullName} <Space />
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>

        <Content style={{ margin: '0 16px', }} >
          <Outlet />
        </Content>

        <Footer style={{ textAlign: 'center', }}>
          Ant Design ©2023 Created by Ant UED  <HeartTwoTone twoToneColor="#eb2f96" />
        </Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;