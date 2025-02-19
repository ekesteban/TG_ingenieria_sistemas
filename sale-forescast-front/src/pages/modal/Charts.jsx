import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const GraphicCharts = ({ datasets }) => {
  useEffect(() => {
    const chartDom = document.getElementById('chart');
    const myChart = echarts.init(chartDom);

    myChart.clear();
    
    const series = datasets.map((data) => ({
      type: 'line',
      showSymbol: false,
      name: data.chartName,
      endLabel: {
        show: true,
        formatter: function (params) {
          return params.value[1] + ': ' + params.value[0];
        }
      },
      labelLayout: {
        moveOverlap: 'shiftY'
      },
      emphasis: {
        focus: 'series'
      },
      encode: {
        x: data.xName,
        y: data.yName,
        label: [data.xName, data.yName],
        itemName: data.xName,
        tooltip: [data.yName]
      },
      data: data.x.map((xValue, index) => [xValue, data.y[index]])
    }));
    
    const option = {
      animationDuration: 1500,
      title: {
        text: datasets.map(d => d.chartName).join(', ')
      },
      tooltip: {
        order: 'valueDesc',
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        name: datasets[0]?.xName || 'X'
      },
      yAxis: {
        name: datasets[0]?.yName || 'Y'
      },
      grid: {
        right: 140
      },
      series
    };
    
    myChart.setOption(option);
  }, [datasets]);
  
  return <div id="chart" style={{ width: '100%', height: '600px' }}></div>;
};

export default GraphicCharts;
