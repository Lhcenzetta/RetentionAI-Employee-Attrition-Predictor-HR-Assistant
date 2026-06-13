import joblib
import pytest
import numpy as np

@pytest.fixture
def model():
    path = "/Users/lait-zet/Desktop/RetentionAI-Employee-Attrition-Predictor-HR-Assistant/ml/model_predictor.pkl"
    return joblib.load(path)

def test_model_loading(model):
    assert model != None

