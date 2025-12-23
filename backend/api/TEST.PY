import joblib
import pandas as pd
model = joblib.load('/Users/lait-zet/Desktop/breif/ml/model_predictor.pkl')

data_sample = {
  "Age": 41,
  "BusinessTravel": "Travel_Rarely",
  "Department": "Sales",
  "Education": 1,
  "EducationField": "Life Sciences",
  "EnvironmentSatisfaction": 2,
  "Gender": "Female",
  "JobInvolvement": 3,
  "JobLevel": 2,
  "JobRole": "Sales Executive",
  "JobSatisfaction": 4,
  "MaritalStatus": "Single",
  "MonthlyIncome": 5993,
  "NumCompaniesWorked": 8,
  "OverTime": "Yes",
  "PerformanceRating": 3,
  "RelationshipSatisfaction": 1,
  "TotalWorkingYears": 8,
  "WorkLifeBalance": 1,
  "YearsAtCompany": 6,
  "YearsInCurrentRole": 4,
  "YearsSinceLastPromotion": 0,
  "YearsWithCurrManager": 5
}

data_df = pd.DataFrame([data_sample])
prediction = model.predict(data_df)
proba = model.predict_proba(data_df)
print(prediction[0])
print(proba[0][1])
