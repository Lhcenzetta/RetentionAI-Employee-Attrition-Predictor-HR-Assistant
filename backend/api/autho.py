from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from services.gemini_client import generate_retention_actions
from generateback import shcemas
import os
import pandas as pd
import joblib
from supabase_client import supabase

bearer_scheme = HTTPBearer()
router = APIRouter()

model = joblib.load("/Users/lait-zet/Desktop/The Briefs/RetentionAI-Employee-Attrition-Predictor-HR-Assistant/ml/model.pkl")


def verify_token(cred: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = cred.credentials
    try:
        user = supabase.auth.get_user(token)
        return user.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.post("/registre")
def registre(user: shcemas.CreateUser):
    response = supabase.auth.sign_up({
        "email": user.username,
        "password": user.passwordhash
    })
    if response.user is None:
        raise HTTPException(status_code=400, detail="Registration failed")
    return {"user_id": response.user.id}


@router.post("/login")
def sign_in(user: shcemas.CreateUser):
    response = supabase.auth.sign_in_with_password({
        "email": user.username,
        "password": user.passwordhash
    })
    if response.user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "token": response.session.access_token,
        "token_type": "bearer",
        "user_id": response.user.id
    }


@router.post("/predict_profile")
def predict_profile(profile: shcemas.ProfileUser, current_user=Depends(verify_token)):
    data = {
        "Age": profile.Age,
        "BusinessTravel": profile.BusinessTravel,
        "Department": profile.Department,
        "Education": profile.Education,
        "EducationField": profile.EducationField,
        "EnvironmentSatisfaction": profile.EnvironmentSatisfaction,
        "Gender": profile.Gender,
        "JobInvolvement": profile.JobInvolvement,
        "JobLevel": profile.JobLevel,
        "JobRole": profile.JobRole,
        "JobSatisfaction": profile.JobSatisfaction,
        "MaritalStatus": profile.MaritalStatus,
        "MonthlyIncome": profile.MonthlyIncome,
        "NumCompaniesWorked": profile.NumCompaniesWorked,
        "OverTime": "Yes" if profile.OverTime else "No",
        "PerformanceRating": profile.PerformanceRating,
        "RelationshipSatisfaction": profile.RelationshipSatisfaction,
        "TotalWorkingYears": profile.TotalWorkingYears,
        "WorkLifeBalance": profile.WorkLifeBalance,
        "YearsAtCompany": profile.YearsAtCompany,
        "YearsInCurrentRole": profile.YearsInCurrentRole,
        "YearsSinceLastPromotion": profile.YearsSinceLastPromotion,
        "YearsWithCurrManager": profile.YearsWithCurrManager
    }

    data_df = pd.DataFrame([data])
    prediction = model.predict_proba(data_df)
    churn_probability = round(float(prediction[0][1]), 2)

    result = supabase.table("predictions").insert({
        "user_id": str(current_user.id),
        "probability": churn_probability,
        "timestamp": int(datetime.utcnow().timestamp())
    }).execute()

    return {
        "churn_probability": churn_probability,
        "history_id": result.data[0]["id"]
    }


@router.post("/generate-retention-plan")
def generate_retention_plan(payload: shcemas.RetentionRequest, current_user=Depends(verify_token)):
    result = supabase.table("predictions") \
        .select("*") \
        .eq("user_id", str(current_user.id)) \
        .order("timestamp", desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="No prediction found")

    churn_probability = result.data[0]["probability"]

    if churn_probability <= 0.5:
        return {
            "user_id": str(current_user.id),
            "churn_probability": churn_probability,
            "retention_plan": []
        }

    prompt = f"""
Agis comme un expert RH.

Contexte :
Un salarié identifié par le système présente un risque élevé de départ
(churn_probability = {churn_probability * 100}%).

Tache :
Propose 3 actions concrètes et applicables
pour améliorer la rétention de ce salarié.

Réponds uniquement par 3 actions, une par ligne.
"""

    actions = generate_retention_actions(prompt)

    return {
        "churn_probability": churn_probability,
        "retention_plan": actions
    }