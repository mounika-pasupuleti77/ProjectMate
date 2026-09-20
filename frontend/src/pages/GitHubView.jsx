import React, { useState, useEffect } from 'react';
import { projectService, githubService } from '../services/api';
import Loading from '../components/Loading';
import { Github, Star, GitFork, AlertCircle, ExternalLink, GitCommit, Code, Link2 } from 'lucide-react';

const GitHubView = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Connect Repo Form
  const [repoUrlInput, setRepoUrlInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchRepoData = async () => {
    setLoading(true);
    try {
      const projRes = await projectService.getProjects({ userProjects: 'true' });
      const projs = projRes.data || [];
      setProjects(projs);

      if (projs.length > 0) {
        const targetId = selectedProjectId || projs[0]._id;
        setSelectedProjectId(targetId);

        const currentProj = projs.find(p => p._id === targetId);
        if (currentProj?.githubRepository?.url) {
          setRepoUrlInput(currentProj.githubRepository.url);
        }

        try {
          const ghRes = await githubService.getRepoInfo(targetId);
          setRepoInfo(ghRes.data);
        } catch (ghErr) {
          console.warn('GitHub info fetch warning:', ghErr);
          setRepoInfo(null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoData();
  }, [selectedProjectId]);

  const handleConnectRepo = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || !repoUrlInput.trim()) return;

    setConnecting(true);
    setFeedback(null);
    try {
      await githubService.connectRepo(selectedProjectId, { repositoryUrl: repoUrlInput });
      setFeedback({ type: 'success', text: 'GitHub repository linked successfully!' });
      fetchRepoData();
    } catch (error) {
      setFeedback({ type: 'error', text: error.response?.data?.message || 'Failed to connect repository' });
    } finally {
      setConnecting(false);
    }
  };

  if (loading) return <Loading message="Fetching GitHub repository insights..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Github size={24} color="#ffffff" />
            <h1 className="page-title">GitHub Codebase Integration</h1>
          </div>
          <p className="page-subtitle">Connect public GitHub repository URLs to visualize codebase metrics, stars, forks, and commit history.</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No project associated with your account.</p>
        </div>
      ) : (
        <>
          {/* Project Selector & Link Form Bar */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="form-select"
              >
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            <form onSubmit={handleConnectRepo} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="https://github.com/owner/repository"
                  value={repoUrlInput}
                  onChange={(e) => setRepoUrlInput(e.target.value)}
                />
              </div>

              <button type="submit" disabled={connecting} className="btn btn-primary">
                <Link2 size={16} /> {connecting ? 'Linking...' : 'Connect Repo'}
              </button>
            </form>

            {feedback && (
              <div style={{
                marginTop: '0.85rem',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: feedback.type === 'success' ? '#6ee7b7' : '#fda4af'
              }}>
                {feedback.text}
              </div>
            )}
          </div>

          {/* Repo Insights Dashboard */}
          {repoInfo && repoInfo.connected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Stat Boxes */}
              <div className="grid-4">
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)' }}>
                    <Star size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>STARS</span>
                    <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>{repoInfo.repository.stars}</h3>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <GitFork size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>FORKS</span>
                    <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>{repoInfo.repository.forks}</h3>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-rose)' }}>
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>OPEN ISSUES</span>
                    <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>{repoInfo.repository.openIssues}</h3>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
                    <Code size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>BRANCH</span>
                    <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{repoInfo.repository.defaultBranch}</h3>
                  </div>
                </div>
              </div>

              {/* Repo Details Header */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                      {repoInfo.repository.fullName}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>{repoInfo.repository.description}</p>
                  </div>
                  <a
                    href={repoInfo.repository.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                  >
                    Open on GitHub <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Commits Timeline List */}
              <div className="card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GitCommit size={18} color="var(--primary)" /> Recent Repository Commits
                </h3>

                {(repoInfo.commits || []).length === 0 ? (
                  <p>No commits recorded yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(repoInfo.commits || []).map((c, idx) => (
                      <div key={idx} style={{ padding: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700, marginRight: '0.5rem' }}>
                            [{c.sha}]
                          </span>
                          <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                            {c.message}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.775rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                            Committed by <strong>{c.author}</strong> on {new Date(c.date).toLocaleDateString()}
                          </span>
                        </div>

                        {c.url && (
                          <a href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem' }}>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <Github size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No GitHub Repository Connected</h3>
              <p style={{ color: 'var(--text-muted)' }}>Enter a public GitHub URL above to link your project codebase.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GitHubView;
