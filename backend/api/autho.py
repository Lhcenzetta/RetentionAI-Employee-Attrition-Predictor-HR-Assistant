from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer 
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from services.gemini_client import generate_retention_actions
from generateback.models import History, User
from generateback.base import get_db
from generateback import shcemas
from jose import JWTError, jwt
import os
import pandas as pd
import joblib
import google as genai

bearer_scheme = HTTPBearer()

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"

router = APIRouter()

model = joblib.load("/Users/lait-zet/Desktop/RetentionAI-Employee-Attrition-Predictor-HR-Assistant/ml/model_predictor.pkl")


pwd_password = CryptContext(schemes=["bcrypt"])
def creat_passwor(passw):
    return pwd_password.hash(passw)


def verfier_password(existpassword , newpassword ):
    return pwd_password.verify(existpassword, newpassword)

def creat_token(data):
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


def verify_token(cred: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = cred.credentials
    decoded = decode_token(token)
    if decoded is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return decoded


@router.post("/registre",response_model=shcemas.CreateUser)
def registre(user : shcemas.CreateUser, db: Session = Depends(get_db)):
    exist_user = db.query(User).filter(User.username == user.username).first()
    if exist_user:
        raise  HTTPException(status_code=400, detail="THIS USER ALERADY EXIST")
    else:
        new_user = User(
            username  = user.username,
            passwordhash = creat_passwor(user.passwordhash),
            createdate = datetime.utcnow()
        )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def sing_in(user : shcemas.CreateUser , db: Session = Depends(get_db)):
    existe_user = db.query(User).filter(User.username == user.username).first()

    if not existe_user:
        raise HTTPException(
            status_code=401,
            detail="oops somthing wrong"
        )

    if not verfier_password(user.passwordhash, existe_user.passwordhash):
        raise HTTPException(
            status_code=401,
            detail="invalid password please check your stuff"
        )
    paylod = {"username" : existe_user.username}
    token = creat_token(paylod)
    print(token)
    return {"token" : token , "token_type": "bearer"}

@router.post("/predict_profile", response_model=shcemas.PredictionResponse)
def test_model(profile : shcemas.ProfileUser, db: Session = Depends(get_db)):

    #how to get a exist new user from database
    current_user = db.query(User).filter(User.username == username).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    

    data = profile.model_dump()
    data_df = pd.DataFrame([data])
    prediction = model.predict_proba(data_df)

    churn_probability = round(float(prediction[0][1]), 2)

    #stoke this prediction and user
    new_history = History(
        
    )

    return {
        "churn_probability": churn_probability
    }



@router.post("/generate-retention-plan",response_model=shcemas.RetentionPlanResponse)
def generate_retention_plan(profile: shcemas.ProfileUser):
    data_df = pd.DataFrame([profile.dict()])
    prediction = model.predict_proba(data_df)
    churn_probability = round(float(prediction[0][1]), 2)

    if churn_probability <= 0.5:
        return {
            "churn_probability": churn_probability,
            "retention_plan": []
        }
    
    prompt = f"""
Agis comme un expert RH.

Voici les informations sur l’employé :
- Age : {profile.Age}
- Département : {profile.Department}
- Rôle : {profile.JobRole}
- Satisfaction au travail : {profile.JobSatisfaction}/4
- Performance : {profile.PerformanceRating}/4
- Équilibre vie pro/perso : {profile.WorkLifeBalance}/4
- Ancienneté : {profile.YearsAtCompany} ans
- Salaire mensuel : {profile.MonthlyIncome}
- Voyages professionnels : {profile.BusinessTravel}
- Heures supplémentaires : {'Oui' if profile.OverTime else 'Non'}

Contexte :
Ce salarié présente un risque élevé de départ
(churn_probability = {churn_probability * 100}%).

Tâche :
Propose 3 actions concrètes et personnalisées
pour le retenir dans l’entreprise.

Réponds uniquement par 3 actions, une par ligne.
"""


    actions = generate_retention_actions(prompt)

    return {
        "churn_probability": churn_probability,
        "retention_plan": actions
    }




# @app.router("/gemina_action")
# def gemeia_action():
#     if churn_probability <= 0.5:
#         return {"retention_plan": []}
    
#     # Generate retention plan using AI
#     prompt = f"""Agis comme un expert RH. 

# Voici les informations sur l'employé :
# - Age : {profile_user.Age}
# - Département : {profile_user.Department}
# - Rôle : {profile_user.JobRole}
# - Satisfaction au travail : {profile_user.JobSatisfaction}/4
# - Performance : {profile_user.PerformanceRating}/4
# - Équilibre vie professionnelle/personnelle : {profile_user.WorkLifeBalance}/4
# - Ancienneté dans l'entreprise : {profile_user.YearsAtCompany} ans
# - Salaire mensuel : {profile_user.MonthlyIncome} €
# - Voyages d'affaires : {profile_user.BusinessTravel}
# - Heures supplémentaires : {'Oui' if profile_user.OverTime else 'Non'}

# Contexte : ce salarié a un risque élevé de départ avec une probabilité de churn de {churn_probability * 100}%.

# Tâche : propose 3 actions concrètes et personnalisées pour le retenir dans l'entreprise, en tenant compte de son rôle, sa satisfaction, sa performance et son équilibre vie professionnelle/personnelle.  
# Rédige les actions de façon claire et opérationnelle pour un manager RH.

# Réponds uniquement avec les 3 actions, une par ligne, sans numérotation."""
    
#     ai_model = genai.GenerativeModel('gemini-1.0-pro')
#     response = ai_model.generate_content(prompt)
#     actions = response.text.strip().split('\n')[:3]
#     actions = [action.strip() for action in actions if action.strip()]
    
#     return {"retention_plan": actions}