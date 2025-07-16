# 📝 IntelliTask: Task & Reminder Assistant

<div align="center">

![IntelliTask Logo](https://img.shields.io/badge/IntelliTask-Task%20Management-blue?style=for-the-badge&logo=checkmarx&logoColor=white)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

**A powerful, modern task management and reminder system built with React and Node.js**

[🚀 Features](#-features) • [🛠️ Installation](#️-installation) • [📱 Usage](#-usage) • [🎨 Screenshots](#-screenshots) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

**IntelliTask** is a comprehensive task management and reminder assistant designed to help individuals and teams organize their daily activities efficiently. With real-time notifications, beautiful UI, and powerful features, IntelliTask makes task management a breeze.

## ✨ Features

### 🎯 Core Features
- **📋 Task Management** - Create, update, delete, and organize tasks with ease
- **⏰ Smart Reminders** - Set custom reminders with email notifications
- **📊 Analytics Dashboard** - Track your productivity with detailed insights
- **🔔 Real-time Notifications** - WebSocket-powered instant notifications
- **⭐ Favorite Tasks** - Mark important tasks as favorites for quick access
- **📂 Categories** - Organize tasks into custom categories
- **👥 User Management** - Secure user authentication and profile management

### 🎨 Modern UI/UX
- **🌙 Dark/Light Theme** - Toggle between beautiful themes
- **📱 Responsive Design** - Works perfectly on all devices
- **🎭 Glassmorphism Effects** - Modern, elegant design with blur effects
- **✨ Smooth Animations** - Delightful micro-interactions and transitions
- **🎨 Beautiful Forms** - Enhanced login, signup, and admin interfaces

### 🔧 Advanced Features
- **📧 Email Notifications** - Automated email reminders for tasks
- **📈 Progress Tracking** - Monitor task completion rates
- **💾 Data Export** - Export tasks and analytics as PDF/CSV
- **🔒 Admin Panel** - Comprehensive admin dashboard for management
- **💬 Feedback System** - User feedback collection and management

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **React Router** - Client-side routing
- **CSS3** - Modern styling with animations and effects
- **WebSocket Client** - Real-time communication
- **React Toastify** - Beautiful notifications

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **WebSocket (ws)** - Real-time bidirectional communication
- **JWT** - Secure authentication
- **Nodemailer** - Email service integration
- **Node Schedule** - Task scheduling

### Database
- **MySQL** - Primary database (PlanetScale ready)
- **PostgreSQL** - Alternative database support (Supabase ready)
- **SQLite** - Development fallback

### Deployment
- **Vercel** - Frontend hosting
- **PlanetScale/Supabase** - Database hosting
- **Docker** - Containerization ready

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL/PostgreSQL** database
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Ranjuna120/Task-Reminder-Assistant--IntelliTask.git
cd Task-Reminder-Assistant--IntelliTask/ITPM-30-main
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, etc.

# Start the backend server
npm start
# or for development
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the React application
npm start
```

### 4. Database Setup
```bash
# Import the database schema
mysql -u your_username -p your_database < ../database/schema.sql

# For PostgreSQL
psql -U your_username -d your_database -f ../database/schema-postgresql.sql
```

## 📱 Usage

### For Regular Users
1. **Sign Up** - Create your account with email verification
2. **Login** - Access your personal dashboard
3. **Create Tasks** - Add tasks with descriptions, due dates, and categories
4. **Set Reminders** - Configure email and push notifications
5. **Track Progress** - Monitor your productivity in the analytics section

### For Administrators
1. **Admin Login** - Access the admin panel with admin credentials
2. **User Management** - View and manage user accounts
3. **Feedback Management** - Review and respond to user feedback
4. **System Analytics** - Monitor application usage and performance

### Default Credentials
```
Admin Account:
Email: admin@gmail.com
Password: admin123

Category Manager:
Email: category@gmail.com
Password: category123
```

## 🎨 Screenshots

### 🏠 Modern Dashboard
- Clean, intuitive interface with task overview
- Real-time notification center
- Quick action buttons and search functionality

### 📝 Task Management
- Beautiful task creation forms with validation
- Drag-and-drop task organization
- Category-based filtering and sorting

### 📊 Analytics Dashboard
- Visual charts and graphs showing productivity metrics
- Task completion trends and statistics
- Performance insights and recommendations

### 🔐 Authentication Pages
- Stunning login and signup forms with glassmorphism effects
- Smooth animations and micro-interactions
- Password strength indicators and validation

## 🌐 API Endpoints

### Authentication
```
POST /auth/api/login          # User login
POST /auth/api/create-account # User registration
POST /auth/api/logout         # User logout
```

### Tasks
```
GET    /api/tasks             # Get all tasks
POST   /api/tasks             # Create new task
PUT    /api/tasks/:id         # Update task
DELETE /api/tasks/:id         # Delete task
```

### Categories
```
GET    /api/categories        # Get all categories
POST   /api/categories        # Create category
PUT    /api/categories/:id    # Update category
DELETE /api/categories/:id    # Delete category
```

### Notifications
```
GET    /api/notifications     # Get notifications
POST   /api/notifications/test # Send test notification
POST   /api/notifications/broadcast # Broadcast notification
```

## 🚀 Deployment

### Deploy to Vercel + PlanetScale
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
vercel --prod

# Configure environment variables in Vercel dashboard
# Set up PlanetScale database connection
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual containers
docker build -t intellitask-frontend ./frontend
docker build -t intellitask-backend ./backend
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports
- Use the issue tracker to report bugs
- Include detailed steps to reproduce
- Provide system information and screenshots

### 💡 Feature Requests
- Suggest new features through GitHub issues
- Provide detailed use cases and mockups
- Discuss implementation approaches

### 🔧 Development
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### 📝 Code Style
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - React, UI/UX Design
- **Backend Development** - Node.js, API Design
- **Database Design** - MySQL, Data Architecture
- **DevOps** - Deployment, CI/CD

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Express.js** - For the robust backend framework
- **Vercel** - For excellent hosting platform
- **PlanetScale** - For scalable database solutions
- **Open Source Community** - For continuous inspiration

## 📞 Support

- **📧 Email**: rivithranjuna60@gmail.com
- **💬 Discord**: [Join our community](https://discord.gg/intellitask)
- **📖 Documentation**: [docs.intellitask.com](https://docs.intellitask.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/Ranjuna120/Task-Reminder-Assistant--IntelliTask/issues)

---

<div align="center">

**Made with ❤️ by the IntelliTask Team**

⭐ **Star this repo if you found it helpful!** ⭐

[🔝 Back to Top](#-intellitask-task--reminder-assistant)

</div>
