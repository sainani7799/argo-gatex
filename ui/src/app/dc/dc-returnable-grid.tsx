import { CheckOutlined, EditOutlined, EyeOutlined, LockOutlined, MoreOutlined, RightOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Switch, Divider, Drawer, Select, Descriptions, Radio, notification, Dropdown, Menu, Tag } from 'antd';
import { AddressService, ApprovalUserService, DcService, DepartmentService, EmailService, } from 'libs/shared-services';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Highlighter from 'react-highlight-words'
import { AcceptReq, AcceptableEnum, ApprovalIdReq, AssignReq, CreateAddressDto, DcEmailModel, DcIdReq, DcReq, StatusEnum, ToAddressReq, UnitReq } from 'libs/shared-models';
import DCForm from './dc-form';
import moment from 'moment';
import TextArea from 'antd/es/input/TextArea';
import DescriptionsItem from 'antd/es/descriptions/Item';
import DcItemsForm from './dc-items-form';
const { Option } = Select;

const DCReturnableGrid = () => {
    const [form] = Form.useForm();
    const [formTwo] = Form.useForm();
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
    const [editDrawerVisible, setEditDrawerVisible] = useState(false);
    const [selectedDc, setSelectedDc] = useState<any>(undefined);
    const [data, setData] = useState([])
    const [radioValue, setRadioValue] = useState({})
    const addressService = new AddressService();
    const [addressData, setAddressData] = useState([])
    const [toAddressData, setToAddressData] = useState([])
    const [deps, setDeps] = useState<any>([]);
    const [formData, setFormData] = useState([])
    const departmentService = new DepartmentService();
    const formRefs = useRef([]);



    let navigate = useNavigate();

    useEffect(() => {
        getGatePassData();
        getAllApprovalUser();
        getDeps();
    }, []);

    const getGatePassData = () => {
        const unitValue = authdata?.unitId;
        const req = { unitId: unitValue };
        service.getAllGatePassTounit(req).then((res: any) => {
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
        approvalService.getAllApprovalIdUser(req).then((res: any) => {
            if (res.status) {
                form.setFieldValue('emailId', res.data[0]?.emailId)

            }
        })
    }

    let mailerSent = false;
    async function sendDcMailForGatePass() {
        const dcDetails = new DcEmailModel();
        dcDetails.dcNo = form.getFieldValue('dcNumber');
        dcDetails.to = form.getFieldValue('emailId');
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
          <p>Please find the Gate Pass details below:</p>
          <p>DC NO: ${form.getFieldValue('dcNumber')}</p>
          <p>
            Some items moved from Address: ${form.getFieldValue('fromUnit')} to
            Address: ${form.getFieldValue('toAddresserName')}
          </p>
          <p>DC created user name : ${form.getFieldValue('created_user')}</p>
          <p>Purpose of this DC : ${form.getFieldValue('purpose')}</p>
          <p>Please click the link below for details:</p>
          <input type="hidden" id="assignBy" value=${form.getFieldValue('assignBy')} /> 
          <input type="hidden" id="dcId" value=${form.getFieldValue('dcId')} />
      
          <a
            href="https://gatex.schemaxtech.in/#/dc-email-detail-view/${form.getFieldValue('dcId')}"
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
          href="https://gatex.schemaxtech.in/#/dc-email/${form.getFieldValue('dcId')}"
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
          href="https://gatex.schemaxtech.in/#/dc-reject-mail/${form.getFieldValue('dcId')}"
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
        setEditDrawerVisible(false)
        setSelectedDc([])
        form.resetFields()
        formTwo.resetFields()
        setDcDetails([])
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

    const [dcDetails, setDcDetails] = useState<any[]>([]);
    const drawerForReturnable = async (data: any) => {
        setSelectedDc(data)
        setEditDrawerVisible(true)
        getAllToAddressByUnit(data)
        getFromAddress(data)
        const dcData = await getDc(data.dcId)
        console.log(dcData)
        setDcDetails(dcData)
        form.setFieldsValue({
            fromUnitId: data?.toAddresserName || '',
            warehouseId: data?.warehouseName || '',
            departmentId: data?.department || '',
            requestedBy: data?.requestedBy || '',
            toAddresser: data?.toAddresser || "unit",
            addresserNameId: data?.fromUnit || " ",
            purpose: data?.purpose || " ",
            value: data?.value || " ",
            status: data?.status || " ",
            buyerTeam: data?.buyerTeam || " ",
            remarks: data?.remarks || " ",
            weight: data?.weight || " ",
            fromUnitIdOnly: data?.toAddresserNameId || '',
            toUnitId: data?.fromUnitId || '',
        })
    }


    function renderItemForm(data) {
        console.log(data, '---render from data')
        return
    }
    const userUnitName = authdata?.unitName;
    const userName = authdata?.userName;
    // console.log(userName , 'user nameee')

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
            // dataIndex: "addresserNameId",
            // render: (text, record) => {
            //     // Extract the name and keep the ID for editing
            //     const [name] = text.split("-");  // Extract only the name part
            //     const id = text.split("-")[1];   // Extract the hidden ID part (not displayed)

            //     return (
            //       <span>
            //         {name} {/* Show only the name */}
            //       </span>
            //     );
            //   }
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
            render: (item) => item ? item : '-'
        },
        {
            title: "Users Buyer Team",
            dataIndex: "buyerTeam",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (item) => item ? item : '-'
        },
        {
            title: "Purpose",
            dataIndex: "purpose",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
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
            fixed: "right",
            width: 200,
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
            align: "center",
            fixed: "right",
            width: 70,
            outerWidth: '4px',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (text, rowData, index) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="edit">
                            {rowData.status === 'RECEIVED' && userUnitName === rowData.toAddresserName ? (
                                <Tooltip placement="top" title="Edit">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <EditOutlined
                                            style={{ color: "blue", fontSize: 20, marginRight: '8px' }}
                                            onClick={() => drawerForReturnable(rowData)}
                                        />
                                        <span>Edit</span>
                                    </div>
                                </Tooltip>
                            ) : null}
                        </Menu.Item>
                        <Menu.Item key="view">
                            <Tooltip placement="top" title="Detail View">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <EyeOutlined
                                        style={{ color: "blue", fontSize: 20, marginRight: '8px' }}
                                        onClick={() => navigate(`/dc-detail-view/${rowData.dcId}`)}
                                    />
                                    <span>Detail View</span>
                                </div>
                            </Tooltip>
                        </Menu.Item>
                        <Menu.Item key="assign">
                            {rowData.isDcAssign === 'NO' ? (
                                <Tooltip placement="top" title="Assign DC to User">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <RightOutlined
                                            style={{ color: "blue", fontSize: 20, marginRight: '8px' }}
                                            onClick={() => {
                                                setDrawerVisible(true);
                                                form.setFieldsValue({
                                                    dcId: rowData.dcId,
                                                    dcNumber: rowData.dcNumber,
                                                    fromUnit: rowData.fromUnit,
                                                    toAddresserName: rowData.toAddresserName,
                                                    purpose: rowData.purpose,
                                                    created_user: rowData.created_user,
                                                });
                                            }}
                                        />
                                        <span>Assign DC to User</span>
                                    </div>
                                </Tooltip>
                            ) : (
                                <Tooltip placement="top" title="Already Assigned">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CheckOutlined
                                            style={{ color: "gray", fontSize: 20, marginRight: '8px' }}
                                        />
                                        <span>Already Assigned</span>
                                    </div>
                                </Tooltip>
                            )}
                        </Menu.Item>
                    </Menu>
                );

                return (
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <Tooltip placement="top" title="Actions">
                            <MoreOutlined
                                style={{ fontSize: 20, cursor: 'pointer', color: '#016582' }}
                            />
                        </Tooltip>
                    </Dropdown>
                );
            },
        },


    ];

    const getAllToAddressByUnit = async (val) => {
        const req = new ToAddressReq()
        req.addresser = val?.toAddresser
        req.addresserNameId = val?.fromUnitId
        addressService.getAllToAddressByUnit(req).then(res => {
            if (res) {
                setToAddressData(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getFromAddress = (val) => {
        const req = new UnitReq()
        req.unitId = val.toAddresserNameId
        addressService.getAllAddressByUnit(req).then(res => {
            if (res) {
                setAddressData(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getDeps = () => {
        departmentService.getAllDepartments().then(res => {
            if (res) {
                setDeps(res.data);
            }
        })
    };

    const getDc = async (id) => {
        const req = new DcIdReq(Number(id));
        try {
            const res = await service.getDcDetailsById(req); // Await the service call
            if (res.status) {
                return res.data; // Return the data
            }
        } catch (error) {
            console.error("Error fetching DC details:", error);
            return null; // Return null or handle the error case as needed
        }
    };

    function onSubmit(rec) {
        console.log(formData)
        const req = {
            dc: rec,
            dcItem: formData,
            dcId: selectedDc.dcId,
            status: StatusEnum.SENT_FOR_SECURITY_RE_CHECK,
            returnedBy: userName
        }
        console.log(req, 'req')
        service.updateRetunableData(req).then((res) => {
            if (res.status) {
                notification.success({ message: res.internalMessage })
            } else {
                notification.error({ message: res.internalMessage })
            }
        })
        closeDrawer()
        getGatePassData();
    }

    function handleFormChange(index, changedValues, record) {
        const newFormData = [...formData];
        newFormData[index] = { ...newFormData[index], ...changedValues, dcItemId: record.dc_item_id };
        setFormData(newFormData);
    }

    const [writeOffQtys, setWriteOffQtys] = useState(dcDetails.map(() => 0));

    const calculateWriteOffQty = (qty, returnQty, index) => {
        const writeOffQty = qty - returnQty;
        const result = writeOffQty >= 0 ? writeOffQty : 0;
        console.log(`Calculating Write Off Qty: ${qty} - ${returnQty} = ${result}`);

        const updatedWriteOffQtys = [...writeOffQtys];
        updatedWriteOffQtys[index] = result;
        console.log(updatedWriteOffQtys, 'ipp')
        setWriteOffQtys(updatedWriteOffQtys);
        return result
    };

    const onValuesChange = (index, changedValues, allValues) => {
        console.log(`Form ${index} values changed:`, changedValues);
        console.log(`All form ${index} values:`, allValues);

        const qty = Number(allValues.qty) || 0;
        const returnQty = Number(allValues.returnQty) || 0;
        const result = calculateWriteOffQty(qty, returnQty, index);

        console.log(`Setting writeOffQty for item ${index} to: ${result}`);
        const form = formRefs.current[index];
        form.setFieldsValue({ writeOffQty: result });
        // message.info(`WriteOffQty  will be: ${result}`);

        const updatedValues = { ...changedValues, writeOffQty: result };
        console.log(result)

        handleFormChange(index, updatedValues, dcDetails[index]);
        console.log("Updated form data after changes:", updatedValues);
    };



    const radioValueInEdit = selectedDc?.toAddresser || " "
    return (
        <Card
            title={
                <span style={{ color: "white" }}>
                    <LockOutlined style={{ fontSize: '24px', color: 'white', marginRight: '8px' }} />
                    GatePass
                </span>
            }
            // extra={
            //     (
            //         <Link to="/dc-form">
            //             <span style={{ color: "white" }}>
            //                 <Button>Create </Button>{" "}
            //             </span>
            //         </Link>
            //     )
            // }

            headStyle={{ backgroundColor: '#047595', color: 'black' }}>

            <Table columns={columnsSkelton}
                dataSource={responseData.filter(
                    (item) => item.status === 'RECEIVED' && item.dcType === 'returnable'
                )}

                scroll={{ x: 1400, y: 400 }} size='small' />
            <Drawer bodyStyle={{ paddingBottom: 80 }} title='Returnable' width={window.innerWidth > 768 ? '95%' : '99%'}
                onClose={closeDrawer} open={editDrawerVisible} closable={true} >
                <Card title={<span style={{ color: 'white' }}>DC Form</span>}
                    style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }}
                // extra={<span><Button onClick={() => navigate('/dc-return-view')}>Back</Button></span>} 
                >
                    <Form
                        form={form}
                        layout='vertical'
                        style={{ width: '100%', margin: '0px auto 0px auto' }}
                        onFinish={onSubmit}
                    >
                        <Row gutter={24} style={{ width: "100%", justifyContent: "space-around" }}>
                            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                                <Form.Item style={{ display: "none" }} name="createdUser"  >
                                </Form.Item>
                                <Form.Item name="fromUnitId" label="Unit" rules={[
                                    { required: true },
                                ]} >
                                    <Input style={{ textAlign: 'center' }} disabled />
                                </Form.Item>

                                <Form.Item name="fromUnitIdOnly" label="From unit" hidden rules={[
                                    { required: true },
                                ]} >
                                    <Input style={{ textAlign: 'center' }} disabled />
                                </Form.Item>

                                <Form.Item name="warehouseId" label="Warehouse" rules={[
                                    { required: true },
                                ]}>
                                    <Input style={{ textAlign: 'center' }} disabled />
                                </Form.Item>

                                <Form.Item name="departmentId" label="Department" rules={[
                                    { required: true },
                                ]}>

                                    <Input style={{ textAlign: 'center' }} disabled />

                                </Form.Item>
                                <Form.Item name="requestedBy" label="Requested By">
                                    <Input style={{ textAlign: 'center' }} disabled />

                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                                <Form.Item name="toAddresser" label="Unit / Buyer /Supplier" rules={[
                                    { required: true },
                                ]}>
                                    <Radio.Group
                                        onChange={(e) => {
                                            setRadioValue(e.target.value)
                                        }}
                                        value={radioValue}
                                        disabled
                                    >
                                        <Radio value={"unit"}>Unit</Radio>
                                        <Radio value={"supplier"}>Supplier</Radio>
                                        <Radio value={"buyer"}>Buyer</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item name="toUnitId" label="To unit" hidden rules={[
                                    { required: true },
                                ]} >
                                    <Input style={{ textAlign: 'center' }} disabled />
                                </Form.Item>

                                <Form.Item name="addresserNameId" label="To" rules={[
                                    { required: true },
                                ]}>
                                    <Input disabled />
                                </Form.Item>

                                {radioValueInEdit === "unit" && (
                                    <>
                                        <Form.Item name="toDepartmentId" label="To Department" rules={[
                                            { required: true },
                                        ]}>
                                            <Select
                                                showSearch
                                                placeholder="Select Dept "
                                                optionFilterProp="children"
                                                allowClear
                                            // onChange={getAllToEmployees}
                                            >
                                                {deps?.map(dep => {
                                                    return (
                                                        <Option key={dep.id} value={dep.id}>
                                                            {dep.departmentName}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="attentionPerson" label="Attention Person(Receiver side)">
                                            <Input />
                                        </Form.Item>
                                    </>
                                )}
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                                <Form.Item name="purpose" label="Purpose" rules={[
                                    { required: true },
                                ]}>
                                    <Input disabled placeholder="Enter Purpose" />
                                </Form.Item>
                                <Form.Item name="value" label="Value">

                                    <Input placeholder="Enter Value" disabled />
                                </Form.Item>
                                <Form.Item name="status" label="Status" >
                                    <Input placeholder="Enter Value" disabled />

                                </Form.Item>
                                <Form.Item name="buyerTeam" label="Users Buyer Team" rules={[
                                    { required: true },
                                ]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} >
                            <Col xs={24} sm={24} md={8} lg={8} xl={18}>
                                <Form.Item name="remarks" label="Remarks">
                                    <TextArea disabled placeholder="Enter Remarks" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8} xl={5}>
                                <Form.Item name="weight" label="Weight (KGS)" rules={[
                                    { required: true },
                                    {
                                        pattern: /^[0-9]+(\.[0-9]{1,2})?$/, // Regular expression to allow numbers with up to 2 decimal places
                                        message: 'Please enter a valid numeric value with up to 2 decimal places.',
                                    },
                                ]}>
                                    <Input disabled placeholder="Enter Weight" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col className="cardComp" xs={24} sm={24} md={12} xl={12}>
                                <Card size='small' title={<span style={{ color: 'white' }}>From Address</span>}
                                    style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} >
                                    <Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
                                        <Descriptions.Item label="Line One">
                                            {addressData[0]?.lineOne}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Line Two">
                                            {addressData[0]?.lineTwo}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
                                        <Descriptions.Item label="City">
                                            {addressData[0]?.city}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Pin code">
                                            {addressData[0]?.pinCode}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Dist">
                                            {addressData[0]?.dist}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="State">
                                            {addressData[0]?.state}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Country">
                                            {addressData[0]?.country}
                                        </Descriptions.Item>
                                    </Descriptions>

                                </Card>
                            </Col>
                            <Col className="cardComp" xs={24} sm={24} md={12} xl={12}>
                                <Card size='small' title={<span style={{ color: 'white' }}>To Address</span>}
                                    style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} >
                                    <Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
                                        <Descriptions.Item label="Line One">
                                            {toAddressData[0]?.lineOne}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Line Two">
                                            {toAddressData[0]?.lineTwo}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
                                        <Descriptions.Item label="City">
                                            {toAddressData[0]?.city}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Pin code">
                                            {toAddressData[0]?.pinCode}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Dist">
                                            {toAddressData[0]?.dist}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="State">
                                            {toAddressData[0]?.state}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Country">
                                            {toAddressData[0]?.country}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>
                        <br />
                        <>
                            {dcDetails.map((item, index) => (

                                <Card key={index}>
                                    <Form
                                        //   form={formTwo}
                                        ref={(formInstance) => (formRefs.current[index] = formInstance)}
                                        layout="vertical"
                                        initialValues={{
                                            itemType: item.itemType,
                                            itemCode: item.itemCode,
                                            itemName: item.itemName,
                                            description: item.description,
                                            uom: item.uom,
                                            qty: item.qty,
                                            rate: item.rate,
                                            amount: item.amount,
                                            writeOffQty: item.writeOffQty
                                        }}
                                        onValuesChange={(changedValues, allValues) => onValuesChange(index, changedValues, allValues)}


                                    >
                                        <h1 style={{ color: '#6b54bf', fontSize: '15px', textAlign: 'left' }}>ITEM DETAILS</h1>
                                        <Row gutter={14}>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                                                <Form.Item name='itemType' label='Item Type' rules={[{ required: true, message: 'Item Type required' }]}>
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                                                <Form.Item name='itemCode' label='Item Code' rules={[{ required: true, message: 'Item Code required' }]}>
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                                                <Form.Item name='itemName' label='Item Name' rules={[{ required: true, message: 'Item Name is required' }]}>
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={6}>
                                                <Form.Item name='description' label='Description' rules={[{ required: false, message: 'M3 Code is required' }]}>
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={2}>
                                                <Form.Item name='uom' label='UOM' rules={[{ required: true, message: 'UOM is required' }]}>
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={2}>
                                                <Form.Item name='qty' label='Qty' rules={[{ required: true, message: 'Qty required' }]}>
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            {/* <Col xs={24} sm={24} md={4} lg={4} xl={2}>
                                                <Form.Item name='rate' label='Rate' rules={[{ required: true, message: 'Rate is required' }]}>
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                                                <Form.Item name='amount' label='Amount' rules={[{ required: true, message: 'Amount is required' }]}>
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col> */}
                                            <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                                                <Form.Item
                                                    name='returnQty'
                                                    label='Returning Qty'
                                                    rules={[
                                                        { required: true, message: 'Returning Qty is required' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                const qty = getFieldValue('qty');
                                                                if (!value || value <= qty) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Returning Qty cannot be greater than Qty'));
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                                                <Form.Item name='returnRemarks' label='Return Remarks'>
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                                                <Form.Item name='writeOffQty' label='Write Off Qty' >
                                                    <Input disabled value={writeOffQtys[index]} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card>
                            ))}
                        </>
                        <Row style={{ paddingTop: "30px" }} justify={'end'}>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 2 }}>
                                <Button type="primary" htmlType="submit" >Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

            </Drawer>
        </Card>
    );
};

export default DCReturnableGrid;