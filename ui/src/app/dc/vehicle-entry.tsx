import { ArrowDownOutlined, ArrowUpOutlined, CarOutlined, DownCircleOutlined, EditOutlined, EyeOutlined, MinusCircleOutlined, MoreOutlined, PlusCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Drawer, Dropdown, Empty, Form, Input, Menu, message, Row, Select, Table, Tabs, Tag, Tooltip } from "antd";
import TabPane from 'antd/es/tabs/TabPane';
import dayjs from "dayjs";
import { ReqStatus, TruckStateEnum, VehicleTypeEnum } from "libs/shared-models";
import { VHRServices } from "libs/shared-services";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SequenceUtils } from "../common";

const VehcileEntry = () => {

    const truckStateColors: { [key in keyof typeof TruckStateEnum]?: string } = {
        OPEN: "green",
        LOADING: "blue",
        UNLOADING: "orange",
        PAUSE: "gray",
        LOAD_COMPLETED: "purple",
        UNLOAD_COMPLETED: "red",
        CLOSED: "blue"
    };

    const vhrService = new VHRServices();
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
    const user = JSON.parse(localStorage.getItem('userName'));
    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {
        getVINRALL();
        getVOTRALL();
    }, []);

    const getVINRALL = () => {
        setIsLoading(true)
        vhrService.getVINRALL()
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
        vhrService.getVOTRALL().then((res) => {
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
        // form.setFieldsValue({ reqStatus: rec.reqStatus });
        setVisible(true);
        form.resetFields(); // Reset all form fields
        form.setFieldsValue({ vehicleRecords: [{}] });
    };

    const onCloseDrawer = () => {
        setVisible(false);
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
            render: (rec) => (rec ? rec : '-'),
            filteredValue: [String(searchedText).toLowerCase()],
            onFilter: (value, record) => {
                return SequenceUtils.globalFilter(value, record)
            }
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
                            <Tooltip title='Detail View' placement="rightTop"  >
                                <Menu.Item key='1'
                                    icon={<EyeOutlined style={{ color: "blue", fontSize: 20 }} onClick={() => navigate(`/vehcile-entry-detailed-view?${rec.id}`, { state: rec })} />} >
                                </Menu.Item>
                            </Tooltip>

                            <Tooltip title='Edit' placement="rightTop" >
                                <Menu.Item key='2'
                                    icon={<EditOutlined style={{ fontSize: '24px', color: 'blue' }} onClick={() => showDrawer(rec)} />}
                                >
                                </Menu.Item>
                            </Tooltip>
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
            render: (rec) => (rec ? rec : '-'),
            filteredValue: [String(searchedText).toLowerCase()],
            onFilter: (value, record) => {
                return SequenceUtils.globalFilter(value, record)
            }
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
                            <Tooltip title='Detail View' placement="rightTop"  >
                                <Menu.Item key='1'
                                    icon={<EyeOutlined style={{ color: "blue", fontSize: 20 }} onClick={() => navigate(`/vehcile-entry-detailed-view?${rec.id}`, { state: rec })} />} >
                                </Menu.Item>
                            </Tooltip>

                            <Tooltip title='Edit' placement="rightTop" >
                                <Menu.Item key='2'
                                    icon={<EditOutlined style={{ fontSize: '24px', color: 'blue' }} onClick={() => showDrawer(rec)} />}
                                >
                                </Menu.Item>
                            </Tooltip>
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
        setSearchedText('')
        setActiveKey(key);
        if (key === "1") {
            getVINRALL();
        } else if (key === "2") {
            getVOTRALL();
        }
    };

    const onFinish = (values) => {
        const payload = values.vehicleRecords.map((vehicle) => ({
            ...vehicle,
            id: openFormData.id,
            readyToIn: openFormData.readyToIn,
            readyToSend: openFormData.readyToSend,
            unitCode: user.unitCode,
            companyCode: user.companyCode,
            userId: 0
        }));
        vhrService.createVehicle(payload).then((res) => {
            if (res.status) {
                onCloseDrawer();
                getVINRALL();
                getVOTRALL();
            } else {
                message.error(res.internalMessage);
            }
        }).catch((err) => {
            console.error("API Error:", err);
        });
    };



    return (
        <>
            <Card
                title={<><CarOutlined style={{ fontSize: '24px', marginRight: 8, color: "white" }} /><span style={{ color: 'white' }}>Vehicle Entry</span></>} headStyle={{ backgroundColor: '#047595', color: 'black' }}
                extra={<Input.Search
                    placeholder="Search"
                    value={searchedText}
                    allowClear
                    onChange={(e) => { setSearchedText(e.target.value) }}
                    onSearch={(value) => { setSearchedText(value) }}
                    style={{ width: 200, float: "right" }}
                />
                }
            >

                <Tabs

                    defaultActiveKey="1" tabBarStyle={{ display: 'flex', justifyContent: 'center' }} onChange={onChangeTabs}>

                    <TabPane
                     tab={<><ArrowDownOutlined style={{ fontSize: '20px', color: '#016582', marginRight: 8 }} /><span style={{ fontSize: "0.9rem" }}>Vehicle IN</span></>} key='1'>

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
                                        <Card>
                                        <Table
                                            rowKey={(record, index) => index}
                                            columns={columnsVehicleRecords}
                                            dataSource={record.vehicleRecords}
                                            pagination={false}
                                            bordered
                                        />
                                        </Card>
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
                                        <Card>
                                        <Table
                                            columns={columnsVehicleRecords}
                                            dataSource={record.vehicleRecords}
                                            pagination={false}
                                            bordered
                                            rowKey={(record, index) => index}
                                        />
                                        </Card>
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

                <Drawer title="Create Vehicle" placement="right" key={Date.now()} closable={false} onClose={onCloseDrawer} open={visible} width={1200}>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.List name="vehicleRecords" initialValue={[{}]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <>
                                            <Card key={key} style={{ width: '100%', padding: "10px" }}>
                                                <Row gutter={16} style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center" }}>
                                                    <Col span={4}>
                                                        <Form.Item {...restField} label={<strong>Vehicle No</strong>} name={[name, 'vehicleNo']}>
                                                            <Input placeholder="Enter Vehicle No" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item {...restField} label={<strong>Driver Name</strong>} name={[name, 'dName']}>
                                                            <Input placeholder="Enter Driver Name" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item {...restField} label={<strong>Driver Contact</strong>} name={[name, 'dContact']}>
                                                            <Input placeholder="Enter Driver Contact" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item {...restField} label={<strong>Vehicle Type</strong>} name={[name, 'vehicleType']}>
                                                            <Select placeholder="Select Vehicle Type">
                                                                {Object.entries(VehicleTypeEnum).filter(([key, value]) => isNaN(Number(key))).map(([key, value]) => (
                                                                    <Option key={value} value={value}>
                                                                        {key}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item {...restField} label={<strong>Status</strong>} name={[name, 'vState']}>
                                                            <Select placeholder="Select Status">
                                                                {Object.entries(ReqStatus).filter(([key, value]) => isNaN(Number(key))).map(([key, value]) => (
                                                                    <Option key={value} value={value}>
                                                                        {key}
                                                                    </Option>
                                                                ))}
                                                            </Select>

                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={1}>
                                                        <Button icon={<PlusCircleOutlined />} type="primary" style={{ marginTop: '25px' }} onClick={() => add({})} />
                                                    </Col >
                                                    {fields.length > 1 && (
                                                        <Col span={1}>
                                                            <Button icon={<MinusCircleOutlined />} type="default" danger style={{ marginTop: '25px' }} onClick={() => remove(name)} />
                                                        </Col>
                                                    )}
                                                </Row>
                                            </Card>
                                            <br />
                                        </>
                                    ))}
                                </>
                            )}
                        </Form.List>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        <Button type="default" danger onClick={onCloseDrawer} style={{ marginLeft: "10px" }}>Close</Button>
                    </Form>
                </Drawer>


            </Card>
        </>
    )
}
export default VehcileEntry