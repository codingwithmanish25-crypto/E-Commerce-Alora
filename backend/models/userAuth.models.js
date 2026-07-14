import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google Users
  isGoogleUser: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Agar password modify nahi hua ya fir password exist hi nahi karta (Google Users)
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Agar password nahi hai (Google user trying standard login)
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;