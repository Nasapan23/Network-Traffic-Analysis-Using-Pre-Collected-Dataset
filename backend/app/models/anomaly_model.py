from bson import ObjectId
import joblib
import pandas as pd
from pymongo.collection import Collection
from typing import Dict, List

def serialize_object_id(doc: Dict) -> Dict:
    """
    Converts ObjectId fields in the document to strings.
    """
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def calculate_harshness(anomaly_count: int, total_logs: int) -> str:
    """
    Calculates the harshness level based on the proportion of anomalies.
    """
    if total_logs == 0:
        return "No Data"
    
    proportion = anomaly_count / total_logs
    if proportion > 0.5:
        return "Critical"
    elif proportion > 0.2:
        return "High"
    elif proportion > 0.1:
        return "Moderate"
    else:
        return "Low"

def predict_anomalies(
    collection: Collection,
    page: int = 1,
    limit: int = 10,
    model_path="data/trained_models/anomaly_model.pkl"
) -> Dict:
    """
    Predict anomalies in the data from the MongoDB collection using a pre-trained model.
    Supports pagination.
    Args:
        collection (Collection): The MongoDB collection containing the data.
        page (int): Current page number for pagination.
        limit (int): Number of items per page.
        model_path (str): Path to the pre-trained model.
    Returns:
        Dict: Contains anomalies, total anomalies, total logs, and harshness level.
    """
    # Load the pre-trained model
    model = joblib.load(model_path)

    # Fetch the data from the MongoDB collection
    data = list(collection.find())  # Fetch all documents
    df = pd.DataFrame(data)

    # Ensure necessary fields exist in the data
    if "Length" not in df:
        raise ValueError("The 'Length' field is missing from the logs collection.")

    # Predict anomalies
    df['anomaly'] = model.predict(df[['Length']])  # Model expects a 2D array
    anomalies = df[df['anomaly'] == -1]  # -1 indicates anomalies

    # Calculate metrics
    total_logs = len(df)
    anomaly_count = len(anomalies)
    harshness = calculate_harshness(anomaly_count, total_logs)

    # Pagination logic
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    anomalies_paginated = anomalies.iloc[start_idx:end_idx].to_dict(orient="records")

    # Serialize ObjectIds
    anomalies_paginated = [serialize_object_id(doc) for doc in anomalies_paginated]

    return {
        "total_logs": total_logs,
        "anomaly_count": anomaly_count,
        "harshness": harshness,
        "anomalies": anomalies_paginated,
        "page": page,
        "limit": limit
    }
