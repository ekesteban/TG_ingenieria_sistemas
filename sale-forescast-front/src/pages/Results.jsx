import { useState } from 'react';
import SelectFile from './modal/SelectFile';

let acutal_dataset = {
    _id: "67ac155dfb19d4d4dce332eb",
    user_id: "67a823cbf1c993640006cf59",
    name: "ventas mayo",
    created_at: "2020-01-01",
    file_name: "ventas_mayo.xls",
    description: "archivo ventas",
    file_id: "67ac11b8fc1dd03b8fec4cf6",
};

const Results = () => {
    const [selectedDataset] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDatasetSelect = (dataset) => {
        acutal_dataset = dataset
        setShowModal(false);
        console.debug(acutal_dataset)
    };

    return (
        <div className="flex flex-row items-center justify-center tp-10">
            {/* Dataset Section */}
            <div className="p-6 rounded-2xl w-96 text-center flex-row">
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
            <div className="p-6 rounded-2xl w-96 text-center">
                <h2 className="text-xl font-bold mb-4">Modelo</h2>
                <select className="p-3 border border-gray-300 rounded-1xl shadow-lg text-lg">
                    <option value="neuronales">Neuronales</option>
                    <option value="svm">SVM</option>
                    <option value="arima">ARIMA</option>
                </select>
            </div>

            {/* Modal Render */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center">
                    <div className="p-6 rounded-lg w-full max-w-6xl mt-20">
                        <SelectFile onClose={handleCloseModal} onSelect={handleDatasetSelect} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
