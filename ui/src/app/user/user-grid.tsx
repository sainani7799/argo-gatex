
import { DeleteOutlined, EditOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, Switch, message, Divider, Drawer } from 'antd';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserManagementServices } from 'libs/shared-services/src';
import { CreateUserDto } from 'libs/shared-models';
import UserForm from './user-form';
import Highlighter from 'react-highlight-words'


const UserFormGrid = () => {
    const [data, setData] = useState([]);

    const [responseData, setResponseData] = useState<any>([]);
    const [selectedUsers, setSelectedUsers] = useState<any>(undefined);
    const service = new UserManagementServices();
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const { Search } = Input;

    useEffect(() => {
        getUsers();
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button size="small" style={{ width: 90 }}
                    onClick={() => {
                        handleReset(clearFilters)
                        setSearchedColumn(dataIndex);
                        confirm({ closeDropdown: true });
                    }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) { setTimeout(() => searchInput.current.select()); }
        },
        render: text =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : text
            )
                : null
    })

    const getUsers = () => {
        service.getUsers().then((res: any) => {
            if (res) {
                setResponseData(res)
            }
            setLoading(false);
        });
    };
    const deleteUser = (dto: CreateUserDto) => {
        // dto.isActive = dto.isActive ? false : true;
        service.activateOrDeactivateUser(dto).then(res => {
            console.log(res);
            if (res.status) {
                message.success(res.internalMessage);
                getUsers()
            } else {
                message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }
    const updateUser =(val:CreateUserDto)=>{
        service.updateUser(val).then((res)=>{
            if(res.status){
                message.success('Updated Successfully');
                setDrawerVisible(false);
                getUsers()
            }else{
                message.error(res.internalMessage);
            }
        })
    }
    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const openFormWithData=(viewData: CreateUserDto)=>{
        console.log(viewData, 'view data')
        setDrawerVisible(true);
        setSelectedUsers(viewData);
    }

    const columnsSkelton: any = [

        {
            key: "1",
            title: "User Name",
            dataIndex: "userName",
            ...getColumnSearchProps('userName'),
        },
        {
            key: "2",
            title: "Employee Name",
            dataIndex: "employee_name",
            ...getColumnSearchProps('employee_name'),
        },
        {
            key: "3",
            title: "Employee Code",
            dataIndex: "empCode",
            ...getColumnSearchProps('empCode'),
        },
        {
            key: "4",
            title: "Email",
            dataIndex: "email_id",
            ...getColumnSearchProps('email_id'),
        },
        {
            key: "5",
            title: "Unit",
            dataIndex: "unit_name",
            ...getColumnSearchProps('unit_name'),
        },
        {
            key: "5",
            title: "Role",
            dataIndex: "role",
            ...getColumnSearchProps('role'),
        },
        {
            key: "5",
            title: "Buyers Team",
            dataIndex: "buyerTeam",
            ...getColumnSearchProps('buyerTeam'),
        },
        {
            key: "6",
            title: "Actions", 
            dataIndex: 'action',
            align: "center",
            render: (text, rowData) => (
                <span>
                <EditOutlined  className={'editSamplTypeIcon'}  type="edit" 
                    onClick={() => {
                      if (rowData.isActive) {
                        openFormWithData(rowData);
                      } else {
                        message.error('You Cannot Edit Deactivated User');
                      }
                    }}
                    style={{ color: '#1890ff', fontSize: '14px' }}
                  /> 
                    <Divider type="vertical" />
                    <Popconfirm
                        onConfirm={e => { deleteUser(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to Delete user ?'
                                : 'Are you sure to Activate user ?'
                        }
                    >
                        <DeleteOutlined />

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
                        updateDetails={updateUser}
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