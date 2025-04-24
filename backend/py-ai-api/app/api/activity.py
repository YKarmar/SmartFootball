from fastapi import APIRouter
from typing import List
from ..schemas.activity import ActivityCreate, ActivityOut, ActivityUpdate
from ..services import create_activity, get_activity, update_activity, delete_activity, get_all_activities, get_activities_by_user, get_activities_by_user_and_range, get_activities_by_user_and_type

router = APIRouter()

@router.post("/", response_model=ActivityOut)
async def api_create_activity(payload: ActivityCreate):
    return await create_activity(payload)

@router.get("/{activity_id}", response_model=ActivityOut)
async def api_get_activity(activity_id: str):
    return await get_activity(activity_id)

@router.put("/{activity_id}", response_model=ActivityOut)
async def api_update_activity(activity_id: str, payload: ActivityUpdate):
    return await update_activity(activity_id, payload)

@router.delete("/{activity_id}", response_model=None)
async def api_delete_activity(activity_id: str):
    return await delete_activity(activity_id)

@router.get("/", response_model=List[ActivityOut])
async def api_get_all_activities():
    return await get_all_activities()

@router.get("/user/{user_id}", response_model=List[ActivityOut])
async def api_get_activities_by_user(user_id: str):
    return await get_activities_by_user(user_id)

@router.get("/user/{user_id}/range", response_model=List[ActivityOut])
async def api_get_activities_by_user_and_range(user_id: str, from_time: str, to_time: str):
    return await get_activities_by_user_and_range(user_id, from_time, to_time)

@router.get("/user/{user_id}/type/{activity_type}", response_model=List[ActivityOut])
async def api_get_activities_by_user_and_type(user_id: str, activity_type: str):
    return await get_activities_by_user_and_type(user_id, activity_type)

