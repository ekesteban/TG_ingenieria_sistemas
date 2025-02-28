import { useState } from "react";

const AdvancedOptions = ({ model }) => {

    const [isChecked, setIsChecked] = useState(false);

    return (
        <div>
                    {/* Checkbox para mostrar opciones */}
            <label className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="w-5 h-5"
                />
                Opciones avanzadas
            </label>

            {/* Renderiza solo si el checkbox está activado */}
            {isChecked && (
                <div className="mt-4 p-4 border rounded-lg shadow">
                    {model === "lstm" && <p>Contenido para el modelo lstm</p>}
                    {model === "svm" && <SvmOption/>}
                    {model === "arima" && <p>Contenido para el modelo arima</p>}
                </div>
            )}
        </div>
    )

}

const SelectDays = () => {
    const MIN_DAYS = 1;
    const MAX_DAYS = 90;
    const DEFAULT_DAYS = 30;

    const [text, setText] = useState(DEFAULT_DAYS.toString());

    const handleChange = (e) => {
        const value = e.target.value;
        const numericValue = parseInt(value, 10);

        if (!isNaN(numericValue)) {
            if (numericValue >= MIN_DAYS && numericValue <= MAX_DAYS) {
                setText(numericValue.toString());
            }
        } else if (value === "") {
            setText("");
        }
    };

    return (
        <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Días a predecir</label>
            <input
                type="number"
                value={text}
                onChange={handleChange}
                placeholder="Días"
                min={MIN_DAYS}
                max={MAX_DAYS}
                className="w-50 p-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
        </div>
    );
};

const SvmOption = () => {
    const [autoGrid, setAutoGrid] = useState(true);
    const [c, setC] = useState([1, 1, 1]);
    const [gamma, setGamma] = useState([0.1, 0.1, 0.1]);
    const [epsilon, setEpsilon] = useState([0.5, 0.5, 0.5]);

    const [auxC, setAuxC] = useState([]);
    const [auxGamma, setAuxGamma] = useState([]);
    const [Auxepsilon, setAuxEpsilon] = useState([]);

    const handleChange = (setState, index, value) => {
        const newValue = parseFloat(value);
        if (!isNaN(newValue) && newValue !== 0) {
            setState(prevState => {
                const newState = [...prevState];
                newState[index] = newValue;
                return newState;
            });
        }
    };

    const handleAutoGridChange = () => {
        setAutoGrid(!autoGrid);
        if (autoGrid) {
            setAuxC(c)
            setAuxGamma(gamma)
            setAuxEpsilon(epsilon)

            setC([c[0]]);
            setGamma([gamma[0]]);
            setEpsilon([epsilon[0]]);
        } else {
            setAuxC([c[0], auxC[1], auxC[2]]);
            setAuxGamma([gamma[0], auxGamma[1], auxGamma[2]]);
            setAuxEpsilon([epsilon[0], epsilon[1], epsilon[2]]);

            setC(auxC)
            setGamma(auxGamma)
            setEpsilon(Auxepsilon)
        }
    };

    return (
        <div className="flex flex-col">
            <SelectDays/>

            <div className="mt-6">
                {/* Checkbox para mostrar opciones */}
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={autoGrid}
                        onChange={handleAutoGridChange}
                        className="w-5 h-5"
                    />
                    Activar autogrid
                </label>

                <div className="mt-2">
                <div>
                            <label className="mb-2 font-medium text-gray-700">C</label>
                            <div className="flex gap-2">
                                {c.map((value, index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleChange(setC, index, e.target.value)}
                                        className="border rounded px-2 py-1 w-20"
                                        min="0.0001"
                                    />
                                ))}
                            </div>
                            <label className="mb-2 font-medium text-gray-700">Gamma</label>
                            <div className="flex gap-2">
                                {gamma.map((value, index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleChange(setGamma, index, e.target.value)}
                                        className="border rounded px-2 py-1 w-20"
                                        min="0.0001"
                                    />
                                ))}
                            </div>
                            <label className="mb-2 font-medium text-gray-700">Epsilon</label>
                            <div className="flex gap-2">
                                {epsilon.map((value, index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleChange(setEpsilon, index, e.target.value)}
                                        className="border rounded px-2 py-1 w-20"
                                        min="0.0001"
                                    />
                                ))}
                            </div>
                        </div>
                </div>
            </div>

            <button 
                className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-blue-6  00 transition-all">
                Entrenar
            </button>
        </div>
    );
};


export default AdvancedOptions
