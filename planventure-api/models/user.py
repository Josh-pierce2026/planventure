from datetime import datetime
from database import db
from utils.password import hash_password, verify_password

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password: str):
        """Hash and set the user's password"""
        self.password_hash = hash_password(password)
    
    def check_password(self, password: str) -> bool:
        """Verify the user's password"""
        return verify_password(password, self.password_hash)
    
    def to_dict(self):
        """Convert user object to dictionary (excluding password_hash)"""
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
