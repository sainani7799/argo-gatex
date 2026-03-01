import { DeleteOutlined, EditOutlined, MoreOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { CreateEmployeeDto } from '@gatex/shared-models'
import { EmployeeService } from '@gatex/shared-services'
import { Button, Card, Drawer, Dropdown, Input, Menu, Popconfirm, Table, Tooltip, message } from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import EmployeeForm from './employee-form'

const EmployeeGrid = () => {
    const service = new EmployeeService;
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [employeeData, setEmployeeData] = useState<any[]>([]);
    const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>(undefined);
    const [page, setPage] = React.useState(1);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        getAllEmployees();
    }, []);


    const getAllEmployees = () => {
        setLoading(true)
        service.getAllEmployees().then(res => {
            if (res) {
                setEmployeeData(res.data);
            } else {
                if (res.data) {
                    setEmployeeData([]);
                    // AlertMessages.getErrorMessage(res.internalMessage);
                } else {
                    //  AlertMessages.getErrorMessage(res.internalMessage);
                }
            }
        }).catch(err => {
            setEmployeeData([]);
            // AlertMessages.getErrorMessage(err.message);
        }).finally(() => {
            setLoading(false)
        })
    }

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
                    style={{ backgroundColor: "#047595", color: "white", width: 90, marginRight: 8 }}
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
            <SearchOutlined type="search" style={{ color: filtered ? 'white' : "white" }} />
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

    const updateEmployee = (val: CreateEmployeeDto) => {
        service.updateEmployee(val).then((res) => {
            if (res.status) {
                message.success('Updated Successfully');
                setDrawerVisible(false);
                getAllEmployees()
            } else {
                message.error(res.internalMessage);
            }
        })
    }

    const deactiveEmployee = (val: any) => {
        service.deactiveEmployee(val).then((res) => {
            if (res.status) {
                message.success(res.internalMessage);
                getAllEmployees()
            } else {
                message.error(res.internalMessage);
            }
        })
    }

    const openFormWithData = (viewData: CreateEmployeeDto) => {
        setDrawerVisible(true);
        setSelectedEmployeeData(viewData);
    }

    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const columnsSkelton: any = [
        {
            title: 'S No',
            key: 'sno',
            width: 60,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            responsive: ['sm'],
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            align: 'center',
            ...getColumnSearchProps('unit'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            align: 'center',
            ...getColumnSearchProps('employeeName'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            align: 'center',
            ...getColumnSearchProps('employeeCode'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Card No',
            dataIndex: 'cardNo',
            align: 'center',
            ...getColumnSearchProps('cardNo'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Department',
            dataIndex: 'departmentName',
            align: 'center',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Section',
            dataIndex: 'sectionName',
            align: 'center',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Designation',
            dataIndex: 'designationName',
            align: 'center',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Date OF Birth',
            dataIndex: 'dateOfBirth',
            align: 'center',
            render: (text, record) => {
                const dateOfBirth = record.dateOfBirth;
                if (dateOfBirth) {
                    return moment(dateOfBirth).format('DD-MM-YYYY');
                } else {
                    return '-';
                }
            },
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            align: 'center',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },

        {
            title: 'Mobile Number',
            dataIndex: 'mobileNumber',
            align: 'center',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: 'Email Id',
            dataIndex: 'emailId',
            align: 'center',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },

        {
            title: `Action`,
            dataIndex: 'action',
            align: "center",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (text, rowData, index) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="edit">
                            <Tooltip placement="top" title="Edit">
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        console.log(rowData);
                                        if (rowData.isActive) {
                                            openFormWithData(rowData);
                                        } else {
                                            message.error('You Cannot Edit Deactivated Employee');
                                        }
                                    }}
                                >
                                    <EditOutlined
                                        style={{
                                            fontSize: '24px',
                                            color: 'blue',
                                            marginRight: '8px',
                                        }}
                                    />
                                    <span>Edit</span>
                                </div>
                            </Tooltip>
                        </Menu.Item>
                        <Menu.Item key="delete">
                            <Tooltip placement="top" title="Delete">
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Popconfirm
                                        onConfirm={e => { deactiveEmployee(rowData); }}
                                        title={
                                            rowData.isActive
                                                ? 'Are you sure to Delete Employee Details ?'
                                                : 'Are you sure to Delete Employee Details ?'
                                        }
                                    >
                                        <DeleteOutlined
                                            style={{
                                                fontSize: '24px',
                                                color: '#eb2a1c',
                                                marginRight: '8px',
                                            }}
                                        />
                                    </Popconfirm>
                                    <span>Delete</span>
                                </div>
                            </Tooltip>
                        </Menu.Item>
                    </Menu>
                );

                return (
                    <span>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <MoreOutlined style={{ fontSize: '20px', color:'blue', cursor: 'pointer' }} />
                            </a>
                        </Dropdown>
                    </span>
                );
            }
        }

    ]

    return (
        <div style={{ textAlign: 'left' }} >
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                        <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
                        <span style={{ color: 'white', fontWeight: 'bold' }}>Employee Details</span>
                    </div>
                }
                headStyle={{
                    backgroundColor: '#047595',
                    border: 0,
                    textAlign: 'left',
                }}
                extra={
                    <Link to="/employee-form">
                        <Button className="panel_button" style={{ color: 'black' }}>
                            Create
                        </Button>
                    </Link>}>
                <br></br>
                <Table
                    loading={loading}
                    columns={columnsSkelton}
                    dataSource={employeeData}
                    scroll={{ x: 1400, y: 400 }}
                    sticky={true}
                    bordered
                />
                <Drawer bodyStyle={{ paddingBottom: 80 }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
                    onClose={closeDrawer} visible={drawerVisible} closable={true}>
                    <Card headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }} size='small'>
                        <EmployeeForm key={Date.now()}
                            updateDetails={updateEmployee}
                            isUpdate={true}
                            employeeData={selectedEmployeeData}
                            closeForm={closeDrawer} />
                    </Card>
                </Drawer>
            </Card>
        </div >
    )
}

export default EmployeeGrid