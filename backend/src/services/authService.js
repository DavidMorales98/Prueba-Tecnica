const jwt = require('jsonwebtoken');

// Usuario del sistema (paciente)
const FAKE_USERS = [
  { id: '1', username: '19881480', password: '123456', name: 'David Morales' },
];

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_default_cambiar';
const JWT_EXPIRES_IN = '8h';

/**
 * Valida credenciales y genera un fake JWT
 */
function login(username, password) {
  const user = FAKE_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return null;
  }

  const payload = {
    userId: user.id,
    username: user.username,
    name: user.name,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    user: { id: user.id, username: user.username, name: user.name },
  };
}

/**
 * Verifica y decodifica un JWT
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { login, verifyToken };
