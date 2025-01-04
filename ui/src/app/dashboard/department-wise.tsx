import React from 'react';
import { Card } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';



const DepartmentWiseStats = () => {
  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Department-wise Gate Pass Statistics'
    },
    xAxis: {
      categories: ['IT','HR','FINANCE'],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Passes'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: 'Issued',
      data: ['30','45','55'],
      color: '#1890ff'
    }, {
      name: 'Returned',
      data: ['10','25','58'],
      color: '#52c41a'
    }, {
      name: 'Pending',
      data: ['15','30','55'],
      color: '#faad14'
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <Card className="mb-6">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Card>
  );
};

export default DepartmentWiseStats;