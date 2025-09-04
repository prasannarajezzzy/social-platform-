import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const authLinks = isAuthenticated 
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { onClick: handleLogout, label: 'Logout', icon: LogOut }
      ]
    : [
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Sign Up' }
      ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-text">CreatorHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-auth desktop-nav">
            {authLinks.map((link, index) => (
              link.onClick ? (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="btn btn-ghost nav-auth-btn"
                >
                  {link.icon && <link.icon size={18} />}
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`btn ${index === authLinks.length - 1 ? 'btn-primary' : 'btn-ghost'} nav-auth-btn`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isOpen ? 'mobile-nav-open' : ''}`}>
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {authLinks.map((link, index) => (
              link.onClick ? (
                <button
                  key={index}
                  onClick={() => {
                    link.onClick();
                    setIsOpen(false);
                  }}
                  className="mobile-nav-link mobile-nav-btn"
                >
                  {link.icon && <link.icon size={18} />}
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="mobile-nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
        }

        .nav-logo {
          text-decoration: none;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-link {
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #667eea;
        }

        .nav-link.active {
          color: #667eea;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 2px;
          background: #667eea;
          border-radius: 1px;
        }

        .nav-auth {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .nav-auth-btn {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }

        .mobile-nav {
          display: none;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .mobile-nav-open {
          display: block;
        }

        .mobile-nav-links {
          padding: 20px 0;
          border-top: 1px solid #e5e7eb;
        }

        .mobile-nav-link {
          display: block;
          padding: 12px 0;
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-nav-link:hover {
          color: #667eea;
        }

        .mobile-nav-link.active {
          color: #667eea;
        }

        .mobile-nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
        }

        .desktop-nav {
          display: flex;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-nav {
            display: block;
            max-height: 0;
          }

          .mobile-nav-open {
            max-height: 400px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
