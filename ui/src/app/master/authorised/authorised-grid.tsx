import { Button, Card, Input, Space } from "antd";
import { SearchOutlined , EditOutlined , DeleteOutlined } from '@ant-design/icons';
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd/lib";
import { Link } from "react-router-dom";


export default function ApproverGrid(){

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);


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
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
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
           render: (text:any) => (searchedColumn === dataIndex ? <div>{text}</div> : text),
    
      });
    
    const handleSearch = (confirm:any , dataIndex:string) => {
    confirm();
    setSearchText(dataIndex);
    }

    const handleReset  = (clearFilters:any) => {
    clearFilters();
    setSearchText('');
    }

    const handleEdit = (record: any) => {
        setSelectedRecord(record);
      };
    
      const handleDelete = (record: any) => {
        setSelectedRecord(record);
      };

    const columns : ColumnsType<any> = [
        {
            title: 'S.No',
            render: (_, record, index) => index + 1,
        },
        {
            title:'Approver Name',
            dataIndex:'approver_name',
        ...getColumnSearchProps('approver_name', 'Approver Name'),
        },
        {
            title:'Email ID',
            dataIndex:'email_id',
        ...getColumnSearchProps('email_id', 'Email ID'),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (_, record) => (
              <Space>
                <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                  {/* Edit */}
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
                  {/* Delete */}
                </Button>
              </Space>
            ),
          },
    ];

    return (
        <>
        <Card
        title={'Approvers'}
        headStyle={{ backgroundColor: '#7d33a2', border: 0,color:'#fff' }}
        extra={
                <Link to="/approval-user-from">
                <Button>Create </Button>
                </Link>
                }
        >        
            <Table
              rowKey={(record) => record.key}
              columns={columns}
            //   dataSource={data}       
            //  locale={{ emptyText: 'No Data' }}     
            ></Table>
          </Card>
        </>
      );
}