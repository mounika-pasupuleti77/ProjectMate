import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles } from 'lucide-react';
import SkillBadge from '../components/SkillBadge';

const PREDEFINED_SKILLS = [
  'React', 'Node.js', 'MongoDB', 'Python', 'Machine Learning', 'NLP', 'Java',
  'SQL', 'Express', 'JavaScript', 'TypeScript', 'Deep Learning', 'UI/UX',
  'C++', 'Flutter', 'Cloud', 'DevOps', 'HTML', 'CSS', 'Git'
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    college: 'National Institute of Technology',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    bio: '',
    githubUsername: ''
  });

  const [selectedSkills, setSelectedSkills] = useState(['React', 'Node.js']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        ...formData,
        skills: selectedSkills
      });
      navigate('/dashboard');
    } catch (err) {
      if (typeof err.response?.data?.message === 'string') {
        setError(err.response.data.message);
      } else {
        setError('Backend server connection error. Please make sure the backend server is running (cd backend && npm run dev).');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              Create Account
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Join ProjectMate to find project ideas, build teams & match guides
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="form-input"
                  placeholder="Rahul Kumar"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="form-input"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Role</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="guide">Faculty Guide</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">College / Institute</label>
                <input
                  type="text"
                  name="college"
                  className="form-input"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>
            </div>

            {formData.role === 'student' && (
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    name="year"
                    className="form-select"
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option value="4th Year">4th Year (Major Project)</option>
                    <option value="3rd Year">3rd Year (Mini Project)</option>
                    <option value="2nd Year">2nd Year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Username (Optional)</label>
                  <input
                    type="text"
                    name="githubUsername"
                    className="form-input"
                    placeholder="github-username"
                    value={formData.githubUsername}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Technical Skills Selection */}
            <div className="form-group">
              <label className="form-label">
                {formData.role === 'student' ? 'Technical Skills (Selected for Teammate Matching)' : 'Faculty Expertise'}
              </label>
              <div style={{ marginBottom: '0.75rem' }}>
                {PREDEFINED_SKILLS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    style={{
                      background: selectedSkills.includes(skill) ? 'var(--primary-light)' : 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid ' + (selectedSkills.includes(skill) ? 'var(--primary)' : 'var(--border)'),
                      color: selectedSkills.includes(skill) ? '#a5b4fc' : 'var(--text-muted)',
                      borderRadius: '9999px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginRight: '0.35rem',
                      marginBottom: '0.35rem'
                    }}
                  >
                    {selectedSkills.includes(skill) ? '✓ ' : '+ '}{skill}
                  </button>
                ))}
              </div>

              {/* Add Custom Skill */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add custom skill (e.g. PyTorch)..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  style={{ fontSize: '0.825rem', padding: '0.5rem 0.75rem' }}
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="btn btn-secondary btn-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Bio / Interest Summary</label>
              <textarea
                name="bio"
                className="form-textarea"
                rows="3"
                placeholder="Share a brief overview of your technical background..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            >
              <UserPlus size={16} /> {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
