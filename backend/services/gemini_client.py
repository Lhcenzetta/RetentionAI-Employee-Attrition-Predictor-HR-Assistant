import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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
