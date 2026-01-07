from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import hashlib
import hmac
import urllib.parse
import time
from datetime import datetime
import json
import requests

from database import get_db
from ..models.Order import Order
from .auth import get_current_user
from urllib.parse import quote, urlencode
from config_vnpay import VNPAY_CONFIG
from config_momo import MOMO_CONFIG
from pydantic import BaseModel

class CreatePaymentRequest(BaseModel):
    order_id: int
    payment_method: str  # "VNPAY" or "MOMO"

router = APIRouter(prefix="/api/payment", tags=["Payment"])

def generate_vnpay_url(order_id: int, amount: int, order_info: str):
    vnp_Params = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": VNPAY_CONFIG["TMN_CODE"],
        "vnp_Amount": str(amount * 100),
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": str(order_id),
        "vnp_OrderInfo": order_info,
        "vnp_OrderType": "other",
        "vnp_Locale": "vn",
        "vnp_ReturnUrl": VNPAY_CONFIG["RETURN_URL"],
        "vnp_IpAddr": "127.0.0.1",
        "vnp_CreateDate": datetime.now().strftime("%Y%m%d%H%M%S"),
    }

    sorted_params = sorted(vnp_Params.items())

    # HASH TRÊN GIÁ TRỊ ĐÃ URL-ENCODE
    hash_data = urlencode(sorted_params)
    print(f"Hash data: {hash_data}")

    secure_hash = hmac.new(
        VNPAY_CONFIG["HASH_SECRET"].encode("utf-8"),
        hash_data.encode("utf-8"),
        hashlib.sha512
    ).hexdigest()
    print(f"Secure hash: {secure_hash}")

    query_string = urlencode(sorted_params)

    payment_url = (
        f"{VNPAY_CONFIG['URL']}?"
        f"{query_string}"
        f"&vnp_SecureHashType=HmacSHA512"
        f"&vnp_SecureHash={secure_hash}"
    )

    return payment_url

def generate_momo_url(order_id: int, amount: int, order_info: str):
    endpoint = MOMO_CONFIG["endpoint"]
    partnerCode = MOMO_CONFIG["partnerCode"]
    accessKey = MOMO_CONFIG["accessKey"]
    secretKey = MOMO_CONFIG["secretKey"]
    redirectUrl = MOMO_CONFIG["redirectUrl"]
    ipnUrl = MOMO_CONFIG["ipnUrl"]
    orderId = f"{order_id}_{int(time.time())}"  # Make unique
    requestId = f"{order_id}_{int(time.time())}"  # Make unique
    amount = str(amount)
    orderInfo = order_info
    requestType = "captureWallet"  # For QR payment
    extraData = ""

    rawSignature = f"accessKey={accessKey}&amount={amount}&extraData={extraData}&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={partnerCode}&redirectUrl={redirectUrl}&requestId={requestId}&requestType={requestType}"
    signature = hmac.new(secretKey.encode(), rawSignature.encode(), hashlib.sha256).hexdigest()

    data = {
        "partnerCode": partnerCode,
        "partnerName": "Test",
        "storeId": "MomoTestStore",
        "requestId": requestId,
        "amount": amount,
        "orderId": orderId,
        "orderInfo": orderInfo,
        "redirectUrl": redirectUrl,
        "ipnUrl": ipnUrl,
        "lang": "vi",
        "extraData": extraData,
        "requestType": requestType,
        "signature": signature
    }

    response = requests.post(endpoint, json=data)
    result = response.json()
    if result.get("resultCode") == 0:
        return result["payUrl"]
    else:
        raise HTTPException(status_code=400, detail=f"MoMo error: {result.get('message')}")

