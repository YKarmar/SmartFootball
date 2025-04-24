from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ActivityBase(BaseModel):
    user_id:         str
    activity_type:   str
    start_time:      datetime
    end_time:        datetime
    duration:        int
    distance:        Optional[float]
    calories_burned: Optional[float]
    average_heart_rate: Optional[float]
    max_heart_rate:  Optional[float]
    activity_data:   Dict[str, Any]

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    activity_type:   Optional[str]
    start_time:      Optional[datetime]
    end_time:        Optional[datetime]
    duration:        Optional[int]
    distance:        Optional[float]
    calories_burned: Optional[float]
    average_heart_rate: Optional[float]
    max_heart_rate:  Optional[float]
    activity_data:   Optional[Dict[str, Any]]

class ActivityOut(ActivityBase):
    id:         str
    created_at: datetime

    class Config:
        orm_mode = True
