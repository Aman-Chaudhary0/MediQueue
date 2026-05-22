import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";

// TOKEN VERIFICATION
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Bearer token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check access token from cookies if not in headers
  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new UnauthorizedError("Not authorized");
  }

  // verify access token
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  );

  // attach user
  req.user = await User.findById(decoded.id).select(
    "-password"
  );

  if (!req.user) {
    throw new NotFoundError("User associated with this token was not found");
  }

  next();
});
