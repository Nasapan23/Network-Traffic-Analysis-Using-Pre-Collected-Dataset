from pymongo import MongoClient

def get_db():
    """
    Connect to the MongoDB database and return the database object.
    """
    # Connection string for MongoDB
    db_uri = "mongodb+srv://ionutnisipeanu23:hkgKHZB38Tx3smro@cluster0.c4rd5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    
    # Connect to the MongoDB client
    client = MongoClient(db_uri)
    
    # Database name
    db_name = "Cluster0"  # Use the database name from your setup
    
    return client[db_name]
