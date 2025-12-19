import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
import joblib
import os
import sys

# Ajouter le chemin du backend pour les imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from api.autho import model  # Importer le modèle chargé
from services.gemini_client import generate_retention_actions


class TestModelLoading(unittest.TestCase):
    def test_model_loaded_correctly(self):
        """Vérifier que le modèle est chargé correctement"""
        self.assertIsNotNone(model)
        # Vérifier que c'est un modèle scikit-learn
        self.assertTrue(hasattr(model, 'predict_proba'))

    def test_model_consistent_results(self):
        """Vérifier que le modèle produit des résultats cohérents pour des données identiques"""
        # Données de test
        test_data = {
            "Age": 30,
            "BusinessTravel": "Travel_Rarely",
            "Department": "Sales",
            "Education": 3,
            "EducationField": "Marketing",
            "EnvironmentSatisfaction": 3,
            "Gender": "Male",
            "JobInvolvement": 3,
            "JobLevel": 2,
            "JobRole": "Sales Executive",
            "JobSatisfaction": 3,
            "MaritalStatus": "Married",
            "MonthlyIncome": 5000,
            "NumCompaniesWorked": 2,
            "OverTime": False,
            "PerformanceRating": 3,
            "RelationshipSatisfaction": 3,
            "TotalWorkingYears": 5,
            "WorkLifeBalance": 3,
            "YearsAtCompany": 3,
            "YearsInCurrentRole": 2,
            "YearsSinceLastPromotion": 1,
            "YearsWithCurrManager": 2
        }

        df = pd.DataFrame([test_data])

        # Faire plusieurs prédictions avec les mêmes données
        predictions = []
        for _ in range(5):
            pred = model.predict_proba(df)
            predictions.append(pred[0][1])

        # Vérifier que toutes les prédictions sont identiques (déterministe)
        self.assertEqual(len(set(predictions)), 1, "Le modèle ne produit pas des résultats cohérents")

        # Vérifier que la probabilité est entre 0 et 1
        prob = predictions[0]
        self.assertGreaterEqual(prob, 0.0)
        self.assertLessEqual(prob, 1.0)


class TestLLMClient(unittest.TestCase):
    @patch('services.gemini_client.client.models.generate_content')
    def test_generate_retention_actions_mocked(self, mock_generate):
        """Tester la fonction generate_retention_actions avec une réponse mockée"""
        # Mock de la réponse de l'API
        mock_response = MagicMock()
        mock_response.text = "Action 1: Améliorer les conditions de travail\nAction 2: Augmenter le salaire\nAction 3: Offrir des formations"
        mock_generate.return_value = mock_response

        prompt = "Test prompt"
        result = generate_retention_actions(prompt)

        # Vérifier que la fonction retourne une liste de 3 actions
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 3)
        self.assertEqual(result[0], "Action 1: Améliorer les conditions de travail")
        self.assertEqual(result[1], "Action 2: Augmenter le salaire")
        self.assertEqual(result[2], "Action 3: Offrir des formations")

        # Vérifier que l'API a été appelée avec les bons paramètres
        mock_generate.assert_called_once()
        call_args = mock_generate.call_args
        self.assertEqual(call_args[1]['model'], 'gemini-2.5-flash')
        self.assertEqual(call_args[1]['contents'], prompt)

    @patch('services.gemini_client.client.models.generate_content')
    def test_generate_retention_actions_empty_response(self, mock_generate):
        """Tester avec une réponse vide"""
        mock_response = MagicMock()
        mock_response.text = ""
        mock_generate.return_value = mock_response

        result = generate_retention_actions("prompt")
        self.assertEqual(result, [])

    @patch('services.gemini_client.client.models.generate_content')
    def test_generate_retention_actions_fewer_lines(self, mock_generate):
        """Tester avec moins de 3 lignes"""
        mock_response = MagicMock()
        mock_response.text = "Action 1\nAction 2"
        mock_generate.return_value = mock_response

        result = generate_retention_actions("prompt")
        self.assertEqual(len(result), 2)


if __name__ == '__main__':
    unittest.main()