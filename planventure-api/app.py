from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import db
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Basic Flask configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', app.config['SECRET_KEY'])
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour in seconds
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 2592000  # 30 days in seconds

# SQLAlchemy configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///planventure.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True  # Set to False in production

# Initialize extensions with app
db.init_app(app)
jwt = JWTManager(app)

# CORS configuration
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000')
CORS(app, 
     resources={r"/*": {"origins": cors_origins.split(',')}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Import models after db initialization
from models import User, Trip

# Register blueprints
from routes import auth_bp, trips_bp
app.register_blueprint(auth_bp)
app.register_blueprint(trips_bp)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to PlanVenture API"})

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "database": "connected" if db.engine else "disconnected"
    })

# Database tables are created via scripts/init_db.py
# Run: python scripts/init_db.py

if __name__ == '__main__':
    app.run(debug=True)
