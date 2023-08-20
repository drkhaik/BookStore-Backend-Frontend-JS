import React, { useEffect, useState } from 'react';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import {
    Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs,
    Pagination, Drawer, Space, Spin, Empty, Skeleton
} from 'antd';
// import { FaUserSecret, FaCloudSun, BiSolidCricketBall } from 'react-icons/fa';
import './home.scss';
import { handleGetBookCategory, handleGetBookWithPaginate } from '../../services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';


const Home = () => {
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrent] = useState(1);
    const [pageSizeNumber, setPageSizeNumber] = useState(10);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("&sort=-sold");
    const [total, setTotal] = useState(0);
    const [allDataBooks, setAllDataBooks] = useState([]);

    const [KeyTab, setKeyTab] = useState("");
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useOutletContext();

    useEffect(() => {
        const getBookCategory = async () => {
            setIsLoading(true)
            const res = await handleGetBookCategory();
            if (res && res.data) {
                let d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
            setIsLoading(false)
        }
        getBookCategory();
    }, [])

    useEffect(() => {
        fetchBookWithPagination();
    }, [currentPage, pageSizeNumber, filter, sortQuery, searchQuery])

    const fetchBookWithPagination = async () => {
        setIsLoading(true);
        let query = `current=${currentPage}&pageSize=${pageSizeNumber}`;
        if (filter) {
            query += `${filter}`;
            // console.log("check query search", query);
        }
        if (sortQuery) {
            query += `${sortQuery}`;
            // console.log("check query sort", query);
        }
        if (searchQuery) {
            query += `&mainText=/${searchQuery}/i`;
        }
        const res = await handleGetBookWithPaginate(query);
        if (res && res.data) {
            setAllDataBooks(res.data.result);
            setTotal(res.data.meta.total)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // const abc = () => {
        //     setOpenDrawer(false)
        // }
        window.addEventListener("resize", setOpenDrawer(false))
    }, []);


    const handleChangeFilter = (changedValuesCategory, values) => {
        // console.log(">>> check handleChangeFilter", changedValuesCategory, values);
        // select items in category in [Arts, Business, ...] // where in []
        if (changedValuesCategory.category) {
            if (values.category && values.category.length > 0) {
                const str = values.category.join(',');
                setFilter(`&category=${str}`);
            }
        } else {
            setFilter('');
        }

    }

    const onFinish = (values) => {
        // console.log(">>> check values", values);
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `&price>=${values.range.from}&price<=${values.range.to}`;
            if (values?.category) {
                const str = values.category.join(',');
                f += `&category=${str}`;
            }
            setFilter(f);
        }
    }

    const items = [
        {
            key: '&sort=-sold',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: '&sort=-updatedAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: '&sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: '&sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ]

    const handleChangeCurrentPage = (pagination) => {
        // console.log("check page,pageSize", page, pageSize)
        if (pagination && pagination.current !== currentPage) {
            setCurrent(pagination.current)
            // console.log("check current", current)
        }
        if (pagination && pagination.pageSize !== pageSizeNumber) {
            setPageSizeNumber(pagination.pageSize)
            setCurrent(1);
        }
    }

    const [openDrawer, setOpenDrawer] = useState(false);

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleRedirectViewDetailBook = (item) => {
        const slug = convertSlug(item.mainText);
        navigate(`/book/${slug}?id=${item._id}`)
    }

    const Filter = (props) => {
        const { type } = props;
        return (
            <>
                <div style={{ display: 'flex', justifyContent: "space-around" }}>
                    <span style={{ fontSize: 16 }}> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                    <ReloadOutlined
                        style={{ fontSize: 16 }}
                        title="Reset"
                        onClick={() => {
                            setFilter("")
                            setSortQuery(KeyTab)
                            setSearchQuery("")
                            // setDefautKeyTab("&sort=-sold")
                            form.resetFields()
                        }}
                    />
                </div>
                <Divider />
                <Form
                    onFinish={onFinish}
                    form={form}
                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                >
                    <Form.Item
                        name="category"
                        label={<Divider orientation='left' plain>Danh mục sản phẩm</Divider>}
                        labelCol={{ span: 24 }}
                    >
                        {isLoading === true
                            ?
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Spin tip='Loading...' />
                            </div>
                            :
                            <Checkbox.Group>
                                <Row>
                                    {listCategory && listCategory.length > 0 &&
                                        listCategory.map((item, index) => {
                                            return (
                                                <Col span={24} key={index} style={{ padding: '5px 0' }}>
                                                    <Checkbox value={item.value} >
                                                        {item.label}
                                                    </Checkbox>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </Checkbox.Group>
                        }
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        label={<Divider orientation='left' plain>Khoảng giá</Divider>}
                        labelCol={{ span: 24 }}
                    >
                        <div className={type === 'mobile' ? 'filter-price-mobile' : 'filter-price'} >
                            <Form.Item name={["range", 'from']} style={{ margin: 0 }}>
                                <InputNumber
                                    name='from'
                                    min={0}
                                    placeholder="đ TỪ"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                            <span >-</span>
                            <Form.Item name={["range", 'to']}>
                                <InputNumber
                                    name='to'
                                    min={0}
                                    placeholder="đ ĐẾN"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <Button onClick={() => form.submit()}
                                style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                        </div>
                    </Form.Item>
                    {type === 'mobile'
                        ?
                        <>
                        </>
                        :
                        <>
                            <Divider />
                            <Form.Item
                                label={<Divider orientation='left'>Đánh giá</Divider>}
                                labelCol={{ span: 24 }}
                            >
                                <div>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    {/* <span className="ant-rate-text"></span> */}
                                </div>
                                <div>
                                    <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    {/* <span className="ant-rate-text">trở lên</span> */}
                                </div>
                                <div>
                                    <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    {/* <span className="ant-rate-text">trở lên</span> */}
                                </div>
                                <div>
                                    <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    {/* <span className="ant-rate-text">trở lên</span> */}
                                </div>
                                <div>
                                    <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    {/* <span className="ant-rate-text">trở lên</span> */}
                                </div>
                            </Form.Item>
                        </>}
                </Form>
            </>
        )
    }

    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row style={{ gap: 20 }}>
                <Col xs={0} sm={0} md={4} className='sidebar'>
                    <Filter
                        type="computer"
                    />
                </Col>

                <Col md={19} className='content'>
                    <Tabs
                        // defaultActiveKey={defaultKeyTab}
                        items={items}
                        style={{ marginTop: "5px", marginLeft: "10px" }}
                        onChange={(key) => { setSortQuery(key), setKeyTab(key) }}
                    />
                    <Col xs={24} sm={24} md={0}>
                        <div className="" onClick={() => {
                            setOpenDrawer(true)
                        }}><FilterTwoTone style={{ fontSize: '18px' }} /> Lọc </div>
                        <Divider style={{ margin: "10px 0" }} />
                    </Col>
                    <Row className='customize-row'>
                        {isLoading === true
                            ?
                            <>
                                {[...Array(10)].map((e, index) => {
                                    return (
                                        <div key={index} className="" style={{ width: 'calc(20% - 8px)' }}>
                                            <Skeleton.Input
                                                active={true}
                                                block={true}
                                                style={{ width: '100%', height: '22rem' }}
                                            />
                                        </div>
                                    )
                                })}
                            </>

                            :
                            <>
                                {allDataBooks && allDataBooks.length > 0
                                    ?
                                    <>
                                        {allDataBooks.map((item, index) => {
                                            return (
                                                <div className="column" key={`book-${index}`} onClick={() => handleRedirectViewDetailBook(item)}>
                                                    <div className='thumbnail' style={{ marginTop: '15px' }}>
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                    </div>
                                                    <div className='info'>
                                                        <div style={{ height: '5rem' }}>
                                                            <div className='text' title={item.mainText}> {item.mainText} </div>
                                                            <div className='rating'>
                                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                                <span>Đã bán {item.sold}</span>
                                                            </div>
                                                        </div>
                                                        <div className='price'>
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                    :
                                    <>
                                        <span style={{ margin: '2rem 0rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Empty description={<> <p>Không có sản phẩm nào phù hợp!</p></>} />
                                        </span>
                                    </>
                                }

                            </>
                        }
                    </Row>

                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSizeNumber}
                            total={total}
                            showSizeChanger={true}
                            // onShowSizeChange={onShowSizeChange}
                            onChange={(p, s) => handleChangeCurrentPage({ current: p, pageSize: s })}
                            // onChange={(page, pageSize) => handleChangeCurrentPage(page, pageSize)}
                            responsive
                        />
                    </Row>
                </Col>
            </Row>
            <Drawer
                // title="Basic Drawer"
                placement={"right"}
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                width={"60vw"}
            >
                <Filter
                    type="mobile"
                />
            </Drawer>
        </div>
    )
}

export default Home;