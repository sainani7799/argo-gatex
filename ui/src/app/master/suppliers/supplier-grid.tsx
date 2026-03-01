import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, Drawer, Divider, Switch, message, Dropdown, Menu } from 'antd';
import { SupplierDto } from '@gatex/shared-models';
import { SupplierService } from '@gatex/shared-services';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SupplierForm from './supplier-form';
import { BoxPlotOutlined, CarryOutOutlined, EditOutlined, InteractionOutlined, MoreOutlined, RightSquareOutlined, SearchOutlined, ShopOutlined, SolutionOutlined, SwapOutlined, UsergroupAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words'
import React from 'react';

const SupplierGrid = () => {

    const [responseData, setResponseData] = useState<any>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedSuppliers, setSelectedSuppliers] = useState<any>(undefined);
    const service = new SupplierService();
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
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
        getSupplier();
    }, []);

    const getSupplier = () => {
        service.getAllSuppliers().then((res: any) => {
            if (res.status) {
                setResponseData(res.data);
            }
        });
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const openFormWithData = (viewData: SupplierDto) => {
        setDrawerVisible(true);
        setSelectedSuppliers(viewData);
    }
    const updateSuppliers = (items: SupplierDto) => {
        const authdata = JSON.parse(localStorage.getItem('userName'))
        items.updatedUser = authdata.userName
        console.log(items.updatedUser)
        service.updateSupplier(items).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                setDrawerVisible(false);
                getSupplier();
            } else {
                message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }
    const deleteSupplier = (dto: SupplierDto) => {
        dto.isActive = dto.isActive ? false : true;
        service.activateOrDeactivateSupplier(dto).then(res => {
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
            title: "Buyer/Supplier Code",
            dataIndex: "supplierCode",
            ...getColumnSearchProps('supplierCode'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Buyer/Supplier Name",
            dataIndex: "supplierName",
            ...getColumnSearchProps('supplierName'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Type",
            dataIndex: "type",
            ...getColumnSearchProps('type'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Created user ",
            dataIndex: "createdUser",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
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
                                        message.error('You Cannot Edit Deactivated Buyer');
                                    }
                                }}
                                style={{ color: 'black', fontSize: '14px' }}
                            >
                                Edit
                            </Menu.Item>

                            <Menu.Item key="2">

                                <Popconfirm
                                    onConfirm={e => { deleteSupplier(rowData); }}
                                    title={
                                        rowData.isActive
                                            ? 'Are you sure to Deactivate buyer ?'
                                            : 'Are you sure to Activate buyer ?'
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

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                     <SolutionOutlined style={{ fontSize: '24px', color: 'white' }} />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Supplier Data</span>
                </div>

            }
            extra={
                (
                    <Link to="/supplier-form">
                        <span style={{ color: "white" }}>
                            <Button>Create </Button>{" "}
                        </span>
                    </Link>
                )
            }

            headStyle={{ backgroundColor: '#047595', color: 'black' }}>

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
                    <SupplierForm key={Date.now()}
                        updateDetails={updateSuppliers}
                        isUpdate={true}
                        supplierData={selectedSuppliers}
                        closeForm={closeDrawer} />
                </Card>
            </Drawer>
        </Card>
    );
};

export default SupplierGrid;