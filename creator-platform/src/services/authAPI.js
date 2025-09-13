import { API_CONFIG } from '../config/api';

const API_BASE_URL = (process.env.REACT_APP_API_URL || API_CONFIG.API_BASE_URL) + '/api';

class AuthAPIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async login(email, password) {
    const data = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  }

  async signup(userData) {
    const { firstName, lastName, email, password } = userData;
    
    // Transform to match backend schema (name instead of firstName/lastName)
    const signupData = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      password,
    };

    const data = await this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  }

  async getProfile() {
    return await this.makeRequest('/auth/me');
  }

  // Profile Management
  async saveProfile(profileData, appearanceData, portfolioData) {
    return await this.makeRequest('/profile', {
      method: 'POST',
      body: JSON.stringify({ profileData, appearanceData, portfolioData }),
    });
  }

  async getFullProfile() {
    return await this.makeRequest('/profile');
  }

  async updateCustomLink(linkId, linkData) {
    return await this.makeRequest(`/profile/links/${linkId}`, {
      method: 'PUT',
      body: JSON.stringify(linkData),
    });
  }

  async addCustomLink(linkData) {
    return await this.makeRequest('/profile/links', {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  }

  async deleteCustomLink(linkId) {
    return await this.makeRequest(`/profile/links/${linkId}`, {
      method: 'DELETE',
    });
  }

  async trackLinkClick(linkId, clickData = {}) {
    return await this.makeRequest(`/profile/track-click/${linkId}`, {
      method: 'POST',
      body: JSON.stringify(clickData),
    });
  }

  // Analytics
  async getAnalytics() {
    return await this.makeRequest('/analytics');
  }

  async getLinkAnalytics(linkId) {
    return await this.makeRequest(`/analytics/links/${linkId}`);
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  getStoredToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated() {
    return !!this.getStoredToken();
  }
}

export const authAPI = new AuthAPIService();
export default authAPI;
