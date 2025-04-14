import os
import json
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class DeepSeekAgent:
    """
    Chat agent using DeepSeek API
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "deepseek-chat"):
        """
        Initialize DeepSeek agent
        
        Args:
            api_key: DeepSeek API key, if None will be fetched from environment variables
            model: Model name to use
        """
        self.api_key = api_key or os.environ.get("DEEPSEEK_API_KEY")
        if not self.api_key:
            raise ValueError("DeepSeek API key not provided, please set DEEPSEEK_API_KEY environment variable")
        
        self.model = model
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
        self.conversation_history = []
    
    def add_message(self, role: str, content: str) -> None:
        """
        Add a message to conversation history
        
        Args:
            role: Message role (system, user, assistant)
            content: Message content
        """
        self.conversation_history.append({"role": role, "content": content})
    
    def clear_history(self) -> None:
        """Clear conversation history"""
        self.conversation_history = []
    
    def chat(self, message: str, system_prompt: Optional[str] = None) -> str:
        """
        Send a message and get a response
        
        Args:
            message: User message
            system_prompt: System prompt, if provided will override previous system prompt
            
        Returns:
            AI response text
        """
        # Add user message
        self.add_message("user", message)
        
        # Prepare request data
        messages = self.conversation_history.copy()
        
        # If system prompt is provided, add it to the beginning of the message list
        if system_prompt:
            # Remove previous system message (if any)
            messages = [msg for msg in messages if msg["role"] != "system"]
            messages.insert(0, {"role": "system", "content": system_prompt})
        
        data = {
            "model": self.model,
            "messages": messages,
            "temperature": 1.0,
            "max_tokens": 1000
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()
            assistant_message = result["choices"][0]["message"]["content"]
            
            # Add assistant response to conversation history
            self.add_message("assistant", assistant_message)
            
            return assistant_message
            
        except requests.exceptions.RequestException as e:
            error_msg = f"API request error: {str(e)}"
            print(error_msg)
            return error_msg
    
    def analyze_football_data(self, data: Dict[str, Any]) -> str:
        """
        Analyze football activity data and provide insights
        
        Args:
            data: Football activity data dictionary
            
        Returns:
            Analysis result text
        """
        # Convert data to JSON string
        data_json = json.dumps(data, indent=2)
        
        system_prompt = """
        You are a professional football analysis assistant, specialized in analyzing player activity data.
        Based on the provided GPS trajectory, heart rate, speed, and other data, analyze the player's performance, including:
        1. Activity range and coverage area
        2. High-intensity activity time
        3. Fatigue level
        4. Position preference
        5. Improvement suggestions
        
        Please answer in concise and professional language.
        """
        
        user_message = f"Please analyze the following football activity data:\n{data_json}"
        
        return self.chat(user_message, system_prompt)
    
    def answer_question(self, question: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Answer questions about football activities
        
        Args:
            question: User question
            context: Optional context data
            
        Returns:
            Answer text
        """
        if context:
            context_json = json.dumps(context, indent=2)
            user_message = f"Question: {question}\n\nContext data:\n{context_json}"
        else:
            user_message = question
            
        system_prompt = """
        You are a professional football analysis assistant who can answer questions about football activities, training, and matches.
        Please provide professional and accurate answers based on the user's question and the provided context data (if any).
        """
        
        return self.chat(user_message, system_prompt)


# Test the DeepSeekAgent class
if __name__ == "__main__":
    agent = DeepSeekAgent()
    # Mock data for testing
    data = {
        "player_id": "123456",
        "activity_data": {
            "position": "forward",
            "speed": 10.5,
            "heart_rate": 150,
            "trajectory": [
                {"x": 10, "y": 10},
                {"x": 20, "y": 20},
                {"x": 30, "y": 30}
            ]
        }
    }
       
    # Test analyze_football_data method
    analysis = agent.analyze_football_data(data)
    print("Football data analysis:\n", analysis)
        
