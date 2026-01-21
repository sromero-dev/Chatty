# Chatty - Backend Documentation

## 🏗️ Backend Architecture Overview

The Chatty backend is a RESTful API with real-time capabilities built on Node.js and Express.js. It follows a modular, layered architecture that separates concerns for maintainability and scalability.

## 📁 Project Structure & File Correlation

```
backend/
├── index.js                    # Application entry point
├── lib/                        # Core utilities
│   ├── db.js                   # MongoDB connection
│   ├── socket.js              # Socket.io server setup
│   ├── cloudinary.js          # Cloudinary configuration
│   ├── logger.js              # Winston logging setup
│   ├── rateLimiter.js         # Express rate limiting
│   ├── validators.js          # Input validation with express-validator
│   └── utils.js               # JWT token generation
├── model/                      # Mongoose data models
│   ├── user.model.js          # User schema and model
│   └── message.model.js       # Message schema and model
├── controller/                 # Request handlers
│   ├── auth.controller.js     # Authentication logic with logging
│   └── message.controller.js  # Message handling + image compression
├── middleware/                 # Express middleware
│   └── auth.middleware.js     # Route protection
├── routes/                     # Route definitions
│   ├── auth.route.js          # Authentication routes
│   └── message.route.js       # Message routes
├── logs/                       # Application logs (generated)
│   ├── error.log              # Error logs
│   └── combined.log           # All logs
├── seeds/                      # Database seeding
│   └── user.seed.js           # Sample data
└── package.json               # Dependencies and scripts
```

### **File Dependency Flow**

1. **Entry Point**: `index.js` → Configures server → Imports routes → Starts server
2. **Database**: `index.js` → `db.js` → MongoDB connection
3. **Real-time**: `index.js` → `socket.js` → WebSocket server
4. **Request Flow**: Route → Middleware → Controller → Model → Response
5. **File Uploads**: Controller → `cloudinary.js` → Cloudinary API

## 🔧 Technology Stack Deep Dive

### **Node.js & Express.js**

- **Node.js Runtime**: Event-driven, non-blocking I/O for handling concurrent connections
- **Express.js Framework**: Minimalist web framework with:
  - Middleware pipeline architecture
  - Route-based request handling
  - Built-in error handling
  - Extensible via middleware

```javascript
// Express application configuration (index.js)
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies for JWT authentication
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Allow cookies in cross-origin requests
  }),
);
```

### **MongoDB with Mongoose ODM**

**Mongoose provides:**

- Schema validation and type safety
- Middleware hooks (pre/post save)
- Population for document references
- Query building and optimization

**User Schema Design:**

```javascript
// user.model.js - Comprehensive user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length validation
    },
    profilePic: {
      type: String,
      default: "", // Default empty string, populated with Cloudinary URL
    },
  },
  {
    timestamps: true, // Auto-adds createdAt and updatedAt
  },
);
```

**Message Schema Design:**

```javascript
// message.model.js - Optimized for real-time chat
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Enables population of sender details
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Enables population of receiver details
      required: true,
    },
    text: {
      type: String,
      // Optional when image is present
    },
    image: {
      type: String,
      // Cloudinary URL for image messages
    },
  },
  {
    timestamps: true, // Message timestamp for ordering
  },
);
```

### **Authentication & Authorization System**

**JWT-Based Authentication Flow:**

1. **Login/Signup**: Server generates JWT token
2. **Token Storage**: HTTP-only cookie for security
3. **Route Protection**: Middleware validates token on protected routes
4. **User Identification**: Token payload contains userId

```javascript
// utils.js - Secure token generation
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token validity period
  });

  // Secure cookie configuration
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // Prevents XSS attacks (inaccessible to JavaScript)
    sameSite: "strict", // CSRF protection
    secure: process.env.NODE_ENV !== "development", // HTTPS only in production
  });

  return token;
};
```

**Route Protection Middleware:**

