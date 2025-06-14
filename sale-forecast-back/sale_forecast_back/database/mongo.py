from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
from datetime import datetime

class MongoConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print("Creando una nueva instancia de MongoClient")
            uri = "mongodb+srv://oakEsteban:amatista@clusterproyecto.ptzcgqb.mongodb.net/?retryWrites=true&w=majority&appName=clusterProyecto"
            cls._instance = MongoClient(uri, server_api=ServerApi('1'))
        return cls._instance

def get_database():
    client = MongoConnection() 
    db = client["forecasting"] 
    return db

def insert_file(dataset):
    try:
        db = get_database()  
        collection = db["files"] 
        result = collection.insert_one(dataset)
        return result.inserted_id
    except Exception as e:
        raise e
    
def getDatasetById(dataset_id):
    try:
        db = get_database()  # Obtener la base de datos
        collection = db["datasets"]  # Seleccionar la colección 'datasets'
        
        # Buscar el dataset por su ID
        result = collection.find_one({"_id": ObjectId(dataset_id)})
        
        if result:
            return result
        else:
            return None
    except Exception as e:
        print(f"Error al obtener el dataset: {e}")
        raise e

def getDatasetsByNameDate(filter_query, sort_order):

    db = get_database()
    collection = db["datasets"]

    results = collection.find(filter_query).sort(sort_order)

    response = []
    for item in results:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string
        response.append(item)
    return response

def get_dataset_by_id_query(id):
    db = get_database()
    collection = db["datasets"]
    response = collection.find_one({"_id": ObjectId(id)})
    
    response['_id'] = str(response['_id']) # Convert ObjectId to string

    return response


def get_file_data_by_id(file_id):

    db = get_database()
    collection = db["files"]
    data = collection.find_one({"_id": ObjectId(file_id)})

    if data:
        return data.get('data')
    else:
        return None
    

def insert_dataset(dataset):
    try:
        db = get_database()  
        collection = db["datasets"] 
        result = collection.insert_one(dataset)
        return result.inserted_id
    except Exception as e:
        raise e
    
def get_trained_model(model_type, model_file_id):

    db = get_database()
    collection = db[str(model_type) + "_trains"]
    data = collection.find_one({"_id": ObjectId(model_file_id)})

    if data:
        return data.get('data')
    else:
        return None
    
def save_training_data_in_datasets(model_type, model_file_id, dataset_id, config, metrics):
    db = get_database()  
    collection = db["datasets"] 

    save_trained_data = {
        "id": model_file_id,
        "advanced_config": config,
        "date": datetime.today().strftime('%Y-%m-%d'),
        "metrics": metrics
    }

    collection.update_one(
    {"_id": ObjectId(dataset_id)},
    {"$push": {model_type: save_trained_data}}
)
    
def insert_trained_file(data, model_type):
    try:
        db = get_database()  
        collection = db[model_type + "_trains"] 
        result = collection.insert_one({"data": data})
        return result.inserted_id
    except Exception as e:
        raise e
    
def get_user_by_name(user_name, password):
    db = get_database() 
    collection = db["users"]  
    user = collection.find_one({"user_name": user_name})
    if user == None:
        print("buscar por correo")
        user = collection.find_one({"email": user_name})
    
    if user and password == user["password"]:
        print(f"Login correcto. ID del usuario: {user['_id']}")
        return {
            'id': str(user['_id'])
        }
    else:
        print("Credenciales inválidas.")


def get_info_dashboard(userId):
    db = get_database()
    collection = db["datasets"]

    print("Consultando dashboard para userId:", userId)

    pipeline = [
        {"$match": {"user_id": userId}},
        {
            "$group": {
                "_id": None,
                "total_datasets": {"$sum": 1},
                "total_arima": {"$sum": {"$size": {"$ifNull": ["$arima", []]}}},
                "total_svm": {"$sum": {"$size": {"$ifNull": ["$svm", []]}}},
                "total_lstm": {"$sum": {"$size": {"$ifNull": ["$lstm", []]}}},
            }
        }
    ]

    result = list(collection.aggregate(pipeline))
    print("Resultado:", result)

    return result
