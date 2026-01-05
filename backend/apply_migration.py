import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from alembic.config import Config
from alembic import command

def apply_migrations():
    alembic_cfg = Config("alembic.ini")
    
    try:
        print("Đang apply migrations lên database...")
        command.upgrade(alembic_cfg, "head")
        print("✓ Apply migrations thành công!")
    except Exception as e:
        print(f"✗ Lỗi khi apply migrations: {e}")

def downgrade_migration(steps=1):
    alembic_cfg = Config("alembic.ini")
    
    try:
        print(f"Đang rollback {steps} migration(s)...")
        command.downgrade(alembic_cfg, f"-{steps}")
        print("Rollback thành công!")
    except Exception as e:
        print(f"Lỗi khi rollback: {e}")

def show_current():
    """Hiển thị migration hiện tại"""
    alembic_cfg = Config("alembic.ini")
    
    try:
        command.current(alembic_cfg)
    except Exception as e:
        print(f"Lỗi: {e}")

def show_history():
    """Hiển thị lịch sử migrations"""
    alembic_cfg = Config("alembic.ini")
    
    try:
        command.history(alembic_cfg)
    except Exception as e:
        print(f"Lỗi: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        action = sys.argv[1]
        if action == "downgrade":
            steps = int(sys.argv[2]) if len(sys.argv) > 2 else 1
            downgrade_migration(steps)
        elif action == "current":
            show_current()
        elif action == "history":
            show_history()
        else:
            print("Lệnh không hợp lệ. Sử dụng: upgrade, downgrade, current, history")
    else:
        apply_migrations()