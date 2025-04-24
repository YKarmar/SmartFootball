from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecommendationBase(BaseModel):
    user_id:            str
    recommendation_type: str
    title:               str
    description:         str
    priority:            int
    status:              str

class RecommendationCreate(RecommendationBase):
    pass

class RecommendationUpdate(BaseModel):
    recommendation_type: Optional[str]
    title:               Optional[str]
    description:         Optional[str]
    priority:            Optional[int]
    status:              Optional[str]

class RecommendationOut(RecommendationBase):
    id:         str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
