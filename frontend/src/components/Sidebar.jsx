import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Lightbulb,
  UserCheck,
  Users,
  GraduationCap,
  CheckSquare,
  Flag,
  Github,
  BarChart3,
  ShieldCheck,
  Settings,
  PlusCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user, isStudent, isGuide, isAdmin } = useAuth();

  const getNavItems = () => {
    let items = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/profile', label: 'My Profile', icon: User },
      { path: '/project-ideas', label: 'Project Ideas', icon: Lightbulb }
    ];

    if (isStudent) {
      items.push(
        { path: '/create-project', label: 'Create Project', icon: PlusCircle },
        { path: '/find-teammates', label: 'Smart Teammate Match', icon: UserCheck, highlight: true },
        { path: '/my-team', label: 'My Team', icon: Users },
        { path: '/guides', label: 'Faculty Guides', icon: GraduationCap },
        { path: '/tasks', label: 'Task Board', icon: CheckSquare },
        { path: '/milestones', label: 'Milestones', icon: Flag },
        { path: '/github', label: 'GitHub Repository', icon: Github }
      );
    }

    if (isGuide) {
      items.push(
        { path: '/guides', label: 'Faculty Directory', icon: GraduationCap },
        { path: '/my-team', label: 'Guided Teams', icon: Users },
        { path: '/tasks', label: 'Team Task Monitor', icon: CheckSquare },
        { path: '/milestones', label: 'Milestones Review', icon: Flag },
        { path: '/github', label: 'GitHub Repos', icon: Github }
      );
    }

    items.push({ path: '/analytics', label: 'Analytics & Insights', icon: BarChart3 });

    if (isAdmin) {
      items.push({ path: '/admin', label: 'Admin Console', icon: ShieldCheck, highlight: true });
    }

    items.push({ path: '/settings', label: 'Settings', icon: Settings });

    return items;
  };

  const navItems = getNavItems();

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border)',
      minHeight: 'calc(100vh - 65px)',
      padding: '1.25rem 0.85rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '0.5rem 0.85rem 0.25rem 0.85rem'
        }}>
          MAIN MENU
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)'
                  : item.highlight
                  ? 'rgba(99, 102, 241, 0.08)'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(99, 102, 241, 0.4)'
                  : item.highlight
                  ? '1px dashed rgba(99, 102, 241, 0.3)'
                  : '1px solid transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              })}
            >
              <Icon size={18} color={item.highlight ? '#818cf8' : undefined} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* College Info Footer */}
      <div style={{
        padding: '0.85rem',
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        marginTop: '1.5rem'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', fontWeight: 600 }}>
          COLLEGE PORTAL
        </span>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
          {user?.college || 'National Institute of Technology'}
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
