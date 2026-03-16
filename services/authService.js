/**
 * GradPath — Authentication Service
 * Business logic for login, registration, token refresh, MFA.
 */

const { User } = require('../database');
const { jwt: jwtService, password: passwordService, mfa: mfaService } = require('../auth');
const logger = require('../logging/logger');
const { encrypt } = require('../security/encryption');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

class AuthService {
  /**
   * Register a new user.
   */
  async register({ firstName, lastName, email, password, role }) {
    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    }

    // Validate password strength
    const strength = passwordService.validatePasswordStrength(password);
    if (!strength.valid) {
      throw Object.assign(new Error(strength.errors.join('. ')), { statusCode: 400 });
    }

    // Hash password
    const hashedPassword = await passwordService.hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    logger.info('User registered', { userId: user._id, role });

    const tokens = jwtService.generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Store hashed refresh token
    user.refreshToken = encrypt(tokens.refreshToken);
    await user.save();

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  /**
   * Authenticate a user with email + password.
   */
  async login({ email, password, mfaToken }) {
    const user = await User.findOne({ email }).select('+password +mfaSecret');
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    // Check lock
    if (user.isLocked()) {
      logger.warn('Login attempt on locked account', { email });
      throw Object.assign(new Error('Account is temporarily locked. Try again later.'), {
        statusCode: 423,
      });
    }

    // Verify password
    const isMatch = await passwordService.comparePassword(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        logger.warn('Account locked due to failed attempts', { email });
      }
      await user.save();
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    // Check MFA
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return { requiresMFA: true, message: 'MFA token required' };
      }
      const isValidMFA = mfaService.verifyMFAToken(mfaToken, user.mfaSecret);
      if (!isValidMFA) {
        throw Object.assign(new Error('Invalid MFA token'), { statusCode: 401 });
      }
    }

    // Check account active
    if (!user.isActive) {
      throw Object.assign(new Error('Account is deactivated'), { statusCode: 403 });
    }

    // Reset failed attempts
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    const tokens = jwtService.generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    user.refreshToken = encrypt(tokens.refreshToken);
    await user.save();

    logger.info('User logged in', { userId: user._id, role: user.role });

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  /**
   * Refresh an access token using a valid refresh token.
   */
  async refreshToken(refreshToken) {
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw Object.assign(new Error('User not found or inactive'), { statusCode: 401 });
    }

    const tokens = jwtService.generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    user.refreshToken = encrypt(tokens.refreshToken);
    await user.save();

    return tokens;
  }

  /**
   * Logout — invalidate refresh token.
   */
  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    logger.info('User logged out', { userId });
  }

  /**
   * Enable MFA for a user.
   */
  async enableMFA(userId) {
    const user = await User.findById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    const mfaData = await mfaService.generateMFASecret(user.email);
    user.mfaSecret = encrypt(mfaData.secret);
    user.mfaEnabled = true;
    await user.save();

    logger.info('MFA enabled', { userId });
    return { qrDataUrl: mfaData.qrDataUrl };
  }

  /**
   * Disable MFA for a user.
   */
  async disableMFA(userId, mfaToken) {
    const user = await User.findById(userId).select('+mfaSecret');
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    // Require valid token to disable
    const isValid = mfaService.verifyMFAToken(mfaToken, user.mfaSecret);
    if (!isValid) {
      throw Object.assign(new Error('Invalid MFA token'), { statusCode: 401 });
    }

    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    await user.save();

    logger.info('MFA disabled', { userId });
  }
}

module.exports = new AuthService();
