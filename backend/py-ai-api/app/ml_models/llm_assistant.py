import os
from typing import List, Dict, Optional
from openai import OpenAI, api_key, ChatCompletion
from dotenv import load_dotenv

SYSTEM_PROMPT = """
You are a professional football data analysis assistant. You can help users analyze their football activity data,
including position coverage, running distance, heart rate changes, etc. Please answer users' questions in a professional
but easy-to-understand language.
"""

class LLMAssistant:
    def __init__(self):
        load_dotenv()
        # self.apenai_api_key = os.getenv("OPENAI_API_KEY")
        self.deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")

        if not self.deepseek_api_key:
            raise ValueError("API key not found in environment variables")

        self.model = "deepseek-chat"
        self.base_url = "https://api.deepseek.com"

    def response_generate(self, messages: List[Dict], temperature: float = 0.7, max_tokens: int = 500) -> Dict:
        try:
            client = OpenAI(api_key=self.deepseek_api_key, base_url=self.base_url)
            response = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False
            )

            return response.choices[0].message.content
        except Exception as e:
            return {
                "response": f"Error occurred: {str(e)}",
                "confidence": 0.0
            }

    def get_user_input(self):
        user_input = input("Enter your question: ")
        return user_input

    def chat(self):
        messages = [
             {"role": "system", "content": SYSTEM_PROMPT}
        ]
        while True:
            user_input = self.get_user_input()

            if user_input.lower() == "exit":
                print("Exiting the chat...")
                break

            messages.append({"role": "user", "content": user_input})
            response = self.response_generate(messages)
            print(f"Assistant: {response}")
            messages.append({"role": "assistant", "content": response})
            

# if __name__ == "__main__":
#     assistant = LLMAssistant()
#     response = assistant.chat()
#     print(response)