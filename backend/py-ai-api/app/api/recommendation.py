from fastapi import APIRouter
from typing import List
from ..schemas.recommendation import RecommendationCreate, RecommendationOut, RecommendationUpdate
from ..services import create_recommendation, get_recommendation, update_recommendation, delete_recommendation, get_all_recommendations, get_recommendations_by_user, get_recommendations_by_user_and_range, get_recommendations_by_user_and_type

router = APIRouter()

@router.post("/", response_model=RecommendationOut)
async def api_create_recommendation(payload: RecommendationCreate):
    return await create_recommendation(payload)

@router.get("/{recommendation_id}", response_model=RecommendationOut)
async def api_get_recommendation(recommendation_id: str):
    return await get_recommendation(recommendation_id)

@router.put("/{recommendation_id}", response_model=RecommendationOut)
async def api_update_recommendation(recommendation_id: str, payload: RecommendationUpdate):
    return await update_recommendation(recommendation_id, payload)

@router.delete("/{recommendation_id}", response_model=None)
async def api_delete_recommendation(recommendation_id: str):
    return await delete_recommendation(recommendation_id)

@router.get("/", response_model=List[RecommendationOut])
async def api_get_all_recommendations():
    return await get_all_recommendations()

@router.get("/user/{user_id}", response_model=List[RecommendationOut])
async def api_get_recommendations_by_user(user_id: str):
    return await get_recommendations_by_user(user_id)

@router.get("/user/{user_id}/range", response_model=List[RecommendationOut])
async def api_get_recommendations_by_user_and_range(user_id: str, from_time: str, to_time: str):
    return await get_recommendations_by_user_and_range(user_id, from_time, to_time)

@router.get("/user/{user_id}/type/{recommendation_type}", response_model=List[RecommendationOut])
async def api_get_recommendations_by_user_and_type(user_id: str, recommendation_type: str):
    return await get_recommendations_by_user_and_type(user_id, recommendation_type)
