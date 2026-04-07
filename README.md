# 🧠 AI UX Research Synthesizer

## 🚀 Overview
The **AI UX Research Synthesizer** is a full-stack application that transforms raw user research notes into structured insights using AI.

Instead of manually analyzing interviews, this tool automatically generates:
- Clear summaries  
- Key themes  
- Actionable UX insights  

Designed for UX researchers, product designers, and teams who want faster, data-driven decisions.

---

## ✨ Features
- 📝 Input raw research notes
- 🤖 AI-powered summarization
- 🔍 Theme extraction
- 💡 Actionable insights generation
- 📁 Save and manage research projects
- ⚡ Real-time frontend (React + Vite)
- 🌐 REST API (Flask backend)

---

## 🏗️ Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Flask
- Python

### Database
- PostgreSQL

### AI Integration
- OpenAI API

### DevOps
- Docker

---

## 🔄 How It Works (Data Flow)

1. User enters research notes in the UI  
2. React sends a POST request → `/summarize`  
3. Flask backend processes the request  
4. AI generates structured output (summary, themes, insights)  
5. Data is saved in PostgreSQL  
6. Results are returned and displayed in the UI  
