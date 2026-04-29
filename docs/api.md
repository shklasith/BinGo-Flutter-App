# BinGo API Documentation

The BinGo API provides endpoints for user authentication, waste classification (via Gemini AI), recycling center lookup, and educational content.

- **Base URL**: `https://qlony.com/api`
- **Content-Type**: `application/json`
- **Auth Strategy**: JWT Bearer Token

---

## Authentication

### 1. Register User
`POST /users/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "greenHero",
  "email": "hero@example.com",
  "password": "MyStr0ngP@ss"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "664a1f...",
    "username": "greenHero",
    "email": "hero@example.com",
    "points": 0,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Login User
`POST /users/login`

**Request Body:**
```json
{
  "email": "hero@example.com",
  "password": "MyStr0ngP@ss"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "username": "greenHero",
    "email": "hero@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## User Profile & Leaderboard

### 3. Get Leaderboard
`GET /users/leaderboard`

Returns the top 10 users by points.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "username": "hero1", "points": 1200 },
    { "username": "hero2", "points": 950 }
  ]
}
```

### 4. Get Profile
`GET /users/profile` (Auth Required)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "username": "greenHero",
    "email": "hero@example.com",
    "points": 150,
    "badges": ["first_scan"],
    "impactStats": {
      "treesSaved": 0.5,
      "plasticDiverted": 12,
      "co2Reduced": 4.2
    }
  }
}
```

---

## Waste Scanning (Gemini AI)

### 5. Scan & Classify Waste
`POST /scan` (Auth Required)

Upload an image to identify waste type and earn points.

**Request:** `multipart/form-data`
- `image`: File (Required)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "itemName": "Plastic Bottle",
    "category": "Recyclable",
    "prepSteps": ["Remove cap", "Rinse", "Crush"],
    "pointsEarned": 10,
    "newTotalPoints": 160
  }
}
```

---

## Recycling Centers

### 6. Find Nearby Centers
`GET /centers/nearby`

Find centers near a specific location.

**Query Parameters:**
- `lat`: Number (Required) - e.g., `6.9271`
- `lng`: Number (Required) - e.g., `79.8612`
- `radius`: Number (Optional) - default `5000` (meters)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "name": "Colombo Recycling Hub",
      "address": "123 Main St",
      "location": { "type": "Point", "coordinates": [79.8612, 6.9271] },
      "acceptedMaterials": ["Recyclable", "E-Waste"]
    }
  ]
}
```

---

## Education

### 7. Get Daily Tip
`GET /education/daily-tip`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "title": "Rinse before recycling",
    "content": "Food residue can contaminate recycling batches."
  }
}
```

---

## API Documentation (Swagger)

The interactive Swagger UI is available at:
- **UI**: `https://qlony.com/api/docs`
- **OpenAPI JSON**: `https://qlony.com/api/docs.json`
