import { useState } from "react";

const AdvancedOptions = ({ model, onCustomTrain}) => {

    const [isChecked, setIsChecked] = useState(false);
    
    const onHandleButton = (config) => {
        onCustomTrain(config)
    }

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
                    {model === "lstm" && <LstmOption onHandleButton={onHandleButton}/>}
                    {model === "svm" && <SvmOption onHandleButton={onHandleButton}/>}
                    {model === "sarima" && <SarimaConfig onHandleButton={onHandleButton}/>}
                </div>
            )}
        </div>
    )

}

const SelectDays = ({ setDays }) => {
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
                setDays(numericValue); // set days
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

const SvmOption = ({ onHandleButton }) => {
    const [autoGrid, setAutoGrid] = useState(true);
    const [c, setC] = useState([0.1, 1, 10, 100, 1000]);
    const [gamma, setGamma] = useState([0.01, 0.1, 1, 10]);
    const [epsilon, setEpsilon] = useState([0.1, 1, 5, 10]);

    const [auxC, setAuxC] = useState([]);
    const [auxGamma, setAuxGamma] = useState([]);
    const [Auxepsilon, setAuxEpsilon] = useState([]);

    const [days, setDays] = useState(30);

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
            setAuxC([c[0], c[1], c[2], c[3], c[4]]);
            setAuxGamma([gamma[0], gamma[1], gamma[2], gamma[3]]);
            setAuxEpsilon([epsilon[0], epsilon[1], epsilon[2], epsilon[3]]);

            setC(auxC)
            setGamma(auxGamma)
            setEpsilon(Auxepsilon)
        }
    };

    const handleSaveConfig = () => {
        const svmConfig = {
          isEnable: true,
          paramGrid: {
            C:  c,
            gamma: gamma,
            epsilon: epsilon,
            },
            daysToPredict: days,
          
        };
        onHandleButton(svmConfig);
      };

    return (
        <div className="flex flex-col">
            <SelectDays setDays={setDays}/>

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
                                        min="0.001"
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
                                        min="0.001"
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
                                        min="0.001"
                                    />
                                ))}
                            </div>
                        </div>
                </div>
            </div>

            <button 
                className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-blue-6  00 transition-all"
                onClick={handleSaveConfig}
                >
                Entrenar
            </button>
        </div>
    );
};

const LstmOption = ({ onHandleButton }) => {
    const [days, setDays] = useState(30);
    const [timeStep, setTimeStep] = useState(10);
    const [lstmUnits, setLstmUnits] = useState(100);
    const [dropoutRate, setDropoutRate] = useState(0.2);
    const [epochs, setEpochs] = useState(2);
    const [batchSize, setBatchSize] = useState(2);

    const handleSaveConfig = () => {
        const lstmConfig = {
          isEnable: true,
          daysToPredict: days,
          timeStep: timeStep,
          lstmUnits: lstmUnits ,
          dropoutRate : dropoutRate,
          epochs: epochs ,
          batchSize: batchSize
          
        };
        onHandleButton(lstmConfig);
      };

    return (
        <div className="flex flex-col">
            <SelectDays setDays={setDays} />

            <div className="flex flex-col mt-5">
                <div className="flex flex-row">
                <div>

                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">
                        Time Step
                        <input
                            type="number"
                            value={timeStep}
                            onChange={(e) => setTimeStep(Number(e.target.value))}
                            className="w-50 p-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"

                        />
                    </label>
                    
                    <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">
                        LSTM Units
                        <input
                            type="number"
                            value={lstmUnits}
                            onChange={(e) => setLstmUnits(Number(e.target.value))}
                            className="w-50 p-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </label>
                    
                    <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">
                        Dropout Rate
                        <input
                            type="number"
                            step="0.01"
                            value={dropoutRate}
                            onChange={(e) => setDropoutRate(Number(e.target.value))}
                            className="w-50 p-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </label>
                    
                </div>

                <div className="ml-5">
                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">
                        Epoch
                        <input
                            type="number"
                            value={epochs}
                            onChange={(e) => setEpochs(Number(e.target.value))}
                            className="w-50 p-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </label>
                    
                    <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">
                        Batch Size
                        <input
                            type="number"
                            value={batchSize}
                            onChange={(e) => setBatchSize(Number(e.target.value))}
                            className="w-50 p-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </label>
                </div>
                </div>

                    <button 
                    className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-blue-6  00 transition-all"
                    onClick={handleSaveConfig}
                        >
                        Entrenar
                    </button>
            </div>

        </div>
    );
};


