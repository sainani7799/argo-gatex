import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  RightOutlined,
  RightSquareOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  message,
} from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import {
  AcceptableEnum,
  ReceivedDcReq,
  SecurityCheckReq,
  StatusEnum,
} from '@gatex/shared-models';
import { DcService, EmailService } from '@gatex/shared-services';
import moment from 'moment';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DCSecurityIn = () => {
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
  const [unitsDrop, setUnitsDrop] = useState([])
  const [pageSize, setPageSize] = React.useState(10);

  let navigate = useNavigate();
  useEffect(() => {
    getReceivedGatePassData();
    getAllUnits();
  }, []);

  const getReceivedGatePassData = () => {
    const unitValue = authdata?.unitId;
    const req = { unitId: unitValue };
    console.log(req);
    service.getSecurityInGatePass(req).then((res: any) => {
      if (res.status) {
        setResponseData(res.data);
      }
    });
  };

  const getAllUnits = () => {
    service.getAllUnitsData().then((res) => {
      if (res.data) {
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
          style={{ backgroundColor: "#047595", color: "white", width: 90, marginRight: 8 }}
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

  const securityIn = (rowData) => {
    const authdata = JSON.parse(localStorage.getItem('userName'));
    let status;
    console.log(authdata)
    if (rowData.toAddresser === 'supplier') {
      status = StatusEnum.CLOSED;
    } else {
      if (rowData.status === StatusEnum.SENT_FOR_SECURITY_RE_CHECK_IN) {
        status = StatusEnum.READY_TO_RE_RECIEVE;
      } else {
        status = StatusEnum.READY_TO_RECEIVE;
      }
    }
    status = status;
    const dto = new SecurityCheckReq();
    dto.dcId = rowData.dcId;
    dto.securityUser = authdata?.userName;
    dto.status = status;
    console.log(dto);
    service.securityCheckIn(dto)
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
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
    },
    {
      title: 'DC Number',
      dataIndex: 'dcNumber',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      ...getColumnSearchProps('dcNumber'),
    },
    {
      title: "DC Type",
      dataIndex: "dcType",
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      ...getColumnSearchProps('dcType')
    },
    {
      title: 'From Unit',
      dataIndex: 'fromUnit',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'To Unit',
      dataIndex: 'toAddresserName',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Attention Person',
      dataIndex: 'attentionPerson',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'DC Approved By',
      dataIndex: 'acceptedUser',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },

    // {
    //     title: "created User",
    //     dataIndex: "created_user"
    // },
    {
      title: 'Created On',
      dataIndex: 'createdDate',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
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
      width : 260,
      fixed:'right',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (status) => {
        let color = 'default';
        if (status === 'OPEN') color = 'gray';
        if (status === 'ASSIGN TO APPROVAL') color = 'blue';
        if (status === 'SENT FOR APPROVAL') color = 'blue';
        if (status === 'CANCELED') color = 'red';
        if (status === 'REJECTED') color = 'red';
        if (status === 'SENT FOR SECURITY CHECK') color = 'orange';
        if (status === 'READY TO RECEIVE') color = 'green';
        if (status === 'SENT FOR SECURITY RE CHECK') color = 'orange';
        if (status === 'RECEIVED') color = 'green';
        if (status === 'RETURNED') color = 'green';
        if (status === 'READY TO RETURN') color = 'yellow';
        if (status === 'NOT RETURNED') color = 'red';
        if (status === 'CLOSED') color = 'gray';
        if (status === 'SENT FOR SECURITY CHECK IN') color = 'orange';
        if (status === 'SENT FOR SECURITY RE CHECK IN') color = 'orange';


        const tagStyle: React.CSSProperties = {
          backgroundColor: color,
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          padding: '4px 12px',
          textTransform: 'capitalize',
        };

        return (
          <Tag style={tagStyle}>
            {status.replace(/ /g, ' ')}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'requestNumber',
      align: 'center',
      fixed: 'right',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text, rowData, index) => {
        // Define the dropdown menu
        const menu = (
          <Menu>
            {/* Detail View */}
            <Menu.Item
              key="1"
              icon={<EyeOutlined style={{ color: "blue", fontSize: 20,marginRight: '8px' }} />}
              onClick={() => {
                navigate(`/dc-detail-view-security/${rowData.dcId}/security`);
              }}
            >
              Detail View
            </Menu.Item>

            {/* Conditional Security Check */}
            {rowData.status === 'SENT FOR SECURITY CHECK IN' || rowData.status === StatusEnum.SENT_FOR_SECURITY_RE_CHECK_IN ? (
              <Menu.Item key="2">
                <Popconfirm
                  onConfirm={() => {
                    securityIn(rowData);
                  }}
                  title={
                    rowData.status === 'SENT FOR SECURITY CHECK IN'
                      ? 'Are You Done Checking?'
                      : ''
                  }
                  okText="YES"
                  cancelText="NO"
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* <RightSquareOutlined /> */}
                    <Switch
                      size="default"
                      className={
                        rowData.status === status
                          ? 'toggle-activated'
                          : 'toggle-deactivated'
                      }
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      checked={rowData.status === status}
                    />
                    <span>Security Check</span>
                  </div>
                </Popconfirm>
              </Menu.Item>
            ) : (
              <Menu.Item
                key="3"
                icon={<CheckOutlined />}
                disabled
              >
                Checking Done
              </Menu.Item>
            )}
          </Menu>
        );

        return (
          <span>
            {/* 3-dots dropdown trigger */}
            <Tooltip placement="top" title="Actions">
              <Dropdown overlay={menu} trigger={['click']}>
                <MoreOutlined style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }} />
              </Dropdown>
            </Tooltip>
          </span>
        );
      },
    },
  ];

  const completedColumns: any = [
    {
      title: 'S No',
      key: 'sno',
      width: 60,
      responsive: ['sm'],
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
    },
    {
      title: 'DC Number',
      dataIndex: 'dcNumber',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      ...getColumnSearchProps('dcNumber'),
    },
    {
      title: "DC Type",
      dataIndex: "dcType",
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      ...getColumnSearchProps('dcType')
    },
    {
      title: 'From Unit',
      dataIndex: 'fromUnit',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'To Unit',
      dataIndex: 'toAddresserName',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Attention Person',
      dataIndex: 'attentionPerson',
      width:130,
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Approved By',
      dataIndex: 'acceptedUser',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Checked By',
      dataIndex: 'CheckedUser',
      width:120,
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Checked Date',
      dataIndex: 'secUserDate',
      width:150,
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (val, rec) => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-'
      }
    },

    // {
    //     title: "created User",
    //     dataIndex: "created_user"
    // },
    {
      title: 'Created On',
      dataIndex: 'createdDate',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
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
      width: 200,
      fixed:'right',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (status) => {
        let color = 'default';
        if (status === 'OPEN') color = 'gray';
        if (status === 'ASSIGN TO APPROVAL') color = 'blue';
        if (status === 'SENT FOR APPROVAL') color = 'blue';
        if (status === 'CANCELED') color = 'red';
        if (status === 'REJECTED') color = 'red';
        if (status === 'SENT FOR SECURITY CHECK') color = 'orange';
        if (status === 'READY TO RECEIVE') color = 'green';
        if (status === 'SENT FOR SECURITY RE CHECK') color = 'orange';
        if (status === 'RECEIVED') color = 'green';
        if (status === 'RETURNED') color = 'green';
        if (status === 'READY TO RETURN') color = 'yellow';
        if (status === 'NOT RETURNED') color = 'red';
        if (status === 'CLOSED') color = 'gray';
        if (status === 'SENT FOR SECURITY CHECK IN') color = 'orange';
        if (status === 'SENT FOR SECURITY RE CHECK IN') color = 'orange';


        const tagStyle: React.CSSProperties = {
          backgroundColor: color,
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          padding: '4px 12px',
          textTransform: 'capitalize',
        };

        return (
          <Tag style={tagStyle}>
            {status.replace(/ /g, ' ')}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'requestNumber',
      align: 'center',
      fixed: 'right',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text, rowData, index) => {
        // Define the dropdown menu
        const menu = (
          <Menu>
            {/* Detail View */}
            <Menu.Item
              key="1"
              icon={<EyeOutlined style={{ color: "blue", fontSize: 20,marginRight: '8px' }} />}
              onClick={() => {
                navigate(`/dc-detail-view-security/${rowData.dcId}/security`);
              }}
            >
              Detail View
            </Menu.Item>

            {/* Conditional Security Check */}
            {rowData.status === 'SENT FOR SECURITY CHECK IN' || rowData.status === StatusEnum.SENT_FOR_SECURITY_RE_CHECK_IN ? (
              <Menu.Item key="2">
                <Popconfirm
                  onConfirm={() => {
                    securityIn(rowData);
                  }}
                  title={
                    rowData.status === 'SENT FOR SECURITY CHECK IN'
                      ? 'Are You Done Checking?'
                      : ''
                  }
                  okText="YES"
                  cancelText="NO"
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RightSquareOutlined style={{ color: "blue", fontSize: 20,marginRight: '8px' }} />
                    <span>Security Check</span>
                    <Switch
                      size="default"
                      className={
                        rowData.status === status
                          ? 'toggle-activated'
                          : 'toggle-deactivated'
                      }
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      checked={rowData.status === status}
                    />
                  </div>
                </Popconfirm>
              </Menu.Item>
            ) : (
              <Menu.Item
                key="3"
                icon={<CheckOutlined />}
                disabled
              >
                Checking Done
              </Menu.Item>
            )}
          </Menu>
        );

        return (
          <span>
            {/* 3-dots dropdown trigger */}
            <Tooltip placement="top" title="Actions">
              <Dropdown overlay={menu} trigger={['click']}>
                <MoreOutlined style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }} />
              </Dropdown>
            </Tooltip>
          </span>
        );
      },
    }

  ]

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
}

  return (
    <Card title={<><SafetyCertificateOutlined style={{ fontSize: '24px', marginRight: 8,color: "white" }} /><span style={{ color: 'white' }}>Security Check In</span></>} headStyle={{ backgroundColor: '#047595', color: 'black' }} >
      <Tabs defaultActiveKey="2">
        <TabPane tab={<><span> <ExclamationCircleOutlined style={{ fontSize: '20px', color: '#016582', marginRight: 8 }} />Pending Security</span></>} key="2">
          <Table
            columns={columnsSkelton}
            dataSource={responseData.filter(
              (item) => item.status === 'SENT FOR SECURITY CHECK IN' ||
                item.status === StatusEnum.SENT_FOR_SECURITY_RE_CHECK_IN

            )}
            pagination={{
              current: page,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
              }
          }}
          onChange={onChange}
            scroll={{ x: 1400, y: 400 }}
          />
        </TabPane>
        <TabPane tab={<><span><CheckCircleOutlined style={{fontSize: '20px', color: '#016582', marginRight: 8 }} />Approved DCs</span></>} key="1">
          <Table
            columns={completedColumns}
            dataSource={responseData.filter(
              (item) => item.status === 'READY TO RECEIVE' || item.status === 'CLOSED' || item.status === StatusEnum.READY_TO_RE_RECIEVE
            )}
            pagination={{
              current: page,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
              }
          }}
          onChange={onChange}
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
export default DCSecurityIn;
