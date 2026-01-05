from fastapi import APIRouter, Depends, HTTPException, status,File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from ..models.Product import Product
from ..schemas.Product import ProductCreate, ProductOut, ProductUpdate
from .auth import get_current_user
from ..models.CartDetail import CartDetail
import os
import shutil
import uuid

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("/", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.get("/{id}", response_model=ProductOut)
def get_product(id: int, db: Session = Depends(get_db)):
    item = db.query(Product).filter(Product.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    return item

@router.post("/", response_model=ProductOut)
def create_product(
    product_in: ProductCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Chỉ Admin mới có quyền thêm sản phẩm")
    
    new_product = Product(**product_in.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Không có quyền xóa")
    
    db_product = db.query(Product).filter(Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    
    db.query(CartDetail).filter(CartDetail.product_id == id).delete()
    db.delete(db_product)
    db.commit()
    
    return None

@router.post("/upload-image")
def upload_product_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):

    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Chỉ Admin mới có quyền upload ảnh")

    allowed_extensions = ["jpg", "jpeg", "png", "webp"]
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận ảnh định dạng jpg, png, webp")

    file_name = f"{uuid.uuid4()}.{file_ext}"

    file_path = os.path.join("uploads", file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"image_name": file_name, "url": f"/uploads/{file_name}"}

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Chỉ Admin mới được sửa sản phẩm")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

    update_data = product_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(product, key, value) 

    db.commit()
    db.refresh(product)
    
    return product