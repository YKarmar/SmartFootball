# app/services/service_chat.py
from fastapi import HTTPException, status
from app.ml_models.llm_assistant import LLMAssistant, SYSTEM_PROMPT
from app.schemas.schema_chat import ChatRequest, Message # Updated import path
from typing import List, Dict

# Instantiate LLMAssistant once when the module is loaded.
# This makes it a de-facto singleton for the application lifetime.
# The SYSTEM_PROMPT from llm_assistant can be used here if needed to prepend to messages,
# or it can be expected from the client.

llm_assistant_instance: LLMAssistant

try:
    llm_assistant_instance = LLMAssistant()
    print("LLMAssistant initialized successfully in service_chat.")
except ValueError as e:
    print(f"CRITICAL: Failed to initialize LLMAssistant in service_chat: {e}")
    # This will be checked in the get_llm_assistant dependency or router.
    llm_assistant_instance = None # type: ignore

def get_llm_assistant_instance() -> LLMAssistant:
    """Dependency that provides the LLMAssistant instance."""
    if llm_assistant_instance is None:
        # This error will be raised if API key was missing during startup
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LLM Assistant is not available due to a startup configuration error (e.g., API key missing). Please check server logs."
        )
    return llm_assistant_instance

async def generate_llm_response(request: ChatRequest, assistant: LLMAssistant) -> str:
    """
    Generates a response from the LLM assistant based on the chat request.
    The client is responsible for sending the SYSTEM_PROMPT as the first message if desired.
    """
    processed_messages: List[Dict] = [msg.dict() for msg in request.messages]

    if not processed_messages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Messages list cannot be empty."
        )
    
    # Example: Ensure SYSTEM_PROMPT is the first message if not already sent by client.
    # This logic can be adjusted based on how you want to enforce the system prompt.
    # if not any(msg["role"] == "system" for msg in processed_messages):
    #     processed_messages.insert(0, {"role": "system", "content": SYSTEM_PROMPT})

    try:
        assistant_reply_content = assistant.response_generate(
            messages=processed_messages,
            temperature=request.temperature if request.temperature is not None else 0.7,
            max_tokens=request.max_tokens if request.max_tokens is not None else 500
        )
        return assistant_reply_content
    except RuntimeError as e:
        # This catches errors from llm_assistant.response_generate (e.g., API call failed)
        # Re-raise as HTTPException for the API layer to handle
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e) # Or a more generic message for production
        )
    except Exception as e:
        # Catch any other unexpected errors from the service layer
        # In production, you might want to log this error more thoroughly
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while processing your request: {str(e)}"
        ) 