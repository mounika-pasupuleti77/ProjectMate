import React from 'react';

const Loading = ({ message = 'Loading ProjectMate data...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
        {message}
      </p>
    </div>
  );
};

export default Loading;
