import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

const AuthDebugger = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { profileData, appearanceData, analyticsData, isLoading: profileLoading } = useProfile();

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4ade80' }}>🔍 Auth Debugger</h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Auth State:</strong><br/>
        Authenticated: {isAuthenticated ? '✅' : '❌'}<br/>
        Auth Loading: {authLoading ? '⏳' : '✅'}<br/>
        User: {user ? user.name || user.username || 'Unknown' : 'None'}<br/>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Profile State:</strong><br/>
        Profile Loading: {profileLoading ? '⏳' : '✅'}<br/>
        Profile Title: {profileData.title || 'None'}<br/>
        Profile Bio: {profileData.bio ? '✅' : '❌'}<br/>
        Custom Links: {profileData.customLinks?.length || 0}<br/>
        Social Links: {Object.values(profileData.socialLinks || {}).filter(link => link).length}<br/>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Appearance:</strong><br/>
        Theme: {appearanceData.theme || 'None'}<br/>
        Brand Color: {appearanceData.brandColor || 'None'}<br/>
      </div>

      <div>
        <strong>Analytics:</strong><br/>
        Data: {analyticsData ? '✅' : '❌'}<br/>
        Total Views: {analyticsData?.totalViews || 0}<br/>
        Total Clicks: {analyticsData?.totalClicks || 0}<br/>
      </div>
    </div>
  );
};

export default AuthDebugger;
