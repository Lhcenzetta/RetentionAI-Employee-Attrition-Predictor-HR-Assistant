from gemini_client import generate_retention_actions
import pytest
import os
import joblib


def test_generate_retention_actions(mocker):
    fake_response = mocker.Mock()
    fake_response.text = """
    Increase salary
    Offer remote work
    Provide career development
    """

    mocker.patch("gemini_client.client.models.generate_content",return_value=fake_response )

    result = generate_retention_actions("generate some actions")

    expected = ["Increase salary","Offer remote work","Provide career development"]


    assert result == expected



@pytest.fixture
def load_model():
    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

    model_path = os.path.join(repo_root, "ml", "/Users/lait-zet/Desktop/breif/ml/model_predictor.pkl")

    model = joblib.load(model_path)
    return model

def test_model_loading(load_model):
    assert load_model is not None