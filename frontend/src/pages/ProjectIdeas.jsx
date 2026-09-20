import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectIdeaService } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import Loading from '../components/Loading';
import { Lightbulb, Search, PlusCircle, Rocket, X } from 'lucide-react';

const ProjectIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [domainFilter, setDomainFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New Idea Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    domain: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    requiredSkills: 'React, Python, NLP',
    teamSize: 4
  });

  const navigate = useNavigate();

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await projectIdeaService.getIdeas({
        domain: domainFilter,
        difficulty: difficultyFilter,
        search: searchQuery
      });
      setIdeas(res.data || []);
    } catch (error) {
      console.error('Ideas fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [domainFilter, difficultyFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIdeas();
  };

  const handleCreateIdea = async (e) => {
    e.preventDefault();
    try {
      await projectIdeaService.createIdea(form);
      setIsModalOpen(false);
      fetchIdeas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUseIdea = (idea) => {
    navigate('/create-project', {
      state: {
        title: idea.title,
        description: idea.description,
        domain: idea.domain,
        requiredSkills: idea.requiredSkills,
        teamSize: idea.teamSize,
        difficulty: idea.difficulty
      }
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Lightbulb size={24} color="var(--secondary)" />
            <h1 className="page-title">Project Idea Repository</h1>
          </div>
          <p className="page-subtitle">Curated B.Tech major project concepts across AI/ML, Web, IoT, Blockchain & Cloud.</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <PlusCircle size={16} /> Post Idea
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label className="form-label">Domain</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="form-select"
            >
              <option value="All">All Domains</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Web Development">Web Development</option>
              <option value="IoT & Embedded">IoT & Embedded</option>
              <option value="Blockchain">Blockchain</option>
            </select>
          </div>

          <div>
            <label className="form-label">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="form-select"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="form-label">Search Idea Keyword</label>
            <input
              type="text"
              placeholder="Search by title or tech..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Search size={16} /> Search
          </button>
        </form>
      </div>

      {loading ? (
        <Loading message="Loading project ideas..." />
      ) : (
        <div className="grid-2">
          {ideas.map(idea => (
            <div key={idea._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', background: 'rgba(139, 92, 246, 0.15)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                    {idea.domain}
                  </span>
                  <span className="status-pill status-pending" style={{ fontSize: '0.7rem' }}>
                    {idea.difficulty}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  {idea.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {idea.description}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                    Required Skills
                  </span>
                  <div>
                    {(idea.requiredSkills || []).map(s => (
                      <SkillBadge key={s} skill={s} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Preferred Team: <strong>{idea.teamSize} Students</strong>
                </span>

                <button onClick={() => handleUseIdea(idea)} className="btn btn-primary btn-sm">
                  <Rocket size={14} /> Adopt Idea as Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE IDEA MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Submit Project Idea</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateIdea}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. AI Resume Analyzer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  required
                  rows="3"
                  className="form-textarea"
                  placeholder="Comprehensive description of the problem statement & solution..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Domain</label>
                  <select
                    className="form-select"
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="IoT & Embedded">IoT & Embedded</option>
                    <option value="Blockchain">Blockchain</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="React, Node.js, MongoDB, Python"
                  value={form.requiredSkills}
                  onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectIdeas;
