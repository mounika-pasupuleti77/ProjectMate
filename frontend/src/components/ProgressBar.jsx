import React from 'react';

const ProgressBar = ({ progress = 0, label = 'Overall Progress', height = '8px' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round(progress)));

  let colorGradient = 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)';
  if (percentage >= 100) {
    colorGradient = 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
  } else if (percentage < 30) {
    colorGradient = 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)';
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
        <span>{label}</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{percentage}%</span>
      </div>

      <div style={{
        width: '100%',
        height: height,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: colorGradient,
          borderRadius: '9999px',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
