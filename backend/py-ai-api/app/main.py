import uvicorn
from fastapi import FastAPI # Removed HTTPException, status as they are not directly used in main now
from app.core.settings import settings
from app.api import user, activity, recommendation, training_data, api_llm_chat, api_llm_summarize

app = FastAPI(
    title="SmartFootball API", # Unified API title
    version="0.1.0",
    description="API for SmartFootball services including user management, activity tracking, and LLM assistance."
)

@app.get("/")
async def health_check():
    return {"status": "ok"}

# Include existing routers
app.include_router(user.router, prefix="/api/users", tags=["Users"])
app.include_router(activity.router, prefix="/api/activities", tags=["Activities"])
app.include_router(recommendation.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(training_data.router, prefix="/api/training_data", tags=["Training Data"])
app.include_router(api_llm_chat.router, prefix="/api/chat", tags=["LLM Chat"],)
app.include_router(api_llm_summarize.router, prefix="/api/summarize", tags=["LLM Summarize & Prioritize"],)


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
