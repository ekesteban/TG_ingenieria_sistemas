import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const GraphicCharts = ({ dataset, highlightIndex = 0 }) => {
  useEffect(() => {

    const chartDom = document.getElementById('chart');
    const myChart = echarts.init(chartDom);
    
    myChart.clear();

    const highlightStartIndex = highlightIndex;

    // Separar los datos en dos partes: antes y después del índice de cambio
    const dataBefore = dataset.x.slice(0, highlightStartIndex).map((xValue, index) => ({
      value: [xValue, dataset.y[index]],
      itemStyle: { color: 'blue' } // Color antes del cambio
    }));

    const dataAfter = [
      {
        value: [dataset.x[highlightStartIndex - 1], dataset.y[highlightStartIndex - 1]], // Punto de continuidad
        itemStyle: { color: 'blue' }
      },
      ...dataset.x.slice(highlightStartIndex).map((xValue, index) => ({
        value: [xValue, dataset.y[highlightStartIndex + index]],
        itemStyle: { color: 'orange' }
      }))
    ];

    const series = [
      {
        type: 'line',
        name: "Venta real",
        data: dataBefore,
        showSymbol: false,
        lineStyle: { width: 2, color: 'blue' }
      },
      {
        type: 'line',
        name: "Venta predicción",
        data: dataAfter,
        showSymbol: false,
        lineStyle: { width: 2, color: 'orange' }
      }
    ];

    const option = {
      animationDuration: 1500,
      title: {
        text: dataset.chartName
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        name: dataset.xName || 'X'
      },
      yAxis: {
        name: dataset.yName || 'Y'
      },
      grid: {
        right: 140
      },
      series
    };

    myChart.setOption(option);
  }, [dataset, highlightIndex]);

  return <div id="chart" style={{ width: '120%', height: '580px' }}></div>;
};

export default GraphicCharts;
