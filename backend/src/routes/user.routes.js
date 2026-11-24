const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { AppError } = require('../middlewares/errorHandler.middleware');

const router = express.Router();

const requireAdmin =
  typeof authMiddleware.authorize === 'function'
    ? authMiddleware.authorize('admin')
    : (req, _res, next) => {
        if (!req.user || req.user.role !== 'admin') {
          return next(new AppError('Accès refusé : rôle administrateur requis', 403));
        }
        return next();
      };

router.use(authMiddleware.authenticate, requireAdmin);

router.get('/', userController.list);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.patch('/:id/status', userController.updateStatus);
router.delete('/:id', userController.remove);

module.exports = router;
