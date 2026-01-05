from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from ..utils.hashing import Hash
import uuid
import shutil
import re
import os

from database import get_db
from ..models.User import User 
from ..schemas.User import UserOut
from .auth import get_current_user

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.put("/change-password")
def change_password(
    req: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Bước 1: Kiểm tra mật khẩu cũ có đúng không
    if not Hash.verify(req.old_password, current_user.password):
        raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không chính xác")

    # Bước 2: Kiểm tra xác nhận mật khẩu
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Mật khẩu xác nhận không khớp")

    # Bước 3: Mã hóa mật khẩu mới và lưu vào DB
    current_user.password = Hash.bcrypt(req.new_password)
    db.commit()

    return {"message": "Đổi mật khẩu thành công"}

@router.get("/profile", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_my_profile(
    fullName: Optional[str] = Form(None), 
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    file: UploadFile = File(None),       
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("--------------------------------------------------")
    print(f"DEBUG UPDATE PROFILE CHO USER ID: {current_user.id}")
    print(f" - Email: {current_user.email}")
    print(f" - Dữ liệu nhận được từ Frontend:")
    print(f"   + fullName: '{fullName}'")
    print(f"   + phone:    '{phone}'")
    print(f"   + address:  '{address}'")
    print(f"   + file:     {file.filename if file else 'None'}")
    print("--------------------------------------------------")

    user_to_update = db.query(User).filter(User.id == current_user.id).first()
    
    if not user_to_update:
        print("LỖI: Không tìm thấy user trong DB để update!")
        raise HTTPException(status_code=404, detail="User not found")

    if fullName is not None:
        print(f" -> Đang update fullName thành: {fullName}")
        user_to_update.full_name = fullName
        
    if phone is not None:
        print(f" -> Đang update phone thành: {phone}")
        user_to_update.phone = phone
        
    if address is not None:
        print(f" -> Đang update address thành: {address}")
        user_to_update.address = address

    if file:
        print(f" -> Đang xử lý upload ảnh...")
        file_extension = file.filename.split(".")[-1]
        avatar_filename = f"{uuid.uuid4()}.{file_extension}"
        
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            
        file_location = f"{upload_dir}/{avatar_filename}"
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        user_to_update.avatar = avatar_filename

    try:
        db.commit()
        db.refresh(user_to_update)
        print(" -> ĐÃ COMMIT THÀNH CÔNG VÀO DATABASE!")
    except Exception as e:
        print(f" -> LỖI KHI COMMIT: {e}")
        db.rollback()

    print("--------------------------------------------------")
    return user_to_update

@router.get("/", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.id.desc()).all()
    return users

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(
    email: str = Form(...),
    password: str = Form(...),
    fullName: str = Form(...),
    phone: str = Form(None),
    address: str = Form(None),
    role_id: int = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    exist_email = db.query(User).filter(User.email == email).first()
    if exist_email:
        raise HTTPException(status_code=400, detail="Email đã tồn tại") #

    if phone:
        exist_phone = db.query(User).filter(User.phone == phone).first()
        if exist_phone:
            raise HTTPException(status_code=400, detail="Số điện thoại đã tồn tại")

    avatar_filename = None
    if file:
        file_extension = file.filename.split(".")[-1]
        avatar_filename = f"{uuid.uuid4()}.{file_extension}"
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        file_location = f"{upload_dir}/{avatar_filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    hashed_password = pwd_context.hash(password)

    new_user = User(
        email=email,
        password=hashed_password,
        full_name=fullName,
        phone=phone,
        address=address,
        role_id=role_id,
        avatar=avatar_filename
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return None

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    fullName: str = Form(...),
    phone: str = Form(None),
    address: str = Form(None),
    role_id: int = Form(...),
    password: Optional[str] = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if phone and not re.match(r'^\d{10}$', phone):
        raise HTTPException(status_code=400, detail="Số điện thoại phải đúng 10 chữ số")
    if password and len(password) > 0:
        if len(password) < 6:
            raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 6 ký tự")
        user.password = pwd_context.hash(password)

    user.full_name = fullName
    user.phone = phone
    user.address = address
    user.role_id = role_id
    
    if password and len(password) > 0:
        user.password = pwd_context.hash(password)

    if file:
        file_extension = file.filename.split(".")[-1]
        avatar_filename = f"{uuid.uuid4()}.{file_extension}"
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        file_location = f"{upload_dir}/{avatar_filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        user.avatar = avatar_filename

    db.commit()
    db.refresh(user)
    return user
