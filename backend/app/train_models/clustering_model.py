import pandas as pd
from sklearn.cluster import KMeans
import joblib
import os

def train_clustering_model(csv_path="../../data/dataset.csv", model_path="../../data/trained_models/clustering_model.pkl"):
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    # Load dataset
    data = pd.read_csv(csv_path)
    
    # Train KMeans Clustering
    model = KMeans(n_clusters=3, random_state=42)
    model.fit(data[['Length']])
    
    # Save the trained model
    joblib.dump(model, model_path)
    print(f"Clustering model saved at {model_path}")

if __name__ == "__main__":
    train_clustering_model()
