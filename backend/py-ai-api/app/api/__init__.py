from .user import router as user_router
from .activity import router as activity_router
from .recommendation import router as recommendation_router
from .training_data import router as training_data_router

all_routers = [
    user_router, 
    activity_router, 
    recommendation_router, 
    training_data_router
]