```javascript
// auth.middleware.js - Comprehensive protection
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Extract token from cookies

    if (!token) {
      return res.status(401).json({
        message: "Not authorized - No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user; // Attach user object to request
    next(); // Proceed to route handler
  } catch (error) {
    // Handle various JWT errors (expired, malformed, etc.)
    res.status(500).json({ message: "Server error: " + error });
  }
};
```

### **Real-time Communication with Socket.io**

**Socket Server Architecture:**

```javascript
// socket.js - Complete WebSocket implementation
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true, // Allow cookie transmission
  },
});

// User-to-socket mapping for targeted messaging
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  // Extract userId from handshake query
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id; // Map user to socket
  }

  // Broadcast updated online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId]; // Clean up on disconnect
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update list
  });
});

// Utility function for targeted message delivery
export function getReceiverSocketId(receiverId) {
  return userSocketMap[receiverId]; // Get socket ID for specific user
}
```

### **Cloudinary Integration for Media Storage**

**Cloudinary Configuration:**

```javascript
// cloudinary.js - Secure configuration
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Never expose in client
});
```

**Image Upload Strategy:**

```javascript
// message.controller.js - Base64 to Cloudinary upload
const uploadResponse = await cloudinary.uploader.upload(image, {
  folder: "public", // Organize images in Cloudinary folder
  resource_type: "image", // Explicitly declare as image
});

// Returns secure URL for client access
const imageUrl = uploadResponse.secure_url;
```

## 🔄 API Endpoints & Business Logic

### **Authentication Routes (`/api/auth`)**

| Method | Endpoint          | Description                  | Authentication |
| ------ | ----------------- | ---------------------------- | -------------- |
| POST   | `/signup`         | Register new user            | Public         |
| POST   | `/login`          | Authenticate user            | Public         |
| POST   | `/logout`         | Clear authentication cookie  | Public         |
| PUT    | `/update-profile` | Update user profile          | Protected      |
| GET    | `/check`          | Verify authentication status | Protected      |

**Signup Logic:**

```javascript
// auth.controller.js - User registration
export const signup = async (req, res) => {
  // 1. Input validation
  if (!email || !fullName || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // 2. Password strength validation
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long.",
    });
  }

  // 3. Duplicate email check
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  // 4. Password hashing (bcrypt)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. User creation
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  // 6. JWT token generation
  generateToken(newUser._id, res);

  // 7. Database persistence
  await newUser.save();

  // 8. Response (exclude sensitive data)
  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic,
    createdAt: newUser.createdAt,
  });
};
```

### **Message Routes (`/api/messages`)**

| Method | Endpoint    | Description            | Authentication |
| ------ | ----------- | ---------------------- | -------------- |
| GET    | `/users`    | Get users for sidebar  | Protected      |
| GET    | `/:id`      | Get messages with user | Protected      |
| POST   | `/send/:id` | Send message to user   | Protected      |

**Message Retrieval Logic:**

```javascript
// message.controller.js - Efficient message querying
export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  // Fetch conversation between two users
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  }).sort({ createdAt: 1 }); // Chronological order

  res.status(200).json(messages);
};
```

**Real-time Message Delivery:**

```javascript
// message.controller.js - Send message with WebSocket notification
export const sendMessage = async (req, res) => {
  // 1. Extract message data
  const { text, image } = req.body;
  const { id: receiverId } = req.params;

  // 2. Handle image upload if present
  let imageUrl;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }

  // 3. Create message document
  const newMessage = new Message({
    senderId: req.user._id,
    receiverId,
    text,
    image: imageUrl,
  });

  // 4. Save to database
  await newMessage.save();

  // 5. Real-time delivery via Socket.io
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  // 6. Response to sender
  res.status(200).json(newMessage);
};
```

## 🛡️ Security Implementation

### **Multiple Security Layers**

