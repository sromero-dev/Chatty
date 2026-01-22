# 📸 Vista Previa de la Aplicación

🔗[Míralo por tu cuenta!](https://chatty-9rg7.onrender.com/signup)

Antes de adentrarnos en los detalles técnicos, te invitamos a explorar visualmente las principales funcionalidades de Chatty:

### 🏠 Pantalla de Inicio

<div align="center">

![Página de Inicio](assets/homepage.png)
_Interfaz de bienvenida donde los usuarios pueden registrarse, iniciar sesión o personalizar la apariencia_

### 🎨 Personalización de Temas

![Homepage con Tema Azul Oscuro](assets/homepage_diff_theme.png)  
_Misma interfaz con un tema azul oscuro aplicado - demuestra la flexibilidad de personalización_

### ⚠️ Validación de Formularios

![Error de Inicio de Sesión](assets/login_err.png)  
_Sistema de validación nativo de React mostrando errores de formulario en tiempo real_

### 💬 Interfaz Principal de Chat

![Interfaz de Chat](assets/message_image.png)  
_Vista principal de la aplicación: barra lateral con usuarios y chat activo con mensajes e imágenes_

### 👤 Gestión de Perfil

![Cambio de Foto de Perfil](assets/pfp_change.png)  
_Sección de perfil donde los usuarios pueden actualizar su información y foto de perfil_

### 🎛️ Panel de Configuración

![Configuración de Temas](assets/settings.png)  
_Panel de selección de temas con vista previa en tiempo real_

### 👥 Lista de Usuarios

![Lista de Usuarios](assets/user_list.png)  
_Vista de la barra lateral mostrando todos los usuarios disponibles para chatear_

</div>

---

# 🚀 Chatty - Aplicación de Chat en Tiempo Real

## 📖 Descripción General

Chatty es una aplicación de chat full-stack en tiempo real construida con tecnologías web modernas. Cuenta con autenticación de usuarios, mensajería instantánea, gestión de perfiles, personalización de temas, moderación de contenido impulsada por IA e indicadores de estado en línea. La aplicación proporciona una experiencia de chat fluida y responsive en todos los dispositivos.

## ✨ Características

### 🔐 Autenticación y Gestión de Usuarios

- Registro y inicio de sesión seguro con JWT
- Subida de fotos de perfil con integración de Cloudinary
- Cifrado de contraseñas con bcrypt
- Rutas y endpoints de API protegidos
- Sesiones persistentes con cookies HTTP-only

### 💬 Mensajería en Tiempo Real

- Entrega instantánea de mensajes con Socket.io
- Estado en línea/fuera de línea de usuarios
- Mensajes de texto e imágenes con almacenamiento en Cloudinary
- Historial de conversaciones con paginación
- Actualizaciones optimistas de UI para una experiencia fluida

### 🛡️ Moderación de Contenido

- **Filtrado de contenido impulsado por IA** usando Google Gemini API
- **Sistema de respaldo local** con listas de palabras ofensivas
- **Moderación de imágenes** usando Gemini Vision API
- Validación de contenido multi-campo (nombres de usuario, mensajes, información de perfil)
- Degradación elegante cuando los servicios de IA no están disponibles

### 🎨 Personalización

- Múltiples temas de UI con componentes DaisyUI
- Soporte para modo claro/oscuro
- Personalización de perfiles
- Diseño responsive para todos los tamaños de pantalla
- Tailwind CSS para estilos modernos

### 📱 Experiencia de Usuario

- Interfaz limpia y moderna con Tailwind CSS
- Estados de carga y manejo de errores
- Notificaciones toast con React Hot Toast
- Actualizaciones optimistas de UI para mensajes
- Navegación intuitiva con React Router

## 🏗️ Stack Tecnológico

### **Frontend**

- **React 19** - Últimas características de React incluyendo hooks
- **Vite** - Herramienta de construcción de próxima generación para desarrollo rápido
- **Tailwind CSS v4** - Framework CSS utility-first
- **DaisyUI** - Librería de componentes para Tailwind CSS
- **Zustand** - Gestión de estado ligera
- **Axios** - Cliente HTTP para llamadas API con interceptores
- **Socket.io-client** - Comunicación WebSocket en tiempo real
- **React Router DOM** - Enrutamiento del lado del cliente
- **Lucide React** - Hermosa librería de iconos
- **React Hot Toast** - Notificaciones toast

### **Backend**

- **Node.js** - Entorno de ejecución JavaScript
- **Express.js 5** - Framework de aplicación web
- **MongoDB** - Base de datos NoSQL para almacenamiento flexible
- **Mongoose** - ODM para MongoDB con validación de esquemas
- **Google Gemini API** - Moderación de contenido impulsada por IA
- **Socket.io** - Comunicación bidireccional basada en eventos en tiempo real
- **JWT** - Tokens web JSON para autenticación segura
- **Bcrypt.js** - Cifrado de contraseñas con salt rounds
- **Cloudinary** - Gestión de imágenes y videos en la nube
- **Sharp** - Procesamiento de imágenes de alto rendimiento
- **Winston** - Librería de logging versátil
- **Express Rate Limit** - Middleware de limitación de tasa
- **Express Validator** - Validación y sanitización de entradas
- **Compression** - Middleware de compresión Gzip
- **Cookie Parser** - Middleware de manejo de cookies

### **Desarrollo y Despliegue**

- **Nodemon** - Reinicio automático del servidor durante el desarrollo
- **Dotenv** - Gestión de variables de entorno
- **CORS** - Middleware de intercambio de recursos de origen cruzado
- **ESLint** - Linting de código para estilo consistente

## 📁 Estructura del Proyecto

```
chatty/
├── frontend/                 # Aplicación React Vite
│   ├── src/
│   │   ├── components/      # Componentes UI reutilizables
│   │   ├── hooks/          # Custom hooks (stores de zustand)
│   │   ├── pages/          # Componentes de página
│   │   ├── lib/            # Archivos de configuración (axios, etc.)
│   │   ├── App.jsx         # Componente raíz con enrutamiento
│   │   └── main.jsx        # Punto de entrada de la aplicación
│   ├── public/             # Archivos estáticos
│   ├── index.html          # Plantilla HTML
│   ├── package.json        # Dependencias del frontend
│   ├── vite.config.js      # Configuración de Vite
│   └── tailwind.config.js  # Configuración de Tailwind CSS
│
├── backend/                 # Servidor Node.js Express
│   ├── controller/         # Manejadores de peticiones
│   │   ├── auth.controller.js
│   │   └── message.controller.js
│   ├── model/              # Modelos de Mongoose
│   │   ├── user.model.js
│   │   └── message.model.js
│   ├── routes/             # Rutas de Express
│   │   ├── auth.route.js
│   │   └── message.route.js
│   ├── middleware/         # Middleware de Express
│   │   └── auth.middleware.js
│   ├── lib/                # Utilidades y configuraciones
│   │   ├── db.js          # Conexión a MongoDB
│   │   ├── socket.js      # Configuración de Socket.io
│   │   ├── cloudinary.js  # Configuración de Cloudinary
│   │   ├── logger.js      # Configuración de logging con Winston
│   │   ├── rateLimiter.js # Limitación de tasa de Express
│   │   ├── validators.js  # Utilidades de validación de entrada
│   │   ├── contentFilter.js # Moderación de contenido con IA
│   │   └── utils.js       # JWT y otras utilidades
│   ├── logs/              # Logs de la aplicación (generados)
│   ├── index.js           # Punto de entrada del servidor
│   ├── package.json       # Dependencias del backend
│   └── .env.example       # Plantilla de variables de entorno
│
└── README.md              # Esta documentación
```

## 🚀 Comenzando

### Prerrequisitos

- **Node.js** (v18 o superior recomendado)
- **MongoDB** (instalación local o cuenta de MongoDB Atlas)
- **Cuenta de Cloudinary** (nivel gratuito disponible para subida de imágenes)
- **Cuenta de Google AI Studio** (para clave API de Gemini - nivel gratuito disponible)
- **Git** (para control de versiones)

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd chatty
   ```

2. **Configurar el Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con tu configuración
   ```

   **Variables de entorno del Backend:**

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chatty
   JWT_SECRET=tu_clave_secreta_jwt_super_secreta_aqui
   CLOUD_NAME=tu_nombre_de_nube_cloudinary
   CLOUDINARY_API_KEY=tu_clave_api_de_cloudinary
   CLOUDINARY_API_SECRET=tu_secreto_api_de_cloudinary
   GEMINI_API_KEY=tu_clave_api_de_google_gemini
   NODE_ENV=development
   ```

4. **Configurar el Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

   **Variables de entorno del Frontend:**

   ```env
   VITE_API_URL=http://localhost:5000
   ```

   **Nota:** El `VITE_API_URL` debe coincidir con el `PORT` del backend

### Ejecutar la Aplicación

#### Modo Desarrollo

1. **Iniciar el servidor backend**

   ```bash
   cd backend
   npm run dev
   ```

2. **Iniciar el servidor de desarrollo frontend**

   ```bash
   cd frontend
   npm run dev
   ```

   La aplicación se abrirá automáticamente en: http://localhost:5173

#### Construcción para Producción

1. **Construir el frontend**

   ```bash
   cd frontend
   npm run build
   ```

2. **Copiar la construcción al backend (para despliegue monolítico)**

   ```bash
   # Desde la raíz del proyecto
   cp -r frontend/dist backend/
   ```

3. **Iniciar el servidor de producción**
   ```bash
   cd backend
   npm start
   ```

## 🔧 Detalles de Configuración

### Configuración de MongoDB

**Opción 1: MongoDB Local**

1. Instalar MongoDB Community Edition
2. Iniciar servicio MongoDB: `mongod`
3. Usar cadena de conexión: `mongodb://localhost:27017/chatty`

**Opción 2: MongoDB Atlas (Recomendado para producción)**

1. Crear cuenta gratuita en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un clúster y usuario de base de datos
3. Obtener cadena de conexión: `mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombrebd`
4. Añadir a `.env` como `MONGO_URI`

### Configuración de Cloudinary

1. Crear cuenta gratuita en [cloudinary.com](https://cloudinary.com)
2. Desde el dashboard, obtener:
   - **Nombre de la Nube**
   - **Clave API**
   - **Secreto API**
3. Añadir estos a tu archivo `.env`

### Configuración de Google Gemini API

1. Visitar [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crear clave API (el nivel gratuito incluye límites generosos)
3. Habilitar la API de Gemini en Google Cloud Console
4. Añadir la clave API a `.env` como `GEMINI_API_KEY`

### Configuración de Socket.io

- Gestión automática de conexión WebSocket
- Autenticación de usuarios mediante tokens JWT
- Respaldo a long-polling HTTP si WebSockets no están disponibles
- Reconexión automática con retroceso exponencial

## 🛡️ Características de Seguridad y Rendimiento

### Limitación de Tasa

Protege contra ataques de fuerza bruta y spam:

- **Registro:** 3 registros por IP por hora
- **Inicio de sesión:** 5 intentos por IP cada 15 minutos
- **Mensajes:** 30 mensajes por minuto por usuario
- **Endpoints API:** Limitación de tasa global en todas las rutas

Configurar en `backend/lib/rateLimiter.js`

### Sistema de Moderación de Contenido

**Filtrado impulsado por IA:**

- Moderación de texto usando Gemini 2.0 Flash
- Análisis de imágenes usando Gemini Vision
- Puntuación de confianza para contenido inapropiado

**Sistema de respaldo local:**

- Lista curada de palabras ofensivas en múltiples idiomas
- Validación de nombres de usuario (2-50 caracteres)
- Detección de contenido severo (pornografía, violencia, drogas, armas)

**Degradación elegante:**

- Cuando la API de Gemini no está disponible (cuota excedida, problemas de red), el sistema recurre a moderación local
- Imágenes demasiado grandes para análisis de IA (>5MB) omiten moderación con advertencia
- Todos los fallos de moderación se registran para monitoreo

### Validación y Sanitización de Entradas

- **Validación de Email:** Compatible con RFC 5322 con patrón regex
- **Requisitos de Contraseña:** Mínimo 6 caracteres con mayúscula, minúscula y número
- **Nombre Completo:** 2-50 caracteres con sanitización
- **Nombre de Usuario:** Alfanumérico con guiones bajos, 3-20 caracteres
- **Longitud de Mensaje:** Máximo 2000 caracteres con recorte

### Procesamiento de Imágenes

1. **Validación de Tamaño:** Máximo 10MB por imagen
2. **Moderación IA:** Análisis con Gemini Vision (omitido si >5MB o API no disponible)
3. **Compresión:** Imágenes >1MB redimensionadas a 1000x1000 con calidad JPEG 80%
4. **Optimización:** Librería Sharp para procesamiento de alto rendimiento
5. **Almacenamiento en la Nube:** Subida a Cloudinary con formato automático y optimización de calidad
6. **Respaldo:** Almacenamiento local en desarrollo si Cloudinary falla

### Sistema de Logging

**Configuración de Winston Logger:**

- **Salida por Consola:** Logs coloreados durante desarrollo
- **Logs en Archivo:** `logs/error.log` (solo errores), `logs/combined.log` (todos los logs)
- **Rotación de Logs:** Rotación diaria con tamaño máximo de archivo
- **Datos Estructurados:** Formato JSON con timestamps, niveles de log e información contextual
- **Seguimiento de Errores:** Seguimiento de pila incluido para todos los errores

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)

- `POST /signup` - Registrar nuevo usuario (limitado por tasa)
- `POST /login` - Inicio de sesión de usuario (limitado por tasa)
- `POST /logout` - Cierre de sesión de usuario (limpia cookie HTTP-only)
- `PUT /update-profile` - Actualizar foto de perfil e información
- `GET /check` - Verificar estado de autenticación y devolver datos de usuario

### Mensajes (`/api/messages`)

- `GET /users` - Obtener todos los usuarios para la barra lateral (excluyendo usuario actual)
- `GET /:id?page=1&limit=50` - Obtener mensajes con paginación
- `POST /send/:id` - Enviar mensaje a usuario (limitado por tasa)

**Parámetros de Consulta para Mensajes:**

- `page` - Número de página (por defecto: 1)
- `limit` - Mensajes por página (por defecto: 50, máximo: 100)

## 🔐 Flujo de Autenticación

1. **Registro/Inicio de sesión:** Usuario envía credenciales mediante HTTPS seguro
2. **Validación:** Servidor valida entrada y verifica usuario existente
3. **Cifrado de Contraseña:** bcrypt cifra contraseña con salt rounds
4. **Generación de JWT:** Servidor crea JWT firmado con ID de usuario y expiración
5. **Almacenamiento de Cookie:** JWT almacenado en cookie HTTP-only y segura
6. **Protección de Rutas:** Middleware valida JWT en rutas protegidas
7. **Autenticación WebSocket:** Mismo JWT usado para autenticar conexión Socket.io
8. **Actualización de Token:** Cliente verifica automáticamente estado de autenticación al cargar página

## 💬 Flujo de Mensajería en Tiempo Real

1. **Composición de Mensaje:** Usuario escribe mensaje o selecciona imagen
2. **Moderación de Contenido:** Texto/imagen analizado por IA Gemini (con respaldo local)
3. **Procesamiento de Imagen:** Si es imagen, se comprime y sube a Cloudinary
4. **Guardado en Base de Datos:** Mensaje guardado en MongoDB con IDs de remitente/receptor
5. **Emisión Socket:** Servidor emite mensaje vía Socket.io al destinatario
6. **Entrega en Tiempo Real:** Destinatario recibe mensaje instantáneamente vía WebSocket
7. **Actualización de UI:** Componentes React se actualizan con renderizado optimista
8. **Confirmación:** Cliente confirma recepción (mejora opcional futura)

## 🛡️ Flujo de Moderación de Contenido

### Moderación de Texto:

```
Entrada de Usuario → Análisis de API Gemini → Análisis de Respuesta JSON → Respaldo Local (si es necesario) → Aprobación/Rechazo
```

### Moderación de Imagen:

```
Subida de Imagen → Conversión Base64 → Verificación de Tamaño (<5MB) → Análisis Gemini Vision →
└─→ Si API falla/cuota: Omitir con advertencia → Compresión de Imagen → Subida a Cloudinary → Guardar URL
```

### Escenarios de Respaldo:

1. **API de Gemini No Disponible:** Usar lista local de palabras ofensivas
2. **Imagen Demasiado Grande (>5MB):** Omitir moderación IA con advertencia en log
3. **Errores de Red:** Permitir contenido con advertencia de seguridad
4. **Errores de Análisis:** Recurrir a validación local

## 🎨 Sistema de Temas

La aplicación usa el sistema de temas de DaisyUI:

1. **Selección de Tema:** Usuarios eligen entre 20+ temas integrados de DaisyUI
2. **Vista Previa en Vivo:** Vista previa de tema en tiempo real en configuraciones
3. **Persistencia:** Tema almacenado en localStorage
4. **Aplicación Instantánea:** Cambios de tema sin recargar página
5. **Responsive:** Todos los temas optimizados para móvil y escritorio

Temas disponibles: light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, autumn, business, acid, lemonade, night, coffee, winter.

## 📱 Soporte de Navegadores

- **Chrome** (últimas 2 versiones)
- **Firefox** (últimas 2 versiones)
- **Safari** (últimas 2 versiones)
- **Edge** (últimas 2 versiones)
- **Navegadores Móviles** (Chrome Mobile, Safari Mobile)

## 🐛 Solución de Problemas

### Problemas Comunes y Soluciones

1. **Error de Conexión a MongoDB**

   ```
   Error: No se pudo conectar a MongoDB
   ```

   **Solución:** Asegurarse que MongoDB esté ejecutándose (`mongod`), verificar cadena de conexión en `.env`, comprobar conectividad de red.

2. **Errores CORS en el Navegador**

   ```
   Error Access-Control-Allow-Origin
   ```

   **Solución:** Verificar que `VITE_API_URL` coincida con el puerto del backend, revisar configuración CORS en `index.js`.

3. **Fallos en Subida de Imágenes**

   ```
   Error de subida a Cloudinary o "PayloadTooLargeError"
   ```

   **Solución:**
   - Verificar credenciales de Cloudinary en `.env`
   - Reducir tamaño de imagen (máximo 10MB)
   - Comprobar conectividad a Internet
   - Revisar dashboard de Cloudinary para límites de cuota

4. **Cuota de API de Gemini Excedida**

   ```
   "Cuota de Gemini excedida" en logs
   ```

   **Solución:**
   - La aplicación usará automáticamente el respaldo local
   - Verificar uso de cuota en Google AI Studio
   - Actualizar a nivel de pago si es necesario
   - La moderación local continuará funcionando

5. **Problemas de Conexión Socket.io**

   ```
   Conexión WebSocket fallida
   ```

   **Solución:** Asegurarse que el backend esté ejecutándose, revisar configuración de firewall, verificar que el token JWT sea válido.

6. **Carga Lenta de Imágenes**
   ```
   Las imágenes tardan mucho en cargar
   ```
   **Solución:** Las imágenes están comprimidas y optimizadas. Verificar tiempos de respuesta de Cloudinary, considerar reducir calidad de imagen en configuración de `sharp`.

### Logs de Desarrollo

**Logs del Backend:**

- Salida por consola en tiempo real durante desarrollo
- Logs detallados en archivos en `backend/logs/`
- Ver logs: `tail -f backend/logs/combined.log`

**Depuración del Frontend:**

- Herramientas de Desarrollo del Navegador (pestañas Consola, Red)
- React DevTools para inspección de componentes
- Monitoreo de peticiones de red para llamadas API

## 📚 Recursos de Aprendizaje

Este proyecto demuestra la implementación práctica de:

- **Desarrollo Full-Stack JavaScript** con stack MERN (MongoDB, Express, React, Node.js)
- **Aplicaciones en Tiempo Real** usando WebSockets con Socket.io
- **Patrones Modernos de React** incluyendo hooks, custom hooks y gestión de estado
- **Integración de IA** con Google Gemini API para características inteligentes
- **Integración de Servicios en la Nube** (Cloudinary, MongoDB Atlas)
- **Mejores Prácticas de Seguridad** (JWT, cookies HTTP-only, limitación de tasa, validación de entrada)
- **Optimización de Rendimiento** (compresión de imágenes, paginación, carga diferida)
- **Manejo de Errores y Resiliencia** (degradación elegante, sistemas de respaldo)

## Posibles Mejoras

### Mejoras Técnicas

- **Migración a TypeScript** para seguridad de tipos
- **Pruebas Unitarias y de Integración** con Jest y React Testing Library
- **Containerización con Docker** para despliegue consistente
- **Pipeline CI/CD** con GitHub Actions
- **Monitoreo de Rendimiento** con métricas y alertas
- **Caché Avanzado** con Redis para datos frecuentemente accedidos
- **Arquitectura de Microservicios** para escalabilidad
- **API GraphQL** como alternativa a REST

---

**¡Feliz Chat! 💬**
