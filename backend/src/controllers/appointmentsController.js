const appointmentsService = require('../services/appointmentsService');

/**
 * GET /api/appointments
 * Query: ?patientName=xxx (opcional)
 */
function getAll(req, res) {
  const { patientName } = req.query;
  const appointments = appointmentsService.getAppointments(patientName);
  return res.json(appointments);
}

/**
 * GET /api/appointments/:id
 */
function getById(req, res) {
  const { id } = req.params;
  const appointment = appointmentsService.getAppointmentById(id);

  if (!appointment) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  return res.json(appointment);
}

/**
 * POST /api/appointments
 * Body: { patientName, date, time, reason, doctor? }
 */
function create(req, res) {
  const { patientName, date, time, reason, doctor } = req.body;

  if (!patientName || !date || !time || !reason) {
    return res.status(400).json({
      error: 'Campos requeridos: patientName, date, time, reason',
    });
  }

  const appointment = appointmentsService.createAppointment({
    patientName,
    date,
    time,
    reason,
    doctor,
  });

  return res.status(201).json(appointment);
}

/**
 * PUT /api/appointments/:id
 * Body: { date?, time?, reason?, doctor?, status? }
 */
function update(req, res) {
  const { id } = req.params;
  const updates = req.body;

  const appointment = appointmentsService.updateAppointment(id, updates);

  if (!appointment) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  return res.json(appointment);
}

/**
 * DELETE /api/appointments/:id
 */
function remove(req, res) {
  const { id } = req.params;
  const deleted = appointmentsService.deleteAppointment(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  return res.status(200).json({ message: 'Cita eliminada exitosamente' });
}

module.exports = { getAll, getById, create, update, remove };
