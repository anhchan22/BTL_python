import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as userService from '../services/userService';
import DashboardCard from '../components/DashboardCard';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    company_name: user?.profile?.company_name || ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e, isPassword = false) => {
    const { name, value } = e.target;
    if (isPassword) {
      setPasswordData({ ...passwordData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await userService.updateUserProfile(formData);
    if (result.success) {
      showSnackbar('Profile updated successfully', 'success');
    } else {
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        showSnackbar(result.error, 'error');
      }
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validate passwords match
    if (passwordData.password !== passwordData.password_confirm) {
      setErrors({ password: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    const result = await userService.changePassword(
      passwordData.old_password,
      passwordData.password
    );

    if (result.success) {
      showSnackbar('Password changed successfully', 'success');
      setPasswordData({ old_password: '', password: '', password_confirm: '' });
    } else {
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        showSnackbar(result.error, 'error');
      }
    }
    setLoading(false);
  };

  // ===== STYLE DEFINITIONS =====

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: 'clamp(1rem, 2vw, 2rem)'
  };

  const maxWidthWrapperStyle = {
    maxWidth: '60rem',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const headerStyle = {
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: 'var(--color-muted)',
    marginBottom: '2rem'
  };

  const userInfoCardStyle = {
    padding: '1.5rem',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderLeft: '4px solid var(--color-accent)',
    borderRadius: 'var(--radius-base)',
    marginBottom: '2rem'
  };

  const userInfoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontSize: '0.95rem'
  };

  const userInfoLabelStyle = {
    fontWeight: '600',
    color: 'var(--color-muted)'
  };

  const userInfoValueStyle = {
    color: 'var(--color-foreground)',
    fontWeight: '500'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: 'var(--radius-base)',
    border: '1px solid var(--color-muted)',
    borderOpacity: '0.2',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.95rem',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out'
  };

  const disabledInputStyle = {
    ...inputStyle,
    opacity: 0.6,
    cursor: 'not-allowed',
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem'
  };

  const fieldWrapperStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const errorTextStyle = {
    fontSize: '0.75rem',
    color: '#EF4444',
    marginTop: '0.25rem',
    fontWeight: '500'
  };

  const buttonStyle = {
    padding: '0.875rem 1.5rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 300ms ease-out',
    fontFamily: '"DM Sans", sans-serif'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    boxShadow: 'var(--shadow-extruded)'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    boxShadow: 'var(--shadow-inset)'
  };

  const dividerStyle = {
    height: '1px',
    backgroundColor: 'var(--color-muted)',
    opacity: 0.2,
    margin: '0',
    border: 'none'
  };

  const snackbarStyle = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-extruded)',
    zIndex: 999,
    maxWidth: '400px',
    animation: 'slideUp 300ms ease-out'
  };

  const snackbarSuccessStyle = {
    ...snackbarStyle,
    backgroundColor: '#10B981',
    color: 'white',
    borderLeft: '4px solid #059669'
  };

  const snackbarErrorStyle = {
    ...snackbarStyle,
    backgroundColor: '#EF4444',
    color: 'white',
    borderLeft: '4px solid #DC2626'
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>👤 My Profile</h1>
          <p style={subtitleStyle}>Manage your account information and security</p>
        </div>

        {/* User Info Card */}
        <div style={userInfoCardStyle}>
          <div style={userInfoRowStyle}>
            <span style={userInfoLabelStyle}>Username</span>
            <span style={userInfoValueStyle}>{user?.username}</span>
          </div>
          <div style={userInfoRowStyle}>
            <span style={userInfoLabelStyle}>Role</span>
            <span style={userInfoValueStyle}>{user?.profile?.role === 'ADMIN' ? '👑 Admin' : '👤 Tenant'}</span>
          </div>
        </div>

        {/* Account Information Card */}
        <DashboardCard title="Account Information" icon="ℹ️">
          <form style={formStyle} onSubmit={handleSaveProfile}>
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                style={{ ...inputStyle, borderColor: errors.first_name ? '#EF4444' : 'var(--color-muted)' }}
              />
              {errors.first_name && <div style={errorTextStyle}>{errors.first_name}</div>}
            </div>

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                style={{ ...inputStyle, borderColor: errors.last_name ? '#EF4444' : 'var(--color-muted)' }}
              />
              {errors.last_name && <div style={errorTextStyle}>{errors.last_name}</div>}
            </div>

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                style={disabledInputStyle}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                Email cannot be changed
              </div>
            </div>

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                style={{ ...inputStyle, borderColor: errors.phone ? '#EF4444' : 'var(--color-muted)' }}
              />
              {errors.phone && <div style={errorTextStyle}>{errors.phone}</div>}
            </div>

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Your Company Inc."
                style={{ ...inputStyle, borderColor: errors.company_name ? '#EF4444' : 'var(--color-muted)' }}
              />
              {errors.company_name && <div style={errorTextStyle}>{errors.company_name}</div>}
            </div>

            <button
              type="submit"
              style={primaryButtonStyle}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--color-accent-light)';
                  e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-accent)';
                e.target.style.boxShadow = 'var(--shadow-extruded)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {loading ? '⏳ Saving...' : '✓ Save Profile'}
            </button>
          </form>
        </DashboardCard>

        {/* Divider */}
        <div style={dividerStyle}></div>

        {/* Password Change Card */}
        <DashboardCard title="Change Password" icon="🔐">
          <form style={formStyle} onSubmit={handleChangePassword}>
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                name="old_password"
                value={passwordData.old_password}
                onChange={(e) => handleChange(e, true)}
                placeholder="••••••••"
                style={{ ...inputStyle, borderColor: errors.old_password ? '#EF4444' : 'var(--color-muted)' }}
              />
              {errors.old_password && <div style={errorTextStyle}>{errors.old_password}</div>}
            </div>

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                name="password"
                value={passwordData.password}
                onChange={(e) => handleChange(e, true)}
                placeholder="••••••••"
                style={{ ...inputStyle, borderColor: errors.password ? '#EF4444' : 'var(--color-muted)' }}
              />
              {errors.password && <div style={errorTextStyle}>{errors.password}</div>}
            </div>

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                name="password_confirm"
                value={passwordData.password_confirm}
                onChange={(e) => handleChange(e, true)}
                placeholder="••••••••"
                style={{ ...inputStyle, borderColor: errors.password_confirm ? '#EF4444' : 'var(--color-muted)' }}
              />
              {errors.password_confirm && <div style={errorTextStyle}>{errors.password_confirm}</div>}
            </div>

            <button
              type="submit"
              style={secondaryButtonStyle}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.boxShadow = 'var(--shadow-inset-deep)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'var(--shadow-inset)';
              }}
            >
              {loading ? '⏳ Updating...' : '🔄 Change Password'}
            </button>
          </form>
        </DashboardCard>
      </div>

      {/* Snackbar Notification */}
      {snackbar.open && (
        <div style={snackbar.severity === 'success' ? snackbarSuccessStyle : snackbarErrorStyle}>
          {snackbar.severity === 'success' ? '✓' : '✕'} {snackbar.message}
        </div>
      )}
    </div>
  );
}
