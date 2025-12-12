# ============================================================
# LLM.py — Using HuggingFace InferenceClient with provider
# ============================================================

import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("HF_API_KEY")

# Initialize client exactly the way your model requires
client = InferenceClient(
    model="fdtn-ai/Foundation-Sec-8B",
    provider="featherless-ai",
    api_key=API_KEY
)

def call_llm(prompt: str) -> str:
    if not API_KEY:
        return "[ERROR] Missing HF_API_KEY in environment variables."

    try:
        response = client.text_generation(
            prompt,
            max_new_tokens=300,
            temperature=0.1
        )
        return response

    except Exception as e:
        return f"[EXCEPTION] LLM request failed: {str(e)}"
