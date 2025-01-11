from fastapi import FastAPI
from app.routers import router

app = FastAPI()

# Include the router for all endpoints
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI AI backend!"}
