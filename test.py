import pandas as pd 


def handle_manque(df, col):
    data[col] = df[col].fillna(df[col].median())
    return df


data = "/Users/lait-zet/Desktop/RetentionAI-Employee-Attrition-Predictor-HR-Assistant/ml/data/data.csv"
df = pd.read_csv(data)

