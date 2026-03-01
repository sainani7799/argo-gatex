import { DeleteOutlined, EditOutlined, MoreOutlined, RightSquareOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, Divider, message, Drawer, Switch, Dropdown, Menu } from 'antd';
import { BuyerTeamService, SupplierService } from '@gatex/shared-services';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BuyerTeameDto, UnitReq } from '@gatex/shared-models';
import Highlighter from 'react-highlight-words'
import BuyerTeamForm from '../buyerTeam/buyerTeam-form';
import React from 'react';

const BuyerTeamGrid = () => {
    const [responseData, setResponseData] = useState<any>([]);
    const service = new BuyerTeamService();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [selectedbuyerTeam, setSelectedbuyerTeam] = useState<any>(undefined);
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
        getAllbuyerTeam()
    }, []);

    const getAllbuyerTeam = () => {
        service.getAllActiveBuyer().then(res => {
            console.log(res)
            if (res) {
                setResponseData(res.data);
            }
        });
    }

    const openFormWithData = (viewData: BuyerTeameDto) => {
        setDrawerVisible(true);
        setSelectedbuyerTeam(viewData);
    }

    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    // const deletebuyerTeam = (dto:CreatebuyerTeamDto) => {
    //     dto.isActive=dto.isActive?false:true;
    //     service.activateOrDeactivatebuyerTeam(dto).then(res => { console.log(res);
    //       if (res.status) {
    //         message.success(res.internalMessage); 
    //       } else {
    //           message.error(res.internalMessage);
    //         }
    //     }).catch(err => {
    //       message.error(err.message);
    //     })
    //   }

    const activateOrDeactivateUnits = (val: UnitReq) => {
        val.isActive = val.isActive ? false : true;
        // service.activateOrDeactivateUnits(val).then((res) =>{
        //     if (res.status) {
        //         message.success(res.internalMessage); 
        //       } else {
        //           message.error(res.internalMessage);
        //         }
        //     }).catch(err => {
        //       message.error(err.message);
        //     })
    }

    const deletebuyerTeam = (buyerId) => {
        const req = {
            buyerId: buyerId
        }
        service.deleteBuyer(req).then((res) => {
            if (res.status) {
                message.success('Buyer Deleted successfully')
                getAllbuyerTeam()
            } else {
                message.error('Error while deleting buyer')
                getAllbuyerTeam()
            }
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
            key: "2",
            title: "Buyer Team",
            dataIndex: "buyerTeam",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            ...getColumnSearchProps('buyerTeam')
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
                                    <Popconfirm onConfirm={e => { deletebuyerTeam(rowData.buyerTeamId) }}
                                        title={
                                            'Are you sure to delete this Buyer Team ?'
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
                                <MoreOutlined style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }} />
                            </a>
                        </Dropdown>
                    </span>
                );
            }
        }

    ]



    const updatebuyerTeam = (buyerTeam: BuyerTeameDto) => {
        const authdata = JSON.parse(localStorage.getItem('userName'))
        buyerTeam.updatedUser = authdata.userName
        console.log(buyerTeam.updatedUser)
        service.updateBuyer(buyerTeam).then(res => {
            if (res.status) {
                message.success('Updated Successfully');
                setDrawerVisible(false);
                getAllbuyerTeam()

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
                    <TeamOutlined style={{ fontSize: '24px', color: 'white' }} />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Buyers Team</span>
                </div>

            }
            extra={
                (
                    <Link to="/buyerteam-form">
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
                    <BuyerTeamForm key={Date.now()}
                        updateDetails={updatebuyerTeam}
                        isUpdate={true}
                        data={selectedbuyerTeam}
                        closeForm={closeDrawer} />
                    {/* <BuyerTeamForm /> */}
                </Card>
            </Drawer>
        </Card>
    );
}

export default BuyerTeamGrid;