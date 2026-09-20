const TeamRequest = require('../models/TeamRequest');
const Project = require('../models/Project');
const Team = require('../models/Team');
const Notification = require('../models/Notification');

// @desc Send team request to candidate student
// @route POST /api/team-requests
// @access Private (Student)
const sendTeamRequest = async (req, res) => {
  try {
    const { receiverId, projectId, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is owner of project or member of team
    let team = await Team.findById(project.team);
    if (!team) {
      return res.status(400).json({ message: 'Project team has not been initialized' });
    }

    const isMember = team.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember && project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to send team requests for this project' });
    }

    // Check if target receiver is already in the team
    const alreadyMember = team.members.some(m => m.user.toString() === receiverId.toString());
    if (alreadyMember) {
      return res.status(400).json({ message: 'Student is already a member of this project team' });
    }

    // Check if pending request exists
    const existingReq = await TeamRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      project: projectId,
      status: 'Pending'
    });

    if (existingReq) {
      return res.status(400).json({ message: 'A pending team request has already been sent to this student' });
    }

    const requestObj = await TeamRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      project: projectId,
      message: message || `Hi! I would like to invite you to join my project team: ${project.title}.`,
      status: 'Pending'
    });

    // Create notification for recipient
    await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      title: 'New Team Invitation',
      message: `${req.user.name} invited you to join team for project "${project.title}"`,
      type: 'TEAM_REQUEST',
      link: '/dashboard'
    });

    res.status(201).json(requestObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get received team requests for logged in user
// @route GET /api/team-requests/received
// @access Private
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await TeamRequest.find({ receiver: req.user._id })
      .populate('sender', 'name email department skills avatar year')
      .populate('project', 'title description domain requiredSkills')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get sent team requests by logged in user
// @route GET /api/team-requests/sent
// @access Private
const getSentRequests = async (req, res) => {
  try {
    const requests = await TeamRequest.find({ sender: req.user._id })
      .populate('receiver', 'name email department skills avatar year')
      .populate('project', 'title description domain requiredSkills')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Respond to team request (Accept, Reject, Cancel)
// @route PUT /api/team-requests/:id
// @access Private
const respondToTeamRequest = async (req, res) => {
  try {
    const { status, role } = req.body; // status: 'Accepted' | 'Rejected' | 'Cancelled'
    const teamRequest = await TeamRequest.findById(req.params.id)
      .populate('project')
      .populate('sender', 'name email');

    if (!teamRequest) {
      return res.status(404).json({ message: 'Team request not found' });
    }

    const isReceiver = teamRequest.receiver.toString() === req.user._id.toString();
    const isSender = teamRequest.sender.toString() === req.user._id.toString();

    if (status === 'Cancelled') {
      if (!isSender && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only sender can cancel team request' });
      }
      teamRequest.status = 'Cancelled';
      await teamRequest.save();
      return res.json(teamRequest);
    }

    if (!isReceiver && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    teamRequest.status = status;
    await teamRequest.save();

    // If accepted, add receiver to project's team
    if (status === 'Accepted') {
      const project = await Project.findById(teamRequest.project._id);
      if (project && project.team) {
        const team = await Team.findById(project.team);
        if (team) {
          const alreadyExists = team.members.some(m => m.user.toString() === teamRequest.receiver.toString());
          if (!alreadyExists) {
            team.members.push({
              user: teamRequest.receiver,
              role: role || 'Developer'
            });
            await team.save();
          }
        }
      }

      // Create notification for sender
      await Notification.create({
        recipient: teamRequest.sender._id,
        sender: req.user._id,
        title: 'Team Invitation Accepted',
        message: `${req.user.name} accepted your request to join "${teamRequest.project.title}"!`,
        type: 'TEAM_REQUEST',
        link: '/my-team'
      });
    }

    res.json(teamRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendTeamRequest,
  getReceivedRequests,
  getSentRequests,
  respondToTeamRequest
};
