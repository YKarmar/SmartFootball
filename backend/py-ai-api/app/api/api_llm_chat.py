# app/api/api_llm_chat.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schema_chat import ChatRequest, ChatResponse # Specific to chat
from app.services.service_chat import generate_llm_response, get_llm_assistant_instance
from app.ml_models.llm_assistant import LLMAssistant

router = APIRouter()

@router.post("/", 
            response_model=ChatResponse, 
            status_code=status.HTTP_200_OK,
            summary="Chat with LLM Assistant",
            description="Send a list of messages (including conversation history and system prompt) to the LLM and get a response."
)
async def chat_with_assistant_endpoint(
    request: ChatRequest,
    assistant: LLMAssistant = Depends(get_llm_assistant_instance)
):
    try:
        assistant_reply = await generate_llm_response(request, assistant)
        return ChatResponse(assistant_response=assistant_reply)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error in chat_with_assistant_endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred in the API endpoint."
        ) 