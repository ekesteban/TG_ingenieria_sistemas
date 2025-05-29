import Charts from './components/Charts';
import { useState, useEffect } from 'react';
import CallApi from "../api_services/CallApi";

const Dashboard = () => {
    const [chartData, setChartData] = useState({
        x: [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
        y: [null, null, null, null, 9400, 11000, 12500, 14000],
        xName: 'Dias',
        yName: 'Ventas',
        chartName: 'Ventas actuales'
    });

    const [highlightIndex, setHighlightIndex] = useState(30);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            CallApi.GetInfoDatasets(userId).then(data => {
                if (data) setSummary(data);
            });
        }
    }, []);

    return (
        <div className="flex justify-center">
            {summary && (
                <div className="mt-[100px] p-8 border rounded-xl shadow-2xl bg-white w-full max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-4 text-blue-700">Resumen de Entrenamientos</h2>
                    <ul className="text-lg text-gray-700 space-y-2">
                        <li><strong>Total Datasets:</strong> {summary.total_datasets}</li>
                        <li><strong>Total ARIMA:</strong> {summary.total_arima}</li>
                        <li><strong>Total SVM:</strong> {summary.total_svm}</li>
                        <li><strong>Total LSTM:</strong> {summary.total_lstm}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
