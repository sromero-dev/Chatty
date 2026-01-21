# Changelog - Optimizaciones Avanzadas

## 🚀 Nuevas Características Implementadas

### 1. **Rate Limiting**

- **Archivos creados:** `backend/src/lib/rateLimiter.js`
- **Endpoints protegidos:**
  - `POST /api/auth/signup` - Máx 3 registros por IP por hora
  - `POST /api/auth/login` - Máx 5 intentos por IP cada 15 minutos
  - `POST /api/messages/send` - Máx 30 mensajes por minuto
- **Beneficio:** Previene ataques de fuerza bruta y spam

### 2. **Validación Global con Express-Validator**

- **Archivo creado:** `backend/src/lib/validators.js`
- **Validaciones implementadas:**
  - Email: Formato válido + normalización
  - Nombre: 2-50 caracteres
  - Contraseña: Mínimo 6 caracteres + mayúscula + minúscula + número
- **Middleware:** `handleValidationErrors` en rutas de auth

### 3. **Paginación en Mensajes**

- **Archivo modificado:** `backend/src/controller/message.controller.js`
- **Parámetros de query:**
  - `page` - Número de página (default: 1)
  - `limit` - Mensajes por página (default: 50)
- **Response estructura:**
  ```json
  {
    "messages": [...],
    "pagination": {
      "current": 1,
      "limit": 50,
      "total": 250,
      "pages": 5
    }
  }
  ```
- **Beneficio:** Mejor performance con muchos mensajes

### 4. **Compresión de Imágenes**

- **Librería:** `sharp`
- **Características:**
  - Detecta imágenes > 1MB automáticamente
  - Redimensiona a máximo 1000x1000
  - Compresión JPEG con calidad 80
  - Logs de antes/después
- **Archivo modificado:** `backend/src/controller/message.controller.js`

### 5. **Logging Estructurado con Winston**

- **Archivo creado:** `backend/src/lib/logger.js`
- **Características:**
  - Logs en archivos: `logs/error.log`, `logs/combined.log`
  - Consola coloreada en desarrollo
  - Timestamps en cada log
  - Stack traces para errores
- **Eventos registrados:**
  - Signup/Login/Logout exitosos
  - Mensajes enviados
  - Errores en operaciones
  - Recuperación de datos

---

## 📊 Resumen de Cambios

| Componente              | Cambios                   |
| ----------------------- | ------------------------- |
| **Rate Limiting**       | Protege auth y mensajes   |
| **Validación**          | Email, nombre, contraseña |
| **Paginación**          | Mensajes con metadata     |
| **Compresión Imágenes** | Sharp + Cloudinary        |
| **Logging**             | Winston + archivos        |

---

## 🔧 Cómo Usar

### Frontend - Paginación

```javascript
// Obtener página 2 con 25 mensajes
const res = await axiosInstance.get(`/messages/${userId}?page=2&limit=25`);

console.log(res.data.pagination);
// { current: 2, limit: 25, total: 250, pages: 10 }
```

### Archivos de Logs

```bash
# Ver logs en tiempo real
tail -f backend/logs/combined.log

# Ver solo errores
tail -f backend/logs/error.log
```
