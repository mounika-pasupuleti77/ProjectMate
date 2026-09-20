const Team = require('../models/Team');
const Project = require('../models/Project');

// @desc Get team details by ID
// @route GET /api/teams/:id
// @access Private
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email department skills avatar year githubUsername')
      .populate('members.user', 'name email department skills avatar year githubUsername')
      .populate({
        path: 'project',
        populate: { path: 'guide', select: 'name email department bio' }
      });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update team member roles or remove member
// @route PUT /api/teams/:id
// @access Private
const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isLeader = team.leader.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isLeader && !isAdmin) {
      return res.status(403).json({ message: 'Only team leader or admin can manage team members' });
    }

    const { memberRoles, removeUserId } = req.body;

    if (removeUserId) {
      if (removeUserId.toString() === team.leader.toString()) {
        return res.status(400).json({ message: 'Cannot remove the team leader from team' });
      }
      team.members = team.members.filter(m => m.user.toString() !== removeUserId.toString());
    }

    if (memberRoles && Array.isArray(memberRoles)) {
      // memberRoles array of { userId, role }
      memberRoles.forEach(item => {
        const mem = team.members.find(m => m.user.toString() === item.userId.toString());
        if (mem) {
          mem.role = item.role || mem.role;
        }
      });
    }

    const updatedTeam = await team.save();
    const populated = await Team.findById(updatedTeam._id)
      .populate('leader', 'name email department skills avatar year githubUsername')
      .populate('members.user', 'name email department skills avatar year githubUsername')
      .populate('project');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeamById,
  updateTeam
};
