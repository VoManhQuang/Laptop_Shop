import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from alembic.config import Config
from alembic import command

def create_migration(message="Auto migration"):
    alembic_cfg = Config("alembic.ini")
    
    try:
        print(f"Đang tạo migration: {message}")
        command.revision(alembic_cfg, autogenerate=True, message=message)
        print("Tạo migration thành công!")
        print("\nĐể apply migration, chạy: python apply_migration.py")
    except Exception as e:
        print(f"Lỗi khi tạo migration: {e}")

if __name__ == "__main__":
    message = sys.argv[1] if len(sys.argv) > 1 else "Auto migration"
    create_migration(message)