import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Card, message } from 'antd';
import { EmployeeService, UserManagementServices } from 'libs/shared-services/src'
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;


const UserForm = () => {
    const userService = new UserManagementServices();
    const [employeeNames, setEmployeeNames] = useState<any[]>([]);
    const service = new EmployeeService();
    const navigate = useNavigate();


    const clickHandler = () => { };

    useEffect(() => {
        fetchEmployeeNames();
    }, []);

    const fetchEmployeeNames = () => {
        service.getAllEmployees().then((res) => {
            if (res) {
                setEmployeeNames(res.data)
            }
        })
    }

    const onFinish = (val: any) => {
        userService.register(val).then(res => {
            if (res) {
                message.success('Created successfully')
                navigate('/users')
            } else {
                message.error('Something went wrong')
            }
        })
    }

    const [form] = Form.useForm();

    const handleReset = () => {
        form.resetFields();

    };

    return (
        <Card type="inner" title="User-Form"
            headStyle={{ backgroundColor: '#7d33a2', color: 'white' }}extra={ <Link to='/users' ><span style={{ color: 'white' }} ><Button className='panel_button' >View </Button> </span></Link>}>
            <Form
                name="user-form"
                autoComplete='off'
                onFinish={onFinish}
                layout="vertical"
                style={{ maxWidth: '400px', margin: '0 auto' }}
                form={form}
            >
                <Card>
                    <Form.Item name="userId" style={{ display: "none" }}>
                        <Input hidden />
                    </Form.Item>
                    <Form.Item
                        label="Username"
                        name="userName"
                        rules={[{ required: true, message: 'Please enter your username' }]}
                    >
                        <Input placeholder="Enter your username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>
                    <Form.Item
                        label="  Employee Name:"
                        name="employeeId"
                        rules={[
                            { required: true, message: "Please Enter Employee" }
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select Employee Name "
                            optionFilterProp="children"
                            allowClear
                        >
                            {employeeNames.map((rec: any) => {
                                return (
                                    <Option key={rec.employeeId} value={rec.employeeId}>
                                        {rec.employeeName}
                                    </Option>
                                )
                            })}
                        </Select>

                        {/* <Input placeholder='Enter Paid To Employee' /> */}
                    </Form.Item>


                    {/* <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please enter a role' }]}
                    >
                        <Input placeholder="Enter your Role" />
                    </Form.Item> */}


                    <Form.Item>
                        <Button type='primary' htmlType="submit" style={{ width: '100%', backgroundColor: '#7d33a2' }}>
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type='text' htmlType="reset" onClick={handleReset} style={{ width: '100%' }}>
                            Reset
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </Card>
    );
};

export default UserForm;
