# ProjectMate — Smart College Project Team & Guide Matching Platform

[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://github.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**ProjectMate** is a full-stack MERN major project web platform designed to solve common challenges faced by B.Tech and engineering students during major project planning, team formation, faculty guide allocation, task management, and progress tracking.

---

## 📌 Problem Statement

Engineering students frequently struggle with:
* Finding project teammates with complementary technical skills required for complex projects.
* Discovering realistic, domain-specific project ideas aligned with current industry standards.
* Forming balanced project teams with clear role divisions (Frontend, Backend, AI/ML, DB).
* Requesting and obtaining approval from faculty guides possessing relevant domain expertise.
* Dividing project workload into manageable tasks and tracking milestone deadlines.
* Integrating GitHub repository activity into academic evaluation dashboards.

---

## 🎯 Objectives

1. **Automate Skill-Based Teammate Recommendation**: Transparently match student profiles against project skill requirements and calculate a Skill Match Percentage.
2. **Streamline Team Formation & Role Allocation**: Facilitate invitation requests, team role assignment (Leader, Fullstack, ML, UI/UX), and member management.
3. **Faculty Guide Matching System**: Provide a searchable faculty directory filtered by expertise and department to handle formal guide requests.
4. **Task & Milestone Management**: Supply a Kanban task board (To Do, In Progress, Completed) and progress milestone timeline.
5. **GitHub Codebase Insights**: Link public GitHub repositories to extract stars, forks, open issues, and commit activity.

---

## 🛠️ Technology Stack

### Frontend
* **React.js** (v18)
* **Vite** (Build tool & development server)
* **React Router DOM** (Client-side routing)
* **Axios** (Centralized API HTTP client)
* **Recharts** (Visual dashboard charts)
* **Lucide React** (Modern iconography)
* **Glassmorphic Custom CSS** (Dark/Light academic dashboard design system)

### Backend
* **Node.js** & **Express.js** (REST API Server)
* **MongoDB** & **Mongoose** (NoSQL Database & Schemas)
* **JWT (JsonWebToken)** (Stateless authentication)
* **bcryptjs** (Secure password hashing)
* **CORS & dotenv** (Security & environment configurations)

---

## 🧠 Smart Teammate Matching Algorithm

The core feature of ProjectMate is the transparent, explainable skill matching algorithm (`utils/matchingAlgorithm.js`).

### Calculation Formula

$$\text{Skill Match Percentage} = \left( \frac{\text{Number of Project Required Skills Matched by Student}}{\text{Total Number of Required Project Skills}} \right) \times 100$$

### Example Scenario
- **Project Requirements**: `React`, `Node.js`, `MongoDB`, `Python`, `NLP` (Total: 5 skills)
- **Student Profile**: `React`, `Node.js`, `MongoDB`, `Python` (Matched: 4 skills)
- **Calculation**: $\frac{4}{5} \times 100 = 80\%$
- **Result Output**:
  ```json
  {
    "matchPercentage": 80,
    "matchedSkills": ["React", "Node.js", "MongoDB", "Python"],
    "missingSkills": ["NLP"]
  }
  ```

---

## 👥 User Roles & Permissions

1. **Student**
   - Create and customize student profile with skill badges and GitHub username.
   - Browse and publish project ideas.
   - Create major projects and specify required technical skills.
   - Access automated **Smart Teammate Recommendations**.
   - Send/accept team invitations and assign team roles.
   - Search faculty directory and send guide requests.
   - Manage task board, milestones, and connect GitHub repositories.

2. **Guide / Faculty**
   - Create faculty profile with domain expertise and department.
   - View, accept, or reject incoming project guide requests from student teams.
   - Monitor assigned teams' progress, tasks, milestones, and GitHub repos.

3. **Admin**
   - System-wide administration console.
   - Manage master skills list, departments, and user activation.
   - View platform dashboard analytics.

---

## 🗄️ Database Schemas

- `User`: Name, email, hashed password, role (`student`, `guide`, `admin`), college, department, year, bio, skills, interests, githubUsername.
- `Project`: Title, description, domain, requiredSkills, teamSize, difficulty, duration, preferredGuideSkills, owner, team, guide, githubRepository, status, progress.
- `ProjectIdea`: Title, description, domain, difficulty, requiredSkills, teamSize, tags, createdBy.
- `Team`: Project ref, leader ref, members (`[{ user, role }]`).
- `TeamRequest`: Sender, receiver, project, message, status (`Pending`, `Accepted`, `Rejected`, `Cancelled`).
- `GuideRequest`: Project, team, student, guide, message, status (`Pending`, `Accepted`, `Rejected`).
- `Task`: Project, title, description, assignedTo, assignedBy, priority, status (`To Do`, `In Progress`, `Completed`), dueDate.
- `Milestone`: Project, title, description, startDate, dueDate, status, progress.
- `Skill`: Name, category, description.

---

## 🌐 API Endpoints Reference

### Authentication
* `POST /api/auth/register` — Register user account
* `POST /api/auth/login` — Login user & return JWT token
* `GET /api/auth/me` — Get logged-in user profile

### Projects & Smart Matching
* `GET /api/projects` — List projects (supports filter & user project queries)
* `POST /api/projects` — Create project & initialize team
* `GET /api/projects/:id` — Get project details & dynamic progress
* `PUT /api/projects/:id` — Update project details
* `GET /api/projects/:projectId/recommend-teammates` — **Skill Match Engine**

### Teams & Requests
* `GET /api/teams/:id` — Get team details & member roles
* `PUT /api/teams/:id` — Assign member roles or remove members
* `POST /api/team-requests` — Send team invitation
* `GET /api/team-requests/received` — List received invites
* `PUT /api/team-requests/:id` — Accept / Decline invite

### Guides & Guide Requests
* `GET /api/guides` — Search faculty guide directory
* `POST /api/guide-requests` — Request faculty guide
* `PUT /api/guide-requests/:id` — Guide accept / reject request

### Tasks & Milestones
* `GET /api/projects/:projectId/tasks` — List project tasks
* `POST /api/projects/:projectId/tasks` — Create task
* `PUT /api/tasks/:id` — Update task status/assignee
* `GET /api/projects/:projectId/milestones` — List milestones
* `POST /api/projects/:projectId/milestones` — Create milestone

### GitHub Integration & Analytics
* `POST /api/projects/:projectId/github` — Link public GitHub repository URL
* `GET /api/projects/:projectId/github` — Fetch stars, forks, languages & commits
* `GET /api/analytics/dashboard` — Platform dashboard analytics

---

## 🔑 Quick Demo Credentials

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student A (Leader)** | `student1@college.edu` | `password123` | Skills: React, Node.js, MongoDB, JS |
| **Student B (Matched Candidate)** | `student2@college.edu` | `password123` | Skills: React, Node.js, MongoDB, Python (80% Match) |
| **Student E (Candidate Candidate)** | `student5@college.edu` | `password123` | Skills: Python, Data Science, NLP, ML |
| **Faculty Guide** | `guide1@college.edu` | `password123` | Dr. Suresh (CSE Department, AI/ML Expertise) |
| **Admin** | `admin@college.edu` | `admin123` | Platform Administrator |

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
* **Node.js** (v18+)
* **npm** or **yarn**
* **MongoDB** running locally (`mongodb://127.0.0.1:27017/projectmate`) or MongoDB Atlas URI.

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Seed the database with sample demo data
npm run seed

# Start development server
npm run dev
```
Backend server will run at `http://localhost:5000`.

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend application will open at `http://localhost:3000`.

---

## 🧪 13-Step Complete Demo Demonstration Scenario

1. **Step 1**: Open frontend at `http://localhost:3000` and click **1-Click Demo: Student A**.
2. **Step 2**: Observe Student A profile with skills `React`, `Node.js`, `MongoDB`, `JavaScript`.
3. **Step 3**: Click **Create Project** -> Create "AI Resume Analyzer" with required skills `React`, `Node.js`, `MongoDB`, `Python`, `NLP`.
4. **Step 4**: Navigate to **Smart Teammate Match** -> System calculates match percentages. Student B is recommended at **80% Skill Match** (`React`, `Node.js`, `MongoDB`, `Python` matched; `NLP` missing).
5. **Step 5**: Click **Send Team Request** to Student B.
6. **Step 6**: Logout and login as **Student B** (`student2@college.edu` / `password123`).
7. **Step 7**: View Pending Team Invitation on Dashboard -> Click **Accept Invitation**.
8. **Step 8**: Navigate to **My Team** -> Confirm Student B is now a team member, and assign role as `Backend & ML Engineer`.
9. **Step 9**: Go to **Faculty Guides** -> Send guide request to **Dr. Suresh**.
10. **Step 10**: Login as **Faculty Guide** (`guide1@college.edu` / `password123`) -> Click **Accept Guide Request**.
11. **Step 11**: Return to Student A -> Open **Task Board** & **Milestones** -> Update task statuses to "Completed".
12. **Step 12**: Go to **GitHub Repository** -> Enter repository URL `https://github.com/facebook/react` -> Click **Connect Repo** to view live stars, forks, languages, and commit log.
13. **Step 13**: Open **Analytics & Insights** -> Observe auto-calculated project progress (65%+).

---

## 📜 License
This project is created for academic major project demonstration purposes.
