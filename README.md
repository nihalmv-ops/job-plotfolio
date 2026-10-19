# Nihal MV — MERN Stack Developer Portfolio

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A high-performance, ATS-optimized, responsive developer portfolio designed with modern aesthetics (dark navy theme, glowing purple accents, glassmorphic navigation, clean typography, and subtle micro-interactions). Built with **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 🌟 Key Features

- **ATS & Recruiter-Friendly Design**: Strict semantic HTML5 structure, descriptive headings, accessible forms, OpenGraph metadata, and downloadable selectable-text PDF resume.
- **Pure Tailwind CSS Architecture**: Ultra-fast utility styling following responsive design principles without bloated stylesheets.
- **Sleek Dark Navy & Purple Glow Theme**: Inspired by modern developer workstations, featuring a floating 3D-styled code laptop, pill badges, and smooth hover states.
- **Real Featured Projects**:
  1. **SmartMart AI — Supermarket Management & Billing System**: React.js, JavaScript, Node.js, Express.js, MongoDB ([Live Demo](https://smartsh-ai-hrkd.vercel.app/) | [GitHub](https://github.com/nihalmv-ops/smartshAI))
  2. **TrachMart E-Commerce — TechNest Laptops & Mobiles**: React.js, JavaScript, Vite, Tailwind CSS ([Live Demo](https://trachmartshop.vercel.app/) | [GitHub](https://github.com/nihalmv-ops/trachmartshop))
  3. **GoTravel — Responsive Travel Website**: React.js, JavaScript, Tailwind CSS, HTML5, CSS3 ([Live Demo](https://rgotravel.vercel.app/) | [GitHub](https://github.com/nihalmv-ops/rgotravel))
- **Interactive Contact Form & Backend API**: Robust `POST /api/contact` endpoint with sanitization, field-level validation, and MongoDB persistence.
- **Mobile First & Fully Responsive**: Fluid navigation drawer, responsive grids, and touch-friendly interactive targets.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 19 + Vite
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React & Custom SVG Brand Icons
- **Typography**: Plus Jakarta Sans & JetBrains Mono

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB & Mongoose ODM
- **Middleware**: CORS, dotenv, Express JSON parser

---

## 📁 Project Architecture

```
plotfolio/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg          # Stylized purple 'N' icon
│   │   └── resume.pdf           # Real selectable-text ATS resume
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Glassmorphic header with active link indicator & mobile drawer
│   │   │   ├── Hero.jsx         # 2-column hero with 3D glowing laptop illustration
│   │   │   ├── About.jsx        # Bio, degree status & 3 core professional qualities
│   │   │   ├── Skills.jsx       # Brand icon grid & 4 categorized skill domains
│   │   │   ├── Projects.jsx     # Responsive 3-card project showcase
│   │   │   ├── Education.jsx    # Minimal vertical academic & self-study timeline
│   │   │   ├── Contact.jsx      # Validated contact form & quick connect cards
│   │   │   ├── Footer.jsx       # Copyright, back-to-top button & social links
│   │   │   └── SocialIcons.jsx  # Scalable GitHub and LinkedIn SVG components
│   │   ├── data/
│   │   │   ├── projects.js      # Project metadata & live links
│   │   │   └── skills.jsx       # Categorized skills & SVG tech stack list
│   │   ├── App.jsx              # Main application layout
│   │   ├── index.css            # Tailwind CSS imports & base theme tokens
│   │   └── main.jsx             # React DOM entry point
│   ├── generateResume.js        # Automated ATS resume generator script
│   ├── package.json
│   └── vite.config.js           # Vite config with Tailwind & proxy configuration
│
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── controllers/
│   │   └── contactController.js # Input validation & contact message controller
│   ├── models/
│   │   └── Contact.js           # Mongoose schema for messages
│   ├── routes/
│   │   └── contactRoutes.js     # /api/contact router
│   ├── server.js                # Express application entry point
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── .gitignore
├── package.json                 # Monorepo root scripts (concurrent dev runner)
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance (optional for local testing)

### 1. Clone the Repository
```bash
git clone https://github.com/nihalmv-ops/job-plotfolio.git
cd job-plotfolio
```

### 2. Install Dependencies
Install all packages for root, frontend, and backend:
```bash
# Install root orchestration tools
npm install

# Install frontend dependencies
npm --prefix frontend install

# Install backend dependencies
npm --prefix backend install
```

### 3. Configure Environment Variables
Copy the `.env.example` file in the `backend/` directory:
```bash
cd backend
cp .env.example .env
```
Update `backend/.env` with your settings:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```
*(Note: If `MONGODB_URI` is omitted, the backend runs in decoupled mode so the frontend remains fully functional without server crashes).*

### 4. Run Development Servers
From the root directory, run both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

---

## 📡 API Reference

### Submit Contact Message
- **Endpoint**: `POST /api/contact`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "message": "Hi Nihal, I reviewed your TrachMart project and would like to schedule an interview."
}
```
- **Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Thank you for reaching out! Your message has been received successfully."
}
```

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel
1. Push your code to your GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import `job-plotfolio` and set the **Root Directory** to `frontend`.
4. Deploy! Vercel automatically detects Vite and builds the client.

### Deploying Backend to Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add your Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=<your-atlas-uri>`
   - `CLIENT_URL=<your-vercel-domain>`

---

## 👤 Contact & Connect

- **Developer**: Nihal MV
- **Role**: MERN Stack Developer
- **Location**: Kerala, India
- **GitHub**: [@nihalmv-ops](https://github.com/nihalmv-ops)
- **LinkedIn**: [nihal-mv-dev](https://linkedin.com/in/nihal-mv-dev/)
- **Email**: [nihalmv.dev@gmail.com](mailto:nihalmv.dev@gmail.com)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

