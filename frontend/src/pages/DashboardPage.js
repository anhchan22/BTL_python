import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { contractService } from '../services/contractService';
import DashboardCard from '../components/DashboardCard';
import StatBox from '../components/StatBox';
import NeuNavButton from '../components/NeuNavButton';
import NeuButton from '../components/NeuButton';

export default function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeContracts, setActiveContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActiveContracts();
  }, []);

  const loadActiveContracts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await contractService.getMyActiveContracts();
      // Handle both paginated and non-paginated responses
      const contractList = Array.isArray(data) ? data : (data.results || []);
      setActiveContracts(contractList);
    } catch (err) {
      console.error('Failed to load contracts:', err);
      setError('Failed to load active contracts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="
      min-h-screen
      bg-neu-bg
      px-4
      py-8
      sm:px-6
      lg:px-8
    ">
      <div className="
        max-w-7xl
        mx-auto
      ">
        {/* ===== HEADER SECTION ===== */}
        <div className="mb-8">
          {/* Welcome Title */}
          <div className="mb-6">
            <h1 className="
              text-4xl
              sm:text-5xl
              font-bold
              font-display
              text-neu-fg
              mb-2
            ">
              Welcome, {user?.username}! 👋
            </h1>
            <p className="
              text-neu-muted
              text-base
              sm:text-lg
            ">
              {isAdmin() ? '🔧 Admin Dashboard' : '👤 Tenant Dashboard'}
            </p>
          </div>

          {/* User Info Cards - Responsive Grid */}
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            sm:gap-6
          ">
            {/* Role Stat */}
            <StatBox
              value={user?.profile?.role || 'N/A'}
              label="Role"
              variant="info"
              icon="👤"
            />

            {/* Active Contracts Stat */}
            <StatBox
              value={activeContracts.length}
              label="Active Contracts"
              variant="success"
              icon="📄"
            />

            {/* Company Stat (if available) */}
            {user?.profile?.company_name && (
              <StatBox
                value={user.profile.company_name.substring(0, 15)}
                label="Company"
                variant="default"
                icon="🏢"
              />
            )}

            {/* Email Stat */}
            <StatBox
              value={user?.email?.substring(0, 10) + '...'}
              label="Contact"
              variant="default"
              icon="✉️"
            />
          </div>
        </div>

        {/* ===== ERROR STATE ===== */}
        {error && (
          <div className="
            mb-6
            p-4
            sm:p-6
            rounded-neu-base
            bg-red-50
            border-l-4
            border-red-500
          ">
            <p className="
              text-red-700
              text-sm
              sm:text-base
              font-medium
            ">
              {error}
            </p>
            <button
              onClick={loadActiveContracts}
              className="
                text-red-600
                hover:text-red-800
                text-sm
                font-semibold
                mt-2
                underline
              "
            >
              Try again
            </button>
          </div>
        )}

        {/* ===== QUICK ACTIONS SECTION ===== */}
        <DashboardCard
          title="Quick Actions"
          icon="⚡"
          className="mb-8"
        >
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
            sm:gap-6
            -m-6
            sm:-m-8
            p-6
            sm:p-8
            pt-0
          ">
            {/* View Industrial Zones Button */}
            <NeuNavButton
              label="Industrial Zones"
              icon="🏭"
              onClick={() => navigate('/zones')}
            />

            {/* Rental Requests Button */}
            <NeuNavButton
              label={isAdmin() ? 'Manage Requests' : 'My Requests'}
              icon="📋"
              onClick={() => navigate('/rental-requests')}
            />

            {/* View Contracts Button */}
            <NeuNavButton
              label="View Contracts"
              icon="📄"
              onClick={() => navigate('/contracts')}
            />

            {/* Admin-only: User Management */}
            {isAdmin() && (
              <NeuNavButton
                label="User Management"
                icon="👥"
                onClick={() => navigate('/admin/users')}
              />
            )}

            {/* Admin-only: Reports (placeholder) */}
            {isAdmin() && (
              <NeuNavButton
                label="Reports"
                icon="📊"
                onClick={() => {
                  alert('Reports feature coming soon!');
                }}
              />
            )}

            {/* Admin-only: Settings (placeholder) */}
            {isAdmin() && (
              <NeuNavButton
                label="Settings"
                icon="⚙️"
                onClick={() => {
                  alert('Settings feature coming soon!');
                }}
              />
            )}
          </div>
        </DashboardCard>

        {/* ===== ACTIVE CONTRACTS SECTION ===== */}
        {activeContracts.length > 0 && (
          <DashboardCard
            title="Active Contracts"
            icon="📋"
            action={
              <button
                onClick={() => navigate('/contracts')}
                className="
                  text-neu-accent
                  hover:text-neu-accent-light
                  font-semibold
                  text-sm
                  underline
                  transition-colors
                  duration-300
                "
              >
                View All →
              </button>
            }
            className="mb-8"
          >
            {/* Contract List */}
            <div className="space-y-3">
              {activeContracts.slice(0, 5).map((contract, index) => (
                <div
                  key={contract.id || index}
                  className="
                    p-4
                    rounded-neu-inner
                    bg-white
                    bg-opacity-30
                    hover:bg-opacity-50
                    transition-all
                    duration-300
                    ease-out
                    cursor-pointer
                    border-l-4
                    border-neu-accent-secondary
                  "
                  onClick={() => navigate(`/contracts/${contract.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="
                        font-semibold
                        text-neu-fg
                        text-base
                      ">
                        {contract.zone?.name || 'Contract'}
                      </h3>
                      <p className="
                        text-neu-muted
                        text-sm
                        mt-1
                      ">
                        ID: {contract.id}
                      </p>
                    </div>
                    <span className="
                      text-xs
                      font-bold
                      text-neu-accent-secondary
                      bg-neu-accent-secondary
                      bg-opacity-20
                      px-3
                      py-1
                      rounded-full
                    ">
                      ACTIVE
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more indicator */}
            {activeContracts.length > 5 && (
              <div className="
                text-center
                text-neu-muted
                text-sm
                mt-4
                pt-4
                border-t
                border-neu-muted
                border-opacity-20
              ">
                +{activeContracts.length - 5} more contract{activeContracts.length - 5 !== 1 ? 's' : ''}
              </div>
            )}
          </DashboardCard>
        )}

        {/* No Active Contracts State */}
        {!loading && activeContracts.length === 0 && (
          <DashboardCard
            title="Active Contracts"
            icon="📋"
            className="mb-8"
          >
            <div className="
              text-center
              py-8
              text-neu-muted
            ">
              <p className="text-base mb-4">
                You don't have any active contracts yet.
              </p>
              <button
                onClick={() => navigate('/rental-requests')}
                className="
                  text-neu-accent
                  hover:text-neu-accent-light
                  font-semibold
                  transition-colors
                  duration-300
                "
              >
                Create a Rental Request
              </button>
            </div>
          </DashboardCard>
        )}

        {/* ===== USER DETAILS SECTION (Optional) ===== */}
        <DashboardCard
          title="Profile Information"
          icon="👤"
          className="mb-8"
        >
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-6
          ">
            {/* Email */}
            <div>
              <label className="
                block
                text-xs
                font-semibold
                text-neu-muted
                uppercase
                tracking-wider
                mb-2
              ">
                Email
              </label>
              <p className="
                text-neu-fg
                font-medium
              ">
                {user?.email}
              </p>
            </div>

            {/* Phone */}
            {user?.profile?.phone && (
              <div>
                <label className="
                  block
                  text-xs
                  font-semibold
                  text-neu-muted
                  uppercase
                  tracking-wider
                  mb-2
                ">
                  Phone
                </label>
                <p className="
                  text-neu-fg
                  font-medium
                ">
                  {user.profile.phone}
                </p>
              </div>
            )}

            {/* Company Name */}
            {user?.profile?.company_name && (
              <div>
                <label className="
                  block
                  text-xs
                  font-semibold
                  text-neu-muted
                  uppercase
                  tracking-wider
                  mb-2
                ">
                  Company
                </label>
                <p className="
                  text-neu-fg
                  font-medium
                ">
                  {user.profile.company_name}
                </p>
              </div>
            )}

            {/* Role */}
            <div>
              <label className="
                block
                text-xs
                font-semibold
                text-neu-muted
                uppercase
                tracking-wider
                mb-2
              ">
                Role
              </label>
              <p className="
                text-neu-fg
                font-medium
                inline-block
                px-3
                py-1
                rounded-full
                bg-neu-accent-secondary
                bg-opacity-20
                text-neu-accent-secondary
                text-sm
              ">
                {user?.profile?.role}
              </p>
            </div>
          </div>
        </DashboardCard>

        {/* ===== LOGOUT SECTION ===== */}
        <div className="
          flex
          justify-end
          pt-4
        ">
          <NeuButton
            variant="secondary"
            size="medium"
            onClick={handleLogout}
          >
            Logout
          </NeuButton>
        </div>
      </div>
    </div>
  );
}

