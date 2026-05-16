import os
import joblib
import pandas as pd
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import uvicorn

# 1. Model Parameters and Loader
MODEL_PATH = "best_crop_model.joblib"
model_data = None

def load_model():
    """Loads the serialized model and label encoder from file."""
    global model_data
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Trained model '{MODEL_PATH}' not found. "
            "Please run 'python api.py' to train and save the model before starting the API."
        )
    # Load dictionary containing model, label encoder, and feature order
    model_data = joblib.load(MODEL_PATH)

# 2. Modern Lifespan Event Handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager to handle pre-loading model on startup."""
    global model_data
    try:
        load_model()
        print(f"[+] API Startup: Model '{model_data['model_name']}' loaded successfully.")
    except Exception as e:
        print(f"[!] API Startup Warning: Could not pre-load model on startup. Detail: {e}")
    yield
    # Cleanup on shutdown if needed
    model_data = None

# 3. Initialize FastAPI Application
app = FastAPI(
    title="Smart Crop Recommendation API",
    description="A high-performance Machine Learning API to recommend optimal crops based on chemical soil composition and weather conditions.",
    version="1.0.0",
    lifespan=lifespan
)

# 4. Enable Cross-Origin Resource Sharing (CORS)
# Allows frontend applications (React, Vue, HTML5) to query this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Input & Output Pydantic Request Validation Models
class SoilFeatures(BaseModel):
    N: float = Field(..., ge=0, description="Nitrogen content in soil (kg/ha)", example=90.0)
    P: float = Field(..., ge=0, description="Phosphorus content in soil (kg/ha)", example=42.0)
    K: float = Field(..., ge=0, description="Potassium content in soil (kg/ha)", example=43.0)
    ph: float = Field(..., ge=0, le=14, description="pH value of the soil (0.0 to 14.0 scale)", example=6.5)
    temperature: float = Field(..., description="Ambient temperature in degrees Celsius (°C)", example=20.87)
    humidity: float = Field(..., ge=0, le=100, description="Relative atmospheric humidity (%)", example=82.00)
    rainfall: float = Field(..., ge=0, description="Average rainfall in millimeters (mm)", example=202.93)

class PredictionResponse(BaseModel):
    success: bool
    primary_recommendation: str
    confidence: float

# 5. API Endpoints
@app.get("/")
def read_root():
    """Base metadata route."""
    return {
        "status": "online",
        "api_name": "Smart Crop Recommendation API",
        "version": "1.0.0",
        "description": "ML crop recommendation engine based on N-P-K ratios, pH, temperature, humidity, and rainfall.",
        "documentation": "/docs",
        "endpoints": {
            "predict": "/predict (POST) - Send JSON values to recommend crop",
            "health": "/health (GET) - Check system health and loaded model details"
        }
    }

@app.get("/health")
def health_check():
    """Validates if the model is ready and loaded."""
    global model_data
    if model_data is None:
        try:
            load_model()
        except Exception as e:
            return {
                "status": "degraded",
                "message": "Model not loaded. Please run 'python api.py' first.",
                "detail": str(e)
            }
            
    return {
        "status": "healthy",
        "model_loaded": True,
        "model_name": model_data["model_name"],
        "features": model_data["features"]
    }

@app.post("/predict", response_model=PredictionResponse)
def predict_crop(features: SoilFeatures):
    """Processes input parameters and generates a crop recommendation."""
    global model_data
    
    # Lazy-load if not initialized
    if model_data is None:
        try:
            load_model()
        except Exception as e:
            raise HTTPException(
                status_code=503, 
                detail=f"Model server error: Model has not been trained or loaded. Detail: {str(e)}"
            )

    try:
        model = model_data["model"]
        label_encoder = model_data["label_encoder"]
        feature_names = model_data["features"]
        model_name = model_data["model_name"]

        # Build input dict in exactly the order expected by the model
        input_dict = {
            "N": features.N,
            "P": features.P,
            "K": features.K,
            "ph": features.ph,
            "temperature": features.temperature,
            "rainfall": features.rainfall,
            "humidity": features.humidity
        }
        
        # Convert to single-row DataFrame
        input_df = pd.DataFrame([input_dict])
        
        # Align features ordering exactly with the model's training shape
        input_df = input_df[feature_names]

        # 1. Run Core Inference
        pred_idx = model.predict(input_df)[0]
        predicted_crop = label_encoder.inverse_transform([pred_idx])[0]

        # 2. Get Confidence Level
        primary_confidence = 1.0
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(input_df)[0]
            primary_confidence = float(np.max(probs))

        return PredictionResponse(
            success=True,
            primary_recommendation=str(predicted_crop),
            confidence=round(primary_confidence, 4)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during prediction inference: {str(e)}"
        )

# 6. Development Server Launcher
if __name__ == "__main__":
    print("[*] Starting Smart Crop API Server...")
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
