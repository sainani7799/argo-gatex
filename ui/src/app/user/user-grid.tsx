
import { DeleteOutlined, EditOutlined, RightSquareOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, Switch, message, Divider, Drawer } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserManagementServices } from 'libs/shared-services/src';
import { CreateUserDto } from 'libs/shared-models';
import UserForm from './user-form';



const UserFormGrid = () => {
    const [data, setData] = useState([]);

    const [responseData, setResponseData] = useState<any>([]);
    const [selectedUsers, setSelectedUsers] = useState<any>(undefined);
    const service = new UserManagementServices();
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { Search } = Input;

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        service.getUsers().then((res: any) => {
            console.log(res, '................................')
            if (res) {
                setResponseData(res)
            }
            setLoading(false);
        });
    };
    const deleteUser = (dto: CreateUserDto) => {
        dto.isActive = dto.isActive ? false : true;
        service.activateOrDeactivateUser(dto).then(res => {
            console.log(res);
            if (res.status) {
                message.success('Success');
            } else {
                message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }

    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const columnsSkelton: any = [

        {
            key: "1",
            title: "User Name",
            dataIndex: "userName",
        },
        {
            key: "2",
            title: "Employee Name",
            dataIndex: "employee_name",
        },
        {
            key: "3",
            title: "Employee Code",
            dataIndex: "employee_code",
        },
        {
            key: "4",
            title: "Email",
            dataIndex: "email_id",
        },
        {
            key: "5",
            title: "Unit",
            dataIndex: "unit_name",
        },
        {
            key: "6",
            title: "Actions", 
            dataIndex: 'action',
            align: "center",
            render: (text, rowData) => (
                <span>
                    <Popconfirm
                        onConfirm={e => { deleteUser(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to Deactivate user ?'
                                : 'Are you sure to Activate user ?'
                        }
                    >
                        <Switch size="default"
                            className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.isActive}
                        />

                    </Popconfirm>
                </span>

            )
        },
    ]
   

    return (
        <div>
            <Card
                title={<span style={{ color: "white" }}>User Data</span>}
                extra={
                    (
                        <Link to="/form9">
                            <span style={{ color: "white" }}>
                                <Button>Create </Button>{" "}
                            </span>
                        </Link>
                    )
                }

                headStyle={{ backgroundColor: '#7d33a2', color: 'black' }}>
                {/* <Input.Search placeholder="Search" allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />, */}

                <Table columns={columnsSkelton} dataSource={responseData}></Table>
                <Drawer bodyStyle={{ paddingBottom: 80 }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
                    onClose={closeDrawer} visible={drawerVisible} closable={true}>
                    <Card headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }} size='small'>
                        <UserForm key={Date.now()}
                        // updateDetails={updateSuppliers}
                        isUpdate={true}
                        userData={selectedUsers}
                        closeForm={closeDrawer} />
                    </Card>
                </Drawer>
            </Card>

        </div>
    )
}

export default UserFormGrid;