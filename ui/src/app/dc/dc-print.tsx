import { Button, Card, Col, QRCode, Row, message } from "antd";
import { DcIdReq, ToAddressReq, UnitReq } from "libs/shared-models";
import { AddressService, DcService } from "libs/shared-services";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import html2pdf from 'html2pdf.js';
import { PrinterOutlined } from "@ant-design/icons";
import moment from "moment";
import './dc-print.css';
import sign from '../../../../ui/src/assets/WhatsApp Image 2023-12-14 at 12-8731.jpeg'
import { numberToWords } from "amount-to-words";
export interface DcPrintProps {
    dcId: number
    // printDc: () => void
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
    const titleCase = (str) => str.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    const normalizeImagePath = (path) => {
        return path.replace(/\\/g, '/');
    };
    return (
        <Card title='GATE PASS PRINT'
            style={{ textAlign: 'center' }}
            headStyle={{ backgroundColor: 'rgb(125, 51, 162)', border: 0, color: '#fff' }} extra={<span style={{ color: 'white' }} ><Button onClick={printDc} className='panel_button'><PrinterOutlined /> Print</Button>
                {/* <Button className='panel_button' onClick={downloadAsPDF}>Download PDF</Button> */}
            </span>}>
            <html>
                <body id='printme'>
                    <div id='printme'>

                        <Row gutter={24} >
                            <Col span={20} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '65px' }}>
                                <h3 style={{ textAlign: 'center' ,fontFamily:'serif'}}>{'Shahi Export Pvt. Ltd'}</h3>
                                <div style={{ textAlign: 'center',fontFamily:'serif' }}>
                                    <h5>{data[0]?.fromUnit}<br />
                                        {addressData[0]?.lineOne}, {addressData[0]?.lineTwo}<br />
                                        {addressData[0]?.city},  {addressData[0]?.dist} <br />
                                        {addressData[0]?.state}, {addressData[0]?.country}, {addressData[0]?.pinCode}<br />
                                        GST IN : {addressData[0]?.gstNo} , CST : {addressData[0]?.cstNo}</h5>
                                </div>
                            </Col>
                            <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '5px' }}>
                                <QRCode type="svg" value={`http://172.20.50.169/del-chalan_app/#/dc-email-detail-view/${location.state}`} />
                            </Col>
                        </Row>
                    </div>

                    <div style={{ textAlign: 'center' }}><h3 style={{ textAlign: 'center' }}>{'GATE PASS'}</h3></div>
                    <Row gutter={[16, 16]} style={{ marginLeft: '10px' }}>
                        <Col span={12}>
                            <div className="issued-to"><b style ={{fontSize :"15px",marginTop:'0px'}}>Gate Pass : </b> <h5 style={{ textAlign: 'left', marginTop: '4px',fontFamily:'serif' }}>{data[0]?.dcNumber}</h5></div>
                            <div className="issued-to">
                                <b style ={{fontSize :"15px",marginTop:'-4px'}}>IssuedTo:</b>
                                <h5 style={{ textAlign: 'left', marginTop: '0px',fontFamily:'serif' }}>
                                    {toAddressData[0]?.addresserName} {toAddressData[0]?.lineOne}, <br />
                                    {toAddressData[0]?.lineTwo},<br />
                                    {toAddressData[0]?.city}, {toAddressData[0]?.dist},{toAddressData[0]?.state}, <br />
                                    {toAddressData[0]?.country},{toAddressData[0]?.pinCode},<br />
                                    GST IN: {toAddressData[0]?.gstNo}, CST: {toAddressData[0]?.cstNo}
                                </h5>
                            </div>
                        </Col>
                        <Col span={12} >
                        <div className="issued-to"><b style ={{fontSize :"15px",marginTop:'0px'}}>Challan Date : </b> <h5 style={{ textAlign: 'left', marginTop: '4px',fontFamily:'serif' }}>{createdDate}</h5></div>
                            <div className="issued-to">
                                <b style ={{fontSize :"15px",marginTop:'-4px'}}>IssuedFor:</b>
                                <h5 style={{ textAlign: 'left', marginTop: '0px' }}> {data[0]?.purpose} <br />Department from : {data[0]?.department}  <br /> Challan Returnable: {data[0]?.returnable}<br /> Mode Of Transport: {data[0]?.modeOfTransport}<br />Vehicle No: {data[0]?.vehicleNo}</h5>
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
                                <td style={{ textAlign: 'left', paddingLeft: '20px' }} id={`count${index + 1}`}>{index + 1}</td>
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
                                    {item.amount}<span>&#8377;</span>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td style={{ textAlign: 'left'}} colSpan={4} className={'ta-b'}  >
                               <h5> Total: {titleCase(numberToWords(Number(Math.round(Number(Number(totalAmount)))))) } Rupees Only</h5>
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: '35px' }} colSpan={2} className={'ta-b'}>
                                {totalQty}
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: '35px' }} colSpan={4} className={'ta-b'}>
                                {totalAmount}<span>&#8377;</span>
                            </td>
                        </tr>
                    </table>
                    <div className="issued-to" style={{marginLeft: '40px'}} ><b style ={{fontSize :"15px",marginTop:'0px'}}>Remark : </b> <h5 style={{ textAlign: 'left', marginTop: '4px',fontFamily:'serif' }}>{data[0]?.remarks}</h5></div>
                    <br />
                    <div className="issued-to" style={{marginLeft: '40px'}} ><b style ={{fontSize :"15px",marginTop:'0px'}}>Weight (Approx Kgs) : </b> <h5 style={{ textAlign: 'left', marginTop: '4px',fontFamily:'serif' }}>{data[0]?.weight}</h5></div>
                    <div className="issued-to" style={{marginLeft: '40px'}} ><b style ={{fontSize :"15px",marginTop:'0px'}}>Value (ApproxRs): </b> <h5 style={{ textAlign: 'left', marginTop: '4px',fontFamily:'serif' }}>{data[0]?.value}</h5></div>
                    
                    <Row gutter={[16, 16]} style={{ marginLeft: '10px', paddingLeft: '30px' }}>
                        <Col span={8}>
                            <div style={{fontFamily:'serif'}}>
                                <h4>Prepared By :<br /> {data[0]?.created_user}</h4>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{fontFamily:'serif'}}>
                                <h4>Received By</h4>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{fontFamily:'serif'}}>
                                <h4>Authorised Signatory</h4>
                                <br />
                                {data[0]?.sign_path && (
                                    <img
                                        src= {'http://172.20.50.169/delivery-chalan/dist/services/dc/upload-files/'+ data[0]?.user_signature}
                                        alt={`Signature of ${sign}`}
                                        style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                                    />

                                )}
                                For Shahi Exports Pvt. Ltd
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <p style={{textAlign:'left', fontSize:'11px',fontFamily:'serif'}}>
                            The goods covered under open Policy NO. TATA-AIG/ MARINE/ DEUT0784BBY w.e.f 01.04.2023 to 31.03.2024
                        </p>
                    </Row>
                </body>
            </html>
        </Card>
    )

} export default DcPrint