import { Button, Card, Drawer, Table, Tabs } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleForm from "./vehicle-form";


const VehicleGrid = () => {

    const navigate = useNavigate();
    const { TabPane } = Tabs;
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any>(undefined);
    const [updateItems, setUpdateItems] = useState<any>([]);

    const columnsSkelton: any = [
        {
            title: 'Supplier Name',
            dataIndex: 'supplierName',
            key: 'supplierName',
            isDefaultSelect: true,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center'
        },
        {
            title: 'Supplier Code',
            dataIndex: 'supplierCode',
            key: 'supplierCode',
            isDefaultSelect: true,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center'
        },
        {
            title: 'Expected Arrival',
            dataIndex: 'deliveryDate',
            key: 'expectedArrivalDate',
            isDefaultSelect: true,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center',
            render: (text, record) => {
                return text ? (text) : '-';
            }
        },
        {
            title: 'Security Check In',
            dataIndex: 'securityCheckIn',
            key: 'securityCheckIn', isDefaultSelect: true,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center',
            render: (value) => (value ? 'Yes' : 'No'),
        },
        {
            title: 'Security Check In At',
            dataIndex: 'securityCheckInAt',
            key: 'securityCheckInAt',
            isDefaultSelect: false,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center',
            render: (text, record) => {
                return text ? text : '-'
            }
        },
        {
            title: 'Security Check Out At',
            dataIndex: 'securityCheckOutAt',
            key: 'securityCheckOutAt',
            isDefaultSelect: false,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center',
            render: (text, record) => {
                return text ? (text) : '-'
            }
        },

        {
            title: 'Vehicle Number',
            dataIndex: 'phVehicleNumber',
            key: 'phVehicleNumber',
            isDefaultSelect: true,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center'
        },
        {
            title: 'Driver Name',
            dataIndex: 'driverName',
            key: 'driverName',
            isDefaultSelect: true,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center'
        },
        {
            title: 'Driver Contact',
            dataIndex: 'driverContact',
            key: 'driverContact',
            isDefaultSelect: true,
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center'
        },
        {
            title: 'Vehicle Came In',
            dataIndex: 'vehicleCameIn',
            isDefaultSelect: true,
            key: 'vehicleCameIn',
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            align: 'center',
            render: (value) => (value ? 'Yes' : 'No'),
        },

        {
            title: 'Action',
            dataIndex: 'action',
            align: "center",
            onHeaderCell: () => ({
                style: { backgroundColor: '#047595', color: 'white' },
            }),
            render: (rec) => (
                <>
                    <Button type="primary" title="Edit" onClick={() => handleOpenDrawer(rec)}>
                        🚛
                    </Button>
                </>
            )
        }


    ]
    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const handleOpenDrawer = (rec) => {
        setDrawerVisible(true)
        setUpdateItems(rec)
        setSelectedItems(rec)
    }

    const dummyData = [
        {
            key: '1',
            supplierName: 'ABC Textiles',
            supplierCode: 'SUP123',
            deliveryDate: '2025-03-05',
            securityCheckIn: true,
            securityCheckOutAt: '2025-03-05 14:00',
            phVehicleNumber: 'KA-01-AB-1234',
            driverName: 'John Doe',
            driverContact: '9876543210',
            vehicleCameIn: true,
        },
        {
            key: '2',
            supplierName: 'XYZ Garments',
            supplierCode: 'SUP456',
            deliveryDate: '2025-03-06',
            securityCheckIn: false,
            securityCheckOutAt: '-',
            phVehicleNumber: 'TN-10-XY-5678',
            driverName: 'Michael Smith',
            driverContact: '8765432109',
            vehicleCameIn: false,
        },
        {
            key: '3',
            supplierName: 'PQR Fabrics',
            supplierCode: 'SUP789',
            deliveryDate: '2025-03-07',
            securityCheckIn: true,
            securityCheckOutAt: '2025-03-07 18:30',
            phVehicleNumber: 'MH-12-PQ-4321',
            driverName: 'David Johnson',
            driverContact: '7654321098',
            vehicleCameIn: true,
        }
    ];

    return (
        <>
            <Card title='Veichle'
                headStyle={{ backgroundColor: '#047595', color: 'white' }}
                extra={
                    <>
                        <Button onClick={() => navigate('/vehicle-form')}>
                            Create
                        </Button>
                    </>
                }>

                <Tabs defaultActiveKey="1">
                    <TabPane tab="🚛 Vehicle Arrival" key="1">
                        <Table columns={columnsSkelton} scroll={{ x: true }} dataSource={dummyData} />
                    </TabPane>
                    <TabPane tab="🚚 Vehicle Departure" key="2">
                        <Table columns={columnsSkelton} scroll={{ x: true }} dataSource={dummyData} />
                    </TabPane>
                </Tabs>
            </Card>

            <Drawer bodyStyle={{ paddingBottom: 80 }} title='Update' width={window.innerWidth > 768 ? '80%' : '85%'}
                onClose={closeDrawer} open={drawerVisible} closable={true}>
                <Card headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }} size='small'>
                    <VehicleForm key={Date.now()}
                        updateDetails={updateItems}
                        isUpdate={true}
                        veichleData={selectedItems}
                        closeForm={closeDrawer} />
                </Card>
            </Drawer>

        </>
    )


}

export default VehicleGrid;