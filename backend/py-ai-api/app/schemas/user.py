from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email:    EmailStr
    full_name:  Optional[str]
    age:        Optional[int]
    height:     Optional[float]
    weight:     Optional[float]
    position:   Optional[str]
    skill_level: Optional[str]

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username:   Optional[str]
    email:      Optional[EmailStr]
    password:   Optional[str]
    full_name:  Optional[str]
    age:        Optional[int]
    height:     Optional[float]
    weight:     Optional[float]
    position:   Optional[str]
    skill_level: Optional[str]

class UserOut(UserBase):
    id:         str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
