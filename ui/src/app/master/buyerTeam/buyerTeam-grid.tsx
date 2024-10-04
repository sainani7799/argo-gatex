import { DeleteOutlined, EditOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, Divider, message, Drawer, Switch } from 'antd';
import { BuyerTeamService, SupplierService } from 'libs/shared-services';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BuyerTeameDto, UnitReq } from 'libs/shared-models';
import Highlighter from 'react-highlight-words'
import BuyerTeamForm from '../buyerTeam/buyerTeam-form';

const BuyerTeamGrid = () => {
    const [responseData, setResponseData] = useState<any>([]);
    const service = new BuyerTeamService();
    const [drawerVisible, setDrawerVisible] = useState(false);
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
                   style={{backgroundColor:"#047595",color:"white" ,width: 90, marginRight: 8 }}
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

      const activateOrDeactivateUnits = (val:UnitReq) =>{
        val.isActive=val.isActive?false:true;
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
        const req ={
            buyerId : buyerId
        }
        service.deleteBuyer(req).then((res) => {
            if(res.status){
                message.success('Buyer Deleted successfully')
                getAllbuyerTeam()
            }else{
                message.error('Error while deleting buyer')
                getAllbuyerTeam()
            }
        })
      }


    const columnsSkelton: any = [
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
            render: (text, rowData) => (
                <span>
                    <EditOutlined className={'editSamplTypeIcon'} type="edit"
                        onClick={() => {
                            if (rowData.isActive) {
                                openFormWithData(rowData);
                            } else {
                                message.error('You Cannot Edit Deactivated buyerTeam-Unit');
                            }
                        }}
                        style={{ color: '#1890ff', fontSize: '14px' }}
                    />


                    <Divider type="vertical" />
                    {/* <Popconfirm onConfirm={e =>{activateOrDeactivateUnits(rowData);}}
                  title={
                    rowData.isActive
                      ? 'Are you sure to Deactivate buyerTeam-Unit ?'
                      :  'Are you sure to Activate buyerTeam-Unit ?'
                  }
                >
                  <Switch  size="default"
                      className={ rowData.isActive ? 'toggle-activated' : 'toggle-deactivated' }
                      checkedChildren={<RightSquareOutlined type="check" />}
                      unCheckedChildren={<RightSquareOutlined type="close" />}
                      checked={rowData.isActive}
                    />
                  
                </Popconfirm> */}
                <Popconfirm onConfirm={e =>  {deletebuyerTeam(rowData.buyerTeamId)}}
                  title={
                      'Are you sure to delete this Buyer Team ?'
                  }
                >
                    <DeleteOutlined  type="edit"
                        // onClick={() => {
                        //     console.log(rowData, 'rowData')
                          
                        // }}
                        style={{ color: '#eb2a1c', fontSize: '14px' }}
                        />
                        </Popconfirm>
                </span>
            )
        }
    ];

    

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
            title={<span style={{ color: "white" }}>BuyersTeam</span>}
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
            <Table columns={columnsSkelton} dataSource={responseData}></Table>
            <Drawer bodyStyle={{ paddingBottom: 80 }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
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