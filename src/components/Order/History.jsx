import React, { useEffect, useState } from "react";
import { handleGetHistoryOrder } from "../../services/api";
import { Divider, Table, Row, Col, Empty, Tag } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import ReactJson from 'react-json-view';
import moment from "moment";

const History = () => {
    const [dataOrderHistory, setDataOrderHistory] = useState([]);
    // const user = useSelector(state => state.authentication.user);

    useEffect(() => {
        const getHistoryOrder = async () => {
            const res = await handleGetHistoryOrder();
            // let dataHistoryOrderByUserId = [];
            if (res && res.data) {
                // const dataHistoryOrder = res.data;
                // dataHistoryOrderByUserId = dataHistoryOrder.map(item => item.userId === user.id);
                setDataOrderHistory(res.data);
            }
            // console.log("check res", res);
        }
        getHistoryOrder();
    }, []);

    const columns = [
        {
            title: 'STT',
            render: (text, record, index) => {
                return (
                    <>
                        {index + 1}
                    </>
                )
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'category',
            render: (text, record, index) => {
                return (
                    <>
                        {moment(record.createdAt).format('DD-MM-YY HH:mm:ss')}
                    </>
                )
            },
            // responsive: ["sm"]
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (text, record, index) => {
                return (
                    <div>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}
                    </div>
                )
            },
            responsive: ["sm"]
        },
        {
            title: 'Trạng thái',
            dataIndex: 'price',
            render: (text, record, index) => {
                return (
                    <div><Tag color="green">Success</Tag></div>
                )
            },
            responsive: ["sm"]
        },
        // responsive
        {
            title: <div className='text-center'>Đơn hàng</div>,
            render: (text, record, index) => {
                return (
                    <>
                        {/* <div> {moment(record.createdAt).format('DD-MM-YY HH:mm:ss')}</div> */}
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}></div>
                        <div>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}
                        </div>
                        <div><Tag color="green">Success</Tag></div>
                    </>
                )
            },
            responsive: ["xs"]
        },
        {
            title: 'Chi tiết',
            dataIndex: 'price',
            render: (text, record, index) => {
                return (
                    <div>
                        <ReactJson
                            src={record.detail}
                            collapsed={true}
                            name={'Chi tiết đơn hàng'}
                            enableClipboard={false}
                            displayDataTypes={false}
                            displayObjectSize={false}
                        />
                    </div>
                )
            },
        },
    ];

    return (
        <>
            <div className="history-page">
                <div className="history-title">
                    <h3>Lịch sử mua hàng</h3>
                </div>
                <div className="history-page-body">
                    <Table
                        columns={columns}
                        dataSource={dataOrderHistory}
                        pagination={false}
                        style={{ borderRadius: '5px' }}
                        locale={{
                            emptyText:
                                (<span style={{ margin: '2rem 0rem', display: 'block' }}>
                                    <Empty />
                                    <p>Không có đơn hàng nào!</p>
                                </span>)
                        }}
                    >
                    </Table>
                </div>
            </div>
        </>
    )
}

export default History;