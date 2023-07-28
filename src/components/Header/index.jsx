import React, { useState } from 'react';
import { Col, Divider, Row, Dropdown, Space, Drawer, Badge, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { logoutAction } from '../../redux/authentication/authenticationSlice';
import { handleLogoutReduxThunk } from '../../redux/authentication/authenticationSlice';
import './header.scss';
import { VscSearchFuzzy } from 'react-icons/vsc';

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.authentication.isAuthenticated)
    const user = useSelector(state => state.authentication.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogoutAction = () => {
        dispatch(handleLogoutReduxThunk());
        message.success("Log out successfully!");
        navigate("/");
    }
    const items = [
        {
            label: <a href="">Quản lý tài khoản</a>,
            key: '0',
        },
        {
            label: <p onClick={() => handleLogoutAction()} style={{ margin: 0, cursor: 'pointer' }}>Đăng xuất</p>,
            key: '1',
        },
    ];

    return (
        <>
            <div className='header-container'>
                <header className='page-header'>
                    <div className='page-header__left'>
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <FaReact className='rotate icon-react' /> Drkhaik BookStore
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                            />
                        </div>
                    </div>
                    <div className='page-header__right'>
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Badge
                                    count={5}
                                    size={"small"}
                                >
                                    <FiShoppingCart className='icon-cart' />
                                </Badge>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                Welcome {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </div>
                </header>

            </div>

            <Drawer
                title="Welcome"
                placement={'left'}
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}

            >
                <p>Quản lý tài khoản</p>
                <Divider />
                <p>Đăng xuất</p>
                <Divider />

            </Drawer>
        </>
    )
}

export default Header;