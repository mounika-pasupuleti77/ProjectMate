import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';
import { User, Edit3, Save, Github, GraduationCap, CheckCircle } from 'lucide-react';

const PREDEFINED_SKILLS = [
  'React', 'Node.js', 'MongoDB', 'Python', 'Machine Learning', 'NLP', 'Java',
  'SQL', 'Express', 'JavaScript', 'TypeScript', 'Deep Learning', 'UI/UX',
  'C++', 'Flutter', 'Cloud', 'DevOps', 'HTML', 'CSS', 'Git'
];

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || 'National Institute of Technology',
    department: user?.department || 'Computer Science & Engineering',
    year: user?.year || '4th Year',
    bio: user?.bio || '',
    githubUsername: user?.githubUsername || ''
  });

  const [skills, setSkills] = useState(user?.skills || []);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await updateUserProfile({
        ...formData,
        skills
      });
      setFeedback({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setFeedback({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information, technical skill badges, and GitHub profile.</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-secondary"
        >
          <Edit3 size={16} /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          color: feedback.type === 'success' ? '#6ee7b7' : '#fda4af',
          fontSize: '0.875rem'
        }}>
          {feedback.text}
        </div>
      )}

      <div className="card">
        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GitHub Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technical Skills (Selected for Teammate Recommendation Matching)</label>
              <div style={{ marginBottom: '0.75rem' }}>
                {PREDEFINED_SKILLS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    style={{
                      background: skills.includes(skill) ? 'var(--primary-light)' : 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid ' + (skills.includes(skill) ? 'var(--primary)' : 'var(--border)'),
                      color: skills.includes(skill) ? '#a5b4fc' : 'var(--text-muted)',
                      borderRadius: '9999px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginRight: '0.35rem',
                      marginBottom: '0.35rem'
                    }}
                  >
                    {skills.includes(skill) ? '✓ ' : '+ '}{skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Profile Description</label>
              <textarea
                rows="4"
                className="form-textarea"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                <Save size={16} /> {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'white',
                boxShadow: 'var(--shadow-glow)'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>{user?.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <GraduationCap size={16} color="var(--primary)" />
                  {user?.department} • {user?.year} ({user?.college})
                </p>
                {user?.githubUsername && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                    <Github size={14} /> github.com/{user.githubUsername}
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Technical Skill Badges
              </h3>
              <div>
                {(user?.skills || []).map(skill => (
                  <SkillBadge key={skill} skill={skill} status="matched" />
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Bio
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                {user?.bio || 'No bio specified.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
