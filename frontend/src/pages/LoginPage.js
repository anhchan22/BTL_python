import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';
import NeuButton from '../components/NeuButton';
import { translations } from '../utils/vietnamese-translations';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-background)',
    padding: '1rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem',
    fontFamily: '"Plus Jakarta Sans", sans-serif'
  };

  const subtitleStyle = {
    textAlign: 'center',
    color: 'var(--color-muted)',
    fontSize: '0.875rem',
    marginBottom: '1.5rem'
  };

  const errorBoxStyle = {
    backgroundColor: '#FEE2E2',
    borderLeft: '4px solid #EF4444',
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '0.5rem'
  };

  const errorBoxTextStyle = {
    color: '#7F1D1D',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const footerStyle = {
    textAlign: 'center',
    color: 'var(--color-foreground)',
    fontSize: '0.875rem',
    marginTop: '1.5rem'
  };

  const linkStyle = {
    color: 'var(--color-accent)',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 300ms ease-out',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <AuthCard size="sm">
        {/* Page Title */}
        <h1 style={titleStyle}>{translations.loginTitle}</h1>

        {/* Subtitle */}
        <p style={subtitleStyle}>{translations.loginSubtitle}</p>

        {/* Error Alert */}
        {error && (
          <div style={errorBoxStyle}>
            <p style={errorBoxTextStyle}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <FormField
            label={translations.username}
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder={translations.enterUsername}
            required
          />

          <FormField
            label={translations.password}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={translations.enterPassword}
            required
          />

          {/* Submit Button */}
          <NeuButton
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? translations.loggingIn : translations.login}
          </NeuButton>
        </form>

        {/* Link to Register */}
        <p style={footerStyle}>
          {translations.dontHaveAccount}{' '}
          <Link to="/register" style={linkStyle}>
            {translations.registerHere}
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}