import React from 'react';
import { Card, Typography } from 'antd';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<IconComponentProps>;
  subTitle?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subTitle, color = '#1890ff' }) => {
  return (
    <Card bordered={false} style={{ borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Typography.Text type="secondary">{title}</Typography.Text>
          <Typography.Title level={2} style={{ margin: '8px 0' }}>
            {value}
          </Typography.Title>
          {subTitle && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {subTitle}
            </Typography.Text>
          )}
        </div>
        <Icon style={{ fontSize: 24, color }} />
      </div>
    </Card>
  );
};

export default StatCard;