# 🚀 Chatty - Real-Time Chat Application

## 📖 Overview

Chatty is a full-stack, real-time chat application built with modern web technologies. It features user authentication, instant messaging, profile management, theme customization, and online status indicators. The application provides a seamless, responsive chat experience across all devices.

## ✨ Features

### 🔐 Authentication & User Management

- Secure user registration and login with JWT
- Profile picture uploads with Cloudinary integration
- Password hashing with bcrypt
- Protected routes and API endpoints
- Persistent sessions with HTTP-only cookies

### 💬 Real-Time Messaging

- Instant message delivery with Socket.io
- Online/offline user status
- Text and image messages
- Conversation history
- Typing indicators (future enhancement)

### 🎨 Customization

- Multiple UI themes with live preview
- Dark/light mode support
- Profile customization
- Responsive design for all screen sizes

### 📱 User Experience

- Clean, modern interface with Tailwind CSS
- Loading states and error handling
- Toast notifications
- Optimistic UI updates
- Intuitive navigation

## 🏗️ Tech Stack

### **Frontend**

- **React 19** - UI library with latest features
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Socket.io-client** - Real-time communication
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### **Backend**

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - WebSocket library
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt.js** - Password hashing
- **Cloudinary** - Image upload and storage
- **Cookie Parser** - Cookie handling middleware

### **Development Tools**

- **Nodemon** - Automatic server restart
- **Dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **ESLint** - Code linting

## 📁 Project Structure

```
chatty/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/          # Custom hooks (zustand stores)
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Configuration files
│   │   ├── App.jsx         # Root component with routing
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                 # Node.js server
│   ├── controller/         # Request handlers
│   │   ├── auth.controller.js
│   │   └── message.controller.js
│   ├── model/              # Mongoose models
│   │   ├── user.model.js
│   │   └── message.model.js
│   ├── routes/             # Express routes
│   │   ├── auth.route.js
│   │   └── message.route.js
│   ├── middleware/         # Express middleware
│   │   └── auth.middleware.js
│   ├── lib/                # Utilities
│   │   ├── db.js          # MongoDB connection
│   │   ├── socket.js      # Socket.io setup
│   │   ├── cloudinary.js  # Cloudinary config
│   │   ├── logger.js      # Winston logging
│   │   ├── rateLimiter.js # Express rate limiting
│   │   ├── validators.js  # Input validation
│   │   └── utils.js       # JWT utilities
│   ├── logs/              # Application logs (generated)
│   ├── index.js           # Server entry point
│   ├── package.json
│   └── .env.example
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chatty
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   **Backend .env variables:**

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chatty
   JWT_SECRET=your_super_secret_jwt_key
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Set up the Frontend**

   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

   **Frontend .env variables:**

   ```env
   VITE_API_URL=http://localhost:5000
   ```

   **Note:** The `VITE_API_URL` should match the backend's `PORT`

### Running the Application

#### Development Mode

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   Server will run on: http://localhost:5002

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will open on: http://localhost:5173

#### Production Build

1. **Build the project**

   ```bash
   cd ./Chatty
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🔧 Configuration Details

### Environment Variables

#### Backend (.env)

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chat_db
JWT_SECRET=your_secret_key_here
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
LOG_LEVEL=info
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

**Important:** Ensure `VITE_API_URL` matches backend's `PORT`

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGO_URI` in `.env`:
   - Local: `mongodb://localhost:27017/chatty`
   - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Get your:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your `.env` file

### Socket.io Configuration

- Frontend connects to WebSocket server on the same port as backend
- User authentication via query parameters
- Automatic reconnection handling

---

## 🛡️ Security & Performance Features

### Rate Limiting

Protects against brute-force attacks and spam:

- **Signup:** 3 registros por IP por hora
- **Login:** 5 intentos por IP cada 15 minutos
- **Messages:** 30 mensajes por minuto

Configurar en `backend/src/lib/rateLimiter.js`

### Input Validation

