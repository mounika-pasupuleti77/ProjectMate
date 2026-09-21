import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://projectmate-3kx9.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// User Services
export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data)
};

// Skill Services
export const skillService = {
  getSkills: () => api.get('/skills'),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`)
};

// Project Idea Services
export const projectIdeaService = {
  getIdeas: (params) => api.get('/project-ideas', { params }),
  getIdeaById: (id) => api.get(`/project-ideas/${id}`),
  createIdea: (data) => api.post('/project-ideas', data),
  updateIdea: (id, data) => api.put(`/project-ideas/${id}`, data),
  deleteIdea: (id) => api.delete(`/project-ideas/${id}`)
};

// Project Services
export const projectService = {
  getProjects: (params) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  recommendTeammates: (projectId, params) => api.get(`/projects/${projectId}/recommend-teammates`, { params })
};

// Team Services
export const teamService = {
  getTeamById: (id) => api.get(`/teams/${id}`),
  updateTeam: (id, data) => api.put(`/teams/${id}`, data)
};

// Team Request Services
export const teamRequestService = {
  sendRequest: (data) => api.post('/team-requests', data),
  getReceived: () => api.get('/team-requests/received'),
  getSent: () => api.get('/team-requests/sent'),
  respondRequest: (id, data) => api.put(`/team-requests/${id}`, data)
};

// Guide Services
export const guideService = {
  getGuides: (params) => api.get('/guides', { params }),
  getGuideById: (id) => api.get(`/guides/${id}`)
};

// Guide Request Services
export const guideRequestService = {
  sendRequest: (data) => api.post('/guide-requests', data),
  getRequests: () => api.get('/guide-requests'),
  respondRequest: (id, data) => api.put(`/guide-requests/${id}`, data)
};

// Task Services
export const taskService = {
  getProjectTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

// Milestone Services
export const milestoneService = {
  getProjectMilestones: (projectId) => api.get(`/projects/${projectId}/milestones`),
  createMilestone: (projectId, data) => api.post(`/projects/${projectId}/milestones`, data),
  updateMilestone: (id, data) => api.put(`/milestones/${id}`, data),
  deleteMilestone: (id) => api.delete(`/milestones/${id}`)
};

// GitHub Integration Services
export const githubService = {
  connectRepo: (projectId, data) => api.post(`/projects/${projectId}/github`, data),
  getRepoInfo: (projectId) => api.get(`/projects/${projectId}/github`)
};

// Analytics Services
export const analyticsService = {
  getPlatformDashboard: () => api.get('/analytics/dashboard'),
  getProjectDashboard: (projectId) => api.get(`/analytics/project/${projectId}`)
};

// Notification Services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all')
};

export default api;
