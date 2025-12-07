# 🚗 Project Name: Vehicle Rental System

**Live URL:** [https://assignment-zeta-rose.vercel.app/](https://assignment-zeta-rose.vercel.app/)

<br />

**GitHub Repository:** [https://github.com/tawhidulislam1/Vehicle-Rental-System](https://github.com/tawhidulislam1/Vehicle-Rental-System)

---

## 📌 About the Project

The Vehicle Rental System allows users to browse, rent, and manage vehicles efficiently with a secure backend and real-time updates.

---

## 🚀 Features

* User can order/rent vehicles
* User can post their own vehicles
* User can manage and view bookings
* Secure authentication system
* Responsive and user-friendly interface

---

## 🛠️ Technology Stack

### **Backend:**

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* JWT Authentication
* bcryptjs
* dotenv

### **Development Tools:**

* tsx
* @types/express
* @types/jsonwebtoken
* @types/pg

---

## 📂 Project Structure

```
/src
/controllers
/routes
/middlewares
/services
/config
/utils
server.ts
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/Vehicle-Rental-System.git
cd Vehicle-Rental-System
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

Add required environment variables.

### 4️⃣ Start development server

```bash
npm run dev
```

---

## 📡 API Endpoints (Example)

### **Auth**

* POST `/api/auth/register`
* POST `/api/auth/login`

### **Vehicles**

* POST `/api/vehicles`
* GET `/api/vehicles`
* PUT `/api/vehicles/:id`

### **Bookings**

* POST `/api/bookings`
* GET `/api/bookings/user/:id`

---

## ▶️ Usage

* Register/Login
* Add/Rent vehicles
* View and manage your bookings
