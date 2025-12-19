from pydantic import BaseModel
from datetime import datetime
class CreateUser(BaseModel):
    username  : str
    passwordhash : str
class ProfileUser(BaseModel):
    user_id : int 
    Age : int
    BusinessTravel: str
    Department: str
    Education: int
    EducationField: str
    EnvironmentSatisfaction: int
    Gender: str
    JobInvolvement: int
    JobLevel: int
    JobRole: str
    JobSatisfaction: int
    MaritalStatus: str
    MonthlyIncome: float
    NumCompaniesWorked: int
    OverTime: bool
    PerformanceRating: int
    RelationshipSatisfaction: int
    TotalWorkingYears: int
    WorkLifeBalance: int
    YearsAtCompany: int
    YearsInCurrentRole: int
    YearsSinceLastPromotion: int
    YearsWithCurrManager: int

class PredictionResponse(BaseModel):
    churn_probability: float


class RetentionPlanResponse(BaseModel):
    churn_probability: float
    retention_plan: list[str]
    class config:
        orm_mode = True