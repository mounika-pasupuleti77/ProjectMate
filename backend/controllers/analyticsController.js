const User = require('../models/User');
const Project = require('../models/Project');
const Team = require('../models/Team');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');

// @desc Get platform dashboard statistics
// @route GET /api/analytics/dashboard
// @access Private
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'guide' });
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: { $ne: 'Completed' } });
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const totalTeams = await Team.countDocuments();

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    const totalMilestones = await Milestone.countDocuments();
    const completedMilestones = await Milestone.countDocuments({ status: 'Completed' });

    // Domain distribution breakdown
    const domainStats = await Project.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } }
    ]);

    // Status breakdown
    const statusStats = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totals: {
        totalStudents,
        totalFaculty,
        totalProjects,
        activeProjects,
        completedProjects,
        totalTeams,
        totalTasks,
        completedTasks,
        taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        totalMilestones,
        completedMilestones,
        milestoneCompletionRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
      },
      domainStats: domainStats.map(d => ({ domain: d._id || 'Other', count: d.count })),
      statusStats: statusStats.map(s => ({ status: s._id, count: s.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get analytics for specific project
// @route GET /api/analytics/project/:projectId
// @access Private
const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate('team');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name');
    const milestones = await Milestone.find({ project: projectId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const toDoTasks = tasks.filter(t => t.status === 'To Do').length;

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'Completed').length;

    // Member task distribution
    const memberContributionsMap = {};
    tasks.forEach(t => {
      const name = t.assignedTo ? t.assignedTo.name : 'Unassigned';
      if (!memberContributionsMap[name]) {
        memberContributionsMap[name] = { name, total: 0, completed: 0 };
      }
      memberContributionsMap[name].total += 1;
      if (t.status === 'Completed') {
        memberContributionsMap[name].completed += 1;
      }
    });

    const memberContributions = Object.values(memberContributionsMap);

    res.json({
      project: {
        _id: project._id,
        title: project.title,
        progress: project.progress,
        status: project.status
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        toDo: toDoTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      milestones: {
        total: totalMilestones,
        completed: completedMilestones,
        completionRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
      },
      memberContributions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlatformAnalytics,
  getProjectAnalytics
};
