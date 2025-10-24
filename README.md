# 🚀 SkillSync — Connect, Collaborate, and Grow

**SkillSync** is a full-stack web application that allows users to log in via **Google Authentication**, showcase their skills, and connect with other professionals.  
Built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** with **Firebase Auth** and **JWT-based backend authentication**.

---

## 🌐 Live Demo

👉 [https://second-year-mern-project.onrender.com](https://second-year-mern-project.onrender.com)

---

## 🧠 Features

- 🔐 **Google Authentication** using Firebase  
- 🧾 **JWT Authorization** on the backend  
- 💬 **Live chat system** between users  
- 🧑‍💼 **User profiles** with photo, skills, and bio  
- 🌍 **MongoDB Atlas** cloud database  
- ⚡ **Fully deployed MERN architecture** (frontend + backend + database)

---

## 🏗️ Tech Stack

| Layer | Technologies |
|:------|:--------------|
| **Frontend** | React.js, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (via Mongoose) |
| **Auth** | Firebase Authentication (Google Provider) + JWT |
| **Deployment** | Render (for both client + server) |

---

## 📂 Project Structure
```
skillsync/
│
├── backend/
│ ├── server.js
│ ├── models/
│ │ └── User.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── userRoutes.js
│ │ └── chatRoutes.js
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── firebase.js
│ │ ├── components/
│ │ │ └── Login.js
│ │ └── pages/
│ └── .env
│
└── README.md
```
---
## ⚙️ Environment Variables

### 🔸 Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<encoded_password>@cluster0.xxxxx.mongodb.net/skillsync?retryWrites=true&w=majority
JWT_SECRET=teamup_secret_key
REACT_APP_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
```
### 🔸 Frontend (`/frontend/.env`)
```env
REACT_APP_BACKEND_URL=https://second-year-mern-project.onrender.com
REACT_APP_FIREBASE_API_KEY=<your_firebase_api_key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
```
## 🧩 Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/skillsync.git
cd skillsync
```
### 2️⃣ Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```
### 3️⃣ Run locally
Open two terminals:
```bash
# Terminal 1
cd backend
npm start

# Terminal 2
cd frontend
npm start
```
Then visit:
👉 http://localhost:3000





