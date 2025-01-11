import pandas as pd
from collections import Counter
import joblib
import os

def train_hotspot_model(csv_path="../../data/dataset.csv", model_path="../../data/trained_models/hotspot_model.pkl"):
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    # Load dataset
    data = pd.read_csv(csv_path)
    
    # Count destination frequencies
    destination_counts = Counter(data['Destination'])
    
    # Save the destination counts
    joblib.dump(destination_counts, model_path)
    print(f"Hotspot model saved at {model_path}")

if __name__ == "__main__":
    train_hotspot_model()
