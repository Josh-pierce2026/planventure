from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
from models import User
import jwt

def require_auth(fn):
    """
    Decorator to protect routes that require authentication.
    Usage: @require_auth
    
    This will verify the JWT token and ensure the user exists in the database.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            # Verify JWT token is present and valid
            verify_jwt_in_request()
            
            # Get user ID from token
            user_id = get_jwt_identity()
            
            # Verify user still exists in database
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Call the original function
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
            return jsonify({'error': f'Authentication failed: {str(e)}'}), 401
    
    return wrapper

def get_current_user():
    """
    Get the current authenticated user from the JWT token.
    Must be called within a request context with a valid JWT token.
    
    Returns:
        User object or None if not authenticated
    """
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        return User.query.get(user_id)
    except:
        return None
