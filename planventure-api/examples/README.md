# PlanVenture API Testing Examples

## Getting Started

### 1. First, register and login to get an access token:

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Save the `access_token` from the response.

### 2. Test Trip Routes

#### Create a Trip

```bash
curl -X POST http://localhost:5000/trips \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @examples/trips_examples.json
```

Or use specific examples:

```bash
# Full trip with itinerary
curl -X POST http://localhost:5000/trips \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris, France",
    "start_date": "2025-06-15",
    "end_date": "2025-06-22",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "itinerary": "Day 1: Eiffel Tower..."
  }'
```

#### Get All Trips

```bash
curl -X GET http://localhost:5000/trips \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Specific Trip

```bash
curl -X GET http://localhost:5000/trips/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Update a Trip

```bash
curl -X PUT http://localhost:5000/trips/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"destination": "Paris & Nice, France"}'
```

#### Delete a Trip

```bash
curl -X DELETE http://localhost:5000/trips/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Using the Test Script

Make the script executable and run it:

```bash
chmod +x examples/test_trips.sh
./examples/test_trips.sh YOUR_ACCESS_TOKEN
```

## API Endpoints Summary

| Method | Endpoint         | Description          | Auth Required |
| ------ | ---------------- | -------------------- | ------------- |
| POST   | `/auth/register` | Register new user    | No            |
| POST   | `/auth/login`    | Login user           | No            |
| GET    | `/auth/me`       | Get current user     | Yes           |
| POST   | `/auth/logout`   | Logout user          | Yes           |
| GET    | `/trips`         | Get all user's trips | Yes           |
| POST   | `/trips`         | Create new trip      | Yes           |
| GET    | `/trips/:id`     | Get specific trip    | Yes           |
| PUT    | `/trips/:id`     | Update trip          | Yes           |
| DELETE | `/trips/:id`     | Delete trip          | Yes           |
