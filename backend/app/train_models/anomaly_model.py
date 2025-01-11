import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

def train_anomaly_model(csv_path="../../data/dataset.csv", model_path="../../data/trained_models/anomaly_model.pkl"):
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    # Load dataset
    data = pd.read_csv(csv_path)
    
    # Train Isolation Forest
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(data[['Length']])
    
    # Save the trained model
    joblib.dump(model, model_path)
    print(f"Anomaly model saved at {model_path}")

if __name__ == "__main__":
    train_anomaly_model()
