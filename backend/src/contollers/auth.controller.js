import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { sendMail } from "../utils/email.js";
import OtpRegistration from "../models/otp.model.js";
import { compareOtp, generateNumericOtp, hashOtp, isValidEmail } from "../utils/otp.js";


// REGISTER (OTP-based, valid emails only)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    // deny already registered users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password for later account creation (after OTP verification)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate OTP and store hashed OTP
    const otp = generateNumericOtp({ digits: 6 });
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OtpRegistration.findOneAndUpdate(
      { email },
      {
        email,
        otpHash,
        name,
        passwordHash,
        role: "patient",
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // Send OTP email (if email fails, do not create user; inform client)
    await sendMail({
      to: email,
      subject: "Your MediQueue OTP",
      text: `Hi ${name},\n\nYour OTP for MediQueue registration is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\n— MediQueue Team`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      email,
    });
  } catch (error) {
    return res.status(500).json({
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





export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }
    if (!otp || typeof otp !== "string") {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    const otpRecord = await OtpRegistration.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isOtpValid = compareOtp({ otp, otpHash: otpRecord.otpHash });
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // create user + patient
    const user = await User.create({
      name: otpRecord.name,
      email,
      password: otpRecord.passwordHash,
      role: otpRecord.role,
    });

    await Patient.create({
      user: user._id,
    });

    // delete otp record
    await OtpRegistration.deleteOne({ email });

    // login (issue tokens + cookies)
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "OTP verified. Registration complete",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
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
