from bson import ObjectId
from collections import Counter
import pandas as pd
from pymongo.collection import Collection
from typing import Dict

def serialize_object_id(doc: Dict) -> Dict:
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def hotspots_summary(collection: Collection) -> Dict:
    data = list(collection.find())
    df = pd.DataFrame(data)

    if not all(field in df for field in ["Destination", "Source", "Length", "Protocol"]):
        raise ValueError("Required fields ('Destination', 'Source', 'Length', 'Protocol') are missing from the logs collection.")

    total_logs = int(len(df))
    destination_counts = Counter(df['Destination'])
    source_counts = Counter(df['Source'])
    protocol_counts = Counter(df['Protocol'])

    top_destinations = [{"Destination": dest, "Count": int(count), "Percentage": float((count / total_logs) * 100)}
                        for dest, count in destination_counts.most_common(5)]
    top_sources = [{"Source": src, "Count": int(count), "Percentage": float((count / total_logs) * 100)}
                   for src, count in source_counts.most_common(5)]
    top_protocols = [{"Protocol": proto, "Count": int(count), "Percentage": float((count / total_logs) * 100)}
                     for proto, count in protocol_counts.most_common(5)]

    length_stats = {
        "avg_length": float(df['Length'].mean()),
        "min_length": int(df['Length'].min()),
        "max_length": int(df['Length'].max())
    }

    return {
        "total_logs": total_logs,
        "top_destinations": top_destinations,
        "top_sources": top_sources,
        "top_protocols": top_protocols,
        "length_stats": length_stats
    }
