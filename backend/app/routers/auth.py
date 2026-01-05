from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from database import get_db
from ..models.User import User
from ..schemas.User import UserCreate, UserOut, Token 
from ..utils.hashing import Hash, SECRET_KEY, ALGORITHM
from pydantic import BaseModel
import uuid

router = APIRouter(
    prefix="/api/auth", 
    tags=["Authentication"]
)

class SocialLoginRequest(BaseModel):
    email: str
    full_name: str
    avatar: str | None = None
    provider: str      # "google" hoặc "facebook"
    provider_id: str

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user_exist = db.query(User).filter(User.email == user_in.email).first()
    if user_exist:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    
    new_user = User(
        email=user_in.email,
        password=Hash.bcrypt(user_in.password),
        full_name=user_in.full_name,
        address=user_in.address,
        phone=user_in.phone,
        avatar=None, 
        role_id=2
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not Hash.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = Hash.create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role_id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "fullName": user.full_name,
            "role_id": user.role_id
        }
    }

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực người dùng",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/social-login")
def social_login(req: SocialLoginRequest, db: Session = Depends(get_db)):
    # Kiểm tra xem email này đã tồn tại chưa
    user = db.query(User).filter(User.email == req.email).first()

    if user:
        # Nếu đã có user, cập nhật thêm google_id/facebook_id nếu chưa có
        if req.provider == "google" and not user.google_id:
            user.google_id = req.provider_id
        elif req.provider == "facebook" and not user.facebook_id:
            user.facebook_id = req.provider_id
            
        # Nếu user chưa có avatar thì lấy luôn avatar từ social
        if not user.avatar and req.avatar:
            user.avatar = req.avatar
            
        db.commit()
    else:
        # Nếu chưa có user -> TẠO MỚI
        # Tạo password ngẫu nhiên vì user này đăng nhập bằng Google/FB
        random_password = str(uuid.uuid4())
        
        user = User(
            email=req.email,
            password=Hash.bcrypt(random_password),
            full_name=req.full_name,
            avatar=req.avatar,
            role_id=2, # Mặc định là User thường
            google_id=req.provider_id if req.provider == "google" else None,
            facebook_id=req.provider_id if req.provider == "facebook" else None
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Tạo Token đăng nhập (giống hệt API login thường)
    access_token = Hash.create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role_id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "fullName": user.full_name,
            "role_id": user.role_id,
            "avatar": user.avatar
        }
    }