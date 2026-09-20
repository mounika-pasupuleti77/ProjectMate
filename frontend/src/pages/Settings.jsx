import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Bell, Lock, Moon } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <SettingsIcon size={24} color="var(--primary)" />
            <h1 className="page-title">Application Settings</h1>
          </div>
          <p className="page-subtitle">Configure notification preferences, security options, and platform themes.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--primary)" /> Notification Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Receive email alerts for incoming team invitations
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Receive alerts when faculty guide responds to request
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Notify on task assignment and deadline reminders
            </label>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--secondary)" /> Security & Password
          </h3>
          <div className="form-group">
            <label className="form-label">Account Email</label>
            <input type="text" disabled className="form-input" value={user?.email || ''} />
          </div>
          <button className="btn btn-secondary btn-sm">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
