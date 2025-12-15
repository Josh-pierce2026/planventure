from flask import Blueprint, request, jsonify
from database import db
from models import User
from utils import hash_password, generate_tokens
from email_validator import validate_email, EmailNotValidError
from middleware import require_auth, get_current_user

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    """
    Register a new user.
    Expected JSON: { "email": "user@example.com", "password": "secure_password" }
    """
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Validate email format
        try:
            validated_email = validate_email(email, check_deliverability=False)
            email = validated_email.normalized
        except EmailNotValidError as e:
            return jsonify({'error': f'Invalid email: {str(e)}'}), 400
        
        # Validate password strength
        if len(password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user
        new_user = User(email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate tokens
        tokens = generate_tokens(new_user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': new_user.to_dict(),
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token']
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    """
    Login user.
    Expected JSON: { "email": "user@example.com", "password": "secure_password" }
    """
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate JWT tokens
        tokens = generate_tokens(user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token']
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """
    Refresh access token using refresh token.
    Requires refresh token in Authorization header.
    """
    from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
    from datetime import timedelta
    
    try:
        # This will verify the refresh token
        jwt_required(refresh=True)()
        
        user_id = get_jwt_identity()
        new_access_token = create_access_token(
            identity=user_id,
            expires_delta=timedelta(hours=1)
        )
        
        return jsonify({
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Token refresh failed: {str(e)}'}), 401

@auth_bp.route('/me', methods=['GET'])
@require_auth
def get_profile():
    """
    Get current user's profile.
    Requires valid JWT token in Authorization header.
    """
    user = get_current_user()
    return jsonify({
        'user': user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@require_auth
def logout():
    """
    Logout user (client should discard tokens).
    Requires valid JWT token in Authorization header.
    """
    return jsonify({
        'message': 'Logout successful. Please discard your tokens.'
    }), 200
