const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['student', 'guide', 'admin'], 
      default: 'student' 
    },
    college: { type: String, default: 'National Institute of Technology' },
    department: { type: String, default: 'Computer Science & Engineering' },
    year: { type: String, default: '4th Year' },
    bio: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    githubUsername: { type: String, default: '' },
    avatar: { type: String, default: '' },
    isApproved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Encrypt password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
