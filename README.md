# 🎓 StudyGen AI — Intelligent AI-Powered Learning Material Platform

> **StudyGen AI** is an end-to-end, full-stack ed-tech platform designed to transform any learning topic into structured, multi-modal study materials in seconds. Powered by Google's **Gemini 2.5 Flash AI**, StudyGen AI creates customized learning roadmaps, in-depth study notes, production-ready code examples, interactive multiple-choice quizzes (MCQs), flip flashcards, and technical viva/interview practice cards tailored to specific difficulty levels and user goals.

---

## 📋 Table of Contents
1. [Overview & Core Value](#-overview--core-value)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [Directory Structure](#-directory-structure)
6. [Detailed System Workflows](#-detailed-system-workflows)
   - [Authentication & JWT Lifecycle](#1-authentication--jwt-lifecycle)
   - [On-Demand AI Generation Pipeline](#2-on-demand-ai-generation-pipeline)
   - [Quiz Attempt & Evaluation Flow](#3-quiz-attempt--evaluation-flow)
   - [AI Fallback Engine](#4-ai-fallback-engine)
7. [Database Schema Design](#-database-schema-design)
8. [Design System & Aesthetics](#-design-system--aesthetics)
9. [API Reference Endpoint Documentation](#-api-reference-endpoint-documentation)
10. [Environment Variables](#-environment-variables)
11. [Getting Started & Local Setup](#-getting-started--local-setup)

---

## 🌟 Overview & Core Value

Traditional learning resources are often static, fragmented, or generic. StudyGen AI solves this by introducing **personalized, on-demand curriculum generation**. 

Whether a student is preparing for a technical job interview, an academic viva exam, or learning a programming framework from scratch, StudyGen AI dynamically adjusts content depth, terminology, code snippets, and questioning style based on two primary dimensions:

1. **Difficulty Level:** `beginner` | `intermediate` | `advanced`
2. **Learning Goal:** `understanding` | `exam` | `interview` | `viva` | `revision`

---

## 🚀 Key Features

* **🧭 Interactive Learning Roadmaps:** Step-by-step structured execution paths breaking down complex topics into sequential milestones.
* **📚 In-Depth Study Notes:** Formatted markdown explanations covering core concepts, real-world utility, and component breakdowns.
* **💻 Production Code Examples:** Syntax-highlighted code implementations demonstrating real-world patterns, error boundaries, and usage.
* **❓ Interactive MCQ Quizzes:** Multiple-choice questions with answer verification, immediate feedback, detailed explanations, and score tracking stored in MongoDB.
* **🃏 Flip Flashcards:** Interactive front/back memory retention cards for rapid revision.
* **🎙️ Technical Viva & Interview Prep Cards:** High-yield technical interview questions paired with structured, multi-part ideal responses.
* **🔑 Google OAuth 2.0 & JWT Authentication:** Secure login via Google credentials with persistent session storage.
* **🛡️ Dynamic AI Fallback Engine:** Guarantees zero downtime by switching to pre-configured structured topic generators if the Gemini API key is missing or quota-throttled.

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Role & Purpose |
| :--- | :--- |
| **React 19** | Core UI library for component-driven SPA user interface |
| **Vite** | Next-generation build tool & high-speed HMR development server |
| **Tailwind CSS v4** | Modern utility-first styling for soft, clean modern design system |
| **React Router v7** | Single-page app client-side routing (`/`, `/studio`, `/auth-success`) |
| **Lucide React** | Scalable, clean vector icons |
| **React Markdown & Remark GFM** | Rendering markdown content with GitHub-flavored markdown extensions |
| **React Syntax Highlighter** | Highlighting code syntax inside study notes and code blocks |
| **Oxlint** | High-performance JavaScript/React linter |

### Backend (Server)
| Technology | Role & Purpose |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Modular REST API server architecture |
| **Google GenAI SDK (`@google/genai`)** | LLM integration using `gemini-2.5-flash` model for JSON generation |
| **MongoDB & Mongoose** | NoSQL document database & ODM schema modeling |
| **JSON Web Tokens (`jsonwebtoken`)** | Token-based stateless authentication |
| **Axios, CORS, Dotenv** | HTTP networking, cross-origin protection, and environment management |

---

## 🏗️ System Architecture & Data Flow

StudyGen AI utilizes a decoupled **Client-Server Architecture** featuring a modular Express backend (`/src/modules`) and a React SPA client.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (React + Vite)                     │
│  ┌──────────────┐   ┌────────────────┐   ┌──────────────────────────┐  │
│  │  HomePage    │   │  StudioPage    │   │ GeneratorWorkspace (UI)  │  │
│  │ (Landing UI) │   │ (Workspace UI) │   │ (Roadmap/Notes/MCQ/etc) │  │
│  └──────┬───────┘   └───────┬────────┘   └────────────┬─────────────┘  │
└─────────┼───────────────────┼─────────────────────────┼────────────────┘
          │                   │                         │
          ▼                   ▼                         ▼
   ┌─────────────────────────────────────────────────────────┐
   │             API Layer (`src/services/api.js`)           │
   │               Bearer JWT Header Injection               │
   └──────────────────────────┬──────────────────────────────┘
                              │ HTTP REST Requests (PORT 5000)
                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              SERVER (Node.js + Express)                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                Central API Router (`api.routes.js`)              │  │
│  └──────┬──────────────┬──────────────────┬─────────────────┬───────┘  │
│         │              │                  │                 │          │
│         ▼              ▼                  ▼                 ▼          │
│   ┌───────────┐  ┌─────────────┐   ┌────────────┐   ┌───────────────┐ │
│   │ Auth Mod  │  │ Study Mod   │   │ Material   │   │ QuizAttempt   │ │
│   │  (OAuth)  │  │ (Sessions)  │   │  Module    │   │    Module     │ │
│   └─────┬─────┘  └──────┬──────┘   └─────┬──────┘   └───────┬───────┘ │
│         │               │                │                  │          │
│         │               ▼                │                  │          │
│         │        ┌──────────────┐        │                  │          │
│         │        │  AI Service  │        │                  │          │
│         │        │(Gemini Flash)│        │                  │          │
│         │        └──────┬───────┘        │                  │          │
└─────────┼───────────────┼────────────────┼──────────────────┼──────────┘
          │               │                │                  │
          ▼               ▼                ▼                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           DATABASE & EXTERNAL SERVICES                 │
│   ┌──────────────────────────┐         ┌───────────────────────────┐   │
│   │     MongoDB Database     │         │   Google Gemini 2.5 API   │   │
│   │ (Users/Sessions/Quiz)    │         │ (Structured JSON Engine)  │   │
│   └──────────────────────────┘         └───────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Directory Structure

```
AI_Material_Gen/
├── DESIGN.md                 # Full Design System Specs & Aesthetic Tokens
├── README.md                 # Complete Project Documentation
├── client/                   # React 19 + Vite Frontend
│   ├── public/               # Static web assets
│   ├── src/
│   │   ├── assets/           # UI media & brand images
│   │   ├── components/       # Reusable UI components
│   │   │   ├── CTA.jsx       # Call to Action banner component
│   │   │   ├── DemoSection.jsx # Interactive landing demo simulator
│   │   │   ├── FeatureCard.jsx # Feature showcase cards
│   │   │   ├── GeneratorWorkspace.jsx # Main material viewer wrapper
│   │   │   ├── Hero.jsx      # Hero banner with topic launcher
│   │   │   ├── Navbar.jsx    # Sticky navigation bar with Auth status
│   │   │   ├── ProtectedRoute.jsx # Auth route wrapper
│   │   │   ├── StudioSidebar.jsx  # History & session manager sidebar
│   │   │   ├── materials/    # Material-specific viewers
│   │   │   │   ├── CodeBlockViewer.jsx # Syntax highlighted code viewer
│   │   │   │   ├── FlashcardGrid.jsx   # Interactive flip card grid
│   │   │   │   ├── McqList.jsx         # MCQ quiz runner & evaluator
│   │   │   │   ├── NotesViewer.jsx     # Markdown notes presenter
│   │   │   │   ├── RoadmapViewer.jsx   # Timeline learning path
│   │   │   │   └── VivaAccordion.jsx   # Accordion interview prep
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global JWT Auth State & User Session
│   │   ├── pages/
│   │   │   ├── AuthSuccess.jsx # OAuth redirect handler page
│   │   │   ├── HomePage.jsx    # Public Landing Page
│   │   │   └── StudioPage.jsx  # Main App Studio Workspace Page
│   │   ├── services/
│   │   │   └── api.js         # Fetch client wrapper with Auth headers
│   │   ├── App.jsx            # React Router & Provider configuration
│   │   └── main.jsx           # App entry point
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                   # Node.js + Express Modular Backend
    ├── src/
    │   ├── app.js            # Express app configuration & middleware
    │   ├── server.js         # HTTP server entry point & MongoDB connection
    │   ├── config/           # Database configuration
    │   ├── middleware/       # Auth guard middleware (`protect.js`)
    │   ├── routes/
    │   │   └── api.routes.js # Central endpoint router
    │   └── modules/          # Feature-based Modular Architecture
    │       ├── ai/
    │       │   └── ai.service.js        # Gemini LLM Integration & Fallback
    │       ├── auth/
    │       │   ├── auth.controller.js  # OAuth & Auth request handlers
    │       │   ├── auth.routes.js      # Auth routes
    │       │   ├── auth.service.js     # User registration & JWT service
    │       │   └── user.model.js       # User Mongoose Schema
    │       ├── material/
    │       │   ├── material.controller.js # Material retrieval handlers
    │       │   ├── material.model.js      # Material Mongoose Schema
    │       │   ├── material.routes.js     # Material routes
    │       │   └── material.service.js    # Material persistence service
    │       ├── quiz-attempt/
    │       │   ├── quizAttempt.controller.js # Quiz submission handler
    │       │   ├── quizAttempt.model.js      # QuizAttempt Schema
    │       │   ├── quizAttempt.routes.js     # Quiz attempt routes
    │       │   └── quizAttempt.service.js    # Quiz scoring service
    │       └── study-session/
    │           ├── studySession.controller.js # Session generation handlers
    │           ├── studySession.model.js      # StudySession Schema
    │           ├── studySession.routes.js     # Session routes
    │           └── studySession.service.js    # Multi-material orchestrator
    ├── package.json
    └── .env.example
```

---

## ⚡ Detailed System Workflows

### 1. Authentication & JWT Lifecycle
```
[User clicks "Sign in with Google"]
            │
            ▼
[Browser -> GET /api/auth/google]
            │
            ▼
[Redirects user to Google OAuth 2.0 Consent Screen]
            │
            ▼
[User authorizes -> Google redirects to GET /api/auth/google/callback?code=...]
            │
            ▼
[Server exchanges code for tokens & fetches user profile]
            │
            ▼
[Server upserts User in MongoDB -> generates JWT (signed with JWT_SECRET)]
            │
            ▼
[Server redirects to Client: http://localhost:5173/auth-success?token=<JWT>]
            │
            ▼
[Client AuthSuccess component extracts token -> saves in localStorage -> populates AuthContext]
```

### 2. On-Demand AI Generation Pipeline
When a user requests materials for a topic (e.g. *"JWT Authentication"*):
1. **Request Dispatch:** Client sends `POST /api/study/generate` payload:
   ```json
   {
     "topic": "JWT Authentication",
     "difficulty": "intermediate",
     "learningGoal": "interview"
   }
   ```
2. **Session Creation:** Server initializes a `StudySession` document in MongoDB with status `'generating'`.
3. **Parallel LLM Orchestration:** Server triggers `studySession.service.js` which invokes specific prompt generators in `ai.service.js`:
   * `generateRoadmapForTopic`
   * `generateNotesForTopic`
   * `generateCodeForTopic`
   * `generateMCQsForTopic`
   * `generateFlashcardsForTopic`
   * `generateVivaForTopic`
4. **Structured Prompt Construction:** `ai.service.js` formats prompts enforcing strict JSON schemas (disabling markdown block wrappers).
5. **Database Material Persistence:** Returned JSON data is stored in `Material` collection indexed under `sessionId`.
6. **Response Delivery:** Server marks session status as `'completed'` and sends response back to client, which updates state and renders tabbed study workspace.

### 3. Quiz Attempt & Evaluation Flow
1. User answers MCQs in `McqList.jsx`.
2. Client submits payload to `POST /api/quiz-attempts`:
   ```json
   {
     "sessionId": "<SESSION_ID>",
     "answers": [
       { "materialId": "<MAT_ID_1>", "selectedAnswer": 0 },
       { "materialId": "<MAT_ID_2>", "selectedAnswer": 1 }
     ]
   }
   ```
3. Server compares `selectedAnswer` against the material's stored `correctAnswer`.
4. Server computes score (`score / total`), saves `QuizAttempt` document, and returns instant evaluation metrics.

### 4. AI Fallback Engine
To ensure high system reliability:
* When `GEMINI_API_KEY` is undefined or Gemini API returns an error/rate limit, `callGeminiJson` catches the exception.
* It automatically redirects to a deterministic mock fallback function.
* The application continues functioning seamlessly, returning high-quality fallback study data without throwing runtime 500 errors to the client.

---

## 🗄️ Database Schema Design

### 1. `User` Schema
```javascript
{
  googleId: { type: String, unique: true, sparse: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  name:     { type: String, required: true },
  avatar:   { type: String, default: '' },
  timestamps: true
}
```

### 2. `StudySession` Schema
```javascript
{
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  topic:        { type: String, required: true, trim: true },
  context:      { type: String, default: '' },
  difficulty:   { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  learningGoal: { type: String, enum: ['understanding', 'exam', 'interview', 'viva', 'revision'], default: 'understanding' },
  status:       { type: String, enum: ['generating', 'completed', 'failed'], default: 'generating' },
  timestamps: true
}
```

### 3. `Material` Schema
```javascript
{
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudySession', required: true, index: true },
  type:      { type: String, enum: ['roadmap', 'notes', 'code', 'mcq', 'flashcard', 'viva'], required: true },
  title:     { type: String, required: true },
  content:   { type: mongoose.Schema.Types.Mixed, required: true }, // Dynamic payload per type
  order:     { type: Number, default: 0 },
  timestamps: true
}
```

### 4. `QuizAttempt` Schema
```javascript
{
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId:   { type: mongoose.Schema.Types.ObjectId, ref: 'StudySession', required: true },
  answers: [{
    materialId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    selectedAnswer: { type: Number, required: true },
    isCorrect:      { type: Boolean, required: true }
  }],
  score:       { type: Number, required: true },
  total:       { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
}
```

---

## 🎨 Design System & Aesthetics

StudyGen AI adheres to a custom **Clean, Soft & Human-Centered Design System** detailed in `DESIGN.md`:

* **Color Palette:**
  * **Primary Canvas:** Pure White (`#FFFFFF`) & Soft Off-White (`#F9FAFB`)
  * **Borders:** Soft Charcoal Border (`#E5E7EB` / `border-gray-200`)
  * **Primary Action CTAs:** Solid Charcoal Pill Buttons (`#18181B` / `bg-zinc-900`) with rounded pill shape (`rounded-full`).
  * **Status Indicators:** Emerald Mint Accent (`#059669` / `bg-emerald-50 text-emerald-700`)
* **Typography:** Clean, high-contrast typography hierarchy using system fonts with high line height for maximum readability.
* **Layout Geometry:** Pill-shaped controls (`rounded-full`), soft cards (`rounded-2xl`), subtle drop shadows (`shadow-sm`). Flat fills with zero noisy gradients or aggressive dark modes.

---

## 📡 API Reference Endpoint Documentation

### Base URL: `http://localhost:5000/api`

#### Authentication Module (`/auth`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/auth/google` | No | Initiates Google OAuth 2.0 flow |
| `GET` | `/auth/google/callback` | No | Google OAuth redirect callback endpoint |
| `GET` | `/auth/me` | **Yes (JWT)** | Retrieves authenticated user profile |
| `POST` | `/auth/logout` | **Yes (JWT)** | Clears user auth state |

#### Study Session Module (`/study`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/study/generate` | Optional | Creates new session & generates all AI materials |
| `GET` | `/study/sessions` | Optional | Fetches all recent study sessions |
| `GET` | `/study/sessions/:id` | Optional | Fetches a single session with all generated materials |
| `DELETE` | `/study/sessions/:id` | Optional | Deletes a study session & linked materials |
| `POST` | `/study/sessions/:id/roadmap` | Optional | On-demand generation of Roadmap material |
| `POST` | `/study/sessions/:id/notes` | Optional | On-demand generation of Notes material |
| `POST` | `/study/sessions/:id/code` | Optional | On-demand generation of Code material |
| `POST` | `/study/sessions/:id/mcq` | Optional | On-demand generation of MCQ materials |
| `POST` | `/study/sessions/:id/flashcard` | Optional | On-demand generation of Flashcards |
| `POST` | `/study/sessions/:id/viva` | Optional | On-demand generation of Viva practice material |

#### Material Module (`/materials`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/materials/session/:sessionId` | Optional | Retrieves materials for a specific session |

#### Quiz Attempt Module (`/quiz-attempts`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/quiz-attempts` | Optional | Submits MCQ answers, calculates score, and saves attempt |
| `GET` | `/quiz-attempts/session/:sessionId` | Optional | Fetches past quiz scores for a study session |

---

## 🔑 Environment Variables

### Server Configuration (`server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/studygen
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth Credentials (Optional for production auth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

### Client Configuration (`client/.env`)
Create a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** or **yarn**
* **MongoDB** (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI)

### Step 1: Clone the Repository
```bash
git clone https://github.com/shahnawaz-codes/studyGen-AI.git
cd studyGen-AI
```

### Step 2: Setup & Start Backend Server
```bash
cd server
npm install
```
* Create `server/.env` based on `server/.env.example`.
* Start the development backend:
```bash
npm run dev
```
The server will start running at `http://localhost:5000`.

### Step 3: Setup & Start Frontend Client
Open a new terminal window:
```bash
cd client
npm install
```
* Create `client/.env` setting `VITE_API_URL=http://localhost:5000/api`.
* Start the Vite development server:
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 📝 License & Summary

StudyGen AI is designed with an enterprise modular architecture, clean separation of concerns, high-resilience AI execution pipelines, and a soft human-centered UI design language.
