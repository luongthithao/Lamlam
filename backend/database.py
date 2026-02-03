from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()  # Load biến môi trường từ file .env

DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    raise ValueError("❌ DATABASE_URL không tồn tại! Kiểm tra file .env")

# PostgreSQL engine
engine = create_engine(DB_URL)

# Tạo session kết nối DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base cho ORM models
Base = declarative_base()

# Dependency dùng cho FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
