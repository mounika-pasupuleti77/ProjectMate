import React, { useState, useEffect } from 'react';
import { userService, projectService, skillService } from '../services/api';
import Loading from '../components/Loading';
import SkillBadge from '../components/SkillBadge';
import { ShieldCheck, Users, FolderGit2, Sparkles, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Skill Modal Input
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('General');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const uRes = await userService.getUsers();
      setUsers(uRes.data || []);

      const pRes = await projectService.getProjects();
      setProjects(pRes.data || []);

      const sRes = await skillService.getSkills();
      setSkills(sRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      await skillService.createSkill({ name: newSkillName.trim(), category: newSkillCategory });
      setNewSkillName('');
      fetchAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Loading message="Loading system administration console..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={24} color="var(--accent-amber)" />
            <h1 className="page-title">Admin Console</h1>
          </div>
          <p className="page-subtitle">Manage system users, project ideas, skill master directories, and platform settings.</p>
        </div>
      </div>

      {/* Summary Totals */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>System Users</span>
          <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginTop: '0.25rem' }}>{users.length} Registered</h3>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Projects</span>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginTop: '0.25rem' }}>{projects.length} Created</h3>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Master Skill Tags</span>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>{skills.length} Defined</h3>
        </div>
      </div>

      {/* Add Skill Master Tag */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1rem' }}>Manage Master Skills List</h3>
        <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <input
            type="text"
            required
            placeholder="Skill Name (e.g. PyTorch, Rust)..."
            className="form-input"
            style={{ flex: 1 }}
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: '200px' }}
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Programming Languages">Programming Languages</option>
            <option value="Frontend Web">Frontend Web</option>
            <option value="Backend Web">Backend Web</option>
            <option value="AI & Data">AI & Data</option>
            <option value="Database">Database</option>
          </select>
          <button type="submit" className="btn btn-primary">
            <PlusCircle size={16} /> Add Skill
          </button>
        </form>

        <div>
          {skills.map(s => (
            <SkillBadge key={s._id || s.name} skill={s.name} />
          ))}
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1rem' }}>Registered Users Directory</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Email</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Department</th>
                <th style={{ padding: '0.75rem' }}>Skills Count</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`status-pill ${u.role === 'admin' ? 'status-high' : u.role === 'guide' ? 'status-completed' : 'status-progress'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.department}</td>
                  <td style={{ padding: '0.75rem' }}>{(u.skills || []).length} Skills</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
