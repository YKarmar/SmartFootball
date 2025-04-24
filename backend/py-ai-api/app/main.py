import uvicorn
from fastapi import FastAPI
from app.core.settings import settings
from app.api import user, activity, recommendation, training_data

app = FastAPI()
app.include_router(user.router, prefix="/api/users", tags=["users"])
app.include_router(activity.router, prefix="/api/activities", tags=["activities"])
app.include_router(recommendation.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(training_data.router, prefix="/api/training_data", tags=["training_data"])

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",            # 指向 app 实例
        host=settings.HOST,
        port=settings.PORT,
        reload=True,               # 本地调试自动重载
    )
