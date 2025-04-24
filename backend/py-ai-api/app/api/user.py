from fastapi import APIRouter
from typing import List
from ..schemas.user import UserCreate, UserOut, UserUpdate
from ..services import create_user, get_user, update_user, delete_user, get_all_users, get_user_by_email, get_user_by_username

router = APIRouter()

@router.post("/", response_model=UserOut)
async def api_create_user(payload: UserCreate):
    return await create_user(payload)

@router.get("/{user_id}", response_model=UserOut)
async def api_get_user(user_id: str):
    return await get_user(user_id)

@router.put("/{user_id}", response_model=UserOut)
async def api_update_user(user_id: str, payload: UserUpdate):
    return await update_user(user_id, payload)

@router.delete("/{user_id}", response_model=None)
async def api_delete_user(user_id: str):
    return await delete_user(user_id)

@router.get("/", response_model=List[UserOut])
async def api_get_all_users():
    return await get_all_users()

@router.get("/email/{email}", response_model=UserOut)
async def api_get_user_by_email(email: str):
    return await get_user_by_email(email)

@router.get("/username/{username}", response_model=UserOut)
async def api_get_user_by_username(username: str):
    return await get_user_by_username(username)

