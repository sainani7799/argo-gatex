import { CheckOutlined, EyeOutlined, LockOutlined, MoreOutlined, RightOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Drawer, Dropdown, Form, Input, Menu, Popconfirm, Row, Select, Switch, Table, Tag, Tooltip, message } from "antd";
import { AcceptableEnum, DcEmailModel, ReceivedDcReq, StatusEnum } from "libs/shared-models";
import { DcService, EmailService } from "libs/shared-services";
import moment from "moment";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Highlighter from 'react-highlight-words';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Option } = Select;


const DCReceived = () => {

    const [form] = Form.useForm();
    const [responseData, setResponseData] = useState<any>([]);
    const authdata = JSON.parse(localStorage.getItem('userName'));
    const [page, setPage] = React.useState(1);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const searchInput = useRef(null);
    const service = new DcService()
    const mailService = new EmailService()


    let navigate = useNavigate();
    useEffect(() => {
        getReceivedGatePassData()
    }, [])

    const getReceivedGatePassData = () => {
        const unitValue = authdata?.unitId;
        const req = { unitId: unitValue };
        console.log(req)
        service.getIntransAndCompleteGatePass(req).then((res: any) => {
            if (res.status) {
                setResponseData(res.data);
            }
        });
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ backgroundColor: "#047595", color: "white", width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button size="small" style={{ width: 90 }}
                    onClick={() => {
                        handleReset(clearFilters)
                        setSearchedColumn(dataIndex);
                        confirm({ closeDropdown: true });
                    }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search" style={{ color: filtered ? 'white' : "white" }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) { setTimeout(() => searchInput.current.select()); }
        },
        render: text =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : text
            )
                : null
    });

    const receivedDc = (rowData) => {
        const date = new Date();
        const authdata = JSON.parse(localStorage.getItem('userName'))
        console.log(rowData, 'rowData')
        // const status = rowData.returnable ==='N' ? StatusEnum.CLOSED : StatusEnum.RECEIVED
        let status
        let returnedDate = null;
        let receivedDate = null;
        if (rowData.status === StatusEnum.READY_TO_RE_RECIEVE) {
            status = StatusEnum.RETURNED;
            returnedDate = String(date);
            console.log(returnedDate, 'rettt')
            sendDcMailForGatePass(rowData.emailId, rowData.dcNumber, rowData.created_user, rowData.dcId, rowData.fromUnit, rowData.toAddresserName)
        } else {
            status = rowData.returnable === 'N' ? StatusEnum.CLOSED : StatusEnum.RECEIVED;
            receivedDate = String(date)
        }
        console.log('Final Received Date:', receivedDate);
        console.log('Final Returned Date:', returnedDate);

        const dto = new ReceivedDcReq(rowData.dcId, AcceptableEnum.YES, status,
            authdata?.userName,
            receivedDate,
            returnedDate
        )
        console.log(dto, 'dto')
        // dto.logAllProperties()
        service.receivedDc(dto).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                setDrawerVisible(false);
                getReceivedGatePassData()
            } else {
                message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }

    async function sendDcMailForGatePass(email, dcNumber, createdUser, dcId, fromUnit, toUnit) {
        console.log(email, 'email')
        const dcDetails = new DcEmailModel();
        dcDetails.dcNo = dcNumber
        dcDetails.to = email
        // dcDetails.to = 'kushal.siddegowda@shahi.co.in'
        dcDetails.html = `
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            #acceptDcLink {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #28a745;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 10px;
                  transition: background-color 0.3s ease, color 0.3s ease;
                  cursor: pointer;
              }
      
              #acceptDcLink.accepted {
                  background-color: #6c757d;
                  cursor: not-allowed;
              }
      
              #acceptDcLink:hover {
                  background-color: #218838;
                  color: #fff;
              }
          </style>
        </head>
        <body>
          <p>Dear team,</p>
          <p>Please find the Returned Gate Pass details below:</p>
          <p>DC NO: ${dcNumber} </p>
            Some items Returned from Address: ${fromUnit} to
            Address: ${toUnit}
          <p>Please click the link below for details:</p>
          <input type="hidden" id="assignBy" value=${form.getFieldValue('assignBy')} /> 
          <input type="hidden" id="dcId" value=${dcId} />
      
          <a
            href="https://gatex.schemaxtech.in/#/dc-email-detail-view/${dcId}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            "
            >View Details of GatePass</a
            >
        </body>
      </html>
      `
        dcDetails.subject = "Gate Pass : " + dcNumber
        const res = await mailService.sendDcMail(dcDetails)
        console.log(res)
        if (res.status == 201) {
            if (res.data.status) {
                message.success("Mail sent successfully")
                // mailerSent = true;
            } else {
                message.success("Mail sent successfully")
            }
        } else {
            message.success("Mail  sent successfully")
        }
    }


    const columnsSkelton: any = [
        {
            title: 'S No',
            key: 'sno',
            width: 60,
            responsive: ['sm'],
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: "DC Number",
            dataIndex: "dcNumber",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('dcNumber')
        },
        {
            title: "DC Type",
            dataIndex: "dcType",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('dcType')
        },
        {
            title: "From Unit",
            dataIndex: "fromUnit",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "To Unit",
            dataIndex: "toAddresserName",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Requested By",
            dataIndex: "requestedBy",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Attention Person",
            dataIndex: "attentionPerson",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Received By",
            dataIndex: "receivedBy",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Received Date",
            dataIndex: "receivedDate",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (val, rec) => {
                return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-'
            }
        },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (text, record) => {
                const createdDate = record.createdDate;
                if (createdDate) {
                    return moment(createdDate).format('DD-MM-YYYY');
                } else {
                    return '-';
                }
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            width:200,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (status) => {
                // Define the color based on the status value
                const color = status === "RECEIVED"
                    ? "#3c763d" // Green for RECEIVED
                    : status === "PENDING"
                        ? "#f0ad4e" // Orange for PENDING
                        : "#a94442";

                const tagStyle: React.CSSProperties = {
                    backgroundColor: color,
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '4px 12px',
                    textTransform: 'capitalize',

                };

                return (
                    <Tag style={tagStyle}>
                        {status.replace(/ /g, ' ')}
                    </Tag>
                );
            },
        },

        {
            title: 'Action',
            dataIndex: 'requestNumber',
            fixed: "right",
            width: 70,
            outerWidth: '4px',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: "center",
            render: (text, rowData, index) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="1" icon={<EyeOutlined />} onClick={() => {
                            console.log(rowData.dcId);
                            navigate(`/dc-detail-view/${rowData.dcId}`, { state: rowData.dcId })
                        }}>
                            Detail View
                        </Menu.Item>
                        {rowData.received_dc === 'NO' || rowData.status === StatusEnum.READY_TO_RE_RECIEVE ? (
                            <Menu.Item key="2" icon={<RightSquareOutlined />} onClick={() => receivedDc(rowData)}>
                                Receive DC
                            </Menu.Item>
                        ) : (
                            <Menu.Item key="3" icon={<CheckOutlined />} disabled>
                                DC Received
                            </Menu.Item>
                        )}
                    </Menu>
                );

                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button
                            type="text"
                            icon={<MoreOutlined style={{ fontSize: 20, color: "#1890ff" }} />}
                        />
                    </Dropdown>
                );

            },
        },

    ];
    console.log(responseData)
    return (
        <Card
            title={<span style={{ color: "white" }}>
                <LockOutlined style={{ fontSize: '24px', color: 'white', marginRight: '8px' }} />

                Received GatePass's
            </span>
            }


            headStyle={{ backgroundColor: '#047595', color: 'black' }}>

            <Table columns={columnsSkelton} dataSource={responseData.filter(
                (item) => item.status === 'READY TO RECEIVE' || item.status === 'RECEIVED' || item.status === StatusEnum.READY_TO_RE_RECIEVE || item.status === StatusEnum.RETURNED
            )}
                scroll={{ x: 1400, y: 400 }} />
            <Drawer styles={{ body: { paddingBottom: '80' } }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
                onClose={closeDrawer} open={drawerVisible} closable={true}>
                <Card headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }} size='small'>
                    <Form
                        form={form}
                        layout='vertical'
                        style={{ width: '100%', margin: '0px auto 0px auto' }}
                    // onFinish={update}
                    >
                        <Row gutter={24}>
                            <Form.Item name="dcId" label="Dc Id"
                                rules={[
                                    { required: true },
                                ]}
                                style={{ display: 'none' }}
                            >
                                <Input hidden />
                            </Form.Item>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} >
                                <Form.Item name="dcNumber" label="Dc Number"
                                    rules={[
                                        { required: true },
                                    ]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} >
                                <Form.Item name="fromUnit" label="From Unit"
                                    rules={[
                                        { required: true },
                                    ]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} >
                                <Form.Item name="toAddresserName" label="To Addresser"
                                    rules={[
                                        { required: true },
                                    ]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>

                            {/* <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} >

                                <Form.Item name="assignBy" label="Approval User"
                                    rules={[
                                        { required: true },
                                    ]}>
                                    <Select
                                        showSearch
                                        placeholder="Select User "
                                        optionFilterProp="children"
                                        allowClear
                                        onChange={getAllApprovalIdUser}
                                    >
                                        {user.map(u => {
                                            return (
                                                <Option key={u.approvalUserId} value={u.approvalUserId}>
                                                    {u.approvalUser}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col> */}
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} >
                                <Form.Item name="emailId" label="Email Id"
                                    rules={[
                                        { required: true },
                                    ]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form>
                </Card>
            </Drawer>


        </Card>
    );
}
export default DCReceived
