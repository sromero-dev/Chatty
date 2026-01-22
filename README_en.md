# 📸 Application Preview

Before diving into the technical details, we invite you to visually explore Chatty's main features:

### 🏠 Home Screen

<div align="center">

![Homepage](assets/homepage.png)
_Welcome interface where users can sign up, log in, or customize the appearance_

### 🎨 Theme Customization

![Homepage with Dark Blue Theme](assets/homepage_diff_theme.png)  
_Same interface with a dark blue theme applied - demonstrates customization flexibility_

### ⚠️ Form Validation

![Login Error](assets/login_err.png)  
_React's native validation system showing real-time form errors_

### 💬 Main Chat Interface

![Chat Interface](assets/message_image.png)  
_Main application view: sidebar with users and active chat with messages and images_

### 👤 Profile Management

![Profile Picture Change](assets/pfp_change.png)  
_Profile section where users can update their information and profile picture_

### 🎛️ Settings Panel

![Theme Settings](assets/settings.png)  
_Theme selection panel with real-time preview_

### 👥 User List

![User List](assets/user_list.png)  
_Sidebar view showing all available users to chat with_

</div>

---

# 🚀 Chatty - Real-Time Chat Application

## 📖 Overview

Chatty is a full-stack real-time chat application built with modern web technologies. It features user authentication, instant messaging, profile management, theme customization, AI-powered content moderation, and online status indicators. The application provides a smooth and responsive chat experience across all devices.

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
- Text and image messages with Cloudinary storage
- Conversation history with pagination
- Optimistic UI updates for smooth experience

### 🛡️ Content Moderation

- **AI-Powered Content Filtering** using Google Gemini API
- **Local Fallback System** with offensive word lists
- **Image Moderation** using Gemini Vision API
- Multi-field content validation (usernames, messages, profile info)
- Graceful fallback when AI services are unavailable

### 🎨 Customization

- Multiple UI themes with DaisyUI components
- Dark/light mode support
- Profile customization
- Responsive design for all screen sizes
- Tailwind CSS for modern styling

### 📱 User Experience

- Clean, modern interface with Tailwind CSS
- Loading states and error handling
- Toast notifications with React Hot Toast
- Optimistic UI updates for messages
- Intuitive navigation with React Router

## 🏗️ Tech Stack

### **Frontend**

- **React 19** - Latest React features including hooks
- **Vite** - Next-generation build tool for fast development
- **Tailwind CSS v4** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls with interceptors
- **Socket.io-client** - Real-time WebSocket communication
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications

### **Backend**

- **Node.js** - JavaScript runtime environment
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB with schema validation
- **Google Gemini API** - AI-powered content moderation
- **Socket.io** - Real-time bidirectional event-based communication
- **JWT** - JSON Web Tokens for secure authentication
- **Bcrypt.js** - Password hashing with salt rounds
- **Cloudinary** - Cloud-based image and video management
- **Sharp** - High-performance image processing
- **Winston** - Versatile logging library
- **Express Rate Limit** - Rate limiting middleware
- **Express Validator** - Input validation and sanitization
- **Compression** - Gzip compression middleware
- **Cookie Parser** - Cookie handling middleware

### **Development & Deployment**

- **Nodemon** - Automatic server restart during development
- **Dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing middleware
- **ESLint** - Code linting for consistent style

## 📁 Project Structure

```
chatty/
├── frontend/ # React Vite application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── hooks/ # Custom hooks (zustand stores)
│ │ ├── pages/ # Page components
│ │ ├── lib/ # Configuration files (axios, etc.)
│ │ ├── App.jsx # Root component with routing
│ │ └── main.jsx # Application entry point
│ ├── public/ # Static assets
│ ├── index.html # HTML template
│ ├── package.json # Frontend dependencies
│ ├── vite.config.js # Vite configuration
│ └── tailwind.config.js # Tailwind CSS configuration
│
├── backend/ # Node.js Express server
│ ├── controller/ # Request handlers
│ │ ├── auth.controller.js
│ │ └── message.controller.js
│ ├── model/ # Mongoose models
│ │ ├── user.model.js
│ │ └── message.model.js
│ ├── routes/ # Express routes
│ │ ├── auth.route.js
│ │ └── message.route.js
│ ├── middleware/ # Express middleware
│ │ └── auth.middleware.js
│ ├── lib/ # Utilities and configurations
│ │ ├── db.js # MongoDB connection
│ │ ├── socket.js # Socket.io setup
│ │ ├── cloudinary.js # Cloudinary configuration
│ │ ├── logger.js # Winston logging setup
│ │ ├── rateLimiter.js # Express rate limiting
│ │ ├── validators.js # Input validation utilities
│ │ ├── contentFilter.js # AI content moderation
│ │ └── utils.js # JWT and other utilities
│ ├── logs/ # Application logs (generated)
│ ├── index.js # Server entry point
│ ├── package.json # Backend dependencies
│ └── .env.example # Environment variables template
│
└── README.md # This documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary Account** (free tier available for image uploads)
- **Google AI Studio Account** (for Gemini API key - free tier available)
- **Git** (for version control)

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
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   NODE_ENV=development
   ```

