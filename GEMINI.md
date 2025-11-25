# GEMINI.md

## Project Overview

This project is a modern, full-stack e-commerce platform named **M-TurboPlay**, designed for gaming enthusiasts. It features a comprehensive marketplace for digital gaming products, Roblox items, and gaming accessories.

**Key Technologies:**

*   **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui, React Router, React Query.
*   **Backend:** Node.js, Express.js, Stripe for payments.
*   **Database:** Supabase (PostgreSQL).
*   **Deployment:** Docker, Nginx.

**Architecture:**

The application follows a client-server architecture:

*   The **frontend** is a single-page application (SPA) built with React, responsible for the user interface and client-side logic.
*   The **backend** is a Node.js server using Express.js, which handles payment processing with Stripe and potentially other API endpoints.
*   **Supabase** is used as the backend-as-a-service (BaaS) for database storage, authentication, and file storage.

## Building and Running

### Development

1.  **Install Dependencies:**
    ```bash
    npm install
    cd server
    npm install
    cd ..
    ```

2.  **Configure Environment:**
    Create `.env` files for both the frontend and backend as described in the `README.md`.

3.  **Run the Application:**
    *   **Start Backend Server:**
        ```bash
        cd server
        npm start
        ```
        The backend will run on `http://localhost:3001`.

    *   **Start Frontend Development Server:**
        ```bash
        npm run dev
        ```
        The frontend will run on `http://localhost:5555`.

### Production

*   **Build Frontend:**
    ```bash
    npm run build
    ```

*   **Preview Production Build:**
    ```bash
    npm run preview
    ```

### Linting

*   **Lint Code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling, with Shadcn/ui for UI components.
*   **State Management:** Client-side state is managed with React Context API and server state with React Query.
*   **Routing:** Client-side routing is handled by React Router.
*   **Code Quality:** ESLint is used for linting.
*   **Database:** The database schema is managed with SQL, and Supabase is used for the database, authentication, and storage.
*   **API:** The backend exposes a RESTful API for payment processing.
