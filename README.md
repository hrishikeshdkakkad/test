# Transactions List API with Authentication

A full-featured REST API for managing personal transactions with user authentication, built with NestJS, TypeORM, and SQLite.

## Features

- **User Authentication**: JWT-based authentication system with Passport
- **User Registration & Login**: Secure user account creation and authentication
- **Transaction Management**: Full CRUD operations for transactions
- **Transaction Statistics**: Get summary of income, expenses, and balance
- **User Isolation**: Each user can only access their own transactions
- **Input Validation**: Class-validator for request validation
- **Type Safety**: Full TypeScript support
- **RESTful API**: Clean and intuitive API design

## Tech Stack

- **NestJS**: Progressive Node.js framework
- **TypeORM**: TypeScript ORM for database operations
- **SQLite**: Lightweight database
- **Passport**: Authentication middleware
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Class Validator**: Validation decorators

## Project Structure

```
src/
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   └── users.module.ts
├── transactions/
│   ├── dto/
│   │   ├── create-transaction.dto.ts
│   │   └── update-transaction.dto.ts
│   ├── entities/
│   │   └── transaction.entity.ts
│   ├── transactions.controller.ts
│   ├── transactions.module.ts
│   └── transactions.service.ts
├── app.module.ts
└── main.ts
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd test
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your JWT secret:
```env
JWT_SECRET=your-super-secret-key-change-this
PORT=3000
```

## Running the Application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

The API will be available at:
- API Base URL: http://localhost:3000/api
- Health Check: http://localhost:3000/api

## API Endpoints

All endpoints are prefixed with `/api`

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
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
GET /api/auth/me
Authorization: Bearer <token>
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Transactions

All transaction endpoints require authentication (Bearer token in Authorization header).

#### Create a transaction
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Salary",
  "amount": 5000.00,
  "description": "Monthly salary",
  "category": "Income",
  "transactionType": "income"
}
```

Response:
```json
{
  "id": 1,
  "title": "Salary",
  "amount": "5000.00",
  "description": "Monthly salary",
  "category": "Income",
  "transactionType": "income",
  "date": "2024-01-01T00:00:00.000Z",
  "userId": 1
}
```

#### Get all transactions
```http
GET /api/transactions?skip=0&limit=100
Authorization: Bearer <token>
```

#### Get a specific transaction
```http
GET /api/transactions/{id}
Authorization: Bearer <token>
```

#### Update a transaction
```http
PATCH /api/transactions/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "amount": 150.00
}
```

#### Delete a transaction
```http
DELETE /api/transactions/{id}
Authorization: Bearer <token>
```

#### Get transaction summary
```http
GET /api/transactions/stats/summary
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
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"johndoe","password":"pass123456"}'
```

2. Login:
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"pass123456"}'
```

3. Create a transaction (use token from login response):
```bash
curl -X POST "http://localhost:3000/api/transactions" \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","amount":50.00,"transactionType":"expense","category":"Food"}'
```

4. Get all transactions:
```bash
curl -X GET "http://localhost:3000/api/transactions" \
  -H "Authorization: Bearer <your-token-here>"
```

5. Get transaction summary:
```bash
curl -X GET "http://localhost:3000/api/transactions/stats/summary" \
  -H "Authorization: Bearer <your-token-here>"
```

## Database

The application uses SQLite database (`transactions.db`) which is created automatically on first run. The database includes:

- **users** table: Stores user information with hashed passwords
- **transactions** table: Stores transaction records linked to users

TypeORM is configured with `synchronize: true` for development, which automatically creates/updates tables based on entities. **Set to `false` in production** and use migrations instead.

## Validation

The API uses class-validator decorators for input validation:

- Email format validation
- Required fields validation
- Minimum password length (6 characters)
- Transaction type validation (income/expense only)
- Type checking for numeric values

## Security Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 30 minutes
- Change `JWT_SECRET` in production (use a strong, random string)
- Use environment variables for sensitive configuration
- HTTPS should be used in production
- Consider implementing rate limiting
- The `password` field is excluded from all user responses

## Development

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Building
```bash
npm run build
```

## Module Architecture

The application follows NestJS modular architecture:

- **AuthModule**: Handles authentication, JWT strategy, and user registration
- **UsersModule**: Manages user entities and repository
- **TransactionsModule**: Handles all transaction-related operations
- **AppModule**: Root module that ties everything together

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful GET/PATCH requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication failures
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate email/username

## License

MIT
