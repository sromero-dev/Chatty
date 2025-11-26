# Backend - Chat Application

## 📚 Stack Tecnológico

Este proyecto utiliza las siguientes tecnologías:

- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Socket.io** - Comunicación en tiempo real (pendiente de implementar)
- **Cloudinary** - Servicio de almacenamiento de imágenes
- **JWT** - JSON Web Tokens para autenticación
- **bcryptjs** - Encriptación de contraseñas
- **cookie-parser** - Manejo de cookies

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── controller/
│   │   ├── auth.controller.js
│   │   └── message.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── model/
│   │   ├── user.model.js
│   │   └── message.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   └── message.route.js
│   ├── lib/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── utils.js
│   └── index.js
├── package.json
└── README.md
```

## ⚙️ Configuración

### Instalación de Dependencias

```bash
npm init -y
npm i express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudinary socket.io
npm i nodemon -D
```

### Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```env
PORT=5002
MONGO_URI=tu_url_de_mongodb
JWT_SECRET=tu_jwt_secret
CLOUD_NAME=tu_cloudinary_cloud_name
CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_api_secret
NODE_ENV=development
```

## 🔧 Explicación del Código

### Punto de Entrada Principal (`index.js`)

```javascript
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5002;

// 🚨 IMPORTANTE: El orden de los middleware es crucial
app.use(express.json()); // Para parsear JSON en las requests
app.use(cookieParser()); // Para manejar cookies

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
```

### Modelos de Datos

**User Model (`user.model.js`):**

```javascript
const userScheme = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);
```

**Message Model (`message.model.js`):**

```javascript
const messageScheme = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);
```

### Sistema de Autenticación

**Middleware de Protección (`auth.middleware.js`):**

```javascript
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized - No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    req.user = user; // User disponible en req.user para los siguientes middleware
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error);
    res.status(500).json({ message: "Server error: " + error });
  }
};
```

**Generación de JWT (`utils.js`):**

```javascript
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    httpOnly: true, // Prevención de ataques XSS
    sameSite: "strict", // Protección CSRF
    secure: process.env.NODE_ENV !== "development", // HTTPS en producción
  });

  return token;
};
```

### Controladores de Autenticación

**Registro de Usuario (`auth.controller.js` - signup):**

```javascript
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    // Validaciones
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists." });

    // Encriptación de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, password: hashedPassword });

    if (newUser) {
      generateToken(newUser._id, res); // JWT en cookie
      await newUser.save();

      res.status(201).json({
        message: "User created successfully.",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error) {
    console.log("Error signing up user: ", error);
  }
};
```

### Gestión de Mensajes

**Controlador de Mensajes (`message.controller.js`):**

```javascript
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Busca mensajes en ambas direcciones
    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;

    let imageUrl;
    if (image) {
      // Upload de imagen base64 a Cloudinary
      const uploadResponde = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponde.secure_url;
    }

    const newMessage = new Message({
      senderId: req.user._id,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // TODO: Implementar Socket.io para mensajes en tiempo real

    res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error });
  }
};
```

### Gestión de Archivos con Cloudinary

**Configuración Cloudinary (`cloudinary.js`):**

```javascript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

**Actualización de Perfil (`auth.controller.js` - updateProfile):**

```javascript
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    const uploadResponde = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponde.secure_url },
      { new: true } // Retorna el usuario actualizado
    );

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.log("Error updating profile: ", error);
    res.status(500).json({ message: "Server error: " + error });
  }
};
```

## 🚀 Ejecución del Proyecto

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
node src/index.js
```

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)

- `POST /signup` - Registro de usuario
- `POST /login` - Inicio de sesión
- `POST /logout` - Cerrar sesión
- `PUT /update-profile` - Actualizar perfil (protegida)
- `GET /check` - Verificar autenticación (protegida)

### Mensajes (`/api/message`)

- `GET /user` - Obtener usuarios para sidebar (protegida)
- `GET /:id` - Obtener mensajes con un usuario (protegida)
- `POST /send/:id` - Enviar mensaje (protegida)

## 🔒 Características de Seguridad

1. **JWT en Cookies HTTP-only**: Previene acceso vía JavaScript
2. **Passwords encriptadas**: Usando bcryptjs con salt
3. **Validación de datos**: En servidor y base de datos
4. **Protección de rutas**: Middleware de autenticación
5. **CORS y SameSite**: Configuración segura de cookies

## 🚧 Próximas Implementaciones

- [ ] Integración completa de Socket.io para mensajes en tiempo real
- [ ] Sistema de salas de chat grupales
- [ ] Notificaciones en tiempo real
- [ ] Sistema de amigos/contactos
- [ ] Mensajes con estado (entregado, leído)

---

_Este backend proporciona una base sólida para una aplicación de chat con autenticación segura, gestión de mensajes y almacenamiento de archivos._
