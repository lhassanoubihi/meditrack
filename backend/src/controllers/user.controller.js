const userService = require('../services/user.service');

async function list(req, res, next) {
  try {
    const result = await userService.listUsers(req.query);
    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const user = await userService.createStaffUser(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Compte personnel créé avec succès',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Compte utilisateur mis à jour',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const user = await userService.updateUserStatus(
      req.params.id,
      req.body.isActive,
      req.user && req.user.id
    );
    return res.status(200).json({
      status: 'success',
      message: user.isActive ? 'Compte activé avec succès' : 'Compte désactivé avec succès',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await userService.deleteUser(req.params.id, req.user && req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'Compte utilisateur supprimé'
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  remove
};
