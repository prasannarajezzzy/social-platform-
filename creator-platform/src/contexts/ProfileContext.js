import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load profile data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedAppearance = localStorage.getItem('userAppearance');
    
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
    
    if (savedAppearance) {
      try {
        setAppearanceData(JSON.parse(savedAppearance));
      } catch (error) {
        console.error('Error loading appearance data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
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

  const addCustomLink = (link) => {
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
  };

  const updateCustomLink = (linkId, updates) => {
    setProfileData(prev => ({
      ...prev,
      customLinks: prev.customLinks.map(link => 
        link.id === linkId ? { ...link, ...updates } : link
      )
    }));
  };

  const deleteCustomLink = (linkId) => {
    setProfileData(prev => ({
      ...prev,
      customLinks: prev.customLinks.filter(link => link.id !== linkId)
    }));
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

  const updateAppearance = (updates) => {
    setAppearanceData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would save to your backend API
      // await profileAPI.saveProfile({ profileData, appearanceData });
      
      // For now, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile saved successfully');
      return { success: true };
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
    reorderCustomLinks
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
