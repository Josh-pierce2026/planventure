# PlanVenture API

A comprehensive Flask-based REST API for managing travel planning with user authentication, trip management, and itinerary generation. Built with SQLAlchemy, JWT authentication, and designed for easy integration with frontend applications.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**

  - Secure registration and login with JWT tokens
  - Password hashing with bcrypt
  - Email validation
  - Token refresh mechanism
  - Protected routes with authentication middleware

- **Trip Management**

  - Create, read, update, and delete trips
  - Store destination, dates, and coordinates
  - Automatic itinerary generation
  - Activity suggestions based on destination
  - User-specific trip isolation

- **Security**

  - JWT-based authentication
  - CORS configuration
  - Environment variable management
  - SQL injection protection via SQLAlchemy ORM

- **Developer Experience**
  - Comprehensive API examples
  - Shell script for testing
  - SQLite database for local development
  - PostgreSQL support for production
  - Docker support via devcontainer

## 🔧 Prerequisites

Before you begin, ensure you have:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **pip** - Python package manager (included with Python)
- **Git** - [Download Git](https://git-scm.com/downloads)
- **API Client** - [Bruno](https://github.com/usebruno/bruno), [Postman](https://www.postman.com/), or curl
- **Code Editor** - [VS Code](https://code.visualstudio.com/) recommended

## 🚀 Installation

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Josh-pierce2026/planventure.git
   cd planventure/planventure-api
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv

   # On macOS/Linux
   source venv/bin/activate

   # On Windows
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### GitHub Codespaces

Click the "Open in GitHub Codespaces" button at the top of this README to start developing in a cloud-based environment with all dependencies pre-installed.

### Docker Development

1. **Open in VS Code with Dev Containers extension**

   ```bash
   code .
   ```

2. **Reopen in container** (Command Palette: "Dev Containers: Reopen in Container")

## ⚙️ Configuration

1. **Create environment file**

   ```bash
   cp .sample.env .env
   ```

2. **Configure environment variables** in `.env`:

   ```env
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here
   DATABASE_URL=sqlite:///planventure.db
   CORS_ORIGINS=http://localhost:3000
   ```

   **Environment Variables:**

   - `SECRET_KEY` - Flask secret key for session management
   - `JWT_SECRET_KEY` - Secret key for JWT token generation
   - `DATABASE_URL` - Database connection string
   - `CORS_ORIGINS` - Comma-separated list of allowed origins

## 🗄️ Database Setup

1. **Initialize the database**

   ```bash
   python scripts/init_db.py
   ```

2. **Reset database (optional)**

   ```bash
   python scripts/init_db.py --drop
   ```

3. **View database** (VS Code SQLite extension)
   - Install "SQLite Viewer" extension
   - Click on `instance/planventure.db` to view tables

### Database Schema

**Users Table:**
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| email | String(120) | Unique, indexed |
| password_hash | String(255) | Bcrypt hashed password |
| created_at | DateTime | Account creation timestamp |
| updated_at | DateTime | Last update timestamp |

**Trips Table:**
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| user_id | Integer | Foreign key to users |
| destination | String(200) | Trip destination |
| start_date | Date | Trip start date |
| end_date | Date | Trip end date |
| latitude | Float | Destination latitude (optional) |
| longitude | Float | Destination longitude (optional) |
| itinerary | Text | Trip itinerary (auto-generated if not provided) |
| created_at | DateTime | Trip creation timestamp |
| updated_at | DateTime | Last update timestamp |

## 📖 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Endpoints

#### Health Check

```http
GET /health
```

Returns API health status and database connection state.

**Response:**

```json
{
  "status": "healthy",
  "database": "connected"
}
```

#### User Registration

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-01-15T10:30:00"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### User Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-01-15T10:30:00"
  }
}
```

#### Refresh Token

```http
POST /auth/refresh
Authorization: Bearer <refresh_token>
```

**Success Response (200):**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "message": "Logout successful. Please discard your tokens."
}
```

#### Create Trip

```http
POST /trips
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "destination": "Paris, France",
  "start_date": "2025-06-15",
  "end_date": "2025-06-22",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "itinerary": "Custom itinerary (optional)"
}
```

**Success Response (201):**

```json
{
  "message": "Trip created successfully",
  "trip": {
    "id": 1,
    "user_id": 1,
    "destination": "Paris, France",
    "start_date": "2025-06-15",
    "end_date": "2025-06-22",
    "coordinates": {
      "latitude": 48.8566,
      "longitude": 2.3522
    },
    "itinerary": "Generated or custom itinerary...",
    "created_at": "2025-01-15T10:30:00"
  },
  "activity_suggestions": [
    "Visit local landmarks and attractions",
    "Try local cuisine and restaurants",
    "..."
  ]
}
```

#### Get All Trips

```http
GET /trips
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "trips": [
    {
      "id": 1,
      "destination": "Paris, France",
      "start_date": "2025-06-15",
      "end_date": "2025-06-22",
      "..."
    }
  ],
  "count": 1
}
```

#### Get Trip by ID

```http
GET /trips/{trip_id}
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "trip": {
    "id": 1,
    "destination": "Paris, France",
    "start_date": "2025-06-15",
    "end_date": "2025-06-22",
    "..."
  }
}
```

#### Update Trip

```http
PUT /trips/{trip_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "destination": "Paris & Nice, France",
  "itinerary": "Updated itinerary..."
}
```

**Success Response (200):**

```json
{
  "message": "Trip updated successfully",
  "trip": {
    "id": 1,
    "destination": "Paris & Nice, France",
    "..."
  }
}
```

#### Delete Trip

```http
DELETE /trips/{trip_id}
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "message": "Trip deleted successfully"
}
```

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**

```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized:**

```json
{
  "error": "Missing authorization token"
}
```

**404 Not Found:**

```json
{
  "error": "Resource not found"
}
```

**409 Conflict:**

```json
{
  "error": "Resource already exists"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Error message details"
}
```

## 📁 Project Structure

```
planventure-api/
├── app.py                  # Flask application factory
├── database.py             # Database initialization
├── requirements.txt        # Python dependencies
├── .sample.env            # Environment variables template
├── PROMPTS.md             # GitHub Copilot development guide
├── middleware/
│   ├── __init__.py
│   └── auth.py            # Authentication middleware
├── models/
│   ├── __init__.py
│   ├── user.py            # User model
│   └── trip.py            # Trip model
├── routes/
│   ├── __init__.py
│   ├── auth.py            # Authentication routes
│   └── trips.py           # Trip management routes
├── utils/
│   ├── __init__.py
│   ├── auth.py            # JWT token utilities
│   ├── password.py        # Password hashing utilities
│   └── itinerary.py       # Itinerary generation utilities
├── scripts/
│   └── init_db.py         # Database initialization script
├── examples/
│   ├── README.md          # API testing examples
│   ├── test_trips.sh      # Automated testing script
│   └── trips_examples.json # Example trip data
└── instance/
    └── planventure.db     # SQLite database (created at runtime)
```

## 🛠️ Development

### Running the Development Server

```bash
# Enable debug mode
export FLASK_DEBUG=1

# Run the server
flask run
```

The API will be available at `http://localhost:5000`

### Code Quality

This project follows Python best practices:

- **PEP 8** style guide compliance
- **Type hints** where applicable
- **Docstrings** for all functions and classes
- **Error handling** with try-except blocks
- **Input validation** on all endpoints

### Common Development Tasks

**Add a new endpoint:**

1. Create route function in appropriate blueprint (`routes/auth.py` or `routes/trips.py`)
2. Add `@require_auth` decorator if authentication is needed
3. Implement business logic
4. Add error handling
5. Test with API client

**Add a new model:**

1. Create model class in `models/` directory
2. Import in `models/__init__.py`
3. Run `python scripts/init_db.py --drop` to recreate tables
4. Update related routes and utilities

**Add authentication to a route:**

```python
from middleware import require_auth, get_current_user

@trips_bp.route('/example')
@require_auth
def example_route():
    user = get_current_user()
    # Your route logic here
```

## 🧪 Testing

### Manual Testing with curl

See `examples/README.md` for detailed curl examples.

### Automated Testing Script

```bash
# First, register and login to get a token
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Run the test script with your token
chmod +x examples/test_trips.sh
./examples/test_trips.sh YOUR_ACCESS_TOKEN
```

### Testing with Bruno

1. Install [Bruno](https://github.com/usebruno/bruno)
2. Create a new collection
3. Import requests from `examples/trips_examples.json`
4. Set environment variable `access_token` with your JWT token
5. Run requests

## 🚢 Deployment

### Production Considerations

1. **Database:** Switch from SQLite to PostgreSQL

   ```bash
   # Install PostgreSQL driver
   pip install psycopg2-binary

   # Update DATABASE_URL in .env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Security:**

   - Use strong `SECRET_KEY` and `JWT_SECRET_KEY`
   - Enable HTTPS
   - Configure CORS for production domains
   - Set `SQLALCHEMY_ECHO=False`
   - Use environment-specific configuration

3. **WSGI Server:** Use Gunicorn instead of Flask development server

   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

4. **Environment Variables:** Never commit `.env` file to version control

### Docker Deployment

```bash
# Build image
docker build -t planventure-api .

# Run container
docker run -p 5000:5000 --env-file .env planventure-api
```

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See `CODE_OF_CONDUCT.md` for community guidelines.

## 🐛 Common Issues

### Issue: Database tables not created

**Solution:** Run `python scripts/init_db.py`

### Issue: JWT token expired

**Solution:** Use the refresh token endpoint to get a new access token

### Issue: CORS errors

**Solution:** Update `CORS_ORIGINS` in `.env` to include your frontend URL

### Issue: Import errors

**Solution:** Ensure virtual environment is activated and dependencies are installed

### Issue: Route trailing slashes

**Solution:** Ensure no trailing slashes in route definitions (especially `/trips` base route)

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Flask-JWT-Extended Documentation](https://flask-jwt-extended.readthedocs.io/)
- [GitHub Copilot](https://gh.io/gfb-copilot)

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🙏 Acknowledgments

- Built with [GitHub Copilot](https://gh.io/gfb-copilot)
- Maintained by GitHub staff and the community
- See `SUPPORT.md` for support information
- See `SECURITY.md` for security policies

---

**Made with ❤️ by the PlanVenture Team**
