import React from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

const SkillBadge = ({ skill, status = 'default', onRemove, showIcon = true }) => {
  let badgeClass = 'skill-badge';
  let Icon = null;

  if (status === 'matched') {
    badgeClass += ' matched';
    Icon = Check;
  } else if (status === 'missing') {
    badgeClass += ' missing';
    Icon = AlertCircle;
  }

  return (
    <span className={badgeClass}>
      {showIcon && Icon && <Icon size={12} />}
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            padding: 0,
            marginLeft: '0.2rem'
          }}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
