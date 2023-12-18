import { Button, Card, Col, Row, message } from "antd";
import { DcIdReq, ToAddressReq, UnitReq } from "libs/shared-models";
import { AddressService, DcService } from "libs/shared-services";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import html2pdf from 'html2pdf.js';
import { PrinterOutlined } from "@ant-design/icons";
import moment from "moment";
import './dc-print.css';
import sign from '../../../../ui/src/assets/WhatsApp Image 2023-12-14 at 12-8731.jpeg'

export interface DcPrintProps {
    dcId: number
    printDc: () => void
}

export function DcPrint(props: DcPrintProps) {

    const [data, setData] = useState<any[]>([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const page = 1
    const navigate = useNavigate();
    const location = useLocation()
    const [addressData, setAddressData] = useState<any>([]);
    const service = new DcService();
    const addressService = new AddressService();
    const [toAddressData, setToAddressData] = useState<any>([]);


    useEffect(() => {
        getDc();
    }, [props.dcId])

    const getDc = () => {
        const req = new DcIdReq(location.state)
        console.log(req, '-----------');
        service.getDcDetailsById(req).then(res => {
            if (res.status) {
                setData(res.data)
            }
        })
    }
    console.log(data)
    useEffect(() => {
        console.log(data)
        if (data) {
            console.log(data)
            getFromAddress(data[0]?.fromUnitId),

                getAllToAddressByUnit(data)
        }

    }, [data])


    const getFromAddress = (val) => {
        const req = new UnitReq()
        req.unitId = val
        addressService.getAllAddressByUnit(req).then(res => {
            if (res) {
                setAddressData(res.data);

            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };
    const getAllToAddressByUnit = async (val) => {
        console.log(val)
        const req = new ToAddressReq()
        req.addresser = data[0]?.toAddresser
        req.addresserNameId = data[0]?.toAddresserNameId
        addressService.getAllToAddressByUnit(req).then(res => {
            if (res) {
                // console.log(res);
                setToAddressData(res.data);
            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };
    const printDc = () => {
        const printableElements = document.getElementById('printme').innerHTML;
        const orderHTML = '<html><head><title></title></head><body>' + printableElements + '</body></html>'
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHTML;
        window.print();
    }
    const downloadAsPDF = () => {
        const element = document.getElementById('printme');
        const options = {
            margin: 10, // Adjust the margin as needed
            filename: 'PO.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        // html2pdf(element, options);
    };
    const createdDate = moment(data[0]?.createdDate).format('DD-MM-YYYY');
    const totalQty = data.reduce((sum, item) => sum + parseFloat(item.qty || 0), 0);
    const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const normalizeImagePath = (path) => {
        return path.replace(/\\/g, '/');
    };
    return (
        <Card title='GATE PASS PRINT'
            style={{ textAlign: 'center' }}
            headStyle={{ backgroundColor: 'rgb(125, 51, 162)', border: 0,color:'#fff' }} extra={<span style={{ color: 'white' }} ><Button onClick={props.printDc} className='panel_button'><PrinterOutlined /> Print</Button>
             {/* <Button className='panel_button' onClick={downloadAsPDF}>Download PDF</Button> */}
             </span>}>
            <html>
                <body id='printme'>
                    <h3 style={{ textAlign: 'center' }}>{'Shahi Export Pvt. Ltd'}</h3>
                    <div style={{ textAlign: 'center', }}>
                        <h5>{data[0]?.fromUnit}<br />
                            {addressData[0]?.lineOne}, {addressData[0]?.lineTwo}<br />
                            {addressData[0]?.city},{addressData[0]?.dist}<br />
                            {addressData[0]?.state},{addressData[0]?.country},{addressData[0]?.pinCode}<br />
                            GST IN :{addressData[0]?.gstNo},CST :{addressData[0]?.cstNo}</h5>
                    </div>
                    <div style={{ textAlign: 'center' }}><h3 style={{ textAlign: 'center' }}>{'GATE PASS'}</h3></div>
                    <Row gutter={[16, 16]} style={{ marginLeft: '10px', paddingLeft: '30px' }}>
                        <Col span={12}>
                            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                                <h3>Gate Pass : {data[0]?.dcNumber}</h3>
                                <h5>Issued To : {toAddressData[0]?.addresserName}
                                    {toAddressData[0]?.lineOne}, <br /> {toAddressData[0]?.lineTwo},<br />{toAddressData[0]?.city}, {toAddressData[0]?.dist},{toAddressData[0]?.state}, <br /> {toAddressData[0]?.country},{toAddressData[0]?.pinCode},<br /> GST IN :{toAddressData[0]?.gstNo},CST :{toAddressData[0]?.cstNo}
                                </h5>
                            </div>
                        </Col>
                        <Col span={12} >
                            <div style={{ textAlign: 'left', marginBottom: '10px', paddingLeft: '75px' }}>
                                <h3>Chalan Date: {createdDate}</h3>
                                <h5 style={{ marginBottom: '10px' }}>Issued for : {data[0]?.purpose} <br />Department from : {data[0]?.department} <br />Department To : <br /> Challan Returnable: {data[0]?.returnable}<br /> Mode Of Transport: {data[0]?.modeOfTransport}<br />Vehicle No: {data[0]?.vehicleNo}</h5>
                            </div>
                        </Col>
                    </Row>
                    <table className={'ta-b'} style={{ width: '100%' }}>
                        <tr style={{ textAlign: 'left', backgroundColor: '#a3a3a352' }}>
                            <th className={'ta-b'} style={{ textAlign: 'left', paddingLeft: '20px' }}> Sno</th>

                            <th colSpan={1} className={'ta-b'} >
                                Item
                            </th>

                            <th
                                colSpan={1}
                                className={'ta-b'}>
                                Item Name
                            </th>

                            <th colSpan={1} className={'ta-b'} >
                                Description
                            </th>
                            <th colSpan={1}
                                className={'ta-b'}>
                                Uom

                            </th>
                            <th
                                colSpan={1}
                                className={'ta-b'}>
                                Quantity
                            </th>
                            <th
                                colSpan={1}
                                className={'ta-b'}>
                                Rate
                            </th>
                            <th
                                colSpan={1}
                                className={'ta-b'}>
                                Amount
                            </th>
                        </tr>
                        {data.map((item, index) => (
                            <tr className='css-serial' key={index}>
                                <td className={'ta-b'} style={{ textAlign: 'left', paddingLeft: '20px' }} id={`count${index + 1}`}>{index + 1}</td>
                                <td style={{ textAlign: 'left' }} colSpan={1} className={'ta-b'}>
                                    {item.itemCode}
                                </td>
                                <td style={{ textAlign: 'left' }} colSpan={1} className={'ta-b'}>
                                    {item.itemName}
                                </td>
                                <td style={{ textAlign: 'left' }} colSpan={1} className={'ta-b'}>
                                    {item.description}
                                </td>
                                <td style={{ textAlign: 'left' }} colSpan={1} className={'ta-b'}>
                                    {item.uom}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                    {item.qty}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                    {item.rate}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                    {item.amount}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td style={{ textAlign: 'right', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                Total:
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: '35px' }} colSpan={5} className={'ta-b'}>
                                {totalQty}
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: '35px' }} colSpan={7} className={'ta-b'}>
                                {totalAmount}
                            </td>
                        </tr>
                    </table>
                    <div style={{ textAlign: 'left', marginLeft: '40px' }}>
                        <h5 >Remark :{data[0]?.remarks}</h5>
                    </div><br />
                    <div style={{ textAlign: 'left', marginLeft: '40px' }}>
                        <h5 >Weight (Approx Kgs) :{data[0]?.weight}</h5>
                        <h5 >Value (ApproxRs):{data[0]?.value}</h5>
                    </div>
                    <Row gutter={[16, 16]} style={{ marginLeft: '10px', paddingLeft: '30px' }}>
                        <Col span={8}>
                            <div>
                                <h5>Prepared By :<br /> {data[0]?.created_user}</h5>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <h5>Received By</h5>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <h5>Authorised Signatory</h5>
                                <br />
                                {data[0]?.sign_path && (
                                    
                                    <img
                                        src={sign} // Use the image path from your data
                                        alt={`Signature of ${sign}`}
                                        style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                                    />
                                    
                                )}
                               
                            </div>
                        </Col>
                    </Row>
                </body>
            </html>
        </Card>
    )

} export default DcPrint