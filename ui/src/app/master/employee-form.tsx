import { CreateEmployeeDto } from 'libs/shared-models/src';
import {  DepartmentService, DesignationService, EmployeeService, UnitService } from 'libs/shared-services/src';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, message, theme } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { from } from 'rxjs';
const { useToken } = theme;
const { Option } = Select;

export interface EmployeeFormProps {
    employeeData: CreateEmployeeDto;
    updateDetails: (hrms: CreateEmployeeDto) => void;
    isUpdate: boolean;
    closeForm: () => void;
}

const EmployeeForm = (props: EmployeeFormProps) => {
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
    const service = new EmployeeService;

    const onReset = () => {
        form.resetFields();
    };


    useEffect(() => {
        getAllDesignation();
        getAllDepartments();
        getAllUnits();
        fetchEmployeeNames();

    }, []);

    const getAllDesignation = () => {
        designationService.getAllDesignations().then((res) => {
            if (res) {
                setDesignation(res.data);
            }
        })
    }

    const getAllDepartments = () => {
        departmentService.getAllDepartments().then((res) => {
            if (res) {
                setDepartment(res.data);
            }
        })
    }
    const getAllSectionsForDrop = (departmentId: number) => {
        // console.log(departmentId ,'iddd')
        const department = form.getFieldValue('department');
        const Req = {departmentId : department}
        departmentService.getAllSectionsForDrop(Req).then((res) => {
            if (res) {
                setSection(res.data);
            }
        })
    }
    const getAllUnits = () => {
        unitService.getAllUnits().then((res) => {
            if (res) {
                setUnit(res.data);
            }
        })
    }

    const fetchEmployeeNames = () => {
        service.getAllEmployees().then((res) => {
            if (Array.isArray(res)) {
                setEmployeeNames(res); // Make sure 'res' is an array
                // Rest of your code
            }
        })
    }

    const save = (employeeData: CreateEmployeeDto) => {
        service.createEmployee(employeeData).then(res => {
            if (res.status) {
                onReset();
                message.success(res.internalMessage)
                navigate('/employee-view')
            } else {
                message.error(res.internalMessage)
            }
        }).catch(err => {
            message.error('')
        })
    }

    const saveData = (values: CreateEmployeeDto) => {
        if (props.isUpdate) {
            props.updateDetails(values);
        } else {
            save(values);
        }
    };
// console.log(props.employeeData)
    return (
        <Card title={<span style={{ color: 'white' }}>Employee Form</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={props.isUpdate == true ? "" : <Link to='/employee-view' ><span style={{ color: 'white' }} ><Button className='panel_button' >Back </Button> </span></Link>} >
            <Form
                form={form}
                initialValues={props.employeeData}
                onFinish={saveData}
                layout='vertical'
            >
                <Row gutter={24}   >
                    <Form.Item name="employeeId" style={{ display: "none" }}>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="employeeName" label="Employee Name"
                        rules={[
                            { required: true },
                        ]}>
                            <Input placeholder=" Enter Employee Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="employeeCode" label="Employee Code"
                        rules={[
                            { required: true },
                        ]}>
                            <Input placeholder=" Enter Employee Code" />
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="cardNo" label="Card No"
                        rules={[
                            { required: props.isUpdate ?  false : true },
                        ]}>
                            <Input placeholder=" Enter Card No" />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="dateOfBirth" label="Date OF Birth"  >
                            <DatePicker
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>


                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="gender" label="Gender:"
                            rules={[
                                { required: props.isUpdate ? true : false  },
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
                                {/* <Option key={3} value={'Others'}>Others </Option> */}
                            </Select>
                        </Form.Item>
                    </Col>


                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item
                            name="mobileNumber"
                            label="Mobile Number"
                            rules={[
                                { required: false, message: ' Valid Mobile No is required', min: 10, max: 12 },
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
                                { required: props.isUpdate ? false : true  },
                            ]}
                        >
                            <Input placeholder=" Enter Email Id" />
                        </Form.Item>
                        {/* <Select placeholder=" Enter Employee Code:" style={{ width: 150 }}> */}                        {/* </Select> */}
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="designation" label="Designation"
                            rules={[
                                { required: props.isUpdate ?  false : true  },
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
                                { required: props.isUpdate ? false : true  },
                            ]}>
                            <Select
                                showSearch
                                placeholder="Select Department "
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                                // onChange={(val) => getAllSectionsForDrop(Number(val))}
                                onChange={getAllSectionsForDrop}
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
                                { required: false },
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

export default EmployeeForm;