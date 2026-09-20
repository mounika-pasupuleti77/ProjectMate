const GuideRequest = require('../models/GuideRequest');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc Send request to faculty guide
// @route POST /api/guide-requests
// @access Private (Student)
const sendGuideRequest = async (req, res) => {
  try {
    const { projectId, guideId, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can request a faculty guide' });
    }

    if (project.guide) {
      return res.status(400).json({ message: 'Project already has an assigned guide' });
    }

    const existingReq = await GuideRequest.findOne({
      project: projectId,
      guide: guideId,
      status: 'Pending'
    });

    if (existingReq) {
      return res.status(400).json({ message: 'A pending guide request has already been submitted for this project' });
    }

    const guideRequest = await GuideRequest.create({
      project: projectId,
      team: project.team,
      student: req.user._id,
      guide: guideId,
      message: message || `Respected Sir/Madam, we would like to request you to guide our project: "${project.title}".`,
      status: 'Pending'
    });

    // Notify guide
    await Notification.create({
      recipient: guideId,
      sender: req.user._id,
      title: 'New Guide Request',
      message: `${req.user.name} requested you to guide project "${project.title}"`,
      type: 'GUIDE_REQUEST',
      link: '/dashboard'
    });

    res.status(201).json(guideRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get guide requests (for logged in guide or student)
// @route GET /api/guide-requests
// @access Private
const getGuideRequests = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'guide') {
      query.guide = req.user._id;
    } else if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    const requests = await GuideRequest.find(query)
      .populate('student', 'name email department year avatar')
      .populate('guide', 'name email department bio')
      .populate({
        path: 'project',
        populate: { path: 'team', populate: { path: 'members.user', select: 'name email department skills' } }
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Respond to guide request (Accept / Reject)
// @route PUT /api/guide-requests/:id
// @access Private (Guide)
const respondToGuideRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' | 'Rejected'
    const guideReq = await GuideRequest.findById(req.params.id)
      .populate('project')
      .populate('student', 'name email');

    if (!guideReq) return res.status(404).json({ message: 'Guide request not found' });

    if (guideReq.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to respond to this guide request' });
    }

    guideReq.status = status;
    await guideReq.save();

    if (status === 'Accepted') {
      const project = await Project.findById(guideReq.project._id);
      if (project) {
        project.guide = guideReq.guide;
        if (project.status === 'Team Formation' || project.status === 'Guide Pending') {
          project.status = 'Planning';
        }
        await project.save();
      }

      // Notify student
      await Notification.create({
        recipient: guideReq.student._id,
        sender: req.user._id,
        title: 'Guide Request Accepted!',
        message: `Faculty guide ${req.user.name} accepted your request for "${guideReq.project.title}"!`,
        type: 'GUIDE_REQUEST',
        link: `/projects/${guideReq.project._id}`
      });
    } else if (status === 'Rejected') {
      // Notify student
      await Notification.create({
        recipient: guideReq.student._id,
        sender: req.user._id,
        title: 'Guide Request Status',
        message: `Faculty guide ${req.user.name} was unable to accept request for "${guideReq.project.title}".`,
        type: 'GUIDE_REQUEST',
        link: '/guides'
      });
    }

    res.json(guideReq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendGuideRequest,
  getGuideRequests,
  respondToGuideRequest
};
