import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';
import NeuButton from '../components/NeuButton';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
    company_name: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors(result.error);
    }
    setLoading(false);
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-background)',
    padding: '1rem 1rem 2rem 1rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    color: 'var(--color-foreground)',
    marginBottom: '1.5rem',
    fontFamily: '"Plus Jakarta Sans", sans-serif'
  };

  const infoBoxStyle = {
    backgroundColor: '#EFF6FF',
    borderLeft: '4px solid #3B82F6',
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '0.5rem'
  };

  const infoBoxTextStyle = {
    color: '#1E40AF',
    fontSize: '0.875rem',
    fontWeight: '500'
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
    gap: '1.25rem'
  };

  const fieldsetStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const legendStyle = {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--color-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
    display: 'block'
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
      <AuthCard size="lg">
        {/* Page Title */}
        <h1 style={titleStyle}>Create Account</h1>

        {/* Info Alert - TENANT Role */}
        <div style={infoBoxStyle}>
          <p style={infoBoxTextStyle}>
            New accounts are created as <strong>Tenant</strong>.
            Contact an administrator to become an Administrator.
          </p>
        </div>

        {/* Error Alert - Server Response */}
        {errors.detail && (
          <div style={errorBoxStyle}>
            <p style={errorBoxTextStyle}>{errors.detail}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Required Fields Section */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Required Information</legend>

            <FormField
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              error={errors.username ? errors.username[0] : ''}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              error={errors.email ? errors.email[0] : ''}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              error={errors.password ? errors.password[0] : ''}
            />

            <FormField
              label="Confirm Password"
              name="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              error={errors.password_confirm ? errors.password_confirm[0] : ''}
            />
          </fieldset>

          {/* Optional Fields Section */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Optional Information</legend>

            <FormField
              label="First Name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
            />

            <FormField
              label="Last Name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
            />

            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />

            <FormField
              label="Company Name"
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter your company name (optional)"
            />
          </fieldset>

          {/* Submit Button */}
          <NeuButton
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </NeuButton>
        </form>

        {/* Link to Login */}
        <p style={footerStyle}>
          Already have an account?{' '}
          <Link to="/login" style={linkStyle}>
            Login here
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}