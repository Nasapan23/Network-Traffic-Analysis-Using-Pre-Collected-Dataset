from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
from app.db_connector import get_db
from app.models.anomaly_model import predict_anomalies
from app.models.clustering_model import cluster_overview, predict_clusters
from app.models.hotspot_model import hotspots_summary
from app.models.protocol_model import predict_protocols

# Create FastAPI app
app = FastAPI()

# Add CORS middleware globally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

# Define a custom OPTIONS route handler
@app.options("/{path:path}")
async def preflight_handler(path: str):
    """
    Handle preflight OPTIONS requests.
    """
    return Response(status_code=204)  # No Content for successful preflight response

# Create router
router = APIRouter()

@router.get("/test-anomalies")
async def test_anomalies(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    try:
        db = get_db()
        collection = db["logs"]
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

@router.get("/hotspots")
async def get_hotspots_summary():
    try:
        db = get_db()
        collection = db["logs"]
        return hotspots_summary(collection)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/protocols/predict")
async def protocols_prediction(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    try:
        db = get_db()
        collection = db["logs"]
        return predict_protocols(collection, page=page, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include the router
app.include_router(router)
