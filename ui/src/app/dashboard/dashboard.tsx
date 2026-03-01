import { CheckCircleOutlined, ClockCircleOutlined, FileProtectOutlined, FileTextOutlined, SwapOutlined, WarningOutlined } from "@ant-design/icons";
import { Card, Col, Divider, Progress, Row, Space, Statistic, Tabs } from "antd";
import ReturnablePassAnalytics from "./pass-type-distribution";
import PassCategoriesAnalytics from "./pass-categories";
import { Content } from "antd/es/layout/layout";
import StatCard from "./statCard";
import NotificationList from "./notification";
import DepartmentWiseStats from "./department-wise";
import TabPane from "antd/es/tabs/TabPane";
import { useState } from "react";
import moment from "moment";
import DepartmentAnalytics from "./department-analytics";
import RecentPasses from "./recent-passes";

const mockData = {
    notifications: [
      {
        id: '1',
        message: 'Indent #123 is overdue by 2 days',
        type: 'overdue',
        timestamp: '2024-02-20',
      },
      {
        id: '2',
        message: 'New high-priority transfer request from IT',
        type: 'warning',
        timestamp: '2024-02-20',
      },
    ],

  };

  


const Dashboard = () => {
    const [selectedFilter, setSelectedFilter] = useState('Today');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleDateFilter = (filter: string) => {
        setSelectedFilter(filter);
        const today = moment();
        let from = today;
        let to = today;
    
        if (filter === 'Today') {
          from = today;
          to = today;
        } else if (filter === 'Week') {
          from = today.clone().startOf('week');
          to = today.clone().endOf('week');
        } else if (filter === 'Month') {
          from = today.clone().startOf('month');
          to = today.clone().endOf('month');
        } else if (filter === 'Year') {
          from = today.clone().startOf('year');
          to = today.clone().endOf('year');
        } else if (filter === 'Custom') {
          return; // Custom filter will be handled via DatePicker
        }
    
        setFromDate(from.format('YYYY-MM-DD'));
        setToDate(to.format('YYYY-MM-DD'));
      };
    
    
    return (
        <>
        <div>
          <Tabs
        activeKey={selectedFilter}
        onChange={(key) => handleDateFilter(key)}
        className="filter-tabs"
        tabBarStyle={{ backgroundColor: '#f0f2f5', padding: '10px', borderRadius: '8px' }} // Add background and padding
      >
        <TabPane
          tab={
            <span style={{ backgroundColor: selectedFilter === 'Today' ? '#047595' : '#f0f2f5', padding: '8px', borderRadius: '5px', color: selectedFilter === 'Today' ? '#fff' : '#000' }}>
              Today
            </span>
          }
          key="Today"
        />
        <TabPane
          tab={
            <span style={{ backgroundColor: selectedFilter === 'Week' ? '#047595' : '#f0f2f5', padding: '8px', borderRadius: '5px', color: selectedFilter === 'Week' ? '#fff' : '#000' }}>
              Week
            </span>
          }
          key="Week"
        />
        <TabPane
          tab={
            <span style={{ backgroundColor: selectedFilter === 'Month' ? '#047595' : '#f0f2f5', padding: '8px', borderRadius: '5px', color: selectedFilter === 'Month' ? '#fff' : '#000' }}>
              Month
            </span>
          }
          key="Month"
        />
        <TabPane
          tab={
            <span style={{ backgroundColor: selectedFilter === 'Year' ? '#047595' : '#f0f2f5', padding: '8px', borderRadius: '5px', color: selectedFilter === 'Year' ? '#fff' : '#000' }}>
              Year
            </span>
          }
          key="Year"
        />
      </Tabs>
          </div>
         <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Total Indents"
                value={120}
                icon={FileTextOutlined}
                subTitle="Pending: 30 | Approved: 50 | Completed: 40"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="In-Transit Transfers"
                value={15}
                icon={SwapOutlined}
                subTitle="Returnable: 10 | Non-returnable: 5"
                color="#52c41a"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Overdue Returns"
                value={3}
                icon={ClockCircleOutlined}
                subTitle="Avg delay: 7 days"
                color="#f5222d"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Pending Approvals"
                value={5}
                icon={CheckCircleOutlined}
                subTitle="Security: 2 | HOD: 3"
                color="#722ed1"
              />
            </Col>
          </Row>

        </Space>
      </Content>
        <br />
        <Card title="Return Status Overview" className="mb-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Statistic
            title="On-Time Returns"
            value={85}
            suffix="%"
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <Progress percent={85} status="success" size="small" />
        </Col>
        <Col xs={24} md={8}>
          <Statistic
            title="Delayed Returns"
            value={12}
            suffix="%"
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
          <Progress percent={12} status="normal" size="small" />
        </Col>
        <Col xs={24} md={8}>
          <Statistic
            title="Overdue"
            value={3}
            suffix="%"
            prefix={<WarningOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
          <Progress percent={3} status="exception" size="small" />
        </Col>
      </Row>
    </Card>
    <br />
    <Row gutter={[16,16]}>
            <Col xs={24} md={16}>
            <DepartmentWiseStats/>
            </Col>
            <Col xs={24} md={8}>
            <NotificationList notifications={[]}/>
            </Col>

        </Row>
        <br />
    <Row gutter={[16, 16]}>
    <Col xs={24} lg={12}>
        <ReturnablePassAnalytics/>
    </Col>
    <Col xs={24} lg={12}>
        <PassCategoriesAnalytics/>
    </Col>
    </Row>
    <br />
    <Row gutter={[16, 16]}>
    <Col xs={24} lg={12}>
     <DepartmentAnalytics />
    </Col>
    <Col xs={24} lg={12}>
    <RecentPasses />
    </Col>
    </Row>
        </>
      );
}

export default Dashboard;