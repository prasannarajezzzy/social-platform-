import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Phone, 
  Mail, 
  ExternalLink, 
  Calendar,
  Edit3,
  Share2,
  Eye,
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Palette,
  AlertCircle
} from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import { authAPI } from '../../services/authAPI';
import '../styles/PortfolioDisplay.css';

const PortfolioDisplay = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { portfolioData, profileData, isLoading } = useProfile();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [publicPortfolioData, setPublicPortfolioData] = useState(null);
  const [loadingPublicPortfolio, setLoadingPublicPortfolio] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);

  useEffect(() => {
    // Check if this is preview mode or actual portfolio view
    if (username === 'preview' || window.location.pathname.includes('/preview/')) {
      setIsPreviewMode(true);
    } else if (username && username !== 'preview') {
      // This is a public portfolio view by username
      fetchPublicPortfolio(username);
    }
  }, [username]);

  const fetchPublicPortfolio = async (portfolioUsername) => {
    setLoadingPublicPortfolio(true);
    setPortfolioError(null);
    try {
      const response = await authAPI.getPublicPortfolio(portfolioUsername);
      setPublicPortfolioData(response);
    } catch (error) {
      console.error('Error fetching public portfolio:', error);
      setPortfolioError(error.message);
    } finally {
      setLoadingPublicPortfolio(false);
    }
  };

  const getSectionIcon = (sectionName) => {
    if (!sectionName) return <User className="h-5 w-5" />;
    const name = sectionName.toLowerCase();
    if (name.includes('experience') || name.includes('work')) return <Briefcase className="h-5 w-5" />;
    if (name.includes('education') || name.includes('school')) return <GraduationCap className="h-5 w-5" />;
    if (name.includes('skill')) return <Code className="h-5 w-5" />;
    if (name.includes('project')) return <Palette className="h-5 w-5" />;
    if (name.includes('award') || name.includes('certificate')) return <Award className="h-5 w-5" />;
    return <User className="h-5 w-5" />;
  };

  // Determine which portfolio data to use
  const currentPortfolioData = publicPortfolioData?.portfolioData || portfolioData;

  const getThemeStyles = () => {
    const appearance = currentPortfolioData.appearance || {};
    
    // Color scheme mapping
    const colorSchemes = {
      blue: { primary: '#3b82f6', secondary: '#1e40af', accent: 'bg-blue-600' },
      green: { primary: '#10b981', secondary: '#047857', accent: 'bg-green-600' },
      purple: { primary: '#8b5cf6', secondary: '#6d28d9', accent: 'bg-purple-600' },
      red: { primary: '#ef4444', secondary: '#dc2626', accent: 'bg-red-600' },
      orange: { primary: '#f97316', secondary: '#ea580c', accent: 'bg-orange-600' },
      gray: { primary: '#6b7280', secondary: '#374151', accent: 'bg-gray-600' },
      indigo: { primary: '#6366f1', secondary: '#4f46e5', accent: 'bg-indigo-600' },
      pink: { primary: '#ec4899', secondary: '#db2777', accent: 'bg-pink-600' }
    };

    const colors = colorSchemes[appearance.colorScheme] || colorSchemes.blue;
    
    // Background type handling
    let backgroundClass = 'bg-white';
    if (appearance.backgroundType === 'gradient') {
      backgroundClass = `bg-gradient-to-br from-${appearance.colorScheme}-50 to-${appearance.colorScheme}-100`;
    } else if (appearance.backgroundType === 'pattern') {
      backgroundClass = 'bg-white bg-opacity-90';
    }

    return {
      bg: backgroundClass,
      accent: colors.accent,
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      primaryColor: colors.primary,
      secondaryColor: colors.secondary
    };
  };

  const theme = getThemeStyles();

  // Get appearance styles based on settings
  const getAppearanceStyles = () => {
    const appearance = portfolioData.appearance || {};
    
    const colorSchemes = {
      blue: { primary: '#3b82f6', secondary: '#1e40af', accent: 'bg-blue-600' },
      green: { primary: '#10b981', secondary: '#047857', accent: 'bg-green-600' },
      purple: { primary: '#8b5cf6', secondary: '#6d28d9', accent: 'bg-purple-600' },
      red: { primary: '#ef4444', secondary: '#dc2626', accent: 'bg-red-600' },
      orange: { primary: '#f97316', secondary: '#ea580c', accent: 'bg-orange-600' },
      gray: { primary: '#6b7280', secondary: '#374151', accent: 'bg-gray-600' },
      indigo: { primary: '#6366f1', secondary: '#4f46e5', accent: 'bg-indigo-600' },
      pink: { primary: '#ec4899', secondary: '#db2777', accent: 'bg-pink-600' }
    };

    const layouts = {
      modern: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
      classic: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
      minimal: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8',
      creative: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
    };

    const fontFamilies = {
      inter: 'font-inter',
      roboto: 'font-roboto',
      opensans: 'font-open-sans',
      lato: 'font-lato',
      montserrat: 'font-montserrat',
      playfair: 'font-playfair',
      source: 'font-source-sans'
    };

    const fontSizes = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    };

    const borderRadius = {
      none: 'rounded-none',
      small: 'rounded-sm',
      medium: 'rounded-lg',
      large: 'rounded-xl'
    };

    const shadows = {
      none: 'shadow-none',
      small: 'shadow-sm',
      medium: 'shadow-md',
      large: 'shadow-lg'
    };

    const colors = colorSchemes[appearance.colorScheme] || colorSchemes.blue;
    const layout = layouts[appearance.layout] || layouts.modern;
    const fontFamily = fontFamilies[appearance.fontFamily] || fontFamilies.inter;
    const fontSize = fontSizes[appearance.fontSize] || fontSizes.medium;
    const borderRadiusClass = borderRadius[appearance.cardBorderRadius] || borderRadius.medium;
    const shadowClass = shadows[appearance.cardShadow] || shadows.medium;

    return {
      colors,
      layout,
      fontFamily,
      fontSize,
      borderRadiusClass,
      shadowClass,
      backgroundColor: appearance.backgroundColor || '#ffffff',
      backgroundPattern: appearance.backgroundPattern || '',
      textColor: appearance.textColor || '#1f2937',
      subsectionLayout: appearance.subsectionLayout || 'grid',
      cardDensity: appearance.cardDensity || 'comfortable',
      customCSS: appearance.customCSS || ''
    };
  };

  const appearanceStyles = getAppearanceStyles();

  if (isLoading || loadingPublicPortfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Handle portfolio error (for public portfolios)
  if (portfolioError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">{portfolioError}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentPortfolioData.isPortfolioEnabled && !isPreviewMode && !publicPortfolioData) {
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
    <div 
      className={`min-h-screen ${theme.bg} ${appearanceStyles.fontFamily} ${appearanceStyles.fontSize}`}
      style={{
        backgroundColor: appearanceStyles.backgroundColor,
        backgroundImage: appearanceStyles.backgroundPattern,
        color: appearanceStyles.textColor,
        fontFamily: appearanceStyles.fontFamily === 'inter' ? 'Inter, sans-serif' :
                   appearanceStyles.fontFamily === 'roboto' ? 'Roboto, sans-serif' :
                   appearanceStyles.fontFamily === 'opensans' ? 'Open Sans, sans-serif' :
                   appearanceStyles.fontFamily === 'lato' ? 'Lato, sans-serif' :
                   appearanceStyles.fontFamily === 'montserrat' ? 'Montserrat, sans-serif' :
                   appearanceStyles.fontFamily === 'playfair' ? 'Playfair Display, serif' :
                   appearanceStyles.fontFamily === 'source' ? 'Source Sans Pro, sans-serif' :
                   'Inter, sans-serif'
      }}
    >
      <style>{appearanceStyles.customCSS}</style>
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

      <div className={`${appearanceStyles.layout} py-8`}>
        {/* Header Section */}
        <div className={`${theme.bg} ${appearanceStyles.borderRadiusClass} ${appearanceStyles.shadowClass} p-8 mb-8 ${theme.border} border`}>
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
                className="flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: theme.primaryColor }}
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
          {portfolioData.sections && portfolioData.sections.length > 0 && portfolioData.sections
            .filter(section => section && (section.sectionName || section.title)) // Filter out invalid sections
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((section) => (
              <div key={section.id} className={`${theme.bg} ${appearanceStyles.borderRadiusClass} ${appearanceStyles.shadowClass} p-6 ${theme.border} border`}>
                <div className="flex items-center mb-6">
                  <div 
                    className="p-2 text-white rounded-lg mr-3"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {getSectionIcon(section.sectionName || section.title)}
                  </div>
                  <h2 className={`text-2xl font-bold ${theme.text}`}>
                    {section.sectionName || section.title}
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

                <div className={`${appearanceStyles.subsectionLayout === 'grid' ? 'subsection-grid' : 
                                 appearanceStyles.subsectionLayout === 'list' ? 'subsection-list' : 
                                 appearanceStyles.subsectionLayout === 'timeline' ? 'subsection-timeline' : 'subsection-grid'} 
                                 card-density-${appearanceStyles.cardDensity}`}>
                  {section.subsections
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((subsection) => (
                      <div key={subsection.id} className={`subsection-item ${appearanceStyles.subsectionLayout === 'timeline' ? 'border-l-4 border-gray-200 pl-6 relative' : 
                                                           appearanceStyles.subsectionLayout === 'grid' ? 'bg-white rounded-lg shadow-md p-6 border border-gray-200' :
                                                           'bg-white rounded-lg shadow-md p-6 border border-gray-200'} ${appearanceStyles.borderRadiusClass} ${appearanceStyles.shadowClass}`}>
                        {appearanceStyles.subsectionLayout === 'timeline' && <div className="absolute -left-2 top-2 w-4 h-4 bg-gray-300 rounded-full"></div>}
                        
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
        {(!portfolioData.sections || portfolioData.sections.length === 0) && (
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