1. **Authentication**: JWT tokens in HTTP-only cookies
2. **Authorization**: Route-level protection middleware
3. **Input Validation**: Server-side validation for all endpoints
4. **Password Security**: bcrypt hashing with salt
5. **XSS Prevention**: HTTP-only cookies, input sanitization
6. **CSRF Protection**: SameSite strict cookie policy
7. **Data Encryption**: HTTPS in production, encrypted database connections

### **Environment Configuration**

```javascript
// .env file structure
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=supersecretjwttokenwithhighcomplexity
CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5002
NODE_ENV=development
```

## ⚡ Performance Optimizations

### **Database Indexing Strategy**

```javascript
// Recommended indexes for performance
userSchema.index({ email: 1 }, { unique: true });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 }); // For recent messages
```

### **Efficient Query Patterns**

- **Selective Field Projection**: `.select("-password")` excludes sensitive data
- **Lean Queries**: `.lean()` for read-only operations returns plain JavaScript objects
- **Population**: `.populate("senderId", "fullName profilePic")` for joined data

### **Connection Pooling**

- MongoDB driver maintains connection pool
- Socket.io manages WebSocket connections efficiently
- Express.js connection reuse

## 🔄 Real-time Architecture

### **WebSocket Event Flow**

```
Client A sends message →
POST /api/messages/send/:id →
Server validates auth →
Saves to MongoDB →
Finds receiver's socket ID →
io.to(socketId).emit("newMessage") →
Client B receives real-time update
```

### **Online Status Management**

```
User connects → socket.io connection with userId →
Adds to userSocketMap →
io.emit("getOnlineUsers") →
All clients update online list
User disconnects → Remove from map →
Broadcast updated list
```

## 📊 Database Design Patterns

### **Normalization Strategy**

- **Users Collection**: Core user data, authentication info
- **Messages Collection**: Separate for scalability
- **References**: ObjectId references instead of embedding
- **Timestamps**: Automatic createdAt/updatedAt for all documents

### **Scalability Considerations**

1. **Sharding Potential**: Messages collection can be sharded by userId
2. **Read Replicas**: For high read volume (message retrieval)
3. **Caching Layer**: Redis for frequently accessed user data
4. **Archive Strategy**: Old messages can be archived to cold storage

## 🚀 Deployment Configuration

### **Production Build Scripts**

```json
// package.json - Complete deployment setup
{
  "scripts": {
    "build": "npm i --backend && npm i --frontend && npm run build --prefix frontend",
    "start": "npm run start --prefix backend",
    "dev": "nodemon index.js"
  }
}
```

### **Production Server Configuration**

```javascript
// index.js - Production optimizations
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // SPA fallback routing
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")),
  );
}
```

## 🧪 Testing Strategy

### **Test Pyramid Implementation**

1. **Unit Tests**: Individual functions (utils, middleware)
2. **Integration Tests**: API endpoints with database
3. **E2E Tests**: Complete user flows with Socket.io

### **Mocking Strategy**

- **Database**: Mongoose memory server for tests
- **Cloudinary**: Mock uploader for image tests
- **Socket.io**: Mock server for real-time tests

## 📈 Monitoring & Logging

### **Logging Strategy**

```javascript
// Structured logging for production
const logger = {
  info: (message, meta) =>
    console.log(
      JSON.stringify({
        level: "info",
        message,
        ...meta,
        timestamp: new Date().toISOString(),
      }),
    ),
  error: (error, context) =>
    console.error(
      JSON.stringify({
        level: "error",
        error: error.message,
        stack: error.stack,
        ...context,
        timestamp: new Date().toISOString(),
      }),
    ),
};
```

### **Health Checks**

```javascript
// Add to index.js
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
```

## 🔄 Data Flow Patterns

### **Request Processing Pipeline**

```
HTTP Request →
CORS Middleware →
Cookie Parser →
JSON Parser →
Route Handler →
Auth Middleware →
Controller →
Database Operation →
Response Formatter →
HTTP Response
```

### **Error Handling Strategy**

```javascript
// Centralized error handling middleware (recommended addition)
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
```

