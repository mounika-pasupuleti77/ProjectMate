const Skill = require('../models/Skill');

// Default fallback list of pre-defined skills
const DEFAULT_SKILLS = [
  { name: 'Java', category: 'Programming Languages' },
  { name: 'Python', category: 'Programming Languages' },
  { name: 'C', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages' },
  { name: 'JavaScript', category: 'Programming Languages' },
  { name: 'TypeScript', category: 'Programming Languages' },
  { name: 'React', category: 'Frontend Web' },
  { name: 'Node.js', category: 'Backend Web' },
  { name: 'Express', category: 'Backend Web' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'SQL', category: 'Database' },
  { name: 'HTML', category: 'Frontend Web' },
  { name: 'CSS', category: 'Frontend Web' },
  { name: 'Machine Learning', category: 'AI & Data' },
  { name: 'Deep Learning', category: 'AI & Data' },
  { name: 'NLP', category: 'AI & Data' },
  { name: 'Computer Vision', category: 'AI & Data' },
  { name: 'Data Science', category: 'AI & Data' },
  { name: 'UI/UX', category: 'Design' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'Android', category: 'Mobile' },
  { name: 'Cloud', category: 'DevOps & Infrastructure' },
  { name: 'DevOps', category: 'DevOps & Infrastructure' },
  { name: 'Git', category: 'Version Control' },
  { name: 'GitHub', category: 'Version Control' }
];

// @desc Get all skills
// @route GET /api/skills
// @access Public
const getSkills = async (req, res) => {
  try {
    let skills = await Skill.find().sort({ name: 1 });
    
    // Auto-seed default skills if database is empty
    if (skills.length === 0) {
      skills = await Skill.insertMany(DEFAULT_SKILLS);
    }
    
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create skill (Admin only)
// @route POST /api/skills
// @access Private (Admin)
const createSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const existing = await Skill.findOne({ name: new RegExp(`^${name}$`, 'i') });

    if (existing) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    const skill = await Skill.create({ name, category, description });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update skill
// @route PUT /api/skills/:id
// @access Private (Admin)
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    skill.name = req.body.name || skill.name;
    skill.category = req.body.category || skill.category;
    skill.description = req.body.description !== undefined ? req.body.description : skill.description;

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete skill
// @route DELETE /api/skills/:id
// @access Private (Admin)
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    await skill.deleteOne();
    res.json({ message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
};
