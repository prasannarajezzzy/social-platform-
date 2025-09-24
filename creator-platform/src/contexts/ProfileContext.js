import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/authAPI';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    profileImage: null,
    profileImageUrl: '',
    name: '',
    title: '',
    bio: '',
    username: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: '',
      github: '',
      facebook: '',
      tiktok: '',
      website: ''
    },
    customLinks: []
  });

  const [appearanceData, setAppearanceData] = useState({
    theme: 'lake-white',
    brandColor: '#667eea',
    backgroundColor: '#ffffff',
    buttonStyle: 'rounded',
    buttonLayout: 'stack',
    font: 'inter',
    customCSS: ''
  });

  const [portfolioData, setPortfolioData] = useState({
    isPortfolioEnabled: false,
    profileName: 'My Portfolio',
    fullName: '',
    portfolioUsername: '',
    resumeUrl: '',
    contactInfo: {
      phone: '',
      email: '',
      additionalContacts: []
    },
    sections: [],
    theme: 'professional',
    isPublic: false,
        appearance: {
          portfolioMode: 'professional',
          colorScheme: 'blue',
          layout: 'modern',
          fontFamily: 'inter',
          fontSize: 'medium',
          backgroundType: 'solid',
          backgroundColor: '#ffffff',
          backgroundPattern: '',
          textColor: '#1f2937',
          cardBorderRadius: 'medium',
          cardShadow: 'medium',
          subsectionLayout: 'grid',
          cardDensity: 'comfortable',
          customCSS: ''
        }
  });

  const [portfolioProfiles, setPortfolioProfiles] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  const loadProfileFromBackend = useCallback(async () => {
    if (!authAPI.isAuthenticated()) {
      // If not authenticated, load from localStorage as fallback
      loadFromLocalStorage();
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.getFullProfile();
      
      if (response.profile) {
        // Map backend data to frontend state
        setProfileData({
          profileImage: null, // File objects can't be stored in backend
          profileImageUrl: response.profile.profileData?.profileImageUrl || '',
          name: response.profile.name || '', // Name is stored at user level, not in profileData
          title: response.profile.profileData?.title || '',
          bio: response.profile.profileData?.bio || '',
          username: response.profile.username || '',
          socialLinks: response.profile.profileData?.socialLinks || {
            instagram: '',
            twitter: '',
            youtube: '',
            linkedin: '',
            github: '',
            facebook: '',
            tiktok: '',
            website: ''
          },
          customLinks: response.profile.profileData?.customLinks || []
        });

        setAppearanceData({
          theme: response.profile.appearanceData?.theme || 'lake-white',
          brandColor: response.profile.appearanceData?.brandColor || '#667eea',
          backgroundColor: response.profile.appearanceData?.backgroundColor || '#ffffff',
          buttonStyle: response.profile.appearanceData?.buttonStyle || 'rounded',
          buttonLayout: response.profile.appearanceData?.buttonLayout || 'stack',
          font: response.profile.appearanceData?.font || 'inter',
          customCSS: response.profile.appearanceData?.customCSS || ''
        });

        // Load portfolio profiles
        const profiles = response.profile.portfolioProfiles || [];
        setPortfolioProfiles(profiles);
        
        // Find default profile or use first profile
        const defaultProfile = profiles.find(p => p.isDefault) || profiles[0];
        if (defaultProfile) {
          setCurrentProfileId(defaultProfile.id);
          setPortfolioData(defaultProfile.portfolioData);
        } else {
          // Fallback to main portfolioData if no profiles exist
          setPortfolioData({
            isPortfolioEnabled: response.profile.portfolioData?.isPortfolioEnabled || false,
            profileName: response.profile.portfolioData?.profileName || 'My Portfolio',
            fullName: response.profile.portfolioData?.fullName || '',
            portfolioUsername: response.profile.portfolioData?.portfolioUsername || '',
            resumeUrl: response.profile.portfolioData?.resumeUrl || '',
            contactInfo: {
              phone: response.profile.portfolioData?.contactInfo?.phone || '',
              email: response.profile.portfolioData?.contactInfo?.email || '',
              additionalContacts: response.profile.portfolioData?.contactInfo?.additionalContacts || []
            },
            sections: response.profile.portfolioData?.sections || [],
            theme: response.profile.portfolioData?.theme || 'professional',
            isPublic: response.profile.portfolioData?.isPublic || false,
            appearance: {
              portfolioMode: response.profile.portfolioData?.appearance?.portfolioMode || 'professional',
              colorScheme: response.profile.portfolioData?.appearance?.colorScheme || 'blue',
              layout: response.profile.portfolioData?.appearance?.layout || 'modern',
              fontFamily: response.profile.portfolioData?.appearance?.fontFamily || 'inter',
              fontSize: response.profile.portfolioData?.appearance?.fontSize || 'medium',
              backgroundType: response.profile.portfolioData?.appearance?.backgroundType || 'solid',
              backgroundColor: response.profile.portfolioData?.appearance?.backgroundColor || '#ffffff',
              backgroundPattern: response.profile.portfolioData?.appearance?.backgroundPattern || '',
              textColor: response.profile.portfolioData?.appearance?.textColor || '#1f2937',
              cardBorderRadius: response.profile.portfolioData?.appearance?.cardBorderRadius || 'medium',
              cardShadow: response.profile.portfolioData?.appearance?.cardShadow || 'medium',
              subsectionLayout: response.profile.portfolioData?.appearance?.subsectionLayout || 'grid',
              cardDensity: response.profile.portfolioData?.appearance?.cardDensity || 'comfortable',
              customCSS: response.profile.portfolioData?.appearance?.customCSS || ''
            }
          });
        }

        // Load analytics data
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Error loading profile from backend:', error);
      // Fallback to localStorage if backend fails
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load profile data from backend on mount
  useEffect(() => {
    loadProfileFromBackend();
  }, [loadProfileFromBackend]);

  const loadFromLocalStorage = () => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedAppearance = localStorage.getItem('userAppearance');
    
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile data from localStorage:', error);
      }
    }
    
    if (savedAppearance) {
      try {
        setAppearanceData(JSON.parse(savedAppearance));
      } catch (error) {
        console.error('Error loading appearance data from localStorage:', error);
      }
    }
  };

  const loadAnalytics = async () => {
    try {
      const analytics = await authAPI.getAnalytics();
      setAnalyticsData(analytics.analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  // Save to localStorage for offline access (keep as backup)
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  }, [profileData]);

  useEffect(() => {
    localStorage.setItem('userAppearance', JSON.stringify(appearanceData));
  }, [appearanceData]);

  const updateProfile = (updates) => {
    setProfileData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateSocialLink = (platform, value) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addCustomLink = async (link) => {
    try {
      if (authAPI.isAuthenticated()) {
        // Add to backend first
        const response = await authAPI.addCustomLink(link);
        if (response.link) {
          // Update local state with backend response
          setProfileData(prev => ({
            ...prev,
            customLinks: [...prev.customLinks, response.link]
          }));
          return response.link;
        }
      } else {
        // Fallback to local-only for non-authenticated users
        const newLink = {
          id: Date.now().toString(),
          title: link.title,
          url: link.url,
          description: link.description || '',
          icon: link.icon || 'ExternalLink',
          isActive: true,
          clicks: 0
        };
        
        setProfileData(prev => ({
          ...prev,
          customLinks: [...prev.customLinks, newLink]
        }));
        return newLink;
      }
    } catch (error) {
      console.error('Error adding custom link:', error);
      // Fallback to local state on error
      const newLink = {
        id: Date.now().toString(),
        title: link.title,
        url: link.url,
        description: link.description || '',
        icon: link.icon || 'ExternalLink',
        isActive: true,
        clicks: 0
      };
      
      setProfileData(prev => ({
        ...prev,
        customLinks: [...prev.customLinks, newLink]
      }));
      return newLink;
    }
  };

  const updateCustomLink = async (linkId, updates) => {
    try {
      if (authAPI.isAuthenticated()) {
        // Update backend first
        const response = await authAPI.updateCustomLink(linkId, updates);
        if (response.message && response.link) {
          // Update local state with the response from backend
          setProfileData(prev => ({
            ...prev,
            customLinks: prev.customLinks.map(link => 
              link.id === linkId ? response.link : link
            )
          }));
        }
      } else {
        // Update local state only
        setProfileData(prev => ({
          ...prev,
          customLinks: prev.customLinks.map(link => 
            link.id === linkId ? { ...link, ...updates } : link
          )
        }));
      }
    } catch (error) {
      console.error('Error updating custom link:', error);
      // Update local state as fallback
      setProfileData(prev => ({
        ...prev,
        customLinks: prev.customLinks.map(link => 
          link.id === linkId ? { ...link, ...updates } : link
        )
      }));
    }
  };

  const deleteCustomLink = async (linkId) => {
    try {
      if (authAPI.isAuthenticated()) {
        // Delete from backend first
        const response = await authAPI.deleteCustomLink(linkId);
        if (response.message) {
          // Update local state
          setProfileData(prev => ({
            ...prev,
            customLinks: prev.customLinks.filter(link => link.id !== linkId)
          }));
        }
      } else {
        // Update local state only
        setProfileData(prev => ({
          ...prev,
          customLinks: prev.customLinks.filter(link => link.id !== linkId)
        }));
      }
    } catch (error) {
      console.error('Error deleting custom link:', error);
      // Update local state as fallback
      setProfileData(prev => ({
        ...prev,
        customLinks: prev.customLinks.filter(link => link.id !== linkId)
      }));
    }
  };

  const reorderCustomLinks = (fromIndex, toIndex) => {
    setProfileData(prev => {
      const newLinks = [...prev.customLinks];
      const [removed] = newLinks.splice(fromIndex, 1);
      newLinks.splice(toIndex, 0, removed);
      return {
        ...prev,
        customLinks: newLinks
      };
    });
  };

  const trackLinkClick = async (linkId, clickData = {}) => {
    try {
      if (authAPI.isAuthenticated()) {
        // Track click on backend
        await authAPI.trackLinkClick(linkId, clickData);
        // Reload analytics to get updated data
        await loadAnalytics();
      }
      
      // Update local state regardless
      setProfileData(prev => ({
        ...prev,
        customLinks: prev.customLinks.map(link => 
          link.id === linkId 
            ? { ...link, clicks: (link.clicks || 0) + 1 }
            : link
        )
      }));
    } catch (error) {
      console.error('Error tracking link click:', error);
      // Update local state as fallback
      setProfileData(prev => ({
        ...prev,
        customLinks: prev.customLinks.map(link => 
          link.id === linkId 
            ? { ...link, clicks: (link.clicks || 0) + 1 }
            : link
        )
      }));
    }
  };

  const updateAppearance = (updates) => {
    setAppearanceData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      if (authAPI.isAuthenticated()) {
        console.log('Saving profile - currentProfileId:', currentProfileId);
        console.log('Profile data:', profileData);
        console.log('Appearance data:', appearanceData);
        
        // Prepare profile data for backend (exclude File objects and name)
        const backendProfileData = {
          ...profileData,
          profileImage: undefined, // Remove File object, keep only profileImageUrl
          name: undefined // Name is stored at user level, not in profileData
        };
        
        // Always save to main profile, not portfolio profiles when editing from profile page
        // Save to backend API
        const response = await authAPI.saveProfile(backendProfileData, appearanceData, portfolioData);
        console.log('Backend response:', response);
        
        if (response.success) {
          console.log('Profile saved successfully to backend');
          
          // Automatically set profile to public when saving
          try {
            await authAPI.updateProfileSettings({ isPublic: true });
            console.log('Profile set to public');
          } catch (settingsError) {
            console.warn('Failed to set profile to public:', settingsError);
            // Don't fail the entire save operation if settings update fails
          }
          
          return { success: true };
        } else {
          throw new Error(response.error || 'Failed to save profile');
        }
      } else {
        // For non-authenticated users, just keep in localStorage
        console.log('Profile saved to localStorage (user not authenticated)');
        return { success: true };
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetProfile = () => {
    setProfileData({
      profileImage: null,
      profileImageUrl: '',
      name: '',
      title: '',
      bio: '',
      username: '',
      socialLinks: {
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: '',
        github: '',
        facebook: '',
        tiktok: '',
        website: ''
      },
      customLinks: []
    });
  };

  const resetAppearance = () => {
    setAppearanceData({
      theme: 'lake-white',
      brandColor: '#667eea',
      backgroundColor: '#ffffff',
      buttonStyle: 'rounded',
      buttonLayout: 'stack',
      font: 'inter',
      customCSS: ''
    });
  };

  const getThemeStyles = () => {
    const themes = {
      'lake-white': {
        background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        primaryColor: '#1976d2',
        secondaryColor: '#f5f5f5'
      },
      'sunset': {
        background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
        primaryColor: '#ff6b35',
        secondaryColor: '#fff3e0'
      },
      'ocean': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        primaryColor: '#667eea',
        secondaryColor: '#f0f4ff'
      },
      'forest': {
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        primaryColor: '#11998e',
        secondaryColor: '#e8f5e8'
      },
      'midnight': {
        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
        primaryColor: '#3498db',
        secondaryColor: '#ecf0f1'
      },
      'custom': {
        background: appearanceData.backgroundColor,
        primaryColor: appearanceData.brandColor,
        secondaryColor: '#f5f5f5'
      }
    };

    return themes[appearanceData.theme] || themes['lake-white'];
  };

  const getFontFamily = () => {
    const fonts = {
      'inter': 'Inter, sans-serif',
      'poppins': 'Poppins, sans-serif',
      'roboto': 'Roboto, sans-serif',
      'montserrat': 'Montserrat, sans-serif',
      'playfair': '"Playfair Display", serif'
    };

    return fonts[appearanceData.font] || fonts['inter'];
  };

  const getButtonStyles = () => {
    const styles = {
      'rounded': { borderRadius: '12px' },
      'pill': { borderRadius: '50px' },
      'square': { borderRadius: '4px' },
      'sharp': { borderRadius: '0' }
    };

    return styles[appearanceData.buttonStyle] || styles['rounded'];
  };

  // Portfolio management functions
  const updatePortfolioData = (updates) => {
    setPortfolioData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addPortfolioSection = () => {
    const newSection = {
      id: Date.now().toString(),
      sectionName: '',
      order: portfolioData.sections.length,
      subsections: []
    };
    setPortfolioData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    return newSection.id;
  };

  const updatePortfolioSection = (sectionId, updates) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const deletePortfolioSection = (sectionId) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const addSubsection = (sectionId) => {
    const newSubsection = {
      id: Date.now().toString(),
      title: '',
      bulletPoints: [''],
      order: 0,
      dateRange: { startDate: '', endDate: '', isCurrent: false },
      description: '',
      tags: []
    };

    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              subsections: [...section.subsections, { ...newSubsection, order: section.subsections.length }]
            }
          : section
      )
    }));
    return newSubsection.id;
  };

  const updateSubsection = (sectionId, subsectionId, updates) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              subsections: section.subsections.map(subsection =>
                subsection.id === subsectionId ? { ...subsection, ...updates } : subsection
              )
            }
          : section
      )
    }));
  };

  const deleteSubsection = (sectionId, subsectionId) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              subsections: section.subsections.filter(subsection => subsection.id !== subsectionId)
            }
          : section
      )
    }));
  };

  const addBulletPoint = (sectionId, subsectionId) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          // If subsectionId is null, add to section level
          if (subsectionId === null) {
            return {
              ...section,
              bulletPoints: [...(section.bulletPoints || []), '']
            };
          } else {
            // Add to subsection level
            return {
              ...section,
              subsections: section.subsections.map(subsection =>
                subsection.id === subsectionId
                  ? { ...subsection, bulletPoints: [...(subsection.bulletPoints || []), ''] }
                  : subsection
              )
            };
          }
        }
        return section;
      })
    }));
  };

  const updateBulletPoint = (sectionId, subsectionId, bulletIndex, value) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          // If subsectionId is null, update section level bullet points
          if (subsectionId === null) {
            return {
              ...section,
              bulletPoints: (section.bulletPoints || []).map((point, index) =>
                index === bulletIndex ? value : point
              )
            };
          } else {
            // Update subsection level bullet points
            return {
              ...section,
              subsections: section.subsections.map(subsection =>
                subsection.id === subsectionId
                  ? {
                      ...subsection,
                      bulletPoints: (subsection.bulletPoints || []).map((point, index) =>
                        index === bulletIndex ? value : point
                      )
                    }
                  : subsection
              )
            };
          }
        }
        return section;
      })
    }));
  };

  const deleteBulletPoint = (sectionId, subsectionId, bulletIndex) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          // If subsectionId is null, delete from section level bullet points
          if (subsectionId === null) {
            return {
              ...section,
              bulletPoints: (section.bulletPoints || []).filter((_, index) => index !== bulletIndex)
            };
          } else {
            // Delete from subsection level bullet points
            return {
              ...section,
              subsections: section.subsections.map(subsection =>
                subsection.id === subsectionId
                  ? {
                      ...subsection,
                      bulletPoints: (subsection.bulletPoints || []).filter((_, index) => index !== bulletIndex)
                    }
                  : subsection
              )
            };
          }
        }
        return section;
      })
    }));
  };

  const addAdditionalContact = () => {
    setPortfolioData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        additionalContacts: [
          ...prev.contactInfo.additionalContacts,
          { label: '', value: '', type: 'other' }
        ]
      }
    }));
  };

  const updateAdditionalContact = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        additionalContacts: prev.contactInfo.additionalContacts.map((contact, i) =>
          i === index ? { ...contact, [field]: value } : contact
        )
      }
    }));
  };

  const deleteAdditionalContact = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        additionalContacts: prev.contactInfo.additionalContacts.filter((_, i) => i !== index)
      }
    }));
  };

  // Portfolio Profile Management Functions
  const createPortfolioProfile = async (name, description, portfolioData) => {
    try {
      if (authAPI.isAuthenticated()) {
        console.log('Creating portfolio profile:', { name, description, portfolioData });
        const response = await authAPI.createPortfolioProfile({ name, description, portfolioData });
        console.log('Portfolio profile creation response:', response);
        if (response.profile) {
          setPortfolioProfiles(prev => [...prev, response.profile]);
          // Set the newly created profile as the current profile
          setCurrentProfileId(response.profile.id);
          return response.profile;
        }
      } else {
        // Fallback for non-authenticated users
        const newProfile = {
          id: Date.now().toString(),
          name,
          description: description || '',
          isDefault: portfolioProfiles.length === 0,
          isActive: true,
          portfolioData: portfolioData || {
            isPortfolioEnabled: true,
            profileName: 'My Portfolio',
            fullName: '',
            portfolioUsername: '',
            resumeUrl: '',
            contactInfo: { phone: '', email: '', additionalContacts: [] },
            sections: [],
            theme: 'professional',
            isPublic: false,
            appearance: {
              portfolioMode: 'professional',
              colorScheme: 'blue',
              layout: 'modern',
              fontFamily: 'inter',
              fontSize: 'medium',
              backgroundType: 'solid',
              backgroundColor: '#ffffff',
              backgroundPattern: '',
              textColor: '#1f2937',
              cardBorderRadius: 'medium',
              cardShadow: 'medium',
              subsectionLayout: 'grid',
              cardDensity: 'comfortable',
              customCSS: ''
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setPortfolioProfiles(prev => [...prev, newProfile]);
        // Set the newly created profile as the current profile
        setCurrentProfileId(newProfile.id);
        return newProfile;
      }
    } catch (error) {
      console.error('Error creating portfolio profile:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  };

  const updatePortfolioProfile = async (profileId, updates, retryCount = 0) => {
    try {
      if (authAPI.isAuthenticated()) {
        const response = await authAPI.updatePortfolioProfile(profileId, updates);
        if (response.profile) {
          setPortfolioProfiles(prev => 
            prev.map(profile => 
              profile.id === profileId ? response.profile : profile
            )
          );
          return response.profile;
        }
      } else {
        // Update local state
        setPortfolioProfiles(prev => 
          prev.map(profile => 
            profile.id === profileId ? { ...profile, ...updates, updatedAt: new Date() } : profile
          )
        );
      }
    } catch (error) {
      console.error('Error updating portfolio profile:', error);
      
      // If profile not found and we haven't retried yet, wait a bit and try again
      if (error.message.includes('Portfolio profile not found') && retryCount < 2) {
        console.log(`Profile not found, retrying in 1 second... (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return updatePortfolioProfile(profileId, updates, retryCount + 1);
      }
      
      // If profile not found after retries, refresh profiles and clear currentProfileId
      if (error.message.includes('Portfolio profile not found')) {
        console.log('Profile not found after retries, refreshing profiles...');
        try {
          const profilesResponse = await authAPI.getPortfolioProfiles();
          if (profilesResponse.profiles) {
            setPortfolioProfiles(profilesResponse.profiles);
            // Clear currentProfileId if the profile doesn't exist
            setCurrentProfileId(null);
            throw new Error('Profile not found. Please select a different profile or create a new one.');
          }
        } catch (refreshError) {
          console.error('Error refreshing profiles:', refreshError);
        }
      }
      
      throw error;
    }
  };

  const deletePortfolioProfile = async (profileId) => {
    try {
      console.log('ProfileContext: Deleting portfolio profile with ID:', profileId);
      console.log('ProfileContext: Current profiles:', portfolioProfiles);
      
      if (authAPI.isAuthenticated()) {
        console.log('ProfileContext: Making API call to delete profile');
        const response = await authAPI.deletePortfolioProfile(profileId);
        console.log('ProfileContext: API response:', response);
        
        if (response.success) {
          setPortfolioProfiles(prev => prev.filter(profile => profile.id !== profileId));
          
          // If deleted profile was current, switch to default
          if (currentProfileId === profileId) {
            const remainingProfiles = portfolioProfiles.filter(profile => profile.id !== profileId);
            const defaultProfile = remainingProfiles.find(p => p.isDefault) || remainingProfiles[0];
            if (defaultProfile) {
              setCurrentProfileId(defaultProfile.id);
              setPortfolioData(defaultProfile.portfolioData);
            }
          }
        }
      } else {
        console.log('ProfileContext: Not authenticated, updating local state only');
        // Update local state
        setPortfolioProfiles(prev => prev.filter(profile => profile.id !== profileId));
        
        // If deleted profile was current, switch to default
        if (currentProfileId === profileId) {
          const remainingProfiles = portfolioProfiles.filter(profile => profile.id !== profileId);
          const defaultProfile = remainingProfiles.find(p => p.isDefault) || remainingProfiles[0];
          if (defaultProfile) {
            setCurrentProfileId(defaultProfile.id);
            setPortfolioData(defaultProfile.portfolioData);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting portfolio profile:', error);
      throw error;
    }
  };

  const switchToPortfolioProfile = (profileId) => {
    const profile = portfolioProfiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfileId(profileId);
      setPortfolioData(profile.portfolioData);
    }
  };

  const setDefaultPortfolioProfile = async (profileId) => {
    try {
      if (authAPI.isAuthenticated()) {
        const response = await authAPI.setDefaultPortfolioProfile(profileId);
        if (response.success) {
          setPortfolioProfiles(prev => 
            prev.map(profile => ({
              ...profile,
              isDefault: profile.id === profileId
            }))
          );
        }
      } else {
        // Update local state
        setPortfolioProfiles(prev => 
          prev.map(profile => ({
            ...profile,
            isDefault: profile.id === profileId
          }))
        );
      }
    } catch (error) {
      console.error('Error setting default portfolio profile:', error);
      throw error;
    }
  };

  const refreshPortfolioProfiles = async () => {
    if (authAPI.isAuthenticated()) {
      try {
        const response = await authAPI.getPortfolioProfiles();
        if (response.profiles) {
          setPortfolioProfiles(response.profiles);
          
          // Check if currentProfileId still exists
          const currentProfile = response.profiles.find(p => p.id === currentProfileId);
          if (!currentProfile) {
            // If current profile doesn't exist, set to default or first profile
            const defaultProfile = response.profiles.find(p => p.isDefault) || response.profiles[0];
            setCurrentProfileId(defaultProfile ? defaultProfile.id : null);
          }
        }
      } catch (error) {
        console.error('Error refreshing portfolio profiles:', error);
      }
    }
  };

  const value = {
    profileData,
    appearanceData,
    portfolioData,
    portfolioProfiles,
    currentProfileId,
    analyticsData,
    isLoading,
    updateProfile,
    updateSocialLink,
    updateAppearance,
    saveProfile,
    resetProfile,
    resetAppearance,
    getThemeStyles,
    getFontFamily,
    getButtonStyles,
    addCustomLink,
    updateCustomLink,
    deleteCustomLink,
    reorderCustomLinks,
    trackLinkClick,
    loadProfileFromBackend,
    loadAnalytics,
    // Portfolio functions
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
    // Portfolio Profile Management
    createPortfolioProfile,
    updatePortfolioProfile,
    deletePortfolioProfile,
    switchToPortfolioProfile,
    setDefaultPortfolioProfile,
    refreshPortfolioProfiles
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;

