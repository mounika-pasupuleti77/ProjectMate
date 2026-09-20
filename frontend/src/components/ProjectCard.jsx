import React from 'react';
import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';
import ProgressBar from './ProgressBar';
import { FolderGit2, Users, GraduationCap, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, showActions = true }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'Development':
      case 'Planning':
      case 'Testing': return 'status-progress';
      default: return 'status-pending';
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            background: 'var(--primary-light)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            {project?.domain || 'General'}
          </span>
          <span className={`status-pill ${getStatusClass(project?.status)}`}>
            {project?.status || 'Active'}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
          {project?.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {project?.description}
        </p>

        {/* Required Skills */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
            Required Skills
          </span>
          <div>
            {(project?.requiredSkills || []).slice(0, 5).map(skill => (
              <SkillBadge key={skill} skill={skill} />
            ))}
            {(project?.requiredSkills || []).length > 5 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                +{(project?.requiredSkills || []).length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <ProgressBar progress={project?.progress || 0} />
        </div>

        {/* Meta Info: Leader & Guide */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div>
            <strong>Leader:</strong> {project?.owner?.name || 'Student Leader'}
          </div>
          <div>
            <strong>Guide:</strong> {project?.guide?.name ? project.guide.name : <span style={{ color: 'var(--accent-amber)' }}>Unassigned (Request Guide)</span>}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      {showActions && (
        <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Users size={16} color="var(--primary)" />
            <span>Target Size: {project?.teamSize || 4}</span>
          </div>

          <Link to={`/projects/${project._id}`} className="btn btn-outline btn-sm">
            Project Details <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
