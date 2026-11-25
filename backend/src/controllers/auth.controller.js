const authService = require('../services/auth.service');
const twoFactorService = require('../services/twoFactor.service');

async function register(req, res, next) {
  try {
    const user = await authService.registerPatient(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Compte patient créé avec succès',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    if (result.requiresTwoFactor) {
      return res.status(200).json({
        status: 'success',
        message: 'Code 2FA requis pour finaliser la connexion',
        data: {
          requiresTwoFactor: true,
          tempToken: result.tempToken,
          user: result.user
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Connexion réussie',
      data: {
        requiresTwoFactor: false,
        token: result.token,
        user: result.user
      }
    });
  } catch (err) {
    return next(err);
  }
}

function me(req, res) {
  return res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
}

async function setupTwoFactor(req, res, next) {
  try {
    const payload = await twoFactorService.setupTwoFactor(req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'Secret 2FA généré. Scannez le QR code puis confirmez avec un code à 6 chiffres.',
      data: payload
    });
  } catch (err) {
    return next(err);
  }
}

async function enableTwoFactor(req, res, next) {
  try {
    const user = await twoFactorService.enableTwoFactor(req.user.id, req.body?.code);
    return res.status(200).json({
      status: 'success',
      message: 'Double authentification (2FA) activée avec succès',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function disableTwoFactor(req, res, next) {
  try {
    const user = await twoFactorService.disableTwoFactor(req.user.id, req.body?.code);
    return res.status(200).json({
      status: 'success',
      message: 'Double authentification (2FA) désactivée avec succès',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function verifyTwoFactor(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const bearerTemp =
      authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const tempToken = req.body?.tempToken || bearerTemp;

    const result = await authService.verifyTwoFactorLogin({
      tempToken,
      code: req.body?.code
    });

    return res.status(200).json({
      status: 'success',
      message: 'Vérification 2FA réussie',
      data: result
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  me,
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactor
};