@router.post("/create-payment-url")
def create_payment_url(request: CreatePaymentRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        order_id = request.order_id
        payment_method = request.payment_method
        print("Received order_id:", order_id, "user:", current_user.id, "method:", payment_method)
        order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        print("Order status:", order.status)
        if order.status != "PENDING":
            raise HTTPException(status_code=400, detail="Order is not in pending status")

        amount = int(order.total_price)
        order_info = f"Thanh toan don hang {order_id}"

        if payment_method == "VNPAY":
            payment_url = generate_vnpay_url(order_id, amount, order_info)
        elif payment_method == "MOMO":
            payment_url = generate_momo_url(order_id, amount, order_info)
        else:
            raise HTTPException(status_code=400, detail="Invalid payment method")

        return {"payment_url": payment_url}
    except Exception as e:
        print("Error in create_payment_url:", str(e))
        raise

@router.get("/vnpay-return")
def vnpay_return(request: Request, db: Session = Depends(get_db)):
    params = dict(request.query_params)
    vnp_SecureHash = params.pop('vnp_SecureHash', None)

    if not vnp_SecureHash:
        raise HTTPException(status_code=400, detail="Invalid response")

    # Kiểm tra hash
    sorted_params = sorted(params.items())
    hash_data = '&'.join([f"{k}={str(v)}" for k, v in sorted_params])
    secure_hash = hmac.new(VNPAY_CONFIG['HASH_SECRET'].encode(), hash_data.encode(), hashlib.sha512).hexdigest()

    if secure_hash != vnp_SecureHash:
        raise HTTPException(status_code=400, detail="Invalid hash")

    order_id = int(params.get('vnp_TxnRef'))
    response_code = params.get('vnp_ResponseCode')

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if response_code == '00':
        order.status = "PAID"
        db.commit()
        return {"message": "Payment successful", "order_id": order_id}
    else:
        order.status = "FAILED"
        db.commit()
        return {"message": "Payment failed", "order_id": order_id}

@router.post("/vnpay-ipn")
async def vnpay_ipn(request: Request, db: Session = Depends(get_db)):
    params = dict(await request.form())
    vnp_SecureHash = params.pop('vnp_SecureHash', None)

    if not vnp_SecureHash:
        return {"RspCode": "97", "Message": "Invalid response"}

    # Kiểm tra hash tương tự
    sorted_params = sorted(params.items())
    hash_data = '&'.join([f"{k}={str(v)}" for k, v in sorted_params])
    secure_hash = hmac.new(VNPAY_CONFIG['HASH_SECRET'].encode(), hash_data.encode(), hashlib.sha512).hexdigest()

    if secure_hash != vnp_SecureHash:
        return {"RspCode": "97", "Message": "Invalid hash"}

    order_id = int(params.get('vnp_TxnRef'))
    response_code = params.get('vnp_ResponseCode')

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return {"RspCode": "01", "Message": "Order not found"}

    if response_code == '00':
        if order.status != "PAID":
            order.status = "PAID"
            db.commit()
        return {"RspCode": "00", "Message": "Confirm Success"}
    else:
        return {"RspCode": "00", "Message": "Payment failed"}

@router.get("/momo-return")
def momo_return(request: Request, db: Session = Depends(get_db)):
    params = dict(request.query_params)
    order_id_str = params.get("orderId")
    order_id = int(order_id_str.split("_")[0])  # Extract real order_id
    result_code = params.get("resultCode")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if result_code == "0":
        order.status = "PAID"
        db.commit()
        return {"message": "Payment successful", "order_id": order_id}
    else:
        order.status = "FAILED"
        db.commit()
        return {"message": "Payment failed", "order_id": order_id}

@router.post("/momo-ipn")
async def momo_ipn(request: Request, db: Session = Depends(get_db)):
    params = dict(await request.form())
    order_id_str = params.get("orderId")
    order_id = int(order_id_str.split("_")[0])  # Extract real order_id
    result_code = params.get("resultCode")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return {"RspCode": "01", "Message": "Order not found"}

    if result_code == "0":
        if order.status != "PAID":
            order.status = "PAID"
            db.commit()
        return {"RspCode": "00", "Message": "Confirm Success"}
    else:
        return {"RspCode": "00", "Message": "Payment failed"}