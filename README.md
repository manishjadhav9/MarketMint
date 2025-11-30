# MarketMint

A full-stack marketplace application built with Next.js, Express, and Prisma.

## Setup

### Backend

1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize Database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start Server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:4000`.

### Frontend

1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Development Server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:3000`.

## Features

- **Authentication**: Register, Login, Logout (JWT + Cookies).
- **Products**: List all products, View details, List my products.
- **Selling**: Upload product with multiple images.
- **UI**: Modern design with Tailwind CSS, Shadcn UI, and Framer Motion.
