"""Service: crime prediction (stub — replace with trained ML model)."""
from typing import Dict, Any


def predict_crime_risk(district_name: str, crime_type: str) -> Dict[str, Any]:
    """
    Predict the risk level for a given district and crime type.
    TODO: load a trained scikit-learn / XGBoost model from disk and run inference.
    """
    # Stub response — replace with actual model.predict()
    return {
        "district": district_name,
        "crime_type": crime_type,
        "risk_level": "medium",          # low | medium | high
        "confidence": 0.0,
        "note": "Model not yet loaded — stub response",
    }
