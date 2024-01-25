import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, Drawer, Divider, Switch, message } from 'antd';
import { SupplierDto } from 'libs/shared-models';
import { SupplierService } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SupplierForm from './supplier-form';
import { EditOutlined, RightSquareOutlined } from '@ant-design/icons';

const SupplierGrid = () => {

    const [responseData, setResponseData] = useState<any>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedSuppliers, setSelectedSuppliers] = useState<any>(undefined);
    const service = new SupplierService();

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
    const deleteSupplier = (dto:SupplierDto) => {
        dto.isActive=dto.isActive?false:true;
        service.activateOrDeactivateSupplier(dto).then(res => { console.log(res);
          if (res.status) {
            message.success('Success'); 
          } else {
              message.error(res.internalMessage);
            }
        }).catch(err => {
          message.error(err.message);
        })
      }

    const columnsSkelton:any = [
        {
            title: "Buyer/Supplier Code",
            dataIndex: "supplierCode"
        },
        {
            title: "Buyer/Supplier Name",
            dataIndex: "supplierName"
        },
        {
            title: "Type",
            dataIndex: "type"
        },
        {
            title: "Created user ",
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
                                message.error('You Cannot Edit Deactivated Buyer');
                            }
                        }}
                        style={{ color: '#1890ff', fontSize: '14px' }}
                    />


                    <Divider type="vertical" />
                    <Popconfirm 
                    onConfirm={e =>{deleteSupplier(rowData);}}
                  title={
                    rowData.isActive
                      ? 'Are you sure to Deactivate buyer ?'
                      :  'Are you sure to Activate buyer ?'
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

    return (
        <Card
            title={<span style={{ color: "white" }}>Supplier Data</span>}
            extra={
                (
                    <Link to="/supplier-form">
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