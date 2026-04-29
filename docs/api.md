# BinGo Full API Documentation

The BinGo API is a RESTful service that powers the BinGo recycling ecosystem. It handles user management, AI-driven waste classification, and location-based discovery of recycling centers.

- **Base URL**: `https://qlony.com/api`
- **Protocol**: HTTPS
- **Authentication**: JWT Bearer Token in `Authorization` header.

---

## 🔐 User Management & Auth

### 1. Register Account
`POST /users/register`
Creates a new profile and starts a session.

**Body:**
```json
{
  "username": "earth_warrior",
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1...",
    "username": "earth_warrior",
    "email": "user@example.com",
    "token": "eyJhbGci..."
  }
}
```

### 2. Login
`POST /users/login`
Authenticates existing users.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```
**Response (200):** Same structure as Register.

### 3. Get Private Profile
`GET /users/profile`
*Requires Authentication*

**Response (200):**
```json
{
  "success": true,
  "data": {
    "username": "earth_warrior",
    "points": 450,
    "impactStats": {
      "treesSaved": 1.2,
      "plasticDiverted": 25,
      "co2Reduced": 8.5
    },
    "badges": ["pioneer", "5_scans"]
  }
}
```

### 4. Global Leaderboard
`GET /users/leaderboard`
Public top 10 rankings.

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "username": "hero_1", "points": 1200 },
    { "username": "earth_warrior", "points": 450 }
  ]
}
```

---

## 📸 Waste Scanning

### 5. Classify Material
`POST /scan`
*Requires Authentication for points*

Uses Gemini 2.0 Flash to analyze waste.

**Request:** `multipart/form-data`
- `image`: File (The photo taken by user)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "classification": {
      "itemName": "Aluminum Can",
      "category": "Recyclable",
      "prepSteps": ["Empty contents", "Rinse", "Crush to save space"],
      "confidence": 0.98
    },
    "pointsEarned": 10,
    "newTotalPoints": 460
  }
}
```

---

## 📍 Recycling Centers

### 6. Find Nearby
`GET /centers/nearby`
Find physical drop-off points using GeoJSON.

**Query Params:**
- `lat`: Number (e.g. 6.9271)
- `lng`: Number (e.g. 79.8612)
- `radius`: Number (Meters, default: 5000)

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "name": "Central Recycling Depot",
      "address": "45 Green Way, Colombo",
      "acceptedMaterials": ["Plastic", "Metal", "Glass"],
      "operatingHours": "Mon-Sat: 08:00 - 18:00"
    }
  ]
}
```

---

## 💡 Education & Tips

### 7. Daily Tip
`GET /education/daily-tip`
Random eco-friendly advice.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "title": "Degradable vs Compostable",
    "content": "Compostable items break down into nutrient-rich soil..."
  }
}
```

### 8. Knowledge Search
`GET /education/search?q=plastic`
Search the tips database.

---

## 🛠 Developer Tools

- **Swagger UI**: [https://qlony.com/api/docs](https://qlony.com/api/docs)
- **Raw Spec**: [https://qlony.com/api/docs.json](https://qlony.com/api/docs.json)
