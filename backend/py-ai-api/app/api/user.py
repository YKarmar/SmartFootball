# app/api/user.py
from fastapi import APIRouter
from py_ai_api.schemas.user import UserCreate, UserOut
from py_ai_api.services.user_client import create_user, get_user

router = APIRouter()

@router.post("/", response_model=UserOut)
async def api_create_user(payload: UserCreate):
    return await create_user(payload)

@router.get("/{user_id}", response_model=UserOut)
async def api_get_user(user_id: str):
    return await get_user(user_id)
