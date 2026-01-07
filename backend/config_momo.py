# Cấu hình MoMo
MOMO_CONFIG = {
    "partnerCode": "MOMO",  # Thay bằng Partner Code từ MoMo
    "accessKey": "F8BBA842ECF85",  # Thay bằng Access Key từ MoMo
    "secretKey": "K951B6PE1waDMi640xX08PD3vg6EkVlz",  # Thay bằng Secret Key từ MoMo
    "endpoint": "https://test-payment.momo.vn/v2/gateway/api/create",  # Endpoint test
    "redirectUrl": "http://localhost:5173/",  # URL frontend sau thanh toán
    "ipnUrl": "http://localhost:8000/",  # URL backend để MoMo notify
}