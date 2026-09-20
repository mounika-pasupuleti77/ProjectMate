import React from 'react';
import SkillBadge from './SkillBadge';
import { ShieldCheck, User, Trash2, Edit3 } from 'lucide-react';

const TeamMemberCard = ({ member, isLeader, onUpdateRole, onRemoveMember, canManage }) => {
  const user = member.user || member;
  const role = member.role || 'Developer';

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: isLeader ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: '1.1rem'
        }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {user?.name}
            </h4>
            {isLeader && (
              <span className="status-pill status-pending" style={{ fontSize: '0.65rem' }}>
                <ShieldCheck size={12} /> Team Leader
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {user?.department} • {user?.year} | <strong style={{ color: 'var(--primary)' }}>{role}</strong>
          </p>

          <div style={{ marginTop: '0.35rem' }}>
            {(user?.skills || []).slice(0, 4).map(s => (
              <SkillBadge key={s} skill={s} />
            ))}
          </div>
        </div>
      </div>

      {canManage && !isLeader && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onUpdateRole && (
            <button
              onClick={() => onUpdateRole(user._id, role)}
              className="btn btn-secondary btn-sm"
              title="Edit Role"
            >
              <Edit3 size={14} /> Role
            </button>
          )}

          {onRemoveMember && (
            <button
              onClick={() => onRemoveMember(user._id)}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--accent-rose)' }}
              title="Remove Member"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
