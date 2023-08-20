import React, { useEffect, useState } from 'react';
import { Button, Table, Popconfirm, message, Space, notification } from 'antd';
import InputSearch from './InputSearch';
import { handleGetUserWithPaginate } from '../../../services/api';
import UserDetail from './UserDetail';
import { ReloadOutlined, UserAddOutlined, ExportOutlined, ImportOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import AddNewUser from './AddNewUser';
import ImportUserData from './data/ImportUserData';
import * as xlsx from "xlsx";
import UpdateUser from './UpdateUser';
import { handleDeleteUser } from '../../../services/api';


const UserTable = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [dataUser, setAllDataUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSizeNumber, setPageSizeNumber] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");
    const [openDetailUser, setOpenDetailUser] = useState(false);
    const [userInfo, setUserInfo] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openModalImportData, setOpenImportData] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState("");


    const columns = [
        {
            title: 'Fullname',
            dataIndex: 'fullName',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.fullName - b.fullName,
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            // onFilter: (value, record) => record.name.indexOf(value) === 0,
            // sorter: (a, b) => a.name.length - b.name.length,
            // sortDirections: ['descend'],
            render: (text, record, index) => {
                // console.log("check text, record, index", record)
                return (
                    <>
                        <a href='#' onClick={() => {
                            setOpenDetailUser(true);
                            setUserInfo(record);
                        }}>
                            {record.fullName}
                        </a>
                    </>
                )
            }

        },
        {
            title: 'Email',
            dataIndex: 'email',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.phone - b.phone,

        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                // console.log("check text, record, index", record)
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f6910b"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setDataUpdate(record)
                                setOpenModalUpdate(true)
                            }}
                        />
                        <Popconfirm
                            placement="topLeft"
                            title="Are you sure to delete this user?"
                            description="Delete the user"
                            onConfirm={() => onClickDeleteUser(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <span style={{ cursor: 'pointer', margin: "0 20px" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </>
                )
            }
        },

    ];

    useEffect(() => {
        fetchUserWithPagination();
        // when current or pageSizeNumber has changed, fetchUserWithPagination() will re-call
    }, [current, pageSizeNumber, filter, sortQuery]);


    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
        // console.log('params sorter', sorter)
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

    const searchUser = (querySearch) => {
        setFilter(querySearch);
    }

    const fetchUserWithPagination = async () => {
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
        const res = await handleGetUserWithPaginate(query);
        if (res && res.data) {
            let data = res.data.result;
            let dataUsers = [];
            // https://stackoverflow.com/questions/51703111/each-record-in-table-should-have-a-unique-key-prop-or-set-rowkey-to-an-uniqu
            for (let index = 0; index < data.length; index++) {
                const item = data[index];
                const newItem = {
                    ...item,
                    key: index + 1,
                };
                dataUsers.push(newItem);
            }
            setAllDataUser(dataUsers);
            setTotal(res.data.meta.total)
            setIsLoading(false);
        }
        // let result = [];
        // if (res && res.data) {
        //     let data = res.data.result;
        //     for (let i = 1; i <= data.length; i++) {
        //         data[i - 1].key = i;
        //     }
        //     result = data;
        // }

    }

    const handleExportData = () => {
        // https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (dataUser.length > 0) {
            const worksheet = xlsx.utils.json_to_sheet(dataUser);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
            //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
            xlsx.writeFile(workbook, "DataUser.csv");
        }
    }

    const onClickDeleteUser = async (id) => {
        const res = await handleDeleteUser(id);
        if (res && res.data) {
            message.success("Delete user successfully!");
            fetchUserWithPagination();
        } else {
            notification.error({
                message: 'Something went wrong...',
                description: res.message
            });
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        type="primary" icon={<ExportOutlined />}
                        onClick={() => handleExportData()}
                    >
                        Export
                    </Button>
                    <Button
                        type="primary" icon={<ImportOutlined />}
                        onClick={() => setOpenImportData(true)}
                    >
                        Import
                    </Button>
                    <Button
                        type="primary" icon={<UserAddOutlined />}
                        onClick={() => setOpenModal(true)}
                    >
                        Add new
                    </Button>
                    <Button type='ghost' onClick={() => {
                        setFilter("")
                        setSortQuery("")
                    }}>
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
    }

    // let selectedScheduleTime = listAllScheduleTime.filter(item => item.isSelected === true);
    // console.log("check userInfo", userInfo)
    return (
        <>
            <InputSearch
                searchUser={searchUser}
                setFilter={setFilter}
            />
            <Table
                title={renderHeader}
                loading={isLoading}
                columns={columns}
                dataSource={dataUser}
                onChange={onChange}
                // components={}
                pagination={
                    {
                        current: current, pageSize: pageSizeNumber, showSizeChanger: true, total: total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} out of {total} rows</div>) }
                    }
                }
            />
            <UserDetail
                userInfo={userInfo}
                openDetailUser={openDetailUser}
                setOpenDetailUser={setOpenDetailUser}
            />

            <AddNewUser
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchUserWithPagination={fetchUserWithPagination}
            />

            <ImportUserData
                openModalImportData={openModalImportData}
                setOpenImportData={setOpenImportData}
                fetchUserWithPagination={fetchUserWithPagination}
                handleExportData={handleExportData}
            />

            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                fetchUserWithPagination={fetchUserWithPagination}
            />

        </>
    )
}
export default UserTable;