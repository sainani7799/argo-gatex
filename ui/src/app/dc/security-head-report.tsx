import {
  CheckOutlined,
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
  ReceivedDcReq,
  SecurityCheckReq,
  StatusEnum,
} from 'libs/shared-models';
import { DcService, EmailService } from 'libs/shared-services';
import moment from 'moment';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SecurityHeadReport() {
  const [form] = Form.useForm();
  const [responseData, setResponseData] = useState<any>([]);
  const authdata = JSON.parse(localStorage.getItem('userName'));
  const [page, setPage] = React.useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const searchInput = useRef(null);
  const service = new DcService();
  let navigate = useNavigate();

  useEffect(()=>{
    securityReport()
  },[])


  const securityReport = () => {
    const unitValue = authdata.unitId;
    const req = { unitId: unitValue };
    console.log(req);
    service.securityReport(req).then((res: any) => {
      if (res.status) {
        setResponseData(res.data);
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
      title: 'Returnable',
      dataIndex: 'returnable',
      ...getColumnSearchProps('returnable'),
    },
    {
      title: 'From Unit',
      dataIndex: 'fromUnit',
    },
    {
      title: 'To Unit',
      dataIndex: 'toAddresserName',
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
    },
    {
      title: 'Attention Person',
      dataIndex: 'attentionPerson',
    },
    {
      title: 'DC Approved By',
      dataIndex: 'acceptedUser',
    },

    // {
    //     title: "created User",
    //     dataIndex: "created_user"
    // },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      render: (text, record) => {
        const createdDate = record.createdDate;
        if (createdDate) {
          return moment(createdDate).format('DD-MM-YYYY');
        } else {
          return '-';
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'requestNumber',
    //   align: 'center',
    //   fixed: 'right',
    //   render: (text, rowData, index) => (
    //     <span>
    //       <Tooltip placement="top" title="Detail View">
    //         <EyeOutlined
    //           onClick={() => {
    //             navigate(`/dc-detail-view-security/${rowData.dcId}/security`);
    //           }}
    //           style={{ color: 'blue', fontSize: 20 }}
    //         />
    //         <Divider type="vertical" />
    //       </Tooltip>
    //       {/* <Divider type="vertical" /> */}
    //       {rowData.status === 'SENT FOR SECURITY CHECK' ? (
    //         <Popconfirm
    //           onConfirm={(e) => {
    //             securityDone(rowData);
    //           }}
    //           title={
    //             rowData.status === 'SENT FOR SECURITY CHECK'
    //               ? 'Are You Done Checking'
    //               : ''
    //           }
    //           okText="YES"
    //           cancelText="NO"
    //           icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
    //         >
    //           <Switch
    //             size="default"
    //             className={
    //               rowData.status === status
    //                 ? 'toggle-activated'
    //                 : 'toggle-deactivated'
    //             }
    //             checkedChildren={<RightSquareOutlined type="check" />}
    //             unCheckedChildren={<RightSquareOutlined type="close" />}
    //             checked={rowData.status === status}
    //           />
    //         </Popconfirm>
    //       ) : (
    //         <Tooltip placement="top" title="Checking Done">
    //           <CheckOutlined
    //             onClick={() => {
    //               // Handle click for the other icon
    //             }}
    //             style={{ color: 'gray', fontSize: 20 }}
    //           />
    //         </Tooltip>
    //       )}
    //     </span>
    //   ),
    // },
  ];

  return (
    <>
        <Card title={<span style={{ color: 'white' }}>SECURITY REPORT</span>} headStyle={{ backgroundColor: '#7d33a2', color: 'black' }} >
            <Form  form={form}
            layout="vertical">
                <Row gutter={24}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="fromUnit"
                  label="From Unit"
                  rules={[{ required: true }]}
                >
                  <Input  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="toUnit"
                  label="To Unit"
                  rules={[{ required: true }]}
                >
                  <Input  />
                </Form.Item>
              </Col>
                </Row>
            </Form>
      <Table
        columns={columnsSkelton}
        dataSource={responseData}
        scroll={{ x: 1400, y: 400 }}
      />
        </Card>
    </>
  );
}
