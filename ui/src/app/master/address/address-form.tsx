import { CreateAddressDto, CreateEmployeeDto } from 'libs/shared-models/src';
import {  AddressService, DepartmentService, DesignationService, EmployeeService, UnitService } from 'libs/shared-services/src';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, message, theme } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { from } from 'rxjs';
const { useToken } = theme;
const { Option } = Select;

export interface AddressFormProps {
    addressData: CreateAddressDto;
    updateDetails: (address: AddressFormProps) => void;
    isUpdate: boolean;
    closeForm: () => void;
}

const AddressForm = (props: AddressFormProps) => {
    const { token: { colorPrimary } } = useToken()
    const [form] = Form.useForm();
    let navigate = useNavigate()
    const [designation, setDesignation] = useState<any[]>([]);
    const [department, setDepartment] = useState<any[]>([]);
    const [section, setSection] = useState<any[]>([]);
    const [unit, setUnit] = useState<any[]>([]);
    const [employeeNames, setEmployeeNames] = useState<any[]>([]);
    const designationService = new DesignationService();
    const unitService = new UnitService();
    const departmentService = new DepartmentService();
    const service = new AddressService;

    const onReset = () => {
        form.resetFields();
    };


    useEffect(() => {
        getAllUnits();

    }, []);



    const getAllUnits = () => {
        unitService.getAllUnits().then((res) => {
            if (res) {
                setUnit(res.data);
                console.log(res.data)
            }
        })
    }


    const save = (addressData: CreateAddressDto) => {
        service.createAddress(addressData).then(res => {
            if (res) {
                onReset();
                message.success('Created Successfully')
                navigate('/employee-view')
            } else {
                console.log(res.internalMessage, "**********");
                message.error('Not Created')
            }
        }).catch(err => {
            message.error('')
        })
    }

    const saveData = (values: CreateEmployeeDto) => {
        // console.log('va', values);
        // if (props.isUpdate) {
        //     props.updateDetails(values);
        // } else {
        //     save(values);
        // }
    };

    return (
        <Card title={<span style={{ color: 'white' }}>Employee Form</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={props.isUpdate == true ? "" : <Link to='/employee-view' ><span style={{ color: 'white' }} ><Button className='panel_button' >View </Button> </span></Link>} >
            <Form
                form={form}
                initialValues={props.addressData}
                onFinish={saveData}
                layout='vertical'
            >

                <Row gutter={24}   >
                    <Form.Item name="addressId" style={{ display: "none" }}>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="addresser" label="Address Type"
                        rules={[
                            { required: true },
                        ]}>
                            <Input placeholder="select addresser" />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="addressName" label="Name"
                        rules={[
                            { required: true },
                        ]}>
                            <Input placeholder=" select Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="cardNo" label="Card No"
                        rules={[
                            { required: true },
                        ]}>
                            <Input placeholder=" Enter Card No" />
                        </Form.Item>
                    </Col>
                   


                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="gender" label="Gender:"
                            rules={[
                                { required: true },
                            ]}
                        >
                            <Select placeholder=" Select Gender" style={{ width: 210 }}
                                allowClear
                                options={[
                                    { value: 'male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="maritalStatus" label="Marital Status">
                            <Select
                                showSearch
                                placeholder="Select Marital Status"
                            >
                                <Option key={1} value={'Married'}>Married</Option>
                                <Option key={2} value={'UnMarried'}>UnMarried </Option>
                                <Option key={3} value={'Others'}>Others </Option>
                            </Select>
                        </Form.Item>
                    </Col>


                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item
                            name="mobileNumber"
                            label="Mobile Number"
                            rules={[
                                { required: true, message: ' Valid Mobile No is required', min: 10, max: 12 },
                                {
                                    pattern: /^[0-9]*$/,
                                    message: `Don't Allow letters and Spaces`
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="emailId" label="Email Id:"
                            rules={[
                                { required: true },
                            ]}
                        >
                            <Input placeholder=" Enter Email Id" />
                        </Form.Item>
                        {/* <Select placeholder=" Enter Employee Code:" style={{ width: 150 }}> */}                        {/* </Select> */}
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="designation" label="Designation"
                            rules={[
                                { required: true },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Select Designation "
                                optionFilterProp="children"
                                dropdownMatchSelectWidth={false}
                                allowClear
                            >
                                {designation.map((rec: any) => {
                                    return (
                                        <Option key={rec.designationId} value={rec.designationId}>
                                            {rec.designation}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="department" label="Department" rules={[
                                { required: true },
                            ]}>
                            <Select
                                showSearch
                                placeholder="Select Department "
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                                // onChange={getAllSectionsForDrop}
                                allowClear
                            >
                                {department.map((rec: any) => {
                                    return (
                                        <Option key={rec.id} value={rec.id}>
                                            {rec.departmentName}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="section" label="Section" rules={[
                                { required: true },
                            ]}>
                            <Select
                                showSearch
                                placeholder="Select Section "
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                                allowClear
                            >
                                {section.map((rec: any) => {
                                    return (
                                        <Option key={rec.section_id} value={rec.section_id}>
                                            {rec.section}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="unit" label="Unit"
                            rules={[
                                { required: true },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Select Unit "
                                optionFilterProp="children"
                                allowClear
                            >
                                {unit.map((rec: any) => {
                                    return (
                                        <Option key={rec.unitCode} value={rec.unitCode}>
                                            {rec.unitName}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="address" label="Address" >
                            <TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="end">
                    <Col span={40} style={{ textAlign: 'right' }}>

                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        {(props.isUpdate !== true) &&
                            <Button htmlType="button" style={{ margin: '0 14px' }} onClick={onReset}>
                                Reset
                            </Button>}
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default AddressForm;