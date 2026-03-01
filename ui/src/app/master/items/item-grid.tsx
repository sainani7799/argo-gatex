import { AppstoreOutlined, BarcodeOutlined, CheckOutlined, ContainerOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined, MoreOutlined, RightSquareOutlined, SearchOutlined, ShoppingCartOutlined, TagsOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Divider, Drawer, Switch, Dropdown, Menu } from 'antd';
import { ItemDto } from '@gatex/shared-models';
import { ItemService } from '@gatex/shared-services';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ItemForm from './item-form';
import Highlighter from 'react-highlight-words'
import React from 'react';

const ItemGrid = () => {

    const service = new ItemService();
    const [responseData, setResponseData] = useState<any>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [selectedItems, setSelectedItems] = useState<any>(undefined);
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
            title: "Item Code",
            dataIndex: "itemCode",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('itemCode')
        },
        {
            key: "2",
            title: "Item Name",
            dataIndex: "itemName",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('itemName')
        },
        {
            key: "3",
            title: "Item Type",
            dataIndex: "itemType",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('itemType')
        },
        {
            key: "4",
            title: "Created User",
            dataIndex: "createdUser",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('createdUser')
        },
        {
            key: "5",
            title: "Description",
            dataIndex: "description",
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
                            <Menu.Item
                                key="1"
                                icon={<EditOutlined className={'editSamplTypeIcon'} style={{ fontSize: '24px', color: 'blue' }} />}
                                onClick={() => {
                                    if (rowData.isActive) {
                                        openFormWithData(rowData);
                                    } else {
                                        message.error('You Cannot Edit Deactivated Payment mode');
                                    }
                                }}
                                style={{ color: 'black', fontSize: '14px' }}
                            >
                                Edit
                            </Menu.Item>

                            <Menu.Item key="2">

                                <Popconfirm
                                    onConfirm={() => { deleteItem(rowData); }}
                                    title={rowData.isActive
                                        ? 'Are you sure to Deactivate color?'
                                        : 'Are you sure to Activate color?'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Switch
                                            size="default"
                                            className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                                            checkedChildren={<RightSquareOutlined type="check" />}
                                            unCheckedChildren={<RightSquareOutlined type="close" />}
                                            checked={rowData.isActive}
                                        />
                                    </div>
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
    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const openFormWithData = (viewData: ItemDto) => {
        setDrawerVisible(true);
        setSelectedItems(viewData);
    }

    useEffect(() => {
        getAllItems()
    }, [])
    const getAllItems = () => {
        service.getAllItems().then(res => {
            if (res.status) {
                setResponseData(res.data);
            }
        }).catch(err => {
            message.error("Some Error Occured");
        })
    }

    const updateItems = (items: ItemDto) => {
        const authdata = JSON.parse(localStorage.getItem('userName'))
        items.updatedUser = authdata.userName
        console.log(items.updatedUser)
        service.updateItem(items).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                setDrawerVisible(false);
                getAllItems();
            } else {
                message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }

    const deleteItem = (dto: ItemDto) => {
        dto.isActive = dto.isActive ? false : true;
        service.activateOrDeactivateItem(dto).then(res => {
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

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                    <ContainerOutlined style={{ fontSize: '24px', color: 'white' }} />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Item Data</span>
                </div>

            }
            extra={
                (
                    <Link to="/item-form">
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
            />            <Drawer bodyStyle={{ paddingBottom: 80 }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
                onClose={closeDrawer} visible={drawerVisible} closable={true}>
                <Card headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }} size='small'>
                    <ItemForm key={Date.now()}
                        updateDetails={updateItems}
                        isUpdate={true}
                        itemData={selectedItems}
                        closeForm={closeDrawer} />
                </Card>
            </Drawer>
        </Card>
    );
};

export default ItemGrid;