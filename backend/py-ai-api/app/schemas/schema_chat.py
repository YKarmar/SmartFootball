from typing import List, Optional
from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    temperature: Optional[float] = 1.0
    max_tokens: Optional[int] = 500

class ChatResponse(BaseModel):
    assistant_response: str

class SummarizeRequest(BaseModel):
    original_query: str
    detailed_analysis: str # This is the output from the first LLM
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 100

class SummarizeResponse(BaseModel):
    summary: str
    priority: str # Expected to be "High", "Medium", or "Low" 