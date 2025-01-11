import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train_protocol_model(csv_path="../../data/dataset.csv", model_path="../../data/trained_models/protocol_model.pkl"):
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    # Load dataset
    data = pd.read_csv(csv_path)
    
    # Prepare features and labels
    X = data[['Length']]  # Use Length as a feature (extendable for more features)
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(data['Protocol'])  # Encode Protocol as numeric labels
    
    # Train Decision Tree Classifier
    model = DecisionTreeClassifier(random_state=42)
    model.fit(X, y)
    
    # Save the trained model and label encoder
    joblib.dump((model, label_encoder), model_path)
    print(f"Protocol classification model saved at {model_path}")

if __name__ == "__main__":
    train_protocol_model()
