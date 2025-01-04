import React from 'react';
import { Table, Tag, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';


const RecentPasses  = () => {
  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Requestor',
      dataIndex: 'requestorName',
      key: 'requestorName',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Item Description',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: 'gold',
          approved: 'green',
          rejected: 'red',
          returned: 'blue',
        };
        return (
          <Tag color={colors[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Return Date',
      dataIndex: 'expectedReturnDate',
      key: 'expectedReturnDate',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
  ];

  return (
    <Card title="Recent Gate Passes" className="mb-6">
      <Table
        columns={columns}
        dataSource={[]}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default RecentPasses;