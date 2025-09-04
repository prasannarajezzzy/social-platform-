import React, { useState } from 'react';
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
  Heart
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '' });

  // Mock data
  const stats = {
    totalViews: 12543,
    followers: 8921,
    revenue: 2847,
    clickRate: 4.7
  };

  const links = [
    { id: 1, title: 'My YouTube Channel', url: 'https://youtube.com/@creator', clicks: 1234, isActive: true },
    { id: 2, title: 'Instagram Profile', url: 'https://instagram.com/creator', clicks: 892, isActive: true },
    { id: 3, title: 'Latest Blog Post', url: 'https://blog.creator.com/latest', clicks: 567, isActive: true },
    { id: 4, title: 'Patreon Support', url: 'https://patreon.com/creator', clicks: 345, isActive: false }
  ];

  const products = [
    { id: 1, name: 'Photography Course', price: 99, sales: 47, revenue: 4653, image: '📸' },
    { id: 2, name: 'Lightroom Presets', price: 29, sales: 124, revenue: 3596, image: '🎨' },
    { id: 3, name: '1-on-1 Consultation', price: 150, sales: 12, revenue: 1800, image: '💬' }
  ];

  const recentActivity = [
    { id: 1, action: 'Link clicked', item: 'YouTube Channel', time: '2 minutes ago' },
    { id: 2, action: 'Product purchased', item: 'Photography Course', time: '1 hour ago' },
    { id: 3, action: 'New follower', item: 'Instagram', time: '3 hours ago' },
    { id: 4, action: 'Link shared', item: 'Blog Post', time: '5 hours ago' }
  ];

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      // In a real app, you would make an API call here
      console.log('Adding new link:', newLink);
      setNewLink({ title: '', url: '', description: '' });
      setIsAddingLink(false);
    }
  };

  const renderOverview = () => (
    <div className="overview-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Eye size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalViews.toLocaleString()}</div>
            <div className="stat-label">Total Views</div>
            <div className="stat-change positive">+12% this week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.followers.toLocaleString()}</div>
            <div className="stat-label">Followers</div>
            <div className="stat-change positive">+8% this week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">${stats.revenue.toLocaleString()}</div>
            <div className="stat-label">Revenue</div>
            <div className="stat-change positive">+23% this week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.clickRate}%</div>
            <div className="stat-label">Click Rate</div>
            <div className="stat-change negative">-2% this week</div>
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
            {links.slice(0, 3).map(link => (
              <div key={link.id} className="performance-item">
                <div className="performance-info">
                  <div className="performance-title">{link.title}</div>
                  <div className="performance-url">{link.url}</div>
                </div>
                <div className="performance-clicks">{link.clicks} clicks</div>
              </div>
            ))}
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
          onClick={() => setIsAddingLink(true)}
        >
          <Plus size={20} />
          Add Link
        </button>
      </div>

      {isAddingLink && (
        <div className="add-link-form">
          <div className="form-group">
            <label className="form-label">Link Title</label>
            <input
              type="text"
              className="form-input"
              value={newLink.title}
              onChange={(e) => setNewLink({...newLink, title: e.target.value})}
              placeholder="e.g., My YouTube Channel"
            />
          </div>
          <div className="form-group">
            <label className="form-label">URL</label>
            <input
              type="url"
              className="form-input"
              value={newLink.url}
              onChange={(e) => setNewLink({...newLink, url: e.target.value})}
              placeholder="https://example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={newLink.description}
              onChange={(e) => setNewLink({...newLink, description: e.target.value})}
              placeholder="Brief description of the link"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleAddLink}>
              Add Link
            </button>
            <button 
              className="btn btn-ghost" 
              onClick={() => setIsAddingLink(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="links-grid">
        {links.map(link => (
          <div key={link.id} className="link-card">
            <div className="link-header">
              <div className="link-info">
                <h4>{link.title}</h4>
                <p>{link.url}</p>
              </div>
              <div className="link-actions">
                <button className="action-btn">
                  <Edit3 size={16} />
                </button>
                <button className="action-btn">
                  <ExternalLink size={16} />
                </button>
                <button className="action-btn delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="link-stats">
              <div className="stat">
                <span className="stat-number">{link.clicks}</span>
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
      </div>
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
              <h1>Creator Dashboard</h1>
              <p>Manage your content, links, and track your performance</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-ghost">
                <Settings size={20} />
                Settings
              </button>
              <button className="btn btn-primary">
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
            </button>
          </nav>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'links' && renderLinks()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #f8fafc;
        }

        .dashboard-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
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

        .dashboard-nav {
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
          color: #667eea;
          border-bottom-color: #667eea;
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
          color: #1f2937;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-number {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .stat-change.negative {
          color: #ef4444;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .dashboard-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .card-header {
          padding: 24px 24px 0 24px;
        }

        .card-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
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
          color: #667eea;
          font-weight: 600;
        }

        .add-link-form {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
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
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
        }

        .link-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .link-info h4 {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .link-info p {
          color: #6b7280;
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
          background: #f3f4f6;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .action-btn.delete:hover {
          background: #fef2f2;
          color: #dc2626;
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
          background: #d1fae5;
          color: #047857;
        }

        .status.inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
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
          color: #1f2937;
          margin-bottom: 8px;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
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
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
        }

        .analytics-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
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
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
