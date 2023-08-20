
import React, { useEffect, useState } from 'react';
import { Button, Table, Popconfirm, message, Space, notification, Divider } from 'antd';
import { handleCallAPIGetListOrder } from '../../../services/api';
import { ReloadOutlined, UserAddOutlined, ExportOutlined, ImportOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import moment from 'moment';
import ReactJson from 'react-json-view';

const OrderTable = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [allDataOrder, setAllDataOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSizeNumber, setPageSizeNumber] = useState(5);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("&sort=-updatedAt");

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            // defaultSortOrder: 'descend',
            sorter: true,

        },
        {
            title: 'Created At',
            dataIndex: 'updatedAt',
            defaultSortOrder: 'descend',
            sorter: true,
            render: (text, record, index) => {
                // console.log("check text, record, index", record)
                return (
                    <>
                        {moment(record.updatedAt).format('DD-MM-YY HH:mm:ss')}
                    </>
                )
            }

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
        }
    ];

    useEffect(() => {
        fetchOrderWithPagination();
        // when current or pageSizeNumber has changed, fetchUserWithPagination() will re-call
    }, [current, pageSizeNumber, filter, sortQuery]);


    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
        console.log('params sorter', sorter)
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
            // console.log("check current", current)
        }
        if (pagination && pagination.pageSize !== pageSizeNumber) {
            setPageSizeNumber(pagination.pageSize)
            setCurrent(1);
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `&sort=${sorter.field}` : `&sort=-${sorter.field}`;
            setSortQuery(q);
            // console.log("check query sorter", q)
        }
    };

    const searchBook = (querySearch) => {
        setCurrent(1);
        setFilter(querySearch);
    }

    const fetchOrderWithPagination = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSizeNumber}`;
        if (filter) {
            query += `${filter}`;
            // console.log("check query search", query);
        }
        if (sortQuery) {
            query += `${sortQuery}`;
            // console.log("check query sort", query);
        }
        const res = await handleCallAPIGetListOrder(query);
        if (res && res.data) {
            // console.log("check all data book", res.data.result);
            let data = res.data.result;
            let dataOrder = [];
            for (let index = 0; index < data.length; index++) {
                const item = data[index];
                const newItem = {
                    ...item,
                    key: index + 1,
                };
                dataOrder.push(newItem);
            }
            // console.log("check all data after update: ", dataOrder);
            // console.log("check all data book again: ", res.data.result);
            setAllDataOrder(dataOrder);
            setTotal(res.data.meta.total)
            setIsLoading(false);
        }
    }

    return (
        <>
            {/* <InputSearch
                searchBook={searchBook}
                setFilter={setFilter}
            /> */}
            <Divider orientation='left'> Table List Order </Divider>
            <Table
                loading={isLoading}
                columns={columns}
                dataSource={allDataOrder}
                onChange={onChange}
                // components={}
                pagination={
                    {
                        current: current, pageSize: pageSizeNumber, showSizeChanger: true, total: total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} out of {total} rows</div>) }
                    }
                }
            />
        </>
    )
}
export default OrderTable;