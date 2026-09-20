import React, { useState, useEffect } from 'react';
import { analyticsService, projectService } from '../services/api';
import Loading from '../components/Loading';
import { BarChart2, PieChart, TrendingUp, CheckCircle, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

const Analytics = () => {
  const [platformStats, setPlatformStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectStats, setProjectStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const platRes = await analyticsService.getPlatformDashboard();
        setPlatformStats(platRes.data);

        const projRes = await projectService.getProjects({ userProjects: 'true' });
        const projs = projRes.data || [];
        setProjects(projs);

        if (projs.length > 0) {
          const targetId = selectedProjectId || projs[0]._id;
          setSelectedProjectId(targetId);

          const pStatRes = await analyticsService.getProjectDashboard(targetId);
          setProjectStats(pStatRes.data);
        }
      } catch (error) {
        console.error('Analytics fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedProjectId]);

  if (loading) return <Loading message="Generating analytics visualizations..." />;

  const taskPieData = projectStats ? [
    { name: 'Completed', value: projectStats.tasks.completed, color: '#10b981' },
    { name: 'In Progress', value: projectStats.tasks.inProgress, color: '#6366f1' },
    { name: 'To Do', value: projectStats.tasks.toDo, color: '#f59e0b' }
  ] : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <BarChart2 size={24} color="var(--primary)" />
            <h1 className="page-title">Project Analytics & Insights</h1>
          </div>
          <p className="page-subtitle">Visual evaluation metrics, task completion velocity, and team contribution statistics.</p>
        </div>
      </div>

      {/* Platform Totals Banner */}
      {platformStats && (
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Registered Students</span>
            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginTop: '0.2rem' }}>{platformStats.totals.totalStudents}</h3>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Faculty Guides</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>{platformStats.totals.totalFaculty}</h3>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Major Projects</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginTop: '0.2rem' }}>{platformStats.totals.activeProjects}</h3>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Task Completion Rate</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-amber)', marginTop: '0.2rem' }}>{platformStats.totals.taskCompletionRate}%</h3>
          </div>
        </div>
      )}

      {/* Project-Specific Analytics Section */}
      {projects.length > 0 && (
        <>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Select Project for Deep Analytics</label>
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

          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {/* Task Status Breakdown Pie Chart */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#ffffff' }}>
                Task Completion Status
              </h3>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={taskPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {taskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Member Contributions Bar Chart */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#ffffff' }}>
                Member Task Distribution
              </h3>
              {projectStats && (projectStats.memberContributions || []).length > 0 ? (
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectStats.memberContributions}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#10b981" name="Completed Tasks" />
                      <Bar dataKey="total" fill="#6366f1" name="Total Assigned Tasks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p style={{ color: 'var(--text-dim)', textAlign: 'center', paddingTop: '4rem' }}>
                  No member task assignments recorded yet.
                </p>
              )}
            </div>
          </div>

          {/* Domain Distribution across platform */}
          {platformStats && (
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#ffffff' }}>
                College Project Domain Distribution
              </h3>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformStats.domainStats}>
                    <XAxis dataKey="domain" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;
