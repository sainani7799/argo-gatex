import { EditOutlined, RightSquareOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message, Divider, Drawer, Switch } from 'antd';
import { ItemDto } from 'libs/shared-models';
import { ItemService } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ItemForm from './item-form';

const ItemGrid = () => {

    const service = new ItemService();
    const [responseData, setResponseData] = useState<any>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any>(undefined);

    const columnsSkelton: any = [
        {
            key: "1",
            title: "Item Code",
            dataIndex: "itemCode"
        },
        {
            key: "2",
            title: "Item Name",
            dataIndex: "itemName"
        },
        {
            key: "3",
            title: "Created User",
            dataIndex: "createdUser"
        },
        {
            key: "3",
            title: "Description",
            dataIndex: "description"
        },
        {
            title: `Action`,
            dataIndex: 'action',
            align: "center",
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
            headStyle={{ backgroundColor: '#7d33a2', color: 'black' }}>
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