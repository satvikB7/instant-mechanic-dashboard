# Instant Mechanic Dashboard

A full-stack dashboard for managing customers, bookings, vehicles, mechanics, and services for a mechanic service platform.

## Project Overview

This project was built as part of a Full Stack Developer Intern task.

The dashboard allows users to:

* View dashboard statistics
* Manage customers
* View customer details
* Manage bookings
* View booking details
* Manage vehicles
* Manage mechanics
* View mechanic details
* View services
* Login securely
* Switch between light and dark mode

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* TypeScript
* JWT

### Database

* PostgreSQL

### Tools

* Git
* GitHub
* VS Code

## Architecture

```text
Frontend
   ↓
REST API
   ↓
Backend
   ↓
PostgreSQL
```

The frontend is built with React and communicates with the Express backend using REST APIs.

The backend handles the application logic and database operations.

PostgreSQL is used to store the application data.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/satvikB7/instant-mechanic-dashboard.git
cd instant-mechanic-dashboard
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=instant_mechanic
DB_USER=postgres
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 6. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Environment Variables

The backend requires:

* `PORT`
* `DB_HOST`
* `DB_PORT`
* `DB_NAME`
* `DB_USER`
* `DB_PASSWORD`
* `JWT_SECRET`

The actual `.env` file is not committed to GitHub.

## API Documentation

Main API endpoints:

```text
GET /api/customers
GET /api/customers/:id

GET /api/bookings
GET /api/bookings/:id

GET /api/vehicles

GET /api/mechanics
GET /api/mechanics/:id

GET /api/services
```

## Deployment

The frontend and backend will be deployed separately.

The deployment details and live URLs will be added here after deployment.

## AI Usage

I used AI tools as development assistance during the project.

### AI Tools Used

* ChatGPT
* Claude
* Grok

### Usage

AI was used for:

* Understanding implementation approaches
* Debugging errors
* Getting suggestions
* Reviewing parts of the code
* Improving development workflow

I personally worked on the project architecture, feature implementation, frontend and backend integration, routing, API integration, database integration, UI decisions, debugging, testing, and final modifications.

AI suggestions were reviewed and modified before being used in the project.
