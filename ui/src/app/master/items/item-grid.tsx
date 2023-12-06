import { Modal, Table, Input, Form, Popconfirm, Card, Row, Button, Col, Tooltip, message } from 'antd';
import { ItemService } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ItemGrid = () => {

    const service = new ItemService();
    const [responseData, setResponseData] = useState<any>([]);

    const columns = [
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
        }
    ];

    useEffect(() => {
        service.getAllItems().then(res => {
            if (res) {
                setResponseData(res.data);
            }
        }).catch(err => {
            message.error("Some Error Occured");
        })
    }, [])

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
            <Table columns={columns} dataSource={responseData}></Table>
        </Card>
    );
};

export default ItemGrid;