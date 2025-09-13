import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Phone, 
  Mail, 
  ExternalLink, 
  Calendar,
  MapPin,
  Edit3,
  Share2,
  Eye,
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Palette
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import './PortfolioDisplay.css';

const PortfolioDisplay = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { portfolioData, profileData, isLoading } = useProfile();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    // Check if this is preview mode or actual portfolio view
    if (username === 'preview' || window.location.pathname.includes('/preview/')) {
      setIsPreviewMode(true);
    }
  }, [username]);

  const getSectionIcon = (sectionName) => {
    const name = sectionName.toLowerCase();
    if (name.includes('experience') || name.includes('work')) return <Briefcase className="h-5 w-5" />;
    if (name.includes('education') || name.includes('school')) return <GraduationCap className="h-5 w-5" />;
    if (name.includes('skill')) return <Code className="h-5 w-5" />;
    if (name.includes('project')) return <Palette className="h-5 w-5" />;
    if (name.includes('award') || name.includes('certificate')) return <Award className="h-5 w-5" />;
    return <User className="h-5 w-5" />;
  };

  const getThemeStyles = () => {
    const themes = {
      professional: {
        bg: 'bg-white',
        accent: 'bg-blue-600',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200'
      },
      modern: {
        bg: 'bg-gray-50',
        accent: 'bg-purple-600',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        border: 'border-gray-300'
      },
      creative: {
        bg: 'bg-gradient-to-br from-pink-50 to-blue-50',
        accent: 'bg-gradient-to-r from-pink-500 to-blue-500',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        border: 'border-gray-200'
      },
      minimal: {
        bg: 'bg-white',
        accent: 'bg-black',
        text: 'text-black',
        textSecondary: 'text-gray-600',
        border: 'border-gray-100'
      }
    };
    return themes[portfolioData.theme] || themes.professional;
  };

  const theme = getThemeStyles();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!portfolioData.isPortfolioEnabled && !isPreviewMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">This portfolio is not available or has been disabled.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Header for preview mode */}
      {isPreviewMode && (
        <div className="bg-gray-900 text-white p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/portfolio/builder')}
                className="flex items-center text-gray-300 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Builder
              </button>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Portfolio Preview</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={() => navigate('/portfolio/builder')}
                className="flex items-center px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className={`${theme.bg} rounded-lg shadow-lg p-8 mb-8 ${theme.border} border`}>
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              {profileData.profileImageUrl ? (
                <img
                  src={profileData.profileImageUrl}
                  alt={profileData.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-600" />
              )}
            </div>
            <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>
              {portfolioData.fullName || profileData.name || 'Your Name'}
            </h1>
            <p className={`text-lg ${theme.textSecondary} mb-4`}>
              {profileData.title || 'Your Professional Title'}
            </p>
            {profileData.bio && (
              <p className={`${theme.textSecondary} max-w-2xl mx-auto`}>
                {profileData.bio}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {portfolioData.contactInfo.phone && (
              <a
                href={`tel:${portfolioData.contactInfo.phone}`}
                className={`flex items-center px-4 py-2 ${theme.border} border rounded-lg hover:bg-gray-50 transition-colors`}
              >
                <Phone className="h-4 w-4 mr-2" />
                {portfolioData.contactInfo.phone}
              </a>
            )}
            {portfolioData.contactInfo.email && (
              <a
                href={`mailto:${portfolioData.contactInfo.email}`}
                className={`flex items-center px-4 py-2 ${theme.border} border rounded-lg hover:bg-gray-50 transition-colors`}
              >
                <Mail className="h-4 w-4 mr-2" />
                {portfolioData.contactInfo.email}
              </a>
            )}
            {portfolioData.resumeUrl && (
              <a
                href={portfolioData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </a>
            )}
          </div>

          {/* Additional Contacts */}
          {portfolioData.contactInfo.additionalContacts.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {portfolioData.contactInfo.additionalContacts.map((contact, index) => (
                <a
                  key={index}
                  href={contact.type === 'email' ? `mailto:${contact.value}` : 
                        contact.type === 'phone' ? `tel:${contact.value}` : 
                        contact.value.startsWith('http') ? contact.value : `https://${contact.value}`}
                  target={contact.type === 'website' || contact.type === 'social' ? '_blank' : undefined}
                  rel={contact.type === 'website' || contact.type === 'social' ? 'noopener noreferrer' : undefined}
                  className={`flex items-center px-3 py-2 text-sm ${theme.border} border rounded-lg hover:bg-gray-50 transition-colors`}
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  {contact.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Sections */}
        <div className="space-y-8">
          {portfolioData.sections
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((section) => (
              <div key={section.id} className={`${theme.bg} rounded-lg shadow-lg p-6 ${theme.border} border`}>
                <div className="flex items-center mb-6">
                  <div className={`p-2 ${theme.accent} text-white rounded-lg mr-3`}>
                    {getSectionIcon(section.sectionName)}
                  </div>
                  <h2 className={`text-2xl font-bold ${theme.text}`}>
                    {section.sectionName}
                  </h2>
                </div>

                {/* Section-level bullet points */}
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {section.bulletPoints.map((point, index) => (
                        <li key={index} className={`flex items-start ${theme.textSecondary}`}>
                          <span className="text-blue-500 mr-3 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-6">
                  {section.subsections
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((subsection) => (
                      <div key={subsection.id} className="border-l-4 border-gray-200 pl-6 relative">
                        <div className="absolute -left-2 top-2 w-4 h-4 bg-gray-300 rounded-full"></div>
                        
                        <div className="mb-3">
                          {subsection.title && (
                            <h3 className={`text-xl font-semibold ${theme.text} mb-1`}>
                              {subsection.title}
                            </h3>
                          )}
                          
                          {(subsection.dateRange?.startDate || subsection.dateRange?.endDate) && (
                            <div className={`flex items-center text-sm ${theme.textSecondary} mb-2`}>
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {subsection.dateRange.startDate}
                                {subsection.dateRange.startDate && (subsection.dateRange.endDate || subsection.dateRange.isCurrent) && ' - '}
                                {subsection.dateRange.isCurrent ? 'Present' : subsection.dateRange.endDate}
                              </span>
                            </div>
                          )}
                        </div>

                        {subsection.description && (
                          <p className={`${theme.textSecondary} mb-3`}>
                            {subsection.description}
                          </p>
                        )}

                        {subsection.bulletPoints && subsection.bulletPoints.filter(point => point.trim()).length > 0 && (
                          <ul className="space-y-1">
                            {subsection.bulletPoints
                              .filter(point => point.trim())
                              .map((point, index) => (
                                <li key={index} className={`flex items-start ${theme.textSecondary}`}>
                                  <span className="text-gray-400 mr-2 mt-1">•</span>
                                  <span>{point}</span>
                                </li>
                              ))
                            }
                          </ul>
                        )}

                        {subsection.tags && subsection.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {subsection.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>

        {/* Empty State */}
        {portfolioData.sections.length === 0 && (
          <div className={`${theme.bg} rounded-lg shadow-lg p-12 text-center ${theme.border} border`}>
            <User className={`h-16 w-16 ${theme.textSecondary} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>
              Portfolio Coming Soon
            </h3>
            <p className={theme.textSecondary}>
              This portfolio is currently being built. Check back soon!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-6">
          <p className={`text-sm ${theme.textSecondary}`}>
            {portfolioData.portfolioViews > 0 && (
              <span className="inline-flex items-center mr-4">
                <Eye className="h-4 w-4 mr-1" />
                {portfolioData.portfolioViews} views
              </span>
            )}
            <span>
              Last updated: {new Date(portfolioData.lastUpdated || Date.now()).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default PortfolioDisplay;
