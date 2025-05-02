import { useState } from 'react';
import SelectFile from './modal/SelectFile';
import Charts from './components/Charts'
import CallApi from '../api_services/CallApi';
import AdvancedOptions from './components/AdvancedOption';
import DropDownList from './components/DropDownList';
import TableComponent from './components/Table';
import { CiViewTable } from "react-icons/ci";
import { GoGraph } from "react-icons/go";

let acutal_dataset = {
    _id: null,
    user_id: "67a823cbf1c993640006cf59",
    name: "ventas mayo",
    created_at: "2020-01-01",
    file_name: "ventas_mayo.xls",
    description: "archivo ventas",
    file_id: "67ac11b8fc1dd03b8fec4cf6",
    svm: [],
    lstm: [],
    sarima: []
};


const Results = () => {
    const [selectedDataset] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [config] = useState({isEnable: false})

    const [showChart, setShowChart] = useState(true);

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

    const [actualModel, setActualModel] = useState('svm');

    const [modelTrainsList, setModelTrainsList] = useState([])

    const [selectedIndex, setSelectedIndex] = useState(0); // default list value

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const onCustomTrain = (config) => {

        trainModel(null, null, config)

    }

    const handleDatasetSelect = (dataset) => {
        acutal_dataset = dataset
        setShowModal(false);
        console.debug(acutal_dataset[actualModel])

        trainModel()
    };

    // train model auxactualmodel: el modelo actual, customTrainingId
    const trainModel = (auxActualModel=null, customTrainingId=null, customConfig=null, refresh=null) => {

        let actualModelRequest = auxActualModel != null ? auxActualModel : actualModel;

        customTrainingId = customTrainingId == null ? acutal_dataset[actualModelRequest].length > 0 ? acutal_dataset[actualModelRequest][acutal_dataset[actualModelRequest].length-1]["id"] : null : customTrainingId;

        CallApi.GetCharts(acutal_dataset['file_id'], 
            customTrainingId, 
            actualModelRequest,
            acutal_dataset['_id'],
            customConfig != null ? customConfig : config)
        .then((response) => {
        setChartData(
            {
              x: response['date'],
              y: response['quantity'],
              xName: 'Dias',
              yName: 'Ventas',
              chartName: 'Ventas actuales'
            }
        );
        setHighlightIndex(response['hightlight'])

        refresh == null ? refreshDataset(actualModelRequest) : handleChangeModelTrainsList(actualModelRequest); //refresh Dataset
        });

    }

    // change model
    const handleModelChange = (event) => {
        setActualModel(event.target.value);
        if (acutal_dataset._id != null) {
            trainModel(event.target.value) //do a lot of things
        }
    };

    // refrsh dataset
    const refreshDataset = (actualModelRequest) => {
        CallApi.GetDatasetById(acutal_dataset['_id']).then((data) => {
            console.debug(data);
            acutal_dataset = data; 
            handleChangeModelTrainsList(actualModelRequest, true);
        }); 
    }

    // refresh list dates models
    const handleChangeModelTrainsList = (model, train=null) => {
        setModelTrainsList(acutal_dataset[model].map((obj, index) => 
            obj["date"] ? `${index + 1}. ${obj["date"]}` : `${index + 1}`
        ));
        if (train != null) setSelectedIndex(acutal_dataset[model].length-1);
    }

    // change graph when select a date in models list
    const handleChangeTrainigGraph = (index) => {
        setSelectedIndex(index);
        trainModel(null, acutal_dataset[actualModel][index]["id"], null, true);
    }

    return (
        <div className="flex flex-row tp-10 ml-10">
            <div className='flex flex-col'>
                <div className='flex flex-row items-center justify-center'>
                        {/* Dataset Section */}
                    <div className="p-6 rounded-2xl text-center flex-row">
                        <h2 className="text-xl font-bold mb-4">Dataset</h2>
                        <button 
                            onClick={handleOpenModal} 
                            className="bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-blue-600 transition-all">
                            Seleccionar Dataset
                        </button>
                        {selectedDataset && (
                            <p className="mt-4 text-lg font-semibold">Seleccionado: {selectedDataset}</p>
                        )}
                    </div>

                    {/* Modelo Section */}
                    <div className="p-6 rounded-2xl text-center">
                        <h2 className="text-xl font-bold mb-4">Modelo</h2>
                        <select 
                            className="p-3 border border-gray-300 rounded-1xl shadow-lg text-lg"
                            value={actualModel}
                            onChange={handleModelChange}>
                            <option value="svm">SVM</option>
                            <option value="lstm">LSTM</option>
                            <option value="sarima">SARIMA</option>
                        </select>
                    </div>

                    <div>
                        <DropDownList dates={modelTrainsList} handleChangeTrainigGraph={handleChangeTrainigGraph} selectedIndex={selectedIndex}/>
                    </div>
                </div>

                <AdvancedOptions model={actualModel} onCustomTrain={onCustomTrain}/>
            </div>
            


            <div className="w-200">
                <div className="flex gap-4 ml-10 mt-1">
                    <button
                    className={`p-2 rounded-lg transition ${
                showChart ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setShowChart(true)}
                    >
                    <GoGraph size={20} />
                    </button>
                    <button
                    className={`p-2 rounded-lg transition ${
                !showChart ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setShowChart(false)}
                    >
                    <CiViewTable size={20} />
                    </button>
                    <div className='w-150'>
                        <p className="text-lg font-semibold text-gray-700 space-x-4">
                        <span title="Error cuadrático medio. Penaliza más los errores grandes.">
                            MSE: {acutal_dataset[actualModel][selectedIndex]?.metrics?.mse ?? 'N/A'},
                        </span>
                        <span title="Error absoluto medio. Promedia las diferencias absolutas.">
                            MAE: {acutal_dataset[actualModel][selectedIndex]?.metrics?.mae ?? 'N/A'},
                        </span>
                        <span title="Error porcentual absoluto medio. Indica el error promedio en porcentaje.">
                            MAPE: {acutal_dataset[actualModel][selectedIndex]?.metrics?.mape ?? 'N/A'}
                        </span>
                        </p>
                    </div>
                </div>

                <div className="w-full p-4">
                    {showChart ? (
                    <Charts dataset={chartData} highlightIndex={highlightIndex} />
                    ) : (
                    <TableComponent
                        data={{
                        x: chartData.x != null ? chartData.x : [],
                        y: chartData.y != null ? chartData.y : []
                        }}
                        highlightIndex={highlightIndex}
                    />
                    )}
                </div>
                </div>
            

            {/* Modal Render */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center">
                    <div className="p-6 rounded-lg w-full max-w-6xl mt-20">
                        <SelectFile onClose={handleCloseModal} onSelect={handleDatasetSelect}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
