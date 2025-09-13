import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import PublicProfile from './pages/PublicProfile';
import AboutUs from './pages/AboutUs';
import PortfolioBuilder from './pages/PortfolioBuilder';
import PortfolioDisplay from './pages/PortfolioDisplay';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/u/:username" element={<PublicProfile />} />
              <Route path="/profile/public" element={<PublicProfile />} />
              <Route 
                path="/portfolio/builder" 
                element={
                  <ProtectedRoute>
                    <PortfolioBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/portfolio/preview/:username" 
                element={
                  <ProtectedRoute>
                    <PortfolioDisplay />
                  </ProtectedRoute>
                } 
              />
              <Route path="/portfolio/:username" element={<PortfolioDisplay />} />
              <Route path="/about" element={<AboutUs />} />
            </Routes>
          </div>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
