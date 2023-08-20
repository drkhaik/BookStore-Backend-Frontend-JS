import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import CountUp from 'react-countup';
import { handleCallAPIGetDataDashboard } from '../../services/api';

const AdminPage = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
    });

    useEffect(() => {
        const getDataDashboard = async () => {
            const res = await handleCallAPIGetDataDashboard();
            if (res && res.data) {
                setDataDashboard(res.data);
            }
        }
        getDataDashboard();
    }, []);
    // console.log("check dataDashboard: ", dataDashboard);
    const formatter = (value) => <CountUp end={value} separator="," />;
    return (
        <>
            <Row gutter={[40, 40]} style={{ marginTop: '2rem' }}>
                <Col sm={22} md={10} >
                    <Card
                        title="Tổng người dùng"
                        bordered={false}
                    >
                        <Statistic title="Active Users" value={dataDashboard.countUser} formatter={formatter} />
                    </Card>
                </Col>
                <Col sm={22} md={10} >
                    <Card
                        title="Tổng đơn hàng"
                        bordered={false}
                    >
                        <Statistic title="Active Users" value={dataDashboard.countOrder} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AdminPage;