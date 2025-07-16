# 📝 IntelliTask: Task & Reminder Assistant

<div align="center">

![IntelliTask Logo](https://img.shields.io/badge/IntelliTask-Task%20Management-blue?style=for-the-badge&logo=checkmarx&logoColor=white)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

**A powerful, modern task management and reminder system with real-time notifications**

</div>

---

## 🚀 Quick Start Guide

### 📋 Prerequisites
- Node.js (v16+)
- npm or yarn
- MySQL/PostgreSQL database

### ⚡ Installation

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your database and email settings in .env
npm start
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### 3. Database Setup
```bash
# For MySQL
mysql -u username -p database_name < ../database/schema.sql

# For PostgreSQL
psql -U username -d database_name -f ../database/schema-postgresql.sql
```

## ✨ Key Features

- 📋 **Task Management** - Create, edit, delete tasks
- ⏰ **Smart Reminders** - Email notifications
- 🔔 **Real-time Notifications** - WebSocket powered
- 📊 **Analytics Dashboard** - Productivity insights
- ⭐ **Favorites** - Quick access to important tasks
- 📂 **Categories** - Organize tasks efficiently
- 🎨 **Modern UI** - Beautiful glassmorphism design
- 🌙 **Theme Toggle** - Dark/Light mode
- 📱 **Responsive** - Works on all devices

## 🔐 Default Login Credentials

```
Admin: admin@gmail.com / admin123
Category Manager: category@gmail.com / category123
```

## 🛠️ Tech Stack

**Frontend:** React 19, React Router, CSS3, WebSocket  
**Backend:** Node.js, Express.js, WebSocket, JWT  
**Database:** MySQL, PostgreSQL, SQLite  
**Deployment:** Vercel, PlanetScale, Supabase

## 📁 Project Structure

```
ITPM-30-main/
├── backend/           # Node.js API server
│   ├── controllers/   # Business logic
│   ├── routers/      # API routes
│   └── server.js     # Main server file
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   └── App.js      # Main app component
│   └── public/        # Static assets
└── database/          # SQL schema files
```

## 🌐 API Endpoints

- `POST /auth/api/login` - User authentication
- `GET /api/tasks` - Retrieve tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/categories` - Get categories
- `POST /api/notifications/test` - Test notification

## 🚀 Deployment

### Vercel + PlanetScale
```bash
vercel --prod
# Configure environment variables in Vercel dashboard
```

### Docker
```bash
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using React & Node.js**

⭐ Star this repo if you find it helpful!

</div>
