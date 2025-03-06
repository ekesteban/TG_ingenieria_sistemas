import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split, GridSearchCV
from datetime import datetime, timedelta


def get_svm(data, config):

    # Definir los hiperparámetros a evaluar
    param_grid = {
        'C': [0.1, 1, 10, 100, 1000],
        'gamma': [0.01, 0.1, 1, 10],
        'epsilon': [0.1, 1, 5, 10]
    }

    days_to_predict = 90

    if config["isEnable"]:
        days_to_predict = config["daysToPredict"]
        param_grid = config["paramGrid"]

    # Convertir a DataFrame
    df = pd.DataFrame(data)

    # Convertir la fecha en una variable numérica (días desde la primera fecha)
    df['date'] = pd.to_datetime(df['date'])
    df['days_since_start'] = (df['date'] - df['date'].min()).dt.days

    # Variables predictoras y objetivo
    X = df[['days_since_start']].values
    y = df['quantity'].values

    # Dividir en datos de entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Configurar la búsqueda de cuadrícula
    grid_search = GridSearchCV(SVR(kernel='rbf'), param_grid, cv=5, scoring='neg_mean_squared_error', n_jobs=-1)
    grid_search.fit(X_train, y_train)

    # Obtener los mejores hiperparámetros
    best_params = grid_search.best_params_
    best_svr = grid_search.best_estimator_

    # Realizar predicciones con el mejor modelo
    y_pred_best = best_svr.predict(X)

    # Mostrar los mejores parámetros encontrados
    best_params

    future_predictions = []

    for i in range(1, days_to_predict):
        X_future = np.array(i).reshape(-1, 1)
        prediction = best_svr.predict(X_future)[0]
        future_predictions.append(int(round(prediction)))

    start_date = datetime.strptime(data.get("date")[-1], "%Y-%m-%d")
    return {
        "quantity": future_predictions,
        "date": [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, len(future_predictions))]
    }
