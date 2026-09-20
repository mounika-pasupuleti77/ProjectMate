import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService, teamRequestService, guideRequestService, projectIdeaService } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import StudentCard from '../components/StudentCard';
import Loading from '../components/Loading';
import {
  Sparkles,
  Users,
  CheckSquare,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  UserCheck,
  PlusCircle,
  FileCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user, isStudent, isGuide, isAdmin } = useAuth();

  const [myProjects, setMyProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [guideRequests, setGuideRequests] = useState([]);
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (isStudent) {
        // Fetch projects where student is owner/member
        const projRes = await projectService.getProjects({ userProjects: 'true' });
        const projs = projRes.data || [];
        setMyProjects(projs);

        // Fetch team requests received
        const reqRes = await teamRequestService.getReceived();
        setReceivedRequests(reqRes.data || []);

        // Fetch recommended ideas
        const ideaRes = await projectIdeaService.getIdeas();
        setProjectIdeas((ideaRes.data || []).slice(0, 3));

        // If user has a project, fetch smart teammate recommendations!
        if (projs.length > 0) {
          try {
            const recRes = await projectService.recommendTeammates(projs[0]._id);
            setRecommendations((recRes.data.recommendations || []).slice(0, 3));
          } catch (recErr) {
            console.warn('Recommendation fetch warning:', recErr);
          }
        }
      } else if (isGuide) {
        // Fetch projects guided by faculty
        const projRes = await projectService.getProjects({ userProjects: 'true' });
        setMyProjects(projRes.data || []);

        // Fetch guide requests pending
        const gReqRes = await guideRequestService.getRequests();
        setGuideRequests(gReqRes.data || []);
      } else if (isAdmin) {
        const projRes = await projectService.getProjects();
        setMyProjects(projRes.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleRespondTeamReq = async (id, status) => {
    try {
      await teamRequestService.respondRequest(id, { status });
      fetchDashboardData();
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  const handleRespondGuideReq = async (id, status) => {
    try {
      await guideRequestService.respondRequest(id, { status });
      fetchDashboardData();
    } catch (error) {
      console.error('Error responding to guide request:', error);
    }
  };

  if (loading) return <Loading message="Loading your ProjectMate dashboard..." />;

  const activeProject = myProjects.length > 0 ? myProjects[0] : null;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card" style={{
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {isStudent && (activeProject ? `Working on: ${activeProject.title}` : 'Ready to start your major project?')}
              {isGuide && `Faculty Guide • ${user?.department}`}
              {isAdmin && 'Platform System Administrator'}
            </p>
          </div>

          {isStudent && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/find-teammates" className="btn btn-primary">
                <UserCheck size={16} /> Find Teammates
              </Link>
              <Link to="/create-project" className="btn btn-secondary">
                <PlusCircle size={16} /> Create Project
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT DASHBOARD CONTENT */}
      {isStudent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick Status Cards */}
          <div className="grid-4">
            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Project</span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '0.25rem' }}>
                {activeProject ? '1 Active' : '0 Created'}
              </h3>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Pending Team Invites</span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginTop: '0.25rem' }}>
                {receivedRequests.filter(r => r.status === 'Pending').length} Pending
              </h3>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Faculty Guide</span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>
                {activeProject?.guide ? activeProject.guide.name.split(' ')[0] : 'Not Assigned'}
              </h3>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Project Progress</span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-amber)', marginTop: '0.25rem' }}>
                {activeProject ? `${activeProject.progress}%` : '0%'}
              </h3>
            </div>
          </div>

          {/* Active Project & Recommended Teammates Section */}
          <div className="grid-2">
            <div>
              <div className="page-header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
                <h2 style={{ fontSize: '1.3rem' }}>My Major Project</h2>
                {activeProject && (
                  <Link to={`/projects/${activeProject._id}`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    View Full Details →
                  </Link>
                )}
              </div>

              {activeProject ? (
                <ProjectCard project={activeProject} />
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <PlusCircle size={42} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Active Project Created Yet</h3>
                  <p style={{ marginBottom: '1.5rem' }}>Create a new project or browse project ideas to start building your skill-matched team.</p>
                  <Link to="/create-project" className="btn btn-primary">
                    Create Major Project
                  </Link>
                </div>
              )}
            </div>

            {/* Smart Teammate Recommendation Widget */}
            <div>
              <div className="page-header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="var(--primary)" />
                  <h2 style={{ fontSize: '1.3rem' }}>Recommended Teammates</h2>
                </div>
                <Link to="/find-teammates" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Find More →
                </Link>
              </div>

              {recommendations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recommendations.map(rec => (
                    <StudentCard
                      key={rec.student._id}
                      student={rec.student}
                      skillMatchPercentage={rec.skillMatchPercentage}
                      matchedSkills={rec.matchedSkills}
                      missingSkills={rec.missingSkills}
                    />
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                  <UserCheck size={36} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
                  <p>Create a project with required skills to view automated skill-matched teammate recommendations!</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Received Requests */}
          {receivedRequests.filter(r => r.status === 'Pending').length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Pending Team Invitations</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {receivedRequests.filter(r => r.status === 'Pending').map(req => (
                  <div key={req._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: '#ffffff' }}>
                        Invite from {req.sender?.name} for project: <span style={{ color: 'var(--primary)' }}>{req.project?.title}</span>
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        "{req.message}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleRespondTeamReq(req._id, 'Accepted')}
                        className="btn btn-primary btn-sm"
                      >
                        Accept Invitation
                      </button>
                      <button
                        onClick={() => handleRespondTeamReq(req._id, 'Rejected')}
                        className="btn btn-secondary btn-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Ideas */}
          <div>
            <div className="page-header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Trending Project Ideas</h2>
              <Link to="/project-ideas" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Browse Ideas →</Link>
            </div>
            <div className="grid-3">
              {projectIdeas.map(idea => (
                <div key={idea._id} className="card">
                  <span className="status-pill status-progress" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                    {idea.domain}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{idea.title}</h3>
                  <p style={{ fontSize: '0.825rem', marginBottom: '1rem' }}>{idea.description}</p>
                  <Link to={`/project-ideas`} className="btn btn-outline btn-sm">
                    Explore Idea
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GUIDE DASHBOARD CONTENT */}
      {isGuide && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Pending Guide Requests */}
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Pending Project Guide Requests</h2>
            {guideRequests.filter(r => r.status === 'Pending').length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {guideRequests.filter(r => r.status === 'Pending').map(req => (
                  <div key={req._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                        Project: <span style={{ color: 'var(--primary)' }}>{req.project?.title}</span>
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Submitted by: {req.student?.name} ({req.student?.department} • {req.student?.year})
                      </p>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                        "{req.message}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleRespondGuideReq(req._id, 'Accepted')}
                        className="btn btn-primary btn-sm"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleRespondGuideReq(req._id, 'Rejected')}
                        className="btn btn-secondary btn-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <FileCheck size={36} color="var(--accent-emerald)" style={{ marginBottom: '0.5rem' }} />
                <p>No pending guide requests at the moment.</p>
              </div>
            )}
          </div>

          {/* Assigned Projects */}
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Assigned Student Projects</h2>
            <div className="grid-2">
              {myProjects.map(proj => (
                <ProjectCard key={proj._id} project={proj} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD CONTENT */}
      {isAdmin && (
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>System Projects Overview</h2>
          <div className="grid-2">
            {myProjects.map(proj => (
              <ProjectCard key={proj._id} project={proj} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
