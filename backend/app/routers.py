from fastapi import APIRouter, HTTPException, Query
from app.db_connector import get_db
from app.models.anomaly_model import predict_anomalies
from app.models.clustering_model import cluster_overview, predict_clusters

router = APIRouter()

@router.get("/test-anomalies")
async def test_anomalies(
    page: int = Query(1, ge=1),  # Default page is 1, must be >= 1
    limit: int = Query(50, ge=1, le=100)  # Default limit is 50, must be between 1 and 100
):
    """
    Endpoint to test the anomaly detection model on live data from MongoDB.
    Supports pagination and provides metrics on the detected anomalies.
    Args:
        page (int): Page number for pagination.
        limit (int): Number of items per page.
    Returns:
        Dict: Contains anomaly metrics and paginated anomalies.
    """
    try:
        # Connect to the database
        db = get_db()
        collection = db["logs"]  # Access the "logs" collection

        # Run the anomaly detection model
        result = predict_anomalies(collection, page=page, limit=limit)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/clusters/overview")
async def clusters_overview():
    try:
        db = get_db()
        collection = db["logs"]
        return cluster_overview(collection)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/clusters/{cluster_id}")
async def clusters_data(
    cluster_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    try:
        db = get_db()
        collection = db["logs"]
        return predict_clusters(collection, cluster_id, page, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))