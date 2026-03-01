import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Card, message } from 'antd';
import { BuyerTeamService, EmployeeService, RoleService, UserManagementServices } from '@gatex/shared-services';
import { Link, useNavigate } from 'react-router-dom';
import { CreateUserDto } from '@gatex/shared-models';

const { Option } = Select;

export interface UserFormProps {
    userData: CreateUserDto;
    updateDetails: (userData: CreateUserDto) => void;
    isUpdate: boolean;
    closeForm: () => void;
}
const UserForm = (props: UserFormProps) => {
    const userService = new UserManagementServices();
    const [employeeNames, setEmployeeNames] = useState<any[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(undefined);
    const service = new EmployeeService();
    const roleServices = new RoleService()
    const [roleData, setRoleData] = useState<any>([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();
  const [buyersTeamData , setBuyerTeamData] = useState([])
  const buyerService = new BuyerTeamService();


    console.log(props.userData)
    const handleEmployeeIdChange = (value) => {
        setSelectedEmployeeId(value);
        const selectedEmployee = employeeNames.find((employee) => employee.employeeId === value);
        form.setFieldsValue({
            cardNo: selectedEmployee ? selectedEmployee.cardNo : undefined,
            unitId: selectedEmployee ? selectedEmployee.unitId : undefined,

        });
    }

    useEffect(() => {
        fetchEmployeeNames();
        getAllRoleEntity();
        getAllbuyerTeam();
    }, []);

    const fetchEmployeeNames = () => {
        service.getAllEmployees().then((res) => {
            if (res) {
                setEmployeeNames(res.data)
            }
        })
    }

    const getAllbuyerTeam = () => {
        buyerService.getAllActiveBuyer().then(res => {
            console.log(res)
            if (res) {
              setBuyerTeamData(res.data);
            }
        });
    }

    const getAllRoleEntity = () => {
        roleServices.getAllRoleEntity().then((res) => {
            if (res) {
                setRoleData(res)
                // console.log(res)
            }
        })
    }

    const onFinish = (val: any) => {
        form.validateFields(val).then(res => {
            console.log(val, 'valll')
            userService.register(val).then(res => {
                if (res.status) {
                    message.success(res.internalMessage)
                    navigate('/users')
                } else {
                    message.error(res.internalMessage)
                }
            })
        })
    }

    const handleReset = () => {
        form.resetFields();
    };

    const saveData = (values: any) => {
        if (props.isUpdate) {
            props.updateDetails(values);
        } else {
            onFinish(values);
        }
    };

    return (
        <Card type="inner" title="User-Form"
            headStyle={{ backgroundColor: '#047595', color: 'white' }}
            extra={<Link to='/users' >
                {props.isUpdate === false && (
                    <span style={{ color: 'white' }} >
                        <Button className='panel_button' >Back </Button>
                    </span>
                )}
            </Link>}>
            <Form
                name="user-form"
                autoComplete='off'
                onFinish={saveData}
                layout="vertical"
                style={{ maxWidth: '400px', margin: '0 auto' }}
                form={form}
                initialValues={props.userData}
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
                            { pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[a-z]).{6,}$/, message: 'Password must contain at least one uppercase letter and one special character' },
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
                            onChange={handleEmployeeIdChange}
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
                    <Form.Item
                        label=" Card No:"
                        name="cardNo"
                    >
                        <Select
                            showSearch
                            placeholder="Select Card No "
                            optionFilterProp="children"
                            allowClear
                            disabled={selectedEmployeeId}
                        >
                            {employeeNames.map((rec: any) => {
                                return (
                                    <Option key={rec.employeeId} value={rec.cardNo}>
                                        {rec.cardNo}
                                    </Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label=" Unit:"
                        name="unitId"
                    >
                        <Select
                            showSearch
                            placeholder="unit"
                            optionFilterProp="children"
                            allowClear
                            disabled={selectedEmployeeId}
                        >
                            {[...new Set(employeeNames.map((rec: any) => rec.unitId))].map((uniqueUnitId) => {
                                const rec = employeeNames.find((rec: any) => rec.unitId === uniqueUnitId);
                                return (
                                    <Option key={rec.employeeId} value={rec.unitId}>
                                        {rec.unit}
                                    </Option>
                                )
                            })}

                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="roleId"
                        rules={[
                            { required: true, message: "Please Select Role" }
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select Role  "
                            optionFilterProp="children"
                            allowClear
                        >
                            {roleData && roleData.length > 0 ? (
                                roleData.map((rec: any) => (
                                    <Option key={rec.roleId} value={rec.roleId}>
                                        {rec.roleName}
                                    </Option>
                                ))
                            ) : (
                                <Option value={null} disabled>
                                    No Roles available
                                </Option>
                            )}
                        </Select>

                        {/* <Input placeholder='Enter Paid To Employee' /> */}
                    </Form.Item>
                    <Form.Item
                        label="Buyers Team"
                        name="buyerTeam"
                        rules={[
                            { required: true, message: "Please Select BUyer" }
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select Buyer Team  "
                            optionFilterProp="children"
                            allowClear
                        >
                             {buyersTeamData?.map(e => {
                        return (
                          <Option key={e.buyerTeamId} value={e.buyerTeamId}>
                            {e.buyerTeam}
                          </Option>
                        )
                      })}
                            {/* <Option value={'eddie'} >{'Eddie Buyer'}</Option>
                            <Option value={'denim'} >{'H & M denim'}</Option>
                            <Option value={'nonDenim'} >{'H & M NonDenim'}</Option> */}
                        </Select>

                        {/* <Input placeholder='Enter Paid To Employee' /> */}
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType="submit" style={{ width: '100%', backgroundColor: '#047595' }}>
                            Submit
                        </Button>
                    </Form.Item>
                    {props.isUpdate === false && (
                        <Form.Item>
                            <Button type='text' htmlType="reset" onClick={handleReset} style={{ width: '100%' }}>
                                Reset
                            </Button>
                        </Form.Item>
                    )}
                </Card>
            </Form>
        </Card>
    );
};

export default UserForm;