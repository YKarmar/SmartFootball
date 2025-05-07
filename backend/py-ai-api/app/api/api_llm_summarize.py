from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schema_chat import SummarizeRequest, SummarizeResponse, Message # Message might not be needed if not constructing them here
from app.services.service_chat import get_llm_assistant_instance # generate_llm_response might be too generic if we create a specific service method
from app.ml_models.llm_assistant import LLMAssistant, SUMMARIZATION_SYSTEM_PROMPT
import json # For parsing if LLM returns JSON string

router = APIRouter()

@router.post("/",
            response_model=SummarizeResponse, 
            status_code=status.HTTP_200_OK,
            summary="Summarize Analysis and Assign Priority",
            description="Takes a detailed analysis and original query, summarizes it, and assigns a priority using an LLM."
)
async def summarize_and_prioritize_analysis_endpoint(
    request: SummarizeRequest,
    assistant: LLMAssistant = Depends(get_llm_assistant_instance)
):
    messages_for_summarizer = [
        {"role": "system", "content": SUMMARIZATION_SYSTEM_PROMPT},
        {"role": "user", "content": f"Original user query was: \"{request.original_query}\"\n\nDetailed analysis provided: \"{request.detailed_analysis}\"\n\nPlease provide a concise summary and priority for this analysis based on the format instructions in the system prompt."}
    ]

    try:
        raw_summary_response = assistant.response_generate(
            messages=messages_for_summarizer,
            temperature=request.temperature if request.temperature is not None else 0.5,
            max_tokens=request.max_tokens if request.max_tokens is not None else 150 # Increased slightly for JSON
        )
        
        # Attempt to parse as JSON first, as per the updated SUMMARIZATION_SYSTEM_PROMPT
        try:
            parsed_response = json.loads(raw_summary_response)
            summary_text = parsed_response.get("Summary", "Could not parse summary.")
            priority_text = parsed_response.get("Priority", "Medium")
            if priority_text not in ["High", "Medium", "Low"]:
                priority_text = "Medium"
        except json.JSONDecodeError:
            # Fallback to line-by-line parsing if JSON parsing fails (old method)
            print(f"Warning: Could not parse summarizer response as JSON. Falling back to line parsing. Response: {raw_summary_response}")
            lines = raw_summary_response.strip().splitlines()
            summary_text = "Could not parse summary."
            priority_text = "Medium"
            found_summary = False
            found_priority = False
            for line in lines:
                line_lower = line.lower()
                if line_lower.startswith("summary:") and not found_summary:
                    summary_text = line.split(":", 1)[1].strip()
                    found_summary = True
                elif line_lower.startswith("priority:") and not found_priority:
                    priority_text = line.split(":", 1)[1].strip()
                    if priority_text not in ["High", "Medium", "Low"]:
                        priority_text = "Medium"
                    found_priority = True
                if found_summary and found_priority:
                    break
            if not found_summary and not found_priority and len(lines) >= 2:
                summary_text = lines[0].strip()
                priority_text = lines[1].strip()
                if priority_text not in ["High", "Medium", "Low"]:
                    priority_text = "Medium"
            elif not found_summary and len(lines) >=1:
                summary_text = lines[0].strip()

        return SummarizeResponse(summary=summary_text, priority=priority_text)

    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarizer LLM call failed: {str(e)}"
        )
    except Exception as e:
        print(f"Unexpected error in summarize_and_prioritize_analysis_endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing summarization request: {str(e)}"
        ) 