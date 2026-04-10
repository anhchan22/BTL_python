import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';
import NeuButton from '../components/NeuButton';
import { translations } from '../utils/vietnamese-translations';

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
        <h1 style={titleStyle}>Tạo Tài Khoản</h1>

        {/* Info Alert - TENANT Role */}
        <div style={infoBoxStyle}>
          <p style={infoBoxTextStyle}>
            Các tài khoản mới được tạo dưới dạng <strong>Người thuê</strong>.
            Liên hệ với quản trị viên để trở thành Quản trị viên.
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
            <legend style={legendStyle}>THÔNG TIN BẮT BUỘC</legend>

            <FormField
              label={translations.username}
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập của bạn"
              required
              error={errors.username ? errors.username[0] : ''}
            />

            <FormField
              label={translations.email}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email của bạn"
              required
              error={errors.email ? errors.email[0] : ''}
            />

            <FormField
              label={translations.password}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu của bạn"
              required
              error={errors.password ? errors.password[0] : ''}
            />

            <FormField
              label={translations.confirmNewPassword}
              name="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu của bạn"
              required
              error={errors.password_confirm ? errors.password_confirm[0] : ''}
            />
          </fieldset>

          {/* Optional Fields Section */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>THÔNG TIN TÙY CHỌN</legend>

            <FormField
              label={translations.firstName}
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
            />

            <FormField
              label={translations.lastName}
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Nhập họ của bạn"
            />

            <FormField
              label={translations.phone}
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
            />

            <FormField
              label={translations.companyName}
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Nhập tên công ty (tùy chọn)"
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
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </NeuButton>
        </form>

        {/* Link to Login */}
        <p style={footerStyle}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={linkStyle}>
            Đăng nhập ở đây
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}