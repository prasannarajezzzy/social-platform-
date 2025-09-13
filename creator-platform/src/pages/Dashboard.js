import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Link2,
  ShoppingBag,
  Settings,
  Upload,
  TrendingUp,
  Calendar,
  Heart,
  Briefcase,
  User,
  FileText,
  Palette
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profileData, portfolioData, analyticsData, loadAnalytics } = useProfile();
  const [activeTab, setActiveTab] = useState('overview');

  // Get actual data from profile and analytics
  const customLinks = profileData.customLinks || [];
  const activeLinks = customLinks.filter(link => link.isActive);
  const totalClicks = customLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const averageClickRate = customLinks.length > 0 ? (totalClicks / customLinks.length).toFixed(1) : 0;
  
  // Use analytics data from backend if available, fallback to local calculations
  const stats = {
    totalClicks: analyticsData?.linkClicks?.total || totalClicks,
    profileViews: analyticsData?.profileViews?.total || 0,
    activeLinks: activeLinks.length,
    totalLinks: customLinks.length,
    clickRate: averageClickRate,
    conversionRate: analyticsData?.conversionRate || 0,
    viewsLast7Days: analyticsData?.profileViews?.last7Days || 0,
    clicksLast7Days: analyticsData?.linkClicks?.last7Days || 0
  };

  const products = [
    { id: 1, name: 'Photography Course', price: 99, sales: 47, revenue: 4653, image: '📸' },
    { id: 2, name: 'Lightroom Presets', price: 29, sales: 124, revenue: 3596, image: '🎨' },
    { id: 3, name: '1-on-1 Consultation', price: 150, sales: 12, revenue: 1800, image: '💬' }
  ];

  // Generate recent activity based on actual data
  const recentActivity = [];
  
  // Add recent link activity
  activeLinks.slice(0, 3).forEach((link, index) => {
    if (link.clicks > 0) {
      recentActivity.push({
        id: index + 1,
        action: 'Link clicked',
        item: link.title,
        time: `${Math.floor(Math.random() * 24)} hours ago`
      });
    }
  });
  
  // Add profile activity
  if (profileData.title) {
    recentActivity.push({
      id: recentActivity.length + 1,
      action: 'Profile updated',
      item: 'Profile information',
      time: 'Today'
    });
  }
  
  // If no activity, show placeholder
  if (recentActivity.length === 0) {
    recentActivity.push({
      id: 1,
      action: 'Welcome!',
      item: 'Start by adding your first custom link',
      time: 'Now'
    });
  }

  const handleAddLink = () => {
    // Redirect to profile settings links tab
    navigate('/profile?tab=links');
  };

  const renderOverview = () => (
    <div className="overview-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Eye size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.profileViews.toLocaleString()}</div>
            <div className="stat-label">Profile Views</div>
            <div className="stat-change positive">+{stats.viewsLast7Days} this week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalClicks.toLocaleString()}</div>
            <div className="stat-label">Total Clicks</div>
            <div className="stat-change positive">+{stats.clicksLast7Days} this week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Link2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.activeLinks}</div>
            <div className="stat-label">Active Links</div>
            <div className="stat-change neutral">of {stats.totalLinks} total</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{Object.values(profileData.socialLinks || {}).filter(link => link).length}</div>
            <div className="stat-label">Social Links</div>
            <div className="stat-change neutral">Connected</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.clickRate}</div>
            <div className="stat-label">Avg Clicks/Link</div>
            <div className="stat-change neutral">All time</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-item-name">{activity.item}</div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Top Performing Links</h3>
          </div>
          <div className="link-performance">
            {customLinks.length > 0 ? (
              customLinks
                .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                .slice(0, 3)
                .map(link => (
                  <div key={link.id} className="performance-item">
                    <div className="performance-info">
                      <div className="performance-title">{link.title}</div>
                      <div className="performance-url">{link.url}</div>
                    </div>
                    <div className="performance-clicks">{link.clicks || 0} clicks</div>
                  </div>
                ))
            ) : (
              <div className="performance-item">
                <div className="performance-info">
                  <div className="performance-title">No links yet</div>
                  <div className="performance-url">Add your first custom link to get started</div>
                </div>
                <div className="performance-clicks">0 clicks</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLinks = () => (
    <div className="links-content">
      <div className="section-header">
        <h2>Manage Links</h2>
        <button 
          className="btn btn-primary"
          onClick={handleAddLink}
        >
          <Plus size={20} />
          Add Link
        </button>
      </div>

      {customLinks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Link2 size={48} />
          </div>
          <h3>No custom links yet</h3>
          <p>Create your first custom link to start building your personal landing page</p>
          <button className="btn btn-primary" onClick={handleAddLink}>
            <Plus size={20} />
            Create Your First Link
          </button>
        </div>
      ) : (
        <div className="links-grid">
          {customLinks.map(link => (
            <div key={link.id} className="link-card">
              <div className="link-header">
                <div className="link-info">
                  <h4>{link.title}</h4>
                  <p>{link.url}</p>
                  {link.description && (
                    <small className="link-description">{link.description}</small>
                  )}
                </div>
                <div className="link-actions">
                  <button 
                    className="action-btn"
                    onClick={() => navigate('/profile?tab=links')}
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => window.open(link.url, '_blank')}
                    title="Visit link"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
              <div className="link-stats">
                <div className="stat">
                  <span className="stat-number">{link.clicks || 0}</span>
                  <span className="stat-label">Clicks</span>
                </div>
                <div className="link-status">
                  <span className={`status ${link.isActive ? 'active' : 'inactive'}`}>
                    {link.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="add-link-card">
            <button className="add-link-btn" onClick={handleAddLink}>
              <Plus size={32} />
              <span>Add New Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="products-content">
      <div className="section-header">
        <h2>Products & Services</h2>
        <button className="btn btn-primary">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <span className="product-emoji">{product.image}</span>
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <div className="product-price">${product.price}</div>
              <div className="product-stats">
                <div className="product-stat">
                  <span className="stat-number">{product.sales}</span>
                  <span className="stat-label">Sales</span>
                </div>
                <div className="product-stat">
                  <span className="stat-number">${product.revenue}</span>
                  <span className="stat-label">Revenue</span>
                </div>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn btn-ghost">Edit</button>
              <button className="btn btn-primary">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="portfolio-content">
      <div className="section-header">
        <h2>Portfolio</h2>
        <div className="portfolio-actions">
          {portfolioData.isPortfolioEnabled ? (
            <>
              <button 
                className="btn btn-ghost"
                onClick={() => navigate(`/portfolio/preview/${portfolioData.portfolioUsername || 'preview'}`)}
              >
                <Eye size={20} />
                Preview
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/portfolio/builder')}
              >
                <Edit3 size={20} />
                Edit Portfolio
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/portfolio/builder')}
            >
              <Plus size={20} />
              Create Portfolio
            </button>
          )}
        </div>
      </div>

      {portfolioData.isPortfolioEnabled ? (
        <div className="portfolio-overview">
          <div className="portfolio-grid">
            <div className="portfolio-card">
              <div className="portfolio-card-header">
                <div className="portfolio-icon">
                  <User size={24} />
                </div>
                <div className="portfolio-info">
                  <h3>Portfolio Status</h3>
                  <p className={`portfolio-status ${portfolioData.isPublic ? 'active' : 'draft'}`}>
                    {portfolioData.isPublic ? 'Public' : 'Draft'}
                  </p>
                </div>
              </div>
              {portfolioData.isPublic && (
                <div className="portfolio-url">
                  <label>Portfolio URL:</label>
                  <div className="url-display">
                    <code>{window.location.origin}/portfolio/{portfolioData.portfolioUsername}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/portfolio/${portfolioData.portfolioUsername}`)}
                      className="copy-btn"
                      title="Copy URL"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="portfolio-card">
              <div className="portfolio-card-header">
                <div className="portfolio-icon">
                  <FileText size={24} />
                </div>
                <div className="portfolio-info">
                  <h3>Portfolio Sections</h3>
                  <p>{portfolioData.sections.length} sections</p>
                </div>
              </div>
              <div className="section-list">
                {portfolioData.sections.slice(0, 3).map((section, index) => (
                  <div key={section.id} className="section-item">
                    <span>{section.sectionName}</span>
                    <span className="subsection-count">{section.subsections.length} items</span>
                  </div>
                ))}
                {portfolioData.sections.length > 3 && (
                  <div className="section-item">
                    <span>+{portfolioData.sections.length - 3} more sections</span>
                  </div>
                )}
              </div>
            </div>

            <div className="portfolio-card">
              <div className="portfolio-card-header">
                <div className="portfolio-icon">
                  <Eye size={24} />
                </div>
                <div className="portfolio-info">
                  <h3>Portfolio Views</h3>
                  <p>{portfolioData.portfolioViews || 0} total views</p>
                </div>
              </div>
              <div className="portfolio-stats">
                <div className="stat-item">
                  <span>Resume Downloads:</span>
                  <span>0</span>
                </div>
                <div className="stat-item">
                  <span>Last Updated:</span>
                  <span>{new Date(portfolioData.lastUpdated || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="portfolio-preview">
            <div className="preview-header">
              <h3>Portfolio Preview</h3>
              <button 
                className="btn btn-ghost"
                onClick={() => navigate(`/portfolio/preview/${portfolioData.portfolioUsername || 'preview'}`)}
              >
                View Full Portfolio
              </button>
            </div>
            <div className="preview-content">
              <div className="preview-profile">
                <div className="preview-avatar">
                  {profileData.profileImageUrl ? (
                    <img src={profileData.profileImageUrl} alt={profileData.name} />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div className="preview-info">
                  <h4>{profileData.name || 'Your Name'}</h4>
                  <p>{profileData.title || 'Your Title'}</p>
                  {portfolioData.contactInfo.email && (
                    <p className="preview-contact">{portfolioData.contactInfo.email}</p>
                  )}
                </div>
              </div>
              <div className="preview-sections">
                {portfolioData.sections.slice(0, 2).map(section => (
                  <div key={section.id} className="preview-section">
                    <h5>{section.sectionName}</h5>
                    <p>{section.subsections.length} {section.subsections.length === 1 ? 'item' : 'items'}</p>
                  </div>
                ))}
                {portfolioData.sections.length === 0 && (
                  <p className="preview-empty">No sections added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="portfolio-empty">
          <div className="empty-icon">
            <Briefcase size={64} />
          </div>
          <h3>Create Your Professional Portfolio</h3>
          <p>Build a stunning online portfolio to showcase your work, experience, and skills to potential employers and clients.</p>
          
          <div className="portfolio-features">
            <div className="feature-item">
              <div className="feature-icon">
                <User size={20} />
              </div>
              <div className="feature-content">
                <h4>Professional Profile</h4>
                <p>Add your contact information, resume, and professional details</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Briefcase size={20} />
              </div>
              <div className="feature-content">
                <h4>Dynamic Sections</h4>
                <p>Create custom sections for experience, education, skills, and projects</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Palette size={20} />
              </div>
              <div className="feature-content">
                <h4>Professional Themes</h4>
                <p>Choose from multiple professional themes to match your style</p>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate('/portfolio/builder')}
          >
            <Plus size={20} />
            Get Started
          </button>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-content">
      <div className="section-header">
        <h2>Analytics</h2>
        <div className="date-filter">
          <select className="form-input">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Traffic Overview</h3>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Chart visualization would go here</p>
          </div>
        </div>
        <div className="analytics-card">
          <h3>Top Referrers</h3>
          <div className="referrer-list">
            <div className="referrer-item">
              <span>Instagram</span>
              <span>42%</span>
            </div>
            <div className="referrer-item">
              <span>YouTube</span>
              <span>31%</span>
            </div>
            <div className="referrer-item">
              <span>Twitter</span>
              <span>18%</span>
            </div>
            <div className="referrer-item">
              <span>Direct</span>
              <span>9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1>Pivota Dashboard</h1>
              <p>Manage your content, links, and track your performance</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-ghost"
                onClick={() => navigate('/profile')}
              >
                <Settings size={20} />
                Settings
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const username = profileData.username || 'preview';
                  navigate(`/u/${username}`);
                }}
              >
                <ExternalLink size={20} />
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-nav">
        <div className="container">
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={20} />
              Overview
            </button>
            <button 
              className={`nav-tab ${activeTab === 'links' ? 'active' : ''}`}
              onClick={() => setActiveTab('links')}
            >
              <Link2 size={20} />
              Links
            </button>
            <button 
              className={`nav-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Briefcase size={20} />
              Portfolio
            </button>
            {/* <button 
              className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <ShoppingBag size={20} />
              Products
            </button>
            <button 
              className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={20} />
              Analytics
            </button> */}
          </nav>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'links' && renderLinks()}
          {activeTab === 'portfolio' && renderPortfolio()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: var(--light-gray);
        }

        .dashboard-header {
          background: var(--white);
          border-bottom: 1px solid var(--light-gray);
          padding: 24px 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--dark-charcoal);
          margin-bottom: 4px;
        }

        .header-info p {
          color: var(--dark-charcoal);
          opacity: 0.7;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .dashboard-nav {
          background: var(--white);
          border-bottom: 1px solid var(--light-gray);
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
          color: var(--dark-charcoal);
          opacity: 0.7;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .nav-tab:hover {
          color: var(--dark-charcoal);
          opacity: 1;
        }

        .nav-tab.active {
          color: var(--electric-blue);
          opacity: 1;
          border-bottom-color: var(--electric-blue);
        }

        .dashboard-content {
          padding: 32px 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--dark-charcoal);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--white);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--light-gray);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: var(--primary-gradient);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
        }

        .stat-number {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--dark-charcoal);
          margin-bottom: 4px;
        }

        .stat-label {
          color: var(--dark-charcoal);
          opacity: 0.7;
          font-size: 0.875rem;
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .stat-change.positive {
          color: var(--soft-teal);
        }

        .stat-change.negative {
          color: var(--vibrant-coral);
        }

        .stat-change.neutral {
          color: var(--dark-charcoal);
          opacity: 0.7;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .dashboard-card {
          background: var(--white);
          border-radius: 12px;
          border: 1px solid var(--light-gray);
          overflow: hidden;
        }

        .card-header {
          padding: 24px 24px 0 24px;
        }

        .card-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--dark-charcoal);
        }

        .activity-list {
          padding: 16px 24px 24px 24px;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-action {
          font-weight: 500;
          color: #374151;
        }

        .activity-item-name {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .activity-time {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .link-performance {
          padding: 16px 24px 24px 24px;
        }

        .performance-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .performance-item:last-child {
          border-bottom: none;
        }

        .performance-title {
          font-weight: 500;
          color: #374151;
        }

        .performance-url {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .performance-clicks {
          color: var(--electric-blue);
          font-weight: 600;
        }

        .add-link-form {
          background: var(--white);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--light-gray);
          margin-bottom: 24px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .link-card {
          background: var(--white);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--light-gray);
        }

        .link-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .link-info h4 {
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 4px;
        }

        .link-info p {
          color: var(--dark-charcoal);
          opacity: 0.7;
          font-size: 0.875rem;
        }

        .link-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: var(--light-gray);
          color: var(--dark-charcoal);
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: var(--soft-teal);
          color: var(--white);
          opacity: 1;
        }

        .action-btn.delete:hover {
          background: var(--vibrant-coral);
          color: var(--white);
        }

        .link-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat {
          text-align: center;
        }

        .stat .stat-number {
          font-size: 1.25rem;
        }

        .stat .stat-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .link-status .status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status.active {
          background: rgba(78, 205, 196, 0.2);
          color: var(--soft-teal);
        }

        .status.inactive {
          background: rgba(255, 107, 107, 0.2);
          color: var(--vibrant-coral);
        }

        .empty-state {
          text-align: center;
          padding: 64px 32px;
          background: var(--white);
          border-radius: 12px;
          border: 2px dashed var(--light-gray);
        }

        .empty-icon {
          color: #9ca3af;
          margin-bottom: 24px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 12px;
        }

        .empty-state p {
          color: var(--dark-charcoal);
          opacity: 0.7;
          margin-bottom: 24px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .add-link-card {
          background: var(--white);
          border: 2px dashed var(--light-gray);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .add-link-card:hover {
          border-color: var(--electric-blue);
          background: var(--light-gray);
        }

        .add-link-btn {
          width: 100%;
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-link-btn:hover {
          color: var(--electric-blue);
        }

        .add-link-btn span {
          font-weight: 500;
        }

        .link-description {
          color: #9ca3af;
          font-size: 0.8rem;
          margin-top: 4px;
          display: block;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .product-card {
          background: var(--white);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--light-gray);
          text-align: center;
        }

        .product-image {
          margin-bottom: 16px;
        }

        .product-emoji {
          font-size: 3rem;
        }

        .product-info h4 {
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 8px;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--electric-blue);
          margin-bottom: 16px;
        }

        .product-stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }

        .product-stat {
          text-align: center;
        }

        .product-stat .stat-number {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .product-stat .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .product-actions {
          display: flex;
          gap: 12px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .analytics-card {
          background: var(--white);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--light-gray);
        }

        .analytics-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 20px;
        }

        .chart-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: #9ca3af;
          text-align: center;
        }

        .referrer-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .referrer-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .referrer-item:last-child {
          border-bottom: none;
        }

        .date-filter select {
          width: 150px;
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

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .portfolio-grid {
            grid-template-columns: 1fr;
          }

          .portfolio-features {
            grid-template-columns: 1fr;
          }
        }

        /* Portfolio Styles */
        .portfolio-content {
          max-width: 1200px;
        }

        .portfolio-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .portfolio-overview {
          space-y: 32px;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .portfolio-card {
          background: var(--white);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--light-gray);
          transition: all 0.3s ease;
        }

        .portfolio-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--electric-blue);
        }

        .portfolio-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .portfolio-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--electric-blue), var(--purple));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .portfolio-info h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 4px;
        }

        .portfolio-info p {
          color: var(--dark-charcoal);
          opacity: 0.7;
          font-size: 0.9rem;
        }

        .portfolio-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .portfolio-status.active {
          background: #ecfdf5;
          color: #10b981;
        }

        .portfolio-status.draft {
          background: #fef3c7;
          color: #f59e0b;
        }

        .portfolio-url {
          margin-top: 16px;
        }

        .portfolio-url label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--dark-charcoal);
          margin-bottom: 8px;
        }

        .url-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid var(--light-gray);
        }

        .url-display code {
          flex: 1;
          font-size: 0.85rem;
          color: var(--electric-blue);
          font-family: 'Monaco', 'Consolas', monospace;
        }

        .copy-btn {
          background: none;
          border: none;
          color: var(--dark-charcoal);
          opacity: 0.6;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .copy-btn:hover {
          opacity: 1;
          background: var(--light-gray);
        }

        .section-list {
          space-y: 8px;
        }

        .section-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 0.9rem;
        }

        .subsection-count {
          color: var(--dark-charcoal);
          opacity: 0.6;
          font-size: 0.8rem;
        }

        .portfolio-stats {
          space-y: 8px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 0.9rem;
        }

        .stat-item span:first-child {
          color: var(--dark-charcoal);
          opacity: 0.7;
        }

        .stat-item span:last-child {
          font-weight: 500;
          color: var(--dark-charcoal);
        }

        .portfolio-preview {
          background: var(--white);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--light-gray);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .preview-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--dark-charcoal);
        }

        .preview-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .preview-profile {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .preview-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--light-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .preview-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-info h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 4px;
        }

        .preview-info p {
          color: var(--dark-charcoal);
          opacity: 0.7;
          font-size: 0.9rem;
          margin-bottom: 2px;
        }

        .preview-contact {
          font-size: 0.8rem !important;
          color: var(--electric-blue) !important;
          opacity: 1 !important;
        }

        .preview-sections {
          space-y: 12px;
        }

        .preview-section {
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 3px solid var(--electric-blue);
        }

        .preview-section h5 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 4px;
        }

        .preview-section p {
          font-size: 0.8rem;
          color: var(--dark-charcoal);
          opacity: 0.6;
        }

        .preview-empty {
          color: var(--dark-charcoal);
          opacity: 0.5;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }

        .portfolio-empty {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          padding: 64px 32px;
        }

        .portfolio-empty .empty-icon {
          color: #9ca3af;
          margin-bottom: 32px;
        }

        .portfolio-empty h3 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--dark-charcoal);
          margin-bottom: 16px;
        }

        .portfolio-empty > p {
          font-size: 1.1rem;
          color: var(--dark-charcoal);
          opacity: 0.7;
          margin-bottom: 48px;
          line-height: 1.6;
        }

        .portfolio-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
          text-align: left;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid var(--light-gray);
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--electric-blue), var(--purple));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .feature-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 8px;
        }

        .feature-content p {
          font-size: 0.9rem;
          color: var(--dark-charcoal);
          opacity: 0.7;
          line-height: 1.5;
        }

        .btn-large {
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
