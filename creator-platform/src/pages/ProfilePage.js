import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  Upload, 
  Palette, 
  Type, 
  Layout, 
  Globe, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin,
  Github,
  Facebook,
  Music,
  Link as LinkIcon,
  Save,
  Eye,
  ArrowLeft,
  Camera,
  X,
  Plus,
  Edit3,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    profileData, 
    appearanceData, 
    updateProfile, 
    updateSocialLink, 
    updateAppearance, 
    saveProfile,
    isLoading,
    addCustomLink,
    updateCustomLink,
    deleteCustomLink,
    reorderCustomLinks
  } = useProfile();
  
  const [activeTab, setActiveTab] = useState('profile');

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'links', 'appearance'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [linkForm, setLinkForm] = useState({ title: '', url: '', description: '', icon: 'ExternalLink' });
  const fileInputRef = useRef(null);

  const themes = [
    { id: 'lake-white', name: 'Lake White', preview: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)' },
    { id: 'sunset', name: 'Sunset', preview: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' },
    { id: 'ocean', name: 'Ocean', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'forest', name: 'Forest', preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { id: 'midnight', name: 'Midnight', preview: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' },
    { id: 'custom', name: 'Custom', preview: appearanceData.brandColor }
  ];

  const buttonStyles = [
    { id: 'rounded', name: 'Rounded', preview: 'border-radius: 12px;' },
    { id: 'pill', name: 'Pill', preview: 'border-radius: 50px;' },
    { id: 'square', name: 'Square', preview: 'border-radius: 4px;' },
    { id: 'sharp', name: 'Sharp', preview: 'border-radius: 0;' }
  ];

  const buttonLayouts = [
    { id: 'stack', name: 'Stack', icon: '☰' },
    { id: 'grid', name: 'Grid', icon: '⊞' },
    { id: 'carousel', name: 'Carousel', icon: '⇄' }
  ];

  const fonts = [
    { id: 'inter', name: 'Inter', style: 'font-family: Inter, sans-serif;' },
    { id: 'poppins', name: 'Poppins', style: 'font-family: Poppins, sans-serif;' },
    { id: 'roboto', name: 'Roboto', style: 'font-family: Roboto, sans-serif;' },
    { id: 'montserrat', name: 'Montserrat', style: 'font-family: Montserrat, sans-serif;' },
    { id: 'playfair', name: 'Playfair Display', style: 'font-family: "Playfair Display", serif;' }
  ];

  const availableIcons = [
    { id: 'ExternalLink', name: 'External Link', component: LinkIcon },
    { id: 'Globe', name: 'Website', component: Globe },
    { id: 'Youtube', name: 'YouTube', component: Youtube },
    { id: 'Instagram', name: 'Instagram', component: Instagram },
    { id: 'Twitter', name: 'Twitter', component: Twitter },
    { id: 'Linkedin', name: 'LinkedIn', component: Linkedin },
    { id: 'Github', name: 'GitHub', component: Github },
    { id: 'Facebook', name: 'Facebook', component: Facebook },
    { id: 'Music', name: 'TikTok/Music', component: Music },
    { id: 'ShoppingBag', name: 'Shop', component: ShoppingBag },
    { id: 'Upload', name: 'Portfolio', component: Upload }
  ];

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfile({
          profileImage: file,
          profileImageUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field, value) => {
    updateProfile({ [field]: value });
  };

  const handleSocialLinkChange = (platform, value) => {
    updateSocialLink(platform, value);
  };

  const handleAppearanceChange = (field, value) => {
    updateAppearance({ [field]: value });
  };

  const handleSave = async () => {
    const result = await saveProfile();
    if (result.success) {
      alert('Profile saved successfully!');
    } else {
      alert('Error saving profile: ' + result.error);
    }
  };

  const getSocialIcon = (platform) => {
    const icons = {
      instagram: Instagram,
      twitter: Twitter,
      youtube: Youtube,
      linkedin: Linkedin,
      github: Github,
      facebook: Facebook,
      tiktok: Music,
      website: Globe
    };
    return icons[platform] || LinkIcon;
  };

  const getIconComponent = (iconId) => {
    const icon = availableIcons.find(i => i.id === iconId);
    return icon ? icon.component : LinkIcon;
  };

  const handleLinkFormSubmit = (e) => {
    e.preventDefault();
    
    if (!linkForm.title.trim() || !linkForm.url.trim()) {
      alert('Please fill in title and URL');
      return;
    }

    // Ensure URL has protocol
    let url = linkForm.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const linkData = {
      ...linkForm,
      url
    };

    if (editingLink) {
      updateCustomLink(editingLink.id, linkData);
      setEditingLink(null);
    } else {
      addCustomLink(linkData);
    }

    setLinkForm({ title: '', url: '', description: '', icon: 'ExternalLink' });
    setShowAddLinkForm(false);
  };

  const handleEditLink = (link) => {
    setLinkForm({
      title: link.title,
      url: link.url,
      description: link.description || '',
      icon: link.icon
    });
    setEditingLink(link);
    setShowAddLinkForm(true);
  };

  const handleDeleteLink = (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      deleteCustomLink(linkId);
    }
  };

  const handleCancelLinkForm = () => {
    setLinkForm({ title: '', url: '', description: '', icon: 'ExternalLink' });
    setEditingLink(null);
    setShowAddLinkForm(false);
  };

  const renderProfileTab = () => (
    <div className="profile-content">
      <div className="profile-section">
        <h3 className="section-title">
          <User size={20} />
          Profile Information
        </h3>
        
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            {profileData.profileImageUrl ? (
              <img 
                src={profileData.profileImageUrl} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                <Camera size={32} />
              </div>
            )}
            <button 
              className="upload-overlay"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileImageUpload}
            style={{ display: 'none' }}
          />
          <div className="profile-image-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              Upload Image
            </button>
            {profileData.profileImageUrl && (
              <button 
                className="btn btn-ghost"
                onClick={() => updateProfile({ profileImageUrl: '', profileImage: null })}
              >
                <X size={16} />
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={profileData.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            placeholder="e.g., John Doe"
          />
          <small className="form-help">Your display name that appears on your profile</small>
        </div>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            value={profileData.username}
            onChange={(e) => handleProfileChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="e.g., johndoe"
          />
          <small className="form-help">Your profile will be available at: {window.location.origin}/u/{profileData.username || 'username'}</small>
        </div>

        <div className="form-group">
          <label className="form-label">Profile Title</label>
          <input
            type="text"
            className="form-input"
            value={profileData.title}
            onChange={(e) => handleProfileChange('title', e.target.value)}
            placeholder="e.g., Content Creator & Photographer"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            className="form-textarea"
            value={profileData.bio}
            onChange={(e) => handleProfileChange('bio', e.target.value)}
            placeholder="Tell your audience about yourself..."
            rows={4}
          />
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">
          <Globe size={20} />
          Social Links
        </h3>
        
        <div className="social-links-grid">
          {Object.entries(profileData.socialLinks || {}).map(([platform, value]) => {
            const Icon = getSocialIcon(platform);
            return (
              <div key={platform} className="social-link-item">
                <div className="social-icon">
                  <Icon size={20} />
                </div>
                <div className="social-input-group">
                  <label className="social-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={value || ''}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    placeholder={platform === 'website' ? 'https://yourwebsite.com' : `@username`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderLinksTab = () => (
    <div className="links-content">
      <div className="profile-section">
        <div className="section-header">
          <h3 className="section-title">
            <LinkIcon size={20} />
            Custom Links
          </h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddLinkForm(true)}
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>
        
        {showAddLinkForm && (
          <div className="add-link-form">
            <form onSubmit={handleLinkFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={linkForm.title}
                    onChange={(e) => setLinkForm(prev => ({...prev, title: e.target.value}))}
                    placeholder="e.g., My YouTube Channel"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={linkForm.url}
                    onChange={(e) => setLinkForm(prev => ({...prev, url: e.target.value}))}
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={linkForm.description}
                  onChange={(e) => setLinkForm(prev => ({...prev, description: e.target.value}))}
                  placeholder="Brief description of the link"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon</label>
                <div className="icon-selection">
                  {availableIcons.map(icon => {
                    const IconComponent = icon.component;
                    return (
                      <button
                        key={icon.id}
                        type="button"
                        className={`icon-option ${linkForm.icon === icon.id ? 'selected' : ''}`}
                        onClick={() => setLinkForm(prev => ({...prev, icon: icon.id}))}
                        title={icon.name}
                      >
                        <IconComponent size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={handleCancelLinkForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLink ? 'Update Link' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="custom-links-list">
          {profileData.customLinks.length === 0 ? (
            <div className="empty-state">
              <LinkIcon size={48} />
              <h4>No custom links yet</h4>
              <p>Add your first custom link to get started</p>
            </div>
          ) : (
            profileData.customLinks.map((link, index) => {
              const IconComponent = getIconComponent(link.icon);
              return (
                <div key={link.id} className="custom-link-item">
                  <div className="link-icon">
                    <IconComponent size={20} />
                  </div>
                  <div className="link-info">
                    <h4 className="link-title">{link.title}</h4>
                    <p className="link-url">{link.url}</p>
                    {link.description && (
                      <p className="link-description">{link.description}</p>
                    )}
                    <div className="link-stats">
                      <span className="link-clicks">{link.clicks} clicks</span>
                      <span className={`link-status ${link.isActive ? 'active' : 'inactive'}`}>
                        {link.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="link-actions">
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={() => updateCustomLink(link.id, { isActive: !link.isActive })}
                    >
                      {link.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleEditLink(link)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost text-red"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="appearance-content">
      <div className="appearance-section">
        <h3 className="section-title">
          <Palette size={20} />
          Theme Selection
        </h3>
        
        <div className="themes-grid">
          {themes.map(theme => (
            <div 
              key={theme.id}
              className={`theme-card ${appearanceData.theme === theme.id ? 'selected' : ''}`}
              onClick={() => handleAppearanceChange('theme', theme.id)}
            >
              <div 
                className="theme-preview" 
                style={{ background: theme.preview }}
              />
              <span className="theme-name">{theme.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="appearance-section">
        <h3 className="section-title">
          <Palette size={20} />
          Brand Colors
        </h3>
        
        <div className="color-inputs">
          <div className="form-group">
            <label className="form-label">Brand Color</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                className="color-input"
                value={appearanceData.brandColor}
                onChange={(e) => handleAppearanceChange('brandColor', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                value={appearanceData.brandColor}
                onChange={(e) => handleAppearanceChange('brandColor', e.target.value)}
                placeholder="#667eea"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Background Color</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                className="color-input"
                value={appearanceData.backgroundColor}
                onChange={(e) => handleAppearanceChange('backgroundColor', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                value={appearanceData.backgroundColor}
                onChange={(e) => handleAppearanceChange('backgroundColor', e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="appearance-section">
        <h3 className="section-title">
          <Layout size={20} />
          Button Styles
        </h3>
        
        <div className="button-styles-grid">
          {buttonStyles.map(style => (
            <div 
              key={style.id}
              className={`button-style-card ${appearanceData.buttonStyle === style.id ? 'selected' : ''}`}
              onClick={() => handleAppearanceChange('buttonStyle', style.id)}
            >
              <div className="button-preview" style={{ cssText: style.preview }}>
                Button
              </div>
              <span className="style-name">{style.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="appearance-section">
        <h3 className="section-title">
          <Layout size={20} />
          Button Layout
        </h3>
        
        <div className="layout-options">
          {buttonLayouts.map(layout => (
            <button
              key={layout.id}
              className={`layout-option ${appearanceData.buttonLayout === layout.id ? 'selected' : ''}`}
              onClick={() => handleAppearanceChange('buttonLayout', layout.id)}
            >
              <span className="layout-icon">{layout.icon}</span>
              <span className="layout-name">{layout.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="appearance-section">
        <h3 className="section-title">
          <Type size={20} />
          Typography
        </h3>
        
        <div className="font-selection">
          {fonts.map(font => (
            <button
              key={font.id}
              className={`font-option ${appearanceData.font === font.id ? 'selected' : ''}`}
              onClick={() => handleAppearanceChange('font', font.id)}
              style={{ cssText: font.style }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      <div className="appearance-section">
        <h3 className="section-title">
          <Type size={20} />
          Custom CSS (Advanced)
        </h3>
        
        <div className="form-group">
          <textarea
            className="form-textarea code-textarea"
            value={appearanceData.customCSS}
            onChange={(e) => handleAppearanceChange('customCSS', e.target.value)}
            placeholder="/* Add your custom CSS here */
.profile-container {
  /* Custom styles */
}"
            rows={8}
          />
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="preview-container">
      <div className="preview-header">
        <h3>Live Preview</h3>
        <button 
          className="close-preview-btn"
          onClick={() => setPreviewMode(false)}
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="preview-content">
        <div 
          className="profile-preview"
          style={{
            background: appearanceData.theme === 'custom' 
              ? appearanceData.backgroundColor 
              : themes.find(t => t.id === appearanceData.theme)?.preview,
            fontFamily: fonts.find(f => f.id === appearanceData.font)?.style?.replace('font-family: ', '').replace(';', '')
          }}
        >
          {profileData.profileImageUrl && (
            <img 
              src={profileData.profileImageUrl} 
              alt="Profile Preview" 
              className="preview-profile-image"
            />
          )}
          
          {profileData.name && (
            <h1 className="preview-name" style={{ color: appearanceData.brandColor }}>
              {profileData.name}
            </h1>
          )}
          
          {profileData.title && (
            <h2 className="preview-title">
              {profileData.title}
            </h2>
          )}
          
          {profileData.bio && (
            <p className="preview-bio">{profileData.bio}</p>
          )}
          
          <div className="preview-social-links">
            {Object.entries(profileData.socialLinks)
              .filter(([_, value]) => value)
              .map(([platform, value]) => {
                const Icon = getSocialIcon(platform);
                return (
                  <a 
                    key={platform}
                    href={platform === 'website' ? value : `https://${platform}.com/${value}`}
                    className="preview-social-link"
                    style={{ color: appearanceData.brandColor }}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
          </div>
          
          <div className={`preview-buttons ${appearanceData.buttonLayout}`}>
            {profileData.customLinks && profileData.customLinks.filter(link => link.isActive).length > 0 ? (
              profileData.customLinks
                .filter(link => link.isActive)
                .slice(0, 3)
                .map(link => {
                  const IconComponent = getIconComponent(link.icon);
                  return (
                    <button 
                      key={link.id}
                      className="preview-button"
                      style={{
                        background: appearanceData.brandColor,
                        borderRadius: buttonStyles.find(s => s.id === appearanceData.buttonStyle)?.preview?.match(/border-radius: ([^;]+);/)?.[1] || '12px'
                      }}
                    >
                      <IconComponent size={16} style={{ marginRight: '8px' }} />
                      {link.title}
                    </button>
                  );
                })
            ) : (
              <>
                <button 
                  className="preview-button"
                  style={{
                    background: appearanceData.brandColor,
                    borderRadius: buttonStyles.find(s => s.id === appearanceData.buttonStyle)?.preview?.match(/border-radius: ([^;]+);/)?.[1] || '12px'
                  }}
                >
                  Sample Link
                </button>
                <button 
                  className="preview-button"
                  style={{
                    background: appearanceData.brandColor,
                    borderRadius: buttonStyles.find(s => s.id === appearanceData.buttonStyle)?.preview?.match(/border-radius: ([^;]+);/)?.[1] || '12px'
                  }}
                >
                  Another Link
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <button 
                className="back-btn"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1>Profile & Appearance</h1>
                <p>Customize your profile and brand appearance</p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-ghost"
                onClick={() => setPreviewMode(true)}
              >
                <Eye size={20} />
                Preview
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save size={20} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-nav">
        <div className="container">
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              Profile
            </button>
            <button 
              className={`nav-tab ${activeTab === 'links' ? 'active' : ''}`}
              onClick={() => setActiveTab('links')}
            >
              <LinkIcon size={20} />
              Links
            </button>
            <button 
              className={`nav-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette size={20} />
              Appearance
            </button>
          </nav>
        </div>
      </div>

      <div className="profile-content-wrapper">
        <div className="container">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'links' && renderLinksTab()}
          {activeTab === 'appearance' && renderAppearanceTab()}
        </div>
      </div>

      {previewMode && renderPreview()}

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: var(--light-gray);
        }

        .profile-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 24px 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .header-info p {
          color: #6b7280;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .profile-nav {
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .nav-tabs {
          display: flex;
          gap: 32px;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 0;
          background: none;
          border: none;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .nav-tab:hover {
          color: #374151;
        }

        .nav-tab.active {
          color: var(--electric-blue);
          border-bottom-color: var(--electric-blue);
        }

        .profile-content-wrapper {
          padding: 32px 0;
        }

        .profile-section,
        .appearance-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 24px;
        }

        .profile-image-section {
          text-align: center;
          margin-bottom: 32px;
        }

        .profile-image-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 16px;
        }

        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #e5e7eb;
        }

        .profile-image-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #f3f4f6;
          border: 4px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .upload-overlay {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          border: 2px solid white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .upload-overlay:hover {
          background: #5a67d8;
          transform: scale(1.1);
        }

        .profile-image-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s ease;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-help {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 4px;
        }

        .code-textarea {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
        }

        .social-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .social-link-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          background: #667eea;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .social-input-group {
          flex: 1;
        }

        .social-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .theme-card {
          text-align: center;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .theme-card.selected {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .theme-card:hover {
          border-color: #cbd5e1;
        }

        .theme-preview {
          width: 100%;
          height: 60px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .theme-name {
          font-weight: 500;
          color: #374151;
        }

        .color-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .color-input-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .color-input {
          width: 50px;
          height: 50px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .button-styles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
        }

        .button-style-card {
          text-align: center;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .button-style-card.selected {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .button-style-card:hover {
          border-color: #cbd5e1;
        }

        .button-preview {
          background: #667eea;
          color: white;
          padding: 8px 16px;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .style-name {
          font-weight: 500;
          color: #374151;
        }

        .layout-options {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .layout-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .layout-option.selected {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .layout-option:hover {
          border-color: #cbd5e1;
        }

        .layout-icon {
          font-size: 24px;
          color: #667eea;
        }

        .layout-name {
          font-weight: 500;
          color: #374151;
        }

        .font-selection {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .font-option {
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .font-option.selected {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .font-option:hover {
          border-color: #cbd5e1;
        }

        .preview-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          flex-direction: column;
        }

        .preview-content {
          background: white;
          border-radius: 0px 0px 12px 12px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .preview-header {
          width: 100%;
          background: var(--primary-gradient);
          border-radius: clamp(8px, 3vw, 16px) clamp(8px, 3vw, 16px) 0px 0px;
          display: flex;
          color: var(--text-inverse);
          padding: clamp(8px, 2vw, 16px) clamp(12px, 3vw, 20px);
          max-width: min(400px, 90vw);
          justify-content: space-between;
          align-items: center;
          box-shadow: 
            0 2px 8px var(--shadow-light),
            0 8px 32px rgba(0, 102, 255, 0.15);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: clamp(50px, 8vw, 64px);
        }

        .preview-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg, 
            var(--electric-blue) 0%, 
            var(--light-sky-blue) 50%,
            var(--soft-teal) 100%
          );
          opacity: 0.95;
          z-index: 1;
          transition: opacity 0.3s ease;
        }

        .preview-header::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          z-index: 2;
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .preview-header:hover::before {
          opacity: 1;
        }

        .preview-header:hover {
          transform: translateY(-1px);
          box-shadow: 
            0 4px 16px var(--shadow-medium),
            0 12px 48px rgba(0, 102, 255, 0.25);
        }

        .preview-header > * {
          position: relative;
          z-index: 3;
        }

        /* Responsive breakpoints */
        @media (max-width: 480px) {
          .preview-header {
            padding: 10px 14px;
            border-radius: 12px 12px 0px 0px;
          }
        }

        @media (max-width: 320px) {
          .preview-header {
            padding: 8px 12px;
            border-radius: 8px 8px 0px 0px;
            min-height: 48px;
          }
        }

        .preview-header h3 {
          font-size: clamp(1rem, 4vw, 1.25rem);
          font-weight: 600;
          color: var(--text-inverse);
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          line-height: 1.2;
          letter-spacing: 0.025em;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-header:hover h3 {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transform: translateY(-0.5px);
        }

        .close-preview-btn {
          width: clamp(36px, 8vw, 44px);
          height: clamp(36px, 8vw, 44px);
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          color: var(--text-inverse);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: clamp(16px, 4vw, 20px);
          flex-shrink: 0;
          margin-left: 12px;
        }

        .close-preview-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
          z-index: 1;
        }

        .close-preview-btn:hover {
          background: rgba(255, 107, 107, 0.9);
          color: var(--text-inverse);
          transform: scale(1.1) rotate(90deg);
          box-shadow: 
            0 8px 24px rgba(255, 107, 107, 0.4),
            0 0 0 4px rgba(255, 107, 107, 0.2);
          border-color: rgba(255, 107, 107, 0.6);
        }

        .close-preview-btn:hover::before {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
        }

        .close-preview-btn:active {
          transform: scale(0.95) rotate(180deg);
          background: rgba(255, 107, 107, 1);
          box-shadow: 
            0 4px 12px rgba(255, 107, 107, 0.6),
            inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .close-preview-btn:focus {
          outline: none;
          box-shadow: 
            0 0 0 3px rgba(255, 107, 107, 0.3),
            0 4px 12px rgba(255, 107, 107, 0.2);
          animation: focusPulse 2s infinite;
        }

        @keyframes focusPulse {
          0%, 100% { 
            box-shadow: 
              0 0 0 3px rgba(255, 107, 107, 0.3),
              0 4px 12px rgba(255, 107, 107, 0.2);
          }
          50% { 
            box-shadow: 
              0 0 0 6px rgba(255, 107, 107, 0.2),
              0 6px 16px rgba(255, 107, 107, 0.3);
          }
        }

        /* Additional responsive adjustments */
        @media (max-width: 480px) {
          .close-preview-btn {
            margin-left: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .preview-header::after {
            animation: none;
          }
          .close-preview-btn:focus {
            animation: none;
          }
          .preview-header,
          .close-preview-btn,
          .preview-header h3 {
            transition: none;
          }
        }


        .profile-preview {
          text-align: center;
          padding: 32px 24px;
          border-radius: 12px;
          min-height: 400px;
        }

        .preview-profile-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 16px;
        }

        .preview-name {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.2;
          text-align: center;
        }

        .preview-title {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 12px;
          color: #666;
          text-align: center;
        }

        .preview-bio {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 24px;
          opacity: 0.8;
        }

        .preview-social-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .preview-social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid currentColor;
        }

        .preview-social-link:hover {
          transform: translateY(-2px);
        }

        .preview-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .preview-buttons.grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .preview-buttons.carousel {
          flex-direction: row;
          overflow-x: auto;
        }

        .preview-button {
          padding: 12px 24px;
          color: white;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preview-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Links Tab Styles */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .add-link-form {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .icon-selection {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
          gap: 8px;
          max-width: 600px;
        }

        .icon-option {
          width: 50px;
          height: 50px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .icon-option:hover {
          border-color: #cbd5e1;
        }

        .icon-option.selected {
          border-color: #667eea;
          background: #f0f4ff;
          color: #667eea;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .custom-links-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #6b7280;
        }

        .empty-state h4 {
          margin: 16px 0 8px;
          color: #374151;
        }

        .custom-link-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .custom-link-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .link-icon {
          width: 48px;
          height: 48px;
          background: var(--electric-blue);
          color: var(--white);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .link-info {
          flex: 1;
          min-width: 0;
        }

        .link-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .link-url {
          font-size: 0.9rem;
          color: var(--electric-blue);
          margin-bottom: 4px;
          word-break: break-all;
        }

        .link-description {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .link-stats {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
        }

        .link-clicks {
          color: #374151;
        }

        .link-status {
          font-weight: 500;
        }

        .link-status.active {
          color: #059669;
        }

        .link-status.inactive {
          color: #dc2626;
        }

        .link-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 14px;
        }

        .text-red {
          color: #dc2626;
        }

        .text-red:hover {
          color: #b91c1c;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .nav-tabs {
            flex-wrap: wrap;
            gap: 16px;
          }

          .social-links-grid {
            grid-template-columns: 1fr;
          }

          .color-inputs {
            grid-template-columns: 1fr;
          }

          .themes-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .layout-options {
            justify-content: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .custom-link-item {
            flex-direction: column;
            text-align: center;
          }

          .link-actions {
            justify-content: center;
          }

          .icon-selection {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
