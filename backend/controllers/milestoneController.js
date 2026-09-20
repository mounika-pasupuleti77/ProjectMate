const Milestone = require('../models/Milestone');
const Project = require('../models/Project');

// @desc Get milestones for a project
// @route GET /api/projects/:projectId/milestones
// @access Private
const getProjectMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ project: req.params.projectId })
      .sort({ dueDate: 1, createdAt: 1 });

    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create milestone for project
// @route POST /api/projects/:projectId/milestones
// @access Private
const createMilestone = async (req, res) => {
  try {
    const { title, description, startDate, dueDate, status, progress } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const milestone = await Milestone.create({
      project: req.params.projectId,
      title,
      description: description || '',
      startDate: startDate || null,
      dueDate: dueDate || null,
      status: status || 'Pending',
      progress: progress !== undefined ? progress : (status === 'Completed' ? 100 : 0)
    });

    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update milestone
// @route PUT /api/milestones/:id
// @access Private
const updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.title = req.body.title || milestone.title;
    milestone.description = req.body.description !== undefined ? req.body.description : milestone.description;
    milestone.status = req.body.status || milestone.status;
    if (req.body.progress !== undefined) milestone.progress = req.body.progress;
    if (req.body.startDate !== undefined) milestone.startDate = req.body.startDate;
    if (req.body.dueDate !== undefined) milestone.dueDate = req.body.dueDate;

    if (milestone.status === 'Completed') {
      milestone.progress = 100;
    }

    const updated = await milestone.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete milestone
// @route DELETE /api/milestones/:id
// @access Private
const deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    await milestone.deleteOne();
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjectMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone
};
