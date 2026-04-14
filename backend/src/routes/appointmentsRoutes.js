const express = require('express');
const controller = require('../controllers/appointmentsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas de citas requieren autenticación
router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
