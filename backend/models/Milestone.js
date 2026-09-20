const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    startDate: { type: Date },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    progress: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Milestone', milestoneSchema);
