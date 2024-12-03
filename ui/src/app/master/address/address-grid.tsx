import { EditOutlined, EnvironmentOutlined, MoreOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Switch, Divider, Drawer, Dropdown, Menu } from 'antd';
import { AddressService } from 'libs/shared-services';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words'
import { CreateAddressDto } from 'libs/shared-models';
import AddressForm from './address-form';

const AddressGrid = () => {

    const [responseData, setResponseData] = useState<any>([]);
    const service = new AddressService();
    const [page, setPage] = React.useState(1);
    const pageSize = 10;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(undefined);
    const searchInput = useRef(null);

    useEffect(() => {
        getAddress();
    }, []);

    const getAddress = () => {
        service.getAllAddress().then((res: any) => {
            if (res.status) {
                setResponseData(res.data);
            }
        });
    };


    const updateAddress = (address: CreateAddressDto) => {
        const authdata = JSON.parse(localStorage.getItem('userName'))
        address.updatedUser = authdata.userName
        console.log(address.updatedUser)
        service.updateAddress(address).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                setDrawerVisible(false);
                getAddress()

            } else {
                message.error(res.internalMessage);

            }
        }).catch(err => {
            message.error(err.message);
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
    const openFormWithData = (viewData: CreateAddressDto) => {
        setDrawerVisible(true);
        setSelectedAddress(viewData);
    }
    const closeDrawer = () => {
        setDrawerVisible(false);
    }

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
    const deleteAddress = (dto: CreateAddressDto) => {
        dto.isActive = dto.isActive ? false : true;
        service.activateOrDeactivateAddress(dto).then(res => {
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
            title: "Addresser",
            dataIndex: "addresser",
            ...getColumnSearchProps('addresser'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },

        {
            title: "Addresser Name",
            dataIndex: "addresserName",
            ...getColumnSearchProps('addresserName'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "GST No",
            dataIndex: "gstNo",
            ...getColumnSearchProps('gstNo'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "CST No",
            dataIndex: "cstNo",
            ...getColumnSearchProps('cstNo'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Address Line 1",
            dataIndex: "lineOne",
            ...getColumnSearchProps('lineOne'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },

        {
            title: "Address Line 2",
            dataIndex: "lineTwo",
            ...getColumnSearchProps('lineTwo'),
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "City",
            dataIndex: "city",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },

        {
            title: "Dist",
            dataIndex: "dist",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "Pin Code",
            dataIndex: "pinCode",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },
        {
            title: "State",
            dataIndex: "state",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
        },

        {
            title: "Country",
            dataIndex: "country",
            width: '50',
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
                                        message.error('You Cannot Edit Deactivated Address');
                                    }
                                }}
                                style={{ color: 'black', fontSize: '12px' }}
                            >
                                Edit
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Popconfirm
                                    onConfirm={e => {
                                        deleteAddress(rowData);
                                    }}
                                    title={
                                        rowData.isActive
                                            ? 'Are you sure to Deactivate Address?'
                                            : 'Are you sure to Activate Address?'
                                    }
                                >
                                    <Switch
                                        size="default"
                                        className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                                        checkedChildren={<RightSquareOutlined />}
                                        unCheckedChildren={<RightSquareOutlined />}
                                        checked={rowData.isActive}
                                    />
                                </Popconfirm>
                                <span>Security Check</span>
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <a onClick={e => e.preventDefault()}>
                        <MoreOutlined style={{ fontSize: '25px', color: '#0000ff' }} />
                    </a>
                </Dropdown>
            ),
        }
    ]
    return (
        <Card
            title={<span style={{ color: "white" }}>
                <EnvironmentOutlined style={{ fontSize: '24px', color: 'white' }} />
                Address
            </span>
            }
            extra={
                (
                    <Link to="/address-form">
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
                    onChange: (newPage) => setPage(newPage),
                }}
                scroll={{ x: 1400, y: 400 }} size='small'
            />
            <Drawer bodyStyle={{ paddingBottom: 80 }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
                onClose={closeDrawer} visible={drawerVisible} closable={true}>
                <Card headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }} size='small'>
                    <AddressForm key={Date.now()}
                        updateDetails={updateAddress}
                        isUpdate={true}
                        addressData={selectedAddress}
                        closeForm={closeDrawer} />
                </Card>
            </Drawer>


        </Card>
    );
};

export default AddressGrid;