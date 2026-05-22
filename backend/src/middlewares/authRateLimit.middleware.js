import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const buildJsonHandler = (message) => ({
  success: false,
  message,
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: buildJsonHandler("Too many login attempts from this IP. Please try again in 15 minutes."),
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: buildJsonHandler("Too many password reset requests from this IP. Please try again in 15 minutes."),
});

export const authenticatedApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?._id) {
      return `user:${req.user._id.toString()}`;
    }

    return `ip:${ipKeyGenerator(req.ip)}`;
  },
  message: buildJsonHandler("Too many API requests. Please slow down and try again shortly."),
});
