import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import { PlusCircle, Sparkles, Rocket } from 'lucide-react';

const PREDEFINED_SKILLS = [
  'React', 'Node.js', 'MongoDB', 'Python', 'Machine Learning', 'NLP', 'Java',
  'SQL', 'Express', 'JavaScript', 'TypeScript', 'Deep Learning', 'UI/UX',
  'C++', 'Flutter', 'Cloud', 'DevOps', 'HTML', 'CSS', 'Git'
];

const CreateProject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefilled = location.state || {};

  const [formData, setFormData] = useState({
    title: prefilled.title || '',
    description: prefilled.description || '',
    domain: prefilled.domain || 'Artificial Intelligence',
    difficulty: prefilled.difficulty || 'Intermediate',
    duration: '4 Months',
    teamSize: prefilled.teamSize || 4,
    githubRepositoryUrl: ''
  });

  const [requiredSkills, setRequiredSkills] = useState(
    prefilled.requiredSkills || ['React', 'Node.js', 'MongoDB', 'Python', 'NLP']
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleRequiredSkill = (skill) => {
    if (requiredSkills.includes(skill)) {
      setRequiredSkills(requiredSkills.filter(s => s !== skill));
    } else {
      setRequiredSkills([...requiredSkills, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await projectService.createProject({
        ...formData,
        requiredSkills
      });
      navigate(`/find-teammates`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Rocket size={24} color="var(--primary)" />
            <h1 className="page-title">Create Major Project</h1>
          </div>
          <p className="page-subtitle">Define project requirements and required skills to trigger automated teammate recommendations.</p>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          background: 'rgba(244, 63, 94, 0.15)',
          color: '#fda4af',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. AI-Based Resume Analyzer & Job Matching System"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Description</label>
            <textarea
              required
              rows="4"
              className="form-textarea"
              placeholder="Describe the scope, objectives, and expected deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Project Domain</label>
              <select
                className="form-select"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Web Development">Web Development</option>
                <option value="IoT & Embedded">IoT & Embedded</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Mobile Development">Mobile Development</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                className="form-select"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Team Size</label>
              <select
                className="form-select"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value, 10) })}
              >
                <option value="2">2 Students</option>
                <option value="3">3 Students</option>
                <option value="4">4 Students</option>
                <option value="5">5 Students</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Expected Duration</label>
              <input
                type="text"
                className="form-input"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>

          {/* CRITICAL: Required Skills Selector */}
          <div className="form-group" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <label className="form-label" style={{ color: '#ffffff', fontSize: '0.95rem' }}>
              Select Required Skills (Used by Smart Matching Engine)
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              The system will calculate match percentages based on how many of these required skills student profiles possess.
            </p>

            <div>
              {PREDEFINED_SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleRequiredSkill(skill)}
                  style={{
                    background: requiredSkills.includes(skill) ? 'var(--primary-light)' : 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid ' + (requiredSkills.includes(skill) ? 'var(--primary)' : 'var(--border)'),
                    color: requiredSkills.includes(skill) ? '#a5b4fc' : 'var(--text-muted)',
                    borderRadius: '9999px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginRight: '0.4rem',
                    marginBottom: '0.4rem'
                  }}
                >
                  {requiredSkills.includes(skill) ? '✓ ' : '+ '}{skill}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              Selected Requirements: {requiredSkills.map(s => <SkillBadge key={s} skill={s} status="matched" />)}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">GitHub Repository URL (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://github.com/username/repository"
              value={formData.githubRepositoryUrl}
              onChange={(e) => setFormData({ ...formData, githubRepositoryUrl: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              <Sparkles size={18} /> {loading ? 'Creating Project...' : 'Create & Match Teammates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
