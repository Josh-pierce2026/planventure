from flask import Blueprint, request, jsonify
from database import db
from models import Trip, User
from middleware import require_auth, get_current_user
from datetime import datetime
from utils.itinerary import generate_default_itinerary, generate_activity_suggestions

trips_bp = Blueprint('trips', __name__, url_prefix='/trips')

@trips_bp.route('', methods=['GET'])
@require_auth
def get_trips():
    """
    Get all trips for the current user.
    """
    try:
        user = get_current_user()
        trips = Trip.query.filter_by(user_id=user.id).all()
        
        return jsonify({
            'trips': [trip.to_dict() for trip in trips],
            'count': len(trips)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch trips: {str(e)}'}), 500

@trips_bp.route('/<int:trip_id>', methods=['GET'])
@require_auth
def get_trip(trip_id):
    """
    Get a specific trip by ID.
    """
    try:
        user = get_current_user()
        trip = Trip.query.filter_by(id=trip_id, user_id=user.id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        return jsonify({'trip': trip.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch trip: {str(e)}'}), 500

@trips_bp.route('', methods=['POST'])
@require_auth
def create_trip():
    """
    Create a new trip.
    Expected JSON: {
        "destination": "Paris, France",
        "start_date": "2025-01-15",
        "end_date": "2025-01-22",
        "latitude": 48.8566,
        "longitude": 2.3522,
        "itinerary": "Day 1: Eiffel Tower..." (optional - will auto-generate if not provided)
    }
    """
    try:
        user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['destination', 'start_date', 'end_date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse dates
        try:
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Validate date logic
        if end_date < start_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        # Generate default itinerary if not provided
        itinerary = data.get('itinerary')
        if not itinerary:
            itinerary = generate_default_itinerary(
                data['destination'],
                start_date,
                end_date
            )
        
        # Create new trip
        new_trip = Trip(
            user_id=user.id,
            destination=data['destination'],
            start_date=start_date,
            end_date=end_date,
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            itinerary=itinerary
        )
        
        db.session.add(new_trip)
        db.session.commit()
        
        # Get activity suggestions
        suggestions = generate_activity_suggestions(data['destination'])
        
        return jsonify({
            'message': 'Trip created successfully',
            'trip': new_trip.to_dict(),
            'activity_suggestions': suggestions
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create trip: {str(e)}'}), 500

@trips_bp.route('/<int:trip_id>', methods=['PUT'])
@require_auth
def update_trip(trip_id):
    """
    Update an existing trip.
    """
    try:
        user = get_current_user()
        trip = Trip.query.filter_by(id=trip_id, user_id=user.id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields if provided
        if 'destination' in data:
            trip.destination = data['destination']
        
        if 'start_date' in data:
            try:
                trip.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid start_date format. Use YYYY-MM-DD'}), 400
        
        if 'end_date' in data:
            try:
                trip.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid end_date format. Use YYYY-MM-DD'}), 400
        
        # Validate date logic
        if trip.end_date < trip.start_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        if 'latitude' in data:
            trip.latitude = data['latitude']
        
        if 'longitude' in data:
            trip.longitude = data['longitude']
        
        if 'itinerary' in data:
            trip.itinerary = data['itinerary']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Trip updated successfully',
            'trip': trip.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update trip: {str(e)}'}), 500

@trips_bp.route('/<int:trip_id>', methods=['DELETE'])
@require_auth
def delete_trip(trip_id):
    """
    Delete a trip.
    """
    try:
        user = get_current_user()
        trip = Trip.query.filter_by(id=trip_id, user_id=user.id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        db.session.delete(trip)
        db.session.commit()
        
        return jsonify({'message': 'Trip deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete trip: {str(e)}'}), 500
