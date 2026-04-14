const { OpenAI } = require('openai');
const appointmentsService = require('./appointmentsService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Genera las instrucciones del sistema incluyendo el nombre del paciente autenticado.
 */
function buildInstructions(patientName) {
  return `Eres un asistente virtual amigable y profesional especializado en agendamiento médico.

El paciente autenticado en esta sesión es: ${patientName}.
Ya conoces su nombre, NO lo solicites en ningún momento.

Puedes ayudar al paciente a:
- Agendar una nueva cita médica
- Consultar sus citas existentes
- Modificar la fecha u hora de una cita
- Eliminar o cancelar una cita

Reglas importantes:
1. Siempre responde en español de forma amable y profesional.
2. Para agendar una cita solo necesitas: fecha (YYYY-MM-DD), hora (HH:MM) y motivo. Nada más.
3. NO preguntes el nombre del paciente ni el médico o especialista.
4. Para modificar o eliminar, primero consulta la lista para obtener el ID exacto.
5. Cuando muestres citas, preséntalas de forma clara y organizada.
6. Confirma siempre las acciones con los detalles de la cita.`;
}

const TOOLS = [
  {
    type: 'function',
    name: 'create_appointment',
    description: 'Crea una nueva cita médica para el paciente autenticado',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Fecha de la cita en formato YYYY-MM-DD (ej: 2025-04-20)',
        },
        time: {
          type: 'string',
          description: 'Hora de la cita en formato HH:MM (ej: 14:30)',
        },
        reason: {
          type: 'string',
          description: 'Motivo o descripción de la consulta médica',
        },
      },
      required: ['date', 'time', 'reason'],
    },
  },
  {
    type: 'function',
    name: 'get_appointments',
    description: 'Obtiene las citas médicas del paciente autenticado',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    type: 'function',
    name: 'update_appointment',
    description: 'Actualiza la fecha, hora o motivo de una cita existente',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID único de la cita a actualizar',
        },
        date: {
          type: 'string',
          description: 'Nueva fecha en formato YYYY-MM-DD (opcional)',
        },
        time: {
          type: 'string',
          description: 'Nueva hora en formato HH:MM (opcional)',
        },
        reason: {
          type: 'string',
          description: 'Nuevo motivo de la consulta (opcional)',
        },
      },
      required: ['id'],
    },
  },
  {
    type: 'function',
    name: 'delete_appointment',
    description: 'Elimina o cancela una cita médica',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID único de la cita a eliminar',
        },
      },
      required: ['id'],
    },
  },
];

/**
 * Ejecuta la función de herramienta solicitada por OpenAI.
 * El patientName se inyecta aquí, el modelo nunca necesita pedirlo.
 */
async function executeToolCall(name, args, patientName) {
  switch (name) {
    case 'create_appointment':
      return appointmentsService.createAppointment({
        patientName,
        date: args.date,
        time: args.time,
        reason: args.reason,
        doctor: 'Por asignar',
      });

    case 'get_appointments':
      return appointmentsService.getAppointments(patientName);

    case 'update_appointment': {
      const { id, ...updates } = args;
      const updated = appointmentsService.updateAppointment(id, updates);
      return updated
        ? { success: true, appointment: updated }
        : { success: false, error: 'Cita no encontrada con ese ID' };
    }

    case 'delete_appointment': {
      const deleted = appointmentsService.deleteAppointment(args.id);
      return deleted
        ? { success: true, message: 'Cita eliminada exitosamente' }
        : { success: false, error: 'Cita no encontrada con ese ID' };
    }

    default:
      return { error: `Herramienta desconocida: ${name}` };
  }
}

function extractTextFromResponse(response) {
  const messageItems = response.output.filter((item) => item.type === 'message');
  return messageItems
    .map((item) =>
      item.content
        .filter((c) => c.type === 'output_text')
        .map((c) => c.text)
        .join('')
    )
    .join('');
}

/**
 * Procesa un mensaje usando la Responses API de OpenAI con tool calling.
 *
 * @param {Array}  conversationHistory - Historial de mensajes { role, content }
 * @param {string} userMessage         - Mensaje actual del usuario
 * @param {string} patientName         - Nombre del paciente autenticado (del JWT)
 */
async function processMessage(conversationHistory, userMessage, patientName) {
  const instructions = buildInstructions(patientName);

  const input = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  const response = await openai.responses.create({
    model: 'gpt-4o',
    instructions,
    input,
    tools: TOOLS,
  });

  const toolCalls = response.output.filter((item) => item.type === 'function_call');

  let assistantMessage;

  if (toolCalls.length > 0) {
    const toolResults = [];
    for (const toolCall of toolCalls) {
      const args = JSON.parse(toolCall.arguments);
      const result = await executeToolCall(toolCall.name, args, patientName);
      toolResults.push({
        type: 'function_call_output',
        call_id: toolCall.call_id,
        output: JSON.stringify(result),
      });
    }

    const finalResponse = await openai.responses.create({
      model: 'gpt-4o',
      instructions,
      input: [...input, ...response.output, ...toolResults],
      tools: TOOLS,
    });

    assistantMessage = extractTextFromResponse(finalResponse);
  } else {
    assistantMessage = extractTextFromResponse(response);
  }

  const updatedHistory = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: assistantMessage },
  ];

  return { message: assistantMessage, history: updatedHistory };
}

module.exports = { processMessage };
