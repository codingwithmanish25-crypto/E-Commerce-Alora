import UserAuth from "../models/UserAuth.models.js"; // <- match the real filename & casing exactly
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// ==========================================
// 1. REGISTER USER (Updated with Phone & Uppercase Name)
// ==========================================
export const register = async (req, res, next) => {
  try {
    // FIX: req.body se 'phone' ko bhi destructure kiya
    const { name, email, password, phone } = req.body; 
    
    // Check if phone was sent from frontend/client
    if (!phone) {
      return res.status(400).json({ message: 'Phone number zaroori hai!' });
    }

    // Email double registration check
    let userExists = await UserAuth.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered.' });

    // Phone double registration check (Kyunki schema me unique: true hai)
    let phoneExists = await UserAuth.findOne({ phone });
    if (phoneExists) return res.status(400).json({ message: 'Phone number already registered.' });

    // FIX: Name ko uppercase (.toUpperCase()) karke database me save kar rahe hain
    const user = await UserAuth.create({ 
      name: name.toUpperCase(), 
      email, 
      password, 
      phone 
    });

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    next(error);
  }
};

// ==========================================
// 2. LOGIN USER
// ==========================================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserAuth.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);
    
    // Response me user object ke sath user.phone ko bhi bhej diya hai taaki frontend use use kar sake
    res.status(200).json({ 
      message: 'Login successful!', 
      token, 
      user: { 
        name: user.name, 
        email: user.email,
        phone: user.phone 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    next(error);
  }
};

// 3. FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await UserAuth.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user found with this email.' });

    const token = crypto.randomBytes(32).toString('hex');
    
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://127.0.0.1:5500/frontend/reset-password.html?token=${token}`;

    return res.status(200).json({ 
      message: 'Reset token generated successfully!',
      resetUrl 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; 
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    const user = await UserAuth.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token. User not found with this token.' });
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ 
        message: 'Token has expired.', 
        expiryTime: user.resetTokenExpiry, 
        currentTime: Date.now() 
      });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    
    await user.save();

    return res.status(200).json({ message: 'Password reset successful!' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};