const SarimaConfig = ({ onHandleButton }) => {
    const MIN_VALUE = 0;
    const MAX_VALUE = 7;
    const S_MIN_VALUE = 0;
    const S_MAX_VALUE = 31;

    const [p, setP] = useState(1);
    const [d, setD] = useState(1);
    const [q, setQ] = useState(1);
    const [P, setUpperP] = useState(1);
    const [D, setUpperD] = useState(1);
    const [Q, setUpperQ] = useState(0);
    const [s, setS] = useState(7);
    const [days, setDays] = useState(30);

    const handleChange = (setState, value) => {
        const newValue = parseInt(value, 10);
        if (!isNaN(newValue) && newValue >= MIN_VALUE && newValue <= MAX_VALUE) {
            setState(newValue);
        }
    };

    const handleSaveConfig = () => {
        const arimaConfig = {
            isEnable: true,
            paramGrid: {
                p, d, q, P, D, Q, s
            },
            daysToPredict: days,
        };
        onHandleButton(arimaConfig);
    };

    return (
        <div className="flex flex-col">
            <SelectDays setDays={setDays} />

            <div className="mt-6">
                <div className="flex flex-col mt-2">
                    <div className="flex flex-row space-x-4">
                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">p
                            <input
                                type="number"
                                value={p}
                                onChange={(e) => handleChange(setP, e.target.value)}
                                className="border rounded px-2 py-1 w-20"
                                min={MIN_VALUE}
                                max={MAX_VALUE}
                            />
                        </label>

                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">d
                            <input
                                type="number"
                                value={d}
                                onChange={(e) => handleChange(setD, e.target.value)}
                                className="border rounded px-2 py-1 w-20"
                                min={MIN_VALUE}
                                max={MAX_VALUE}
                            />
                        </label>

                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">q
                            <input
                                type="number"
                                value={q}
                                onChange={(e) => handleChange(setQ, e.target.value)}
                                className="border rounded px-2 py-1 w-20"
                                min={MIN_VALUE}
                                max={MAX_VALUE}
                            />
                        </label>

                    </div>
                    <div className="flex flex-row space-x-4">
                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">P
                            <input
                                type="number"
                                value={P}
                                onChange={(e) => handleChange(setUpperP, e.target.value)}
                                className="border rounded px-2 py-1 w-20"
                                min={MIN_VALUE}
                                max={MAX_VALUE}
                            />
                        </label>

                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">D
                            <input
                                type="number"
                                value={D}
                                onChange={(e) => handleChange(setUpperD, e.target.value)}
                                className="border rounded px-2 py-1 w-20"
                                min={MIN_VALUE}
                                max={MAX_VALUE}
                            />
                        </label>

                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">Q
                            <input
                                type="number"
                                value={Q}
                                onChange={(e) => handleChange(setUpperQ, e.target.value)}
                                className="border rounded px-2 py-1 w-20"
                                min={MIN_VALUE}
                                max={MAX_VALUE}
                            />
                        </label>

                    </div>
                    <div className="flex flex-row">
                        <label className="flex gap-1 flex-col mb-2 font-medium text-gray-700">s
                        <input
                            type="number"
                            value={s}
                            onChange={(e) => handleChange(setS, e.target.value)}
                            className="border rounded px-2 py-1 w-20"
                            min={S_MIN_VALUE}
                            max={S_MAX_VALUE}
                        />
                        </label>

                    </div>
                    
                </div>
            </div>

            <button 
                className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-blue-600 transition-all"
                onClick={handleSaveConfig}
            >
                Entrenar
            </button>
        </div>
    );
};




export default AdvancedOptions
