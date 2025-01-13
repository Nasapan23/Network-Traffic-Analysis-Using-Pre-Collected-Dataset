from bson import ObjectId
import pandas as pd
from pymongo.collection import Collection
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
from typing import Dict

def serialize_object_id(doc: Dict) -> Dict:
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def predict_protocols(
    collection: Collection,
    model_path="data/trained_models/protocol_model.pkl",
    page: int = 1,
    limit: int = 50
) -> Dict:
    # Load the trained model and label encoder
    model, label_encoder = joblib.load(model_path)

    # Fetch data from MongoDB
    data = list(collection.find())
    df = pd.DataFrame(data)

    if "Length" not in df or "Protocol" not in df:
        raise ValueError("Required fields ('Length', 'Protocol') are missing from the logs collection.")

    # Prepare data for prediction
    X = df[['Length']]
    predictions = model.predict(X)
    predicted_protocols = label_encoder.inverse_transform(predictions)

    # Add predictions and mismatches to the DataFrame
    df['Predicted_Protocol'] = predicted_protocols
    df['Mismatch'] = df['Protocol'] != df['Predicted_Protocol']

    # Calculate summary statistics
    total_logs = len(df)
    mismatches = df['Mismatch'].sum()
    match_percentage = ((total_logs - mismatches) / total_logs) * 100

    # Pagination logic
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_data = df.iloc[start_idx:end_idx].to_dict(orient='records')

    # Serialize ObjectIds
    paginated_data = [serialize_object_id(doc) for doc in paginated_data]

    return {
        "total_logs": total_logs,
        "match_percentage": match_percentage,
        "mismatch_count": int(mismatches),
        "logs": paginated_data,
        "page": page,
        "limit": limit
    }
