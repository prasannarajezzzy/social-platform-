import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Github, 
  Facebook, 
  Globe,
  Music,
  ExternalLink,
  Heart,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

const PublicProfile = () => {
  const { username } = useParams();
  const { profileData, appearanceData, getThemeStyles, getFontFamily, getButtonStyles } = useProfile();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const themeStyles = getThemeStyles();
  const fontFamily = getFontFamily();
  const buttonStyles = getButtonStyles();

  // Mock links data - in a real app, this would come from the backend
  const links = [
    { id: 1, title: 'My YouTube Channel', url: 'https://youtube.com/@creator', icon: Youtube, clicks: 1234 },
    { id: 2, title: 'Instagram Profile', url: 'https://instagram.com/creator', icon: Instagram, clicks: 892 },
    { id: 3, title: 'Latest Blog Post', url: 'https://blog.creator.com/latest', icon: ExternalLink, clicks: 567 },
    { id: 4, title: 'Support My Work', url: 'https://patreon.com/creator', icon: Heart, clicks: 345 },
    { id: 5, title: 'Portfolio Website', url: 'https://creator.com', icon: Globe, clicks: 234 }
  ];

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
    return icons[platform] || Globe;
  };

  const handleLinkClick = (link) => {
    // Track click analytics
    console.log(`Link clicked: ${link.title}`);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: profileData.title || 'Check out this profile',
        text: profileData.bio || 'Amazing content creator',
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    setShowShareMenu(false);
  };

  const renderLinks = () => {
    const layoutClass = `links-container ${appearanceData.buttonLayout}`;
    
    return (
      <div className={layoutClass}>
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <button
              key={link.id}
              className="profile-link"
              onClick={() => handleLinkClick(link)}
              style={{
                background: themeStyles.primaryColor,
                color: 'white',
                ...buttonStyles
              }}
            >
              <div className="link-content">
                <IconComponent size={20} />
                <span className="link-title">{link.title}</span>
                <ExternalLink size={16} className="link-external" />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderSocialLinks = () => {
    const activeSocialLinks = Object.entries(profileData.socialLinks)
      .filter(([_, value]) => value);

    if (activeSocialLinks.length === 0) return null;

    return (
      <div className="social-links">
        {activeSocialLinks.map(([platform, value]) => {
          const IconComponent = getSocialIcon(platform);
          const url = platform === 'website' ? value : `https://${platform}.com/${value}`;
          
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              style={{ color: themeStyles.primaryColor }}
            >
              <IconComponent size={24} />
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className="public-profile"
      style={{ 
        background: themeStyles.background,
        fontFamily: fontFamily,
        minHeight: '100vh'
      }}
    >
      <div className="profile-container">
        <div className="profile-header">
          {profileData.profileImageUrl && (
            <div className="profile-image-container">
              <img 
                src={profileData.profileImageUrl} 
                alt="Profile" 
                className="profile-image"
              />
            </div>
          )}
          
          {profileData.title && (
            <h1 
              className="profile-title"
              style={{ color: themeStyles.primaryColor }}
            >
              {profileData.title}
            </h1>
          )}
          
          {profileData.bio && (
            <p className="profile-bio">{profileData.bio}</p>
          )}
          
          {renderSocialLinks()}
          
          <div className="profile-actions">
            <button 
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={() => setIsFollowing(!isFollowing)}
              style={{
                background: isFollowing ? themeStyles.secondaryColor : themeStyles.primaryColor,
                color: isFollowing ? themeStyles.primaryColor : 'white',
                border: `2px solid ${themeStyles.primaryColor}`,
                ...buttonStyles
              }}
            >
              <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            
            <div className="share-container">
              <button 
                className="share-btn"
                onClick={handleShare}
                style={{
                  background: themeStyles.secondaryColor,
                  color: themeStyles.primaryColor,
                  border: `2px solid ${themeStyles.primaryColor}`,
                  ...buttonStyles
                }}
              >
                <Share2 size={16} />
                Share
              </button>
              
              {showShareMenu && (
                <div className="share-menu">
                  <button onClick={copyToClipboard}>Copy Link</button>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(profileData.title || 'Check out this profile')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on Twitter
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on Facebook
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-content">
          {renderLinks()}
        </div>
      </div>

      {/* Apply custom CSS if provided */}
      {appearanceData.customCSS && (
        <style>{appearanceData.customCSS}</style>
      )}

      <style jsx>{`
        .public-profile {
          min-height: 100vh;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .profile-container {
          max-width: 600px;
          width: 100%;
          margin-top: 40px;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .profile-image-container {
          margin-bottom: 24px;
        }

        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .profile-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .profile-bio {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 24px;
          opacity: 0.8;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .social-link {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid currentColor;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .social-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.2);
        }

        .profile-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .follow-btn,
        .share-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .follow-btn:hover,
        .share-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .share-container {
          position: relative;
        }

        .share-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          padding: 8px 0;
          min-width: 160px;
          z-index: 10;
          margin-top: 8px;
        }

        .share-menu button,
        .share-menu a {
          display: block;
          width: 100%;
          padding: 8px 16px;
          text-align: left;
          background: none;
          border: none;
          color: #374151;
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .share-menu button:hover,
        .share-menu a:hover {
          background: #f3f4f6;
        }

        .links-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .links-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .links-container.carousel {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          gap: 16px;
          padding-bottom: 16px;
        }

        .links-container.carousel .profile-link {
          min-width: 280px;
          flex-shrink: 0;
        }

        .profile-link {
          width: 100%;
          padding: 20px 24px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .profile-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 35px rgba(0, 0, 0, 0.15);
        }

        .link-content {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .link-title {
          flex: 1;
          text-align: left;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .link-external {
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .public-profile {
            padding: 16px;
          }

          .profile-container {
            margin-top: 20px;
          }

          .profile-title {
            font-size: 1.75rem;
          }

          .profile-bio {
            font-size: 1rem;
          }

          .profile-actions {
            flex-direction: column;
            align-items: center;
          }

          .follow-btn,
          .share-btn {
            width: 100%;
            max-width: 200px;
            justify-content: center;
          }

          .links-container.grid {
            grid-template-columns: 1fr;
          }

          .links-container.carousel {
            flex-direction: column;
            overflow-x: visible;
          }

          .links-container.carousel .profile-link {
            min-width: auto;
          }

          .social-links {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .profile-image {
            width: 100px;
            height: 100px;
          }

          .profile-title {
            font-size: 1.5rem;
          }

          .social-link {
            width: 44px;
            height: 44px;
          }

          .link-content {
            gap: 8px;
          }

          .link-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicProfile;
