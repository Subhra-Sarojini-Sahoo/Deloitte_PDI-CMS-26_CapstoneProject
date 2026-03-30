# EventZen 

A Full-Stack Event Management System

---

## 📌 Overview

EventZen is a full-stack web application designed to simplify event planning and service booking. It enables customers to book event services, vendors to manage offerings, and administrators to oversee the entire system.

The system ensures secure access using JWT authentication and enforces role-based functionality for seamless interaction between users.

---

## 🚀 Features

###  Customer

* Browse available services (Venue, Catering, Music, etc.)
* Book services with date, time, attendees, and purpose
* View and manage bookings
* Update attendees and cancel bookings

###  Vendor

* Create and manage services
* Manage locations (venue details)
* View booking requests
* Accept or reject bookings

###  Admin

* View and manage all users
* Monitor services, locations, and bookings
* Maintain system control

---

##  Tech Stack

* **Frontend:** React.js
* **Backend:** Spring Boot (Java)
* **Database:** MySQL
* **Authentication:** JWT
* **Additional Service:** Node.js (Budget Service)
* **Containerization:** Docker & Docker Compose

---

##  Project Structure

```
EventZen/
│
├── eventzen/                  # Spring Boot Backend
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── model/
│
├── eventzen-frontend/         # React Frontend
│   ├── components/
│   ├── pages/
│   └── services/
│
├── eventzen-budget-service/   # Node.js Service (Optional)
│
├── docker-compose.yml
└── .gitignore
```

---

##  Installation & Setup

###  Prerequisites

* Node.js (v16+)
* Java 17+
* MySQL
* Docker (optional but recommended)

---

### ▶️ Option 1: Run with Docker (Recommended)

```bash
docker-compose up --build
```

* Frontend: http://localhost:3000
* Backend: http://localhost:8081

---

Here is your **corrected manual run section** (accurate + submission-ready):

---

### ▶️ Option 2: Run Manually

#### 1. Start MySQL Database

Ensure MySQL is running locally and create the required database:

```bash
CREATE DATABASE eventzen_db;
```

---

#### 2. Backend (Spring Boot)

Before running the backend, update the database configuration in:

```
eventzen/auth-service/src/main/resources/application.properties
```

Change the datasource URL from:

```
spring.datasource.url=jdbc:mysql://mysql:3306/eventzen_db
```

to:

```
spring.datasource.url=jdbc:mysql://localhost:3306/eventzen_db
spring.datasource.username=root
spring.datasource.password=your_password
```

> Note: The host `mysql` is used only in Docker setup. For manual execution, use `localhost`.

Now run the backend:

```bash
cd eventzen/auth-service
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8081
```

---

#### 3. Frontend (React)

```bash
cd eventzen-frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

#### 4. Budget Service

```bash
cd eventzen-budget-service
npm install
npm start
```

---



---

##  Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. All protected APIs use:

```
Authorization: Bearer <token>
```

---

##  User Flow (IMPORTANT)

### 🏠 Step 1: Homepage

* User lands on homepage
* Can explore services or proceed to login/register

---

### 🔑 Step 2: Login / Register

* User logs in with credentials
* Based on role, redirected automatically:

| Role     | Dashboard Route    |
| -------- | ------------------ |
| Customer | Customer Dashboard |
| Vendor   | Vendor Dashboard   |
| Admin    | Admin Dashboard    |

---

### 📊 Step 3: Dashboard Navigation (KEY POINT)

👉 Users **must navigate using dashboard buttons/links**
❌ Direct URL access is discouraged

Each dashboard provides:

* Sidebar navigation
* Quick action buttons
* Summary cards

---

###  Customer Flow

1. Login → Customer Dashboard
2. Click **Explore Services**
3. Select service → Book
4. Go to **My Bookings** to manage

---

###  Vendor Flow

1. Login → Vendor Dashboard
2. Manage services and locations
3. Open **Bookings section**
4. Accept/Reject requests

---

###  Admin Flow

1. Login → Admin Dashboard
2. Manage users, services, bookings
3. Monitor system data

---

##  System Constraints & Validations

* No overlapping bookings for same user
* No double booking for same service/location
* Only CUSTOMER can create bookings
* Vendors can only manage their own services
* Secure role-based access enforced

---

## 📡 API Overview (Sample)

### Authentication

* POST `/auth/register`
* POST `/auth/login`

### Services

* GET `/services`
* POST `/services`

### Bookings

* POST `/bookings`
* GET `/bookings/customer/{id}`
* GET `/bookings/vendor/{id}`

---

# System Constraints and Business Logic (Summary)

* Role-based access control is enforced using JWT authentication (Customer, Vendor, Admin)

* Only **Customers** can create bookings

* Only **Vendors** can manage services and locations

* **Admins** have full system access

* Customers cannot create **overlapping bookings** for the same time

* Services/locations cannot be **double-booked** at the same time

* Booking must include valid:

  * Date
  * Start and end time
  * Attendees
  * Purpose

* Booking lifecycle:

  * PENDING → ACCEPTED / REJECTED
  * Only vendors can update booking status

* Vendors can manage **only their own services and locations**

* All API requests require a **valid JWT token** for protected routes

* Input validation ensures:

  * No empty fields
  * Positive attendee count
  * Valid date and time

* System maintains **data integrity** between users, services, bookings, and locations

* Errors handled using proper HTTP status codes (400, 403, 404)

* Users are expected to navigate through **dashboard UI**, not by directly entering URLs


## 📌 Important Notes

* Always navigate through UI dashboards
* Do not manually change URLs
* Ensure backend is running before frontend
* JWT token must be present for protected routes

---


## 👨‍💻 Author

Subhra Sarojini Sahoo

---
