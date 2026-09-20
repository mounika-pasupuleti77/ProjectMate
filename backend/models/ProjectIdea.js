const mongoose = require('mongoose');

const projectIdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    domain: { type: String, required: true, default: 'Web Development' },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    requiredSkills: [{ type: String, trim: true }],
    teamSize: { type: Number, default: 4 },
    tags: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectIdea', projectIdeaSchema);
