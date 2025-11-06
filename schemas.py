from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TransactionCreate(BaseModel):
    title: str
    amount: float
    description: Optional[str] = None
    category: Optional[str] = None
    transaction_type: str  # "income" or "expense"


class TransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    transaction_type: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    title: str
    amount: float
    description: Optional[str]
    category: Optional[str]
    transaction_type: str
    date: datetime
    user_id: int

    class Config:
        from_attributes = True
