# Transactions List API with Authentication

A full-featured REST API for managing personal transactions with user authentication, built with FastAPI and SQLAlchemy.

## Features

- **User Authentication**: JWT-based authentication system
- **User Registration & Login**: Secure user account creation and authentication
- **Transaction Management**: Full CRUD operations for transactions
- **Transaction Statistics**: Get summary of income, expenses, and balance
- **User Isolation**: Each user can only access their own transactions
- **Input Validation**: Pydantic models for request/response validation
- **Interactive Documentation**: Auto-generated API docs with Swagger UI

## Tech Stack

- **FastAPI**: Modern web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database
- **JWT**: JSON Web Tokens for authentication
- **Passlib & Bcrypt**: Password hashing
- **Pydantic**: Data validation

## Project Structure

```
.
├── main.py                 # Main application entry point
├── models.py              # Database models (User, Transaction)
├── schemas.py             # Pydantic schemas for validation
├── database.py            # Database configuration
├── auth.py                # Authentication utilities
├── routers/
│   ├── __init__.py
│   ├── auth.py           # Authentication endpoints
│   └── transactions.py   # Transaction endpoints
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd test
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the development server:
```bash
uvicorn main:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs (Swagger UI): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc

## API Endpoints

### Authentication

#### Register a new user
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=johndoe&password=securepassword
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

#### Get current user
```http
GET /auth/me
Authorization: Bearer <token>
```

### Transactions

All transaction endpoints require authentication (Bearer token in Authorization header).

#### Create a transaction
```http
POST /transactions/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Salary",
  "amount": 5000.00,
  "description": "Monthly salary",
  "category": "Income",
  "transaction_type": "income"
}
```

#### Get all transactions
```http
GET /transactions/?skip=0&limit=100
Authorization: Bearer <token>
```

#### Get a specific transaction
```http
GET /transactions/{transaction_id}
Authorization: Bearer <token>
```

#### Update a transaction
```http
PUT /transactions/{transaction_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "amount": 150.00,
  "description": "Updated description"
}
```

#### Delete a transaction
```http
DELETE /transactions/{transaction_id}
Authorization: Bearer <token>
```

#### Get transaction summary
```http
GET /transactions/stats/summary
Authorization: Bearer <token>
```

Response:
```json
{
  "total_income": 5000.00,
  "total_expense": 1500.00,
  "balance": 3500.00,
  "transaction_count": 10
}
```

## Usage Example with cURL

1. Register a user:
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"johndoe","password":"pass123"}'
```

2. Login:
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=johndoe&password=pass123"
```

3. Create a transaction (use token from login response):
```bash
curl -X POST "http://localhost:8000/transactions/" \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","amount":50.00,"transaction_type":"expense","category":"Food"}'
```

4. Get all transactions:
```bash
curl -X GET "http://localhost:8000/transactions/" \
  -H "Authorization: Bearer <your-token-here>"
```

## Database

The application uses SQLite database (`transactions.db`) which is created automatically on first run. The database includes:

- **users** table: Stores user information
- **transactions** table: Stores transaction records

## Security Notes

- The `SECRET_KEY` in `auth.py` should be changed in production
- Use environment variables for sensitive configuration
- HTTPS should be used in production
- Consider implementing rate limiting
- Add input sanitization for production use

## Development

To modify the database schema:
1. Update models in `models.py`
2. Delete `transactions.db`
3. Restart the application (tables will be recreated)

For production, consider using database migrations with Alembic.

## License

MIT
