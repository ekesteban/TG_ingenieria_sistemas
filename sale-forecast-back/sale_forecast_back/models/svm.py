import numpy as np
import pandas as pd
from sklearn.svm import SVR
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error
from datetime import datetime, timedelta

def get_svm(data, config):
    # === CONFIGURACIÓN POR DEFECTO O PERSONALIZADA ===
    param_grid = {
        'C': [10, 100, 500],
        'gamma': [0.001, 0.01, 0.1],
        'epsilon': [0.01, 0.1, 1]
    }
    days_to_predict = 90

    if config.get("isEnable", False):
        days_to_predict = config.get("daysToPredict", days_to_predict)
        param_grid = config.get("paramGrid", param_grid)

    # === CONVERTIR A DATAFRAME Y LIMPIAR ===
    df = pd.DataFrame(data).dropna()
    q1, q3 = df['quantity'].quantile([0.25, 0.75])
    iqr = q3 - q1
    lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    df = df[(df['quantity'] >= lower) & (df['quantity'] <= upper)]

    # === CONVERTIR FECHAS Y ORDENAR ===
    df['date'] = pd.to_datetime(df['date'])
    df.sort_values("date", inplace=True)
    df.set_index("date", inplace=True)

    # === CREAR FEATURES CON LAG ===
    def create_features(series, lag=7):
        X, y = [], []
        for i in range(lag, len(series)):
            X.append(series[i-lag:i])
            y.append(series[i])
        return np.array(X), np.array(y)

    series = df['quantity'].values
    lag = 7
    X, y = create_features(series, lag)

    # === DIVIDIR DATOS EN TRAIN/TEST ===
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    # === ENTRENAR MODELO CON GRIDSEARCH ===
    grid_search = GridSearchCV(SVR(kernel='rbf'), param_grid, scoring='neg_mean_squared_error', cv=5, n_jobs=-1)
    grid_search.fit(X_train, y_train)
    best_model = grid_search.best_estimator_

    # === EVALUACIÓN ===
    y_pred = best_model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    nonzero_indices = y_test != 0
    if np.any(nonzero_indices):
        mape = np.mean(np.abs((y_test[nonzero_indices] - y_pred[nonzero_indices]) / y_test[nonzero_indices])) * 100
    else:
        mape = float('nan')

    # === PREDICCIÓN A FUTURO ===
 # === PREDICCIÓN A FUTURO CON AJUSTE ===
    future_predictions = []
    last_window = list(series[-lag:])  # Últimos valores para empezar a predecir

    for _ in range(days_to_predict):
        pred = best_model.predict(np.array(last_window).reshape(1, -1))[0]
        
        # === Ajustar predicción ===
        if pred < 0:
            adjusted = 0
        else:
            decimal_part = pred - int(pred)
            adjusted = int(np.floor(pred)) if decimal_part < 0.5 else int(np.ceil(pred))
        
        future_predictions.append(adjusted)
        last_window = last_window[1:] + [pred]

    last_date = df.index[-1]
    future_dates = [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d') for i in range(days_to_predict)]

    print("\nMétricas del Modelo SVR sobre datos de prueba (X_test, y_test):")
    print(f"- MSE  : {mse:.3f}")
    print(f"- MAE  : {mae:.3f}")
    print(f"- MAPE : {mape:.2f}%" if not np.isnan(mape) else "- MAPE : No disponible (valores reales = 0)")

    return {
        "quantity": future_predictions,
        "date": future_dates,
        "metrics": {
            "mse": round(mse, 3),
            "mae": round(mae, 3),
            "mape": f"{round(mape, 2)}%"
        },
        "best_params": grid_search.best_params_
    }
