import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import bcrypt from "bcryptjs";
config();

// Hashear las contraseñas ANTES de definir el array
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

// Usamos una función asíncrona para crear los usuarios con contraseñas hasheadas
const createSeedUsers = async () => {
  return [
    {
      email: "alex@example.com",
      fullName: "Alex",
      password: await hashPassword("123456"), // Contraseña hasheada
      profilePic: "",
    },
    {
      email: "sam@example.com",
      fullName: "Sam",
      password: await hashPassword("123456"), // Contraseña hasheada
      profilePic: "",
    },
  ];
};

const seedData = async () => {
  try {
    await connectDB();

    // Eliminar colecciones existentes
    await User.deleteMany({});
    await Message.deleteMany({});
    console.log("Base de datos limpiada");

    // Crear usuarios con contraseñas hasheadas
    const users = await createSeedUsers(); // 👈 Esperar a que se hasheen las contraseñas
    const createdUsers = await User.insertMany(users);
    const [alex, sam] = createdUsers;
    console.log("Usuarios creados exitosamente con contraseñas hasheadas");

    // Crear conversación de ejemplo
    const messages = [
      {
        senderId: alex._id,
        recieverId: sam._id,
        text: "¡Hola Sam! 👋 Bienvenido a Chatty",
      },
      {
        senderId: sam._id,
        recieverId: alex._id,
        text: "¡Hola Alex! Gracias, me encanta la app",
      },
      {
        senderId: alex._id,
        recieverId: sam._id,
        text: "Es una aplicación de chat en tiempo real muy simple",
      },
      {
        senderId: sam._id,
        recieverId: alex._id,
        text: "La interfaz es muy intuitiva, me gusta mucho 😊",
      },
      {
        senderId: alex._id,
        recieverId: sam._id,
        text: "Puedes enviar mensajes de texto y también compartir imágenes",
      },
      {
        senderId: sam._id,
        recieverId: alex._id,
        text: "¿De verdad? ¡Que genial! Probaré con imágenes luego",
      },
      {
        senderId: alex._id,
        recieverId: sam._id,
        text: "También tenemos tema oscuro/claro entre otros, puedes cambiarlo en la configuración ⚙️",
      },
      {
        senderId: sam._id,
        recieverId: alex._id,
        text: "Perfecto, ¡esta app es exactamente lo que necesitaba!",
      },
    ];

    await Message.insertMany(messages);
    console.log("Conversación de ejemplo creada");

    console.log(
      "✅ Base de datos seeded exitosamente con 2 usuarios en conversación",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
};

seedData();
