import { CheckOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, LockOutlined, MoreOutlined, RightOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Switch, Divider, Drawer, Select, Tag, Dropdown, Menu } from 'antd';
import { AddressService, ApprovalUserService, DcService, EmailService, } from '@gatex/shared-services';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words'
import { AcceptReq, AcceptableEnum, ApprovalIdReq, AssignReq, CreateAddressDto, DcEmailModel, DcReq, RejectDcReq, StatusEnum, UnitReq } from '@gatex/shared-models';
import DCForm from './dc-form';
import moment from 'moment';
const { Option } = Select;

const DCApprovalGrid = () => {
    const [form] = Form.useForm();
    const [responseData, setResponseData] = useState<any>([]);
    const service = new DcService();
    const approvalService = new ApprovalUserService()
    const [page, setPage] = React.useState(1);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(undefined);
    const [mailLoading, setMailLoading] = useState<boolean>(false);
    const authdata = JSON.parse(localStorage.getItem('userName'))
    const [user, setUser] = useState<any>([]);
    const searchInput = useRef(null);
    const mailService = new EmailService()
    const [pageSize, setPageSize] = React.useState(10);

    console.log(authdata, 'authdataauthdata')

    let navigate = useNavigate();

    useEffect(() => {
        getGatePassData();
        getAllApprovalUser();
    }, []);



    const acceptDc = (rec) => {
        console.log(rec)
        const email = rec.emailId
        const dcNumber = rec.dcNumber
        console.log(email, 'email')
        const approvedBy = authdata?.userName
        const currentDate = new Date();
        const approvedDate = moment(currentDate).format('YYYY-MM-DD')
        const fromUnit = rec.fromUnit
        const toUnit = rec.toAddresserName
        const dcId = rec.dcId
        const status = 'Approved ✅'

        sendDcMailForGatePass(email, dcNumber, approvedDate, approvedBy, fromUnit, toUnit, dcId, status)

        const dto: AcceptReq = {
            isAccepted: AcceptableEnum.YES,
            acceptedUser: authdata?.employeeId,
            dcId: Number(rec.dcId),
            status: StatusEnum.SENT_FOR_SECURITY_CHECK,
        };
        console.log(dto);

        service.acceptDc(dto).then(res => {
            if (res.status) {
                message.success('DC Accept Successfully');
                getGatePassData()
            } else {
                // message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        });
    };

    const rejectDc = (rec) => {
        console.log(rec)
        const email = rec.emailId
        const dcNumber = rec.dcNumber
        console.log(email, 'email')
        const approvedBy = authdata?.userName
        const currentDate = new Date();
        const approvedDate = moment(currentDate).format('YYYY-MM-DD')
        const fromUnit = rec.fromUnit
        const toUnit = rec.toAddresserName
        const dcId = rec.dcId
        const status = 'Rejected ❌'

        sendDcMailForGatePass(email, dcNumber, approvedDate, approvedBy, fromUnit, toUnit, dcId, status)
        const dto: RejectDcReq = {
            dcId: Number(rec.dcId),
            isAccepted: AcceptableEnum.REJECT,
            acceptedUser: authdata.employeeId,
            status: StatusEnum.REJECTED,
        };
        // console.log(dto);
        service.rejectDc(dto).then(res => {
            if (res.status) {
                message.success('DC Rejected Successfully');
                getGatePassData()
            } else {
                // message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        });
    };

    const getGatePassData = () => {
        const unitValue = authdata?.unitId;
        const req = { unitId: unitValue };
        service.getAllGatePass(req).then((res: any) => {
            if (res.status) {
                setResponseData(res.data);
            }
        });
    };

    const getAllApprovalUser = () => {
        approvalService.getAllApprovalUser().then((res: any) => {
            if (res.status) {
                setUser(res.data)

            }
        })
    }

    const getAllApprovalIdUser = () => {
        const req = new ApprovalIdReq()
        req.approvedUserId = form.getFieldValue('assignBy')
        console.log(req)
        approvalService.getAllApprovalIdUser(req).then((res: any) => {
            if (res.status) {
                form.setFieldValue('emailId', res.data[0]?.emailId)

            }
        })
    }


    const update = (dto: AssignReq) => {
        const authdata = JSON.parse(localStorage.getItem('userName'))
        dto.updatedUser = authdata?.userName,
            dto.status = StatusEnum.SENT_FOR_APPROVAL,
            dto.isAssignable = AcceptableEnum.YES,
            dto.assignBy = form.getFieldValue('assignBy')
        dto.emailId = form.getFieldValue('emailId')
        dto.dcId = form.getFieldValue('dcId')
        console.log(dto)
        service.updateDc(dto).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                // sendDcMailForGatePass()
                setDrawerVisible(false);
                getGatePassData()
            } else {
                message.error(res.internalMessage);

            }
        }).catch(err => {
            message.error(err.message);
        })
    }

    let mailerSent = false;
    async function sendDcMailForGatePass(email, dcNumber, approvedDate, approvedBy, fromUnit, toUnit, dcId, status) {
        const dcDetails = new DcEmailModel();
        // dcDetails.to = form.getFieldValue('emailId');
        dcDetails.to = email;
        // dcDetails.to = 'kushal.siddegowda@shahi.co.in';
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
          <p>Dear User,</p>
          <p>Please find ${status} the Gate Pass details below:</p>
          <p>DC NO: ${dcNumber}</p>
          <p>
            Some items moved from Address: ${fromUnit} to
            Address: ${toUnit}
          </p>
          ${status === 'Approved ✅' ? `
            <p>Approved By: ${approvedBy}</p>
            <p>Approved Date: ${approvedDate}</p>
          ` : `
            <p>Rejected By: ${approvedBy}</p>
            <p>Rejected Date: ${approvedDate}</p>
          `}
          <p>Please click the link below for details:</p>
      
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
                mailerSent = true;
            } else {
                message.success("Mail sent successfully")
            }
        } else {
            message.success("Mail  sent successfully")
        }
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const openFormWithData = (viewData: CreateAddressDto) => {
        setDrawerVisible(true);
        setSelectedAddress(viewData);
    }
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
    })


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
            title: "To Unit/Supplier/Buyer",
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
        // {
        //     title: "created User",
        //     dataIndex: "created_user"
        // },
        {
            title: "Created On",
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
            fixed: 'right',
            width: 200,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },

            }),
            render: (status) => {
                let color = 'default';
                if (status === 'OPEN') color = 'gray';
                if (status === 'ASSIGN TO APPROVAL') color = 'blue';
                if (status === 'SENT FOR APPROVAL') color = 'blue';
                if (status === 'CANCELED') color = 'red';
                if (status === 'REJECTED') color = 'red';
                if (status === 'SENT FOR SECURITY CHECK') color = 'orange';
                if (status === 'READY TO RECEIVE') color = 'green';
                if (status === 'SENT FOR SECURITY RE CHECK') color = 'orange';
                if (status === 'RECEIVED') color = 'green';
                if (status === 'RETURNED') color = 'green';
                if (status === 'READY TO RETURN') color = 'yellow';
                if (status === 'NOT RETURNED') color = 'red';
                if (status === 'CLOSED') color = 'gray';
                if (status === 'SENT FOR SECURITY CHECK IN') color = 'orange';
                if (status === 'SENT FOR SECURITY RE CHECK IN') color = 'orange';


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
            align: "center",
            fixed: "right",
            width: 70,
            outerWidth: '4px',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (text, rowData, index) => (
                <span>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="1">
                                    <Tooltip placement="top" title="Detail View">
                                    <div style={{ display: 'flex', alignItems: 'center',cursor: 'pointer' }}
                                    onClick={() => {
                                        console.log(rowData.dcId);
                                        navigate(`/dc-detail-view/${rowData.dcId}`)
                                    }}>
                                        <EyeOutlined
                                            style={{ color: "blue", fontSize: 20,marginRight: '8px' }}
                                        />
                                        <span>Detail View</span>
                                    </div>
                                    </Tooltip>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Popconfirm title="Are you sure to accept dc?"
                                        onConfirm={() => acceptDc(rowData)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="primary" size="small">Accept</Button>
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Popconfirm title="Are you sure to reject dc?"
                                        onConfirm={() => rejectDc(rowData)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button size="small">Reject</Button>
                                    </Popconfirm>
                                </Menu.Item>
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined style={{ fontSize: 20, color: "#1890ff" }} />}
                        />
                    </Dropdown>
                </span>
            ),
        }

    ];

    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    }


    return (
        <Card
            title={<span style={{ color: "white" }}>
                <LockOutlined style={{ fontSize: '24px', color: 'white', marginRight: '8px' }} />
                Gate Pass Approval
            </span>
            }
            headStyle={{ backgroundColor: '#047595', color: 'black' }}>

            <Table columns={columnsSkelton} dataSource={responseData.filter(item => item.status === "SENT FOR APPROVAL")}   pagination={{
                    current: page,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }
                }}
                onChange={onChange}
                scroll={{ x: 1400, y: 400 }} />
            <Drawer styles={{ body: { paddingBottom: '80' } }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
                onClose={closeDrawer} open={drawerVisible} closable={true}>
                <Card headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }} size='small'>
                    <Form
                        form={form}
                        layout='vertical'
                        style={{ width: '100%', margin: '0px auto 0px auto' }}
                        onFinish={update}
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

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} >

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
                            </Col>
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
};

export default DCApprovalGrid;