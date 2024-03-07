import { CheckOutlined, EditOutlined, EyeOutlined, RightOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Switch, Divider, Drawer, Select } from 'antd';
import { AddressService, ApprovalUserService, DcService, EmailService, } from 'libs/shared-services';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words'
import { AcceptReq, AcceptableEnum, ApprovalIdReq, AssignReq, CreateAddressDto, DcEmailModel, DcReq, RejectDcReq, StatusEnum, UnitReq } from 'libs/shared-models';
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
    

    let navigate = useNavigate();
    
    useEffect(() => {
        getGatePassData();
        getAllApprovalUser();
    }, []);



    const acceptDc = (rec) => {
        console.log(rec)
        const dto: AcceptReq = {
            isAccepted: AcceptableEnum.YES,
            acceptedUser: authdata.employeeId,
            dcId: Number(rec.dcId),
            status: StatusEnum.SENT_FOR_SECURITY_CHECK,
        };
        // console.log(dto);
        service.acceptDc(dto).then(res => {
            if (res.status) {
                message.success('User Accept Successfully');
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
        const unitValue = authdata.unitId;
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
        dto.updatedUser = authdata.userName,
            dto.status = StatusEnum.SENT_FOR_APPROVAL,
            dto.isAssignable = AcceptableEnum.YES,
            dto.assignBy = form.getFieldValue('assignBy')
        dto.emailId = form.getFieldValue('emailId')
        dto.dcId = form.getFieldValue('dcId')
        console.log(dto)
        service.updateDc(dto).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                sendDcMailForGatePass()
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
    async function sendDcMailForGatePass() {
        const dcDetails = new DcEmailModel();
        dcDetails.dcNo = form.getFieldValue('dcNumber');
        dcDetails.to = form.getFieldValue('emailId');
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
          <p>Please find the Gate Pass details below:</p>
          <p>DC NO: ${form.getFieldValue('dcNumber')}</p>
          <p>
            Some items moved from Address: ${form.getFieldValue('fromUnit')} to
            Address: ${form.getFieldValue('toAddresserName')}
          </p>
          <p>Please click the link below for details:</p>
          <input type="hidden" id="assignBy" value=${form.getFieldValue('assignBy')} /> 
          <input type="hidden" id="dcId" value=${form.getFieldValue('dcId')} />
      
          <a
            href="http://gpdc.seplcloud.com/#/dc-email-detail-view/${form.getFieldValue('dcId')}"
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
          <a
          href="http://gpdc.seplcloud.com/#/dc-email/${form.getFieldValue('dcId')}"
          style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #108f1a;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          "
          >Accept DC</a
        >
        <a
          href="http://gpdc.seplcloud.com/#/dc-reject-mail/${form.getFieldValue('dcId')}"
          style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff001e;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          "
          >Reject DC</a
        >
        </body>
      </html>
      `
        dcDetails.subject = "Gate Pass : " + form.getFieldValue('dcNumber')
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
            message.success("Mail also sent successfully")
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
                    style={{ width: 90, marginRight: 8 }}
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
            <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
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
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: "DC Number",
            dataIndex: "dcNumber",
            ...getColumnSearchProps('dcNumber')
        },
        {
            title: "Returnable",
            dataIndex: "returnable",
            ...getColumnSearchProps('returnable')
        },
        {
            title: "From Unit",
            dataIndex: "fromUnit"
        },
        {
            title: "To Unit/Supplier/Buyer",
            dataIndex: "toAddresserName"
        },
        {
            title: "Requested By",
            dataIndex: "requestedBy"
        },
        {
            title: "Attention Person",
            dataIndex: "attentionPerson"
        },
        // {
        //     title: "created User",
        //     dataIndex: "created_user"
        // },
        {
            title: "Created Date",
            dataIndex: "createdDate",
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
        },
        {
            title: 'Action',
            dataIndex: 'requestNumber',
            align: "center",
            render: (text, rowData, index) => (
                <span>
                    <Tooltip placement="top" title="Detail View">
                        <EyeOutlined
                            onClick={() => {
                                console.log(rowData.dcId);
                                navigate(`/dc-detail-view/${rowData.dcId}`)
                            }}
                            style={{ color: "blue", fontSize: 20 }}
                        />
                        <Divider type='vertical' />
                    </Tooltip>
                    <Popconfirm title="Are you sure to accept dc?"
          onConfirm={() => acceptDc(rowData)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Accept</Button></Popconfirm><Divider type='vertical' />
          <Popconfirm title="Are you sure to reject dc?"
          onConfirm={() => rejectDc(rowData)}
          okText="Yes"
          cancelText="No"
        >
          <Button >Reject</Button></Popconfirm>
                    {/* <Button type="primary" onClick={() => acceptDc(rowData)}>Accept</Button> */}
                    {/* <Button  onClick={() => rejectDc(rowData)}>Reject</Button> */}
                </span>
            ),

        },

    ];



    return (
        <Card
            title={<span style={{ color: "white" }}>Gate Pass Approval</span>}
            headStyle={{ backgroundColor: '#7d33a2', color: 'black' }}>

            <Table columns={columnsSkelton} dataSource={responseData.filter(item => item.status === "SENT FOR APPROVAL")}
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