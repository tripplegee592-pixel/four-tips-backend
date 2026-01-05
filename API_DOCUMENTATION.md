# Four Tips Backend - Complete Implementation Guide

## 🚀 Overview

This is a fully functional Node.js backend for the Four Tips sports betting platform. It includes user authentication, betting tips management, tipster subscriptions, and admin features.

**Status**: ✅ **Production Ready**

---

## 📋 Features Implemented

### ✅ 1. User Management
- **Register** - Create new user accounts with email/password
- **Login** - JWT-based authentication
- **Get Profile** - Retrieve current user profile (protected)
- **Update Profile** - Modify user information (protected)
- **Change Password** - Secure password updates (protected)
- **Delete Account** - Permanently delete user account (protected)

### ✅ 2. Betting Tips Management (CRUD)
- **Create Tips** - Create new betting predictions (Tipster/Admin only)
- **Read Tips** - Get all tips with filtering (public)
- **Update Tips** - Modify own tips (Tipster/Admin only)
- **Delete Tips** - Remove tips (Tipster/Admin only)
- **Add Reviews** - Users can review tips with ratings and comments
- **Filters**: By sport, tipster, status

**Tip Fields**:
- Title, description, sport, matchDate
- Odds, prediction, isPremium flag
- Status (PENDING, ACTIVE, CLOSED, WON, LOST)

### ✅ 3. Tipster/Subscription System
- **Subscribe to Tipster** - Users can follow tipsters
- **Unsubscribe** - Cancel subscriptions
- **Subscription Plans** - FREE and PREMIUM tiers
- **My Subscriptions** - View tipsters you follow
- **My Subscribers** - View users following you (for tipsters)
- **Check Status** - Verify subscription with specific tipster

### ✅ 4. Admin Features
- **Dashboard** - View platform statistics
- **Manage Users** - List users, change roles, activate/deactivate
- **Manage Tips** - Review all tips, update status, delete problematic content
- **Role-Based Access** - ADMIN only endpoints

### ✅ 5. Middleware & Security
- **JWT Authentication** - Secure token-based auth
- **Role-Based Authorization** - USER, TIPSTER, ADMIN roles
- **Protected Routes** - Auth middleware on sensitive endpoints
- **Password Hashing** - bcrypt encryption for passwords
- **CORS** - Enabled for cross-origin requests

### ✅ 6. Database (Prisma ORM)
**Models Implemented**:
- User (with roles and active status)
- Tip (with sport enum and status tracking)
- Subscription (with plan types and status)
- Review (user ratings and comments)

**Database**: PostgreSQL via Railway

---

## 🛠️ Tech Stack

```
Express.js - Web framework
Prisma - ORM for database
PostgreSQL - Database
JWT - Authentication
Bcrypt - Password hashing
CORS - Cross-origin support
Node.js v24.11.1
```

---

## 📂 Project Structure

```
four-tips-backend/
├── src/
│   ├── app.js                    # Express app config
│   ├── server.js                 # Server entry point
│   ├── utils/
│   │   ├── authMiddleware.js     # JWT & role auth
│   │   └── prisma-client.js      # Prisma client setup
│   └── modules/
│       ├── auth/                 # Authentication
│       │   ├── auth.controller.js
│       │   └── auth.routes.js
│       ├── users/                # User management
│       │   ├── users.controller.js
│       │   ├── users.service.js
│       │   └── users.routes.js
│       ├── tips/                 # Tips management
│       │   ├── tips.controller.js
│       │   ├── tips.service.js
│       │   └── tips.routes.js
│       ├── subscriptions/        # Subscriptions
│       │   ├── subscriptions.controller.js
│       │   ├── subscriptions.service.js
│       │   └── subscriptions.routes.js
│       └── admin/                # Admin features
│           ├── admin.controller.js
│           ├── admin.service.js
│           └── admin.routes.js
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
├── package.json
└── test-api.sh                   # API test script
```

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push
```

### Environment Setup

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-secret-key-here"
PORT=5000
NODE_ENV=development
```

### Start Server

```bash
# Development (with hot reload)
npm run dev

# Production
node src/server.js
```

Server runs on `http://localhost:5000`

---

## 🔌 API Endpoints

### **Authentication** (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create new account |
| POST | `/login` | Login with email/password |

**Register Request**:
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login Request**:
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

### **User Management** (`/api/users`) - Protected

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/profile` | User+ | Get current profile |
| PUT | `/profile` | User+ | Update profile |
| PUT | `/change-password` | User+ | Change password |
| DELETE | `/account` | User+ | Delete account |

**Update Profile**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

### **Tips Management** (`/api/tips`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | None | Get all tips |
| GET | `/:id` | None | Get single tip |
| POST | `/` | Tipster+ | Create tip |
| PUT | `/:id` | Tipster+ | Update tip |
| DELETE | `/:id` | Tipster+ | Delete tip |
| POST | `/:id/reviews` | User+ | Add review |

**Create/Update Tip**:
```json
{
  "title": "Manchester United vs Liverpool",
  "description": "Detailed match analysis",
  "sport": "FOOTBALL",
  "matchDate": "2026-01-15T15:00:00Z",
  "odds": 1.95,
  "prediction": "Manchester United to win",
  "isPremium": false
}
```

**Add Review**:
```json
{
  "rating": 4,
  "comment": "Great tip! Very accurate"
}
```

### **Subscriptions** (`/api/subscriptions`) - Protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/subscribe` | Subscribe to tipster |
| POST | `/unsubscribe` | Unsubscribe from tipster |
| GET | `/my-subscriptions` | View your subscriptions |
| GET | `/my-subscribers` | View your followers |
| GET | `/status/:tipsterId` | Check subscription status |

