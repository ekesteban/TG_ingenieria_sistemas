import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

def get_lstm(data, config):
    
    time_step = 10
    lstm_units = 100
    dropout_rate = 0.2
    epochs = 2
    batch_size = 2
    future_days = 90

    # Extraer datos del request
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    df.set_index("date", inplace=True)
    
    # Escalar los datos
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)
    
    # Crear secuencias para la LSTM
    def create_sequences(data, time_step):
        X, y = [], []
        for i in range(len(data) - time_step):
            X.append(data[i:(i + time_step), 0])
            y.append(data[i + time_step, 0])
        return np.array(X), np.array(y)
    
    X, y = create_sequences(scaled_data, time_step)
    X = X.reshape(X.shape[0], X.shape[1], 1)
    
    # Construcción del modelo LSTM
    model = Sequential([
        LSTM(units=lstm_units, return_sequences=True, input_shape=(time_step, 1)),
        Dropout(dropout_rate),
        LSTM(units=lstm_units, return_sequences=False),
        Dropout(dropout_rate),
        Dense(units=1)
    ])
    
    # Compilación y entrenamiento
    model.compile(optimizer="adam", loss="mean_squared_error")
    model.fit(X, y, epochs=epochs, batch_size=batch_size, verbose=1)
    
    # Predicción futura
    def predict_future(model, data, time_step, future_days):
        last_sequence = data[-time_step:].reshape(1, time_step, 1)
        future_predictions = []
        
        for _ in range(future_days):
            pred = model.predict(last_sequence)[0, 0]
            future_predictions.append(pred)
            last_sequence = np.roll(last_sequence, -1)
            last_sequence[0, -1, 0] = pred
        
        return scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1)).astype(int)
    
    future_predictions = predict_future(model, scaled_data, time_step, future_days)
    
    # Generar fechas futuras
    future_dates = pd.date_range(df.index[-1], periods=future_days + 1)[1:]
    
    return {
        "quantity": future_predictions.flatten().tolist(),
        "date": future_dates.strftime("%Y-%m-%d").tolist()
    }
