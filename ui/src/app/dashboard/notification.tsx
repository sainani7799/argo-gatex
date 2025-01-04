import React from 'react';
import { List, Badge, Typography } from 'antd';

const { Title } = Typography;


export interface Notification {
    id: string;
    message: string;
    type: 'overdue' | 'security' | 'info' | 'warning';
    timestamp: string;
  }

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  return (
    <List
      header={<Title level={5}>Notifications</Title>}
      bordered
      dataSource={notifications}
      rowKey={(item) => item.id}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Badge
            status={item.type === 'overdue' ? 'error' : 'warning'}
            text={item.message}
          />
        </List.Item>
      )}
    />
  );
};

export default NotificationList;