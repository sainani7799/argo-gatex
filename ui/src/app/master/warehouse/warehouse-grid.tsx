import { BankOutlined, EditOutlined, MoreOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, Divider, message, Drawer, Switch, Dropdown, Menu } from 'antd';
import { SupplierService, WarehouseService } from '@gatex/shared-services';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import WarehouseForm from './warehouse-form';
import { CreateWarehouseDto, UnitReq } from '@gatex/shared-models';
import Highlighter from 'react-highlight-words'
import React from 'react';

const WarehouseGrid = () => {
    const [responseData, setResponseData] = useState<any>([]);
    const service = new WarehouseService();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any>(undefined);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

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

    useEffect(() => {
        getAllWarehouse()
    }, []);
    const getAllWarehouse = () => {

        service.getAllWarehouse().then(res => {
            console.log(res)
            if (res) {
                setResponseData(res.data);
            }
        });
    }

    const openFormWithData = (viewData: CreateWarehouseDto) => {
        setDrawerVisible(true);
        setSelectedWarehouse(viewData);
    }

    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const deleteWarehouse = (dto: CreateWarehouseDto) => {
        dto.isActive = dto.isActive ? false : true;
        service.activateOrDeactivateWarehouse(dto).then(res => {
            console.log(res);
            if (res.status) {
                message.success(res.internalMessage);
            } else {
                message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }

    const activateOrDeactivateUnits = (val: UnitReq) => {
        val.isActive = val.isActive ? false : true;
        service.activateOrDeactivateUnits(val).then((res) => {
            if (res.status) {
                message.success(res.internalMessage);
            } else {
                message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }


    const columnsSkelton: any = [
        {
            title: 'S No',
            key: 'sno',
            width: 60,
            responsive: ['sm'],
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
        },
        {
            key: "1",
            title: "Unit Name",
            dataIndex: "unitName",
            ...getColumnSearchProps('unitName'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            key: "2",
            title: "Warehouse Name",
            dataIndex: "warehouseName",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('warehouseName')
        },
        {
            key: "3",
            title: "Created User",
            dataIndex: "createdUser",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('createdUser')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: "center",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (text, rowData) => (
                <Dropdown
                    overlay={
                        <Menu>
                            {/* Edit Item */}
                            <Menu.Item
                                key="1"
                                icon={<EditOutlined className={'editSamplTypeIcon'} style={{ fontSize: '24px', color: 'blue' }} />}
                                onClick={() => {
                                    if (rowData.isActive) {
                                        openFormWithData(rowData);
                                    } else {
                                        message.error('You Cannot Edit Deactivated Warehouse-Unit');
                                    }
                                }}
                                style={{ color: 'black', fontSize: '12px' }}
                            >
                                Edit
                            </Menu.Item>

                            <Menu.Item key="2">

                                <Popconfirm onConfirm={e => { activateOrDeactivateUnits(rowData); }}
                                    title={
                                        rowData.isActive
                                            ? 'Are you sure to Deactivate Warehouse-Unit ?'
                                            : 'Are you sure to Activate Warehouse-Unit ?'
                                    }
                                >
                                    <Switch size="default"
                                        className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                                        checkedChildren={<RightSquareOutlined type="check" />}
                                        unCheckedChildren={<RightSquareOutlined type="close" />}
                                        checked={rowData.isActive}
                                    />

                                </Popconfirm>

                                <span>Security Check</span>
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <a onClick={e => e.preventDefault()}><MoreOutlined style={{ fontSize: '25px', color: '#1890ff' }} /></a>
                </Dropdown>
            ),
        }
    ]

    const updateWarehouse = (warehouse: CreateWarehouseDto) => {
        const authdata = JSON.parse(localStorage.getItem('userName'))
        warehouse.updatedUser = authdata.userName
        console.log(warehouse.updatedUser)
        service.updateWarehouse(warehouse).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                setDrawerVisible(false);
                getAllWarehouse()

            } else {
                message.error(res.internalMessage);

            }
        }).catch(err => {
            message.error(err.message);
        })
    }

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                    <BankOutlined style={{ fontSize: '24px', color: 'white' }} />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Warehouse Data</span>
                </div>

            }
            extra={
                (
                    <Link to="/warehouse-form">
                        <span style={{ color: "white" }}>
                            <Button>Create </Button>{" "}
                        </span>
                    </Link>
                )
            }

            headStyle={{ backgroundColor: '#047595', color: 'white' }}>
            <Table
                columns={columnsSkelton}
                dataSource={responseData}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (current, size) => {
                        setPage(current);
                        setPageSize(size);
                    },
                    showSizeChanger: true,
                }}
                rowKey={(record) => record.id}
            />
            <Drawer bodyStyle={{ paddingBottom: 80 }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
                onClose={closeDrawer} visible={drawerVisible} closable={true}>
                <Card headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }} size='small'>
                    <WarehouseForm key={Date.now()}
                        updateDetails={updateWarehouse}
                        isUpdate={true}
                        warehouseData={selectedWarehouse}
                        closeForm={closeDrawer} />
                </Card>
            </Drawer>
        </Card>
    );
}

export default WarehouseGrid;