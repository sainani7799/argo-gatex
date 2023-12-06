import { Form, Input, Button, Select, Card, message, Col, Row, theme, Radio, RadioChangeEvent } from 'antd';
import { WarehouseService, UnitService, SupplierService, ApprovalUserService, DepartmentService, ItemService } from 'libs/shared-services';
import React, { useEffect, useState } from 'react';
const { Option } = Select;

const DCForm = () => {

    const warehouseService = new WarehouseService();
    const unitService = new UnitService();
    const supplierService = new SupplierService();
    const approvedService = new ApprovalUserService();
    const departmentService = new DepartmentService();
    const [units, setUnits] = useState<any>([]);
    const [deps, setDeps] = useState<any>([]);
    const [suppliers, setSuppliers] = useState<any>([]);
    const [warehouses, setWarehouses] = useState<any>([]);
    const [radioValue, setRadioValue] = useState("Unit");
    const [returnaValue, setReturnaValue] = useState("Y");
    const [approval, setApproval] = useState<any>([]);

    const itemService = new ItemService()
    const [form] = Form.useForm();

    const [itemData, setItemData] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState(null);



    const saveData = (data: any) => {
        console.log(data.unitOrSupplier);
    };

    useEffect(() => {
        getWarehouses();
        getUnits();
        getSuppliers();
        getDeps();
        getApprovedUsers();
    }, [])

    const getWarehouses = () => {
        warehouseService.getAllWarehouse().then(res => {
            if (res) {
                console.log(res);
                setWarehouses(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getUnits = () => {
        unitService.getAllUnits().then(res => {
            if (res) {
                console.log(res);
                setUnits(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getSuppliers = () => {
        supplierService.getAllSuppliers().then(res => {
            if (res) {
                console.log(res);
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
                console.log(res);
                setDeps(res.data);
            }
        })
    };

    const getApprovedUsers = () => {
        approvedService.getAllApprovalUser().then(res => {
            if (res) {
                console.log("This Is Approval");
                console.log(res);
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

    useEffect(() => {
        getAllItems();
    }, [])

    const getAllItems = () => {
        itemService.getAllItems().then((res) => {
            if (res) {
                setItemData(res.data);
                // console.log(res.data)
            }
        })
    }
    const handleItems = async (value) => {
        const itemDetails = await itemService.getAllItems();
        console.log(itemDetails)
        if (itemDetails && itemDetails.length > 0) {
            setSelectedItem(itemDetails);
            form.setFieldsValue({
                itemName: itemDetails.itemName,
            });
        } else {
            console.error('No item details found');
        }
    };

    return (
        <Card title={<span style={{ color: 'white' }}>DC Form</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={<Button className="panel_button" htmlType="submit"> Save </Button>} >
            <Form
                form={form}
                onFinish={saveData}
                layout='vertical'
                style={{ width: '100%', margin: '0px auto 0px auto' }}
            >
                <Card >
                    <Row gutter={24} style={{ width: "100%", justifyContent: "space-around" }}>
                        <Col style={{ width: "30%" }}>
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
                            <Form.Item name="unitId" label="Unit" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Select Unit "
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {units.map(unit => {
                                        return (
                                            <Option key={unit.id} value={unit.id}>
                                                {unit.unitName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="dept" label="Dept." rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Select Dept "
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {deps.map(dep => {
                                        return (
                                            <Option key={dep.id} value={dep.id}>
                                                {dep.departmentName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="PONo" label="PO Number">
                                <Input placeholder="Enter PO Number" />
                            </Form.Item>
                            <Form.Item name="modeOfTransport" label="Mode of Transport">
                                <Input placeholder="Enter Mode of Transport" />
                            </Form.Item>
                        </Col>
                        <Col style={{ width: "30%" }}>
                            <Form.Item label=" ">
                            </Form.Item>
                            <Form.Item name="unitOrSupplier" label="Unit / Supplier" rules={[
                                { required: true },
                            ]}>
                                <Radio.Group onChange={radioOnChange} value={radioValue} defaultValue={"Unit"}>
                                    <Radio value={"Unit"}>Unit</Radio>
                                    <Radio value={"Supplier"}>Supplier</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="to" label="To" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder={"Select " + radioValue}
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {radioValue == "Unit" ? units.map(unit => {
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
                                <Input placeholder="Enter Weight" />
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
                                    <Option key="Open" value="Open">
                                        Open
                                    </Option>
                                    <Option key="In-Progress" value="In-Progress">
                                        In-Progress
                                    </Option>
                                    <Option key="Closed" value="Closed">
                                        Closed
                                    </Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="requestedBy" label="Requested By" rules={[
                                { required: true },
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Select User"
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {approval.map(app => {
                                        return (
                                            <Option key={app.approvedId} value={app.approvedId}>
                                                {app.approvedUserName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{ width: '100%', justifyContent: 'space-around', margin: "10px" }}>
                        <Col style={{ width: "80%" }}>
                            <Form.Item name="remarks" label="Remarks">
                                <Input placeholder="Enter Remarks" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Form>
            <br />
            <Card>

                <Form layout="vertical" > <h1 style={{ color: '#6b54bf', fontSize: '15px', textAlign: 'left' }}>Item DETAILS</h1>
                    <Row gutter={24}>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                            <Form.Item name='itemCode' label='Item Code' rules={[{ required: true, message: 'Item Code' }]}>
                                <Select showSearch allowClear optionFilterProp="children" placeholder='Select Item Code' onChange={handleItems}>
                                    {itemData.map(e => {
                                        return (
                                            <Option key={e.itemId} value={e.itemCode}>{e.itemCode} - {e.itemName}</Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                            <Form.Item name='itemName' label='Item Name' rules={[{ required: true, message: 'M3 Code is required' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                            <Form.Item name='itemName' label='Item Name' rules={[{ required: true, message: 'M3 Code is required' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                            <Form.Item name='description' label='Description' rules={[{ required: true, message: 'M3 Code is required' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                            <Form.Item name='uom' label='UOM' rules={[{ required: true, message: 'M3 Code is required' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                            <Form.Item name='qty' label='Qty' rules={[{ required: true, message: 'M3 Code is required' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                            <Form.Item name='rate' label='Rate' rules={[{ required: true, message: 'M3 Code is required' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                            <Form.Item name='amount' label='Amount' rules={[{ required: true, message: 'M3 Code is required' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Card />


            </Card>
        </Card>

    )
};

export default DCForm;