import { Form, Input, Button, Select, Card, message, Col, Row, theme, Radio, RadioChangeEvent } from 'antd';
import { WarehouseService, UnitService } from 'libs/shared-services';
import React, { useEffect, useState } from 'react';
const { Option } = Select;

const DCForm = () => {

    const [radioValue, setRadioValue] = useState("Unit");
    const [returnaValue, setReturnaValue] = useState("Y");

    const [form] = Form.useForm();
    const saveData = (data: any) => {
        console.log(data.unitOrSupplier);
    };

    const radioOnChange = (e: RadioChangeEvent) => {
        setRadioValue(e.target.value);
    };

    const returnOnChange = (e: RadioChangeEvent) => {
        setReturnaValue(e.target.value);
    };

    return (
        <Form
            form={form}
            onFinish={saveData}
            layout='vertical'
            style={{ width: '100%', margin: '0px auto 0px auto' }}
        >
            <Card title={<span style={{ color: 'white' }}>DC Form</span>}
                style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={<Button className="panel_button" htmlType="submit"> Save </Button>} >
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
    )
};

export default DCForm;