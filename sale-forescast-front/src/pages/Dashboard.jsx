import Charts from './components/Charts';
import { useState } from 'react';


const Dashboard = () => {

    const [chartData, setChartData] = useState(
        {
            x: [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
            y: [null, null, null, null, 9400, 11000, 12500, 14000],
            xName: 'Dias',
            yName: 'Ventas',
            chartName: 'Ventas actuales'
        }
        );

    const [highlightIndex, setHighlightIndex] = useState(30);

    return (
        <div>
            <Charts dataset={chartData} highlightIndex={highlightIndex} />
        </div>
    )

}

export default Dashboard


