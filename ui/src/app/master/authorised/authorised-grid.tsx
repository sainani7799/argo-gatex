import { Button, Card, Input, Space } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, UserSwitchOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd/lib";
import { Link } from "react-router-dom";
import { ApprovalUserService } from "@gatex/shared-services";
import React from "react";


export default function ApproverGrid() {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [data, setData] = useState([])
  const Service = new ApprovalUserService();

  useEffect(() => {
    getData()
  }, [])

  function getData() {
    Service.getAllApprovalUser().then((res) => {
      console.log(res)
      if (res) {
        setData(res.data)
      }
    })
  }




  const getColumnSearchProps = (dataIndex: string, columnTitle: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${columnTitle}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <button type="button" onClick={() => handleReset(clearFilters)} style={{ width: 90 }}>
            Reset
          </button>
          <button
            type="button"
            onClick={() => handleSearch(confirm, dataIndex)}
            style={{ width: 90 }}
          >
            Search
          </button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? 'white' : "white" }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex] &&
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setSearchText('');
        setSearchedColumn(dataIndex);
      }
    },
    render: (text: any) => (searchedColumn === dataIndex ? <div>{text}</div> : text),

  });

  const handleSearch = (confirm: any, dataIndex: string) => {
    confirm();
    setSearchText(dataIndex);
  }

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
  }

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
  };

  const handleDelete = (record: any) => {
    setSelectedRecord(record);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'S.No',
      render: (text, object, index) => (page - 1) * pageSize + (index + 1),
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Approver Name',
      dataIndex: 'approvalUser',
      ...getColumnSearchProps('approvalUser', 'Approver Name'),
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Email ID',
      dataIndex: 'emailId',
      ...getColumnSearchProps('emailId', 'Email ID'),
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
    },
    {
      title: 'Buyer Team',
      dataIndex: 'buyerTeam',
      ...getColumnSearchProps('buyerTeam', 'Buyer Id'),
      onHeaderCell: () => ({
        style: { backgroundColor: '#047595', color: 'white' },
      }),
      render: (text) => text ? text : '-'
    },
    // {
    //     title: 'Actions',
    //     dataIndex: 'actions',
    //     render: (_, record) => (
    //       <Space>
    //         <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
    //           {/* Edit */}
    //         </Button>
    //         <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
    //           {/* Delete */}
    //         </Button>
    //       </Space>
    //     ),
    //   },
  ];

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
              <CheckCircleOutlined
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-10px',
                  fontSize: '14px',
                  color: 'green',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  padding: '2px',
                }}
              />
            </div>
            <span style={{ color: '#fff', marginLeft: '8px' }}>Approvers</span>
          </div>
        }
        headStyle={{
          backgroundColor: '#047595',
          border: 0,
          color: '#fff',
        }}
      >
        <Table
          rowKey={(record) => record.key}
          columns={columns}
          dataSource={data}
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (current, size) => {
              setPage(current);
              setPageSize(size);
            },
            showSizeChanger: true,
          }}
        //  locale={{ emptyText: 'No Data' }}     
        ></Table>
      </Card>
    </>
  );
}