4. **Set up the Frontend**

   ```bash
   cd ../frontend
   npm install
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

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   The application will open automatically on: http://localhost:5173

#### Production Build

1. **Build the frontend**

   ```bash
   cd frontend
   npm run build
   ```

2. **Copy build to backend (for monolithic deployment)**

   ```bash
   # From project root
   cp -r frontend/dist backend/
   ```

3. **Start the production server**
   ```bash
   cd backend
   npm start
   ```

## 🔧 Configuration Details

### MongoDB Setup

**Option 1: Local MongoDB**

1. Install MongoDB Community Edition
2. Start MongoDB service: `mongod`
3. Use connection string: `mongodb://localhost:27017/chatty`

**Option 2: MongoDB Atlas (Recommended for production)**

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database user
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
4. Add to `.env` as `MONGO_URI`

### Cloudinary Setup

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. From dashboard, get:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Add these to your `.env` file

### Google Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key (free tier includes generous limits)
3. Enable the Gemini API in Google Cloud Console
4. Add API key to `.env` as `GEMINI_API_KEY`

### Socket.io Configuration

- Automatic WebSocket connection management
- User authentication via JWT tokens
- Fallback to HTTP long-polling if WebSockets unavailable
- Automatic reconnection with exponential backoff

## 🛡️ Security & Performance Features

### Rate Limiting

Protects against brute-force attacks and spam:

- **Signup:** 3 registrations per IP per hour
- **Login:** 5 attempts per IP every 15 minutes
- **Messages:** 30 messages per minute per user
- **API Endpoints:** Global rate limiting on all routes

Configure in `backend/lib/rateLimiter.js`

### Content Moderation System

**AI-Powered Filtering:**

- Text moderation using Gemini 2.0 Flash
- Image analysis using Gemini Vision
- Confidence scoring for inappropriate content

**Local Fallback System:**

- Curated list of offensive words in multiple languages
- Username validation (2-50 characters)
- Severe content detection (pornography, violence, drugs, weapons)

**Graceful Degradation:**

- When Gemini API is unavailable (quota exceeded, network issues), system falls back to local moderation
- Images too large for AI analysis (>5MB) bypass moderation with warning
- All moderation failures are logged for monitoring

### Input Validation & Sanitization

- **Email Validation:** RFC 5322 compliant with regex pattern
- **Password Requirements:** Minimum 6 characters with uppercase, lowercase, and number
- **Full Name:** 2-50 characters with sanitization
- **Username:** Alphanumeric with underscores, 3-20 characters
- **Message Length:** Maximum 2000 characters with trimming

### Image Processing Pipeline

1. **Size Validation:** Maximum 10MB per image
2. **AI Moderation:** Gemini Vision analysis (bypassed if >5MB or API unavailable)
3. **Compression:** Images >1MB resized to 1000x1000 with 80% JPEG quality
4. **Optimization:** Sharp library for high-performance processing
5. **Cloud Storage:** Upload to Cloudinary with auto-format and quality optimization
6. **Fallback:** Local storage in development if Cloudinary fails

### Logging System

**Winston Logger Configuration:**

- **Console Output:** Colored logs during development
- **File Logs:** `logs/error.log` (errors only), `logs/combined.log` (all logs)
- **Log Rotation:** Daily rotation with max file size
- **Structured Data:** JSON format with timestamps, log levels, and contextual information
- **Error Tracking:** Stack traces included for all errors

## 📡 API Endpoints

### Authentication (`/api/auth`)

- `POST /signup` - Register new user (rate limited)
- `POST /login` - User login (rate limited)
- `POST /logout` - User logout (clears HTTP-only cookie)
- `PUT /update-profile` - Update profile picture and information
- `GET /check` - Verify authentication status and return user data

### Messages (`/api/messages`)

- `GET /users` - Get all users for sidebar (excluding current user)
- `GET /:id?page=1&limit=50` - Get messages with pagination
- `POST /send/:id` - Send message to user (rate limited)

**Query Parameters for Messages:**

- `page` - Page number (default: 1)
- `limit` - Messages per page (default: 50, max: 100)

## 🔐 Authentication Flow

1. **Registration/Login:** User submits credentials via secure HTTPS
2. **Validation:** Server validates input and checks for existing user
3. **Password Hashing:** bcrypt hashes password with salt rounds
4. **JWT Generation:** Server creates signed JWT with user ID and expiration
5. **Cookie Storage:** JWT stored in HTTP-only, secure cookie
6. **Route Protection:** Middleware validates JWT on protected routes
7. **WebSocket Auth:** Same JWT used to authenticate Socket.io connection
8. **Token Refresh:** Client automatically checks auth status on page load

## 💬 Real-Time Messaging Flow

