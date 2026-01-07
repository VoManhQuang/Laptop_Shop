from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
import re

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, alias="fullName") 
    address: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr 
    password: str = Field(..., min_length=6, max_length=72)
    full_name: str = Field(..., min_length=2)
    address: Optional[str] = None
    phone: str

    @field_validator('email')
    def validate_gmail(cls, v):
        if not v.endswith('@gmail.com'):
            raise ValueError('Email bắt buộc phải có đuôi @gmail.com')
        return v

    @field_validator('password')
    def validate_password_length(cls, v):
        if len(v) < 6:
            raise ValueError('Mật khẩu phải có ít nhất 6 ký tự')
        return v
    
    @field_validator('phone')
    def validate_phone(cls, v):
        if not re.match(r'^\d{10}$', v):
            raise ValueError('Số điện thoại phải bao gồm đúng 10 chữ số, không chứa ký tự khác')
        return v

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, alias="fullName")
    phone: Optional[str] = None
    address: Optional[str] = None

class UserOut(UserBase):
    id: int
    role_id: int
    avatar: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut