VitaMed Clinic – clinic Management System

Description

VitaMed Clinic is a clinic management system built using the MERN stack (MongoDB, Express.js, React, Node.js).
The system allows patients to book appointments with doctors, manage appointments, and rate doctors after completing visits.

The platform includes three main parts:

- Patient Panel (Frontend)
- Admin / Doctor Panel
- Backend API Server

It is designed to simplify clinic management and improve the experience for both doctors and patients.

---

Features

- User Authentication (JWT)
- Doctor listing and profile management
- Appointment booking system
- Appointment cancellation
- Email appointment reminders
- Doctor rating and review system
- Admin dashboard
- Secure MongoDB database storage

---

Tech Stack

Frontend
React.js + Vite

Backend
Node.js + Express.js

Database
MongoDB

Authentication
JWT (JSON Web Token)

---

Project Structure

VitaMedClinic

admin → Admin / Doctor dashboard
backend → Node.js server and APIs
frontend → Patient website

---

Prerequisites

Make sure you have installed:

- Node.js
- MongoDB
- Git

Official downloads:

Node.js
https://nodejs.org/

MongoDB
https://www.mongodb.com/try/download/community

Git
https://git-scm.com/downloads

---

Installation

Clone the repository

git clone https://github.com/AhmedZAKI12/vitaMed-Clinic.git

Go to project folder

cd vitaMed-Clinic

---

Install Dependencies

Backend

cd backend
npm install

Frontend

cd frontend
npm install

Admin Panel

cd admin
npm install

---

Environment Variables

Inside the backend folder create a file called:

.env

Example:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

---

Running the Project

Start Backend

cd backend
npm start

Server will run on:

http://localhost:5000

---

Start Frontend (Patient Panel)

cd frontend
npm run dev

Runs on:

http://localhost:5173

---

Start Admin Panel

cd admin
npm run dev

---

Topics

Hospital Management
MERN Stack
MongoDB
Express.js
React
Node.js
Appointment System
Healthcare Application

---

Author

Ahmed Zaki

---

License

This project is for educational purposes.