1. **Message Composition:** User types message or selects image
2. **Content Moderation:** Text/image analyzed by Gemini AI (with local fallback)
3. **Image Processing:** If image, compressed and uploaded to Cloudinary
4. **Database Save:** Message saved to MongoDB with sender/receiver IDs
5. **Socket Emission:** Server emits message via Socket.io to recipient
6. **Real-Time Delivery:** Recipient receives message instantly via WebSocket
7. **UI Update:** React components update with optimistic rendering
8. **Acknowledgement:** Client confirms receipt (optional future enhancement)

## 🛡️ Content Moderation Flow

### Text Moderation:

```
User Input → Gemini API Analysis → JSON Response Parsing → Local Fallback (if needed) → Approval/Rejection
```

### Image Moderation:

```
Image Upload → Base64 Conversion → Size Check (<5MB) → Gemini Vision Analysis →
└─→ If API fails/quota: Bypass with warning → Image Compression → Cloudinary Upload → Save URL
```

### Fallback Scenarios:

1. **Gemini API Unavailable:** Use local offensive word list
2. **Image Too Large (>5MB):** Bypass AI moderation with warning log
3. **Network Errors:** Allow content with security warning
4. **Parse Errors:** Fall back to local validation

## 🎨 Theme System

The application uses DaisyUI's theme system:

1. **Theme Selection:** Users choose from 20+ built-in DaisyUI themes
2. **Live Preview:** Real-time theme preview in settings
3. **Persistence:** Theme stored in localStorage
4. **Instant Application:** Theme changes without page reload
5. **Responsive:** All themes optimized for mobile and desktop

Available themes: light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, autumn, business, acid, lemonade, night, coffee, winter.

## 📱 Browser Support

- **Chrome** (latest 2 versions)
- **Firefox** (latest 2 versions)
- **Safari** (latest 2 versions)
- **Edge** (latest 2 versions)
- **Mobile Browsers** (Chrome Mobile, Safari Mobile)

## 🐛 Troubleshooting

### Common Issues & Solutions

1. **MongoDB Connection Error**

   ```
   Error: Could not connect to MongoDB
   ```

   **Solution:** Ensure MongoDB is running (`mongod`), check connection string in `.env`, verify network connectivity.

2. **CORS Errors in Browser**

   ```
   Access-Control-Allow-Origin error
   ```

   **Solution:** Verify `VITE_API_URL` matches backend port, check CORS configuration in `index.js`.

3. **Image Upload Failures**

   ```
   Cloudinary upload error or "PayloadTooLargeError"
   ```

   **Solution:**
   - Check Cloudinary credentials in `.env`
   - Reduce image size (max 10MB)
   - Verify internet connectivity
   - Check Cloudinary dashboard for quota limits

4. **Gemini API Quota Exceeded**

   ```
   "Gemini quota exceeded" in logs
   ```

   **Solution:**
   - Application will automatically use local fallback
   - Check Google AI Studio for quota usage
   - Upgrade to paid tier if needed
   - Local moderation will continue to work

5. **Socket.io Connection Issues**

   ```
   WebSocket connection failed
   ```

   **Solution:** Ensure backend is running, check firewall settings, verify JWT token is valid.

6. **Slow Image Loading**
   ```
   Images take long to load
   ```
   **Solution:** Images are compressed and optimized. Check Cloudinary response times, consider reducing image quality in `sharp` configuration.

### Development Logs

**Backend Logs:**

- Real-time console output during development
- Detailed file logs in `backend/logs/`
- View logs: `tail -f backend/logs/combined.log`

**Frontend Debugging:**

- Browser Developer Tools (Console, Network tabs)
- React DevTools for component inspection
- Network requests monitoring for API calls

## 📚 Learning Resources

This project demonstrates practical implementation of:

- **Full-Stack JavaScript Development** with MERN stack (MongoDB, Express, React, Node.js)
- **Real-Time Applications** using WebSockets with Socket.io
- **Modern React Patterns** including hooks, custom hooks, and state management
- **AI Integration** with Google Gemini API for intelligent features
- **Cloud Services** integration (Cloudinary, MongoDB Atlas)
- **Security Best Practices** (JWT, HTTP-only cookies, rate limiting, input validation)
- **Performance Optimization** (image compression, pagination, lazy loading)
- **Error Handling & Resilience** (graceful degradation, fallback systems)

## Possible Enhancements

### Technical Improvements

- **TypeScript Migration** for type safety
- **Unit & Integration Tests** with Jest and React Testing Library
- **Docker Containerization** for consistent deployment
- **CI/CD Pipeline** with GitHub Actions
- **Performance Monitoring** with metrics and alerts
- **Advanced Caching** with Redis for frequently accessed data
- **Microservices Architecture** for scalability
- **GraphQL API** as alternative to REST

## 🙏 Acknowledgments

- **Vite Team** for the excellent build tool and development experience
- **Tailwind CSS & DaisyUI** for the powerful styling framework and components
- **Socket.io Team** for making real-time communication accessible
- **Google AI** for the Gemini API and AI capabilities
- **Cloudinary** for reliable media storage and optimization
- **MongoDB** for the flexible database solution
- **All Contributors** who have helped improve this project

---

**Happy Chatting! 💬**
