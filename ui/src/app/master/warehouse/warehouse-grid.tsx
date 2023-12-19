import { EditOutlined, RightSquareOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, Divider, message, Drawer, Switch } from 'antd';
import { SupplierService, WarehouseService } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import WarehouseForm from './warehouse-form';
import { CreateWarehouseDto } from 'libs/shared-models';

const WarehouseGrid = () => {

    const [responseData, setResponseData] = useState<any>([]);
    const service = new WarehouseService();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any>(undefined);


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
    
    const deleteWarehouse = (dto:CreateWarehouseDto) => {
        dto.isActive=dto.isActive?false:true;
        service.activateOrDeactivateWarehouse(dto).then(res => { console.log(res);
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
            key: "1",
            title: "Unit Name",
            dataIndex: "unitName"
        },
        {
            key: "2",
            title: "Warehouse Name",
            dataIndex: "warehouseName"
        },
        {
            key: "3",
            title: "Created User",
            dataIndex: "createdUser"
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
                                message.error('You Cannot Edit Deactivated Warehouse');
                            }
                        }}
                        style={{ color: '#1890ff', fontSize: '14px' }}
                    />


                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e =>{deleteWarehouse(rowData);}}
                  title={
                    rowData.isActive
                      ? 'Are you sure to Deactivate Warehouse ?'
                      :  'Are you sure to Activate Warehouse ?'
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
            title={<span style={{ color: "white" }}>Warehouse Data</span>}
            extra={
                (
                    <Link to="/warehouse-form">
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