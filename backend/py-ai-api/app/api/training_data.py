from fastapi import APIRouter
from typing import List
from ..schemas.training_data import TrainingDataCreate, TrainingDataOut, TrainingDataUpdate
from ..services import create_training_data, get_training_data, update_training_data, delete_training_data, get_all_training_data, get_training_data_by_user, get_training_data_by_user_and_range, get_training_data_by_user_and_type

router = APIRouter()

@router.post("/", response_model=TrainingDataOut)
async def api_create_training_data(payload: TrainingDataCreate):
    return await create_training_data(payload)

@router.get("/{training_data_id}", response_model=TrainingDataOut)
async def api_get_training_data(training_data_id: str):
    return await get_training_data(training_data_id)

@router.put("/{training_data_id}", response_model=TrainingDataOut)
async def api_update_training_data(training_data_id: str, payload: TrainingDataUpdate):
    return await update_training_data(training_data_id, payload)

@router.delete("/{training_data_id}", response_model=None)
async def api_delete_training_data(training_data_id: str):
    return await delete_training_data(training_data_id)

@router.get("/", response_model=List[TrainingDataOut])
async def api_get_all_training_data():
    return await get_all_training_data()

@router.get("/user/{user_id}", response_model=List[TrainingDataOut])
async def api_get_training_data_by_user(user_id: str):
    return await get_training_data_by_user(user_id)

@router.get("/user/{user_id}/range", response_model=List[TrainingDataOut])
async def api_get_training_data_by_user_and_range(user_id: str, from_time: str, to_time: str):
    return await get_training_data_by_user_and_range(user_id, from_time, to_time)

@router.get("/user/{user_id}/type/{activity_type}", response_model=List[TrainingDataOut])
async def api_get_training_data_by_user_and_type(user_id: str, activity_type: str):
    return await get_training_data_by_user_and_type(user_id, activity_type)

