import React from 'react';

export default function Loading({ message = 'Loading...' }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    gap: '1.5rem'
  };

  const spinnerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: 'rgba(108, 99, 255, 0.2)',
    borderTopColor: 'var(--color-accent)',
    borderRightColor: 'var(--color-accent)',
    animation: 'spin 1s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite',
    willChange: 'transform'
  };

  const textStyle = {
    fontSize: '1rem',
    color: 'var(--color-muted)',
    fontWeight: '500',
    textAlign: 'center'
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={containerStyle}>
        <div style={spinnerContainerStyle}>
          <div style={spinnerStyle}></div>
        </div>
        <p style={textStyle}>{message}</p>
      </div>
    </>
  );
}
