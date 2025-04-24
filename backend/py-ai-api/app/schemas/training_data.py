from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class TrainingDataBase(BaseModel):
    user_id:          str
    session_start:    datetime
    session_end:      datetime
    accelerometer_data: Any
    gyroscope_data:     Any
    heart_rate_data:    Any
    gps_data:           Any

class TrainingDataCreate(TrainingDataBase):
    pass

class TrainingDataUpdate(BaseModel):
    session_start:    Optional[datetime]
    session_end:      Optional[datetime]
    accelerometer_data: Optional[Any]
    gyroscope_data:     Optional[Any]
    heart_rate_data:    Optional[Any]
    gps_data:           Optional[Any]

class TrainingDataOut(TrainingDataBase):
    id:         str
    created_at: datetime

    class Config:
        orm_mode = True
