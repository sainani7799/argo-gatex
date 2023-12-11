import { CheckOutlined, EditOutlined, EyeOutlined, RightOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Switch, Divider, Drawer, Select } from 'antd';
import { AddressService, ApprovalUserService, DcService } from 'libs/shared-services';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words'
import { AcceptableEnum, ApprovalIdReq, AssignReq, CreateAddressDto, DcReq, StatusEnum } from 'libs/shared-models';
import DCForm from './dc-form';
import moment from 'moment';
const { Option } = Select;

const DCGrid = () => {
    const [form] = Form.useForm();
    const [responseData, setResponseData] = useState<any>([]);
    const service = new DcService();
    const approvalService = new ApprovalUserService()
    const [page, setPage] = React.useState(1);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(undefined);
    const [user, setUser] = useState<any>([]);
    const searchInput = useRef(null);
    let navigate = useNavigate();

    useEffect(() => {
        getGatePassData();
        getAllApprovalUser();
    }, []);

    const getGatePassData = () => {
        service.getAllGatePass().then((res: any) => {
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
            dto.status = StatusEnum.INPROGRESS,
            dto.isAssignable = AcceptableEnum.YES,
            dto.assignBy = form.getFieldValue('assignBy')
        dto.emailId = form.getFieldValue('emailId')
        dto.dcId = form.getFieldValue('dcId')
        console.log(dto)
        service.updateDc(dto).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                setDrawerVisible(false);

            } else {
                message.error(res.internalMessage);

            }
        }).catch(err => {
            message.error(err.message);
        })
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
            title: "To Unit",
            dataIndex: "toAddresserName"
        },
        {
            title: "Mode Of Transport",
            dataIndex: "modeOfTransport"
        },
        {
            title: "Requested By",
            dataIndex: "requestedBy"
        },

        {
            title: "created User",
            dataIndex: "created_user"
        },
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

                                navigate('/dc-detail-view', { state: rowData.dcId })
                            }}
                            style={{ color: "blue", fontSize: 20 }}
                        />
                        <Divider type='vertical' />

                    </Tooltip>
                    {rowData.isDcAssign === 'NO' ? (
                        <Tooltip placement='top' title="Assign To Approval User">
                            <RightOutlined
                                onClick={() => {
                                    setDrawerVisible(true);
                                    form.setFieldValue('dcId', rowData.dcId);
                                    console.log(rowData.dcId);
                                }}
                                style={{ color: "blue", fontSize: 20 }}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip placement='top' title="Already Assigned">
                            <CheckOutlined 
                                onClick={() => {
                                    // Handle click for the other icon
                                }}
                                style={{ color: "gray", fontSize: 20 }}
                            />
                        </Tooltip>
                    )}

                </span>
            ),

        },

    ];



    return (
        <Card
            title={<span style={{ color: "white" }}>GatePass</span>}
            extra={
                (
                    <Link to="/dc-form">
                        <span style={{ color: "white" }}>
                            <Button>Create </Button>{" "}
                        </span>
                    </Link>
                )
            }

            headStyle={{ backgroundColor: '#7d33a2', color: 'black' }}>

            <Table columns={columnsSkelton} dataSource={responseData}
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
                                style={{ display: 'none' }}>
                                <Input hidden />
                            </Form.Item>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >

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
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item name="emailId" label="Email Id"
                                    rules={[
                                        { required: true },
                                    ]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form>
                </Card>
            </Drawer>


        </Card>
    );
};

export default DCGrid;