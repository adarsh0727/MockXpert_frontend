#  MockXpert – Your AI-Powered Mock Interview Platform

MockXpert is an intelligent web platform designed to simulate real-life interview scenarios using pre-hosted Large Language Models (LLMs) like OpenAI's ChatGPT. It also offers a resume analysis tool and feedback mechanisms to help users prepare more efficiently and confidently for job interviews.

---

##  Project Overview

*MockXpert* provides:

- *Interactive mock interviews* powered by AI  
- *Resume analysis* with actionable insights  
- *Performance analytics and scores* to improve interview skills  
- *User profiles* to track interview sessions and progress  
- *Authentication system* with secure login/signup  
- *Dashboard* to manage interview history and feedback  

This project is ideal for students, professionals, and job seekers who want to sharpen their interview skills through realistic, data-driven mock sessions.



##  Features


| Feature              | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| AI Mock Interviews    | Interactive question-answer simulation with GPT-based responses             |
| Resume Analyser       | Upload and get feedback on resume formatting, keywords, and structure       |
| Profile Portal        | View personal info, performance scores, and interview history               |
| Real-time Scoring     | Analyze fluency, accuracy, clarity, and relevance of your responses         |
| Secure Auth           | Login/signup with JWT-based authentication                                  |
| User Dashboard        | Central hub with personalized performance summaries                         |
| UI Components         | Reusable modular components with Tailwind CSS and Radix UI                  |




## Folder Structure (Frontend)


MockXpert_Frontend/
├── public/            
├── src/                        # Main source code
│   ├── assets/                # Static images, logos, etc.
│   ├── components/            # Reusable components
│   │   ├── interviewPage/
│   │   │   ├── ConservationPanel.jsx
│   │   │   ├── InterviewHeader.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── ResponsePanel.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── profilePage/
│   │   │   ├── InterviewStats.jsx
│   │   │   └── PersonalInfo.jsx
│   │   ├── ResumeAnalyser/
│   │   │   ├── AnalysisStatus.jsx
│   │   │   ├── loader.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   └── ResultTabs/
│   │   └── ui/
│   │   ├── Feature.jsx
│   │   ├── Footers.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Testimonial.jsx
│   ├── hooks/                 # Custom React hooks
│   │   └── use-mobile.js
│   ├── lib/                   # API and utility functions
│   │   ├── axios.js
│   │   └── utils.js
│   ├── pages/                 # Page components for routing
│   │   ├── Homepage.jsx
│   │   ├── InterviewFormPage.jsx
│   │   ├── InterviewPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PortalPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ResourcePage.jsx
│   │   └── ResumeAnalysisPage.jsx
│   ├── store/                 # Zustand or global state
│   │   ├── useAuthStore.js
│   │   ├── useFormStore.js
│   │   └── useInterviewStore.js
│   ├── App.jsx
│   ├── index.css
│   ├── Layout.jsx
│   └── main.jsx
├── .env.production            # Environment variables for production
├── components.json            # (Possibly Chakra or Storybook-related)
├── eslint.config.js
├── index.html
├── jsconfig.json
├── jsconfig.app.json
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js             # Vite config with base path



## ⚙ Tech Stack

### 💻 Frontend
- *React.js*
- *Shadcn/UI*
- *Vite* as bundler
- *Tailwind CSS* for styling
- *Radix UI* for accessible UI primitives
- *Zustand* for global state management

### ☁ Backend (planned)
- *Node.js* + *Express*
- *MongoDB* for data storage (user, sessions, resume, results)
- *Socket.io* for real-time interview interaction (future)
- *JWT* for authentication

###  AI Integration
- *OpenAI / GPT* for:
  - Mock interview simulation
  - Resume feedback generation
  - Scoring logic based on language and context understanding

---

##  Installation & Setup

bash
# Clone the repository
git clone https://github.com/your-username/mockxpert.git

# Install dependencies
cd frontend
npm install

# If vite isn't recognized
npm install -g vite

# Run development server
npm run dev

##  Contributors

###  Team HackOps
- *Utsav Gondaliya*
- *Ojaswa Varshney*
- *Adarsh Singh*
