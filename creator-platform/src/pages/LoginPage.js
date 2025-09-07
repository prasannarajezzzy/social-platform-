import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Redirect if already authenticated
  useAuthRedirect();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-section">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">Welcome Back</h1>
                <p className="form-subtitle">
                  Sign in to your Pivota account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                {errors.general && (
                  <div className="error-banner">
                    {errors.general}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary submit-btn ${isLoading ? 'loading' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <div className="form-divider">
                  <span>or continue with</span>
                </div>

                <div className="social-buttons">
                  <button type="button" className="btn btn-ghost social-btn">
                    <svg className="social-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button type="button" className="btn btn-ghost social-btn">
                    <svg className="social-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                </div>

                <p className="signup-prompt">
                  Don't have an account? {' '}
                  <Link to="/register" className="signup-link">
                    Sign up for free
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <div className="login-visual-section">
            <div className="visual-content">
              <h2 className="visual-title">Join the Creator Revolution</h2>
              <p className="visual-description">
                Over 10,000 creators trust Pivota to grow their business and connect with their audience.
              </p>
              <div className="visual-features">
                <div className="visual-feature">
                  <div className="feature-icon">✨</div>
                  <span>Beautiful Portfolios</span>
                </div>
                <div className="visual-feature">
                  <div className="feature-icon">🔗</div>
                  <span>Smart Link Management</span>
                </div>
                <div className="visual-feature">
                  <div className="feature-icon">💰</div>
                  <span>Monetize Your Content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: var(--light-gray);
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-content {
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(44, 44, 44, 0.1);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1000px;
          width: 100%;
        }

        .login-form-section {
          padding: 60px 50px;
        }

        .form-container {
          max-width: 400px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--dark-charcoal);
          margin-bottom: 8px;
        }

        .form-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
        }

        .error-banner {
          background: rgba(255, 107, 107, 0.1);
          color: var(--vibrant-coral);
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid var(--vibrant-coral);
          margin-bottom: 24px;
          font-size: 14px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #9ca3af;
          z-index: 1;
        }

        .form-input {
          padding-left: 44px;
        }

        .form-input.error {
          border-color: var(--vibrant-coral);
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #6b7280;
        }

        .error-message {
          color: var(--vibrant-coral);
          font-size: 14px;
          margin-top: 4px;
          display: block;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-text {
          color: #374151;
          font-size: 14px;
        }

        .forgot-link {
          color: var(--electric-blue);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 16px;
          padding: 14px;
        }

        .submit-btn.loading {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-divider {
          text-align: center;
          margin: 24px 0;
          position: relative;
          color: #9ca3af;
          font-size: 14px;
        }

        .form-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
          z-index: 0;
        }

        .form-divider span {
          background: white;
          padding: 0 16px;
          position: relative;
          z-index: 1;
        }

        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          font-size: 14px;
        }

        .social-icon {
          width: 20px;
          height: 20px;
        }

        .signup-prompt {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        .signup-link {
          color: var(--electric-blue);
          text-decoration: none;
          font-weight: 500;
        }

        .signup-link:hover {
          text-decoration: underline;
        }

        .login-visual-section {
          background: var(--primary-gradient);
          color: var(--white);
          padding: 60px 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visual-content {
          text-align: center;
        }

        .visual-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .visual-description {
          font-size: 1.125rem;
          margin-bottom: 40px;
          opacity: 0.9;
          line-height: 1.6;
        }

        .visual-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .visual-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.125rem;
        }

        .feature-icon {
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .login-content {
            grid-template-columns: 1fr;
          }

          .login-visual-section {
            order: -1;
            padding: 40px 30px;
          }

          .login-form-section {
            padding: 40px 30px;
          }

          .visual-title {
            font-size: 2rem;
          }

          .visual-features {
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
          }

          .social-buttons {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 10px;
          }

          .login-form-section,
          .login-visual-section {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
