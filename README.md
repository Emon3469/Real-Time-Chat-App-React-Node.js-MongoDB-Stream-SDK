# Chat App 💬

A modern real-time chat application built with React, Node.js, Express, MongoDB, and Stream Chat SDK. Features include user authentication, real-time messaging, and a beautiful UI with TailwindCSS and DaisyUI.

<img width="1095" height="637" alt="project3" src="https://github.com/user-attachments/assets/e4a6f878-208e-4e92-b5bf-036d28a439a1" />
<img width="1919" height="953" alt="project3_a" src="https://github.com/user-attachments/assets/db17cb4c-464e-444c-b659-cc091bc9a677" />
<img width="1909" height="951" alt="project3_b" src="https://github.com/user-attachments/assets/925f877f-fba0-4699-bf84-c755d3321c8a" />



## 🚀 Features

- **Real-time Messaging**: Instant messaging powered by Stream Chat SDK
- **User Authentication**: Secure JWT-based authentication
- **Modern UI**: Beautiful interface built with React, TailwindCSS, and DaisyUI
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Docker Support**: Easy deployment with Docker and Docker Compose
- **MongoDB Integration**: Persistent data storage
- **Video Chat**: Video calling capabilities with Stream Video SDK

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful UI components for TailwindCSS
- **Stream Chat React SDK** - Real-time chat functionality
- **Stream Video React SDK** - Video calling features
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Stream Chat** - Backend chat services
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Docker** (optional, for containerized deployment)
- **Stream Account** (for chat and video features)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Chat-App
```

### 2. Environment Variables

Create `.env` files in both backend and frontend directories:

#### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your-super-secret-jwt-key
STREAM_API_KEY=your-stream-api-key
STREAM_API_SECRET=your-stream-api-secret
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
VITE_STREAM_API_KEY=your-stream-api-key
```

### 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend/chat_app_fronend
npm install
```

## 🚀 Running the Application

### Development Mode

#### Option 1: Run Manually

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start Backend Server**
```bash
cd backend
npm run dev
```

3. **Start Frontend Development Server**
```bash
cd frontend/chat_app_fronend
npm run dev
```

#### Option 2: Using Docker Compose (Development)

```bash
# Run in development mode with hot reloading
docker-compose --profile dev up --build
```

### Production Mode

#### Using Docker Compose

```bash
# Build and run all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📱 Usage

1. **Access the Application**
   - Frontend: http://localhost:5173 (development) or http://localhost (production)
   - Backend API: http://localhost:5001

2. **Create an Account**
   - Navigate to the registration page
   - Fill in your details and create an account

3. **Start Chatting**
   - Log in with your credentials
   - Join existing channels or create new ones
   - Send messages and enjoy real-time communication

4. **Video Calls**
   - Initiate video calls with other users
   - Join video rooms for group conversations

## 🐳 Docker Commands

### Build Images
```bash
# Build backend image
docker build -t chat-app-backend ./backend

# Build frontend image
docker build -t chat-app-frontend ./frontend/chat_app_fronend
```

### Run Individual Containers
```bash
# Run MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:7.0

# Run Backend
docker run -d --name backend -p 5001:5001 --link mongodb chat-app-backend

# Run Frontend
docker run -d --name frontend -p 80:80 --link backend chat-app-frontend
```

## 📁 Project Structure

```
Chat-App/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── lib/             # Utility libraries
│   │   └── server.js        # Main server file
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/
│   └── chat_app_fronend/
│       ├── src/             # React source code
│       ├── public/          # Static assets
│       ├── Dockerfile
│       ├── Dockerfile.dev
│       ├── package.json
│       └── .env
├── docker-compose.yaml
├── .gitignore
└── README.md
```

## 🔒 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `STREAM_API_KEY` | Stream Chat API key | Yes |
| `STREAM_API_SECRET` | Stream Chat API secret | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_STREAM_API_KEY` | Stream Chat API key | Yes |

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend/chat_app_fronend
npm test
```

## 🚀 Deployment

### Cloud Deployment Options

#### Deploy to Vercel (Recommended for Frontend + Serverless)

**Frontend Deployment:**
1. **Connect your GitHub repository to Vercel**
2. **Set build settings:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend/chat_app_fronend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure environment variables in Vercel dashboard:**
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_STREAM_API_KEY=your-stream-api-key
   ```

**Backend Options for Vercel:**
- Use Vercel Serverless Functions (requires code restructuring)
- Deploy backend separately on Render/Railway and connect via API URL

#### Deploy to Render (Full-Stack Deployment)

**Backend Deployment:**
1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set environment variables:**
   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
   JWT_SECRET=your-super-secret-jwt-key
   STREAM_API_KEY=your-stream-api-key
   STREAM_API_SECRET=your-stream-api-secret
   ```

**Frontend Deployment:**
1. **Create a new Static Site on Render**
2. **Configure build settings:**
   - Root Directory: `frontend/chat_app_fronend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Set environment variables:**
   ```env
   VITE_API_URL=https://your-backend-service.onrender.com
   VITE_STREAM_API_KEY=your-stream-api-key
   ```

#### Database Options for Cloud Deployment

**MongoDB Atlas (Recommended):**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in your environment variables

**Alternative Database Services:**
- **Railway**: PostgreSQL/MongoDB hosting
- **PlanetScale**: MySQL-compatible serverless database
- **Supabase**: PostgreSQL with real-time features

### Production Deployment with Docker

1. **Set up production environment variables**
2. **Build and deploy with Docker Compose**
```bash
docker-compose -f docker-compose.yaml up --build -d
```

### Manual Deployment

1. **Build frontend for production**
```bash
cd frontend/chat_app_fronend
npm run build
```

2. **Deploy backend to your server**
3. **Serve frontend build files with a web server (nginx, Apache, etc.)**

### Deployment Checklist

- [ ] Set up MongoDB Atlas or cloud database
- [ ] Configure environment variables for production
- [ ] Update CORS settings for production domains
- [ ] Set up Stream Chat production keys
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificates (handled by Vercel/Render)
- [ ] Test all functionality in production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **Stream Chat Not Working**
   - Verify Stream API keys are correct
   - Check Stream dashboard for usage limits

3. **Frontend Not Loading**
   - Ensure backend is running on the correct port
   - Check CORS configuration

4. **Docker Issues**
   - Make sure Docker is running
   - Check for port conflicts

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Create a new issue if you encounter a bug
- Join our community discussions

## 🙏 Acknowledgments

- [Stream](https://getstream.io/) for providing excellent chat and video SDKs
- [MongoDB](https://www.mongodb.com/) for the database solution
- [React](https://reactjs.org/) team for the amazing frontend framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Made with ❤️ by [Your Name]
