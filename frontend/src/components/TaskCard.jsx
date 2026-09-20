import React from 'react';
import { Calendar, User, Clock, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDeleteTask, canEdit }) => {
  const getPriorityPill = (priority) => {
    switch (priority) {
      case 'High': return 'status-high';
      case 'Medium': return 'status-medium';
      case 'Low': default: return 'status-low';
    }
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      case 'To Do': default: return 'status-pending';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No Due Date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card" style={{ padding: '1.15rem', marginBottom: '1rem', background: 'rgba(30, 41, 59, 0.85)' }}>
      {/* Header Row: Priority & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <span className={`status-pill ${getPriorityPill(task?.priority)}`}>
          {task?.priority || 'Medium'} Priority
        </span>

        {canEdit ? (
          <select
            value={task?.status || 'To Do'}
            onChange={(e) => onStatusChange && onStatusChange(task._id, e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        ) : (
          <span className={`status-pill ${getStatusPill(task?.status)}`}>
            {task?.status}
          </span>
        )}
      </div>

      {/* Task Title */}
      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
        {task?.title}
      </h4>

      {/* Task Description */}
      {task?.description && (
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          {task.description}
        </p>
      )}

      {/* Meta Footer: Assignee & Due Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid var(--border)', fontSize: '0.775rem', color: 'var(--text-dim)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <User size={14} color="var(--primary)" />
          <span>{task?.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={14} />
            <span>{formatDate(task?.dueDate)}</span>
          </div>

          {canEdit && onDeleteTask && (
            <button
              onClick={() => onDeleteTask(task._id)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.1rem' }}
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
