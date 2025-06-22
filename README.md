# MediCare App - 4-6 Hour Assessment

## Live Demo (UI only): https://meds-buddy-check.lovable.app/

## Current State of the codebase

This is a React medication management app with dual user roles (patients/caretakers). Currently features:

- Role-based dashboard system for each user account with runtime switching (for simplcity)

- UI for medication tracking with calendar visualization

- Mock data for streaks, adherence rates, and medication logs

- Photo upload interface for medication proof

- Notification settings UI (non-functional)

- All data is stored in local state (no persistence)

## Core Implementation Tasks

### Phase 1 (Required - 4 hours):

- Supabase authentication setup
- Basic CRUD for adding medications
- Basic CRUD for marking medication taken for the day
- Connect one dashboard to real data

### Phase 2 (Optional - 2 hours):

- Caretaker-patient real time updates
- Basic adherence tracking

### Phase 3 (Bonus):

- File uploads

**Provided:**

- UI components and styles

## Required Features:

1. User login/signup with Supabase Auth
2. Add medications (name, dosage, frequency)
3. View medication list
4. Mark medication as taken today
5. Simple adherence percentage display

## Technical Requirements:

- Use provided React + TypeScript template
- Integrate Supabase for auth and database
- Use React Query for data fetching
- Implement error handling
- Clean, readable code

## Other Requirements:

- Use Git with meaningful commits
- Implement proper form validation
- Handle loading and error states consistently
- Write at least 2-3 meaningful tests using vitest
- Include a README with setup instructions

## Technical Challenges:

**Include:**

- Optimistic updates using react query
- Proper TypeScript generics usage

## Deployment Bonus:

Deploy to Vercel/Netlify

## We will evaluate:

- Code organization and architecture decisions
- Error handling and edge cases
- TypeScript usage (proper typing, no `any`)
- Component composition and reusability
- State management approach
- Performance considerations (unnecessary re-renders)
- Security awareness (input sanitization)

# MediCare App

## Overview

MediCare is a React medication management app with dual user roles (patients/caretakers). It supports medication tracking, adherence streaks, and real-time caretaker-patient updates using a Node.js/Express backend with SQLite.

## Local Setup Instructions

### 1. **Clone the Repository**

sh
git clone https://github.com/your-username/meds-buddy-check.git
cd meds-buddy-check

### 2. **Install Dependencies**

#### Backend

sh
cd backend
npm install

#### Frontend

sh
cd ../
npm install

### 3. **Start the SQLite Database**

No manual step needed; the database is created automatically on backend start.

### 4. **Start the Backend Server**

sh
cd backend
npm start

- The backend runs on [http://localhost:3001](http://localhost:3001) by default.

### 5. **Start the Frontend**

sh
cd ..
npm start

- The frontend runs on [http://localhost:3000](http://localhost:3000) by default.

## Authentication

- The app uses a simple authentication system (see '/backend/middleware/authMiddleware.js').
- For demo/testing, you may need to register a user via the API or use a seeded user.

## Features

- Patient & caretaker dashboards
- Add, view, and mark medications as taken
- Adherence streaks and monthly rate
- Real-time updates (Socket.IO)
- SQLite persistence

## Environment Variables

If needed, create a '.env' file in the backend for custom configuration (e.g., JWT secret).

## Running Tests

sh
npm run test

or for backend:
sh
cd backend
npm run test

## Notes

- Make sure ports 3000 (frontend) and 3001 (backend) are available.
- For real-time features, both frontend and backend must be running.
- If you encounter CORS issues, check backend CORS settings.

## Build & Deploy

To build the frontend for production:
sh
npm run build

Deploy the 'build' folder to your preferred static hosting.
