import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, teamRequestService } from '../services/api';
import StudentCard from '../components/StudentCard';
import SkillBadge from '../components/SkillBadge';
import Loading from '../components/Loading';
import { Sparkles, Search, Filter, Send, X, AlertCircle } from 'lucide-react';

const FindTeammates = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [minMatchFilter, setMinMatchFilter] = useState('0');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Request State
  const [modalStudent, setModalStudent] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState(null);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const res = await projectService.getProjects({ userProjects: 'true' });
        const userProjs = res.data || [];
        setProjects(userProjs);

        if (userProjs.length > 0) {
          setSelectedProjectId(userProjs[0]._id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, []);

  const fetchRecommendations = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      const res = await projectService.recommendTeammates(selectedProjectId, {
        department: departmentFilter,
        year: yearFilter,
        minMatch: minMatchFilter,
        search: searchQuery
      });

      setRecommendations(res.data.recommendations || []);
      setRequiredSkills(res.data.project?.requiredSkills || []);
    } catch (error) {
      console.error('Recommendation fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchRecommendations();
    }
  }, [selectedProjectId, departmentFilter, yearFilter, minMatchFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  const handleOpenRequestModal = (student) => {
    setModalStudent(student);
    setRequestMessage(`Hi ${student.name}! Your profile matches our project skill requirements. Would love to have you on our major project team.`);
    setRequestFeedback(null);
  };

  const handleSendTeamRequest = async (e) => {
    e.preventDefault();
    if (!modalStudent || !selectedProjectId) return;

    setSendingRequest(true);
    setRequestFeedback(null);
    try {
      await teamRequestService.sendRequest({
        receiverId: modalStudent._id,
        projectId: selectedProjectId,
        message: requestMessage
      });

      setRequestFeedback({ type: 'success', text: `Team invitation sent successfully to ${modalStudent.name}!` });
      setTimeout(() => {
        setModalStudent(null);
      }, 1800);
    } catch (error) {
      setRequestFeedback({ type: 'error', text: error.response?.data?.message || 'Failed to send request' });
    } finally {
      setSendingRequest(false);
    }
  };

  const activeProject = projects.find(p => p._id === selectedProjectId);

  return (
    <div>
      {/* Header Banner */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={22} color="var(--primary)" />
            <h1 className="page-title">Smart Teammate Matching Engine</h1>
          </div>
          <p className="page-subtitle">
            Automated transparent skill-matching algorithm recommending optimal student candidates based on project skill requirements.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <AlertCircle size={48} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Projects Created Yet</h2>
          <p style={{ marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            To view automated skill-matched teammate recommendations, you must first create a project with required skills.
          </p>
          <a href="/create-project" className="btn btn-primary">
            Create Project Now
          </a>
        </div>
      ) : (
        <>
          {/* Project Selector & Filter Controls Bar */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label">Select Active Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="form-select"
                >
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.requiredSkills.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Project Required Skills</label>
                <div style={{ paddingTop: '0.4rem' }}>
                  {requiredSkills.map(s => (
                    <SkillBadge key={s} skill={s} status="matched" />
                  ))}
                </div>
              </div>
            </div>

            {/* Filters Row */}
            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '0.85rem', alignItems: 'end' }}>
              <div>
                <label className="form-label">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Artificial Intelligence & Data Science">AI & DS</option>
                  <option value="Electronics & Communication">ECE</option>
                </select>
              </div>

              <div>
                <label className="form-label">Academic Year</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">All Years</option>
                  <option value="4th Year">4th Year</option>
                  <option value="3rd Year">3rd Year</option>
                </select>
              </div>

              <div>
                <label className="form-label">Min Skill Match</label>
                <select
                  value={minMatchFilter}
                  onChange={(e) => setMinMatchFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="0">All Match %</option>
                  <option value="50">50%+ Match</option>
                  <option value="75">75%+ Match</option>
                </select>
              </div>

              <div>
                <label className="form-label">Search Candidate</label>
                <input
                  type="text"
                  placeholder="Search by name or skill..."
                  className="form-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                <Search size={16} /> Filter
              </button>
            </form>
          </div>

          {/* Transparent Matching Formula Explainer Alert */}
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            marginBottom: '1.75rem',
            fontSize: '0.85rem',
            color: '#a5b4fc',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Sparkles size={20} color="var(--primary)" />
            <div>
              <strong>Skill Match Calculation Formula:</strong> Match Percentage = <code>(Matched Skills Count / Project Required Skills Count) × 100</code>. This score represents the percentage of project skills matched by student profiles.
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <Loading message="Calculating student skill matches..." />
          ) : recommendations.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No eligible student candidates matched your selected criteria.</p>
            </div>
          ) : (
            <div className="grid-2">
              {recommendations.map(rec => (
                <StudentCard
                  key={rec.student._id}
                  student={rec.student}
                  skillMatchPercentage={rec.skillMatchPercentage}
                  matchedSkills={rec.matchedSkills}
                  missingSkills={rec.missingSkills}
                  onSendRequest={() => handleOpenRequestModal(rec.student)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* TEAM REQUEST MODAL */}
      {modalStudent && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                Send Team Request to {modalStudent.name}
              </h3>
              <button
                onClick={() => setModalStudent(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {requestFeedback && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                background: requestFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: requestFeedback.type === 'success' ? '#6ee7b7' : '#fda4af',
                fontSize: '0.85rem'
              }}>
                {requestFeedback.text}
              </div>
            )}

            <form onSubmit={handleSendTeamRequest}>
              <div className="form-group">
                <label className="form-label">Project</label>
                <input
                  type="text"
                  disabled
                  className="form-input"
                  value={activeProject?.title || ''}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Invitation Message</label>
                <textarea
                  required
                  rows="4"
                  className="form-textarea"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalStudent(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="btn btn-primary"
                >
                  <Send size={16} /> {sendingRequest ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindTeammates;
