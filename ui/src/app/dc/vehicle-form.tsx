import { faL } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, DatePicker, DatePickerProps, Form, Input, Row, Select } from "antd";
import { useState } from "react";
export interface VehicleFormProps {
    updateDetails: any;
    isUpdate: boolean;
    veichleData: any;
    closeForm: any;
}
const VehicleForm = (props: VehicleFormProps) => {
    const Option = Select;
    const [form] = Form.useForm();
    const [selectedType, setSelectedType] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(null);

    const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
        console.log('onChange:', dateStr);
    };

    const handleNetWeightMeasurements = () => {
        return <Form.Item name={"netWeightMeasurements"} noStyle>
            <Select defaultValue="kg" style={{ width: "180%" }}>
                <Option value="g">g</Option>
                <Option value="kg">kg</Option>
                <Option value="lb">lb</Option>
                <Option value="oz">oz</Option>
            </Select>
        </Form.Item>
    }

    const handleGrossWeightMeasurements = () => {
        return <Form.Item name={"netGrossMeasurements"} noStyle>
            <Select defaultValue="kg" style={{ width: "180%" }}>
                <Option value="g">g</Option>
                <Option value="kg">kg</Option>
                <Option value="lb">lb</Option>
                <Option value="oz">oz</Option>
            </Select>
        </Form.Item>
    }

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    const handleNumberChange = (value: string) => {
        setSelectedNumber(value);
    };

    const handleReset = () => {
        form.resetFields()
        setSelectedType(false)
        setSelectedNumber(false)
    }

    return (
        <>
            <Card title='Veichle'>
                <Form layout="vertical" form={form}>
                    <Row gutter={[24, 8]}>
                        <Col xs={24} sm={24} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: "1%" }}>
                            <Form.Item label="Type" name="type" required>
                                <Select placeholder="Select Type" onChange={handleTypeChange}>
                                    <Option value="option1">Option 1</Option>
                                    <Option value="option2">Option 2</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: "1%" }}>
                            <Form.Item label="Number" name="number" required>
                                <Select placeholder="Select Number" onChange={handleNumberChange}>
                                    <Option value="number1">Number 1</Option>
                                    <Option value="number2">Number 2</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {selectedType && selectedNumber && (
                        <Row gutter={[24, 8]}>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="Vehicle Number" name="vehicleNUmber" required>
                                    <Input placeholder='Enter vehicle Number' />

                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="Driver Name" name="driverName" required>
                                    <Input placeholder='Enter Driver Name' />

                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="Driver phone" name="driverPhone" required>
                                    <Input placeholder='Enter Driver phone' />
                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label=" Invoice No" name="invoiceNo" required>
                                    <Input placeholder='Enter Invoice No' />

                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="Security Person" name="securityPerson" required>
                                    <Input placeholder='Enter Security Person' />

                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="In Time" name="inTime" >
                                    <DatePicker
                                        showTime onChange={onChange}
                                        style={{ width: '100%' }}
                                    />

                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="Out Time" name="outTime" >
                                    <DatePicker
                                        showTime onChange={onChange}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="Net Weight" name="netWeight" >
                                    <Input addonAfter={handleNetWeightMeasurements()} />
                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="Gross Weight" name="grossWeight" >
                                    <Input addonAfter={handleGrossWeightMeasurements()} />
                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label=" Cus Dec No" name="cusDecNo" >
                                    <Input placeholder='selct Cus DecNo' />

                                </Form.Item>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                                <Form.Item label="Container No" name="containerNo" >
                                    <Input placeholder='selct Container No' />

                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                    <Row style={{ paddingTop: '30px' }} justify={'end'}>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 4 }}
                            lg={{ span: 4 }}
                            xl={{ span: 2 }}
                        >
                            <Button
                                type="primary"
                            // onClick={onSubmit}
                            // disabled={itemTableData.length > 0 ? false : true}
                            >
                                Submit
                            </Button>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 4 }}
                            lg={{ span: 4 }}
                            xl={{ span: 2 }}
                        >
                            <Button
                                onClick={handleReset}
                            >Reset</Button>
                        </Col>
                    </Row>

                </Form>
            </Card>
        </>
    )


}

export default VehicleForm;