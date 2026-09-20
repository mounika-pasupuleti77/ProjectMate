import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, teamService, teamRequestService } from '../services/api';
import TeamMemberCard from '../components/TeamMemberCard';
import Loading from '../components/Loading';
import { Users, GraduationCap, Send, Inbox, ShieldCheck, X, Edit3 } from 'lucide-react';

const TEAM_ROLES = [
  'Team Leader',
  'Frontend Developer',
  'Backend Developer',
  'AI/ML Developer',
  'Database Developer',
  'UI/UX Designer',
  'Documentation Specialist'
];

const MyTeam = () => {
  const { user, isStudent } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [team, setTeam] = useState(null);
  const [project, setProject] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role Edit Modal
  const [editRoleMemberId, setEditRoleMemberId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const projRes = await projectService.getProjects({ userProjects: 'true' });
      const projs = projRes.data || [];
      setProjects(projs);

      if (projs.length > 0) {
        const targetProjId = selectedProjectId || projs[0]._id;
        setSelectedProjectId(targetProjId);

        const projDetail = await projectService.getProjectById(targetProjId);
        setProject(projDetail.data);

        if (projDetail.data.team) {
          const teamRes = await teamService.getTeamById(projDetail.data.team._id || projDetail.data.team);
          setTeam(teamRes.data);
        }
      }

      // Fetch requests
      const sentRes = await teamRequestService.getSent();
      setSentRequests(sentRes.data || []);

      const recRes = await teamRequestService.getReceived();
      setReceivedRequests(recRes.data || []);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [selectedProjectId]);

  const handleUpdateRole = async () => {
    if (!team || !editRoleMemberId) return;

    try {
      await teamService.updateTeam(team._id, {
        memberRoles: [{ userId: editRoleMemberId, role: selectedRole }]
      });
      setEditRoleMemberId(null);
      fetchTeamData();
    } catch (error) {
      console.error('Role update error:', error);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!team) return;
    if (!window.confirm('Are you sure you want to remove this member from the team?')) return;

    try {
      await teamService.updateTeam(team._id, { removeUserId: userId });
      fetchTeamData();
    } catch (error) {
      console.error('Remove member error:', error);
    }
  };

  const isLeader = team && user && team.leader && (team.leader._id === user._id || team.leader === user._id);

  if (loading) return <Loading message="Loading team details..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Team Management</h1>
          <p className="page-subtitle">Manage project team members, assign specialized roles, and track guide assignment.</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No project associated with your account yet.</p>
        </div>
      ) : (
        <>
          {/* Project selector */}
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

          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {/* Active Team Members List */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Team Members ({(team?.members || []).length})</h2>
                {isStudent && (
                  <a href="/find-teammates" className="btn btn-primary btn-sm">
                    + Invite Member
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(team?.members || []).map(m => (
                  <TeamMemberCard
                    key={m.user?._id || m.user}
                    member={m}
                    isLeader={team.leader?._id === (m.user?._id || m.user)}
                    canManage={isLeader}
                    onUpdateRole={(userId, currentRole) => {
                      setEditRoleMemberId(userId);
                      setSelectedRole(currentRole || 'Frontend Developer');
                    }}
                    onRemoveMember={handleRemoveMember}
                  />
                ))}
              </div>
            </div>

            {/* Guide & Project Info Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Faculty Guide Card */}
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={20} color="var(--accent-emerald)" /> Assigned Faculty Guide
                </h3>

                {project?.guide ? (
                  <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '1.05rem', color: '#ffffff' }}>{project.guide.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{project.guide.department}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>{project.guide.bio}</p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                    <p style={{ color: 'var(--accent-amber)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      No faculty guide assigned yet.
                    </p>
                    {isStudent && (
                      <a href="/guides" className="btn btn-outline btn-sm">
                        Find & Request Guide
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Sent Team Requests */}
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={18} color="var(--primary)" /> Sent Team Invites
                </h3>

                {sentRequests.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>No sent invitations.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {sentRequests.map(r => (
                      <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.5rem 0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                          <strong>{r.receiver?.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{r.receiver?.department}</span>
                        </div>
                        <span className={`status-pill ${r.status === 'Accepted' ? 'status-completed' : r.status === 'Rejected' ? 'status-high' : 'status-pending'}`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* EDIT ROLE MODAL */}
      {editRoleMemberId && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '420px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#ffffff' }}>Assign Team Role</h3>
            <div className="form-group">
              <label className="form-label">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="form-select"
              >
                {TEAM_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setEditRoleMemberId(null)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button onClick={handleUpdateRole} className="btn btn-primary btn-sm">
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;
