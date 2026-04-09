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

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-neu-bg
      px-4
      py-8
    ">
      <AuthCard size="lg">
        {/* Page Title */}
        <h1 className="
          text-3xl
          sm:text-4xl
          font-bold
          font-display
          text-center
          text-neu-fg
          mb-6
        ">
          Create Account
        </h1>

        {/* Info Alert - TENANT Role */}
        <div className="
          bg-blue-50
          border-l-4
          border-blue-500
          p-4
          mb-6
          rounded-lg
        ">
          <p className="
            text-blue-700
            text-sm
            font-medium
          ">
            New accounts are created as <strong>Tenant</strong>.
            Contact an administrator to become an Administrator.
          </p>
        </div>

        {/* Error Alert - Server Response */}
        {errors.detail && (
          <div className="
            bg-red-50
            border-l-4
            border-red-500
            p-4
            mb-6
            rounded-lg
          ">
            <p className="
              text-red-700
              text-sm
              font-medium
            ">
              {errors.detail}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Required Fields Section */}
          <fieldset className="space-y-4">
            <legend className="
              text-xs
              font-semibold
              text-neu-muted
              uppercase
              tracking-wider
              mb-3
              block
            ">
              Required Information
            </legend>

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
          <fieldset className="space-y-4">
            <legend className="
              text-xs
              font-semibold
              text-neu-muted
              uppercase
              tracking-wider
              mb-3
              mt-6
              block
            ">
              Optional Information
            </legend>

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
            className="mt-6"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </NeuButton>
        </form>

        {/* Link to Login */}
        <p className="
          text-center
          text-neu-fg
          text-sm
          mt-6
        ">
          Already have an account?{' '}
          <Link
            to="/login"
            className="
              text-neu-accent
              font-medium
              hover:text-neu-accent-light
              transition-colors
              duration-300
              ease-out
            "
          >
            Login here
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
