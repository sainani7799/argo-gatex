import { EditOutlined, LoadingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select, Card, message, Col, Row, theme, Radio, RadioChangeEvent, Descriptions, Upload, UploadProps, Popconfirm, Tooltip, Divider, Tag } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { AcceptableEnum, DcReq, StatusEnum, ToAddressReq, ToEmpReq, UnitReq, itemCode } from 'libs/shared-models';
import { WarehouseService, UnitService, SupplierService, ApprovalUserService, DepartmentService, ItemService, AddressService, EmployeeService, DcService } from 'libs/shared-services';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

export interface DCFormProps {
    data: any;
    updateDetails: (data: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
}

const DCForm = (props : DCFormProps) => {

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
    const [buyers, setBuyers] = useState<any>([]);
    const [warehouses, setWarehouses] = useState<any>([]);
    const [radioValue, setRadioValue] = useState("unit");
    const [returnaValue, setReturnaValue] = useState("N");
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
    const [toEmployee, setToEmployee] = useState<any>([]);
    const [responseData, setResponseData] = useState<any>([]);
    const itemService = new ItemService()
    const [form] = Form.useForm();
    const [itemForm] = Form.useForm()
    const [page, setPage] = React.useState(1);
    const [itemData, setItemData] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [loadingWarehouses, setLoadingWarehouses] = useState(true);
    const { TextArea } = Input;
    const [manualEntry, setManualEntry] = useState(true);
    const [addVisible,setAddVisible] = useState(true);
    const [totalQty,setTotalQty] = useState(Number)

    const toggleManualEntry = () => {
        setManualEntry(!manualEntry);
        // Reset form values when switching between manual and automatic entry
        itemForm.resetFields();
    };

    const navigate = useNavigate()
    let tableData: any[] = [];

    useEffect(() => {
        // getWarehouses();
        getUnits();
        getSuppliers();
        getDeps();
        getApprovedUsers();
        getAllAddressByUnit();
        getAllItems();
        getAllEmployees();
        form.setFieldsValue({ fromUnitId: authdata.unitId })
        form.setFieldsValue({ createdUser: authdata.userName })
        form.setFieldsValue({ requestedBy: authdata.employeeId })
        form.setFieldsValue({ departmentId: Number(authdata.department) })
    }, [])
    useEffect(() => {
        getGatePassData();
    }, []);

    const getGatePassData = () => {
        const unitValue = authdata.unitId;
        const req = { unitId: unitValue };
        dcService.getAllGatePass(req).then((res: any) => {
            if (res.status) {
                setResponseData(res.data);
            }
        });
    };
    useEffect(() => {
        getWarehouses();
    }, []);

    const getWarehouses = async () => {
        try {
            const unitValue = authdata.unitId;
            const req = { unitId: unitValue };
            const res = await warehouseService.getAllWarehousesByUnit(req);
            const activeWarehouses = res.data.filter(warehouse => warehouse.isActive === true);
            form.setFieldsValue({ warehouseId: activeWarehouses[0]?.warehouseId})
            setWarehouses(activeWarehouses);
            setLoadingWarehouses(false);
        } catch (error) {
            message.error("Something went wrong");
            setLoadingWarehouses(false);
        }
    };

    useEffect(() => {
        const addresserNameId = form.getFieldValue('addresserNameId');
        // const toDepartmentId = form.getFieldValue('toDepartmentId');

        if (addresserNameId) {
            // getAllToEmployees();
        }
    }, [form.getFieldValue('addresserNameId'), form.getFieldValue('toDepartmentId')]);

    const getUnits = () => {
        unitService.getAllUnits().then(res => {
            if (res) {
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
                const activeItems = res.data.filter(item => item.isActive === true);
                setWarehouses(activeItems)
                setItemData(res.data);
            }
        })
    }
    const getAllItemsByCode = () => {
        const req = new itemCode()
        req.itemCode = itemForm.getFieldValue('itemCode')
        itemService.getAllItemsByCode(req).then((res) => {
            if (res) {
                // setItemData(res.data);
                itemForm.setFieldValue('itemName', res.data[0].itemName)
                itemForm.setFieldValue('description', res.data[0].description)
                itemForm.setFieldValue('uom', res.data[0].uom)
                itemForm.setFieldValue('itemType',res.data[0].itemType)
            }
        })
    }

    const getAllToAddressByUnit = async (radioValue) => {
        const req = new ToAddressReq()
        req.addresser = radioValue
        req.addresserNameId = form.getFieldValue('addresserNameId')
        addressService.getAllToAddressByUnit(req).then(res => {
            console.log(res)
            if (res) {
                const activeToAddress = res.data.filter(address => address.isActive === 1);
                setToAddressData(activeToAddress);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getSuppliers = () => {
        supplierService.getAllSuppliers().then(res => {
            if (res) {
                const activeSuppliers = res.data.filter(suppliers => suppliers.isActive === true && suppliers.type === "SUPPLIER");
                setSuppliers(activeSuppliers);
                const activeBuyers = res.data.filter(buyer => buyer.isActive === true && buyer.type === "BUYER")
                setBuyers(activeBuyers)
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getAllEmployees = () => {
        const unitValue = authdata.unitId;
        const req = { unitId: unitValue };
        employeeService.getAllEmployeesByUnit(req).then(res => {
            if (res) {
                // const activeSuppliers = res.data.filter(suppliers => suppliers.isActive === true);
                setEmployee(res.data);
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

    const getApprovedUsers = () => {
        approvedService.getAllApprovalUser().then(res => {
            if (res) {
                setApproval(res.data);
            }
        })
    };

    const radioOnChange = (e: RadioChangeEvent) => {
        setRadioValue(e.target.value);
    };

    const returnOnChange = (e: RadioChangeEvent) => {
        setReturnaValue(e.target.value);
    };

    const setEditForm = (rowData: any, index: any) => {
        setDefaultItemFormData(rowData)
        setItemIndexVal(index)
        setBtnType("Update")
    }



    const deleteData = (index: any,val) => {
        tableData = [...itemTableData]
        setTotalQty((Number(totalQty) - Number(val.qty)))
        tableData.splice(index, 1)
        setItemTableData(tableData)
        if (tableData.length == 0) {
            setItemTableVisible(false)
        }
    }

    useEffect(() => {
        if (defaultItemFormData) {
            itemForm.setFieldsValue({
                itemId: defaultItemFormData.itemId,
                itemCode: defaultItemFormData.itemCode,
                itemName: defaultItemFormData.itemName,
                description: defaultItemFormData.description,
                uom: defaultItemFormData.uom,
                qty: defaultItemFormData.qty,
                rate: defaultItemFormData.rate,
                amount: defaultItemFormData.amount,
                itemType : defaultItemFormData.itemType
            })
        }

    }, [defaultItemFormData])

    const userData = localStorage.getItem('userName');
    const parsedUserData  = JSON.parse(userData)
    const buyerTeam = parsedUserData.buyerTeam;




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
            title: 'Item Type',
            dataIndex: 'itemType',
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
                            <Popconfirm title='Sure to delete?' onConfirm={e => { deleteData(index ,rowData); }}>
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
            // setTotalQty(totalQty +  Number(values.qty))
            let tableData = [...itemTableData];
            const newQty = Number(values.qty) || 0;

            if (itemIndexVal !== undefined) {
                itemTableData[itemIndexVal] = values;
                tableData = [...itemTableData]
                setItemIndexVal(itemIndexVal + 1)

                const oldQty = Number(tableData[itemIndexVal].qty) || 0;
                setTotalQty(prevTotalQty => prevTotalQty - oldQty + newQty);
                tableData[itemIndexVal] = values;
            } else {
                setTotalQty(prevTotalQty => prevTotalQty + newQty);
                tableData.push(values);
                // tableData = [...itemTableData, values]
            }
            const sumOfAmounts = tableData.reduce((sum, item) => {
                // Assuming 'amount' is the field name
                const amount = parseFloat(item.amount) || 0;
                return sum + amount;
            }, 0);
            form.setFieldsValue({
                value: isNaN(Number(sumOfAmounts)) ? 0 : Number(sumOfAmounts),
            });
            setItemTableData(tableData)
            itemForm.resetFields()
            setItemTableVisible(true)
            setBtnType("Add")
            setItemIndexVal(undefined);
        }).catch(() => {
            message.error('Please fill all required fields')
        })
    }

    // const calculateAmount = () => {
    //     const qty = itemForm.getFieldValue('qty');
    //     const trim = itemForm.getFieldValue('itemType')

    //       if(trim != 'trim'){
    //         const currentTotalQty = itemTableData.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    //     const existingItemQty = itemIndexVal !== undefined && itemIndexVal < itemTableData.length
    //         ? (Number(itemTableData[itemIndexVal].qty) || 0)
    //         : 0;
    //     const newTotalQty = currentTotalQty + Number(qty) - existingItemQty;
    
    //         if(Number(qty) > 50 || newTotalQty  > 50) {
    //             setAddVisible(true)
    //             return message.info('Qty will not exceed 50')
    //         }
    //       }
    //             const rate = itemForm.getFieldValue('rate');
    //             const amount = (qty * rate).toString();
    //             setAddVisible(false)
    //             itemForm.setFieldsValue({
    //                 amount: isNaN(Number(amount)) ? 0 : Number(amount),
    //             });
            
    // };

    const calculateAmount = () => {
        const qty = Number(itemForm.getFieldValue('qty')) || 0;
        const trim = itemForm.getFieldValue('itemType');
        const rate = Number(itemForm.getFieldValue('rate')) || 0;
    
        if (trim !== 'trim') {
            const currentTotalQty = itemTableData.reduce((sum, item, index) => {
                if (index !== itemIndexVal) {
                    return sum + (Number(item.qty) || 0);
                }
                return sum;
            }, 0);
            const newTotalQty = currentTotalQty + qty;
    
            if (qty > 50 || newTotalQty > 50) {
                setAddVisible(true);
                return message.info('Qty will not exceed 50');
            }
        }
    
        const amount = (qty * rate).toFixed(2);
        setAddVisible(false);
        itemForm.setFieldsValue({
            amount: Number(amount) || 0,
        });
    };
    const onSubmit = () => {
        // console.log(form.getFieldValue('buyerTeam'))
        form.validateFields().then(() => {
            const value = form.getFieldValue('value');
            if (parseFloat(value) <= 50000) {
                const req = new DcReq(form.getFieldValue('fromUnitId'), form.getFieldValue('warehouseId'), form.getFieldValue('departmentId'), form.getFieldValue('poNo'), form.getFieldValue('modeOfTransport'), form.getFieldValue('toAddresser'), form.getFieldValue('addresserNameId'), form.getFieldValue('weight'), form.getFieldValue('vehicleNo'), form.getFieldValue('returnable'), form.getFieldValue('purpose'), form.getFieldValue('value'), StatusEnum.ASSIGN_TO_APPROVAL, form.getFieldValue('requestedBy'), form.getFieldValue('remarks'), form.getFieldValue('createdUser'), itemTableData, '', AcceptableEnum.NO, null, form.getFieldValue('attentionPerson'), form.getFieldValue('toDepartmentId') , form.getFieldValue('buyerTeam') , form.getFieldValue('dcType') )
                console.log(req, 'reqq')
                dcService.createDc(req).then(res => {
                    if (res.status) {
                        navigate('/dc-view')
                        message.success(res.internalMessage);
                        getGatePassData()
                    }
                    else {
                        message.error(res.internalMessage);
                    }
                })
            } else {
                message.error(`DC is can't be created because DC value more then 50,000`);
            }
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
                style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={<span><Button onClick={() => navigate('/dc-view')}>Back</Button></span>} >
                <Form
                    form={form}
                    layout='vertical'
                    style={{ width: '100%', margin: '0px auto 0px auto' }}
                    initialValues={{
                        buyerTeam : buyerTeam,
                        ...props.data
                    }}
                >
                    <Row gutter={24} style={{ width: "100%", justifyContent: "space-around" }}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Form.Item style={{ display: "none" }} name="createdUser"  >
                            </Form.Item>
                            <Form.Item name="fromUnitId" label="Unit" rules={[
                                { required: true },
                            ]} >
                                <Select
                                    showSearch
                                    placeholder="Select Unit "
                                    optionFilterProp="children"
                                    allowClear
                                    disabled
                                    // onChange={getWarehouses}
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

                    <Form.Item name="dcType" label="DC Type" rules={[
                            { required: true, message: 'Please Select DC Type' }
                        ]} >
                            <Select
                                showSearch
                                placeholder="Select DC Type"
                                // optionFilterProp="children"
                                allowClear
                            >
                                <Option value='returnable'>{'Returnable'}</Option>
                                <Option value='nonReturnable'>{'Non-Returnable'}</Option>
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
                                    loading={loadingWarehouses}
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
                            
                            {/* <Form.Item name="poNo" label="PO Number">
                                <Input placeholder="Enter PO Number" />
                            </Form.Item>
                            <Form.Item name="modeOfTransport" label="Mode of Transport">
                                <Input placeholder="Enter Mode of Transport" />
                            </Form.Item> */}
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Form.Item name="toAddresser" initialValue={radioValue} label="Unit / Buyer /Supplier" rules={[
                                { required: true },
                            ]}>
                                <Radio.Group onChange={radioOnChange} value={radioValue} defaultValue={"unit"}>
                                    <Radio value={"unit"}>Unit</Radio>
                                    <Radio value={"supplier"}>Supplier</Radio>
                                    <Radio value={"buyer"}>Buyer</Radio>
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
                                    {radioValue === "unit" ? units.filter((i)=> i.id !== authdata.unitId).map(unit => (
                                        <Option key={unit.id} value={unit.id}>
                                            {unit.unitName}
                                        </Option>
                                    ))    : radioValue === "buyer" 
                                    ? buyers.map(buyer => (
                                        <Option key={buyer.supplierId} value={buyer.supplierId}>
                                            {buyer.supplierName}
                                        </Option>
                                    ))
                                    : suppliers.map(supplier => (
                                        <Option key={supplier.supplierId} value={supplier.supplierId}>
                                            {supplier.supplierName}
                                        </Option>
                                    )) 
                                    }
                                </Select>
                            </Form.Item>

                            {radioValue === "unit" && (
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
                                        {/* <Select
                                            showSearch
                                            placeholder="Select Received Person"
                                            optionFilterProp="children"
                                            allowClear

                                        > */}
                                            {/* {toEmployee.map(app => (
                                                <Option key={app.employeeId} value={app.employeeId}>
                                                    {app.employeeName}
                                                </Option>
                                            ))} */}
                                            <Input />
                                        {/* </Select> */}
                                    </Form.Item>
                                </>
                            )}

                            {/* <Form.Item name="vehicleNo" label="Vehicle Number">
                                <Input placeholder="Enter Vehicle Number" />
                            </Form.Item> */}

                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            {/* <Form.Item name="returnable" initialValue={returnaValue} label="Returnable" rules={[
                                { required: false },
                            ]}>
                                <Radio.Group onChange={returnOnChange} value={returnaValue} defaultValue={"N"}>
                                    <Radio value={"YES"}>Yes</Radio>
                                    <Radio value={"NO"}>No</Radio>
                                </Radio.Group>
                            </Form.Item> */}
                            <Form.Item name="purpose" label="Purpose" rules={[
                                { required: true },
                            ]}>
                                <Input placeholder="Enter Purpose" />
                            </Form.Item>
                            <Form.Item name="value" label="Value">

                                <Input placeholder="Enter Value" disabled />
                            </Form.Item>
                            <Form.Item name="status" label="Status" initialValue={StatusEnum.OPEN}>
                                <Select
                                    showSearch
                                    placeholder="Select Status"
                                    optionFilterProp="children"
                                    allowClear
                                    disabled
                                >
                                    {Object.keys(StatusEnum).map((type) => {
                                        return <Option value={StatusEnum[type]}>{StatusEnum[type]}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="buyerTeam" label="Users Buyer Team" rules={[
                                // { required: true },
                            ]}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} >
                    <Col xs={24} sm={24} md={8} lg={8} xl={6}>

                    <Form.Item name="requestedBy" label="Requested By" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Select Name"
                                    optionFilterProp="children"
                                    allowClear
                                    disabled
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
                    
                        <Col xs={24} sm={24} md={8} lg={8} xl={13}>
                            <Form.Item name="remarks" label="Remarks">
                                <TextArea placeholder="Enter Remarks" />
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
                                <Input placeholder="Enter Weight" />
                            </Form.Item>
                        </Col >
                        
                        
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
                </Form>
                <br />
                <Card>

                    <Form layout="vertical" onFinish={onItemAdd} form={itemForm}> <h1 style={{ color: '#6b54bf', fontSize: '15px', textAlign: 'left' }}>ITEM DETAILS</h1>
                        <Row gutter={14}>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                                <Button type="primary" onClick={toggleManualEntry}>
                                    {manualEntry ? 'Switch to Master Entry' : 'Switch to Manual Entry'}
                                </Button>
                            </Col>
                        </Row>
                        <Row gutter={14}>
                            {
                                manualEntry ? (
                                    <>
                                           <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                                            <Form.Item name='itemType' label='Item Type' rules={[{ required: true, message: 'Item Type required' }]}>
                                            <Select placeholder='Select Item Type'>
                                                <Option value={'garment'}>Garment</Option>
                                                <Option value={'fabric'}>Fabric</Option>
                                                <Option value={'trim'}>Trim</Option>
                                            </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                                            <Form.Item name='itemCode' label='Item Code' rules={[{ required: true, message: 'Item Code required' }]}>
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                                            <Form.Item name='itemName' label='Item Name' rules={[{ required: true, message: 'Item Name is required' }]}>
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                                            <Form.Item name='description' label='Description' rules={[{ required: false, message: 'M3 Code is required' }]}>
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 2 }}>
                                            <Form.Item name='uom' label='UOM' rules={[{ required: true, message: 'UOM is required' }]}>
                                                <Input />
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
                                    </>
                                ) : (
                                    <>
                                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                                            <Form.Item name='itemCode' label='Item Code' rules={[{ required: true, message: 'Item Code is required' }]}>
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
                                            <Form.Item name='itemName' label='Item Name' rules={[{ required: true, message: 'Item Name required' }]}>
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                                            <Form.Item name='itemType' label='Item Type' rules={[{ required: true, message: 'Item Type required' }]}>
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                                            <Form.Item name='description' label='Description' rules={[{ required: false, message: 'Description is required' }]}>
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
                                    </>
                                )
                            }

                        </Row>
                        <Row justify={'end'}>
                            <Button disabled={addVisible} type='primary' htmlType="submit">{btnType}</Button>
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