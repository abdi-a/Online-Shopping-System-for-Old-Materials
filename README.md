# Online Shopping System for Old Materials

## Project Overview
A full-stack web application for buying and selling reusable materials.
- **Frontend**: Next.js (TypeScript, Tailwind)
- **Backend**: Laravel (API, Sanctum Auth)
- **Database**: MySQL

## Prerequisites
- XAMPP (for MySQL & PHP)
- Composer (for Laravel)
- Node.js & NPM (for Next.js)

## Setup Instructions

### 1. Database Setup (MySQL)
1. Open XAMPP Control Panel and start **Apache** and **MySQL**.
2. Go to `http://localhost/phpmyadmin`.
3. Create a new database named `old_materials_db`.

### 2. Backend Setup (Laravel)
1. Open a terminal in the `/backend` folder.
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and configure your database settings:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=old_materials_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Generate application key:
   ```bash
   php artisan key:generate
   ```
6. Run migrations to create tables:
   ```bash
   php artisan migrate
   ```
7. (Optional) Seed the database with fake data:
   ```bash
   php artisan db:seed
   ```
8. Start the Laravel API server:
   ```bash
   php artisan serve
   ```
   *The API will run at http://127.0.0.1:8000*

### 3. Frontend Setup (Next.js)
1. Open a new terminal in the `/frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root of `/frontend`:
   ```ini
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The Frontend will run at http://localhost:3000*

## API Endpoints
- **POST** `/api/register` - New Account
- **POST** `/api/login` - Login
- **GET** `/api/products` - Browse Items
- **POST** `/api/orders` - Place Order (Buyer)
- **GET** `/api/admin/stats` - Admin Dashboard

## User Roles
1. **Buyer**: Can browse and buy products.
2. **Seller**: Can list products (`role` must be 'seller').
3. **Admin**: Can approve transactions (`role` must be 'admin').
