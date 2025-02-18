from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId


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

def insertDataset(dataset):
    try:
        db = get_database()  
        collection = db["files"] 
        result = collection.insert_one(dataset)
        print(f"Dataset insertado con éxito. ID: {result.inserted_id}")
        return result.inserted_id
    except Exception as e:
        print(f"Error al insertar el dataset: {e}")
        raise e
    
def getDatasetById(dataset_id):
    try:
        db = get_database()  # Obtener la base de datos
        collection = db["datasets"]  # Seleccionar la colección 'datasets'
        
        # Buscar el dataset por su ID
        result = collection.find_one({"_id": ObjectId(dataset_id)})
        
        if result:
            print(f"Dataset encontrado: {result}")
            return result
        else:
            print("No se encontró ningún dataset con ese ID.")
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


def get_file_data_by_id(file_id):

    db = get_database()
    collection = db["files"]
    data = collection.find_one({"_id": ObjectId(file_id)})

    if data:
        return list(data.get('data'))
    else:
        return list()