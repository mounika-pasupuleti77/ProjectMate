import React, { useState, useEffect } from 'react';
import { guideService, projectService, guideRequestService } from '../services/api';
import GuideCard from '../components/GuideCard';
import Loading from '../components/Loading';
import { GraduationCap, Search, Send, X } from 'lucide-react';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Guide Request Modal state
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [targetProjectId, setTargetProjectId] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(null);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const res = await guideService.getGuides({
        department: departmentFilter,
        search: searchQuery
      });
      setGuides(res.data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [departmentFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGuides();
  };

  const handleOpenRequestModal = async (guide) => {
    setSelectedGuide(guide);
    setRequestFeedback(null);
    try {
      const res = await projectService.getProjects({ userProjects: 'true' });
      const projs = res.data || [];
      setUserProjects(projs);
      if (projs.length > 0) {
        setTargetProjectId(projs[0]._id);
        setRequestMessage(`Respected ${guide.name}, our team requests your guidance for our major project "${projs[0].title}".`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setRequestFeedback = (fb) => setModalFeedback(fb);

  const handleSendGuideRequest = async (e) => {
    e.preventDefault();
    if (!selectedGuide || !targetProjectId) return;

    setSubmitting(true);
    setModalFeedback(null);

    try {
      await guideRequestService.sendRequest({
        projectId: targetProjectId,
        guideId: selectedGuide._id,
        message: requestMessage
      });

      setModalFeedback({ type: 'success', text: `Guide request sent to ${selectedGuide.name}!` });
      setTimeout(() => setSelectedGuide(null), 1800);
    } catch (error) {
      setModalFeedback({ type: 'error', text: error.response?.data?.message || 'Failed to send guide request' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Guide Directory</h1>
          <p className="page-subtitle">Search professors by technical domain expertise and send official project guide requests.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label className="form-label">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="form-select"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="Artificial Intelligence & Data Science">AI & DS</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Search Expertise or Name</label>
            <input
              type="text"
              placeholder="Search by faculty name or tech expertise (e.g. Machine Learning)..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Search size={16} /> Search Guides
          </button>
        </form>
      </div>

      {/* Guide Cards Grid */}
      {loading ? (
        <Loading message="Loading faculty directory..." />
      ) : guides.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No faculty guides found matching criteria.</p>
        </div>
      ) : (
        <div className="grid-3">
          {guides.map(guide => (
            <GuideCard
              key={guide._id}
              guide={guide}
              onRequestGuide={() => handleOpenRequestModal(guide)}
            />
          ))}
        </div>
      )}

      {/* GUIDE REQUEST MODAL */}
      {selectedGuide && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                Request Guide: {selectedGuide.name}
              </h3>
              <button onClick={() => setSelectedGuide(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {modalFeedback && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                background: modalFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: modalFeedback.type === 'success' ? '#6ee7b7' : '#fda4af',
                fontSize: '0.85rem'
              }}>
                {modalFeedback.text}
              </div>
            )}

            {userProjects.length === 0 ? (
              <p style={{ color: 'var(--accent-amber)' }}>
                You must create a project before requesting a faculty guide.
              </p>
            ) : (
              <form onSubmit={handleSendGuideRequest}>
                <div className="form-group">
                  <label className="form-label">Target Project</label>
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    className="form-select"
                  >
                    {userProjects.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Request Message</label>
                  <textarea
                    required
                    rows="4"
                    className="form-textarea"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setSelectedGuide(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Guide Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Guides;
