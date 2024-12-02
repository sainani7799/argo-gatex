import {
  CheckCircleOutlined,
  CheckOutlined,
  ContainerOutlined,
  CreditCardOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FilterOutlined,
  IdcardOutlined,
  KeyOutlined,
  LockOutlined,
  MoreOutlined,
  RedEnvelopeOutlined,
  RightOutlined,
  RightSquareOutlined,
  SafetyCertificateOutlined,
  ScanOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import {
  Modal,
  Table,
  Input,
  Form,
  Popconfirm,
  Card,
  Row,
  Button,
  Col,
  Tooltip,
  message,
  Switch,
  Divider,
  Drawer,
  Select,
  Descriptions,
  Radio,
  Tabs,
  Tag,
  Menu,
  Dropdown,
  Badge,
} from 'antd';
import {
  AddressService,
  ApprovalUserService,
  DcService,
  DepartmentService,
  EmailService,
} from 'libs/shared-services';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import {
  AcceptReq,
  AcceptableEnum,
  ApprovalIdReq,
  AssignReq,
  CreateAddressDto,
  DcEmailModel,
  DcIdReq,
  DcReq,
  StatusEnum,
  ToAddressReq,
  UnitReq,
} from 'libs/shared-models';
import DCForm from './dc-form';
import moment from 'moment';
import TextArea from 'antd/es/input/TextArea';
import DescriptionsItem from 'antd/es/descriptions/Item';
import TabPane from 'antd/es/tabs/TabPane';
const { Option } = Select;

const DCGrid = () => {
  const [form] = Form.useForm();
  const [responseData, setResponseData] = useState<any>([]);
  const service = new DcService();
  const approvalService = new ApprovalUserService();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(undefined);
  const [mailLoading, setMailLoading] = useState<boolean>(false);
  const authdata = JSON.parse(localStorage.getItem('userName'));
  const [user, setUser] = useState<any>([]);
  const searchInput = useRef(null);
  const mailService = new EmailService();
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [selectedDc, setSelectedDc] = useState<any>(undefined);
  const [data, setData] = useState([]);
  const [radioValue, setRadioValue] = useState({});
  const addressService = new AddressService();
  const [addressData, setAddressData] = useState([]);
  const [toAddressData, setToAddressData] = useState([]);
  const [deps, setDeps] = useState<any>([]);
  const [toData, setToData] = useState([]);
  const departmentService = new DepartmentService();
  const { TabPane } = Tabs;
  const [drawerFilterVisible, setDrawerFilterVisible] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [filters, setFilters] = useState({
    dcType: '',
    status: '',
  });
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filteredData1, setFilteredData1] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("1");

  let navigate = useNavigate();

  useEffect(() => {
    getGatePassData();
    getAllApprovalUser();
    getAllGatePassReturnableData();
    getDeps();
  }, []);

  useEffect(() => {
    if (selectedDc) {
      console.log(selectedDc, 'inside useEffect');
      getFromAddress(selectedDc?.toAddresserNameId),
        getAllToAddressByUnit(selectedDc);
    }
  }, [selectedDc]);

  useEffect(() => {
    setFilteredData(responseData);
    setFilteredData1(toData); // Set initial data
  }, [responseData,toData]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

//   const applyFilters = () => {
//     // If no filters are applied, show all data
//     if (!filters.dcType && !filters.status) {
//       setFilteredData(responseData);
//       setAppliedFiltersCount(0);
//       setDrawerFilterVisible(false);
//       return;
//     }
  
//     // Apply filters
//     let filtered = [...responseData];
  
//     if (filters.dcType) {
//       filtered = filtered.filter((item) => item.dcType === filters.dcType);
//     }
//     if (filters.status) {
//       filtered = filtered.filter((item) => item.status === filters.status);
//     }
  
//     setFilteredData(filtered);
  
//     // Calculate the number of applied filters
//     const count = Object.values(filters).filter((value) => value).length;
//     setAppliedFiltersCount(count);
  
//     setDrawerFilterVisible(false); // Close the drawer
//   };
  
const applyFilters = () => {
    if (activeTab === "1") {
      // Filtering logic for Tab 1 (responseData)
      if (!filters.dcType && !filters.status) {
        setFilteredData(responseData);
        setAppliedFiltersCount(0);
        setDrawerFilterVisible(false);
        return;
      }
  
      let filtered = [...responseData];
      if (filters.dcType) {
        filtered = filtered.filter((item) => item.dcType === filters.dcType);
      }
      if (filters.status) {
        filtered = filtered.filter((item) => item.status === filters.status);
      }
      setFilteredData(filtered);
    } else if (activeTab === "2") {
      // Filtering logic for Tab 2 (toData)
      if (!filters.dcType && !filters.status) {
        setFilteredData1(toData);
        setAppliedFiltersCount(0);
        setDrawerFilterVisible(false);
        return;
      }
  
      let filtered = [...toData];
      if (filters.dcType) {
        filtered = filtered.filter((item) => item.dcType === filters.dcType);
      }
      if (filters.status) {
        filtered = filtered.filter((item) => item.status === filters.status);
      }
      setFilteredData1(filtered);
    }
  
    // Calculate applied filters count
    const count = Object.values(filters).filter((value) => value).length;
    setAppliedFiltersCount(count);
  
    setDrawerFilterVisible(false); // Close the drawer
  };
  
  const resetFilters = () => {
    setFilters({
      dcType: '',
      status: '',
    });
    setFilteredData(responseData);
    setAppliedFiltersCount(0);
    form.resetFields();
  };

  const getGatePassData = () => {
    const unitValue = authdata?.unitId;
    const req = { unitId: unitValue };
    service.getAllGatePass(req).then((res: any) => {
      if (res.status) {
        setResponseData(res.data);
      }
    });
  };

  const getAllGatePassReturnableData = () => {
    const unitValue = authdata?.unitId;
    const req = { unitId: unitValue };
    service.getAllGatePassReturnable(req).then((res: any) => {
      if (res.status) {
        setToData(res.data);
      }
    });
  };

  const getAllApprovalUser = () => {
    approvalService.getAllApprovalUser().then((res: any) => {
      if (res.status) {
        setUser(res.data);
      }
    });
  };
  const getAllApprovalIdUser = () => {
    const req = new ApprovalIdReq();
    req.approvedUserId = form.getFieldValue('assignBy');
    console.log(req);
    approvalService.getAllApprovalIdUser(req).then((res: any) => {
      if (res.status) {
        form.setFieldValue('emailId', res.data[0]?.emailId);
      }
    });
  };

  const update = (dto: AssignReq) => {
    const authdata = JSON.parse(localStorage.getItem('userName'));
    (dto.updatedUser = authdata?.userName),
      (dto.status = StatusEnum.SENT_FOR_APPROVAL),
      (dto.isAssignable = AcceptableEnum.YES),
      (dto.assignBy = form.getFieldValue('assignBy'));
    dto.emailId = form.getFieldValue('emailId');
    dto.dcId = form.getFieldValue('dcId');
    console.log(dto);
    service
      .updateDc(dto)
      .then((res) => {
        if (res.status) {
          message.success('Updated Successfully');
          sendDcMailForGatePass();
          setDrawerVisible(false);
          getGatePassData();
        } else {
          message.error(res.internalMessage);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  let mailerSent = false;
  async function sendDcMailForGatePass() {
    const dcDetails = new DcEmailModel();
    dcDetails.dcNo = form.getFieldValue('dcNumber');
    dcDetails.to = form.getFieldValue('emailId');
    // dcDetails.to = 'kushal.siddegowda@shahi.co.in'
    dcDetails.html = `
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            #acceptDcLink {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #28a745;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 10px;
                  transition: background-color 0.3s ease, color 0.3s ease;
                  cursor: pointer;
              }
      
              #acceptDcLink.accepted {
                  background-color: #6c757d;
                  cursor: not-allowed;
              }
      
              #acceptDcLink:hover {
                  background-color: #218838;
                  color: #fff;
              }
          </style>
        </head>
        <body>
          <p>Dear team,</p>
          <p>Please find the Gate Pass details below:</p>
          <p>DC NO: ${form.getFieldValue('dcNumber')}</p>
          <p>
            Some items moved from Address: ${form.getFieldValue('fromUnit')} to
            Address: ${form.getFieldValue('toAddresserName')}
          </p>
          <p>DC created user name : ${form.getFieldValue('created_user')}</p>
          <p>Purpose of this DC : ${form.getFieldValue('purpose')}</p>
          <p>Please click the link below for details:</p>
          <input type="hidden" id="assignBy" value=${form.getFieldValue(
            'assignBy'
          )} /> 
          <input type="hidden" id="dcId" value=${form.getFieldValue('dcId')} />
      
          <a
            href="https://gatex.schemaxtech.in/#/dc-email-detail-view/${form.getFieldValue(
              'dcId'
            )}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            "
            >View Details of GatePass</a
          >
          <a
          href="https://gatex.schemaxtech.in/#/dc-email/${form.getFieldValue(
            'dcId'
          )}"
          style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #108f1a;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          "
          >Accept Gate Pass</a
        >
        <a
          href="https://gatex.schemaxtech.in/#/dc-reject-mail/${form.getFieldValue(
            'dcId'
          )}"
          style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff001e;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          "
          >Reject Gate Pass</a
        >
        </body>
      </html>
      `;
    dcDetails.subject = 'Gate Pass : ' + form.getFieldValue('dcNumber');
    const res = await mailService.sendDcMail(dcDetails);
    console.log(res);
    if (res.status == 201) {
      if (res.data.status) {
        message.success('Mail sent successfully');
        mailerSent = true;
      } else {
        message.success('Mail sent successfully');
      }
    } else {
      message.success('Mail  sent successfully');
    }
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
  const openFormWithData = (viewData: CreateAddressDto) => {
    setDrawerVisible(true);
    setSelectedAddress(viewData);
  };
  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditDrawerVisible(false);
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
          style={{
            backgroundColor: '#047595',
            color: 'white',
            width: 90,
            marginRight: 8,
          }}
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
        style={{ color: filtered ? 'white' : 'white' }}
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

  const Returnable = (val: any) => {
    console.log(val, 'valll for returnable');
  };

  const drawerForReturnable = (data: any) => {
    setSelectedDc(data);
    setEditDrawerVisible(true);
  };
  console.log(selectedDc, 'selected DC');

  const userUnitName = authdata?.unitName;

  const columnsSkelton1: any = [
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
      title: 'DC Type',
      dataIndex: 'dcType',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      ...getColumnSearchProps('dcType'),
    },
    {
      title: 'From Unit',
      dataIndex: 'fromUnit',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'To Unit/Supplier/Buyer',
      dataIndex: 'toAddresserName',
      width: 150,
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      // dataIndex: "addresserNameId",
      // render: (text, record) => {
      //     // Extract the name and keep the ID for editing
      //     const [name] = text.split("-");  // Extract only the name part
      //     const id = text.split("-")[1];   // Extract the hidden ID part (not displayed)

      //     return (
      //       <span>
      //         {name} {/* Show only the name */}
      //       </span>
      //     );
      //   }
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Receiver',
      dataIndex: 'attentionPerson',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (item) => (item ? item : '-'),
    },
    // {
    //     title: "Users Buyer Team",
    //     dataIndex: "buyerTeam",
    //     onHeaderCell: () => ({
    //         style: { backgroundColor: '#047595', color: 'white' },
    //       }),
    //     render:(item) =>  item ? item : '-'
    // },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
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
      title: 'Expected Return Date',
      dataIndex: 'expectedReturnDate',
      width: 150,
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text, record) => {
        const expectedReturnedDate = record.expectedReturnDate;
        if (expectedReturnedDate) {
          return moment(expectedReturnedDate).format('DD-MM-YYYY');
        } else {
          return '-';
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      fixed: 'right',
      width: 200,
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
          textTransform: 'capitalize' as 'capitalize',
        };

        return (
          <Tag color={color} style={tagStyle}>
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
      width: 70,
      outerWidth: '4px',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text, rowData, index) => {
        const menu = (
          <div style={{ color: '#016582' }}>
            <Menu>
              <Menu.Item key="view">
                <Tooltip placement="top" title="Detail View">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      console.log(rowData.dcId);
                      navigate(`/dc-detail-view/${rowData.dcId}`);
                    }}
                  >
                    <EyeOutlined
                      style={{
                        fontSize: '24px',
                        color: 'blue',
                        marginRight: '8px',
                      }}
                    />
                    <span>Detail View</span>
                  </div>
                </Tooltip>
              </Menu.Item>

              {rowData.isDcAssign === 'NO' ? (
                <Menu.Item key="assign">
                  <Tooltip placement="top" title="Assign DC to User">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setDrawerVisible(true);
                        form.setFieldValue('dcId', rowData.dcId);
                        form.setFieldValue('dcNumber', rowData.dcNumber);
                        form.setFieldValue('fromUnit', rowData.fromUnit);
                        form.setFieldValue(
                          'toAddresserName',
                          rowData.toAddresserName
                        );
                        form.setFieldValue('purpose', rowData.purpose);
                        form.setFieldValue(
                          'created_user',
                          rowData.created_user
                        );
                      }}
                    >
                      <RightOutlined
                        style={{
                          color: 'blue',
                          fontSize: 20,
                          marginRight: '8px',
                        }}
                      />
                      <span> Assign DC To User</span>
                    </div>
                  </Tooltip>
                </Menu.Item>
              ) : (
                <Menu.Item key="assigned">
                  <Tooltip placement="top" title="Already Assigned">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'not-allowed',
                      }}
                    >
                      <CheckOutlined
                        style={{
                          color: 'gray',
                          fontSize: 20,
                          marginRight: '8px',
                        }}
                      />
                      <span> Already Assigned</span>
                    </div>
                  </Tooltip>
                </Menu.Item>
              )}
            </Menu>
          </div>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  const columnsSkelton2: any = [
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
      title: 'DC Type',
      dataIndex: 'dcType',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      ...getColumnSearchProps('dcType'),
    },
    {
      title: 'From Unit',
      dataIndex: 'fromUnit',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'To Unit/Supplier/Buyer',
      dataIndex: 'toAddresserName',
      width: 150,
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      // dataIndex: "addresserNameId",
      // render: (text, record) => {
      //     // Extract the name and keep the ID for editing
      //     const [name] = text.split("-");  // Extract only the name part
      //     const id = text.split("-")[1];   // Extract the hidden ID part (not displayed)

      //     return (
      //       <span>
      //         {name} {/* Show only the name */}
      //       </span>
      //     );
      //   }
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Receiver',
      dataIndex: 'attentionPerson',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (item) => (item ? item : '-'),
    },
    // {
    //     title: "Users Buyer Team",
    //     dataIndex: "buyerTeam",
    //     onHeaderCell: () => ({
    //         style: { backgroundColor: '#047595', color: 'white' },
    //       }),
    //     render:(item) =>  item ? item : '-'
    // },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
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
      title: 'Returned Date',
      dataIndex: 'returnedDate',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text, record) => {
        const returnedDate = record.returnedDate;
        if (returnedDate) {
          return moment(returnedDate).format('DD-MM-YYYY');
        } else {
          return '-';
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      fixed: 'right',
      width: 200,
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
          textTransform: 'capitalize' as 'capitalize',
        };

        return (
          <Tag color={color} style={tagStyle}>
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
      width: 70,
      outerWidth: '4px',
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text, rowData, index) => {
        const menu = (
          <div style={{ color: '#016582' }}>
            <Menu>
              <Menu.Item key="view">
                <Tooltip placement="top" title="Detail View">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      console.log(rowData.dcId);
                      navigate(`/dc-detail-view/${rowData.dcId}`);
                    }}
                  >
                    <EyeOutlined
                      style={{
                        fontSize: '24px',
                        color: 'blue',
                        marginRight: '8px',
                      }}
                    />
                    <span>Detail View</span>
                  </div>
                </Tooltip>
              </Menu.Item>

              {rowData.isDcAssign === 'NO' ? (
                <Menu.Item key="assign">
                  <Tooltip placement="top" title="Assign DC to User">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setDrawerVisible(true);
                        form.setFieldValue('dcId', rowData.dcId);
                        form.setFieldValue('dcNumber', rowData.dcNumber);
                        form.setFieldValue('fromUnit', rowData.fromUnit);
                        form.setFieldValue(
                          'toAddresserName',
                          rowData.toAddresserName
                        );
                        form.setFieldValue('purpose', rowData.purpose);
                        form.setFieldValue(
                          'created_user',
                          rowData.created_user
                        );
                      }}
                    >
                      <RightOutlined
                        style={{
                          color: 'blue',
                          fontSize: 20,
                          marginRight: '8px',
                        }}
                      />
                      <span> Assign DC To User</span>
                    </div>
                  </Tooltip>
                </Menu.Item>
              ) : (
                <Menu.Item key="assigned">
                  <Tooltip placement="top" title="Already Assigned">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'not-allowed',
                      }}
                    >
                      <CheckOutlined
                        style={{
                          color: 'gray',
                          fontSize: 20,
                          marginRight: '8px',
                        }}
                      />
                      <span> Already Assigned</span>
                    </div>
                  </Tooltip>
                </Menu.Item>
              )}
            </Menu>
          </div>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  const getAllToAddressByUnit = async (val) => {
    const req = new ToAddressReq();
    req.addresser = selectedDc?.toAddresser;
    req.addresserNameId = selectedDc?.fromUnitId;
    console.log(req, 'req');

    addressService
      .getAllToAddressByUnit(req)
      .then((res) => {
        if (res) {
          setToAddressData(res.data);
        }
      })
      .catch((err) => {
        message.error('Something went wrong');
      });
  };

  const getFromAddress = (val) => {
    const req = new UnitReq();
    req.unitId = val;
    addressService
      .getAllAddressByUnit(req)
      .then((res) => {
        if (res) {
          setAddressData(res.data);
        }
      })
      .catch((err) => {
        message.error('Something went wrong');
      });
  };

  const getDeps = () => {
    departmentService.getAllDepartments().then((res) => {
      if (res) {
        setDeps(res.data);
      }
    });
  };

  const getDc = (id) => {
    const req = new DcIdReq(Number(id));
    service.getDcDetailsById(req).then((res) => {
      if (res.status) {
        setData(res.data);
      }
    });
  };
  console.log(data, 'dataaa');

  function onSubmit(val) {
    console.log(val, 'val');
  }

  const radioValueInEdit = selectedDc?.toAddresser || ' ';

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  return (
    <Card
      title={
        <div>
          <div>
            <span
              style={{ display: 'flex', alignItems: 'center', color: 'white' }}
            >
              <LockOutlined
                style={{ fontSize: '24px', color: 'white', marginRight: '8px' }}
              />
              GatePass
            </span>
          </div>
        </div>
      }
      extra={
        <Link to="/dc-form">
          <span style={{ color: 'white' }}>
            <Button>Create</Button>
          </span>
        </Link>
      }
      headStyle={{ backgroundColor: '#047595', color: 'black' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Badge count={appliedFiltersCount} offset={[10, 0]} showZero>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setDrawerFilterVisible(true)}
          >
            Filters
          </Button>
        </Badge>
      </div>
      {/* <Table columns={columnsSkelton} dataSource={responseData}
                scroll={{ x: 1400, y: 400 }} /> */}

      <Tabs defaultActiveKey="1" onChange={(key) => {setActiveTab(key)}}>
        <TabPane
          tab={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <IdcardOutlined style={{ fontSize: '24px', color: '#016582' }} />;
              GatePass
            </span>
          }
          key="1"
        >
          <Table
            columns={columnsSkelton1}
            dataSource={filteredData}
            scroll={{ x: 1500 }}
            pagination={{
              current: page,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            onChange={onChange}
          />
        </TabPane>

        <TabPane
          tab={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FileProtectOutlined
                style={{ fontSize: '24px', color: '#016582' }}
              />
              ; GatePass Returnable Status
            </span>
          }
          key="2"
        >
          <Table
            columns={columnsSkelton2}
            dataSource={filteredData1}
            scroll={{ x: 1500 }}
            pagination={{
              current: page,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            onChange={onChange}
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
            onFinish={update}
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
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 5, offset: 1 }}
                lg={{ span: 5, offset: 1 }}
                xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="dcNumber"
                  label="Dc Number"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 5, offset: 1 }}
                lg={{ span: 5, offset: 1 }}
                xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="fromUnit"
                  label="From Unit"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 5, offset: 1 }}
                lg={{ span: 5, offset: 1 }}
                xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="toAddresserName"
                  label="To Addresser"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 5, offset: 1 }}
                lg={{ span: 5, offset: 1 }}
                xl={{ span: 5, offset: 1 }}
              >
                <Form.Item
                  name="assignBy"
                  label="Approval User"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    placeholder="Select User "
                    optionFilterProp="children"
                    allowClear
                    onChange={getAllApprovalIdUser}
                  >
                    {user.map((u) => {
                      return (
                        <Option key={u.approvalUserId} value={u.approvalUserId}>
                          {u.approvalUser}
                        </Option>
                      );
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
                <Form.Item
                  name="emailId"
                  label="Email Id"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Form.Item
                name="created_user"
                label="Created User"
                style={{ display: 'none' }}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="purpose"
                label="Purpose"
                style={{ display: 'none' }}
              >
                <Input disabled />
              </Form.Item>
            </Row>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Card>
      </Drawer>
      <Drawer
        bodyStyle={{ paddingBottom: 80 }}
        title="Returnable"
        width={window.innerWidth > 768 ? '95%' : '99%'}
        onClose={closeDrawer}
        visible={editDrawerVisible}
        closable={true}
      >
        <Card
          title={<span style={{ color: 'white' }}>DC Form</span>}
          style={{ textAlign: 'center' }}
          headStyle={{ backgroundColor: '#7d33a2', border: 0 }}
          extra={
            <span>
              <Button onClick={() => navigate('/dc-view')}>Back</Button>
            </span>
          }
        >
          <Form
            form={form}
            layout="vertical"
            style={{ width: '100%', margin: '0px auto 0px auto' }}
            initialValues={{
              fromUnitId: selectedDc?.toAddresserName || '',
              warehouseId: selectedDc?.warehouseName || '',
              departmentId: selectedDc?.department || '',
              requestedBy: selectedDc?.requestedBy || '',
              toAddresser: selectedDc?.toAddresser || 'unit',
              addresserNameId: selectedDc?.fromUnit || ' ',
              purpose: selectedDc?.purpose || ' ',
              value: selectedDc?.value || ' ',
              status: selectedDc?.status || ' ',
              buyerTeam: selectedDc?.buyerTeam || ' ',
              remarks: selectedDc?.remarks || ' ',
              weight: selectedDc?.weight || ' ',
            }}
            // onValuesChange={(changedValues, allValues) => {
            //     // if (selectedDc?.dcNumber) {
            //     //   form.setFieldsValue({
            //     //     fromUnitId: selectedDc.dcNumber
            //     //   });
            //     // }
            //   }}
          >
            <Row
              gutter={24}
              style={{ width: '100%', justifyContent: 'space-around' }}
            >
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <Form.Item
                  style={{ display: 'none' }}
                  name="createdUser"
                ></Form.Item>
                <Form.Item
                  name="fromUnitId"
                  label="Unit"
                  rules={[{ required: true }]}
                >
                  <Input style={{ textAlign: 'center' }} disabled />
                </Form.Item>
                <Form.Item
                  name="warehouseId"
                  label="Warehouse"
                  rules={[{ required: true }]}
                >
                  <Input style={{ textAlign: 'center' }} disabled />
                </Form.Item>

                <Form.Item
                  name="departmentId"
                  label="Department"
                  rules={[{ required: true }]}
                >
                  <Input style={{ textAlign: 'center' }} disabled />
                </Form.Item>
                <Form.Item
                  name="requestedBy"
                  label="Requested By"
                  rules={[{ required: true }]}
                >
                  <Input style={{ textAlign: 'center' }} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <Form.Item
                  name="toAddresser"
                  label="Unit / Buyer /Supplier"
                  rules={[{ required: true }]}
                >
                  <Radio.Group
                    onChange={(e) => {
                      setRadioValue(e.target.value);
                    }}
                    value={radioValue}
                    disabled
                  >
                    <Radio value={'unit'}>Unit</Radio>
                    <Radio value={'supplier'}>Supplier</Radio>
                    <Radio value={'buyer'}>Buyer</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="addresserNameId"
                  label="To"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>

                {radioValueInEdit === 'unit' && (
                  <>
                    <Form.Item
                      name="toDepartmentId"
                      label="To Department"
                      rules={[{ required: true }]}
                    >
                      <Select
                        showSearch
                        placeholder="Select Dept "
                        optionFilterProp="children"
                        allowClear
                        // onChange={getAllToEmployees}
                      >
                        {deps?.map((dep) => {
                          return (
                            <Option key={dep.id} value={dep.id}>
                              {dep.departmentName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="attentionPerson"
                      label="Attention Person(Receiver side)"
                    >
                      {/* <Select
                                            showSearch
                                            placeholder="Select Received Person"
                                            optionFilterProp="children"
                                            allowClear

                                        > */}
                      {/* {toEmployee.map(app => (
                                                <Option key={app.employeeId} value={app.employeeId}>
                                                    {app.employeeName}
                                                </Option>
                                            ))} */}
                      <Input />
                      {/* </Select> */}
                    </Form.Item>
                  </>
                )}

                {/* <Form.Item name="vehicleNo" label="Vehicle Number">
                                <Input placeholder="Enter Vehicle Number" />
                            </Form.Item> */}
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                {/* <Form.Item name="returnable" initialValue={returnaValue} label="Returnable" rules={[
                                { required: false },
                            ]}>
                                <Radio.Group onChange={returnOnChange} value={returnaValue} defaultValue={"N"}>
                                    <Radio value={"YES"}>Yes</Radio>
                                    <Radio value={"NO"}>No</Radio>
                                </Radio.Group>
                            </Form.Item> */}
                <Form.Item
                  name="purpose"
                  label="Purpose"
                  rules={[{ required: true }]}
                >
                  <Input disabled placeholder="Enter Purpose" />
                </Form.Item>
                <Form.Item name="value" label="Value">
                  <Input placeholder="Enter Value" disabled />
                </Form.Item>
                <Form.Item name="status" label="Status">
                  <Input placeholder="Enter Value" disabled />
                </Form.Item>
                <Form.Item
                  name="buyerTeam"
                  label="Users Buyer Team"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={8} lg={8} xl={18}>
                <Form.Item name="remarks" label="Remarks">
                  <TextArea disabled placeholder="Enter Remarks" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={5}>
                <Form.Item
                  name="weight"
                  label="Weight (KGS)"
                  rules={[
                    { required: true },
                    {
                      pattern: /^[0-9]+(\.[0-9]{1,2})?$/, // Regular expression to allow numbers with up to 2 decimal places
                      message:
                        'Please enter a valid numeric value with up to 2 decimal places.',
                    },
                  ]}
                >
                  <Input disabled placeholder="Enter Weight" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col className="cardComp" xs={24} sm={24} md={12} xl={12}>
                <Card
                  size="small"
                  title={<span style={{ color: 'white' }}>From Address</span>}
                  style={{ textAlign: 'center' }}
                  headStyle={{ backgroundColor: '#7d33a2', border: 0 }}
                >
                  <Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
                    <Descriptions.Item label="Line One">
                      {addressData[0]?.lineOne}
                    </Descriptions.Item>
                    <Descriptions.Item label="Line Two">
                      {addressData[0]?.lineTwo}
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
                    <Descriptions.Item label="City">
                      {addressData[0]?.city}
                    </Descriptions.Item>
                    <Descriptions.Item label="Pin code">
                      {addressData[0]?.pinCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dist">
                      {addressData[0]?.dist}
                    </Descriptions.Item>
                    <Descriptions.Item label="State">
                      {addressData[0]?.state}
                    </Descriptions.Item>
                    <Descriptions.Item label="Country">
                      {addressData[0]?.country}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col className="cardComp" xs={24} sm={24} md={12} xl={12}>
                <Card
                  size="small"
                  title={<span style={{ color: 'white' }}>To Address</span>}
                  style={{ textAlign: 'center' }}
                  headStyle={{ backgroundColor: '#7d33a2', border: 0 }}
                >
                  <Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
                    <Descriptions.Item label="Line One">
                      {toAddressData[0]?.lineOne}
                    </Descriptions.Item>
                    <Descriptions.Item label="Line Two">
                      {toAddressData[0]?.lineTwo}
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>
                    <Descriptions.Item label="City">
                      {toAddressData[0]?.city}
                    </Descriptions.Item>
                    <Descriptions.Item label="Pin code">
                      {toAddressData[0]?.pinCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dist">
                      {toAddressData[0]?.dist}
                    </Descriptions.Item>
                    <Descriptions.Item label="State">
                      {toAddressData[0]?.state}
                    </Descriptions.Item>
                    <Descriptions.Item label="Country">
                      {toAddressData[0]?.country}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </Form>
          <br />
          <>
            {data.map((item, index) => (
              <Card key={index}>
                <Form
                  layout="vertical"
                  initialValues={{
                    itemType: item.itemType,
                    itemCode: item.itemCode,
                    itemName: item.itemName,
                    description: item.description,
                    uom: item.uom,
                    qty: item.qty,
                    rate: item.rate,
                    amount: item.amount,
                  }}
                >
                  <h1
                    style={{
                      color: '#6b54bf',
                      fontSize: '15px',
                      textAlign: 'left',
                    }}
                  >
                    ITEM DETAILS
                  </h1>
                  <Row gutter={14}>
                    <>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 4 }}
                      >
                        <Form.Item
                          name="itemType"
                          label="Item Type"
                          rules={[
                            { required: true, message: 'Item Type required' },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 4 }}
                      >
                        <Form.Item
                          name="itemCode"
                          label="Item Code"
                          rules={[
                            { required: true, message: 'Item Code required' },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 4 }}
                      >
                        <Form.Item
                          name="itemName"
                          label="Item Name"
                          rules={[
                            {
                              required: true,
                              message: 'Item Name is required',
                            },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 6 }}
                      >
                        <Form.Item
                          name="description"
                          label="Description"
                          rules={[
                            { required: false, message: 'M3 Code is required' },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 2 }}
                      >
                        <Form.Item
                          name="uom"
                          label="UOM"
                          rules={[
                            { required: true, message: 'UOM is required' },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 2 }}
                      >
                        <Form.Item
                          name="qty"
                          label="Qty"
                          rules={[{ required: true, message: 'Qty required' }]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 2 }}
                      >
                        <Form.Item
                          name="rate"
                          label="Rate"
                          rules={[
                            { required: true, message: 'Rate is required' },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 3 }}
                      >
                        <Form.Item
                          name="amount"
                          label="Amount"
                          rules={[
                            { required: true, message: 'Amount is required' },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 3 }}
                      >
                        <Form.Item
                          name="returnQty"
                          label="Returning Qty"
                          rules={[
                            { required: true, message: 'Amount is required' },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 3 }}
                      >
                        <Form.Item name="returnRemarks" label="Return Remarks">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        lg={{ span: 4 }}
                        xl={{ span: 3 }}
                      >
                        <Form.Item name="writeOffQty" label="Write Off Qty">
                          <Input />
                        </Form.Item>
                      </Col>
                    </>
                  </Row>
                </Form>
              </Card>
            ))}
          </>
          <Row style={{ paddingTop: '30px' }} justify={'end'}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 4 }}
              lg={{ span: 4 }}
              xl={{ span: 2 }}
            >
              <Button type="primary" onClick={onSubmit}>
                Submit
              </Button>
            </Col>
          </Row>
        </Card>
      </Drawer>
      <Drawer
        title="Apply Filters"
        placement="right"
        onClose={() => setDrawerFilterVisible(false)}
        open={drawerFilterVisible}
        width={350}
      >
        <Form form={form} layout="vertical" onFinish={applyFilters}>
          <Form.Item name="dcType" label="DC Type">
            <Select
              placeholder="Select Order Type"
              onChange={(value) => handleFilterChange('dcType', value)}
              allowClear
            >
              <Option value="returnable">Returnable</Option>
              <Option value="nonReturnable">Non-Returnable</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status">
          <Select
                  showSearch
                  placeholder="Select Status"
                  allowClear
                  onChange={(value) => handleFilterChange('status', value)}
                >
                  {Object.keys(StatusEnum)?.map((type) => {
                    return (
                      <Option value={StatusEnum[type]}>
                        {StatusEnum[type]}
                      </Option>
                    );
                  })}
                </Select>
          </Form.Item>

          <Row justify="space-between">
            <Button onClick={resetFilters}>Reset</Button>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Row>
        </Form>
      </Drawer>
    </Card>
  );
};

export default DCGrid;
