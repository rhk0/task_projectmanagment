# Full-Stack Project Management App

.env for backend
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Amit@3203
DB_NAME=project_management
DB_PORT=3306
NODE_ENV=development
JWT_SECRET=your_jwt_secret

.env for frontend
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api

A comprehensive project management application with separate frontend (Next.js) and backend (Node.js + Express + MySQL).

## 🏗️ Architecture

### Backend (Node.js + Express + MySQL)
- **Port**: 5000
- **Database**: MySQL
- **Authentication**: JWT tokens
- **API**: RESTful endpoints
- **Security**: Helmet, CORS, Rate limiting

### Frontend (Next.js)
- **Port**: 3000
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context
- **API Communication**: Fetch API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
\`\`\`bash
cd backend
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Set up MySQL database:**
\`\`\`sql
CREATE DATABASE project_management;
\`\`\`

4. **Configure environment variables:**
\`\`\`bash
cp .env.example .env
\`\`\`

Update \`.env\` with your MySQL credentials:
\`\`\`env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=project_management
JWT_SECRET=your-super-secure-jwt-secret
\`\`\`

5. **Start the backend server:**
\`\`\`bash
npm run dev
\`\`\`

The backend will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory:**
\`\`\`bash
cd frontend
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Configure environment variables:**
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. **Start the frontend server:**
\`\`\`bash
npm run dev
\`\`\`

The frontend will run on http://localhost:3000


## 🔌 API Endpoints

### Authentication
- \`POST /api/auth/signup\` - Register new user
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/profile\` - Get user profile

### Projects
- \`GET /api/projects\` - Get user projects
- \`POST /api/projects\` - Create project
- \`PUT /api/projects/:id\` - Update project
- \`DELETE /api/projects/:id\` - Delete project

### Tasks
- \`GET /api/tasks\` - Get user tasks
- \`POST /api/tasks\` - Create task
- \`PUT /api/tasks/:id\` - Update task
- \`DELETE /api/tasks/:id\` - Delete task

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm test
\`\`\`

## 🔧 Development Scripts

### Backend
- \`npm run dev\` - Start development server with nodemon
- \`npm start\` - Start production server
- \`npm test\` - Run tests with Mocha

### Frontend
- \`npm run dev\` - Start Next.js development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm test\` - Run Jest tests

## 🔐 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation with express-validator
- SQL injection prevention
- XSS protection with Helmet

## 📊 Features

- ✅ User authentication (signup/login)
- ✅ Project management (CRUD operations)
- ✅ Task management with status tracking
- ✅ Priority levels and due dates
- ✅ Responsive dashboard
- ✅ Real-time statistics
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
#   t a s k _ p r o j e c t m a n a g m e n t 
 
 
