import React from 'react';
import SkillBadge from './SkillBadge';
import { GraduationCap, Mail, Send, Award } from 'lucide-react';

const GuideCard = ({ guide, onRequestGuide, onViewDetails }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            fontWeight: 800,
            color: 'white',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
          }}>
            {guide?.name ? guide.name.charAt(0).toUpperCase() : 'G'}
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {guide?.name}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <GraduationCap size={15} color="var(--accent-emerald)" />
              {guide?.department}
            </p>
          </div>
        </div>

        {guide?.bio && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {guide.bio}
          </p>
        )}

        {/* Expertise Badges */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
            Faculty Expertise
          </span>
          <div>
            {(guide?.skills || []).map(skill => (
              <SkillBadge key={skill} skill={skill} status="matched" />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        {onRequestGuide && (
          <button
            onClick={() => onRequestGuide(guide)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Send size={14} /> Request as Guide
          </button>
        )}
      </div>
    </div>
  );
};

export default GuideCard;
