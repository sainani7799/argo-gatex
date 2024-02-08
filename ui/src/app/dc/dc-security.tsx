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

const DCSecurity = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [responseData, setResponseData] = useState<any>([]);
  const authdata = JSON.parse(localStorage.getItem('userName'));
  const [page, setPage] = React.useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const searchInput = useRef(null);
  const service = new DcService();
  const [unitsDrop,setUnitsDrop] = useState([])

  let navigate = useNavigate();
  useEffect(() => {
    getReceivedGatePassData();
    getAllUnits();
  }, []);

  const getReceivedGatePassData = () => {
    const unitValue = authdata.unitId;
    const req = { unitId: unitValue };
    console.log(req);
    service.getSecurityGatePass(req).then((res: any) => {
      if (res.status) {
        setResponseData(res.data);
      }
    });
  };

  const getAllUnits=()=>{
    service.getAllUnitsData().then((res)=>{
      if(res.data){
        setUnitsDrop(res.data)
      }
    })
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
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

  const securityDone = (rowData) => {
    const authdata = JSON.parse(localStorage.getItem('userName'));
    let status;
    console.log(authdata)
    if (rowData.toAddresser === 'supplier') {
      status = StatusEnum.CLOSED;
    } else {
      status = StatusEnum.READY_TO_RECEIVE;
    }
    status = status;
    const dto = new SecurityCheckReq();
    dto.dcId = rowData.dcId;
    dto.securityUser = authdata.userName;
    dto.status = status;
    console.log(dto);
    service
      .securityCheckDone(dto)
      .then((res) => {
        if (res.status) {
          message.success('Updated Successfully');
          setDrawerVisible(false);
          getReceivedGatePassData();
        } else {
          message.error(res.internalMessage);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

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
    {
      title: 'Action',
      dataIndex: 'requestNumber',
      align: 'center',
      fixed: 'right',
      render: (text, rowData, index) => (
        <span>
          <Tooltip placement="top" title="Detail View">
            <EyeOutlined
              onClick={() => {
                navigate(`/dc-detail-view-security/${rowData.dcId}/security`);
              }}
              style={{ color: 'blue', fontSize: 20 }}
            />
            <Divider type="vertical" />
          </Tooltip>
          {/* <Divider type="vertical" /> */}
          {rowData.status === 'SENT FOR SECURITY CHECK' ? (
            <Popconfirm
              onConfirm={(e) => {
                securityDone(rowData);
              }}
              title={
                rowData.status === 'SENT FOR SECURITY CHECK'
                  ? 'Are You Done Checking'
                  : ''
              }
              okText="YES"
              cancelText="NO"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Switch
                size="default"
                className={
                  rowData.status === status
                    ? 'toggle-activated'
                    : 'toggle-deactivated'
                }
                checkedChildren={<RightSquareOutlined type="check" />}
                unCheckedChildren={<RightSquareOutlined type="close" />}
                checked={rowData.status === status}
              />
            </Popconfirm>
          ) : (
            <Tooltip placement="top" title="Checking Done">
              <CheckOutlined
                onClick={() => {
                  // Handle click for the other icon
                }}
                style={{ color: 'gray', fontSize: 20 }}
              />
            </Tooltip>
          )}
        </span>
      ),
    },
  ];

  const completedColumns :any =[
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
    {
      title:'Checked BY',
      dataIndex:'CheckedUser'
    },
    {
      title:'Checked Date',
      dataIndex:'secUserDate',
      render:(val,rec) =>{
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-'
      }
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
    {
      title: 'Action',
      dataIndex: 'requestNumber',
      align: 'center',
      fixed: 'right',
      render: (text, rowData, index) => (
        <span>
          <Tooltip placement="top" title="Detail View">
            <EyeOutlined
              onClick={() => {
                navigate(`/dc-detail-view-security/${rowData.dcId}/security`);
              }}
              style={{ color: 'blue', fontSize: 20 }}
            />
            <Divider type="vertical" />
          </Tooltip>
          {/* <Divider type="vertical" /> */}
          {rowData.status === 'SENT FOR SECURITY CHECK' ? (
            <Popconfirm
              onConfirm={(e) => {
                securityDone(rowData);
              }}
              title={
                rowData.status === 'SENT FOR SECURITY CHECK'
                  ? 'Are You Done Checking'
                  : ''
              }
              okText="YES"
              cancelText="NO"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Switch
                size="default"
                className={
                  rowData.status === status
                    ? 'toggle-activated'
                    : 'toggle-deactivated'
                }
                checkedChildren={<RightSquareOutlined type="check" />}
                unCheckedChildren={<RightSquareOutlined type="close" />}
                checked={rowData.status === status}
              />
            </Popconfirm>
          ) : (
            <Tooltip placement="top" title="Checking Done">
              <CheckOutlined
                onClick={() => {
                  // Handle click for the other icon
                }}
                style={{ color: 'gray', fontSize: 20 }}
              />
            </Tooltip>
          )}
        </span>
      ),
    },
  ]

  return (
    <Card title={<span style={{ color: 'white' }}>SECURITY CHECK</span>} headStyle={{ backgroundColor: '#7d33a2', color: 'black' }} >
      <Tabs defaultActiveKey="2">
      <TabPane tab="Security Pending" key="2">
          <Table
            columns={columnsSkelton}
            dataSource={responseData.filter(
              (item) => item.status === 'SENT FOR SECURITY CHECK'
            )}
            scroll={{ x: 1400, y: 400 }}
          />
        </TabPane>
        <TabPane tab="Security Checked Dc's" key="1">
          <Table
            columns={completedColumns}
            dataSource={responseData.filter(
              (item) => item.status === 'READY TO RECEIVE'
            )}
            scroll={{ x: 1400, y: 400 }}
          />
        </TabPane>
      </Tabs>
      <Drawer
        styles={{ body: { paddingBottom: '80' } }}
        title="Update"
        width={window.innerWidth > 768 ? '80%' : '85%'}
        onClose={closeDrawer}
        open={drawerVisible}
        closable={true}
      >
        <Card
          headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }}
          size="small"
        >
          <Form
            form={form}
            layout="vertical"
            style={{ width: '100%', margin: '0px auto 0px auto' }}
            // onFinish={update}
          >
            <Row gutter={24}>
              <Form.Item
                name="dcId"
                label="Dc Id"
                rules={[{ required: true }]}
                style={{ display: 'none' }}
              >
                <Input hidden />
              </Form.Item>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="dcNumber"
                  label="Dc Number"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="fromUnit"
                  label="From Unit"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="toAddresserName"
                  label="To Addresser"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="emailId"
                  label="Email Id"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Card>
      </Drawer>
    </Card>
  );
};
export default DCSecurity;
