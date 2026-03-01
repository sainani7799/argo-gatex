import { Button, Card, Col, QRCode, Row, message } from "antd";
import { DcIdReq, ToAddressReq, UnitReq } from "@gatex/shared-models";
import { AddressService, DcService } from "@gatex/shared-services";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from 'html2pdf.js';
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import moment from "moment";
import './dc-print.css';
import sign from '../../../../ui/src/assets/WhatsApp Image 2023-12-14 at 12-8731.jpeg'
import { numberToWords } from "amount-to-words";
export interface DcPrintProps {
    dcId: any
    // printDc: () => void
}

export function DcPrint(props: DcPrintProps) {

    const [data, setData] = useState<any[]>([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const page = 1
    const location = useLocation()
    const [addressData, setAddressData] = useState<any>([]);
    const service = new DcService();
    const addressService = new AddressService();
    const [toAddressData, setToAddressData] = useState<any>([]);

    useEffect(() => {
        getDc();
    }, [props.dcId])

    const getDc = () => {
        const req = new DcIdReq(props.dcId)
        service.getDcDetailsById(req).then(res => {
            if (res.status) {
                setData(res.data)
            }
        })
    }
    
    useEffect(() => {
        if (data) {
            console.log(data)
            getFromAddress(data[0]?.fromUnitId),

                getAllToAddressByUnit(data)
        }

    }, [data])


    const getFromAddress = (val) => {
        const req = new UnitReq()
        req.unitId = 10
        addressService.getAllAddressByUnit(req).then(res => {
            if (res) {
                setAddressData(res.data);

            }
        }).catch(err => {
            message.error("Something went wrong");
        })
    };

    const getAllToAddressByUnit = async (val) => {
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

    const pdfDownloadDc = () => {
        setTimeout(() => {
            const printableElements = document.getElementById('printme').innerHTML;
            const orderHTML = '<html><head><title></title></head><body>' + printableElements + '</body></html>';
    
            // Convert HTML to PDF
            html2pdf(orderHTML, {
                margin: 10,
                filename: 'gate_pass.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            });
        }, 1000);
    };

    const printDc = () => {
        setTimeout(() => {
            const printableElements = document.getElementById('printme').innerHTML;
            const orderHTML = '<html><head><title></title></head><body>' + printableElements + '</body></html>'
            const oldPage = document.body.innerHTML;
            document.body.innerHTML = orderHTML;
            // document.body.innerHTML = oldPage;
            window.print();
        }, 1000)
    }

    const createdDate = moment(data[0]?.createdDate).format('DD-MM-YYYY');
    const totalQty = data.reduce((sum, item) => sum + parseFloat(item.qty || 0), 0);
    const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const piecesCount = data.reduce((sum, item) => sum + parseFloat(item.pieces || 0), 0);
    const titleCase = (str) => str.toLowerCase().split(' ')
        .map(word => word.charAt(0)?.toUpperCase() + word.slice(1))
        .join(' ');
    const normalizeImagePath = (path) => {
        return path.replace(/\\/g, '/');
    };
    return (
        <Card title='GATE PASS PRINT'
            style={{ textAlign: 'center' }}
            headStyle={{ backgroundColor: '#047595', border: 0, color: 'black' }} extra={<span style={{ color: 'white' }} >
                <>
                <Button onClick={printDc} className='panel_button'><PrinterOutlined /> Print</Button>
                <Button className='panel_button' onClick={pdfDownloadDc}><DownloadOutlined />Download</Button> 
                </>
            </span>}>
            <html>
                <body id='printme'>
                    <div id='printme'>

                        <Row gutter={24} >
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
                        </Row>
                    </div>

                    <div style={{ textAlign: 'center' }}><h3 style={{ textAlign: 'center' }}>{'GATE PASS'}</h3></div>
                    <Row gutter={[16, 16]} style={{ marginLeft: '10px' }}>
                        <Col span={12}>
                            <div className="issued-to"><b style={{ fontSize: "15px", marginTop: '0px' }}>Gate Pass : </b> <h4 style={{ textAlign: 'left', marginTop: '3px', fontFamily: 'serif' }}>{data[0]?.dcNumber}</h4></div>
                            {data[0]?.dispatchChallanNo ? (
  <div className="issued-to">
    <b style={{ fontSize: "15px", marginTop: "0px" }}> Dispatch Challan No : </b>
    <h4 style={{ textAlign: "left", marginTop: "3px", fontFamily: "serif" }}>
      {data[0]?.dispatchChallanNo}
    </h4>
  </div>
) : null}
                            <div className="issued-to">
                                <b style={{ fontSize: "15px", marginTop: '-4px' }}>IssuedTo:</b>
                                <h4 style={{ textAlign: 'left', marginTop: '0px', fontFamily: 'serif' }}>
                                    {toAddressData[0]?.addresserName} {toAddressData[0]?.lineOne}, <br />
                                    {toAddressData[0]?.lineTwo},<br />
                                    {toAddressData[0]?.city}, {toAddressData[0]?.dist},{toAddressData[0]?.state}, <br />
                                    {toAddressData[0]?.country},{toAddressData[0]?.pinCode},<br />
                                    GST IN: {toAddressData[0]?.gstNo}, CST: {toAddressData[0]?.cstNo}
                                </h4>
                            </div>
                        </Col>
                        <Col span={12} >

                            <div className="issued-to" style={{ marginBottom: '0px', display: 'flex' }}>
                                <b style={{ fontSize: "15px", textAlign: 'left', width: '134px' }}>Challan Date </b>
                                <h4 style={{ textAlign: 'left', fontFamily: 'serif', margin: '0' }}>: {createdDate}</h4>
                            </div>
                            <div className="issued-to" style={{ marginBottom: '0px', display: 'flex' }}>
                                <b style={{ fontSize: "15px", textAlign: 'left', width: '134px' }}>IssuedFor </b>
                                <h4 style={{ textAlign: 'left', fontFamily: 'serif', margin: '0' }}> : {data[0]?.purpose} </h4>
                            </div>
                            <div className="issued-to" style={{ marginBottom: '0px', display: 'flex' }}>
                                <b style={{ fontSize: "15px", textAlign: 'left', width: '134px' }}>From department </b>
                                <h4 style={{ textAlign: 'left', fontFamily: 'serif', margin: '0' }}> : {data[0]?.department} </h4>
                            </div>
                            <div className="issued-to" style={{ marginBottom: '0px', display: 'flex' }}>
                                <b style={{ fontSize: "15px", textAlign: 'left', width: '134px' }}>Challan Returnable </b>
                                <h4 style={{ textAlign: 'left', fontFamily: 'serif', margin: '0' }}> : {data[0]?.returnable} </h4>
                            </div>
                            <div className="issued-to" style={{ marginBottom: '0px', display: 'flex' }}>
                                <b style={{ fontSize: "15px", textAlign: 'left', width: '134px' }}>To Department </b>
                                <h4 style={{ textAlign: 'left', fontFamily: 'serif', margin: '0' }}> : {data[0]?.toDepartment} </h4>
                            </div>
                            <div className="issued-to" style={{ marginBottom: '0px', display: 'flex' }}>
                                <b style={{ fontSize: "15px", textAlign: 'left', width: '134px' }}>Attention Person</b>
                                <h4 style={{ textAlign: 'left', fontFamily: 'serif', margin: '0' }}> : {data[0]?.attentionPerson?.toUpperCase()} </h4>
                            </div>
                        </Col>
                    </Row>
                    <br />
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
                                PO Number
                            </th>
                            <th
                                colSpan={1}
                                className={'ta-b'}>
                                Color
                            </th>
                            <th
                                colSpan={1}
                                className={'ta-b'}>
                                Style
                            </th>
                            <th
                                colSpan={1}
                                className={'ta-b'}>
                                Pieces
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
                        {data?.map((item, index) => (
                            <tr className='css-serial' key={index}>
                                <td style={{ textAlign: 'left', paddingLeft: '20px' }} id={`count${index + 1}`}>{index + 1}</td>
                                <td style={{ textAlign: 'left', fontSize: '10.5px' }} colSpan={1} className={'ta-b'}>
                                    {item.itemCode}
                                </td>
                                <td style={{ textAlign: 'left', fontSize: '10.5px' }} colSpan={1} className={'ta-b'}>
                                    {item.itemName}
                                </td>
                                <td style={{ textAlign: 'left', fontSize: '9px' }} colSpan={1} className={'ta-b'}>
                                    {item.description}
                                </td>
                                <td style={{ textAlign: 'left', fontSize: '9px' }} colSpan={1} className={'ta-b'}>
                                    {item.uom}
                                </td>
                                <td style={{ textAlign: 'right', fontSize: '10.5px', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                    {item.qty}
                                </td>
                                <td style={{ textAlign: 'right', fontSize: '10.5px', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                    {item.poNumber}
                                </td>
                                <td style={{ textAlign: 'right', fontSize: '10.5px', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                    {item.color}
                                </td>
                                <td style={{ textAlign: 'right', fontSize: '10.5px', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                    {item.style}
                                </td>
                                <td style={{ textAlign: 'right', fontSize: '10.5px', paddingRight: '35px' }} colSpan={1} className={'ta-b'}>
                                    {item.pieces}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '35px', fontSize: '10.5px' }} colSpan={1} className={'ta-b'}>
                                    {item.rate}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '35px', fontSize: '10.5px' }} colSpan={1} className={'ta-b'}>
                                    {item.amount}<span>&#8377;</span>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td style={{ textAlign: 'left', fontSize: '11.5px' }} colSpan={4} className={'ta-b'}  >
                                <h4 style={{ margin: '0px' }}> Total: {titleCase(numberToWords(Number(Math.round(Number(Number(totalAmount))))))} Rupees Only</h4>
                            </td>
                            <td style={{ textAlign: 'right', fontSize: '11.5px', paddingRight: '35px' }} colSpan={2} className={'ta-b'}>
                                {totalQty}
                            </td>
                            <td style={{ textAlign: 'right', fontSize: '11.5px', paddingRight: '35px' }} colSpan={4} className={'ta-b'}>
                                {piecesCount}
                            </td>
                            
                            <td style={{ textAlign: 'right', fontSize: '11.5px', paddingRight: '35px' }} colSpan={6} className={'ta-b'}>
                                {totalAmount}<span>&#8377;</span>
                            </td>
                        </tr>
                    </table>

                    <br />
                    <div className="issued-to" style={{ marginLeft: '40px' }} >
                        <b style={{ fontSize: "15px", marginTop: '1px' }}>Remark </b>
                        <h5 style={{ textAlign: 'left', marginTop: '2px', fontFamily: 'serif' }}> : {data[0]?.remarks}</h5>
                    </div>
                    <div className="issued-to" style={{ marginLeft: '40px' }} >
                        <b style={{ fontSize: "15px", marginTop: '1px', width: '140px', textAlign: 'left' }}>Weight (Approx Kgs)</b>
                        <h5 style={{ textAlign: 'left', marginTop: '4px', marginBottom: '0px', fontFamily: 'serif' }}> : {data[0]?.weight}</h5>
                    </div>
                    <div className="issued-to" style={{ marginLeft: '40px' }} >
                        <b style={{ fontSize: "15px", marginTop: '1px', width: '140px', textAlign: 'left' }}>Value (ApproxRs)</b>
                        <h5 style={{ textAlign: 'left', marginTop: '4px', fontFamily: 'serif' }}> : {data[0]?.value}</h5>
                    </div>

                    <Row gutter={[16, 16]} style={{ marginLeft: '10px', paddingLeft: '30px' }}>
                        <Col span={8}>
                            <div style={{ fontFamily: 'serif' }}>
                                <h4>Prepared By :<br /> {data[0]?.created_user}</h4>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ fontFamily: 'serif' }}>
                                <h4>Received By</h4>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ fontFamily: 'serif' }}>
                                <h4>Authorised Signatory : <br/>{data[0]?.acceptedUser}<br/>({data[0]?.department})<br/>SQ CELSIUS LIMITED</h4>
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
        </Card >
    )

} export default DcPrint