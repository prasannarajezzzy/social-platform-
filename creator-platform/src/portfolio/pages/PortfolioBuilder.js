import React, { useState, useEffect, useRef } from 'react';
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
  Move,
  Palette,
  Layout,
  Type,
  Star,
  FileText
} from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import { useNavigate, useLocation } from 'react-router-dom';
import authAPI from '../../services/authAPI';
import '../styles/PortfolioBuilder.css';

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    portfolioData,
    portfolioProfiles,
    currentProfileId,
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
    createPortfolioProfile,
    saveProfile,
    refreshPortfolioProfiles,
    isLoading
  } = useProfile();

  // Check if we're creating a new portfolio (coming from Dashboard "Add Portfolio")
  const isCreatingNew = location.state?.isNew || (!currentProfileId && portfolioProfiles.length === 0);

  const [activeTab, setActiveTab] = useState('basic');

  // Refresh portfolio profiles on mount to ensure we have latest data
  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      refreshPortfolioProfiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load profiles once on mount
  }, []);
  const [expandedSections, setExpandedSections] = useState({});
  const hasResetData = useRef(false);

  useEffect(() => {
    // Auto-expand all sections on load
    const expanded = {};
    portfolioData.sections.forEach(section => {
      expanded[section.id] = true;
    });
    setExpandedSections(expanded);
  }, [portfolioData.sections]);

  useEffect(() => {
    // If creating a new portfolio, reset the portfolio data to defaults (only once)
    if (isCreatingNew && !hasResetData.current) {
      hasResetData.current = true;
      updatePortfolioData({
        profileName: '',
        description: '',
        fullName: '',
        portfolioUsername: '',
        resumeUrl: '',
        theme: 'professional',
        isPublic: false,
        sections: [
          {
            id: 'about',
            title: 'About Me',
            isVisible: true,
            subsections: []
          },
          {
            id: 'experience',
            title: 'Experience',
            isVisible: true,
            subsections: []
          },
          {
            id: 'education',
            title: 'Education',
            isVisible: true,
            subsections: []
          },
          {
            id: 'skills',
            title: 'Skills',
            isVisible: true,
            subsections: []
          }
        ],
        contactInfo: {
          phone: '',
          email: '',
          location: '',
          website: '',
          additionalContacts: []
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset defaults when starting new portfolio
  }, [isCreatingNew]);


  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSaveAndContinue = async () => {
    try {
      // If we're creating a new portfolio and have a profile name, create it
      if (isCreatingNew && portfolioData.profileName?.trim()) {
        await createPortfolioProfile(portfolioData.profileName, portfolioData.description || '', portfolioData);
        alert('New portfolio created successfully! You can continue editing.');
        // Don't navigate away, let user continue editing
      } else if (currentProfileId) {
        // If we have a current profile ID, update the existing portfolio
        try {
          await saveProfile();
          alert('Portfolio saved successfully!');
        } catch (error) {
          if (error.message.includes('Profile not found')) {
            // Refresh profiles and try to create a new one
            await refreshPortfolioProfiles();
            if (portfolioData.profileName?.trim()) {
              await createPortfolioProfile(portfolioData.profileName, portfolioData.description || '', portfolioData);
              alert('Portfolio created successfully! You can continue editing.');
            } else {
              alert('Profile not found. Please enter a portfolio name to create a new portfolio.');
            }
          } else {
            throw error;
          }
        }
      } else {
        // If no profile name and no current profile, show error
        alert('Please enter a portfolio name to create a new portfolio.');
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Failed to save portfolio. Please try again.');
    }
  };

  const handlePreview = () => {
    // Navigate to portfolio preview
    navigate(`/portfolio/preview/${portfolioData.portfolioUsername || 'preview'}`);
  };

  const getProgressPercentage = () => {
    let completedFields = 0;
    let totalFields = 0;

    // Basic Information
    totalFields += 4;
    if (portfolioData.profileName) completedFields++;
    if (portfolioData.fullName) completedFields++;
    if (portfolioData.portfolioUsername) completedFields++;
    if (portfolioData.resumeUrl) completedFields++;

    // Contact Information
    totalFields += 2;
    if (portfolioData.contactInfo?.phone) completedFields++;
    if (portfolioData.contactInfo?.email) completedFields++;

    // Portfolio Sections
    totalFields += portfolioData.sections?.length || 0;
    completedFields += portfolioData.sections?.filter(section => 
      section.sectionName && section.sectionName.trim() !== ''
    ).length || 0;

    // Settings
    totalFields += 1;
    if (portfolioData.isPublic !== undefined) completedFields++;

    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
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
                onClick={handleSaveAndContinue}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : (isCreatingNew ? 'Create Portfolio' : 'Save Portfolio')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Builder</h3>
                <p className="text-sm text-gray-500">Customize your portfolio</p>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center group ${
                    activeTab === 'basic' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    activeTab === 'basic' 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <User className={`h-4 w-4 ${
                      activeTab === 'basic' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">Basic Information</div>
                    <div className={`text-xs ${
                      activeTab === 'basic' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      Name, title, username
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center group ${
                    activeTab === 'contact' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    activeTab === 'contact' 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Phone className={`h-4 w-4 ${
                      activeTab === 'contact' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">Contact Information</div>
                    <div className={`text-xs ${
                      activeTab === 'contact' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      Phone, email, links
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('sections')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center group ${
                    activeTab === 'sections' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    activeTab === 'sections' 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <FileText className={`h-4 w-4 ${
                      activeTab === 'sections' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">Portfolio Sections</div>
                    <div className={`text-xs ${
                      activeTab === 'sections' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      Experience, skills, etc.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center group ${
                    activeTab === 'appearance' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    activeTab === 'appearance' 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Palette className={`h-4 w-4 ${
                      activeTab === 'appearance' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">Appearance</div>
                    <div className={`text-xs ${
                      activeTab === 'appearance' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      Colors, fonts, layout
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center group ${
                    activeTab === 'settings' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    activeTab === 'settings' 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Star className={`h-4 w-4 ${
                      activeTab === 'settings' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">Settings</div>
                    <div className={`text-xs ${
                      activeTab === 'settings' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      Privacy, visibility
                    </div>
                  </div>
                </button>
              </nav>

              {/* Progress Indicator */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.round(getProgressPercentage())}%
                  </div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Keep going! You're making great progress
                </div>
              </div>
            </div>
          </div>


          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Content Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {activeTab === 'basic' && 'Basic Information'}
                      {activeTab === 'contact' && 'Contact Information'}
                      {activeTab === 'sections' && 'Portfolio Sections'}
                      {activeTab === 'appearance' && 'Appearance Settings'}
                      {activeTab === 'settings' && 'Portfolio Settings'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {activeTab === 'basic' && 'Set up your basic portfolio information'}
                      {activeTab === 'contact' && 'Add your contact details and social links'}
                      {activeTab === 'sections' && 'Organize your experience, skills, and achievements'}
                      {activeTab === 'appearance' && 'Customize colors, fonts, and layout'}
                      {activeTab === 'settings' && 'Configure privacy and visibility settings'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Step {['basic', 'contact', 'sections', 'appearance', 'settings'].indexOf(activeTab) + 1} of 5
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.round(getProgressPercentage())}% Complete
                      </div>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="p-6 space-y-6">
                  

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Profile Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={portfolioData.profileName || ''}
                          onChange={(e) => updatePortfolioData({ profileName: e.target.value })}
                          placeholder="e.g., Professional Portfolio, Creative Portfolio"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <User className="absolute left-3 top-2-5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Description
                      </label>
                      <div className="relative">
                        <textarea
                          value={portfolioData.description || ''}
                          onChange={(e) => updatePortfolioData({ description: e.target.value })}
                          placeholder="Brief description of this portfolio (optional)"
                          rows={3}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                        <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

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

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="portfolio-appearance-content">
                  {/* Portfolio Modes Section */}
                  <div className="appearance-section">
                    <h3 className="section-title">
                      <Palette size={20} />
                      Portfolio Modes
                    </h3>
                    <p className="section-description">
                      Choose from 5 distinct professional portfolio modes. Each mode has unique styling and layout optimized for different industries.
                    </p>
                    
                    <div className="portfolio-modes-grid">
                      {[
                        { 
                          id: 'professional', 
                          name: 'Professional', 
                          description: 'Clean, corporate design perfect for business professionals',
                          preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
                          pattern: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
                          icon: '💼',
                          features: ['Corporate Colors', 'Clean Layout', 'Professional Typography']
                        },
                        { 
                          id: 'creative', 
                          name: 'Creative', 
                          description: 'Bold, artistic design for designers and creative professionals',
                          preview: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
                          background: 'linear-gradient(45deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #ff9ff3 75%, #54a0ff 100%)',
                          pattern: 'conic-gradient(from 0deg at 50% 50%, rgba(255, 107, 107, 0.1) 0deg, rgba(254, 202, 87, 0.1) 72deg, rgba(72, 219, 251, 0.1) 144deg, rgba(255, 159, 243, 0.1) 216deg, rgba(84, 160, 255, 0.1) 288deg, rgba(255, 107, 107, 0.1) 360deg)',
                          icon: '🎨',
                          features: ['Vibrant Colors', 'Creative Layout', 'Artistic Typography']
                        },
                        { 
                          id: 'tech', 
                          name: 'Tech', 
                          description: 'Modern, tech-focused design for developers and engineers',
                          preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
                          pattern: 'repeating-linear-gradient(45deg, rgba(0, 255, 127, 0.1) 0px, rgba(0, 255, 127, 0.1) 2px, transparent 2px, transparent 20px), repeating-linear-gradient(-45deg, rgba(0, 255, 127, 0.05) 0px, rgba(0, 255, 127, 0.05) 2px, transparent 2px, transparent 20px)',
                          icon: '💻',
                          features: ['Tech Colors', 'Modern Layout', 'Code-friendly Typography']
                        },
                        { 
                          id: 'minimal', 
                          name: 'Minimal', 
                          description: 'Simple, elegant design focusing on content clarity',
                          preview: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
                          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
                          pattern: 'radial-gradient(circle at 25% 25%, rgba(148, 163, 184, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(148, 163, 184, 0.05) 0%, transparent 50%)',
                          icon: '⚪',
                          features: ['Neutral Colors', 'Minimal Layout', 'Clean Typography']
                        },
                        { 
                          id: 'executive', 
                          name: 'Executive', 
                          description: 'Sophisticated design for senior executives and leaders',
                          preview: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)',
                          pattern: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1) 0%, transparent 25%, rgba(255, 215, 0, 0.05) 50%, transparent 75%, rgba(255, 215, 0, 0.1) 100%), radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
                          icon: '👔',
                          features: ['Executive Colors', 'Sophisticated Layout', 'Premium Typography']
                        }
                      ].map((mode) => (
                        <div 
                          key={mode.id}
                          className={`portfolio-mode-card ${portfolioData.appearance?.portfolioMode === mode.id ? 'selected' : ''}`}
                          onClick={() => updatePortfolioData({
                            appearance: { 
                              ...portfolioData.appearance, 
                              portfolioMode: mode.id,
                              // Apply mode-specific defaults
                              colorScheme: mode.id === 'professional' ? 'blue' : 
                                         mode.id === 'creative' ? 'orange' :
                                         mode.id === 'tech' ? 'green' :
                                         mode.id === 'minimal' ? 'gray' : 'indigo',
                              layout: mode.id === 'professional' ? 'modern' :
                                     mode.id === 'creative' ? 'creative' :
                                     mode.id === 'tech' ? 'modern' :
                                     mode.id === 'minimal' ? 'minimal' : 'classic',
                              fontFamily: mode.id === 'professional' ? 'inter' :
                                        mode.id === 'creative' ? 'montserrat' :
                                        mode.id === 'tech' ? 'roboto' :
                                        mode.id === 'minimal' ? 'opensans' : 'playfair',
                              // Apply unique backgrounds and patterns
                              backgroundType: 'gradient',
                              backgroundColor: mode.background,
                              backgroundPattern: mode.pattern,
                              textColor: mode.id === 'tech' ? '#ffffff' : 
                                       mode.id === 'executive' ? '#ffffff' : '#1f2937'
                            }
                          })}
                        >
                          <div className="mode-preview" style={{ background: mode.preview }}>
                            <span className="mode-icon">{mode.icon}</span>
                          </div>
                          <div className="mode-content">
                            <h4 className="mode-name">{mode.name}</h4>
                            <p className="mode-description">{mode.description}</p>
                            <div className="mode-features">
                              {mode.features.map((feature, index) => (
                                <span key={index} className="mode-feature">{feature}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="appearance-section">
                    <h3 className="section-title">
                      <Palette size={20} />
                      Color Palette
                    </h3>
                    <p className="section-description">
                      Customize your portfolio's color scheme. Changes here override theme defaults.
                    </p>
                    
                    <div className="color-palette-grid">
                      {[
                        { name: 'Blue', value: 'blue', primary: '#3b82f6', secondary: '#1e40af', accent: '#dbeafe' },
                        { name: 'Green', value: 'green', primary: '#10b981', secondary: '#047857', accent: '#d1fae5' },
                        { name: 'Purple', value: 'purple', primary: '#8b5cf6', secondary: '#6d28d9', accent: '#ede9fe' },
                        { name: 'Red', value: 'red', primary: '#ef4444', secondary: '#dc2626', accent: '#fee2e2' },
                        { name: 'Orange', value: 'orange', primary: '#f97316', secondary: '#ea580c', accent: '#fed7aa' },
                        { name: 'Gray', value: 'gray', primary: '#6b7280', secondary: '#374151', accent: '#f3f4f6' },
                        { name: 'Indigo', value: 'indigo', primary: '#6366f1', secondary: '#4f46e5', accent: '#e0e7ff' },
                        { name: 'Pink', value: 'pink', primary: '#ec4899', secondary: '#db2777', accent: '#fce7f3' }
                      ].map((color) => (
                        <div 
                          key={color.value}
                          className={`color-palette-card ${portfolioData.appearance?.colorScheme === color.value ? 'selected' : ''}`}
                          onClick={() => updatePortfolioData({
                            appearance: { ...portfolioData.appearance, colorScheme: color.value }
                          })}
                        >
                          <div className="color-swatches">
                            <div 
                              className="color-swatch primary"
                              style={{ backgroundColor: color.primary }}
                            ></div>
                            <div 
                              className="color-swatch secondary"
                              style={{ backgroundColor: color.secondary }}
                            ></div>
                            <div 
                              className="color-swatch accent"
                              style={{ backgroundColor: color.accent }}
                            ></div>
                          </div>
                          <span className="color-name">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Layout Styles */}
                  <div className="appearance-section">
                    <h3 className="section-title">
                      <Layout size={20} />
                      Layout Styles
                    </h3>
                    <p className="section-description">
                      Choose how your portfolio content is organized and displayed.
                    </p>
                    
                    <div className="layout-styles-grid">
                      {[
                        { 
                          id: 'modern', 
                          name: 'Modern', 
                          description: 'Wide, contemporary layout with generous spacing',
                          preview: 'grid-template-columns: 1fr 2fr; gap: 2rem;',
                          icon: '⊞'
                        },
                        { 
                          id: 'classic', 
                          name: 'Classic', 
                          description: 'Traditional, focused layout with centered content',
                          preview: 'max-width: 800px; margin: 0 auto;',
                          icon: '📄'
                        },
                        { 
                          id: 'minimal', 
                          name: 'Minimal', 
                          description: 'Clean, distraction-free design',
                          preview: 'padding: 1rem; max-width: 600px;',
                          icon: '⚪'
                        },
                        { 
                          id: 'creative', 
                          name: 'Creative', 
                          description: 'Spacious, artistic design with visual elements',
                          preview: 'display: flex; flex-wrap: wrap; gap: 1.5rem;',
                          icon: '🎨'
                        }
                      ].map((layout) => (
                        <div 
                          key={layout.id}
                          className={`layout-style-card ${portfolioData.appearance?.layout === layout.id ? 'selected' : ''}`}
                          onClick={() => updatePortfolioData({
                            appearance: { ...portfolioData.appearance, layout: layout.id }
                          })}
                        >
                          <div className="layout-preview">
                            <span className="layout-icon">{layout.icon}</span>
                          </div>
                          <div className="layout-content">
                            <h4 className="layout-name">{layout.name}</h4>
                            <p className="layout-description">{layout.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="appearance-section">
                    <h3 className="section-title">
                      <Type size={20} />
                      Typography
                    </h3>
                    <p className="section-description">
                      Select fonts that match your professional style and industry.
                    </p>
                    
                    <div className="typography-grid">
                      {[
                        { id: 'inter', name: 'Inter', style: 'font-family: Inter, sans-serif;', description: 'Modern, clean' },
                        { id: 'roboto', name: 'Roboto', style: 'font-family: Roboto, sans-serif;', description: 'Technical, readable' },
                        { id: 'opensans', name: 'Open Sans', style: 'font-family: "Open Sans", sans-serif;', description: 'Friendly, approachable' },
                        { id: 'lato', name: 'Lato', style: 'font-family: Lato, sans-serif;', description: 'Professional, elegant' },
                        { id: 'montserrat', name: 'Montserrat', style: 'font-family: Montserrat, sans-serif;', description: 'Creative, bold' },
                        { id: 'playfair', name: 'Playfair Display', style: 'font-family: "Playfair Display", serif;', description: 'Elegant, sophisticated' },
                        { id: 'source', name: 'Source Sans Pro', style: 'font-family: "Source Sans Pro", sans-serif;', description: 'Technical, precise' },
                        { id: 'poppins', name: 'Poppins', style: 'font-family: Poppins, sans-serif;', description: 'Modern, geometric' }
                      ].map((font) => (
                        <button
                          key={font.id}
                          className={`font-option ${portfolioData.appearance?.fontFamily === font.id ? 'selected' : ''}`}
                          onClick={() => updatePortfolioData({
                            appearance: { ...portfolioData.appearance, fontFamily: font.id }
                          })}
                          style={{ cssText: font.style }}
                        >
                          <span className="font-name">{font.name}</span>
                          <span className="font-description">{font.description}</span>
                        </button>
                      ))}
                    </div>

                    <div className="font-size-section">
                      <label className="font-size-label">Font Size</label>
                      <div className="font-size-options">
                        {[
                          { value: 'small', label: 'Small', description: 'Compact' },
                          { value: 'medium', label: 'Medium', description: 'Standard' },
                          { value: 'large', label: 'Large', description: 'Accessible' }
                        ].map((size) => (
                          <button
                            key={size.value}
                            className={`font-size-option ${portfolioData.appearance?.fontSize === size.value ? 'selected' : ''}`}
                            onClick={() => updatePortfolioData({
                              appearance: { ...portfolioData.appearance, fontSize: size.value }
                            })}
                          >
                            <span className="size-label">{size.label}</span>
                            <span className="size-description">{size.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Background Customization */}
                  <div className="appearance-section">
                    <h3 className="section-title">
                      <Palette size={20} />
                      Background Customization
                    </h3>
                    <p className="section-description">
                      Customize your portfolio background. These settings have the highest priority.
                    </p>
                    
                    <div className="background-customization-grid">
                      <div className="background-type-section">
                        <label className="background-label">Background Type</label>
                        <div className="background-type-options">
                          {[
                            { value: 'solid', label: 'Solid', icon: '⬜' },
                            { value: 'gradient', label: 'Gradient', icon: '🌈' },
                            { value: 'pattern', label: 'Pattern', icon: '🔲' }
                          ].map((type) => (
                            <button
                              key={type.value}
                              className={`background-type-option ${portfolioData.appearance?.backgroundType === type.value ? 'selected' : ''}`}
                              onClick={() => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, backgroundType: type.value }
                              })}
                            >
                              <span className="type-icon">{type.icon}</span>
                              <span className="type-label">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="color-inputs-section">
                        <div className="color-input-group">
                          <label className="color-input-label">Background Color</label>
                          <div className="color-input-wrapper">
                            <input
                              type="color"
                              className="color-picker"
                              value={portfolioData.appearance?.backgroundColor || '#ffffff'}
                              onChange={(e) => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, backgroundColor: e.target.value }
                              })}
                            />
                            <input
                              type="text"
                              className="color-text-input"
                              value={portfolioData.appearance?.backgroundColor || '#ffffff'}
                              onChange={(e) => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, backgroundColor: e.target.value }
                              })}
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>

                        <div className="color-input-group">
                          <label className="color-input-label">Text Color</label>
                          <div className="color-input-wrapper">
                            <input
                              type="color"
                              className="color-picker"
                              value={portfolioData.appearance?.textColor || '#1f2937'}
                              onChange={(e) => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, textColor: e.target.value }
                              })}
                            />
                            <input
                              type="text"
                              className="color-text-input"
                              value={portfolioData.appearance?.textColor || '#1f2937'}
                              onChange={(e) => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, textColor: e.target.value }
                              })}
                              placeholder="#1f2937"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subsection Display */}
                  <div className="appearance-section">
                    <h3 className="section-title">
                      <Layout size={20} />
                      Subsection Display
                    </h3>
                    <p className="section-description">
                      Choose how subsections are displayed in your portfolio.
                    </p>
                    
                    <div className="subsection-display-grid">
                      <div className="display-option">
                        <label className="display-label">Subsection Layout</label>
                        <div className="display-options">
                          {[
                            { 
                              value: 'grid', 
                              label: 'Grid View', 
                              description: 'Cards arranged in a responsive grid',
                              icon: '⊞',
                              preview: 'grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));'
                            },
                            { 
                              value: 'list', 
                              label: 'List View', 
                              description: 'Vertical list with clean spacing',
                              icon: '☰',
                              preview: 'display: flex; flex-direction: column; gap: 1rem;'
                            },
                            { 
                              value: 'timeline', 
                              label: 'Timeline View', 
                              description: 'Chronological timeline layout',
                              icon: '⏰',
                              preview: 'border-left: 2px solid; padding-left: 1rem;'
                            }
                          ].map((display) => (
                            <button
                              key={display.value}
                              className={`display-option-button ${portfolioData.appearance?.subsectionLayout === display.value ? 'selected' : ''}`}
                              onClick={() => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, subsectionLayout: display.value }
                              })}
                            >
                              <div className="display-preview">
                                <span className="display-icon">{display.icon}</span>
                              </div>
                              <div className="display-content">
                                <span className="display-name">{display.label}</span>
                                <span className="display-description">{display.description}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="display-option">
                        <label className="display-label">Card Density</label>
                        <div className="density-options">
                          {[
                            { value: 'compact', label: 'Compact', description: 'Tight spacing' },
                            { value: 'comfortable', label: 'Comfortable', description: 'Balanced spacing' },
                            { value: 'spacious', label: 'Spacious', description: 'Generous spacing' }
                          ].map((density) => (
                            <button
                              key={density.value}
                              className={`density-option ${portfolioData.appearance?.cardDensity === density.value ? 'selected' : ''}`}
                              onClick={() => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, cardDensity: density.value }
                              })}
                            >
                              <span className="density-label">{density.label}</span>
                              <span className="density-description">{density.description}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Styling */}
                  <div className="appearance-section">
                    <h3 className="section-title">
                      <Layout size={20} />
                      Card Styling
                    </h3>
                    <p className="section-description">
                      Customize the appearance of portfolio cards and sections.
                    </p>
                    
                    <div className="card-styling-grid">
                      <div className="border-radius-section">
                        <label className="styling-label">Border Radius</label>
                        <div className="border-radius-options">
                          {[
                            { value: 'none', label: 'None', preview: 'border-radius: 0;' },
                            { value: 'small', label: 'Small', preview: 'border-radius: 4px;' },
                            { value: 'medium', label: 'Medium', preview: 'border-radius: 8px;' },
                            { value: 'large', label: 'Large', preview: 'border-radius: 16px;' }
                          ].map((radius) => (
                            <button
                              key={radius.value}
                              className={`border-radius-option ${portfolioData.appearance?.cardBorderRadius === radius.value ? 'selected' : ''}`}
                              onClick={() => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, cardBorderRadius: radius.value }
                              })}
                            >
                              <div className="radius-preview" style={{ cssText: radius.preview }}></div>
                              <span className="radius-label">{radius.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="shadow-section">
                        <label className="styling-label">Shadow Effect</label>
                        <div className="shadow-options">
                          {[
                            { value: 'none', label: 'None', preview: 'box-shadow: none;' },
                            { value: 'small', label: 'Small', preview: 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);' },
                            { value: 'medium', label: 'Medium', preview: 'box-shadow: 0 4px 6px rgba(0,0,0,0.1);' },
                            { value: 'large', label: 'Large', preview: 'box-shadow: 0 10px 15px rgba(0,0,0,0.1);' }
                          ].map((shadow) => (
                            <button
                              key={shadow.value}
                              className={`shadow-option ${portfolioData.appearance?.cardShadow === shadow.value ? 'selected' : ''}`}
                              onClick={() => updatePortfolioData({
                                appearance: { ...portfolioData.appearance, cardShadow: shadow.value }
                              })}
                            >
                              <div className="shadow-preview" style={{ cssText: shadow.preview }}></div>
                              <span className="shadow-label">{shadow.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom CSS */}
                  <div className="appearance-section">
                    <h3 className="section-title">
                      <Type size={20} />
                      Custom CSS (Advanced)
                    </h3>
                    <p className="section-description">
                      Add custom CSS to further customize your portfolio. This has the highest priority and will override all other settings.
                    </p>
                    
                    <div className="custom-css-section">
                      <textarea
                        className="custom-css-textarea"
                        value={portfolioData.appearance?.customCSS || ''}
                        onChange={(e) => updatePortfolioData({
                          appearance: { ...portfolioData.appearance, customCSS: e.target.value }
                        })}
                        placeholder="/* Add your custom CSS here */
.portfolio-container {
  /* Custom styles */
}"
                        rows={8}
                      />
                      <div className="css-help">
                        <p>💡 <strong>Priority Order:</strong> Custom CSS → Appearance Settings → Theme → Form Defaults</p>
                        <p>🎨 Use CSS variables for dynamic theming: <code>var(--primary-color)</code>, <code>var(--secondary-color)</code></p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Button */}
                  <div className="preview-section">
                    <button
                      onClick={handlePreview}
                      className="preview-button"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Changes
                    </button>
                  </div>
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
