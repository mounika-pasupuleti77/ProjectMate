const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  recommendTeammates
} = require('../controllers/projectController');
const { getProjectTasks, createTask } = require('../controllers/taskController');
const { getProjectMilestones, createMilestone } = require('../controllers/milestoneController');
const { connectGitHubRepo, getGitHubInfo } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

// SMART TEAMMATE RECOMMENDATION ROUTE
router.get('/:projectId/recommend-teammates', protect, recommendTeammates);

// Nested Task & Milestone routes for project
router.get('/:projectId/tasks', protect, getProjectTasks);
router.post('/:projectId/tasks', protect, createTask);

router.get('/:projectId/milestones', protect, getProjectMilestones);
router.post('/:projectId/milestones', protect, createMilestone);

// GitHub routes
router.post('/:projectId/github', protect, connectGitHubRepo);
router.get('/:projectId/github', protect, getGitHubInfo);

module.exports = router;
