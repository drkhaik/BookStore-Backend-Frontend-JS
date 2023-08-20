import React, { useState } from 'react';
import { Col, Divider, Row, Dropdown, Space, Drawer, Badge, message, Avatar, Popover, Image } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
// import { logoutAction } from '../../redux/authentication/authenticationSlice';
import { handleLogoutReduxThunk } from '../../redux/authentication/authenticationSlice';
import './header.scss';
import { VscSearchFuzzy } from 'react-icons/vsc';
import Account from '../Account/Account';

const Header = (props) => {
    const { searchQuery, setSearchQuery } = props;
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.authentication.isAuthenticated)
    const user = useSelector(state => state.authentication.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.order.cart);
    const [isModalAccountOpen, setIsModalAccountOpen] = useState(false);
    const srcAvt = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`;

    const handleLogoutAction = () => {
        dispatch(handleLogoutReduxThunk());
        message.success("Log out successfully!");
        navigate("/");
    }

    const handleClickOrder = () => {
        setIsModalAccountOpen(true);
    }

    let items = [
        {
            label: <p onClick={handleClickOrder} style={{ margin: 0, cursor: 'pointer' }}>Quản lý tài khoản</p>,
            key: 'account',
        },
        {
            label: <p onClick={() => handleLogoutAction()} style={{ margin: 0, cursor: 'pointer' }}>Đăng xuất</p>,
            key: 'logout',
        },
    ];

    if (user.role === 'ADMIN') {
        items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: 'admin'
        })
    }

    const handleClickCartButton = () => {
        navigate('/order');
    }

    const renderCartHeader = () => {
        return (
            <div className='pop-cart-body'>
                <div className='pop-cart-content'>
                    {cart && cart.length > 0 &&
                        cart.map((item, index) => {
                            return (
                                <div className='book' key={index}>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`} />
                                    {/* <Image
                                        wrapperClassName={"img-normal"}
                                        width={90}
                                        height={90}
                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`}
                                        preview={false}
                                    /> */}
                                    <div> <span className='book-name'> {item.detail.mainText}</span></div>
                                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price)}</div>
                                </div>
                            )
                        })
                    }
                    {/* <Divider style={{ padding: '1rem' }} /> */}
                    <div className='pop-cart-footer'>
                        <button onClick={() => handleClickCartButton()}>Xem Giỏ Hàng</button>
                    </div>
                </div>
            </div>
        )
    }

    const onChangeInputSearch = (value) => {
        // console.log("check value", value);
        setSearchQuery(value);
    }

    return (
        <>
            <div className='header-container'>
                <header className='page-header'>
                    <div className='page-header__left'>
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo' onClick={() => navigate('/')}>
                                <FaReact className='rotate icon-react' /> Drkhaik BookStore
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                onChange={(e) => onChangeInputSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='page-header__right'>
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    title="Giỏ hàng"
                                    content={renderCartHeader}
                                    className='popover-cart'
                                    rootClassName='popover-cart'
                                    placement={'bottomRight'}
                                // arrow={true}
                                >
                                    <Badge
                                        count={cart?.length ?? 0}
                                        showZero
                                        size={"small"}
                                    >
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar className='avt' src={srcAvt} /> {user?.fullName}
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
                width={"80vw"}
            >
                {user.role === 'ADMIN'
                    ?
                    <>
                        <p>Trang quản trị</p>
                        <Divider />
                    </>
                    :
                    <>
                    </>
                }
                <p>Quản lý tài khoản</p>
                <Divider />
                <p>Đăng xuất</p>
                <Divider />

            </Drawer>
            <Account
                isModalAccountOpen={isModalAccountOpen}
                setIsModalAccountOpen={setIsModalAccountOpen}
            />
        </>
    )
}

export default Header;