- Email: RFC 5322 compliant
- Password: Mínimo 6 caracteres + mayúscula + minúscula + número
- Full Name: 2-50 caracteres
- Sanitización automática de inputs

### Image Compression

- Compresión automática de imágenes > 1MB
- Redimensionamiento a 1000x1000 máximo
- Calidad JPEG 80 para balance tamaño/calidad

### Logging

Winston logger con:

- Logs en archivos: `logs/error.log`, `logs/combined.log`
- Timestamps en cada entrada
- Stack traces para errores
- Información contextual de operaciones

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user (rate limited)
- `POST /api/auth/login` - User login (rate limited)
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/update-profile` - Update profile picture
- `GET /api/auth/check` - Verify authentication status

### Messages

- `GET /api/messages/users` - Get users for sidebar
- `GET /api/messages/:id?page=1&limit=50` - Get messages with pagination
- `POST /api/messages/send/:id` - Send message (rate limited)

Query Parameters:

- `page` - Message page number (default: 1)
- `limit` - Messages per page (default: 50)

## 🔐 Authentication Flow

1. **Registration/Login**: User credentials sent to server
2. **Token Generation**: Server creates JWT with user ID
3. **Cookie Storage**: Token stored in HTTP-only cookie
4. **Route Protection**: Middleware validates token on protected routes
5. **WebSocket Connection**: Authenticated user connects to Socket.io

## 💬 Real-Time Messaging Flow

1. **Message Send**: User sends message via POST request
2. **Server Processing**: Message saved to database
3. **Real-Time Delivery**: Socket.io emits message to recipient
4. **UI Update**: Recipient's client updates chat interface

## 🎨 Theme System

The application supports multiple themes via DaisyUI:

1. Theme selection in Settings page
2. Live preview functionality
3. Persistence in localStorage
4. Instant application without page reload

## 🧪 Testing the Application

### Create Test Users

1. Register two different user accounts
2. Log in with both accounts in different browsers/incognito windows
3. Start a conversation between the users
4. Verify real-time message delivery

### Test Features

- ✅ User registration and login
- ✅ Profile picture upload
- ✅ Theme switching
- ✅ Real-time messaging
- ✅ Online status indicators
- ✅ Responsive design

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB connection error**
   - Ensure MongoDB is running locally
   - Check connection string in `.env`

2. **CORS errors**
   - Verify frontend URL in backend CORS configuration
   - Check that credentials are included in requests

3. **Socket.io connection issues**
   - Ensure backend server is running
   - Check WebSocket URL in frontend

4. **Image upload failures**
   - Verify Cloudinary credentials
   - Check image size (max 5MB)

### Development Logs

- Backend logs: `logs/combined.log` y `logs/error.log`
- Frontend logs: Browser developer tools console
- Network requests: Monitor in browser DevTools Network tab
- View logs in real-time: `tail -f backend/logs/combined.log`

---

## 📚 Documentation

- [OPTIMIZATIONS.md](OPTIMIZATIONS.md) - Optimizaciones iniciales implementadas
- [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) - Características avanzadas (Rate limiting, Validación, Paginación, etc)

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

### Possible Features

- Group chats
- Message reactions
- File sharing
- Voice messages
- Video calls
- Message search
- Read receipts
- Typing indicators
- Message editing/deleting

### Technical Possible Improvements

- TypeScript migration
- Unit and integration tests
- Docker containerization
- CI/CD pipeline
- Performance monitoring
- Advanced caching strategies

## 📚 Learning Resources

This project demonstrates:

- Full-stack JavaScript development
- Real-time applications with WebSockets
- Modern React patterns and hooks
- State management with Zustand
- RESTful API design with Express
- MongoDB with Mongoose ODM
- Authentication and authorization
- Responsive UI design
- Deployment strategies

## Acknowledgments

- [Vite](https://vitejs.dev/) for the excellent build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [DaisyUI](https://daisyui.com/) for the beautiful components
- [Socket.io](https://socket.io/) for real-time capabilities
- [Cloudinary](https://cloudinary.com/) for image management

---

**Happy Chatting! 💬**
