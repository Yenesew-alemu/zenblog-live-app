# ZenBlog: A Full-Stack Blog Platform (React, Node.js, PostgreSQL)

![ZenBlog Screenshot](https://via.placeholder.com/1200x600.png?text=Add+a+Screenshot+of+Your+Live+Homepage+Here)
*A screenshot of the live, deployed ZenBlog homepage, populated with Ethiopian-themed content.*

## Live Demo

*   **Live Frontend:** **`https://zenblog-client.onrender.com`** *(Replace with your actual `zenblog-live-client` URL from Render)*
*   **Live Backend API:** **`https://zenblog-api.onrender.com`** *(Replace with your actual `zenblog-live-api` URL from Render)*

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Technical Challenges & Solutions](#technical-challenges--solutions)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)

## Project Overview

ZenBlog is a complete, full-stack blog platform built from the ground up, designed to showcase a comprehensive understanding of modern web development. The project involved creating a secure backend RESTful API with Node.js and a PostgreSQL database, and a dynamic, responsive frontend by converting a static HTML/CSS template into a feature-rich React Single Page Application (SPA).

This project demonstrates a professional development workflow, including a secure, token-based authentication system, full CRUD (Create, Read, Update, Delete) functionality for content, and a reusable, component-based frontend architecture that is fully deployed and live on the internet.

## Features

### Public-Facing Site
- **Dynamic Homepage:** Features a hero slider, a "trending" section, and multiple, dynamically rendered category-specific sections based on data from the backend.
- **Full Post Viewing:** Users can click on any post to read the full article on a dedicated, server-rendered page, with content formatted from a rich text editor.
- **Category & Author Archives:** Users can browse all posts belonging to a specific category or written by a specific author.
- **Functional Search:** A search bar that redirects to a results page displaying all posts matching the query.
- **Working Contact Form:** Submits data to the backend API.
- **Responsive Design:** A fully responsive layout that adapts seamlessly to desktop, tablet, and mobile screens, including a functional mobile navigation menu.
- **Polished User Experience:** Includes loading spinners, user-friendly error messages, and smooth "Animate on Scroll" (AOS) animations.

### Admin Panel
- **Secure Authentication:** A JWT (JSON Web Token) based login system protects all administrative routes.
- **Post Management (CRUD):** A secure dashboard for creating, reading, updating, and deleting blog posts using a rich text editor (`react-quill`).
- **Category Management (CRUD):** An interface for creating and deleting categories.
- **Image Uploads:** Integrated with Cloudinary to allow admins to upload featured images for posts directly from the editor.

## Technologies Used

- **Frontend:**
  - **React.js (Vite):** A modern, fast framework for building user interfaces.
  - **React Router DOM:** For all client-side routing and navigation.
  - **Axios:** For making HTTP requests to the backend API.
  - **React Quill:** A rich text editor for post content.
  - **Swiper.js:** For the interactive hero slider.
- **Backend:**
  - **Node.js:** A JavaScript runtime for building the server.
  - **Express.js:** A web framework for creating the RESTful API.
  - **PostgreSQL:** A powerful, open-source relational database.
  - **`node-postgres` (`pg`):** The official PostgreSQL driver for Node.js.
  - **JWT (JSON Web Token):** For secure, token-based authentication.
  - **`bcrypt.js`:** For hashing user passwords securely.
  - **CORS:** To manage cross-origin requests between the frontend and backend.
- **Deployment & Database:**
  - **Render:** For hosting both the Node.js backend (as a Web Service) and the React frontend (as a Static Site).
  - **Neon:** For hosting the live, serverless PostgreSQL database.
  - **Cloudinary:** For hosting and delivering user-uploaded images.
  - **Git & GitHub:** For version control and to enable CI/CD (Continuous Integration/Continuous Deployment) with Render.

## Technical Challenges & Solutions

This project involved overcoming several real-world development challenges:

1.  **Challenge:** Converting a static, multi-page HTML template into a dynamic React SPA while preserving its JavaScript-driven interactive features (sliders, animations, mobile navigation).
    *   **Solution:** I created a custom React hook (`useTemplateScripts`) that re-initializes the necessary JavaScript libraries (like AOS and Swiper) and adds event listeners only after the relevant React components have mounted. This solved the problem of interactive elements not working after a client-side route change, which is a common issue in such conversions.

2.  **Challenge:** The original template had inconsistent visual layouts for different category sections. Creating a unique component for each would not have been scalable.
    *   **Solution:** After an initial attempt, I pivoted to a more robust, single-component solution. I identified the most common layout pattern and created one master `CategorySection.jsx` component. I then debugged and resolved CSS specificity issues by creating more general, reusable style rules, ensuring a consistent and professional look across all categories.

3.  **Challenge:** Deploying a full-stack application with a separate frontend, backend, and database across different cloud services and debugging the inevitable networking and configuration issues.
    *   **Solution:** I successfully migrated the backend from a local MySQL development environment to a live PostgreSQL production environment. I debugged and solved complex, real-world deployment issues, including CORS (Cross-Origin Resource Sharing) policies, IPv6 networking problems between cloud providers (`ENETUNREACH`), and ensuring the secure management of environment variables and database credentials.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
- [MySQL](https://www.mysql.com/) (e.g., via XAMPP)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/[your-github-username]/[your-repo-name].git
    cd [your-repo-name]
    ```
2.  **Switch to the local development branch:**
    ```bash
    git checkout main
    ```
3.  **Setup the Backend:**
    ```bash
    cd server
    npm install
    ```
    - Create a `.env` file in the `/server` directory and add your local MySQL database credentials.
    - Run the provided SQL scripts to create the tables and add sample data.
4.  **Setup the Frontend:**
    ```bash
    cd ../client
    npm install
    ```
5.  **Run the Application:**
    - In one terminal, run the backend server: `cd server && npm start`
    - In another terminal, run the frontend client: `cd client && npm run dev`
    - The application will be available at `http://localhost:5173`.

## Screenshots

*(It's highly recommended to replace these placeholders with your actual screenshots)*

**Homepage:**
![Homepage Screenshot](https://via.placeholder.com/800x450.png?text=Add+a+Screenshot+of+Your+Homepage+Here)

**Admin Login Page:**
![Login Screenshot](https://via.placeholder.com/800x450.png?text=Add+a+Screenshot+of+Your+Login+Page+Here)

**Admin Dashboard (Manage Posts):**
![Dashboard Screenshot](https://via.placeholder.com/800x450.png?text=Add+a+Screenshot+of+Your+Admin+Dashboard+Here)

**Single Post Page:**
![Single Post Screenshot](https://via.placeholder.com/800x450.png?text=Add+a+Screenshot+of+Your+Single+Post+Page+Here)