# Chatbot de Agendamiento Medico - Chatbot de Agendamiento Médico

Aplicación web full-stack para agendamiento médico mediante un chatbot inteligente con OpenAI.

## Tecnologías

| Capa | Tecnologías |
|------|------------|
| Frontend | Vue 3 + TypeScript, Pinia, Vue Router, Socket.io-client, Vite |
| Backend | Node.js, Express, Socket.io, OpenAI Responses API, JWT, JSON file DB |

## Características

- **Login** con autenticación JWT simulada
- **Chat en tiempo real** mediante Socket.io
- **Chatbot inteligente** con OpenAI Responses API + Tool Calling
- **CRUD completo** de citas médicas (agendar, listar, modificar, cancelar)
- **Base de datos** en archivo JSON
- **Sidebar** con visualización de citas en tiempo real

---

## Inicio rápido

### Opción A: Script todo-en-uno (Recomendado)

```
Doble clic en start-all.bat
```

El script:
1. Detecta si existe el `.env` del backend
2. Solicita la API Key de OpenAI si no está configurada
3. Instala dependencias de ambos proyectos
4. Inicia backend y frontend en ventanas separadas
5. Abre el navegador automáticamente en `http://localhost:5173`

### Opción B: Scripts individuales

```bash
# Terminal 1 - Backend
start-backend.bat

# Terminal 2 - Frontend
start-frontend.bat
```

### Opción C: Manual

**Backend**

```bash
cd backend
# Crear .env
cp .env.example .env
# Editar .env y agregar tu OPENAI_API_KEY

npm install
npm start
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## Variables de entorno

Archivo `backend/.env`:

```env
PORT=3001
OPENAI_API_KEY=sk-proj-...    # Tu API Key de OpenAI
JWT_SECRET=tu_secreto_aqui
FRONTEND_URL=http://localhost:5173
```

---

## Credenciales de prueba

| Usuario | Contraseña |
|---------|-----------|
| admin | admin123 |
| medico | medico123 |

---

## Estructura del proyecto

```
Prueba Tecnica/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Lógica de request/response HTTP
│   │   │   ├── authController.js
│   │   │   └── appointmentsController.js
│   │   ├── routes/             # Definición de rutas Express
│   │   │   ├── authRoutes.js
│   │   │   └── appointmentsRoutes.js
│   │   ├── services/           # Lógica de negocio
│   │   │   ├── authService.js      (JWT fake)
│   │   │   ├── appointmentsService.js  (CRUD + JSON DB)
│   │   │   └── openaiService.js    (Responses API + Tool Calling)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   (Verificación JWT)
│   │   ├── socket/
│   │   │   └── chatSocket.js       (Socket.io + historial por sesión)
│   │   ├── data/
│   │   │   └── appointments.json   (Base de datos)
│   │   └── index.js               (Entry point)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatMessage.vue       (Burbuja de mensaje)
│   │   │   ├── ChatInput.vue         (Input con autoexpand)
│   │   │   ├── TypingIndicator.vue   (Animación de escritura)
│   │   │   └── AppointmentsSidebar.vue (Lista de citas)
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   └── ChatView.vue
│   │   ├── stores/
│   │   │   ├── authStore.ts    (Pinia - autenticación)
│   │   │   └── chatStore.ts    (Pinia - mensajes y socket)
│   │   ├── services/
│   │   │   ├── authService.ts  (API login + localStorage)
│   │   │   └── socketService.ts (Wrapper Socket.io)
│   │   ├── router/index.ts     (Vue Router + guards)
│   │   └── types/index.ts      (Interfaces TypeScript)
│   └── package.json
│
├── start-all.bat       # Inicia todo (recomendado)
├── start-backend.bat
├── start-frontend.bat
└── README.md
```

---

## API REST

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login con usuario/contraseña |
| GET | `/api/auth/me` | Datos del usuario autenticado |

### Citas médicas (requieren JWT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/appointments` | Listar todas las citas |
| GET | `/api/appointments/:id` | Obtener cita por ID |
| POST | `/api/appointments` | Crear nueva cita |
| PUT | `/api/appointments/:id` | Actualizar cita |
| DELETE | `/api/appointments/:id` | Eliminar cita |

### Socket.io (`/chat`)

| Evento (cliente→servidor) | Descripción |
|--------------------------|-------------|
| `user_message` | Enviar mensaje al chatbot |
| `clear_history` | Limpiar historial de conversación |

| Evento (servidor→cliente) | Descripción |
|--------------------------|-------------|
| `bot_message` | Respuesta del chatbot |
| `bot_typing` | Indicador de escritura |
| `history_cleared` | Confirmación de limpieza |

---

## Flujo del chatbot

```
Usuario escribe mensaje
        ↓
  Socket.io → Backend
        ↓
  OpenAI Responses API
  (con Tool Calling)
        ↓
  ¿Requiere acción? → Sí → Ejecuta función CRUD
        ↓                          ↓
       No              Segunda llamada a OpenAI
        ↓                          ↓
  Respuesta de texto ←────────────┘
        ↓
  Socket.io → Frontend
        ↓
  Muestra mensaje en chat
```
