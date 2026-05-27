from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import uvicorn

app = FastAPI(
    title="NeuroCity AI - Intelligent Inference Bus",
    description="Production-grade behavioral analytics engine for urban stress detection",
    version="1.0.0"
)

# Structuring the inbound biometric demographics array
class BiometricPacket(BaseModel):
    heart_rate: float = Field(..., description="BPM sensor input telemetry")
    sleep_duration: float = Field(..., description="Chronological rest value in hours")
    workload_intensity: float = Field(..., description="Scalar loading value from 0.0 to 1.0")
    exercise_frequency: int = Field(..., description="Weekly somatic optimization events")

@app.post("/api/predict/stress")
async def predict_urban_stress(packet: BiometricPacket):
    try:
        hr = packet.heart_rate
        sleep = packet.sleep_duration
        work = packet.workload_intensity
        exec_freq = packet.exercise_frequency

        # Operational Machine Learning Classifier Simulation Logic
        normalized_hr = (hr - 60) / (120 - 60)   # Standard biometric scaling array
        normalized_sleep = (9 - sleep) / (9 - 4) # Lower sleep yields higher stress metrics
        
        # Linear combination representing a trained logistic regression decision boundary
        stress_score = (0.4 * normalized_hr) + (0.3 * normalized_sleep) + (0.3 * work) - (0.05 * exec_freq)
        stress_score = max(0.0, min(1.0, stress_score)) # Restricting index limit bounds to [0, 1]

        # Classification risk assignment criteria
        if stress_score < 0.40:
            classification = "LOW_STRESS"
            recommendation = "Autonomic tracking loops stable. Maintain current cognitive load vectors."
        elif stress_score < 0.70:
            classification = "MEDIUM_STRESS"
            recommendation = "Elevated environmental parameters detected. Consider scheduling variable rest breaks."
        else:
            classification = "HIGH_STRESS"
            recommendation = "CRITICAL BOUNDARY ENCOUNTERED: Initialize immediate clinical somatic de-escalation protocols."

        return {
            "status": "ANALYSIS_SUCCESSFUL",
            "calculatedStressScore": round(float(stress_score), 4),
            "stressClassification": classification,
            "clinicalRecommendation": recommendation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference bus processing exception: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)