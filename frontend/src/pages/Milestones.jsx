import React, { useState, useEffect } from 'react';
import { projectService, milestoneService } from '../services/api';
import MilestoneCard from '../components/MilestoneCard';
import Loading from '../components/Loading';
import { Flag, PlusCircle, X } from 'lucide-react';

const Milestones = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Milestone Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    status: 'Pending',
    progress: 0
  });

  const fetchMilestonesData = async () => {
    setLoading(true);
    try {
      const projRes = await projectService.getProjects({ userProjects: 'true' });
      const projs = projRes.data || [];
      setProjects(projs);

      if (projs.length > 0) {
        const targetId = selectedProjectId || projs[0]._id;
        setSelectedProjectId(targetId);

        const mRes = await milestoneService.getProjectMilestones(targetId);
        setMilestones(mRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestonesData();
  }, [selectedProjectId]);

  const handleUpdateMilestone = async (id, data) => {
    try {
      await milestoneService.updateMilestone(id, data);
      fetchMilestonesData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMilestone = async (id) => {
    if (!window.confirm('Delete this milestone?')) return;
    try {
      await milestoneService.deleteMilestone(id);
      setMilestones(prev => prev.filter(m => m._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    try {
      await milestoneService.createMilestone(selectedProjectId, form);
      setIsModalOpen(false);
      setForm({ title: '', description: '', startDate: '', dueDate: '', status: 'Pending', progress: 0 });
      fetchMilestonesData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Loading message="Loading project milestones..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Milestones</h1>
          <p className="page-subtitle">Track major project deliverables, submission deadlines, and evaluation phases.</p>
        </div>

        {projects.length > 0 && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={16} /> Add Milestone
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No active projects found.</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {milestones.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                <p>No milestones created for this project yet.</p>
              </div>
            ) : (
              milestones.map(m => (
                <MilestoneCard
                  key={m._id}
                  milestone={m}
                  canManage={true}
                  onUpdateMilestone={handleUpdateMilestone}
                  onDeleteMilestone={handleDeleteMilestone}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* CREATE MILESTONE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Add Project Milestone</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateMilestone}>
              <div className="form-group">
                <label className="form-label">Milestone Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. System Design & Teammate Formation"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="Key deliverables and evaluation goals..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Milestones;
