from fastapi import FastAPI
from .api import activity, user, recommendation, training_data

app = FastAPI()

app.include_router(user.router,    prefix="/api/users")
app.include_router(activity.router,prefix="/api/activities")
# …其它router

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)
