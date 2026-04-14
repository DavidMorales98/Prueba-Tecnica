const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../data/appointments.json');

/**
 * Lee el archivo JSON como base de datos
 */
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { appointments: [] };
  }
}

/**
 * Escribe el archivo JSON
 */
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Obtiene todas las citas, con filtro opcional por nombre de paciente
 */
function getAppointments(patientName) {
  const db = readDB();
  let { appointments } = db;

  if (patientName) {
    const filter = patientName.toLowerCase();
    appointments = appointments.filter((a) =>
      a.patientName.toLowerCase().includes(filter)
    );
  }

  return appointments;
}

/**
 * Obtiene una cita por ID
 */
function getAppointmentById(id) {
  const db = readDB();
  return db.appointments.find((a) => a.id === id) || null;
}

/**
 * Crea una nueva cita
 */
function createAppointment({ patientName, date, time, reason, doctor }) {
  const db = readDB();

  const newAppointment = {
    id: uuidv4(),
    patientName,
    date,
    time,
    reason,
    doctor: doctor || 'Por asignar',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.appointments.push(newAppointment);
  writeDB(db);

  return newAppointment;
}

/**
 * Actualiza una cita existente por ID
 */
function updateAppointment(id, updates) {
  const db = readDB();
  const index = db.appointments.findIndex((a) => a.id === id);

  if (index === -1) {
    return null;
  }

  const allowedFields = ['patientName', 'date', 'time', 'reason', 'doctor', 'status'];
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );

  db.appointments[index] = {
    ...db.appointments[index],
    ...filteredUpdates,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  return db.appointments[index];
}

/**
 * Elimina una cita por ID
 */
function deleteAppointment(id) {
  const db = readDB();
  const index = db.appointments.findIndex((a) => a.id === id);

  if (index === -1) {
    return false;
  }

  db.appointments.splice(index, 1);
  writeDB(db);
  return true;
}

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
