# Chatbot de Agendamiento Medico

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
OPENAI_API_KEY=sk-proj-...
JWT_SECRET=tu_secreto_aqui
FRONTEND_URL=http://localhost:5173
```

---

## Acceso al sistema

El sistema está configurado para un único paciente:

| RUT | Contraseña |
|-----|-----------|
| 19881480 | 123456 |

---

## Estructura del proyecto

```
Prueba Tecnica/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── appointmentsController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── appointmentsRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js           (JWT fake)
│   │   │   ├── appointmentsService.js   (CRUD + JSON DB)
│   │   │   └── openaiService.js         (Responses API + Tool Calling)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js        (Verificación JWT)
│   │   ├── socket/
│   │   │   └── chatSocket.js            (Socket.io + historial por sesión)
│   │   ├── data/
│   │   │   └── appointments.json        (Base de datos)
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── layouts/
│   │   │   └── AppLayout.vue            (Header compartido)
│   │   ├── components/
│   │   │   ├── ChatMessage.vue
│   │   │   ├── ChatInput.vue
│   │   │   ├── TypingIndicator.vue
│   │   │   └── AppointmentsSidebar.vue
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   └── ChatView.vue
│   │   ├── stores/
│   │   │   ├── authStore.ts
│   │   │   ├── chatStore.ts
│   │   │   └── uiStore.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   └── socketService.ts
│   │   ├── router/index.ts
│   │   └── types/index.ts
│   └── package.json
│
├── start-all.bat
├── start-backend.bat
├── start-frontend.bat
├── .gitignore
└── README.md
```

---

## API REST

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login con RUT y contraseña |
| GET | `/api/auth/me` | Datos del paciente autenticado |

### Citas médicas (requieren JWT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/appointments` | Listar citas |
| GET | `/api/appointments/:id` | Obtener cita por ID |
| POST | `/api/appointments` | Crear cita |
| PUT | `/api/appointments/:id` | Actualizar cita |
| DELETE | `/api/appointments/:id` | Eliminar cita |

### Socket.io (`/chat`)

| Evento (cliente → servidor) | Descripción |
|-----------------------------|-------------|
| `user_message` | Enviar mensaje al asistente |
| `clear_history` | Limpiar historial de conversación |

| Evento (servidor → cliente) | Descripción |
|-----------------------------|-------------|
| `bot_message` | Respuesta del asistente |
| `bot_typing` | Indicador de escritura |
| `history_cleared` | Confirmación de limpieza |

---

## Flujo del chatbot

```
Paciente escribe mensaje
        ↓
  Socket.io → Backend
        ↓
  OpenAI Responses API
  (con Tool Calling)
        ↓
  ¿Requiere acción? → Sí → Ejecuta CRUD
        ↓                        ↓
       No           Segunda llamada a OpenAI
        ↓                        ↓
  Respuesta de texto ←──────────┘
        ↓
  Socket.io → Frontend
```