**Subscribe**:
```json
{
  "tipsterId": "user-id-here",
  "plan": "FREE"
}
```

### **Admin** (`/api/admin`) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Platform statistics |
| GET | `/users` | List all users |
| PUT | `/users/:userId/role` | Change user role |
| PUT | `/users/:userId/activate` | Activate user |
| PUT | `/users/:userId/deactivate` | Deactivate user |
| GET | `/tips` | List all tips |
| PUT | `/tips/:tipId/status` | Update tip status |
| DELETE | `/tips/:tipId` | Delete tip |

---

## 🔐 Authentication

### JWT Token Format

```javascript
{
  userId: "uuid",
  role: "USER|TIPSTER|ADMIN",
  email: "user@example.com",
  iat: timestamp,
  exp: timestamp
}
```

### Authorization Headers

Include JWT in all protected requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access

```
USER    - Basic user features, can review tips
TIPSTER - Can create/manage tips, have subscribers
ADMIN   - Full platform access, can manage everything
```

---

## 📊 Database Schema

### User
```sql
id: UUID PRIMARY KEY
email: VARCHAR UNIQUE
password: VARCHAR (hashed)
firstName: VARCHAR
lastName: VARCHAR
role: ENUM(USER, TIPSTER, ADMIN)
isActive: BOOLEAN DEFAULT true
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
```

### Tip
```sql
id: UUID PRIMARY KEY
title: VARCHAR
description: TEXT
sport: ENUM(FOOTBALL, BASKETBALL, TENNIS, ...)
matchDate: TIMESTAMP
odds: FLOAT
prediction: VARCHAR
isPremium: BOOLEAN
status: VARCHAR (PENDING, ACTIVE, CLOSED, WON, LOST)
tipsterId: UUID FOREIGN KEY -> User
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
```

### Subscription
```sql
id: UUID PRIMARY KEY
userId: UUID FOREIGN KEY -> User
tipsterId: UUID FOREIGN KEY -> User
plan: ENUM(FREE, PREMIUM)
status: ENUM(ACTIVE, INACTIVE, CANCELLED, EXPIRED)
startDate: TIMESTAMP
endDate: TIMESTAMP nullable
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
UNIQUE(userId, tipsterId)
```

### Review
```sql
id: UUID PRIMARY KEY
rating: INT (1-5)
comment: TEXT nullable
userId: UUID FOREIGN KEY -> User
tipId: UUID FOREIGN KEY -> Tip
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
```

---

## 🧪 Testing

### Run API Tests

```bash
./test-api.sh
```

This script tests:
- Health check
- User registration
- User login
- Profile retrieval and updates
- Tip creation (with role validation)
- Get all tips
- Subscriptions
- Admin endpoints

### Manual Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get Profile (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"

# Get All Tips
curl -X GET http://localhost:5000/api/tips
```

---

## 📝 Example Workflow

### 1. User Registration & Login

```bash
# Register
POST /api/auth/register
{
  "email": "john@example.com",
  "password": "secure123",
  "firstName": "John",
  "lastName": "Doe"
}

# Response includes JWT token
Response: {
  "token": "eyJ...",
  "user": { "id": "...", "role": "USER" }
}
```

### 2. Create Betting Tip (as Tipster)

```bash
# First, update user role to TIPSTER (via admin endpoint)
# Then create tip
POST /api/tips
Authorization: Bearer <jwt>
{
  "title": "Arsenal vs Chelsea",
  "description": "Arsenal expected to win based on form",
  "sport": "FOOTBALL",
  "matchDate": "2026-01-20T20:00:00Z",
  "odds": 2.10,
  "prediction": "Arsenal Victory",
  "isPremium": false
}
```

### 3. Subscribe to Tipster

```bash
# User subscribes to Tipster
POST /api/subscriptions/subscribe
Authorization: Bearer <jwt>
{
  "tipsterId": "tipster-user-id",
  "plan": "FREE"
}
```

### 4. Review Tip

```bash
POST /api/tips/{tipId}/reviews
Authorization: Bearer <jwt>
{
  "rating": 5,
  "comment": "Excellent tip, very accurate!"
}
```

---

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "status": 400
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request (missing/invalid data) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcrypt with salt rounds  
✅ **Role-Based Access Control** - Fine-grained permissions  
✅ **Environment Variables** - Sensitive data in .env  
✅ **Input Validation** - Basic validation in controllers  
✅ **Database Constraints** - Enforced at DB level  
✅ **CORS Enabled** - Cross-origin requests allowed  

---

## 📦 Dependencies

```json
{
  "@prisma/client": "^5.20.0",
  "bcrypt": "^6.0.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "prisma": "^5.20.0"
}
```

---

## 🛣️ Future Enhancements

- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] Payment integration for premium subscriptions
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] Tip win/loss tracking
- [ ] Leaderboards
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] Comprehensive logging

---

## 📞 Support

For issues or questions, check:
1. Server logs in terminal
2. Database connection in `.env`
3. Prisma schema validation: `npx prisma validate`
4. JWT secret configuration

---

## 📄 License

MIT

---

**Last Updated**: January 5, 2026  
**Version**: 1.0.0
