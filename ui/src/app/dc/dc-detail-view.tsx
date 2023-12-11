import { Button, Card, Col, Descriptions, Row, Table, message } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { DcIdReq, ToAddressReq, UnitReq } from "libs/shared-models";
import { AddressService, DcService } from "libs/shared-services";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface DcViewProps {
  dcId: number
}

export const DcDetailsView = (props: DcViewProps) => {
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

  console.log(addressData)

  const itemColumns: any = [
    {
      title: 'S No',
      key: 'sno',
      width: '70px',
      responsive: ['sm'],
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
      onCell: (record: any) => ({
        rowSpan: record.rowSpan,
      }),
      fixed: 'left',
    },
    {
      title: 'Item Code',
      key: 'itemCode',
      dataIndex: 'itemCode',
    },
    {
      title: 'Item Name',
      key: 'Item Name',
      dataIndex: 'itemName',
    },
    {
      title: 'Description',
      key: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Uom',
      key: 'Uom',
      dataIndex: 'uom',
    },
    {
      title: 'Quantity',
      key: 'Quantity',
      dataIndex: 'qty',
      align: 'right',
    },

    {
      title: 'Rate',
      key: 'Rate',
      dataIndex: 'rate',
      align: 'right',
    },
    {
      title: 'Amount',
      key: 'Amount',
      dataIndex: 'amount',
      align: 'right',
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Card>
        <Card title="Dc Detail View" headStyle={{ backgroundColor: '#69c0ff', border: 0 }} extra={<span style={{ color: 'white' }} > <Button className='panel_button' >Print</Button> <Button className='panel_button' onClick={() => navigate('/dc-view')}>DC View</Button> </span>} >
          <Descriptions size='small' >
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>DC Number</span>}>{data[0]?.dcNumber}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Created Date</span>}>{data[0]?.createdDate}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Created By</span>}>{data[0]?.created_user}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Department</span>}>{data[0]?.department}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Weight (Kg)</span>}>{data[0]?.weight}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Status</span>}>{data[0]?.status}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Value</span>}>{data[0]?.value}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Mode Of Transport</span>}>{data[0]?.modeOfTransport}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Requested By</span>}>{data[0]?.requestedBy}</DescriptionsItem>
          </Descriptions>
          <Descriptions size='small' >
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Returnable</span>}>{data[0]?.returnable}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Dc Assign</span>}>{data[0]?.isDcAssign}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Assign By</span>}>{data[0]?.assignBy}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Remarks</span>}>{data[0]?.remarks}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Is Accepted</span>}>{data[0]?.is_accepted}</DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>Accepted By</span>}>{data[0]?.acceptedUser}</DescriptionsItem>
          </Descriptions>
          
          
          <Row gutter={24}>

            <Col className="cardComp" xs={24} sm={24} md={8} xl={12}>
              <Card>
                <Descriptions>
                  <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>From Address</span>}>{data[0]?.fromUnit}</DescriptionsItem>
                </Descriptions>
                <Descriptions column={2}>
                  <Descriptions.Item label="Line One">{addressData[0]?.lineOne}</Descriptions.Item>
                  <Descriptions.Item label="Line Two">{addressData[0]?.lineTwo}</Descriptions.Item>
                </Descriptions>
                <Descriptions column={3}><Descriptions.Item label="City">{addressData[0]?.city}</Descriptions.Item>
                  <Descriptions.Item label="Pin code">{addressData[0]?.pinCode}</Descriptions.Item>
                  <Descriptions.Item label="Dist">{addressData[0]?.dist}</Descriptions.Item>
                  <Descriptions.Item label="State">{addressData[0]?.state}</Descriptions.Item>
                  <Descriptions.Item label="Country">{addressData[0]?.country}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col className="cardComp" xs={24} sm={24} md={8} xl={12}>
              <Card>
                <Descriptions>
                  <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack' }}>To Address</span>}>{data[0]?.toAddresserName
                  }</DescriptionsItem>
                </Descriptions>
                <Descriptions column={2}>
                  <Descriptions.Item label="Line One">{toAddressData[0]?.lineOne}</Descriptions.Item>
                  <Descriptions.Item label="Line Two">{toAddressData[0]?.lineTwo}</Descriptions.Item>
                </Descriptions>
                <Descriptions column={3}><Descriptions.Item label="City">{toAddressData[0]?.city}</Descriptions.Item>
                  <Descriptions.Item label="Pin code">{toAddressData[0]?.pinCode}</Descriptions.Item>
                  <Descriptions.Item label="Dist">{toAddressData[0]?.dist}</Descriptions.Item>
                  <Descriptions.Item label="State">{toAddressData[0]?.state}
                  </Descriptions.Item><Descriptions.Item label="Country">{toAddressData[0]?.country}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
          <br />
          <Table
            rowKey={record => record.dc_item_id}
            columns={itemColumns}
            dataSource={data}
            pagination={false}
          />
        </Card>
      </Card>
    </div>

  )

}

export default DcDetailsView

