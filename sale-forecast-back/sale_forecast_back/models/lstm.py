import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error

def get_lstm(data, config):
    # === HIPERPARÁMETROS POR DEFECTO ===
    time_step = 10
    lstm_units = 100
    dropout_rate = 0.2
    epochs = 200
    batch_size = 2
    learning_rate = 0.001
    future_days = 90

    if config.get('isEnable', False):
        time_step = config.get("timeStep", time_step)
        lstm_units = config.get("lstmUnits", lstm_units)
        dropout_rate = config.get("dropoutRate", dropout_rate)
        epochs = config.get("epochs", epochs)
        batch_size = config.get("batchSize", batch_size)
        future_days = config.get("daysToPredict", future_days)
        learning_rate = config.get("learningRate", learning_rate)

    # === PREPARAR DATA ===
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    df.set_index("date", inplace=True)
    df.sort_index(inplace=True)

    # === ESCALAR DATOS ===
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)

    # === CREAR SECUENCIAS ===
    def create_sequences(data, time_step):
        X, y = [], []
        for i in range(len(data) - time_step):
            X.append(data[i:i + time_step, 0])
            y.append(data[i + time_step, 0])
        return np.array(X), np.array(y)

    X, y = create_sequences(scaled_data, time_step)
    X = X.reshape(X.shape[0], X.shape[1], 1)

    # === DIVIDIR EN TRAIN Y TEST ===
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    # === MODELO LSTM ===
    model = Sequential([
        LSTM(units=lstm_units, return_sequences=True, input_shape=(time_step, 1)),
        Dropout(dropout_rate),
        LSTM(units=lstm_units),
        Dropout(dropout_rate),
        Dense(units=1)
    ])

    model.compile(optimizer=Adam(learning_rate=learning_rate), loss='mean_squared_error')
    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, verbose=0)

    # === PREDICCIONES TEST ===
    y_pred_scaled = model.predict(X_test, verbose=0)
    y_pred = scaler.inverse_transform(y_pred_scaled)
    y_true = scaler.inverse_transform(y_test.reshape(-1, 1))

    # === MÉTRICAS ===
    def mean_absolute_percentage_error(y_true, y_pred):
        return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

    mse = mean_squared_error(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)
    mape = mean_absolute_percentage_error(y_true, y_pred)

    # === PREDICCIÓN FUTURA ===
    def predict_future(model, data, time_step, future_days):
        last_sequence = data[-time_step:].reshape(1, time_step, 1)
        future_preds = []
        for _ in range(future_days):
            pred = model.predict(last_sequence, verbose=0)[0, 0]
            future_preds.append(pred)
            last_sequence = np.append(last_sequence[:, 1:, :], [[[pred]]], axis=1)
        return np.array(future_preds).reshape(-1, 1)

    future_scaled_preds = predict_future(model, scaled_data, time_step, future_days)
    future_preds_inversed = scaler.inverse_transform(future_scaled_preds).flatten().astype(int)

    # === FECHAS FUTURAS ===
    last_date = df.index[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=future_days)

    return {
        "quantity": future_preds_inversed.tolist(),
        "date": future_dates.strftime("%Y-%m-%d").tolist(),
        "metrics": {
            "mse": float(round(mse, 3)),
            "mae": float(round(mae, 3)),
            "mape": float(round(mape, 3))
        }
    }
