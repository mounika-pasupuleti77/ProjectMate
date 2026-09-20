import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService, taskService, milestoneService, githubService } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import MilestoneCard from '../components/MilestoneCard';
import Loading from '../components/Loading';
import { FolderGit2, Users, GraduationCap, Github, CheckSquare, Flag, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [repoInfo, setRepoInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const pRes = await projectService.getProjectById(id);
        setProject(pRes.data);

        const tRes = await taskService.getProjectTasks(id);
        setTasks(tRes.data || []);

        const mRes = await milestoneService.getProjectMilestones(id);
        setMilestones(mRes.data || []);

        try {
          const gRes = await githubService.getRepoInfo(id);
          setRepoInfo(gRes.data);
        } catch (err) {
          console.warn('GitHub info warning:', err);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (loading) return <Loading message="Loading project dashboard details..." />;
  if (!project) return <div className="card"><p>Project not found.</p></div>;

  const members = project.team?.members || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(30, 41, 59, 0.9) 100%)', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span className="status-pill status-progress">{project.domain}</span>
              <span className="status-pill status-completed">{project.status}</span>
              <span className="status-pill status-pending">{project.difficulty} Level</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem' }}>{project.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '800px' }}>{project.description}</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {project.progress}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>OVERALL PROGRESS</span>
          </div>
        </div>

        <ProgressBar progress={project.progress} height="10px" />
      </div>

      {/* Main Grid: Left Details & Right Team/Guide */}
      <div className="grid-2">
        {/* Left Column: Requirements & GitHub */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem' }}>Project Skill Requirements</h3>
            <div style={{ marginBottom: '1rem' }}>
              {(project.requiredSkills || []).map(s => (
                <SkillBadge key={s} skill={s} status="matched" />
              ))}
            </div>
          </div>

          {/* Connected GitHub Repository */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Github size={20} /> Linked GitHub Repository
            </h3>
            {project.githubRepository?.url ? (
              <div>
                <a href={project.githubRepository.url} target="_blank" rel="noreferrer" style={{ fontSize: '1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  {project.githubRepository.url} <ExternalLink size={14} />
                </a>
                {repoInfo?.repository && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>⭐ {repoInfo.repository.stars} Stars</span>
                    <span>🍴 {repoInfo.repository.forks} Forks</span>
                    <span>❗ {repoInfo.repository.openIssues} Open Issues</span>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>No GitHub repository connected yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Team & Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Faculty Guide Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="var(--accent-emerald)" /> Faculty Guide
            </h3>
            {project.guide ? (
              <div>
                <h4 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{project.guide.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{project.guide.department}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>{project.guide.bio}</p>
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--accent-amber)' }}>Guide Pending Allocation</p>
            )}
          </div>

          {/* Team Members List */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" /> Team Members ({members.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {members.map(m => (
                <div key={m.user?._id || m.user} style={{ padding: '0.65rem 0.85rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>{m.user?.name}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)' }}>{m.role || 'Developer'}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{m.user?.department}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task & Milestone Tabs / Lists */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={18} color="var(--primary)" /> Project Tasks ({tasks.length})
          </h3>
          {tasks.slice(0, 4).map(t => (
            <TaskCard key={t._id} task={t} canEdit={false} />
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flag size={18} color="var(--secondary)" /> Milestones ({milestones.length})
          </h3>
          {milestones.map(m => (
            <MilestoneCard key={m._id} milestone={m} canManage={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
