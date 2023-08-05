import { Col, Row, Skeleton } from 'antd';
import './home.scss';

const HomeLoader = () => {

    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]}>
                <Col xs={0} sm={0} md={4} className='sidebar'>
                    <Skeleton
                        paragraph={{ rows: 5 }}
                        active={true}
                    />
                    <Skeleton
                        paragraph={{ rows: 5 }}
                        active={true}
                    />
                    <div style={{ display: "flex", gap: 20, marginTop: 20, overflow: 'hidden' }}>
                        <Skeleton.Button active={true} style={{ width: 100 }} />
                    </div>
                    <Skeleton
                        paragraph={{ rows: 6 }}
                        active={true}
                    />
                    <Skeleton
                        paragraph={{ rows: 3 }}
                        active={true}
                    />
                </Col>
                <Col md={19} className='content'>
                    <Row className='customize-row'>
                        <Col span={24}>
                            <Skeleton paragraph={{ rows: 1 }} />
                        </Col>
                        {[...Array(10)].map((e, index) => {
                            return (
                                <div className="" style={{ width: 'calc(20% - 8px)' }}>
                                    <Skeleton.Input
                                        active={true}
                                        block={true}
                                        style={{ width: '100%', height: '22rem' }}
                                    />
                                </div>
                            )
                        })}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default HomeLoader;