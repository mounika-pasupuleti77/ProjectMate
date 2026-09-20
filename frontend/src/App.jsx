import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProjectIdeas from './pages/ProjectIdeas';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import FindTeammates from './pages/FindTeammates';
import MyTeam from './pages/MyTeam';
import Guides from './pages/Guides';
import Tasks from './pages/Tasks';
import Milestones from './pages/Milestones';
import GitHubView from './pages/GitHubView';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

const PublicLayout = ({ children }) => {
  return children;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex' }}>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="/project-ideas" element={<ProtectedLayout><ProjectIdeas /></ProtectedLayout>} />
          <Route path="/projects/:id" element={<ProtectedLayout><ProjectDetails /></ProtectedLayout>} />
          <Route path="/create-project" element={<ProtectedLayout><CreateProject /></ProtectedLayout>} />
          <Route path="/find-teammates" element={<ProtectedLayout><FindTeammates /></ProtectedLayout>} />
          <Route path="/my-team" element={<ProtectedLayout><MyTeam /></ProtectedLayout>} />
          <Route path="/guides" element={<ProtectedLayout><Guides /></ProtectedLayout>} />
          <Route path="/tasks" element={<ProtectedLayout><Tasks /></ProtectedLayout>} />
          <Route path="/milestones" element={<ProtectedLayout><Milestones /></ProtectedLayout>} />
          <Route path="/github" element={<ProtectedLayout><GitHubView /></ProtectedLayout>} />
          <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
          <Route path="/admin" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
