const Project = require('../models/Project');
const Team = require('../models/Team');
const User = require('../models/User');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const { calculateSkillMatch } = require('../utils/matchingAlgorithm');

// @desc Get all projects
// @route GET /api/projects
// @access Private
const getProjects = async (req, res) => {
  try {
    const { status, domain, search, userProjects } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (domain && domain !== 'All') query.domain = domain;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (userProjects === 'true' && req.user) {
      // Find projects owned by user or where user is a team member
      const userTeams = await Team.find({ 'members.user': req.user._id }).select('project');
      const teamProjectIds = userTeams.map(t => t.project);
      query.$or = [
        { owner: req.user._id },
        { guide: req.user._id },
        { _id: { $in: teamProjectIds } }
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email department avatar skills')
      .populate('guide', 'name email department bio')
      .populate({
        path: 'team',
        populate: { path: 'members.user', select: 'name email department skills avatar' }
      })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get project by ID
// @route GET /api/projects/:id
// @access Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email department college year githubUsername avatar skills')
      .populate('guide', 'name email department bio college')
      .populate({
        path: 'team',
        populate: { path: 'members.user', select: 'name email department skills avatar year githubUsername' }
      });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Recalculate progress dynamically based on tasks and milestones
    const tasks = await Task.find({ project: project._id });
    const milestones = await Milestone.find({ project: project._id });

    let taskProgress = 0;
    if (tasks.length > 0) {
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      taskProgress = (completedTasks / tasks.length) * 100;
    }

    let milestoneProgress = 0;
    if (milestones.length > 0) {
      const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
      milestoneProgress = (completedMilestones / milestones.length) * 100;
    }

    let overallProgress = 0;
    if (tasks.length > 0 || milestones.length > 0) {
      const taskWeight = 0.5;
      const milestoneWeight = 0.5;
      if (tasks.length > 0 && milestones.length > 0) {
        overallProgress = Math.round(taskProgress * taskWeight + milestoneProgress * milestoneWeight);
      } else if (tasks.length > 0) {
        overallProgress = Math.round(taskProgress);
      } else {
        overallProgress = Math.round(milestoneProgress);
      }
    } else {
      overallProgress = project.progress || 0;
    }

    project.progress = overallProgress;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new project
// @route POST /api/projects
// @access Private (Student)
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      domain,
      requiredSkills,
      teamSize,
      difficulty,
      duration,
      preferredGuideSkills,
      githubRepositoryUrl
    } = req.body;

    let githubRepoObj = { url: '', owner: '', repo: '' };
    if (githubRepositoryUrl) {
      const cleanUrl = githubRepositoryUrl.trim();
      const parts = cleanUrl.replace('https://github.com/', '').split('/');
      if (parts.length >= 2) {
        githubRepoObj = {
          url: cleanUrl,
          owner: parts[0],
          repo: parts[1].replace('.git', '')
        };
      } else {
        githubRepoObj.url = cleanUrl;
      }
    }

    const project = await Project.create({
      title,
      description,
      domain: domain || 'Web Development',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      teamSize: teamSize || 4,
      difficulty: difficulty || 'Intermediate',
      duration: duration || '4 Months',
      preferredGuideSkills: Array.isArray(preferredGuideSkills) ? preferredGuideSkills : (preferredGuideSkills ? preferredGuideSkills.split(',').map(s => s.trim()) : []),
      owner: req.user._id,
      githubRepository: githubRepoObj,
      status: 'Team Formation',
      progress: 0
    });

    // Create automatically associated team with creator as Team Leader
    const team = await Team.create({
      project: project._id,
      leader: req.user._id,
      members: [{ user: req.user._id, role: 'Team Leader' }]
    });

    project.team = team._id;
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email department avatar skills')
      .populate({
        path: 'team',
        populate: { path: 'members.user', select: 'name email department skills avatar' }
      });

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update project details
// @route PUT /api/projects/:id
// @access Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check authorization: Owner or Guide or Admin
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isGuide = project.guide && project.guide.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isGuide && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.domain = req.body.domain || project.domain;
    project.difficulty = req.body.difficulty || project.difficulty;
    project.duration = req.body.duration || project.duration;
    project.teamSize = req.body.teamSize || project.teamSize;
    project.status = req.body.status || project.status;

    if (req.body.progress !== undefined) {
      project.progress = req.body.progress;
    }

    if (req.body.requiredSkills) {
      project.requiredSkills = Array.isArray(req.body.requiredSkills)
        ? req.body.requiredSkills
        : req.body.requiredSkills.split(',').map(s => s.trim());
    }

    if (req.body.preferredGuideSkills) {
      project.preferredGuideSkills = Array.isArray(req.body.preferredGuideSkills)
        ? req.body.preferredGuideSkills
        : req.body.preferredGuideSkills.split(',').map(s => s.trim());
    }

    if (req.body.githubRepositoryUrl) {
      const cleanUrl = req.body.githubRepositoryUrl.trim();
      const parts = cleanUrl.replace('https://github.com/', '').split('/');
      project.githubRepository = {
        url: cleanUrl,
        owner: parts.length >= 2 ? parts[0] : '',
        repo: parts.length >= 2 ? parts[1].replace('.git', '') : ''
      };
    }

    const updatedProject = await project.save();
    const populated = await Project.findById(updatedProject._id)
      .populate('owner', 'name email department avatar skills')
      .populate('guide', 'name email department bio')
      .populate({
        path: 'team',
        populate: { path: 'members.user', select: 'name email department skills avatar' }
      });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete project
// @route DELETE /api/projects/:id
// @access Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    if (project.team) {
      await Team.findByIdAndDelete(project.team);
    }
    await Task.deleteMany({ project: project._id });
    await Milestone.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc UNIQUE FEATURE — Recommend Suitable Teammates based on skill match
// @route GET /api/projects/:projectId/recommend-teammates
// @access Private
const recommendTeammates = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { department, year, minMatch, search } = req.query;

    // Get team member IDs to exclude
    let excludedUserIds = [project.owner.toString()];
    if (project.team) {
      const teamObj = await Team.findById(project.team);
      if (teamObj && teamObj.members) {
        teamObj.members.forEach(m => excludedUserIds.push(m.user.toString()));
      }
    }

    // Build query for student candidates
    let userQuery = {
      role: 'student',
      _id: { $nin: excludedUserIds }
    };

    if (department && department !== 'All') userQuery.department = department;
    if (year && year !== 'All') userQuery.year = year;
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const candidateStudents = await User.find(userQuery).select('-password');

    // Run matching algorithm for each student
    const recommendations = candidateStudents.map(student => {
      const matchResult = calculateSkillMatch(project.requiredSkills, student.skills || []);
      return {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
          college: student.college,
          skills: student.skills,
          bio: student.bio,
          githubUsername: student.githubUsername,
          avatar: student.avatar
        },
        skillMatchPercentage: matchResult.matchPercentage,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills
      };
    });

    // Filter by minMatch if requested
    let filteredRecs = recommendations;
    if (minMatch) {
      const minVal = parseInt(minMatch, 10);
      filteredRecs = recommendations.filter(r => r.skillMatchPercentage >= minVal);
    }

    // Sort descending by match percentage
    filteredRecs.sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);

    res.json({
      project: {
        _id: project._id,
        title: project.title,
        requiredSkills: project.requiredSkills
      },
      totalCandidatesFound: filteredRecs.length,
      recommendations: filteredRecs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  recommendTeammates
};
