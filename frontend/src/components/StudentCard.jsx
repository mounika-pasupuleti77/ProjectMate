import React from 'react';
import SkillBadge from './SkillBadge';
import { UserCheck, Send, Github, GraduationCap } from 'lucide-react';

const StudentCard = ({ student, skillMatchPercentage, matchedSkills = [], missingSkills = [], onSendRequest, onViewProfile }) => {
  const isRecommended = skillMatchPercentage !== undefined;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
      <div>
        {/* Top Header Row with Avatar & Match Ring */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'white',
              boxShadow: 'var(--shadow-glow)'
            }}>
              {student?.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {student?.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <GraduationCap size={14} color="var(--primary)" />
                {student?.department} • {student?.year}
              </p>
            </div>
          </div>

          {/* Transparent Skill Match Indicator Ring */}
          {isRecommended && (
            <div style={{ textAlign: 'center' }}>
              <div className="match-ring" style={{ '--percentage': skillMatchPercentage }}>
                <span>{skillMatchPercentage}%</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
                SKILL MATCH
              </span>
            </div>
          )}
        </div>

        {/* Bio summary */}
        {student?.bio && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {student.bio}
          </p>
        )}

        {/* Matched & Listed Skills */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
            {isRecommended ? 'Matched Skills' : 'Technical Skills'}
          </span>
          <div>
            {isRecommended ? (
              <>
                {matchedSkills.map(s => (
                  <SkillBadge key={s} skill={s} status="matched" />
                ))}
                {missingSkills.map(s => (
                  <SkillBadge key={s} skill={s} status="missing" />
                ))}
              </>
            ) : (
              (student?.skills || []).map(s => (
                <SkillBadge key={s} skill={s} status="default" />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        {onSendRequest && (
          <button
            onClick={() => onSendRequest(student)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            <Send size={14} /> Send Team Request
          </button>
        )}

        {onViewProfile && (
          <button
            onClick={() => onViewProfile(student)}
            className="btn btn-secondary btn-sm"
          >
            View Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentCard;
