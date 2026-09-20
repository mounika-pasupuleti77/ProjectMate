const User = require('../models/User');

// @desc Get faculty guide directory
// @route GET /api/guides
// @access Private
const getGuides = async (req, res) => {
  try {
    const { department, search, expertise } = req.query;

    let query = { role: 'guide' };

    if (department && department !== 'All') query.department = department;
    if (expertise) query.skills = { $in: [new RegExp(expertise, 'i')] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const guides = await User.find(query).select('-password');
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get guide details by ID
// @route GET /api/guides/:id
// @access Private
const getGuideById = async (req, res) => {
  try {
    const guide = await User.findOne({ _id: req.params.id, role: 'guide' }).select('-password');
    if (!guide) {
      return res.status(404).json({ message: 'Faculty Guide not found' });
    }
    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGuides,
  getGuideById
};
