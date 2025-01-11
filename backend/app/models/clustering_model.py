from bson import ObjectId
import joblib
import pandas as pd
from pymongo.collection import Collection
from typing import Dict, List

def serialize_object_id(doc: Dict) -> Dict:
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def cluster_overview(collection: Collection, model_path="data/trained_models/clustering_model.pkl") -> Dict:
    model = joblib.load(model_path)
    data = list(collection.find())
    df = pd.DataFrame(data)
    if "Length" not in df:
        raise ValueError("The 'Length' field is missing from the logs collection.")
    df['cluster'] = model.predict(df[['Length']])
    cluster_summary = df.groupby('cluster').agg(
        size=('cluster', 'size'),
        avg_length=('Length', 'mean'),
        min_length=('Length', 'min'),
        max_length=('Length', 'max')
    ).reset_index()
    return {
        "total_logs": len(df),
        "total_clusters": len(cluster_summary),
        "clusters": cluster_summary.to_dict(orient='records')
    }

def predict_clusters(
    collection: Collection, 
    cluster_id: int, 
    page: int = 1, 
    limit: int = 50, 
    model_path="data/trained_models/clustering_model.pkl"
) -> Dict:
    model = joblib.load(model_path)
    data = list(collection.find())
    df = pd.DataFrame(data)
    if "Length" not in df:
        raise ValueError("The 'Length' field is missing from the logs collection.")
    df['cluster'] = model.predict(df[['Length']])
    cluster_data = df[df['cluster'] == cluster_id]
    total_logs = len(cluster_data)
    cluster_stats = cluster_data['Length'].agg(['mean', 'min', 'max']).to_dict()
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_data = cluster_data.iloc[start_idx:end_idx].to_dict(orient='records')
    paginated_data = [serialize_object_id(doc) for doc in paginated_data]
    return {
        "total_logs": total_logs,
        "page": page,
        "limit": limit,
        "stats": {
            "avg_length": cluster_stats['mean'],
            "min_length": cluster_stats['min'],
            "max_length": cluster_stats['max']
        },
        "logs": paginated_data
    }
