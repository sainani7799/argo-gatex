import { ArrowDownOutlined, ArrowUpOutlined, CarOutlined, DownCircleOutlined, EditOutlined, EyeOutlined, MoreOutlined, UpCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Drawer, Dropdown, Empty, Form, Menu, message, Row, Select, Table, Tabs, Tag, Tooltip } from "antd";
import TabPane from 'antd/es/tabs/TabPane';
import dayjs from "dayjs";
import { ReqStatus, TruckStateEnum } from "libs/shared-models";
import { DcService } from "libs/shared-services";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VehcileEntry = () => {

    const truckStateColors: { [key in keyof typeof TruckStateEnum]?: string } = {
        OPEN: "green",
        LOADING: "blue",
        UNLOADING: "orange",
        PAUSE: "gray",
        LOAD_COMPLETED: "purple",
        UNLOAD_COMPLETED: "red",
    };

    const dcService = new DcService();
    const [page, setPage] = React.useState(1)
    const [VINRData, setVINRData] = useState<any>([])
    const [VOTRData, setVOTRData] = useState<any>([])
    const [activeKey, setActiveKey] = useState(Number)
    const [visible, setVisible] = useState(false);
    const [openFormData, setOpenFormData] = useState<any>('')
    const [isLodaing, setIsLoading] = useState(Boolean)
    const [form] = Form.useForm();
    const { Option } = Select
    const navigate = useNavigate();

    useEffect(() => {
        getVINRALL();
        getVOTRALL();
    }, []);

    const getVINRALL = () => {
        setIsLoading(true)
        dcService.getVINRALL()
            .then((res) => {
                if (res.status) {
                    setVINRData(res.data);
                    setIsLoading(false)
                } else {
                    setVINRData([]);
                    setIsLoading(false)
                }
            }).catch((err) => {
                setIsLoading(false)
                console.log(err);
            });
    };

    const getVOTRALL = () => {
        setIsLoading(true)
        dcService.getVOTRALL().then((res) => {
            if (res.status) {
                setVOTRData(res.data)
                setIsLoading(false)
            } else {
                setVOTRData([])
                setIsLoading(false)
            }
        }).catch((err) => {
            console.log(err);
            setIsLoading(false)
        })
    }

    const showDrawer = (rec) => {
        setOpenFormData(rec);
        form.setFieldsValue({ reqStatus: rec.reqStatus });
        setVisible(true);
    };

    const onCloseDrawer = () => {
        setVisible(false);
    };

    const updateVechileReqStatus = () => {
        form.validateFields().then((values) => {
            const payload = {
                id: Number(openFormData.id),
                reqStatus: values.reqStatus,
                ...(openFormData.readyToIn ? { readyToIn: openFormData.readyToIn } : { readyToSend: openFormData.readyToSend })
            };
            dcService.updateVechileReqStatus(payload).then((res) => {
                if (res.status) {
                    getVINRALL();
                    getVOTRALL();
                    onCloseDrawer();
                } else {
                    message.error(res.internalMessage);
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    };

    const columnsINR: any = [
        {
            title: "SNo",
            dataIndex: "sno",
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
        },
        {
            title: "Refernce Number",
            dataIndex: "refNumber",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Expected Arrival",
            dataIndex: "expectedArrival",
            align: "center",
            render: (text) => (text ? dayjs(text).format("YYYY-MM-DD") : '-'),
        },
        {
            title: "From",
            dataIndex: "from",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "To",
            dataIndex: "to",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "From Type",
            dataIndex: "fromType",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "To Type",
            dataIndex: "toType",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Ready To In",
            dataIndex: "readyToInData",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Status",
            dataIndex: "reqStatusData",
            align: "center",
            render: (rec) => {
                return (
                    <Tag style={{ fontSize: "15px" }} color={rec === "OPEN" ? "green" : "red"}>
                        {rec ? rec : '-'}
                    </Tag>
                );
            }
        },
        {
            title: "Actions",
            align: "center",
            render: (rec) => {
                const menu = (
                    <>
                        <Menu >
                            <Menu.Item
                                icon={<EyeOutlined style={{ color: "blue", fontSize: 20, marginRight: '8px' }}
                                    onClick={() => navigate(`/vehcile-entry-detailed-view?${rec.id}`, { state: rec })}
                                />}
                                key='1'
                            >
                                Detail View
                            </Menu.Item>

                            <Menu.Item
                                key='2'
                                icon={<EditOutlined style={{ fontSize: '24px', color: 'blue', marginRight: '8px', }} onClick={() => showDrawer(rec)} />}
                            >
                                Edit
                            </Menu.Item>
                        </Menu>
                    </>
                )
                return (
                    <span>
                        {/* 3-dots dropdown trigger */}
                        <Tooltip placement="top" title="Actions">
                            <Dropdown overlay={menu} trigger={['click']}>
                                <MoreOutlined style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }} />
                            </Dropdown>
                        </Tooltip>
                    </span>
                );
            },
        },
    ]

    const columnsVehicleRecords: any = [
        {
            title: "Vehicle No",
            dataIndex: "vehicleNo",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Driver Name",
            dataIndex: "dName",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Driver Contact",
            dataIndex: "dContact",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Vehicle Type",
            dataIndex: "vehicleType",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Status",
            align: "center",
            dataIndex: "vehicleStateRecords",
            render: (stateRecords) => {
                const latestState = stateRecords.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
                const enumKey = latestState?.vehicleTypeEnum || '-';
                const displayStatus = enumKey.replace(/_/g, " ")
                const tagColor = truckStateColors[enumKey] || "default";
                return (
                    <Tag color={tagColor} style={{ fontSize: "14px" }}>
                        {displayStatus}
                    </Tag>
                );
            },
        }

    ];

    const columnsOTR: any = [
        {
            title: "SNo",
            dataIndex: "sno",
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
        },
        {
            title: "Refernce Number",
            dataIndex: "refNumber",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Expected Departure",
            dataIndex: "expectedDeparture",
            align: "center",
            render: (text, rec) => (text ? dayjs(text).format('YYYY-MM-DD') : '-')
        },
        {
            title: "From",
            dataIndex: "from",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "To",
            dataIndex: "to",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "From Type",
            dataIndex: "fromType",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "To Type",
            dataIndex: "toType",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Ready To Send",
            dataIndex: "readyToSendData",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Status",
            dataIndex: "reqStatusData",
            align: "center",
            render: (rec) => {
                return (
                    <Tag style={{ fontSize: "15px" }} color={rec === "OPEN" ? "green" : "red"}>
                        {rec ? rec : '-'}
                    </Tag>
                );
            }
        },
        {
            title: "Actions",
            align: "center",
            render: (rec) => {
                const menu = (
                    <>
                        <Menu >
                            <Menu.Item icon={<EyeOutlined style={{ color: "blue", fontSize: 20, marginRight: '8px' }} onClick={() => navigate(`/vehcile-entry-detailed-view?${rec.id}`, { state: rec })} />} key='1' >
                                Detail View
                            </Menu.Item>

                            <Menu.Item key='2' icon={<EditOutlined style={{ fontSize: '24px', color: 'blue', marginRight: '8px', }} onClick={() => showDrawer(rec)} />}  >
                                Edit
                            </Menu.Item>
                        </Menu>
                    </>
                )
                return (
                    <span>
                        {/* 3-dots dropdown trigger */}
                        <Tooltip placement="top" title="Actions">
                            <Dropdown overlay={menu} trigger={['click']}>
                                <MoreOutlined style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }} />
                            </Dropdown>
                        </Tooltip>
                    </span>
                );
            },
        },
    ]

    const onChangeTabs = (key) => {
        setActiveKey(key);
        if (key === "1") {
            getVINRALL();
        } else if (key === "2") {
            getVOTRALL();
        }
    };

    return (
        <>
            <Card title={<><CarOutlined style={{ fontSize: '24px', marginRight: 8, color: "white" }} /><span style={{ color: 'white' }}>Vehicle Entry</span></>} headStyle={{ backgroundColor: '#047595', color: 'black' }} >

                <Tabs defaultActiveKey="1" tabBarStyle={{ display: 'flex', justifyContent: 'center' }} onChange={onChangeTabs}>

                    <TabPane tab={<><ArrowDownOutlined style={{ fontSize: '20px', color: '#016582', marginRight: 8 }} /><span style={{ fontSize: "0.9rem" }}>Vehicle IN</span></>} key='1'>

                        <Table columns={columnsINR} dataSource={VINRData} bordered loading={isLodaing}
                            rowKey={(record, index) => index}

                            pagination={{
                                onChange: (page) => { setPage(page); }
                            }}

                            expandable={{
                                expandedRowRender: (record) => {
                                    if (!record.vehicleRecords || record.vehicleRecords.length === 0) {
                                        return <Empty />
                                    }
                                    return (
                                        <Table
                                            rowKey={(record, index) => index}
                                            columns={columnsVehicleRecords}
                                            dataSource={record.vehicleRecords}
                                            pagination={false}
                                            bordered
                                        />
                                    );
                                },
                                rowExpandable: (record) => record.vehicleRecords && record.vehicleRecords.length > 0,
                                expandIcon: ({ expanded, onExpand, record }) => (
                                    expanded ? (
                                        <UpCircleOutlined
                                            onClick={(e) => onExpand(record, e)}
                                            style={{ color: '#ed6f15', fontSize: "1.2rem" }}
                                        />
                                    ) : (
                                        <DownCircleOutlined
                                            onClick={(e) => onExpand(record, e)}
                                            style={{ color: '#ed6f15', fontSize: "1.2rem" }}
                                        />
                                    )
                                )
                            }}

                            components={{
                                header: {
                                    cell: ({ children, ...rest }) => (
                                        <th {...rest} style={{ backgroundColor: "#047595", color: "white", fontWeight: "bold", textAlign: "center", padding: "10px", }} >
                                            {children}
                                        </th>
                                    ),
                                },
                            }}
                        />

                    </TabPane>

                    <TabPane tab={<><ArrowUpOutlined style={{ fontSize: '20px', color: '#016582', marginRight: 8 }} /><span style={{ fontSize: "0.9rem" }}>Vehicle OUT</span></>} key='2'>

                        <Table columns={columnsOTR} dataSource={VOTRData} bordered loading={isLodaing}
                            rowKey={(record, index) => index}

                            pagination={{
                                onChange: (page) => { setPage(page); }
                            }}

                            expandable={{
                                expandedRowRender: (record) => {
                                    if (!record.vehicleRecords || record.vehicleRecords.length === 0) {
                                        return <Empty />
                                    }
                                    return (
                                        <Table
                                            columns={columnsVehicleRecords}
                                            dataSource={record.vehicleRecords}
                                            pagination={false}
                                            bordered
                                            rowKey={(record, index) => index}
                                        />
                                    );
                                },
                                rowExpandable: (record) => record.vehicleRecords && record.vehicleRecords.length > 0,
                                expandIcon: ({ expanded, onExpand, record }) => (
                                    expanded ? (
                                        <UpCircleOutlined
                                            onClick={(e) => onExpand(record, e)}
                                            style={{ color: '#ed6f15', fontSize: "1.2rem" }}
                                        />
                                    ) : (
                                        <DownCircleOutlined
                                            onClick={(e) => onExpand(record, e)}
                                            style={{ color: '#ed6f15', fontSize: "1.2rem" }}
                                        />
                                    )
                                )
                            }}

                            components={{
                                header: {
                                    cell: ({ children, ...rest }) => (
                                        <th  {...rest} style={{ backgroundColor: "#047595", color: "white", fontWeight: "bold", textAlign: "center", padding: "10px", }}>
                                            {children}
                                        </th>
                                    ),
                                },
                            }}
                        />

                    </TabPane>

                </Tabs>

                <Drawer title="Update Status" placement="right" key={Date.now()} closable={false} onClose={onCloseDrawer} open={visible} width={400}>
                    <Form form={form} layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="reqStatus" label="Status" rules={[{ required: true, message: "Please select a status" }]}>
                                    <Select placeholder="Select Status">
                                        {Object.entries(ReqStatus).filter(([key, value]) => isNaN(Number(key))).map(([key, value]) => (
                                            <Option key={value} value={value}>
                                                {key}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                            </Col>
                        </Row>
                        <Button type="primary" onClick={updateVechileReqStatus}>
                            Update
                        </Button>
                        <Button type="default" danger onClick={onCloseDrawer} style={{ marginLeft: "10px" }}>
                            Close
                        </Button>
                    </Form>
                </Drawer>

            </Card>
        </>
    )
}
export default VehcileEntry