import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip } from 'antd';
import { SupplierService } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SupplierGrid = () => {

    const [responseData, setResponseData] = useState<any>([]);
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

    const columns = [
        {
            key: "1",
            title: "Supplier Name",
            dataIndex: "supplierName"
        },

        {
            key: "2",
            title: "Created user ",
            dataIndex: "createdUser"
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

            <Table columns={columns} dataSource={responseData}></Table>
        </Card>
    );
};

export default SupplierGrid;