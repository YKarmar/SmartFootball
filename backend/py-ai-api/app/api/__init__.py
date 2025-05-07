# This file can be empty, but it marks the 'api' directory (within 'app') as a Python sub-package.

from .user import router as user_router
from .activity import router as activity_router
from .recommendation import router as recommendation_router
from .training_data import router as training_data_router
from .api_llm_chat import router as api_llm_chat_router
from .api_llm_summarize import router as api_llm_summarize_router

all_routers = [
    user_router, 
    activity_router, 
    recommendation_router, 
    training_data_router,
    api_llm_chat_router,
    api_llm_summarize_router
]