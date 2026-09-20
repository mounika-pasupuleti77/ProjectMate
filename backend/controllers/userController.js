const User = require('../models/User');

// @desc Get all users with optional filtering
// @route GET /api/users
// @access Private
const getUsers = async (req, res) => {
  try {
    const { role, department, skill, search } = req.query;

    let query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/users/:id
// @access Private
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check authorization: user updating own profile or admin
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    user.name = req.body.name || user.name;
    user.college = req.body.college || user.college;
    user.department = req.body.department || user.department;
    user.year = req.body.year || user.year;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.githubUsername = req.body.githubUsername !== undefined ? req.body.githubUsername : user.githubUsername;

    if (req.body.skills) {
      user.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map(s => s.trim());
    }

    if (req.body.interests) {
      user.interests = Array.isArray(req.body.interests)
        ? req.body.interests
        : req.body.interests.split(',').map(i => i.trim());
    }

    if (req.body.isApproved !== undefined && req.user.role === 'admin') {
      user.isApproved = req.body.isApproved;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      college: updatedUser.college,
      department: updatedUser.department,
      year: updatedUser.year,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
      githubUsername: updatedUser.githubUsername,
      isApproved: updatedUser.isApproved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser
};
