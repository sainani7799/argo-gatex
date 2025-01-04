import React from 'react';
import { Card, Row, Col } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const ReturnablePassAnalytics = () => {
  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Returnable vs Non-Returnable Passes'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Passes'
      },
      stackLabels: {
        enabled: true
      }
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      name: 'Returnable',
      data: [30, 35, 40, 45, 50, 55],
      color: '#1890ff'
    }, {
      name: 'Non-Returnable',
      data: [20, 25, 30, 35, 40, 45],
      color: '#52c41a'
    }]
  };

  return (
    <Card title="Pass Type Distribution" className="mb-6">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Card>
  );
};

export default ReturnablePassAnalytics;