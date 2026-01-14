# Synco Backend

This is the backend for the Synco application.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Create a `.env` file in this directory with the following content:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    *Replace `your_mongodb_connection_string` with your actual MongoDB URI.*
    *Replace `your_jwt_secret_key` with a strong secret key.*

## Running the Server

*   **Development mode:**
    ```bash
    npm run server
    ```
    (Ensure you have `nodemon` installed or use `node server.js`)

*   **Production mode:**
    ```bash
    npm start
    ```

## API Endpoints

*   **Auth:**
    *   `POST /api/auth/signup` - Register a new user
    *   `POST /api/auth/login` - Login user
    *   `GET /api/auth/me` - Get current user info

*   **Files:**
    *   `GET /api/files` - Get user's file system
    *   `PUT /api/files` - Update user's file system
