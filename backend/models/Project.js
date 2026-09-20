const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    domain: { type: String, required: true, default: 'Web Development' },
    requiredSkills: [{ type: String, trim: true }],
    teamSize: { type: Number, default: 4 },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    duration: { type: String, default: '4 Months' },
    preferredGuideSkills: [{ type: String, trim: true }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    githubRepository: {
      url: { type: String, default: '' },
      owner: { type: String, default: '' },
      repo: { type: String, default: '' }
    },
    status: { 
      type: String, 
      enum: ['Idea', 'Team Formation', 'Guide Pending', 'Planning', 'Development', 'Testing', 'Completed'],
      default: 'Team Formation'
    },
    progress: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
