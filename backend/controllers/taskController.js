const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc Get tasks for a project
// @route GET /api/projects/:projectId/tasks
// @access Private
const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email department avatar')
      .populate('assignedBy', 'name email')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create task for a project
// @route POST /api/projects/:projectId/tasks
// @access Private
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      project: req.params.projectId,
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      assignedBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'To Do',
      dueDate: dueDate || null
    });

    if (assignedTo) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        title: 'New Task Assigned',
        message: `You have been assigned task "${title}" in project "${project.title}"`,
        type: 'TASK_ASSIGNED',
        link: `/tasks?projectId=${project._id}`
      });
    }

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email department avatar')
      .populate('assignedBy', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = req.body.title || task.title;
    task.description = req.body.description !== undefined ? req.body.description : task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
    if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo;

    const updatedTask = await task.save();
    const populated = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'name email department avatar')
      .populate('assignedBy', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask
};
