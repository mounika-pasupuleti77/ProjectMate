import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Lightbulb,
  GraduationCap,
  CheckSquare,
  Github,
  BarChart2,
  ArrowRight,
  Code2,
  CheckCircle,
  Zap
} from 'lucide-react';

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem 5rem 2rem',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative'
      }} className="animate-fade-in">

        {/* Floating Skill Match Badges Background */}
        <div className="animate-float" style={{ position: 'absolute', top: '20px', left: '5%', opacity: 0.8 }}>
          <span className="skill-badge matched" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <CheckCircle size={14} /> React + Node.js Matched (80%)
          </span>
        </div>

        <div className="animate-float" style={{ position: 'absolute', top: '40px', right: '5%', opacity: 0.8, animationDelay: '1.5s' }}>
          <span className="skill-badge matched" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Zap size={14} /> Python + NLP Matched (100%)
          </span>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          background: 'var(--primary-light)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#a5b4fc',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> B.Tech Major Project Collaboration Platform
        </div>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Build Better Projects.<br />Find the Right Team.
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted)',
          maxWidth: '750px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          ProjectMate helps students find project ideas, build skill-based teams with automated skill matching algorithms, connect with faculty guides, and track project progress in one unified platform.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary pulse-glow" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Account Login
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid with Staggered Fade Up */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto 5rem auto', padding: '0 2rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2.5rem', color: '#ffffff' }}>
          Everything You Need For Your College Project
        </h2>

        <div className="grid-3">
          <div className="card animate-fade-in delay-1">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Smart Team Matching</h3>
            <p>Automatically recommend suitable teammates based on project skill requirements and student skill profiles with transparent match scoring.</p>
          </div>

          <div className="card animate-fade-in delay-2">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', marginBottom: '1rem' }}>
              <Lightbulb size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Project Ideas Repository</h3>
            <p>Browse curated college project ideas across AI/ML, Web, IoT, Cloud, and Blockchain filtered by technical domain and difficulty.</p>
          </div>

          <div className="card animate-fade-in delay-3">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
              <GraduationCap size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Guide & Faculty Allocation</h3>
            <p>Search faculty guide profiles by department expertise and submit project guide requests with instant acceptance tracking.</p>
          </div>

          <div className="card animate-fade-in delay-1">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)', marginBottom: '1rem' }}>
              <CheckSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Task & Milestone Management</h3>
            <p>Kanban-style task board and milestone timeline tracking for efficient team workload division and project deadline management.</p>
          </div>

          <div className="card animate-fade-in delay-2">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
              <Github size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>GitHub Integration</h3>
            <p>Connect public repository URLs to visualize live codebase stars, forks, open issues, language breakdown, and commit logs.</p>
          </div>

          <div className="card animate-fade-in delay-3">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-rose)', marginBottom: '1rem' }}>
              <BarChart2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Progress Analytics</h3>
            <p>Interactive dashboard visualizations for overall project progress, task completion velocity, and individual contribution metrics.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
        ProjectMate &copy; 2026 — Smart College Project Team & Guide Matching Platform
      </footer>
    </div>
  );
};

export default Landing;
