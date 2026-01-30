from fastapi import FastAPI
from routes.tasks import router as tasks_router
from database import Base, engine

# Tạo bảng database tự động
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend FastAPI is running!"}

app.include_router(tasks_router, prefix="/tasks")
