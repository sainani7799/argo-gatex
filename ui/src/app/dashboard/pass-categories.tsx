import React from 'react';
import { Card, Row, Col } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PassCategoriesAnalytics = () => {

  const categoryOptions = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Pass Distribution by Category'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%'
        }
      }
    },
    series: [{
      name: 'Categories',
      colorByPoint: true,
      data: [{
        name: 'Equipment',
        y: 45
      }, {
        name: 'Materials',
        y: 25
      }, {
        name: 'Documents',
        y: 15
      }, {
        name: 'Others',
        y: 15
      }]
    }]
  };

  return (
    
        <Card title="Pass Categories">
          <HighchartsReact highcharts={Highcharts} options={categoryOptions} />
        </Card>
  );
};

export default PassCategoriesAnalytics;