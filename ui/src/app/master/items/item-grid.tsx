import { EditOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Divider, Drawer, Switch } from 'antd';
import { ItemDto } from 'libs/shared-models';
import { ItemService } from 'libs/shared-services';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ItemForm from './item-form';
import Highlighter from 'react-highlight-words'

const ItemGrid = () => {

    const service = new ItemService();
    const [responseData, setResponseData] = useState<any>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
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

    const columnsSkelton: any = [
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
                                message.error('You Cannot Edit Deactivated Payment mode');
                            }
                        }}
                        style={{ color: '#1890ff', fontSize: '14px' }}
                    />


                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e =>{deleteItem(rowData);}}
                  title={
                    rowData.isActive
                      ? 'Are you sure to Deactivate color ?'
                      :  'Are you sure to Activate color ?'
                  }
                >
                  <Switch  size="default"
                      className={ rowData.isActive ? 'toggle-activated' : 'toggle-deactivated' }
                      checkedChildren={<RightSquareOutlined type="check" />}
                      unCheckedChildren={<RightSquareOutlined type="close" />}
                      checked={rowData.isActive}
                    />
                  
                </Popconfirm>
                </span>
            )
        }
    ];

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

    const deleteItem = (dto:ItemDto) => {
        dto.isActive=dto.isActive?false:true;
        service.activateOrDeactivateItem(dto).then(res => { console.log(res);
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
            title={<span style={{ color: "white" }}>Item Data</span>}
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
            <Table columns={columnsSkelton} dataSource={responseData}></Table>
            <Drawer bodyStyle={{ paddingBottom: 80 }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
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