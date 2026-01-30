from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from datetime import datetime
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="New")
    priority = Column(String(20), default="Normal")
    created_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(Date)
