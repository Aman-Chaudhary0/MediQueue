import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
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
      return res.status(401).json({
        message: "Not authorized",
      });
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

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token failed",
    });
  }
};