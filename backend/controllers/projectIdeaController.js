const ProjectIdea = require('../models/ProjectIdea');

// @desc Get all project ideas with search and domain/difficulty filtering
// @route GET /api/project-ideas
// @access Public
const getProjectIdeas = async (req, res) => {
  try {
    const { domain, difficulty, search, skill } = req.query;
    let query = {};

    if (domain && domain !== 'All') query.domain = domain;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (skill) query.requiredSkills = { $in: [new RegExp(skill, 'i')] };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const ideas = await ProjectIdea.find(query).populate('createdBy', 'name email department');
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single project idea
// @route GET /api/project-ideas/:id
// @access Public
const getProjectIdeaById = async (req, res) => {
  try {
    const idea = await ProjectIdea.findById(req.params.id).populate('createdBy', 'name email department');
    if (!idea) return res.status(404).json({ message: 'Project idea not found' });
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create project idea
// @route POST /api/project-ideas
// @access Private
const createProjectIdea = async (req, res) => {
  try {
    const { title, description, domain, difficulty, requiredSkills, teamSize, tags } = req.body;

    const idea = await ProjectIdea.create({
      title,
      description,
      domain: domain || 'Web Development',
      difficulty: difficulty || 'Intermediate',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      teamSize: teamSize || 4,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      createdBy: req.user._id
    });

    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update project idea
// @route PUT /api/project-ideas/:id
// @access Private
const updateProjectIdea = async (req, res) => {
  try {
    const idea = await ProjectIdea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Project idea not found' });

    if (idea.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this project idea' });
    }

    idea.title = req.body.title || idea.title;
    idea.description = req.body.description || idea.description;
    idea.domain = req.body.domain || idea.domain;
    idea.difficulty = req.body.difficulty || idea.difficulty;
    idea.teamSize = req.body.teamSize || idea.teamSize;

    if (req.body.requiredSkills) {
      idea.requiredSkills = Array.isArray(req.body.requiredSkills)
        ? req.body.requiredSkills
        : req.body.requiredSkills.split(',').map(s => s.trim());
    }

    if (req.body.tags) {
      idea.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(',').map(t => t.trim());
    }

    const updatedIdea = await idea.save();
    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete project idea
// @route DELETE /api/project-ideas/:id
// @access Private
const deleteProjectIdea = async (req, res) => {
  try {
    const idea = await ProjectIdea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Project idea not found' });

    if (idea.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project idea' });
    }

    await idea.deleteOne();
    res.json({ message: 'Project idea deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjectIdeas,
  getProjectIdeaById,
  createProjectIdea,
  updateProjectIdea,
  deleteProjectIdea
};
