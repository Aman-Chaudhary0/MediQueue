import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";

// check which role access which routes

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Role ${req.user.role} is not allowed`));
    }

    next();
  };
};
