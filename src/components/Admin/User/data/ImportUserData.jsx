import React, { useEffect, useState } from 'react';
import { Modal, Form, Table, Divider, message, notification, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as xlsx from 'xlsx';
import { handleBulkCreateUser } from '../../../../services/api';
import templateFile from './templateFile.xlsx?url';
// https://vitejs.dev/guide/assets.html#explicit-url-imports

const { Dragger } = Upload;

const ImportUserData = (props) => {
    const { openModalImportData, setOpenImportData } = props;
    const [dataImport, setDataImport] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    //https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok")
        }, 2000);
    }
    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        //https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
        //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            // console.log("check info", info)
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully!`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    // console.log("check reader", reader)
                    reader.onload = (e) => {
                        // console.log("check e", e)
                        const data = new Uint8Array(reader.result);
                        const workbook = xlsx.read(data, { type: "array" });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const json = xlsx.utils.sheet_to_json(worksheet, {
                            header: ["fullName", "email", "phone"],
                            range: 1, // skip header row
                        });
                        // console.log("check data json", json)
                        if (json && json.length > 0) {
                            setDataImport(json);
                        }
                    };

                }

            } else if (status === 'error') {
                message.error(`${info.file.name} file uploaded failed!`)
            }

        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }

    const columns = [
        { dataIndex: 'fullName', title: 'Full name' },
        { dataIndex: 'email', title: 'Email' },
        { dataIndex: 'phone', title: 'Phone number' },
    ]

    const handleImportButton = async () => {
        let dataImportDB = dataImport.filter(item => item.password = "123456");
        console.log("check dataImportDB", dataImportDB);
        // setDataImportVd(dataImportDB);
        setIsLoading(true);
        const res = await handleBulkCreateUser(dataImportDB);
        if (res && res.data) {
            notification.success({
                message: "Import Data of User to DB successfully!",
                description: `Success: ${res.data.countSuccess} , Failed: ${res.data.countError}`,
            })
            setOpenImportData(false);
            setDataImport([]);
            props.fetchUserWithPagination();
        } else {
            notification.error({
                message: "Something went wrong...",
                description: `Success: ${res.data.countSuccess} , Failed: ${res.data.countError}`,
            })
        }
        setIsLoading(false);
    }


    return (
        <>
            <Modal
                title="Upload Data file"
                open={openModalImportData}
                onOk={() => handleImportButton()}
                onCancel={() => {
                    setOpenImportData(false);
                    setDataImport([]);
                }}
                confirmLoading={isLoading}
                okButtonProps={{ disabled: dataImport.length < 1 }}
                okText='Import data'
                width={'60vw'}
                centered={true}
                maskClosable={false}
            >
                <Divider />
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single. Only accept .csv .xls xlsx or you can download this sample file
                        &nbsp; <a onClick={e => e.stopPropagation()} href={templateFile} download>Download Sample file</a>
                    </p>
                </Dragger>

                <Divider />

                <Table
                    title={() => <span>Data upload</span>}
                    dataSource={dataImport}
                    columns={columns}
                // pagination={false}
                />

            </Modal>
        </>
    );
};
export default ImportUserData;