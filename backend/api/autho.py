from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer 
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

model = joblib.load("/Users/lait-zet/Desktop/breif/ml/model_predictor.pkl")


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
    return {"token" : token , "token_type": "bearer" , "user_id" : existe_user.id}


@router.post("/predict_profile")
def test_model(profile : shcemas.ProfileUser, db: Session = Depends(get_db),dict = Depends(verify_token)):
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

    new_history = History(
        user_id=profile.user_id,
        employeeid=None,
        timestamp=int(datetime.utcnow().timestamp()),
        probability=churn_probability
    )

    db.add(new_history)
    db.commit()
    db.refresh(new_history)

    return {
        "churn_probability": churn_probability,
        "history_id": new_history.id
    }

@router.post("/generate-retention-plan")
def generate_retention_plan(payload: shcemas.RetentionRequest,db: Session = Depends(get_db),dict = Depends(verify_token)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    last_prediction = (
        db.query(History)
        .filter(History.user_id == payload.user_id)
        .order_by(History.timestamp.desc())
        .first()
    )

    if not last_prediction:
        raise HTTPException(
            status_code=404,
            detail="No prediction found for this user"
        )

    churn_probability = last_prediction.probability

    if churn_probability <= 0.5:
        return {
            "user_id": payload.user_id,
            "churn_probability": churn_probability,
            "retention_plan": []
        }

  
    prompt = f"""
Agis comme un expert RH.

Contexte :
Un salarié identifié par le système présente un risque élevé de départ
(churn_probability = {churn_probability * 100}%).

Tâche :
Propose 3 actions concrètes et applicables
pour améliorer la rétention de ce salarié.

Réponds uniquement par 3 actions,
une par ligne.
"""

    actions = generate_retention_actions(prompt)

    return {
        "user_id": payload.user_id,
        "churn_probability": churn_probability,
        "retention_plan": actions
    }
