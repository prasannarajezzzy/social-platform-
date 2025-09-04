import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeClasses = {
    small: { spinner: '20px', font: '14px' },
    medium: { spinner: '40px', font: '18px' },
    large: { spinner: '60px', font: '24px' }
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="loading-container">
      <div className="loading-spinner" style={{
        width: currentSize.spinner,
        height: currentSize.spinner
      }}></div>
      <div className="loading-message" style={{
        fontSize: currentSize.font
      }}>
        {message}
      </div>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        .loading-message {
          color: #6b7280;
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
