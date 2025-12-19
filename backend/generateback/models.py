from .base import Base
from sqlalchemy import Column, Float, ForeignKey , String, Integer
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    passwordhash = Column(String)
    createdate = Column(String)
    
    history = relationship("History", back_populates="user")


class History(Base):
    __tablename__ = "predictions_history"

    id = Column(Integer, primary_key=True, autoincrement=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    employeeid = Column(Integer)
    timestamp = Column(Integer)
    probability = Column(Float)

    
    user = relationship("User", back_populates="history")