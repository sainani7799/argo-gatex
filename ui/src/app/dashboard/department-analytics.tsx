import React from 'react';
import { Card, Table, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DepartmentMetrics {
  department: string;
  totalPasses: number;
  activeRate: number;
  returnRate: number;
  complianceScore: number;
}

const DepartmentAnalytics  = () => {
  const data: DepartmentMetrics[] = [
    {
      department: 'IT Department',
      totalPasses: 150,
      activeRate: 85,
      returnRate: 95,
      complianceScore: 98,
    },
    {
      department: 'HR Department',
      totalPasses: 120,
      activeRate: 78,
      returnRate: 92,
      complianceScore: 95,
    },
    {
      department: 'Finance',
      totalPasses: 90,
      activeRate: 82,
      returnRate: 88,
      complianceScore: 94,
    },
  ];

  const columns: ColumnsType<DepartmentMetrics> = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Total Passes',
      dataIndex: 'totalPasses',
      key: 'totalPasses',
      sorter: (a, b) => a.totalPasses - b.totalPasses,
    },
    {
      title: 'Active Rate',
      dataIndex: 'activeRate',
      key: 'activeRate',
      render: (rate: number) => (
        <Progress percent={rate} size="small" status="active" />
      ),
    },
    {
      title: 'Return Rate',
      dataIndex: 'returnRate',
      key: 'returnRate',
      render: (rate: number) => (
        <Progress percent={rate} size="small" status="success" />
      ),
    },
    {
      title: 'Compliance Score',
      dataIndex: 'complianceScore',
      key: 'complianceScore',
      render: (score: number) => (
        <Progress
          percent={score}
          size="small"
          status={score >= 95 ? 'success' : 'normal'}
        />
      ),
    },
  ];

  return (
    <Card title="Department Performance Analytics" className="mb-6">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="department"
        pagination={false}
      />
    </Card>
  );
};

export default DepartmentAnalytics;