## 🎯 Best Practices Implemented

### **RESTful API Design**

- Resource-based URLs (`/api/messages/:id`)
- Proper HTTP methods (GET, POST, PUT)
- Consistent response formats
- Appropriate status codes

### **Code Organization**

- Separation of concerns (Models, Controllers, Routes)
- Reusable middleware components
- Utility functions for common operations
- Environment-based configuration

### **Security**

- Password hashing with bcrypt
- JWT with HTTP-only cookies
- Input validation and sanitization
- CORS configuration with explicit origins
- Secure Cloudinary API key management

### **Performance**

- Database indexing
- Efficient query patterns
- Connection pooling
- Asynchronous operations with async/await

## 🔮 Future Enhancements

### **Scalability Improvements**

1. **Microservices Architecture**: Split auth, messaging, media services
2. **Message Queue**: RabbitMQ/Kafka for message processing
3. **Load Balancing**: Multiple Node.js instances with Nginx
4. **Database Optimization**: Read replicas, query optimization

### **Feature Additions**

1. **Message Reactions**: Like, love, etc. on messages
2. **Message Editing**: Edit sent messages within time window
3. **Message Deletion**: Soft delete with "message deleted" placeholder
4. **Group Chats**: Multiple participants in conversations
5. **File Sharing**: PDF, DOC, other file types
6. **Voice Messages**: Audio recording and playback
7. **Video Calls**: WebRTC integration
8. **Message Search**: Full-text search across conversations
9. **Message Pinning**: Important messages at top of chat
10. **Read Receipts**: Seen timestamps for messages

### **Infrastructure**

1. **Dockerization**: Containerized deployment
2. **CI/CD Pipeline**: Automated testing and deployment
3. **API Documentation**: Swagger/OpenAPI specification
4. **Rate Limiting**: Prevent API abuse
5. **API Versioning**: Support multiple API versions

## 📚 Learning Resources

This backend demonstrates:

- **RESTful API design** with Express.js
- **Real-time communication** with Socket.io
- **Database modeling** with Mongoose
- **Authentication strategies** (JWT, cookies)
- **File uploads** with Cloudinary
- **Middleware patterns** in Express
- **Error handling** and validation
- **Production deployment** strategies

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configurations

# Start development server
npm run dev

# Start production server
npm start
```

The server will run on `http://localhost:5000` with:

- API endpoints under `/api/`
- WebSocket connection for real-time messaging
- Logging in `logs/` directory

---

## 🛡️ Security Features Implemented

### Rate Limiting

- **Signup**: 3 registros por IP por hora
- **Login**: 5 intentos por IP cada 15 minutos
- **Messages**: 30 mensajes por minuto

Configurar en `lib/rateLimiter.js`

### Input Validation

- Email RFC 5322 compliant
- Password requirements: 6+ chars, uppercase, lowercase, number
- Full Name: 2-50 characters
- Automatic sanitization

### Image Handling

- Automatic compression para imágenes > 1MB
- Redimensionamiento a 1000x1000 máximo
- Quality JPEG 80 balance

### Logging & Monitoring

```bash
# Ver logs en tiempo real
tail -f logs/combined.log

# Ver solo errores
tail -f logs/error.log
```

Winston logger registra:

- Login/Signup/Logout eventos
- Operaciones exitosas con contexto
- Errores con stack traces
- Timestamps en cada entrada

---

## 📖 Documentation

- [OPTIMIZATIONS.md](../OPTIMIZATIONS.md) - Optimizaciones iniciales
- [ADVANCED_FEATURES.md](../ADVANCED_FEATURES.md) - Features avanzadas
- [API Endpoints](#endpoints) - Documentación de rutas
- WebSocket server for real-time communication
- MongoDB connection for data persistence
- Cloudinary integration for image storage

---

_This backend architecture represents a production-ready Node.js application following modern best practices, with particular emphasis on real-time capabilities, security, and scalability._
