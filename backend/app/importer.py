import csv
import threading
from pymongo import MongoClient
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

# MongoDB connection details
db_uri = "mongodb+srv://ionutnisipeanu23:hkgKHZB38Tx3smro@cluster0.c4rd5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Connect to MongoDB
client = MongoClient(db_uri)
db = client.get_database("Cluster0")  # Replace "Cluster0" with your database name if needed
collection = db["logs"]

# Path to your CSV file
csv_file_path = "dataset.csv"

# Function to insert a single log entry
def insert_log(log_entry, index):
    try:
        collection.insert_one(log_entry)
        logging.info(f"Successfully inserted log at index {index}: {log_entry}")
    except Exception as e:
        logging.error(f"Failed to insert log at index {index}: {e}")

# Read the CSV file and process logs
try:
    with open(csv_file_path, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        threads = []

        for index, row in enumerate(csv_reader):
            # Prepare the document for insertion
            log_entry = {
                "Time": row["Time"],
                "Source": row["Source"],
                "No.": int(row["No."]),
                "Destination": row["Destination"],
                "Protocol": row["Protocol"],
                "Length": int(row["Length"]),
                "Info": row["Info"]
            }

            # Create and start a thread for each log entry
            thread = threading.Thread(target=insert_log, args=(log_entry, index))
            threads.append(thread)
            thread.start()

        # Wait for all threads to complete
        for thread in threads:
            thread.join()

        logging.info(f"Finished processing all logs from the CSV file.")

except FileNotFoundError:
    logging.error(f"Error: The file '{csv_file_path}' was not found.")
except Exception as e:
    logging.error(f"An error occurred: {e}")

# Close the MongoDB connection
client.close()
