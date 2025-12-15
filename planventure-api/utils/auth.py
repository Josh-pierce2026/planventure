from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from datetime import timedelta
from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
import jwt

def generate_tokens(user_id: int) -> dict:
    """
    Generate access and refresh tokens for a user.
    
    Args:
        user_id: The user's database ID
        
    Returns:
        Dictionary containing access_token and refresh_token
    """
    access_token = create_access_token(
        identity=user_id,
        expires_delta=timedelta(hours=1)
    )
    refresh_token = create_refresh_token(
        identity=user_id,
        expires_delta=timedelta(days=30)
    )
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }

def get_current_user_id() -> int:
    """
    Get the current authenticated user's ID from the JWT token.
    
    Returns:
        User ID from the token
    """
    return get_jwt_identity()

def token_required(fn):
    """
    Decorator to protect routes that require authentication.
    Usage: @token_required
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)
        except NoAuthorizationError:
            return jsonify({'error': 'Missing authorization token'}), 401
        except InvalidHeaderError:
            return jsonify({'error': 'Invalid authorization header'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': 'Authentication failed'}), 401
    
    return wrapper
