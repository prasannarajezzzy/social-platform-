import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Copy,
  ExternalLink,
  X,
  FileText,
  Link,
  Check,
  AlertCircle
} from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import { authAPI } from '../../services/authAPI';

const PortfolioProfilesList = () => {
  const navigate = useNavigate();
  const {
    portfolioProfiles,
    updatePortfolioProfile,
    deletePortfolioProfile,
    setDefaultPortfolioProfile
  } = useProfile();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfileDescription, setEditProfileDescription] = useState('');
  const [editPortfolioUsername, setEditPortfolioUsername] = useState('');
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);


  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setEditProfileName(profile.name);
    setEditProfileDescription(profile.description || '');
    setEditPortfolioUsername(profile.portfolioData?.portfolioUsername || '');
    setUsernameAvailability(null);
    setShowEditModal(true);
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailability(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await authAPI.checkPortfolioUsername(username);
      setUsernameAvailability(response.available);
    } catch (error) {
      console.error('Error checking username availability:', error);
      setUsernameAvailability(false);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (value) => {
    setEditPortfolioUsername(value);
    // Debounce the username check
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const copyPortfolioUrl = (username) => {
    const url = `${window.location.origin}/portfolio/${username}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
    alert('Portfolio URL copied to clipboard!');
  };

  const handleUpdateProfile = async () => {
    if (!editProfileName.trim() || !editingProfile) return;
    
    // Check username availability if it's being changed
    if (editPortfolioUsername && editPortfolioUsername !== editingProfile.portfolioData?.portfolioUsername) {
      if (usernameAvailability === false) {
        alert('Portfolio username is not available. Please choose a different username.');
        return;
      }
    }
    
    try {
      await updatePortfolioProfile(editingProfile.id, {
        name: editProfileName,
        description: editProfileDescription,
        portfolioUsername: editPortfolioUsername
      });
      setShowEditModal(false);
      setEditingProfile(null);
      setEditProfileName('');
      setEditProfileDescription('');
      setEditPortfolioUsername('');
      setUsernameAvailability(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.message.includes('username')) {
        alert('Portfolio username is already taken. Please choose a different username.');
      }
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this portfolio profile? This action cannot be undone.')) {
      try {
        await deletePortfolioProfile(profileId);
      } catch (error) {
        console.error('Error deleting profile:', error);
        
        // Handle specific error cases
        if (error.message === 'Cannot delete the last portfolio profile') {
          alert('You cannot delete your last portfolio. Please create another portfolio first before deleting this one.');
        } else if (error.message === 'Portfolio profile not found') {
          alert('This portfolio could not be found. It may have already been deleted.');
        } else {
          alert('Failed to delete portfolio. Please try again.');
        }
      }
    }
  };

  const handleSetDefault = async (profileId) => {
    try {
      await setDefaultPortfolioProfile(profileId);
    } catch (error) {
      console.error('Error setting default profile:', error);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="portfolio-profiles-list">
      <style>{`
        .portfolio-profiles-list {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background: #2563eb;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .portfolio-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s ease;
        }
        
        .portfolio-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }
        
        .portfolio-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .portfolio-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }
        
        .portfolio-description {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }
        
        .portfolio-status {
          display: flex;
          gap: 0.5rem;
        }
        
        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .status-default {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .status-active {
          background: #d1fae5;
          color: #065f46;
        }
        
        .portfolio-url-section {
          margin: 1rem 0;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .url-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .portfolio-url {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: #3b82f6;
          background: white;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }
        
        .portfolio-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .portfolio-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .username-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }
        
        .status-available {
          color: #059669;
        }
        
        .status-unavailable {
          color: #dc2626;
        }
        
        .status-checking {
          color: #6b7280;
        }
        
        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }
        
        .empty-icon {
          margin-bottom: 1rem;
          color: #d1d5db;
        }
        
        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
        }
        
        .empty-state p {
          margin: 0 0 2rem 0;
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Portfolio Profiles</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/portfolio/builder')}
        >
          <Plus size={20} />
          Create New Portfolio
        </button>
      </div>

      {portfolioProfiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={64} />
          </div>
          <h3>No portfolio profiles yet</h3>
          <p>Create your first portfolio profile to get started</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/portfolio/builder')}
          >
            <Plus size={20} />
            Create Your First Portfolio
          </button>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolioProfiles.map((profile) => (
            <div key={profile.id} className="portfolio-card">
              <div className="portfolio-header">
                <div>
                  <h3 className="portfolio-title">{profile.name}</h3>
                  <p className="portfolio-description">
                    {profile.description || 'No description provided'}
                  </p>
                </div>
                <div className="portfolio-status">
                  {profile.isDefault && (
                    <span className="status-badge status-default">Default</span>
                  )}
                  {profile.isActive && (
                    <span className="status-badge status-active">Active</span>
                  )}
                </div>
              </div>

              {profile.portfolioData?.portfolioUsername && (
                <div className="portfolio-url-section">
                  <div className="url-label">Portfolio URL:</div>
                  <div className="portfolio-url">
                    <Link size={16} />
                    <span>{window.location.origin}/portfolio/{profile.portfolioData.portfolioUsername}</span>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => copyPortfolioUrl(profile.portfolioData.portfolioUsername)}
                      title="Copy URL"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              )}

              <div className="portfolio-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleEditProfile(profile)}
                >
                  <Edit3 size={16} />
                  Edit
                </button>
                {profile.portfolioData?.portfolioUsername && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => window.open(`/portfolio/${profile.portfolioData.portfolioUsername}`, '_blank')}
                  >
                    <ExternalLink size={16} />
                    View
                  </button>
                )}
                {!profile.isDefault && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleSetDefault(profile.id)}
                  >
                    <Star size={16} />
                    Set Default
                  </button>
                )}
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleDeleteProfile(profile.id)}
                  style={{ color: '#dc2626' }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

              <div className="portfolio-meta">
                <span>Created {formatDate(profile.createdAt)}</span>
                <span>Updated {formatDate(profile.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Portfolio Profile</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Name</label>
              <input
                type="text"
                className="form-input"
                value={editProfileName}
                onChange={(e) => setEditProfileName(e.target.value)}
                placeholder="Enter profile name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={editProfileDescription}
                onChange={(e) => setEditProfileDescription(e.target.value)}
                placeholder="Enter profile description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Portfolio Username</label>
              <input
                type="text"
                className="form-input"
                value={editPortfolioUsername}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Enter unique username for your portfolio URL"
              />
              {editPortfolioUsername && (
                <div className="username-status">
                  {checkingUsername ? (
                    <>
                      <AlertCircle size={16} />
                      <span className="status-checking">Checking availability...</span>
                    </>
                  ) : usernameAvailability === true ? (
                    <>
                      <Check size={16} />
                      <span className="status-available">Username is available!</span>
                    </>
                  ) : usernameAvailability === false ? (
                    <>
                      <AlertCircle size={16} />
                      <span className="status-unavailable">Username is already taken</span>
                    </>
                  ) : null}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdateProfile}
                disabled={!editProfileName.trim()}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioProfilesList;
