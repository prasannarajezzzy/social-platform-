import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('idle'); // 'idle', 'checking', 'available', 'taken'
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { updateProfile } = useProfile();
  
  // Redirect if already authenticated
  useAuthRedirect();

  // Mock list of taken usernames (in real app, this would be an API call)
  const takenUsernames = ['admin', 'user', 'test', 'demo', 'api', 'www', 'app', 'mobile', 'web', 'support', 'help', 'blog', 'news', 'about', 'contact', 'privacy', 'terms', 'login', 'register', 'signup', 'signin', 'profile', 'settings', 'dashboard', 'home', 'index'];

  // Username availability checker
  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) {
      return { available: false, message: '' };
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if username is taken
    const isTaken = takenUsernames.includes(username.toLowerCase());
    
    return {
      available: !isTaken,
      message: isTaken ? 'Username is already taken' : 'Username is available'
    };
  }, []);

  // Debounced username check
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.username && formData.username.length >= 3) {
        setIsCheckingUsername(true);
        setUsernameStatus('checking');
        
        try {
          const result = await checkUsernameAvailability(formData.username);
          setUsernameStatus(result.available ? 'available' : 'taken');
          
          if (!result.available) {
            setErrors(prev => ({
              ...prev,
              username: result.message
            }));
          } else {
            setErrors(prev => ({
              ...prev,
              username: ''
            }));
          }
        } catch (error) {
          setUsernameStatus('idle');
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameStatus('idle');
        setIsCheckingUsername(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.username, checkUsernameAvailability]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // Format username: lowercase, alphanumeric and underscores only
    if (name === 'username') {
      processedValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    } else if (!/^[a-z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain lowercase letters, numbers, and underscores';
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'Username is already taken';
    } else if (usernameStatus !== 'available') {
      newErrors.username = 'Please wait for username availability check';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      await signup(formData);
      
      // Set the username in the profile context
      await updateProfile({
        username: formData.username,
        title: `${formData.firstName} ${formData.lastName}`.trim()
      });
      
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-content">
          <div className="register-visual-section">
            <div className="visual-content">
              <h2 className="visual-title">Start Your Creator Journey</h2>
              <p className="visual-description">
                Join over 10,000 creators who are building their brand and growing their business with Pivota.
              </p>
              <div className="visual-stats">
                <div className="stat">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Creators</div>
                </div>
                <div className="stat">
                  <div className="stat-number">$2M+</div>
                  <div className="stat-label">Revenue Generated</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Countries</div>
                </div>
              </div>
            </div>
          </div>

          <div className="register-form-section">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">Create Your Account</h1>
                <p className="form-subtitle">
                  Start building your creator platform today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                {errors.general && (
                  <div className="error-banner">
                    {errors.general}
                  </div>
                )}

                <div className="name-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                        placeholder="First name"
                      />
                    </div>
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                        placeholder="Last name"
                      />
                    </div>
                    {errors.lastName && (
                      <span className="error-message">{errors.lastName}</span>
                    )}
                  </div>
                </div>

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
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={20} />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`form-input ${errors.username ? 'error' : usernameStatus === 'available' ? 'success' : ''}`}
                      placeholder="Choose a username"
                      maxLength={20}
                    />
                    <div className="username-status">
                      {isCheckingUsername && (
                        <Loader className="status-icon checking" size={20} />
                      )}
                      {usernameStatus === 'available' && !isCheckingUsername && (
                        <CheckCircle className="status-icon available" size={20} />
                      )}
                      {usernameStatus === 'taken' && !isCheckingUsername && (
                        <XCircle className="status-icon taken" size={20} />
                      )}
                    </div>
                  </div>
                  <div className="username-help">
                    Your profile will be available at: yoursite.com/u/{formData.username || 'username'}
                  </div>
                  {usernameStatus === 'available' && !errors.username && (
                    <span className="success-message">✓ Username is available</span>
                  )}
                  {errors.username && (
                    <span className="error-message">{errors.username}</span>
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
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className={`strength-fill strength-${passwordStrength.strength}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`strength-label strength-${passwordStrength.strength}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className={errors.agreeToTerms ? 'error' : ''}
                    />
                    <span className="checkbox-text">
                      I agree to the {' '}
                      <Link to="/terms" className="terms-link">Terms of Service</Link>
                      {' '} and {' '}
                      <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <span className="error-message">{errors.agreeToTerms}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary submit-btn ${isLoading ? 'loading' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <div className="form-divider">
                  <span>or sign up with</span>
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

                <p className="login-prompt">
                  Already have an account? {' '}
                  <Link to="/login" className="login-link">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background: var(--light-gray);
        }

        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .register-content {
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(44, 44, 44, 0.1);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
        }

        .register-visual-section {
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

        .visual-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .register-form-section {
          padding: 60px 50px;
          overflow-y: auto;
          max-height: 100vh;
        }

        .form-container {
          max-width: 450px;
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

        .register-form {
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

        .name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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

        .form-input.success {
          border-color: var(--soft-teal);
          box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
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

        .password-strength {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .strength-fill.strength-1 { background: var(--vibrant-coral); }
        .strength-fill.strength-2 { background: var(--sunset-orange); }
        .strength-fill.strength-3 { background: var(--muted-gold); }
        .strength-fill.strength-4 { background: var(--soft-teal); }
        .strength-fill.strength-5 { background: var(--electric-blue); }

        .strength-label {
          font-size: 12px;
          font-weight: 500;
          min-width: 70px;
        }

        .strength-label.strength-1 { color: var(--vibrant-coral); }
        .strength-label.strength-2 { color: var(--sunset-orange); }
        .strength-label.strength-3 { color: var(--muted-gold); }
        .strength-label.strength-4 { color: var(--soft-teal); }
        .strength-label.strength-5 { color: var(--electric-blue); }

        .error-message {
          color: var(--vibrant-coral);
          font-size: 14px;
          margin-top: 4px;
          display: block;
        }

        .success-message {
          color: var(--soft-teal);
          font-size: 14px;
          margin-top: 4px;
          display: block;
          font-weight: 500;
        }

        .username-status {
          position: absolute;
          right: 12px;
          display: flex;
          align-items: center;
        }

        .status-icon {
          padding: 4px;
        }

        .status-icon.checking {
          color: #6b7280;
          animation: spin 1s linear infinite;
        }

        .status-icon.available {
          color: #10b981;
        }

        .status-icon.taken {
          color: #dc2626;
        }

        .username-help {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
          font-family: monospace;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          line-height: 1.5;
        }

        .checkbox-label input[type="checkbox"] {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .checkbox-text {
          color: #374151;
          font-size: 14px;
        }

        .terms-link {
          color: var(--electric-blue);
          text-decoration: none;
          font-weight: 500;
        }

        .terms-link:hover {
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

        .login-prompt {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        .login-link {
          color: var(--electric-blue);
          text-decoration: none;
          font-weight: 500;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .register-content {
            grid-template-columns: 1fr;
          }

          .register-visual-section {
            order: -1;
            padding: 40px 30px;
          }

          .register-form-section {
            padding: 40px 30px;
          }

          .visual-title {
            font-size: 2rem;
          }

          .visual-stats {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .name-row {
            grid-template-columns: 1fr;
          }

          .social-buttons {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .register-container {
            padding: 10px;
          }

          .register-form-section,
          .register-visual-section {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
