import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip } from 'antd';
import { SupplierService, WarehouseService } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const WarehouseGrid = () => {

    const [responseData, setResponseData] = useState<any>([]);
    const service = new WarehouseService();
    const columns = [
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
        }
    ];

    useEffect(() => {
        service.getAllWarehouse().then(res => {
            console.log(res)
            if (res) {
                setResponseData(res.data);
            }
        });
    }, []);

    return (
        <Card
                title={<span style={{ color: "white" }}>Supplier Data</span>}
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
                    <Table columns={columns} dataSource={responseData}></Table>
                </Card>
    );
}

export default WarehouseGrid;