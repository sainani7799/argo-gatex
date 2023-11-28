import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Drawer, Input, Popconfirm, Row, Space, Switch, Table, Tag, Tooltip, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EmployeeForm from './employee-form'
import { CreateEmployeeDto } from 'libs/shared-models/src/employee'
import { EmployeeService } from 'libs/shared-services'
import { ColumnType } from 'antd/es/table'
import Highlighter from 'react-highlight-words'
import moment from 'moment'

const EmployeeGrid = () => {
    const service = new EmployeeService;
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [employeeData, setEmployeeData] = useState<any[]>([]);
    const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>(undefined);
    const [page, setPage] = React.useState(1);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        getAllEmployees();
    }, []);


    const getAllEmployees = () => {
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


    const columnsSkelton: any = [
        {
            title: 'S No',
            key: 'sno',
            width: 60,
            responsive: ['sm'],
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            align: 'center',
            ...getColumnSearchProps('unit'),
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            align: 'center',
            ...getColumnSearchProps('employeeName'),
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            align: 'center',
            ...getColumnSearchProps('employeeCode'),
        },
        {
            title: 'Card No',
            dataIndex: 'cardNo',
            align: 'center',
            ...getColumnSearchProps('card'),
        },
        {
            title: 'Department',
            dataIndex: 'departmentName',
            align: 'center'
        },
        {
            title: 'Section',
            dataIndex: 'section',
            align: 'center'
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            align: 'center'
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
            }
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            align: 'center'
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobileNumber',
            align: 'center'
        },
        {
            title: 'Email Id',
            dataIndex: 'emailId',
            align: 'center'
        },

    ]
    return (
        <div>
            <Card title={<span style={{ color: 'white' }}>Employee Details</span>}
                style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }}
                extra={<Link to="/employee-form"  ><span style={{ color: 'white' }} ><Button className='panel_button' >Create </Button>
                </span></Link>}>
                <br></br>
                <Row gutter={40}>

                </Row>
                <br></br>
                <Table
                    // rowKey={record => record.employeeId}
                    columns={columnsSkelton}
                    dataSource={employeeData}
                    scroll={{ x: 1400, y: 400 }}
                    sticky={true}
                    // pagination={{
                    //     onChange(current) {
                    //         setPage(current);
                    //     }
                    // }}
                    // onChange={onChange}
                    bordered
                />

            </Card>
        </div>
    )
}

export default EmployeeGrid