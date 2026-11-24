const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const env = require('../config/env');
const { User } = require('../models/User.model');
const { AppError } = require('../middlewares/errorHandler.middleware');

const TWO_FA_TEMP_TOKEN_EXPIRY = '5m';
const SIX_DIGIT_CODE_REGEX = /^\d{6}$/;

function sanitizeUser(user) {
  if (!user) {
    return null;
  }
  const obj = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.__v;
  return obj;
}

function generateTempTwoFactorToken(user) {
  return jwt.sign(
    {
      sub: String(user._id || user.id),
      email: user.email,
      role: user.role,
      purpose: '2fa_pending'
    },
    env.jwtSecret,
    { expiresIn: TWO_FA_TEMP_TOKEN_EXPIRY }
  );
}

function verifyTempTwoFactorToken(tempToken) {
  if (!tempToken || typeof tempToken !== 'string') {
    throw new AppError('Token temporaire 2FA manquant', 401);
  }

  try {
    const decoded = jwt.verify(tempToken.trim(), env.jwtSecret);
    if (decoded.purpose !== '2fa_pending') {
      throw new AppError('Token temporaire 2FA invalide', 401);
    }
    return decoded;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Session 2FA expirée : veuillez vous reconnecter', 401);
    }
    throw new AppError('Token temporaire 2FA invalide', 401);
  }
}

function verifyTotpCode(secretBase32, code) {
  const cleanCode = typeof code === 'string' ? code.replace(/\s+/g, '') : String(code || '').trim();
  if (!secretBase32 || !SIX_DIGIT_CODE_REGEX.test(cleanCode)) {
    return false;
  }

  return speakeasy.totp.verify({
    secret: secretBase32,
    encoding: 'base32',
    token: cleanCode,
    window: 1
  });
}

async function setupTwoFactor(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  const secret = speakeasy.generateSecret({
    length: 20,
    name: `${env.twoFaIssuer} (${user.email})`,
    issuer: env.twoFaIssuer
  });

  user.twoFactorSecret = secret.base32;
  await user.save();

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
    qrCodeDataUrl
  };
}

async function enableTwoFactor(userId, code) {
  if (!code) {
    throw new AppError('Le code de vérification 2FA à 6 chiffres est obligatoire', 400);
  }

  const user = await User.findById(userId).select('+twoFactorSecret');
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }
  if (!user.twoFactorSecret) {
    throw new AppError('Veuillez d\'abord initialiser la 2FA (/api/auth/2fa/setup)', 400);
  }

  const valid = verifyTotpCode(user.twoFactorSecret, code);
  if (!valid) {
    throw new AppError('Code 2FA invalide ou expiré', 401);
  }

  user.twoFactorEnabled = true;
  await user.save();

  return sanitizeUser(user);
}

async function disableTwoFactor(userId, code) {
  if (!code) {
    throw new AppError('Le code 2FA actuel est obligatoire pour désactiver la 2FA', 400);
  }

  const user = await User.findById(userId).select('+twoFactorSecret');
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }
  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new AppError('La double authentification n\'est pas activée sur ce compte', 400);
  }

  const valid = verifyTotpCode(user.twoFactorSecret, code);
  if (!valid) {
    throw new AppError('Code 2FA invalide ou expiré', 401);
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = null;
  await user.save();

  return sanitizeUser(user);
}

async function verifyTwoFactorLogin({ tempToken, code }, generateFinalToken) {
  if (!code) {
    throw new AppError('Le code 2FA à 6 chiffres est obligatoire', 400);
  }

  const decoded = verifyTempTwoFactorToken(tempToken);
  const user = await User.findById(decoded.sub).select('+twoFactorSecret');

  if (!user || user.isActive === false) {
    throw new AppError('Compte introuvable ou désactivé', 401);
  }
  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new AppError('La double authentification n\'est pas configurée pour ce compte', 400);
  }

  const valid = verifyTotpCode(user.twoFactorSecret, code);
  if (!valid) {
    throw new AppError('Code 2FA invalide ou expiré', 401);
  }

  const token = generateFinalToken(user);

  return {
    token,
    user: sanitizeUser(user)
  };
}

module.exports = {
  TWO_FA_TEMP_TOKEN_EXPIRY,
  SIX_DIGIT_CODE_REGEX,
  generateTempTwoFactorToken,
  verifyTempTwoFactorToken,
  verifyTotpCode,
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactorLogin
};
