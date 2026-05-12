import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";


// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set access token in httpOnly cookie (15 minutes)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token in httpOnly cookie (7 days)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
      accessToken,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set access token in httpOnly cookie (15 minutes)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token in httpOnly cookie (7 days)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};





// LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    // Clear both token cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// REFRESH TOKEN
export const refreshTokenController = async (req, res) => {
  try {
    let token;

    // Get refresh token from Bearer header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Get refresh token from cookies if not in header
    if (!token && req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.id);

    // Set new access token in httpOnly cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token refresh failed",
      error: error.message,
    });
  }
};
