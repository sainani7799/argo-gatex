import { EditOutlined, LoadingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select, Card, message, Col, Row, theme, Radio, RadioChangeEvent, Descriptions, Upload, UploadProps, Popconfirm, Tooltip, Divider, Tag } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { DcReq, StatusEnum, ToAddressReq, UnitReq, itemCode } from 'libs/shared-models';
import { WarehouseService, UnitService, SupplierService, ApprovalUserService, DepartmentService, ItemService, AddressService, EmployeeService, DcService } from 'libs/shared-services';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const DCForm = () => {

    const warehouseService = new WarehouseService();
    const unitService = new UnitService();
    const supplierService = new SupplierService();
    const approvedService = new ApprovalUserService();
    const departmentService = new DepartmentService();
    const addressService = new AddressService();
    const employeeService = new EmployeeService();
    const dcService = new DcService();
    const [units, setUnits] = useState<any>([]);
    const [deps, setDeps] = useState<any>([]);
    const [suppliers, setSuppliers] = useState<any>([]);
    const [warehouses, setWarehouses] = useState<any>([]);
    const [radioValue, setRadioValue] = useState("unit");
    const [returnaValue, setReturnaValue] = useState("Y");
    const [approval, setApproval] = useState<any>([]);
    const [addressData, setAddressData] = useState<any>([]);
    const [toAddressData, setToAddressData] = useState<any>([]);
    const authdata = JSON.parse(localStorage.getItem('userName'))
    const [loading, setLoading] = useState<boolean>(false);
    const [itemFiledList, setItemFieldList] = useState<any>([]);
    const [btnType, setBtnType] = useState<any>("Add");
    const [itemTableData, setItemTableData] = useState<any[]>([])
    const [defaultItemFormData, setDefaultItemFormData] = useState<any>(undefined);
    const [itemIndexVal, setItemIndexVal] = useState<any>(0);
    const [itemTableVisible, setItemTableVisible] = useState<boolean>(false);
    const [employee, setEmployee] = useState<any>([]);
    // console.log(authdata)
    const itemService = new ItemService()
    const [form] = Form.useForm();
    const [itemForm] = Form.useForm()
    const [page, setPage] = React.useState(1);
    const [itemData, setItemData] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate()
    let tableData: any[] = [];

 


    const saveData = (data: any) => {
        console.log(data.unitOrSupplier);
    };

    const uploadItemProps: UploadProps = {
        // alert();
        multiple: false,
        onRemove: file => {
            setItemFieldList([]);
        },

        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
        fileList: itemFiledList,
    };

    useEffect(() => {
        getWarehouses();
        getUnits();
        getSuppliers();
        getDeps();
        getApprovedUsers();
        getAllAddressByUnit();
        getAllItems();
        getAllEmployees();
        getAllToAddressByUnit(radioValue);
        form.setFieldsValue({ fromUnitId: authdata.unitId })
        form.setFieldsValue({ createdUser: authdata.userName })
    }, [])
    const getWarehouses = () => {
        const unitValue = authdata.unitId;
        const req = { unitId: unitValue };
        warehouseService.getAllWarehousesByUnit(req).then(res => {
            if (res) {
                // console.log(res);
                setWarehouses(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getUnits = () => {
        unitService.getAllUnits().then(res => {
            if (res) {
                // console.log(res);
                setUnits(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getAllAddressByUnit = () => {
        const unitValue = authdata.unitId;
        const req = { unitId: unitValue };
        addressService.getAllAddressByUnit(req).then(res => {
            if (res) {
                setAddressData(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getAllItems = () => {
        itemService.getAllItems().then((res) => {
            if (res) {
                setItemData(res.data);
                // console.log(res.data)
            }
        })
    }
    const getAllItemsByCode = () => {
        const req = new itemCode()
        req.itemCode = itemForm.getFieldValue('itemCode')
        console.log(req)
        itemService.getAllItemsByCode(req).then((res) => {
            if (res) {
                // setItemData(res.data);
                itemForm.setFieldValue('itemName', res.data[0].itemName)
                itemForm.setFieldValue('description', res.data[0].description)
                itemForm.setFieldValue('uom', res.data[0].uom)
            }
        })
    }

    const getAllToAddressByUnit = async (radioValue) => {
        const req = new ToAddressReq()
        req.addresser = radioValue
        console.log(req.addresser)
        req.addresserNameId = form.getFieldValue('addresserNameId')
        console.log(req.addresserNameId)
        addressService.getAllToAddressByUnit(req).then(res => {
            if (res) {
                // console.log(res);
                setToAddressData(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getSuppliers = () => {
        supplierService.getAllSuppliers().then(res => {
            if (res) {
                // console.log(res);
                setSuppliers(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getDeps = () => {
        departmentService.getAllDepartments().then(res => {
            if (res) {
                console.log("This is Departments");
                // console.log(res);
                setDeps(res.data);
            }
        })
    };
    const getAllEmployees = () => {
        employeeService.getAllEmployees().then(res => {
            if (res) {
                console.log("This is employee");
                // console.log(res);
                setEmployee(res.data);
            }
        })
    };

    const getApprovedUsers = () => {
        approvedService.getAllApprovalUser().then(res => {
            if (res) {
                console.log("This Is Approval");
                // console.log(res);
                setApproval(res.data);
            }
        })
    };

    const radioOnChange = (e: RadioChangeEvent) => {
        setRadioValue(e.target.value);
        getAllToAddressByUnit(e.target.value)
    };

    const returnOnChange = (e: RadioChangeEvent) => {
        setReturnaValue(e.target.value);
    };






    const setEditForm = (rowData: any, index: any) => {
        console.log(rowData);
        setDefaultItemFormData(rowData)
        setItemIndexVal(index)
        setBtnType("Update")
    }



    const deleteData = (index: any) => {
        tableData = [...itemTableData]
        tableData.splice(index, 1)
        setItemTableData(tableData)
        if (tableData.length == 0) {
            setItemTableVisible(false)
        }
    }

    useEffect(() => {
        if (defaultItemFormData) {
            console.log(defaultItemFormData)
            itemForm.setFieldsValue({
                itemId: defaultItemFormData.itemId,
                itemName: defaultItemFormData.itemName,
                description: defaultItemFormData.description,
                uom: defaultItemFormData.uom,
                qty: defaultItemFormData.qty,
                rate: defaultItemFormData.rate,
                amount: defaultItemFormData.amount,

            })
        }

    }, [defaultItemFormData])

    const columns: ColumnProps<any>[] = [
        {
            title: 'S No',
            key: 'sno',
            // width: '70px',
            responsive: ['sm'],
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: 'Item Code',
            dataIndex: 'itemCode'
        },
        {
            title: 'Item Name',
            dataIndex: 'itemName',

        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: (text, record) => {
                return (
                    <>
                        {record.description ? record.description : '-'}
                    </>
                )
            }
        },

        {
            title: 'UOM',
            dataIndex: 'uom',
            render: (text, record) => {
                return (
                    <>
                        {record.uom ? record.uom : '-'}
                    </>
                )
            }
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            render: (text, record) => {
                return (
                    <>
                        {record.qty ? record.qty : '-'}
                    </>
                )
            }

        },
        {
            title: 'rate',
            dataIndex: 'rate',

        },

        {
            title: 'Amount',
            dataIndex: 'amount'
        },

        {
            title: "Action",
            dataIndex: 'action',
            render: (text: any, rowData: any, index: any) => (
                <span>
                    <Tooltip placement="top" title='Edit'>
                        <Tag >
                            {/* <Popconfirm title='Sure to Edit?' onConfirm={e =>{setEditForm(rowData,index);}}> */}

                            <EditOutlined className={'editSamplTypeIcon'} type="edit"
                                onClick={() => {
                                    setEditForm(rowData, index)
                                }}
                                style={{ color: '#1890ff', fontSize: '14px' }}
                            />
                            {/* </Popconfirm> */}
                        </Tag>
                    </Tooltip>
                    <Divider type="vertical" />

                    <Tooltip placement="top" title='delete'>
                        <Tag >
                            <Popconfirm title='Sure to delete?' onConfirm={e => { deleteData(index); }}>
                                <MinusCircleOutlined

                                    style={{ color: '#1890ff', fontSize: '14px' }} />
                            </Popconfirm>
                        </Tag>
                    </Tooltip>
                </span>
            )
        }
    ]

    const onItemAdd = (values) => {
        itemForm.validateFields().then(() => {
            console.log(itemIndexVal)
            console.log(values)
            if (itemIndexVal !== undefined) {
                console.log(itemIndexVal)
                itemTableData[itemIndexVal] = values;

                tableData = [...itemTableData]
                setItemIndexVal(itemIndexVal + 1)
            } else {
                tableData = [...itemTableData, values]
            }
            setItemTableData(tableData)
            itemForm.resetFields()
            setItemTableVisible(true)
            setBtnType("Add")
        }).catch(() => {
            message.error('Please fill all required fields')
        })
    }


    const calculateAmount = () => {
        const qty = itemForm.getFieldValue('qty');
        const rate = itemForm.getFieldValue('rate');
        const amount = (qty * rate).toString();

        itemForm.setFieldsValue({
            amount: isNaN(Number(amount)) ? 0 : Number(amount),
        });
    };

    const onSubmit = () => {
        form.validateFields().then(() => {
            const req = new DcReq(form.getFieldValue('fromUnitId'), form.getFieldValue('warehouseId'), form.getFieldValue('departmentId'), form.getFieldValue('poNo'), form.getFieldValue('modeOfTransport'), form.getFieldValue('toAddresser'), form.getFieldValue('addresserNameId'), form.getFieldValue('weight'), form.getFieldValue('vehicleNo'), form.getFieldValue('returnable'), form.getFieldValue('purpose'), form.getFieldValue('value'), form.getFieldValue('status'), form.getFieldValue('requestedBy'), form.getFieldValue('remarks'), form.getFieldValue('createdUser'), itemTableData)
            console.log(req)
            dcService.createDc(req).then(res => {
                if (res.status) {
                    navigate('/dc-view')
                    message.success(res.internalMessage);
                }
                else {
                    message.error(res.internalMessage);
                }
            })
            // onReset()
        }).catch(() => {
            message.error('Please fill all fields')
        })
    }

    const onReset = () => {
        setItemTableVisible(false)
        itemForm.resetFields()
        form.resetFields()
        setItemTableData([])
        setItemTableVisible(false)
        setItemFieldList([]);

    }


    return (
        <>
            <Card title={<span style={{ color: 'white' }}>DC Form</span>}
                style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={<span><Button onClick={() => navigate('/dc-view')}>View</Button></span>} >
                <Form
                    form={form}
                    layout='vertical'
                    style={{ width: '100%', margin: '0px auto 0px auto' }}
                >
                    <Row gutter={24} style={{ width: "100%", justifyContent: "space-around" }}>
                        <Col style={{ width: "30%" }}>
                            <Form.Item style={{ display: "none" }} name="createdUser"  >
                            </Form.Item>
                            <Form.Item name="fromUnitId" label="Unit" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Select Unit "
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {addressData.map(unit => {
                                        return (
                                            <Option key={unit.addresser_name_id} value={unit.addresser_name_id}>
                                                {unit.addresserName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="warehouseId" label="Warehouse" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Select Warehouse"
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {warehouses.map(wh => {
                                        return (
                                            <Option key={wh.warehouseId} value={wh.warehouseId}>
                                                {wh.warehouseName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item name="departmentId" label="Department" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Select Dept "
                                    optionFilterProp="children"
                                    allowClear
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
                            <Form.Item name="poNo" label="PO Number">
                                <Input placeholder="Enter PO Number" />
                            </Form.Item>
                            <Form.Item name="modeOfTransport" label="Mode of Transport">
                                <Input placeholder="Enter Mode of Transport" />
                            </Form.Item>
                        </Col>
                        <Col style={{ width: "30%" }}>
                            <Form.Item name="toAddresser"  label="Unit / Supplier" rules={[
                                { required: true },
                            ]}>
                                <Radio.Group onChange={radioOnChange} value={radioValue} defaultValue={"unit"}>
                                    <Radio value={"unit"}>Unit</Radio>
                                    <Radio value={"supplier"}>Supplier</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="addresserNameId" label="To" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder={"Select " + radioValue}
                                    optionFilterProp="children"
                                    allowClear
                                    onChange={(value, option) => getAllToAddressByUnit(radioValue)}
                                >
                                    {radioValue == "unit" ? units.map(unit => {
                                        return (
                                            <Option key={unit.id} value={unit.id}>
                                                {unit.unitName}
                                            </Option>
                                        )
                                    }) : suppliers.map(supplier => {
                                        return (
                                            <Option key={supplier.supplierId} value={supplier.supplierId}>
                                                {supplier.supplierName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="weight" label="Weight" rules={[
                                { required: true },
                            ]}>
                                <Input placeholder="Enter Weight" />
                            </Form.Item>
                            <Form.Item name="vehicleNo" label="Vehicle Number">
                                <Input placeholder="Enter Vehicle Number" />
                            </Form.Item>
                        </Col>
                        <Col style={{ width: "30%" }}>
                            <Form.Item name="returnable" label="Returnable" rules={[
                                { required: true },
                            ]}>
                                <Radio.Group onChange={returnOnChange} value={returnaValue} defaultValue={"Y"}>
                                    <Radio value={"Y"}>Yes</Radio>
                                    <Radio value={"N"}>No</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="purpose" label="Purpose" rules={[
                                { required: true },
                            ]}>
                                <Input placeholder="Enter Purpose" />
                            </Form.Item>
                            <Form.Item name="value" label="Value" >
                                <Input placeholder="Enter Value" />
                            </Form.Item>
                            <Form.Item name="status" label="Status">
                                <Select
                                    showSearch
                                    placeholder="Select Status"
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {Object.keys(StatusEnum).map((type) => {
                                        return <Option value={StatusEnum[type]}>{StatusEnum[type]}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="requestedBy" label="Requested By" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Select Name"
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {employee.map(app => {
                                        return (
                                            <Option key={app.employeeId} value={app.employeeId}>
                                                {app.employeeName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{ width: '100%' }}>
                        <Col style={{ width: "80%" }}>
                            <Form.Item name="remarks" label="Remarks">
                                <Input placeholder="Enter Remarks" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col className="cardComp" xs={24} sm={24} md={8} xl={12}>
                            <Card size='small' title={<span style={{ color: 'white' }}>From Address</span>}
                                style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} >
                                <Descriptions column={2}>
                                    <Descriptions.Item label="Line One">
                                        {addressData[0]?.lineOne}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Line Two">
                                        {addressData[0]?.lineTwo}
                                    </Descriptions.Item>
                                </Descriptions>
                                <Descriptions column={3}>
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
                        <Col className="cardComp" xs={24} sm={24} md={8} xl={12}>
                            <Card size='small' title={<span style={{ color: 'white' }}>To Address</span>}
                                style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} >
                                <Descriptions column={2}>
                                    <Descriptions.Item label="Line One">
                                        {toAddressData[0]?.lineOne}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Line Two">
                                        {toAddressData[0]?.lineTwo}
                                    </Descriptions.Item>
                                </Descriptions>
                                <Descriptions column={3}>
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
                </Form>
                <br />
                <Card>

                    <Form layout="vertical" onFinish={onItemAdd} form={itemForm}> <h1 style={{ color: '#6b54bf', fontSize: '15px', textAlign: 'left' }}>Item DETAILS</h1>
                        <Row gutter={14}>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                                <Form.Item name='itemCode' label='Item Code' rules={[{ required: true, message: 'Item Code' }]}>
                                    <Select showSearch allowClear optionFilterProp="children" placeholder='Select Item Code' dropdownMatchSelectWidth={false} onChange={getAllItemsByCode}>
                                        {itemData.map(e => {
                                            return (
                                                <Option key={e.itemId} value={e.itemCode}>{e.itemCode} - {e.itemName}</Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                                <Form.Item name='itemName' label='Item Name' rules={[{ required: true, message: 'Item Name' }]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                                <Form.Item name='description' label='Description' rules={[{ required: false, message: 'M3 Code is required' }]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 2 }}>
                                <Form.Item name='uom' label='UOM' rules={[{ required: true, message: 'UOM is required' }]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 2 }}>
                                <Form.Item name='qty' label='Qty' rules={[
                                    { required: true, message: 'Qty required' },
                                ]}>
                                    <Input onChange={calculateAmount} />
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 2 }}>
                                <Form.Item name='rate' label='Rate' rules={[
                                    { required: true, message: 'Rate is required' },
                                ]}>
                                    <Input onChange={calculateAmount} />
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 3 }}>
                                <Form.Item name='amount' label='Amount' rules={[{ required: true, message: 'Amount is required' }]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify={'end'}>
                            <Button type='primary' htmlType="submit">{btnType}</Button>
                        </Row>
                    </Form>
                </Card>
                {itemTableVisible ? (<>
                    <Table columns={columns} dataSource={itemTableData} scroll={{ x: 'max-content' }} />
                </>) : (<></>)}
            </Card>
            <Row style={{ paddingTop: "30px" }} justify={'end'}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 2 }}>
                    <Button type="primary" onClick={onSubmit}
                        disabled={itemTableData.length > 0 ? false : true}>Submit</Button>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 2 }}>
                    <Button
                        onClick={onReset}
                    >Reset</Button>
                </Col>

            </Row>
        </>
    )
};

export default DCForm;