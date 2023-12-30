import { Button, Card, Col, Descriptions, Modal, Row, Table, message } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { DcIdReq, ToAddressReq, UnitReq } from "libs/shared-models";
import { AddressService, DcService } from "libs/shared-services";
import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DcPrint from './dc-print'

export interface DcViewProps {
  dcId: number
}

export const DcDetailsView = (props: DcViewProps) => {
  const [data, setData] = useState<any[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const page = 1
  const navigate = useNavigate();
  const [addressData, setAddressData] = useState<any>([]);
  const service = new DcService();
  const addressService = new AddressService();
  const [toAddressData, setToAddressData] = useState<any>([]);
  const { id } = useParams();

  const location = useLocation();
  const currentRoute = location.pathname;
  console.log(currentRoute, 'current route')
  useEffect(() => {
    getDc();
  }, [props.dcId])

  const getDc = () => {
    const req = new DcIdReq(Number(id))
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

  console.log(addressData)

  const itemColumns: any = [
    {
      title: 'S No',
      key: 'sno',
      width: '70px',
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
      onCell: (record: any) => ({
        rowSpan: record.rowSpan,
      }),
      fixed: 'left',
      responsive: ['lg'],
      hideOnXs: true,
      hideOnSm: true,
      style: { fontSize: '14px' },
    },
    {
      title: 'Item Code',
      key: 'itemCode',
      dataIndex: 'itemCode',
      responsive: ['lg'],
      hideOnXs: true,
      hideOnSm: true,
      style: { fontSize: '14px' },
    },
    {
      title: 'Item Name',
      key: 'Item Name',
      dataIndex: 'itemName',
      // responsive: ['lg'],
      hideOnXs: true,
      hideOnSm: true,
    },
    {
      title: 'Description',
      key: 'Description',
      dataIndex: 'description',
      // responsive: ['lg'],
      hideOnXs: true,
      hideOnSm: true,
    },
    {
      title: 'Uom',
      key: 'Uom',
      dataIndex: 'uom',
      hideOnXs: true,
      hideOnSm: true,
    },
    {
      title: 'Quantity',
      key: 'Quantity',
      dataIndex: 'qty',
      align: 'right',
      hideOnXs: true,
      hideOnSm: true,
    },
    {
      title: 'Rate',
      key: 'Rate',
      dataIndex: 'rate',
      align: 'right',
      hideOnXs: true,
      hideOnSm: true,
    },
    {
      title: 'Amount',
      key: 'Amount',
      dataIndex: 'amount',
      align: 'right',
      hideOnXs: true,
      hideOnSm: true,
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const printDc = () => {
  //   const divContents = document.getElementById('printme').innerHTML;
  //   const orderHTML = '<html><head><title></title></head><body>' + divContents + '</body></html>'
  //   const element = window.open('', '', 'height=700, width=1024');
  //   element.document.write(divContents);
  //   document.body.innerHTML = orderHTML;
  //   getCssFromComponent(document, element.document);
  //   element.document.close();
  //   element.print();
  //   element.close(); // to close window when click on cancel/Save
  //   setIsModalVisible(true); // model should be open
  // };

  /**
 * get form data 
 * @param fromDoc 
 * @param toDoc 
 */
  const getCssFromComponent = (fromDoc, toDoc) => {
    Array.from(fromDoc.styleSheets).forEach((styleSheet: any) => {
      if (styleSheet.cssRules) { // true for inline styles
        const newStyleElement = toDoc.createElement('style');
        Array.from(styleSheet.cssRules).forEach((cssRule: any) => {
          newStyleElement.appendChild(toDoc.createTextNode(cssRule.cssText));
        });
        toDoc.head.appendChild(newStyleElement);
      }
    });
  }
  const openPrint = () => {
    setIsModalVisible(true);
  }
  const isDetailView = location.pathname === '/dc-detail-view';

  return (
    <div>
      <Card title="Dc Detail View" headStyle={{ backgroundColor: 'rgb(125, 51, 162)', border: 0, color: '#fff' }} extra={
        <span style={{ color: 'white' }}>
          {data[0]?.is_accepted === 'YES' ? <Button className='panel_button' onClick={openPrint}>
            Print
          </Button> : ''}
          <Button
            className='panel_button'
            onClick={() => navigate('/dc-view')}
          >
            BACK
          </Button>
        </span>
      } >
        <Descriptions size='small' column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>DC Number</span>}>{data[0]?.dcNumber}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Created Date</span>}>{data[0]?.createdDate}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Created By</span>}>{data[0]?.created_user}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Returnable</span>}>{data[0]?.returnable}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Value</span>}>{data[0]?.value}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Department</span>}>{data[0]?.department}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>To Department</span>}>{data[0]?.toDepartment}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Weight (Kg)</span>}>{data[0]?.weight}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Purpose</span>}>{data[0]?.purpose}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Status</span>}>{data[0]?.status}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Requested By</span>}>{data[0]?.requestedBy}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Attention Person</span>}>{data[0]?.attentionPerson}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Dc Assign</span>}>{data[0]?.isDcAssign}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Assign By</span>}>{data[0]?.assignBy}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Email</span>}>{data[0]?.emailId}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Remarks</span>}>{data[0]?.remarks}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Is Accepted</span>}>{data[0]?.is_accepted}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Accepted By</span>}>{data[0]?.acceptedUser}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Is DC Received </span>}>{data[0]?.isDcReceived}</DescriptionsItem>
          <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Received User</span>}>{data[0]?.received_user}</DescriptionsItem>
        </Descriptions>


        <Row gutter={24}>

          <Col className="cardComp" xs={24} sm={24} md={12} xl={12}>
            <Card>
              <Descriptions >
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>From Address</span>}>{data[0]?.fromUnit}</DescriptionsItem>
              </Descriptions>
              <Descriptions >
                <Descriptions.Item label="Line One">{addressData[0]?.lineOne}</Descriptions.Item>
                <Descriptions.Item label="Line Two">{addressData[0]?.lineTwo}</Descriptions.Item>
              </Descriptions>
              <Descriptions ><Descriptions.Item label="City">{addressData[0]?.city}</Descriptions.Item>
                <Descriptions.Item label="Pin code">{addressData[0]?.pinCode}</Descriptions.Item>
                <Descriptions.Item label="Dist">{addressData[0]?.dist}</Descriptions.Item>
                <Descriptions.Item label="State">{addressData[0]?.state}</Descriptions.Item>
                <Descriptions.Item label="Country">{addressData[0]?.country}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col className="cardComp" xs={24} sm={24} md={12} xl={12}>
            <Card>
              <Descriptions >
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>To Address</span>}>{data[0]?.toAddresserName
                }</DescriptionsItem>
              </Descriptions>
              <Descriptions >
                <Descriptions.Item label="Line One">{toAddressData[0]?.lineOne}</Descriptions.Item>
                <Descriptions.Item label="Line Two">{toAddressData[0]?.lineTwo}</Descriptions.Item>
              </Descriptions>
              <Descriptions ><Descriptions.Item label="City">{toAddressData[0]?.city}</Descriptions.Item>
                <Descriptions.Item label="Pin code">{toAddressData[0]?.pinCode}</Descriptions.Item>
                <Descriptions.Item label="Dist">{toAddressData[0]?.dist}</Descriptions.Item>
                <Descriptions.Item label="State">{toAddressData[0]?.state}
                </Descriptions.Item><Descriptions.Item label="Country">{toAddressData[0]?.country}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col className="cardComp" xs={24} sm={24} md={24} xl={24}>
            <Table
              rowKey={record => record.dc_item_id}
              columns={itemColumns}
              dataSource={data}
              pagination={false}
              scroll={{ x: '10' }}
            />
            {isModalVisible ?
              <Modal
                className='print-docket-modal'
                key={'modal' + Date.now()}
                width={'75%'}
                style={{ top: 30, alignContent: 'right' }}
                visible={isModalVisible}
                title={<React.Fragment>
                </React.Fragment>}
                onCancel={handleCancel}
                footer={[

                ]}
              >

                <DcPrint dcId={props.dcId}/>
              </Modal> : ""}
          </Col>
        </Row>
      </Card>
    </div>

  )

}

export default DcDetailsView

