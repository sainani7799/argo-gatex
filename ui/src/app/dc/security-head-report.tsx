import {
  CheckOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  RightOutlined,
  RightSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
  Tooltip,
  message,
} from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import {
  AcceptableEnum,
  DcReportReq,
  ReceivedDcReq,
  SecurityCheckReq,
  StatusEnum,
} from 'libs/shared-models';
import { DcService, EmailService, EmployeeService } from 'libs/shared-services';
import moment from 'moment';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';

export default function SecurityHeadReport() {
  const { RangePicker } = DatePicker  ;
  const [form] = Form.useForm();
  const [responseData, setResponseData] = useState<any>([]);
  const authdata = JSON.parse(localStorage.getItem('userName'));
  const [page, setPage] = React.useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const searchInput = useRef(null);
  const service = new DcService();
  const [units, setUnits] = useState([]);
  const [dcDataDrop, setDcDataDrop] = useState([]);
  const [dcItemsDrop,setDcItemDrop]= useState([]);
  const [selectedEstimatedFromDate, setSelectedEstimatedFromDate] = useState(undefined);
  const [selectedEstimatedToDate, setSelectedEstimatedToDate] = useState(undefined);
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [approvedData,setApprovedData] = useState([])
  const [checkedData,setCheckedData] = useState([])
  const [receivedData,setReceivedData] = useState([])
  const [purposeData,setPurposedata] = useState([])
  const [createdData,setCreatedData] = useState([])
  const [initialDate, setInitialDate] = useState([dayjs(), dayjs()]);
  const empService = new EmployeeService();
  const Option = Select;
  let navigate = useNavigate();

  useEffect(() => {
    // securityReport();
    getAllUnits();
    getDcDrop();
    getItemDrop();
    getEmpDrop();
    getApprovedBy();
    getCheckedBy();
    getReceivedBy();
    getPurpose();
    getCreated();
    // form.setFieldsValue({
    //   date: [(moment(moment().format("YYYY-MM-DD")).subtract(1,'months')),moment(moment().format("YYYY-MM-DD"))] 
    // })
  }, []);

  const EstimatedETDDate = (value) => {
    if (value) {
      const fromDate = (dayjs(value[0]).format('YYYY-MM-DD'));
      const toDate = (dayjs(value[1]).format('YYYY-MM-DD'));
      setSelectedEstimatedFromDate(fromDate)
      setSelectedEstimatedToDate(toDate)
    }
  }


  const getApprovedBy = () => {
    service.getApprovedBy().then((res) => {
      if (res.data) {
        setApprovedData(res.data);
      } else {
        setApprovedData([]);
      }
    });
  };

  const getCheckedBy = () => {
    service.getCheckedBy().then((res) => {
      if (res.data) {
        setCheckedData(res.data);
      } else {
        setCheckedData([]);
      }
    });
  };  

  const getReceivedBy = () => {
    service.getReceivedBy().then((res) => {
      if (res.data) {
        setReceivedData(res.data);
      } else {
        setReceivedData([]);
      }
    });
  };
  
  const getPurpose = () => {
    service.getPurpose().then((res) => {
      if (res.data) {
        setPurposedata(res.data);
      } else {
        setPurposedata([]);
      }
    });
  };

  const getCreated = () => {
    service.getCreated().then((res) => {
      if (res.data) {
        setCreatedData(res.data);
      } else {
        setCreatedData([]);
      }
    });
  };

  const securityReport = (onReset?: boolean) => {
   const req = new DcReportReq();
   req.dcId = form.getFieldValue('dcNumber')
   req.dcFromDate =  moment(selectedEstimatedFromDate).format('YYYY-MM-DD');
   req.dcToDate =  moment(selectedEstimatedToDate).format('YYYY-MM-DD');
   req.itemCodeId = form.getFieldValue('itemCode')
   req.approvedBy = form.getFieldValue('approvedBy')
   req.checkedBy = form.getFieldValue('checkedBy')
   req.receivedBy = form.getFieldValue('receivedBy')
   req.createdBy = form.getFieldValue('createdBy')
   req.fromUnit = form.getFieldValue('fromUnit')
   req.toUnit = form.getFieldValue('toUnit')
   req.purpose = form.getFieldValue('purpose')
    service.securityReport(req).then((res: any) => {
      if (res.status) {
        setResponseData(res.data);
      }
    });
  };

  const getEmpDrop = () => {
    service.getEmpDrop().then(res => {
        if (res) {
            setEmployeeData(res.data);
        } else {
            if (res.data) {
                setEmployeeData([]);
                // AlertMessages.getErrorMessage(res.internalMessage);
            } else {
                //  AlertMessages.getErrorMessage(res.internalMessage);
            }
        }
    }).catch(err => {
        setEmployeeData([]);
        // AlertMessages.getErrorMessage(err.message);
    })
}

  const getAllUnits = () => {
    service.getAllUnitsData().then((res) => {
      if (res.data) {
        setUnits(res.data);
      }
    });
  };

  const getDcDrop = () => {
    service.getDcDrop().then((res) => {
      if (res.data) {
        setDcDataDrop(res.data);
      } else {
        setDcDataDrop([]);
      }
    });
  };

  const getItemDrop = () => {
    service.getItemDrop().then((res) => {
      if (res.data) {
        setDcItemDrop(res.data);
      } else {
        setDcItemDrop([]);
      }
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          size="small"
          style={{ width: 90 }}
          onClick={() => {
            handleReset(clearFilters);
            setSearchedColumn(dataIndex);
            confirm({ closeDropdown: true });
          }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        type="search"
        style={{ color: filtered ? '#1890ff' : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : false,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select());
      }
    },
    render: (text) =>
      text ? (
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        )
      ) : null,
  });

  const data = [
    {
      title: 'DC Number',
      dataIndex: 'dcNumber',
    },
    {
      title: 'DC Date',
      dataIndex: 'dcDate',
      render: (val, rec) => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      title: 'From Unit',
      dataIndex: 'fromUnit',
    },
    {
      title: 'To Unit',
      dataIndex: 'toUnit',
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
    },
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
    },
    {
      title: 'Approved BY',
      dataIndex: 'approvedBy',
    },
    {
      title: 'Checked By',
      dataIndex: 'checkedBy',
    },
    {
      title: 'Checked Date & Time',
      dataIndex: 'checkedDate',
      render: (val, rec) => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      title: 'Received By',
      dataIndex: 'receivedBy',
    },
    {
      title: 'Received Date & Time',
      dataIndex: 'receivedDate',
      render: (val, rec) => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
    },
    {
      title: 'Status',
      dataIndex: 'dcStatus',
    },

    {
      title: 'Remarks',
      dataIndex: 'remarks',
    },
  ]

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet('gatePassDc')
      .addColumns(data)
      .addDataSource(responseData,{str2num:true})
      .saveAs('gate-pass-dc.xlsx');
  }

  const columnsSkelton: any = [
    {
      title: 'S No',
      key: 'sno',
      width: 60,
      responsive: ['sm'],
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
    },
    {
      title: 'DC Number',
      dataIndex: 'dcNumber',
      ...getColumnSearchProps('dcNumber'),
    },
    {
      title: 'DC Date',
      dataIndex: 'dcDate',
      render: (val, rec) => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      title: 'From Unit',
      dataIndex: 'fromUnit',
    },
    {
      title: 'To Unit',
      dataIndex: 'toUnit',
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
    },
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
    },
    {
      title: 'Approved BY',
      dataIndex: 'approvedBy',
    },
    {
      title: 'Checked By',
      dataIndex: 'checkedBy',
    },
    {
      title: 'Checked Date & Time',
      dataIndex: 'checkedDate',
      render: (val, rec) => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      title: 'Received By',
      dataIndex: 'receivedBy',
    },
    {
      title: 'Received Date & Time',
      dataIndex: 'receivedDate',
      render: (val, rec) => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      ...getColumnSearchProps('purpose'),
    },
    {
      title: 'Status',
      dataIndex: 'dcStatus',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
    },
  ];

  const onReset = () => {
    form.resetFields();
    EstimatedETDDate(undefined);
    setSelectedEstimatedFromDate(undefined);
    setSelectedEstimatedToDate(undefined);
  }
  console.log(dcDataDrop)

  return (
    <>
      <Card
        title={<span style={{ color: 'white' }}> Gate Pass DC Transaction reports</span>}
        headStyle={{ backgroundColor: '#7d33a2', color: 'black' }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="fromUnit" label="From Unit">
                <Select allowClear showSearch placeholder={'Select'}>
                  {units.map((u) => {
                    return <Option value={u.id}>{u.unitName}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="toUnit" label="To Unit">
                <Select mode='multiple' allowClear showSearch placeholder={'Select'}>
                  {units.map((u) => {
                    return <Option value={u.id}>{u.unitName}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="dcNumber" label="Dc Number">
                <Select allowClear showSearch placeholder={'Select'}>
                  {dcDataDrop.map((d) => {
                    return <Option value={d.dcId}>{d.dcNumber}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="itemCode" label="Item Code">
                <Select allowClear showSearch placeholder={'Select'}>
                  {dcItemsDrop.map((d) => {
                    return <Option value={d.dcItemId}>{d.itemCode}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="date" label="DC Date" initialValue={initialDate}>
                <RangePicker onChange={EstimatedETDDate} />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="approvedBy" label="Approved By">
                <Select allowClear showSearch placeholder={'Select'}>
                  {approvedData.map((d) => {
                    return <Option value={d.employeeId}>{d.employeeName}</Option>;
                  })}
                </Select>
              </Form.Item>
              </Col>
              <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="checkedBy" label="Checked By">
                <Select allowClear showSearch placeholder={'Select'}>
                  {checkedData.map((d) => {
                    return <Option value={d.securityUser}>{d.securityUser}</Option>;
                  })}
                </Select>
              </Form.Item>
              </Col>
              <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="receivedBy" label="Received By">
                <Select allowClear showSearch placeholder={'Select'}>
                  {receivedData.map((d) => {
                    return <Option value={d.receivedUser}>{d.receivedUser}</Option>;
                  })}
                </Select>
              </Form.Item>
              </Col>
              <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="purpose" label="Purpose">
                <Select allowClear showSearch placeholder={'Select'}>
                  {purposeData.map((d) => {
                    return <Option value={d.purpose}>{d.purpose}</Option>;
                  })}
                </Select>
              </Form.Item>
              </Col>
              <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 5, offset: 1 }}
              lg={{ span: 5, offset: 1 }}
              xl={{ span: 5, offset: 1 }}
            >
              <Form.Item name="createdBy" label="Created By">
                <Select allowClear showSearch placeholder={'Select'}>
                  {createdData.map((d) => {
                    return <Option value={d.createdUser}>{d.createdUser}</Option>;
                  })}
                </Select>
              </Form.Item>
              </Col>
          </Row>
          <Row justify={'end'} gutter={24}>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                <Button onClick={() => securityReport()} type='primary'>Submit</Button>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                <Button onClick={onReset}>Reset</Button>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                <Button onClick={exportExcel} icon={<DownloadOutlined />}>Excel</Button>
              </Col>
          </Row>
        </Form>
        {
          responseData.length > 0 && (
            <Table
            columns={columnsSkelton}
            dataSource={responseData}
            scroll={{ x: 2500, y: 400 }}
          />
            )
        }

      </Card>
    </>
  );
}
