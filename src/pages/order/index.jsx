import React, { useEffect, useState } from 'react';
import {
    Divider, Radio, Table, Row, Col, InputNumber, Empty, Steps, message, Checkbox, Form,
    Input, Space, Result, Button, notification
}
    from 'antd';
import './order.scss';
import { DeleteTwoTone, SmileOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, deleteItemInCart } from '../../redux/order/orderSlice';
import { handleCreateAnOrder } from '../../services/api';
import { bulkDeleteItemInCart } from '../../redux/order/orderSlice';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const OrderPage = () => {
    const [dataCart, setDataCart] = useState([]);
    const cart = useSelector(state => state.order.cart);
    const user = useSelector(state => state.authentication.user);
    // console.log("check user", user);
    const [checkedId, setCheckId] = useState([]);
    const [dataCheckedRow, setDataCheckRow] = useState([]);
    const [totalCheckout, setTotalCheckout] = useState(0);

    const [currentStep, setCurrentStep] = useState(0);

    const [formInfo] = Form.useForm();
    const [isSubmitInfo, setIsSubmitInfo] = useState(false);
    const [formPayment] = Form.useForm();
    // const [isSubmitPayment, setIsSubmitPayment] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        let dataCart = [];
        // let t = 0;
        if (cart && cart.length > 0) {
            // immutate object
            // dataCart = cart.map((item, index) => ({
            //     ...item,
            //     key: `${index + 1}`,
            // },
            //     t += item.total
            // ));
            // another way
            for (let index = 0; index < cart.length; index++) {
                const item = cart[index];
                const newItem = {
                    ...item,
                    key: index + 1,
                };
                // t += item.total;
                dataCart.push(newItem);
            }
        }
        setDataCart(dataCart);
    }, [cart]);

    useEffect(() => {
        // console.log("check checked row", checkedId) //checkedId.length = 0
        let data = [];
        for (let i = 0; i < checkedId.length; i++) {
            const id = checkedId[i];
            dataCart.map(c => {
                if (id === c._id) {
                    data.push(c);
                }
            })
        }
        setDataCheckRow(data);
        // console.log("check new DataCheckRow", data)
    }, [checkedId])

    useEffect(() => {
        // console.log("check handleCountTotal fire", dataCheckedRow);
        handleCountTotal();
    }, [dataCheckedRow]);

    const handleCountTotal = () => {
        let t = 0;
        if (dataCheckedRow && dataCheckedRow.length > 0) {
            for (let i = 0; i < dataCheckedRow.length; i++) {
                t += dataCheckedRow[i].total;
            }
        } else {
            t = 0;
        }
        // console.log("check t", t);
        setTotalCheckout(t);
    }

    const onChangeCheckbox = (checkedId) => {
        // console.log("check value", checkedId);
        setCheckId(checkedId);
    }

    const onChangeQuantity = (value, dataBook) => {
        if (!value || value < 1) value = 0;
        if (!isNaN(value)) {
            let total = value * dataBook.detail.price;
            let d = {
                quantity: value,
                _id: dataBook._id,
                detail: dataBook,
                total: total,
                type: 'change'
            }
            dispatch(addToCart(d));
            // handle change when user change quantity
            let newDataCheckedRow = [];
            for (let i = 0; i < dataCheckedRow.length; i++) {
                const item = dataCheckedRow[i];
                if (item._id === dataBook._id) {
                    const newItem = {
                        ...item,
                        quantity: value,
                        total: total,
                    };
                    newDataCheckedRow.push(newItem);
                } else {
                    newDataCheckedRow.push(item);
                }
            }
            // console.log("check handle change when user change quantity", newDataCheckedRow)
            setDataCheckRow(newDataCheckedRow);
        }
    }

    const handleDeleteItemInCart = (id) => {
        if (!id) return;
        dispatch(deleteItemInCart({ _id: id }));
        let data = checkedId.filter(r => r !== id);
        // }
        console.log("check data delete", data)
        setCheckId(data);
    }

    const columns = [
        //https://stackoverflow.com/questions/65508782/how-to-make-ant-design-table-responsive
        {
            title: 'Chọn',
            render: (text, record, index) => {
                return (
                    <Checkbox value={record._id} disabled={currentStep !== 0 ? true : false}> </Checkbox>
                )
            }
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'thumbnail',
            render: (text, record, index) => {
                return (
                    <img className='thumbnail' src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${record.detail.thumbnail}`} />
                )
            },
            // responsive: ["xs", "md"]
        },
        {
            title: 'Tên',
            dataIndex: 'mainText',
            render: (text, record, index) => {
                return (
                    <span className='book-name'>{record.detail.mainText}</span>
                )
            },
            responsive: ["sm"]
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            render: (text, record, index) => {
                return (
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.detail.price)}</div>
                )
            },
            responsive: ["sm"]
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            render: (text, record, index) => {
                return (
                    <InputNumber
                        className='input-quantity'
                        min={1}
                        max={record.detail.quantity}
                        value={record.quantity}
                        onChange={(value) => onChangeQuantity(value, record)}
                    />
                )
            },
            responsive: ["sm"]
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            render: (text, record, index) => {
                return (
                    <div className='total'>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.total)}
                    </div>
                )
            },
            responsive: ["sm"]
        },
        // responsive xs name / unit price / total / quantity
        {
            title: <div className='text-center'>Sản phẩm</div>,
            render: (text, record, index) => {
                return (
                    <>
                        <span className='book-name text-center'>{record.detail.mainText}</span>
                        <br />
                        <div className='text-center' style={{ marginBottom: '0.5rem' }}> Đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.detail.price)}</div>
                        {/* <br /> */}
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>

                            <InputNumber
                                className='input-quantity'
                                min={1}
                                max={record.detail.quantity}
                                value={record.quantity}
                                onChange={(value) => onChangeQuantity(value, record)}
                            />
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.total)}
                        </div>
                    </>
                )
            },
            responsive: ["xs"]
        },
        {
            // title: <div style={{ textAlign: 'center' }}>Xoá</div>,
            title: 'Xoá',
            dataIndex: 'delete',
            render: (text, record, index) => {
                // console.log("check text, record, index", record)
                return (
                    <div
                        style={{ textAlign: 'center' }}
                        onClick={() => handleDeleteItemInCart(record._id)}
                    >
                        <span style={{ cursor: 'pointer', margin: "0 20px" }}>
                            <DeleteTwoTone twoToneColor="#ff4d4f" />
                        </span>
                    </div>
                )
            },
            // responsive: ["xs", "sm"]
        },
    ];

    const mileStone = [
        {
            title: 'Đơn hàng',
        },
        {
            title: 'Thông tin',
        },
        {
            title: 'Thanh toán',
        },
    ];

    const InfoSection = () => {
        const onFinish = async (values) => {
            if (!values) return;
            setIsSubmitInfo(true);
            // console.log("check data", dataCheckedRow);
            const dataOrders = dataCheckedRow.map(item => {
                return {
                    bookName: item.detail.mainText,
                    quantity: item.quantity,
                    _id: item._id,
                }
            })
            let d = {
                name: values.name,
                address: values.address,
                phone: values.phone,
                totalPrice: totalCheckout,
                detail: dataOrders,
            }
            const res = await handleCreateAnOrder(d);
            if (res && res.data) {
                message.success("Xác nhận thông tin thành công!");
                // dispatch(bulkDeleteItemInCart(checkedId));
                setCurrentStep(2);
                formInfo.setFieldValue("address", "");

            } else {
                notification.error({
                    message: "Đã có lỗi xảy ra"
                })
            }
            setIsSubmitInfo(false);
        };
        return (
            <>
                <Form
                    name='basic'
                    onFinish={onFinish}
                    form={formInfo}
                    layout="vertical"
                >
                    <div className='info'>
                        <div className='title'>
                            <span> Giao tới</span>
                            <span style={{ cursor: 'pointer' }}> Thay đổi</span>
                        </div>

                        <div className='detail'>
                            <Form.Item
                                label="Họ tên người nhận"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy điền tên người nhận!',

                                    },
                                    // {
                                    //     pattern: /^[a-zA-Z\s]{3,}$/,
                                    //     message: 'Tên người nhận không được chứa kí tự đặc biệt!',
                                    // }
                                ]}
                                initialValue={user.fullName}
                            >
                                {/* if value === null, value = user.fullName */}
                                <Input />
                            </Form.Item>


                            <Form.Item
                                label="Số điện thoại nhận hàng"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy điền số điện thoại người nhận!',
                                    },
                                    {
                                        pattern: /^[0-9]+$/,
                                        message: 'Số điện thoại không được chứa kí tự đặc biệt!',
                                    }
                                ]}
                                initialValue={user.phone}
                            >

                                <Input prefix="+84" />
                            </Form.Item>

                            <div className='address'>
                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hãy điền địa chỉ người nhận!',
                                        },
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Số 1 Hùng Vương, Ba Đình, Hà Nội"
                                        autoSize={{
                                            minRows: 3,
                                            maxRows: 6,
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <Divider />
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="btn submit" loading={isSubmitInfo}>
                                Xác Nhận
                            </Button>
                        </Form.Item>
                    </div>
                </Form >
            </>
        )
    }

    const TotalSection = () => {
        const handleOnClickBuy = () => {
            if (dataCart.length < 1) {
                message.error("Không có sản phẩm nào trong giỏ hàng!")
                return;
            }
            if (checkedId.length < 1) {
                message.error("Chưa chọn sản phẩm!")
                return;
            }
            setCurrentStep(1);
        }
        return (
            <>
                <div className='total'>
                    <div className='price-item'>
                        <span className='text'> Tạm tính </span>
                        <span>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCheckout)}
                        </span>
                    </div>
                    <div className='price-item'>
                        <span className='text'> Giảm giá </span>
                        <span> 0đ </span>
                    </div>
                    <Divider />
                    <div className='price-total'>
                        <span className='text'> Tổng tiền </span>
                        <div className='content'>
                            <span className='price'>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCheckout)}
                            </span>
                            <span className='note'>(Đã bao gồm VAT nếu có)</span>
                        </div>
                    </div>
                    <Divider />
                    <button
                        className='btn buy'
                        onClick={() => handleOnClickBuy()}
                    >
                        Mua Hàng ({checkedId.length})
                    </button>
                </div>
            </>
        )
    }

    const PaymentSection = () => {
        const handleRadioCheck = (value) => {
            console.log("check radio checked", value);
            if (!value) return;
            dispatch(bulkDeleteItemInCart(checkedId));
            setCheckId([]);
            setDataCheckRow([]);
            setCurrentStep(3);
        }
        return (
            <>
                <div className='payment'>
                    <div className='title'>Chọn phương thức thanh toán</div>
                    {/* <Divider  /> */}
                    <Form
                        name='basic'
                        onFinish={handleRadioCheck}
                        form={formPayment}
                        layout="vertical"
                    >
                        <Form.Item
                            name="payment"
                            rules={[{ required: true, message: 'Hãy chọn phương thức thanh toán!', },]}
                        >
                            <Radio.Group
                                // onChange={onChangePaymentMethod}
                                className='radio-box'
                            >
                                <Space direction="vertical">
                                    <Radio value="cash_on_delivery"> Thanh toán tiền mặt khi nhận hàng </Radio>
                                    <Radio value="international_credit_card"> Thanh toán bằng thẻ quốc tế Visa, Master, JCB </Radio>
                                    <Radio value="domestic_card"> Thẻ ATM nội địa/Internet Banking (Hỗ trợ Internet Banking) </Radio>
                                    <Radio value="momo"> Thanh toán bằng ví MoMo </Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Divider />
                        <button
                            className='btn order'
                        // onClick={() => setCurrentStep(3)}
                        >
                            đặt hàng
                        </button>
                    </Form>
                </div>
            </>
        )
    }

    return (
        <div className="order-page">
            <Divider orientation="left" ><div className="main-title"> Giỏ hàng</div> </Divider>
            <Row>
                <Col span={24}>
                    <div className='progress-bar'>
                        <Steps
                            current={currentStep}
                            items={mileStone}
                            size='small'
                        />
                    </div>
                </Col>
            </Row>

            <Divider />
            <div className="order-page-body">
                {currentStep === 3 ?
                    <>
                        <Result
                            icon={<SmileOutlined />}
                            title="Đơn hàng đã được đặt thành công!"
                            extra={<Button onClick={() => navigate('/history')} type="primary">Xem lịch sử mua hàng</Button>}
                        />
                    </>
                    :
                    <Row gutter={20} style={{ justifyContent: 'space-between' }}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={18} className='content-left'>
                            <Checkbox.Group onChange={onChangeCheckbox} style={{ display: 'block' }}>
                                <Table
                                    // rowSelection={{
                                    //     type: 'checkbox',
                                    //     // selectedRowKeys: selectedRowKey,
                                    //     onChange: (selectedRowKeys, selectedRows) => handleOnChangeRow(selectedRowKeys, selectedRows),
                                    // }}
                                    columns={columns}
                                    dataSource={dataCart}
                                    pagination={false}
                                    style={{ borderRadius: '5px' }}
                                    locale={{
                                        emptyText:
                                            (<span style={{ margin: '2rem 0rem', display: 'block' }}>
                                                <Empty />
                                                <p>Không có sản phẩm nào trong giỏ hàng!</p>
                                            </span>)
                                    }}
                                >
                                </Table>
                            </Checkbox.Group>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={6} className='content-right'>
                            {currentStep === 0 &&
                                <TotalSection />
                            }
                            {currentStep === 1 &&
                                <InfoSection />
                            }
                            {currentStep === 2 &&
                                <PaymentSection />
                            }
                            {/* <PaymentSection />
                        <InfoSection /> */}
                        </Col>
                    </Row>
                }

                {/* <PaymentSection /> */}
            </div>
        </div >
    )
}

export default OrderPage;