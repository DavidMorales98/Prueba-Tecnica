const { login } = require('../services/authService');

/**
 * POST /api/auth/login
 * Body: { username, password }
 */
function loginHandler(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const result = login(username, password);

  if (!result) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  return res.json(result);
}

/**
 * GET /api/auth/me
 * Requiere JWT (authMiddleware)
 */
function meHandler(req, res) {
  return res.json({ user: req.user });
}

module.exports = { loginHandler, meHandler };
