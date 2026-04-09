import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';
import NeuButton from '../components/NeuButton';

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
      <AuthCard>
        {/* Page Title */}
        <h1 className="
          text-3xl
          sm:text-4xl
          font-bold
          font-display
          text-center
          text-neu-fg
          mb-2
        ">
          Industrial Zone Rental System
        </h1>

        {/* Subtitle */}
        <p className="
          text-center
          text-neu-muted
          text-sm
          sm:text-base
          mb-6
        ">
          Login to your account
        </p>

        {/* Error Alert */}
        {error && (
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
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
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
            {loading ? 'Logging in...' : 'Login'}
          </NeuButton>
        </form>

        {/* Link to Register */}
        <p className="
          text-center
          text-neu-fg
          text-sm
          mt-6
        ">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="
              text-neu-accent
              font-medium
              hover:text-neu-accent-light
              transition-colors
              duration-300
              ease-out
            "
          >
            Register here
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
