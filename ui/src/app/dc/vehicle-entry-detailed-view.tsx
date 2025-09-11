import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Modal, Table, Tag } from "antd";
import dayjs from "dayjs";
import { TruckStateEnum } from "libs/shared-models";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import VehicleEntryPrint from "./vehicle-entry-print";
import { render } from "react-dom";


const VehicleEntryDetailedView = () => {

    const truckStateColors: { [key in keyof typeof TruckStateEnum]?: string } = {
        OPEN: "green",
        LOADING: "blue",
        UNLOADING: "orange",
        PAUSE: "gold",
        LOAD_COMPLETED: "purple",
        UNLOAD_COMPLETED: "red",
        CLOSED: "geekblue",
        RETURN: "volcano"
    };

    const [openModal, setOpenModal] = useState(Boolean);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state
    const [printData, setPrintData] = useState<any>([]);

    const columns: any = [
        {
            title: "Vehicle No",
            dataIndex: "vehicleNo",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Driver Name",
            dataIndex: "dName",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Driver Contact",
            dataIndex: "dContact",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "Vehicle Type",
            dataIndex: "vehicleType",
            align: "center",
            render: (rec) => (rec ? rec : '-')
        },
        {
            title: "In-House Vehicle",
            dataIndex: "inHouseVehicle",
            align: "center",
            render: (text) => (text ? "Yes" : "No"),
        },
        {
            title: "Status",
            dataIndex: "vehicleStateRecords",
            align: "center",
            render: (stateRecords) => {
                const latestState = stateRecords.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
                const enumKey = latestState?.vehicleTypeEnum || 'N/A';
                const displayStatus = enumKey.replace(/_/g, " ")
                const tagColor = truckStateColors[enumKey] || "default";
                return (
                    <Tag color={tagColor} style={{ fontSize: "14px" }}>
                        {displayStatus}
                    </Tag>
                );
            },
        },
        {
            title: "Remarks",
            dataIndex: "vehicleStateRecords",
            align: "center",
            render: (rec) => {
                const remark = rec?.[0]?.remarks;
                return remark ? remark : "-"
            },
        },
        {
            title: "Action",
            align: "center",
            render: (rec) => (
                <Button icon={<PrinterOutlined />} onClick={() => openPrintModal(rec)} style={{ backgroundColor: '#45c44a', color: 'white', border: 'none' }}>Print</Button>
            ),
        }
    ];


    const openPrintModal = (rec) => {
        setPrintData(rec)
        setOpenModal(true)
    }

    const closePrintModal = () => {
        setOpenModal(false)
    }

    return (
        <>
            <Card title={<><span style={{ color: 'white' }}>Vehicle Entry - {data?.readyToIn ? "IN" : "OUT"}</span></>} headStyle={{ backgroundColor: '#047595', color: 'black' }}
                extra={<>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/vehcile-entry')} style={{ backgroundColor: '#44abdb', color: 'white', border: 'none' }}>Back</Button>
                </>
                }
            >
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>Reference Number</span>}>{data?.refNumber}</Descriptions.Item>
                    {data?.expectedArrival !== undefined ? (
                        <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>Expected Arrival</span>}>
                            {dayjs(data?.expectedArrival).format('YYYY-MM-DD')}
                        </Descriptions.Item>
                    ) : (
                        <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>Expected Departure</span>}>
                            {dayjs(data?.expectedDeparture).format('YYYY-MM-DD')}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>From</span>}>{data?.from}</Descriptions.Item>
                    <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>To</span>}>{data?.to}</Descriptions.Item>
                    <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>From Type</span>}>{data?.fromType}</Descriptions.Item>
                    <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>To Type</span>}>{data?.toType}</Descriptions.Item>
                    <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>Status</span>}>
                        <Tag color={data?.reqStatusData === "OPEN" ? "green" : "red"}>{data?.reqStatusData}</Tag>
                    </Descriptions.Item>
                    {data?.readyToInData !== undefined ? (
                        <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>Ready To In</span>}>{data?.readyToInData}</Descriptions.Item>
                    ) : (
                        <Descriptions.Item label={<span style={{ fontWeight: "bold" }}>Ready To Send</span>}>{data?.readyToSend}</Descriptions.Item>
                    )}
                </Descriptions>
                <br />

                <Table columns={columns} dataSource={data?.vehicleRecords} rowKey={id} pagination={false} bordered />

            </Card >

            <Modal open={openModal} onCancel={closePrintModal} footer={[]} width={800}>
                <VehicleEntryPrint rec={data} vehRec={printData} />
            </Modal>

        </>
    )
}
export default VehicleEntryDetailedView;