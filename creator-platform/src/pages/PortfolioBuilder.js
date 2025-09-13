import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
  Move
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import './PortfolioBuilder.css';

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const {
    portfolioData,
    updatePortfolioData,
    addPortfolioSection,
    updatePortfolioSection,
    deletePortfolioSection,
    addSubsection,
    updateSubsection,
    deleteSubsection,
    addBulletPoint,
    updateBulletPoint,
    deleteBulletPoint,
    addAdditionalContact,
    updateAdditionalContact,
    deleteAdditionalContact,
    saveProfile,
    isLoading
  } = useProfile();

  const [activeTab, setActiveTab] = useState('basic');
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Auto-expand all sections on load
    const expanded = {};
    portfolioData.sections.forEach(section => {
      expanded[section.id] = true;
    });
    setExpandedSections(expanded);
  }, [portfolioData.sections]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSave = async () => {
    try {
      await saveProfile();
      // Show success message or redirect
    } catch (error) {
      console.error('Error saving portfolio:', error);
    }
  };

  const handlePreview = () => {
    // Navigate to portfolio preview
    navigate(`/portfolio/preview/${portfolioData.portfolioUsername || 'preview'}`);
  };

  return (
    <div className="portfolio-builder min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Builder</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePreview}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Portfolio'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'basic' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Basic Information
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'contact' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Contact Information
                </button>
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'sections' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Portfolio Sections
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'settings' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={portfolioData.fullName || ''}
                          onChange={(e) => updatePortfolioData({ fullName: e.target.value })}
                          placeholder="e.g., Prasanna V"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <User className="absolute left-3 top-2-5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Username
                      </label>
                      <input
                        type="text"
                        value={portfolioData.portfolioUsername}
                        onChange={(e) => updatePortfolioData({ portfolioUsername: e.target.value })}
                        placeholder="e.g., prasannav"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        This will be your portfolio URL: /portfolio/{portfolioData.portfolioUsername || 'username'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume URL (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={portfolioData.resumeUrl}
                        onChange={(e) => updatePortfolioData({ resumeUrl: e.target.value })}
                        placeholder="https://example.com/resume.pdf"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Download className="absolute left-3 top-2-5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Theme
                    </label>
                    <select
                      value={portfolioData.theme}
                      onChange={(e) => updatePortfolioData({ theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="professional">Professional</option>
                      <option value="modern">Modern</option>
                      <option value="creative">Creative</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={portfolioData.isPublic}
                      onChange={(e) => updatePortfolioData({ isPublic: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                      Make portfolio public (visible to everyone)
                    </label>
                  </div>
                </div>
              )}

              {/* Contact Information Tab */}
              {activeTab === 'contact' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={portfolioData.contactInfo.phone}
                          onChange={(e) => updatePortfolioData({
                            contactInfo: { ...portfolioData.contactInfo, phone: e.target.value }
                          })}
                          placeholder="5304546666"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Phone className="absolute left-3 top-2-5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={portfolioData.contactInfo.email}
                          onChange={(e) => updatePortfolioData({
                            contactInfo: { ...portfolioData.contactInfo, email: e.target.value }
                          })}
                          placeholder="p@gmail.com"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Mail className="absolute left-3 top-2-5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Additional Contacts */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Additional Contacts</h3>
                      <button
                        onClick={addAdditionalContact}
                        className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Contact
                      </button>
                    </div>

                    <div className="space-y-3">
                      {portfolioData.contactInfo.additionalContacts.map((contact, index) => (
                        <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">Contact {index + 1}</h4>
                            <button
                              onClick={() => deleteAdditionalContact(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Contact Type
                              </label>
                              <select
                                value={contact.type}
                                onChange={(e) => updateAdditionalContact(index, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="website">Website</option>
                                <option value="social">Social</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            
                            {contact.type === 'other' ? (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Contact Type Name
                                  </label>
                                  <input
                                    type="text"
                                    value={contact.label}
                                    onChange={(e) => updateAdditionalContact(index, 'label', e.target.value)}
                                    placeholder="e.g., Skype, Discord"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Contact Value
                                  </label>
                                  <input
                                    type="text"
                                    value={contact.value}
                                    onChange={(e) => updateAdditionalContact(index, 'value', e.target.value)}
                                    placeholder="e.g., username123"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Label (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={contact.label}
                                    onChange={(e) => updateAdditionalContact(index, 'label', e.target.value)}
                                    placeholder={contact.type === 'social' ? 'e.g., LinkedIn' : 'Optional label'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    {contact.type === 'email' ? 'Email Address' : 
                                     contact.type === 'phone' ? 'Phone Number' :
                                     contact.type === 'website' ? 'Website URL' :
                                     contact.type === 'social' ? 'Profile URL' : 'Value'}
                                  </label>
                                  <input
                                    type={contact.type === 'email' ? 'email' : contact.type === 'phone' ? 'tel' : 'text'}
                                    value={contact.value}
                                    onChange={(e) => updateAdditionalContact(index, 'value', e.target.value)}
                                    placeholder={
                                      contact.type === 'email' ? 'example@email.com' :
                                      contact.type === 'phone' ? '+1234567890' :
                                      contact.type === 'website' ? 'https://yourwebsite.com' :
                                      contact.type === 'social' ? 'https://linkedin.com/in/username' :
                                      'Enter value'
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio Sections Tab */}
              {activeTab === 'sections' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Portfolio Sections</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Each section can have bullet points, subsections, or both
                      </p>
                    </div>
                    <button
                      onClick={addPortfolioSection}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </button>
                  </div>

                  <div className="space-y-6">
                    {portfolioData.sections.map((section, sectionIndex) => (
                      <PortfolioSection
                        key={section.id}
                        section={section}
                        sectionIndex={sectionIndex}
                        isExpanded={expandedSections[section.id]}
                        onToggle={() => toggleSection(section.id)}
                        onUpdateSection={updatePortfolioSection}
                        onDeleteSection={deletePortfolioSection}
                        onAddSubsection={addSubsection}
                        onUpdateSubsection={updateSubsection}
                        onDeleteSubsection={deleteSubsection}
                        onAddBulletPoint={addBulletPoint}
                        onUpdateBulletPoint={updateBulletPoint}
                        onDeleteBulletPoint={deleteBulletPoint}
                      />
                    ))}
                  </div>

                  {portfolioData.sections.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-500 mb-4">
                        <User className="h-12 w-12 mx-auto mb-2" />
                        <p>No sections added yet</p>
                        <p className="text-sm">Start by adding your first portfolio section</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Portfolio Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Enable Portfolio</h3>
                        <p className="text-sm text-gray-500">Turn on/off your portfolio feature</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={portfolioData.isPortfolioEnabled}
                        onChange={(e) => updatePortfolioData({ isPortfolioEnabled: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Public Portfolio</h3>
                        <p className="text-sm text-gray-500">Make your portfolio visible to everyone</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={portfolioData.isPublic}
                        onChange={(e) => updatePortfolioData({ isPublic: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  {portfolioData.isPortfolioEnabled && portfolioData.isPublic && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Portfolio URL</h4>
                      <div className="flex items-center space-x-2">
                        <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {window.location.origin}/portfolio/{portfolioData.portfolioUsername || 'username'}
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(
                            `${window.location.origin}/portfolio/${portfolioData.portfolioUsername || 'username'}`
                          )}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Portfolio Section Component
const PortfolioSection = ({
  section,
  sectionIndex,
  isExpanded,
  onToggle,
  onUpdateSection,
  onDeleteSection,
  onAddSubsection,
  onUpdateSubsection,
  onDeleteSubsection,
  onAddBulletPoint,
  onUpdateBulletPoint,
  onDeleteBulletPoint
}) => {
  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={section.sectionName}
              onChange={(e) => onUpdateSection(section.id, { sectionName: e.target.value })}
              placeholder="Section name (e.g., Experience, Skills, Education) - Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAddSubsection(section.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Add subsection"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={onToggle}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Move className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDeleteSection(section.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Section-level bullet points */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Section Bullet Points (Optional)
              </label>
              <button
                onClick={() => onAddBulletPoint(section.id, null)}
                className="flex items-center px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Point
              </button>
            </div>

            <div className="space-y-2">
              {section.bulletPoints?.map((point, bulletIndex) => (
                <div key={bulletIndex} className="flex items-center space-x-2">
                  <span className="text-gray-400">•</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => onUpdateBulletPoint(section.id, null, bulletIndex, e.target.value)}
                    placeholder="Enter bullet point..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => onDeleteBulletPoint(section.id, null, bulletIndex)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )) || []}
            </div>
          </div>

          {/* Subsections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Subsections (Optional)</h3>
              <button
                onClick={() => onAddSubsection(section.id)}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Subsection
              </button>
            </div>

            <div className="space-y-4">
              {section.subsections.map((subsection, subsectionIndex) => (
                <PortfolioSubsection
                  key={subsection.id}
                  section={section}
                  subsection={subsection}
                  subsectionIndex={subsectionIndex}
                  onUpdateSubsection={onUpdateSubsection}
                  onDeleteSubsection={onDeleteSubsection}
                  onAddBulletPoint={onAddBulletPoint}
                  onUpdateBulletPoint={onUpdateBulletPoint}
                  onDeleteBulletPoint={onDeleteBulletPoint}
                />
              ))}
              
              {section.subsections.length === 0 && (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <p>No subsections added yet</p>
                  <p className="text-sm mt-1">Add subsections for detailed organization</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Portfolio Subsection Component
const PortfolioSubsection = ({
  section,
  subsection,
  onUpdateSubsection,
  onDeleteSubsection,
  onAddBulletPoint,
  onUpdateBulletPoint,
  onDeleteBulletPoint
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subsection Title (Optional)
          </label>
          <input
            type="text"
            value={subsection.title || ''}
            onChange={(e) => onUpdateSubsection(section.id, subsection.id, { title: e.target.value })}
            placeholder="e.g., TCS, Software Engineer - Optional"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => onDeleteSubsection(section.id, subsection.id)}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={subsection.dateRange?.startDate || ''}
            onChange={(e) => onUpdateSubsection(section.id, subsection.id, {
              dateRange: { ...subsection.dateRange, startDate: e.target.value }
            })}
            placeholder="Start date (e.g., Jan 2020)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            value={subsection.dateRange?.endDate || ''}
            onChange={(e) => onUpdateSubsection(section.id, subsection.id, {
              dateRange: { ...subsection.dateRange, endDate: e.target.value }
            })}
            placeholder="End date (e.g., Present)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`current-${subsection.id}`}
              checked={subsection.dateRange?.isCurrent || false}
              onChange={(e) => onUpdateSubsection(section.id, subsection.id, {
                dateRange: { ...subsection.dateRange, isCurrent: e.target.checked }
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`current-${subsection.id}`} className="ml-2 text-sm text-gray-700">
              Current
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={subsection.description || ''}
          onChange={(e) => onUpdateSubsection(section.id, subsection.id, { description: e.target.value })}
          placeholder="Brief description of this role or experience..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Bullet Points (Optional)
          </label>
          <button
            onClick={() => onAddBulletPoint(section.id, subsection.id)}
            className="flex items-center px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Point
          </button>
        </div>

        <div className="space-y-2">
          {subsection.bulletPoints.map((point, bulletIndex) => (
            <div key={bulletIndex} className="flex items-center space-x-2">
              <span className="text-gray-400">•</span>
              <input
                type="text"
                value={point}
                onChange={(e) => onUpdateBulletPoint(section.id, subsection.id, bulletIndex, e.target.value)}
                placeholder="Enter bullet point..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => onDeleteBulletPoint(section.id, subsection.id, bulletIndex)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PortfolioBuilder;
