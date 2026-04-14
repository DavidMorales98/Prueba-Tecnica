const { verifyToken } = require('../services/authService');
const { processMessage } = require('../services/openaiService');

/**
 * Inicializa los eventos de Socket.io para el chat.
 * Cada conexión socket mantiene su propio historial de conversación.
 *
 * @param {import('socket.io').Server} io
 */
function initChatSocket(io) {
  // Namespace /chat con autenticación via JWT en handshake
  const chatNsp = io.of('/chat');

  chatNsp.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Token de autenticación requerido'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Token inválido o expirado'));
    }

    socket.user = decoded;
    next();
  });

  chatNsp.on('connection', (socket) => {
    console.log(`[Socket] Usuario conectado: ${socket.user.username} (${socket.id})`);

    // Historial de conversación por sesión de socket
    let conversationHistory = [];

    // Mensaje de bienvenida al conectar
    socket.emit('bot_message', {
      id: Date.now().toString(),
      text: `¡Hola, ${socket.user.name}! Soy tu asistente de agendamiento médico. ¿En qué puedo ayudarte hoy?\n\nPuedo ayudarte a:\n• Agendar una nueva cita\n• Consultar tus citas\n• Modificar una cita\n• Cancelar una cita`,
      timestamp: new Date().toISOString(),
      isBot: true,
    });

    // Evento: usuario envía un mensaje
    socket.on('user_message', async (data) => {
      const { text } = data;

      if (!text || typeof text !== 'string' || !text.trim()) {
        socket.emit('error_message', { error: 'Mensaje vacío' });
        return;
      }

      // Indicador de escritura
      socket.emit('bot_typing', { typing: true });

      try {
        const { message, history } = await processMessage(
          conversationHistory,
          text.trim(),
          socket.user.name
        );

        conversationHistory = history;

        socket.emit('bot_message', {
          id: Date.now().toString(),
          text: message,
          timestamp: new Date().toISOString(),
          isBot: true,
        });
      } catch (error) {
        console.error('[Socket] Error al procesar mensaje:', error.message);
        socket.emit('bot_message', {
          id: Date.now().toString(),
          text: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta nuevamente.',
          timestamp: new Date().toISOString(),
          isBot: true,
          isError: true,
        });
      } finally {
        socket.emit('bot_typing', { typing: false });
      }
    });

    // Evento: limpiar historial de conversación
    socket.on('clear_history', () => {
      conversationHistory = [];
      socket.emit('history_cleared', { message: 'Historial limpiado' });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Usuario desconectado: ${socket.user.username} (${socket.id})`);
    });
  });
}

module.exports = { initChatSocket };
