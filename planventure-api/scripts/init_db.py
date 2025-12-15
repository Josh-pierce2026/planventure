import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from database import db
from models import User, Trip

def init_database():
    """Initialize the database and create all tables"""
    try:
        with app.app_context():
            print("Creating database tables...")
            db.create_all()
            print("✓ Database tables created successfully!")
            
            # Print created tables
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"\nCreated tables: {', '.join(tables)}")
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        sys.exit(1)

def drop_database():
    """Drop all database tables (use with caution!)"""
    try:
        with app.app_context():
            print("Dropping all database tables...")
            db.drop_all()
            print("✓ All tables dropped!")
    except Exception as e:
        print(f"✗ Error dropping tables: {e}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--drop':
        confirm = input("Are you sure you want to drop all tables? (yes/no): ")
        if confirm.lower() == 'yes':
            drop_database()
            init_database()
        else:
            print("Operation cancelled.")
    else:
        init_database()
