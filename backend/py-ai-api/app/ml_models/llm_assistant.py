import os
from typing import List, Dict, Optional
from openai import OpenAI
from dotenv import load_dotenv

SYSTEM_PROMPT = """
You are a professional football data analysis assistant. You can help users analyze their football activity data,
including position coverage, running distance, heart rate changes, etc. Please answer users' questions in a professional
but easy-to-understand language.
"""

SUMMARIZATION_SYSTEM_PROMPT = """You are an expert at summarizing detailed sports analysis into concise, actionable advice and assigning a priority.
Given a detailed analysis and a user query, provide a very brief summary (1 sentences, no more than 10 words) of the core advice.
Then, on a new line, state the priority of this advice as one of: [High, Medium, Low].
You must follow the format exactly as shown in the example.
For example:
{
    "Summary": "Focus on increasing sprint repetitions during training.",
    "Priority": "High"
}
"""

class LLMAssistant:
    def __init__(self):
        load_dotenv()
        self.deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")

        if not self.deepseek_api_key:
            raise ValueError("DEEPSEEK_API_KEY not found in environment variables. Please ensure it is set in your .env file.")

        self.model = "deepseek-chat"
        self.base_url = "https://api.deepseek.com"

    def response_generate(self, messages: List[Dict], temperature: float = 0.7, max_tokens: int = 500) -> str:
        try:
            client = OpenAI(api_key=self.deepseek_api_key, base_url=self.base_url)
            response = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False
            )
            if response.choices and response.choices[0].message:
                return response.choices[0].message.content
            else:
                raise RuntimeError("LLM API response is not in the expected format.")
        except Exception as e:
            raise RuntimeError(f"LLM API call failed: {str(e)}")
