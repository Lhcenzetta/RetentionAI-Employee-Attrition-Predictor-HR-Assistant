import os
from dotenv import load_dotenv
from google import genai

# charger les variables d'environnement
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing")

client = genai.Client(api_key=API_KEY)


def generate_retention_actions(prompt: str) -> list[str]:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return [
        line.strip()
        for line in response.text.split("\n")
        if line.strip()
    ][:3]
