import React from 'react';
import ProgressBar from './ProgressBar';
import { Flag, Calendar, CheckCircle2, Clock, Trash2 } from 'lucide-react';

const MilestoneCard = ({ milestone, onUpdateMilestone, onDeleteMilestone, canManage }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Flag size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {milestone?.title}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
              <Calendar size={13} /> Due: {formatDate(milestone?.dueDate)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`status-pill ${getStatusClass(milestone?.status)}`}>
            {milestone?.status}
          </span>

          {canManage && (
            <select
              value={milestone?.status || 'Pending'}
              onChange={(e) => onUpdateMilestone && onUpdateMilestone(milestone._id, { status: e.target.value })}
              className="form-select"
              style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}

          {canManage && onDeleteMilestone && (
            <button
              onClick={() => onDeleteMilestone(milestone._id)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.2rem' }}
              title="Delete Milestone"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {milestone?.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {milestone.description}
        </p>
      )}

      {/* Progress Bar */}
      <ProgressBar
        progress={milestone?.status === 'Completed' ? 100 : (milestone?.progress || 0)}
        label="Milestone Progress"
      />
    </div>
  );
};

export default MilestoneCard;
