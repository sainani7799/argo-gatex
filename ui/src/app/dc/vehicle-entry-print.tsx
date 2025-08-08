import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Col, QRCode, Row } from 'antd';
import dayjs from 'dayjs';
import html2pdf from 'html2pdf.js';
import './dc-print.css';

export interface VehicleEntryPrintProps {
    rec: any,
    vehRec: any,
}

const VehicleEntryPrint = (props: VehicleEntryPrintProps) => {
    const data = props.rec
    const vehData = props.vehRec

    const pdfDownloadVehicleEntry = () => {
        setTimeout(() => {
            const printableElements = document.getElementById('printme').innerHTML;
            const orderHTML = '<html><head><title></title></head><body>' + printableElements + '</body></html>';
            html2pdf(orderHTML, {
                margin: 10,
                filename: 'gate_pass.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            });
        }, 1000);
    };

    const printVehicleEntry = () => {
        setTimeout(() => {
            const printableElements = document.getElementById('printme').innerHTML;
            const orderHTML = '<html><head><title></title></head><body>' + printableElements + '</body></html>'
            const oldPage = document.body.innerHTML;
            document.body.innerHTML = orderHTML;
            // document.body.innerHTML = oldPage;
            window.print();
        }, 1000)
    };

    console.log(data, 'data');
    console.log(vehData, 'vehData');

    const qrData = `
    Reference ID     - ${data?.refId ? data?.refId : "-"}
    Reference Number - ${data?.refNumber ? data?.refNumber : "-"}
    ${data?.expectedArrival ? "Arrival" : "Departure"}   - ${data?.expectedArrival ||  data?.expectedDeparture || "-"}
    ${vehData?.vinrId ? "Vechicle IN Id" : "Vechicle OUT Id"}   - ${vehData?.vinrId || vehData?.votrId || "-"}
    Vehicle No       - ${vehData?.vehicleNo ? vehData?.vehicleNo : "-"}
    Driver Name      - ${vehData?.dName ? vehData?.dName : '-'}
    Driver Contact   - ${vehData?.dContact ? vehData?.dContact : "-"}
    Vehicle Type     - ${vehData?.vehicleType ? vehData?.vehicleType : "-"}
    In-House Vehicle - ${vehData?.inHouseVehicle ? "Yes" : "No"}
    Status           - ${vehData?.vehicleStateRecords[0]?.vehicleTypeEnum.replace(/_/g, " ") ? vehData?.vehicleStateRecords[0]?.vehicleTypeEnum.replace(/_/g, " ") : "-"}
    Weight           - ${vehData?.weight ? vehData?.weight : "-"}
    id           - ${vehData?.id ? vehData?.id : "-"}
    `;
    return (
        <>
            <Card title='VEHICLE ENTRY PRINT'
                style={{ textAlign: 'center' }}
                headStyle={{ backgroundColor: '#047595', border: 0, color: 'black' }}
                extra={
                    <span style={{ color: 'white' }} >
                        <>
                            <Button onClick={printVehicleEntry} className='panel_button' style={{ backgroundColor: '#45c44a', color: 'white', border: 'none', marginRight: '10px', }}><PrinterOutlined /> Print</Button>
                            <Button className='panel_button' onClick={pdfDownloadVehicleEntry} style={{ backgroundColor: '#44abdb', color: 'white', border: 'none' }}><DownloadOutlined />Download</Button>
                        </>
                    </span>}
            >
                <html>
                    <body id='printme'>
                        <div id='printme'>

                            {/* <Row gutter={24} >
                                <Col span={20} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '65px' }}>
                                    <h3 style={{ textAlign: 'center', fontFamily: 'serif' }}>{'SQ CELSIUS LIMITED'}</h3>
                                    <div style={{ textAlign: 'center', fontFamily: 'serif' }}>
                                        <h4>{data[0]?.fromUnit}<br />
                                            {addressData[0]?.lineOne}, {addressData[0]?.lineTwo}<br />
                                            {addressData[0]?.city},  {addressData[0]?.dist} <br />
                                            {addressData[0]?.state}, {addressData[0]?.country}, {addressData[0]?.pinCode}<br />
                                            GST IN : {addressData[0]?.gstNo} , CST : {addressData[0]?.cstNo}</h4>
                                    </div>
                                </Col>
                                <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '5px' }}>
                                    <QRCode type="svg" value={`https://gatex.schemaxtech.in/#/dc-email-detail-view/${props.dcId}`} />
                                </Col>
                            </Row> */}
                        </div>

                        <div style={{ textAlign: 'center' }}><h3 style={{ textAlign: 'center' }}>{'VEHICLE ENTRY'}</h3></div>
                        <Row gutter={[16, 16]} style={{ marginLeft: '10px' }}>
                            <Col span={15}>
                                {[
                                    { label: "Reference Number", value: data?.refNumber },
                                    {
                                        label: data?.expectedArrival !== undefined ? "Expected Arrival" : "Expected Departure",
                                        value: dayjs(data?.expectedArrival || data?.expectedDeparture).format('YYYY-MM-DD')
                                    },
                                    { label: "From", value: data?.from },
                                    { label: "To", value: data?.to },
                                    { label: "From Type", value: data?.fromType },
                                    { label: "To Type", value: data?.toType },
                                    { label: "Status", value: data?.reqStatusData },
                                    {
                                        label: data?.readyToInData !== undefined ? "Ready To In" : "Ready To Send",
                                        value: data?.readyToInData || data?.readyToSendData
                                    }
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="vehicle-entry"
                                        style={{ marginBottom: '0px', display: 'flex', alignItems: 'center' }}
                                    >
                                        <b style={{ fontSize: "15px", textAlign: 'left', width: '150px', flexShrink: 0, fontFamily: "'Times New Roman', Times, serif" }}>
                                            {label}
                                        </b>
                                        <h4 style={{ textAlign: 'left', fontFamily: "'Times New Roman', Times, serif", margin: '0', marginLeft: '10px', flexGrow: 1 }}>
                                            {`: \u00A0${value}`}
                                        </h4>
                                    </div>
                                ))}
                            </Col>
                            <Col span={6}>
                                <QRCode type="svg" errorLevel='M' size={220} value={qrData} />
                            </Col>
                        </Row>

                        <br />

                        <table className={'ta-b'} style={{ width: '100%' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', backgroundColor: '#a3a3a352' }}>
                                    <th colSpan={1} className={'ta-b'}>Vehicle No</th>
                                    <th colSpan={1} className={'ta-b'}>Driver Name</th>
                                    <th colSpan={1} className={'ta-b'}>Driver Contact</th>
                                    <th colSpan={1} className={'ta-b'}>Vehicle Type</th>
                                    <th colSpan={1} className={'ta-b'}>In-House Vehicle</th>
                                    <th colSpan={1} className={'ta-b'}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key='1 ' style={{ textAlign: 'left', fontSize: '10.5px' }}>
                                    <td colSpan={1} className={'ta-b'}>{vehData?.vehicleNo}</td>
                                    <td colSpan={1} className={'ta-b'}>{vehData?.dName}</td>
                                    <td colSpan={1} className={'ta-b'}>{vehData?.dContact}</td>
                                    <td colSpan={1} className={'ta-b'}>{vehData?.vehicleType}</td>
                                    <td colSpan={1} className={'ta-b'}>{vehData?.inHouseVehicle ? "Yes" : "No"}</td>
                                    <td colSpan={1} className={'ta-b'}>
                                        {vehData?.vehicleStateRecords?.length > 0 ?
                                            vehData?.vehicleStateRecords[0]?.vehicleTypeEnum.replace(/_/g, " ") :
                                            "N/A"
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Row gutter={[16, 16]} style={{ marginLeft: '10px', paddingLeft: '30px' }}>
                            <Col span={8}>
                                <div style={{ fontFamily: 'serif' }}>
                                    <h4>Prepared By <br /> {data[0]?.created_user}</h4>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ fontFamily: 'serif' }}>
                                    <h4>Received By</h4>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ fontFamily: 'serif' }}>
                                    <h4>Authorised Signatory </h4>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <p style={{ textAlign: 'left', fontSize: '11px', fontFamily: 'serif' }}>
                                The goods covered under open Policy NO. TATA-AIG/ MARINE/ DEUT0784BBY w.e.f 01.04.2023 to 31.03.2024
                            </p>
                        </Row>
                    </body>
                </html>

            </Card>
        </>
    )
}
export default VehicleEntryPrint