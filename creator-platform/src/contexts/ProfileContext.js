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
        // Prepare profile data for backend (exclude File objects)
        const backendProfileData = {
          ...profileData,
          profileImage: undefined // Remove File object, keep only profileImageUrl
        };
        
        // Save to backend API
        const response = await authAPI.saveProfile(backendProfileData, appearanceData);
        if (response.success) {
          console.log('Profile saved successfully to backend');
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

  const value = {
    profileData,
    appearanceData,
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
    loadAnalytics
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;

