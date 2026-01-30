from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Task

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. Lấy danh sách task
@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

# 2. Tạo task mới
@router.post("/")
def create_task(data: dict, db: Session = Depends(get_db)):
    task = Task(
        title=data["title"],
        description=data.get("description", ""),
        status=data.get("status", "New"),
        priority=data.get("priority", "Normal"),
        due_date=data.get("due_date", None)
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

# 3. Lấy chi tiết task
@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# 4. Cập nhật task
@router.put("/{task_id}")
def update_task(task_id: int, data: dict, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for field, value in data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task

# 5. Xóa task
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
