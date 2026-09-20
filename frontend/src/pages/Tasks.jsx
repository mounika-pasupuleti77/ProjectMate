import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, taskService, teamService } from '../services/api';
import TaskCard from '../components/TaskCard';
import Loading from '../components/Loading';
import { CheckSquare, PlusCircle, Filter, X } from 'lucide-react';

const Tasks = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: ''
  });

  const fetchTaskBoardData = async () => {
    setLoading(true);
    try {
      const projRes = await projectService.getProjects({ userProjects: 'true' });
      const projs = projRes.data || [];
      setProjects(projs);

      if (projs.length > 0) {
        const targetProjId = selectedProjectId || projs[0]._id;
        setSelectedProjectId(targetProjId);

        const taskRes = await taskService.getProjectTasks(targetProjId);
        setTasks(taskRes.data || []);

        const projDetail = await projectService.getProjectById(targetProjId);
        if (projDetail.data.team) {
          const teamRes = await teamService.getTeamById(projDetail.data.team._id || projDetail.data.team);
          setTeamMembers((teamRes.data?.members || []).map(m => m.user));
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskBoardData();
  }, [selectedProjectId]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    try {
      await taskService.createTask(selectedProjectId, taskForm);
      setIsModalOpen(false);
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'Medium', status: 'To Do', dueDate: '' });
      fetchTaskBoardData();
    } catch (error) {
      console.error('Task creation error:', error);
    }
  };

  if (loading) return <Loading message="Loading task board..." />;

  const toDoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Management Board</h1>
          <p className="page-subtitle">Organize, assign, and track project tasks across your team members.</p>
        </div>

        {projects.length > 0 && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={16} /> Add Task
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No project associated with your account.</p>
        </div>
      ) : (
        <>
          {/* Project selector bar */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Select Project Task Board</label>
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

          {/* Kanban Board 3 Columns */}
          <div className="grid-3" style={{ alignItems: 'start' }}>
            {/* To Do Column */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--accent-amber)' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>To Do</h3>
                <span className="status-pill status-pending">{toDoTasks.length}</span>
              </div>
              {toDoTasks.map(t => (
                <TaskCard
                  key={t._id}
                  task={t}
                  canEdit={true}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>

            {/* In Progress Column */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>In Progress</h3>
                <span className="status-pill status-progress">{inProgressTasks.length}</span>
              </div>
              {inProgressTasks.map(t => (
                <TaskCard
                  key={t._id}
                  task={t}
                  canEdit={true}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>

            {/* Completed Column */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--accent-emerald)' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Completed</h3>
                <span className="status-pill status-completed">{completedTasks.length}</span>
              </div>
              {completedTasks.map(t => (
                <TaskCard
                  key={t._id}
                  task={t}
                  canEdit={true}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Create New Task</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Implement JWT Auth & User Controllers"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="Details of task requirements..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Assign To Member</label>
                  <select
                    className="form-select"
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select
                    className="form-select"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Task Status</label>
                  <select
                    className="form-select"
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
