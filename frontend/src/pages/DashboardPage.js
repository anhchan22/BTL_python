import React, { useEffect, useState } from 'react';
import { FileCheckCorner, User, UserRoundCheck, Mail, ArrowRight, Zap, Factory, Clipboard, FileText, Users, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { contractService } from '../services/contractService';
import DashboardCard from '../components/DashboardCard';
import StatBox from '../components/StatBox';
import NeuNavButton from '../components/NeuNavButton';
import NeuButton from '../components/NeuButton';
import { translations } from '../utils/vietnamese-translations';

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
      setError('Tải hợp đồng hoạt động thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ===== STYLE DEFINITIONS =====

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: 'clamp(1rem, 2vw, 2rem)',
    paddingRight: 'clamp(1rem, 2vw, 2rem)'
  };

  const maxWidthWrapperStyle = {
    maxWidth: '80rem',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const headerSectionStyle = {
    marginBottom: '2rem'
  };

  const welcomeTitleStyle = {
    fontSize: 'clamp(1.875rem, 5vw, 3rem)',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: 'var(--color-muted)',
    fontSize: 'clamp(1rem, 2vw, 1.125rem)'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
    marginTop: '1.5rem'
  };

  const errorBoxStyle = {
    marginBottom: '1.5rem',
    padding: 'clamp(1rem, 2vw, 1.5rem)',
    borderRadius: 'var(--radius-base)',
    backgroundColor: '#FEE2E2',
    borderLeft: '4px solid #EF4444'
  };

  const errorTextStyle = {
    color: '#7F1D1D',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const errorRetryButtonStyle = {
    color: '#DC2626',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginTop: '0.5rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 300ms ease-out',
    padding: 0
  };

  const quickActionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
    margin: 'clamp(-1.5rem, -4vw, -2rem)',
    marginTop: 0,
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    paddingTop: 0
  };

  const contractListStyle = {
    marginBottom: '2rem'
  };

  const contractItemStyle = (index) => ({
    padding: '1rem',
    borderRadius: 'var(--radius-inner)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transition: 'background-color 300ms ease-out',
    cursor: 'pointer',
    borderLeft: '4px solid var(--color-accent-secondary)',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
    }
  });

  const contractHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  };

  const contractTitleStyle = {
    fontWeight: '600',
    color: 'var(--color-foreground)',
    fontSize: '1rem'
  };

  const contractIdStyle = {
    color: 'var(--color-muted)',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  };

  const contractBadgeStyle = {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-accent-secondary)',
    backgroundColor: 'rgba(56, 178, 172, 0.2)',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px'
  };

  const moreContractsStyle = {
    textAlign: 'center',
    color: 'var(--color-muted)',
    fontSize: '0.875rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--color-muted)',
    borderTopOpacity: '0.2'
  };

  const noContractsStyle = {
    textAlign: 'center',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    color: 'var(--color-muted)'
  };

  const noContractsLinkStyle = {
    color: 'var(--color-accent)',
    fontWeight: '600',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 300ms ease-out',
    padding: 0
  };

  const profileGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'clamp(1.5rem, 3vw, 2rem)'
  };

  const profileFieldStyle = {
    flex: 1
  };

  const profileLabelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--color-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem'
  };

  const profileValueStyle = {
    color: 'var(--color-foreground)',
    fontWeight: '500'
  };

  const profileRoleBadgeStyle = {
    color: 'var(--color-accent-secondary)',
    backgroundColor: 'rgba(56, 178, 172, 0.2)',
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem'
  };

  const logoutContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '1rem'
  };

  const viewAllLinkStyle = {
    color: 'var(--color-accent)',
    fontWeight: '600',
    fontSize: '0.875rem',
    textDecoration: 'underline',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 300ms ease-out',
    padding: 0
  };

  // ===== HANDLERS =====

  const handleContractClick = (contractId) => {
    navigate(`/contracts/${contractId}`);
  };

  const handleRetryLoadContracts = () => {
    loadActiveContracts();
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* ===== HEADER SECTION ===== */}
        <div style={headerSectionStyle}>
          {/* Welcome Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={welcomeTitleStyle}>Chào mừng, {user?.username}! 👋</h1>
            <p style={subtitleStyle}>
              {isAdmin() ? translations.adminDashboard : translations.tenantDashboard}
            </p>
          </div>

          {/* User Info Cards - Responsive Grid */}
          <div style={statsGridStyle}>
            {/* Role Stat */}
            <StatBox
              value={user?.profile?.role || 'N/A'}
              label={translations.role}
              variant="info"
              icon={<UserRoundCheck size={24} strokeWidth={2}/>}
            />
            

            {/* Active Contracts Stat */}
            <StatBox
              value={activeContracts.length}
              label={translations.activeContracts}
              variant="success"
              icon={<FileCheckCorner size={24} strokeWidth={2} />}
            />

            {/* Company Stat (if available) */}
            {user?.profile?.company_name && (
              <StatBox
                value={user.profile.company_name.substring(0, 15)}
                label={translations.company}
                variant="default"
                icon="🏢"
              />
            )}

            {/* Email Stat */}
            <StatBox
              value={user?.email?.substring(0, 10) + '...'}
              label={translations.contact}
              variant="default"
              icon={<Mail size={24} strokeWidth={2} />}
            />
          </div>
        </div>

        {/* ===== ERROR STATE ===== */}
        {error && (
          <div style={errorBoxStyle}>
            <p style={errorTextStyle}>{error}</p>
            <button
              onClick={handleRetryLoadContracts}
              style={errorRetryButtonStyle}
            >
              {translations.tryAgain}
            </button>
          </div>
        )}

        {/* ===== QUICK ACTIONS SECTION ===== */}
        <DashboardCard title={translations.quickActions} icon={<Zap size={24} strokeWidth={2} />}>
          <div style={quickActionsGridStyle}>
            {/* View Industrial Zones Button */}
            <NeuNavButton
              label={translations.industrialZones}
              icon={<Factory size={24} strokeWidth={2} />}
              onClick={() => navigate('/zones')}
            />

            {/* Rental Requests Button */}
            <NeuNavButton
              label={isAdmin() ? translations.manageRequests : translations.myRequests}
              icon={<Clipboard size={24} strokeWidth={2} />}
              onClick={() => navigate('/rental-requests')}
            />

            {/* View Contracts Button */}
            <NeuNavButton
              label={translations.viewContracts}
              icon={<FileText size={24} strokeWidth={2} />}
              onClick={() => navigate('/contracts')}
            />

            {/* Admin-only: User Management */}
            {isAdmin() && (
              <NeuNavButton
                label={translations.userManagement}
                icon={<Users size={24} strokeWidth={2} />}
                onClick={() => navigate('/admin/users')}
              />
            )}

            {/* Admin-only: Reports (placeholder) */}
            {isAdmin() && (
              <NeuNavButton
                label={translations.reports}
                icon={<BarChart3 size={24} strokeWidth={2} />}
                onClick={() => {
                  alert(translations.reportsComingSoon);
                }}
              />
            )}

            {/* Admin-only: Settings (placeholder) */}
            {isAdmin() && (
              <NeuNavButton
                label={translations.settings}
                icon={<Settings size={24} strokeWidth={2} />}
                onClick={() => {
                  alert(translations.settingsComingSoon);
                }}
              />
            )}
          </div>
        </DashboardCard>

        {/* ===== ACTIVE CONTRACTS SECTION ===== */}
        {activeContracts.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <DashboardCard
              title={translations.activeContracts}
              icon={<Clipboard size={24} strokeWidth={2} />}
              action={
                <button
                  onClick={() => navigate('/contracts')}
                  style={viewAllLinkStyle}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--color-accent-light)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--color-accent)')}
                >
                  Xem tất cả <ArrowRight size={16} strokeWidth={2} style={{ marginLeft: '0.4rem', display: 'inline' }} />
                </button>
              }
            >
              {/* Contract List */}
              <div style={contractListStyle}>
                {activeContracts.slice(0, 5).map((contract, index) => (
                  <div
                    key={contract.id || index}
                    style={{
                      ...contractItemStyle(index),
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-inner)',
                      borderLeft: '4px solid var(--color-accent-secondary)',
                      marginBottom: index < 4 ? '0.75rem' : 0,
                      cursor: 'pointer',
                      transition: 'background-color 300ms ease-out'
                    }}
                    onClick={() => handleContractClick(contract.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    <div style={contractHeaderStyle}>
                      <div>
                        <h3 style={contractTitleStyle}>
                          {contract.zone?.name || 'Contract'}
                        </h3>
                        <p style={contractIdStyle}>ID: {contract.id}</p>
                      </div>
                      <span style={contractBadgeStyle}>ACTIVE</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show more indicator */}
              {activeContracts.length > 5 && (
                <div style={moreContractsStyle}>
                  +{activeContracts.length - 5} more contract
                  {activeContracts.length - 5 !== 1 ? 's' : ''}
                </div>
              )}
            </DashboardCard>
          </div>
        )}

        {/* No Active Contracts State */}
        {!loading && activeContracts.length === 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <DashboardCard title={translations.activeContracts} icon="📋">
              <div style={noContractsStyle}>
                <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                  {translations.noActiveContracts}
                </p>
                <button
                  onClick={() => navigate('/rental-requests')}
                  style={noContractsLinkStyle}
                  onMouseEnter={(e) =>
                    (e.target.style.color = 'var(--color-accent-light)')
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = 'var(--color-accent)')
                  }
                >
                  {translations.createRentalRequest}
                </button>
              </div>
            </DashboardCard>
          </div>
        )}

        {/* ===== USER DETAILS SECTION ===== */}
        <div style={{ marginBottom: '2rem' }}>
          <DashboardCard title={translations.profileInformation} icon={<User size={24} strokeWidth={2} />}>
            <div style={profileGridStyle}>
              {/* Email */}
              <div style={profileFieldStyle}>
                <label style={profileLabelStyle}>{translations.email}</label>
                <p style={profileValueStyle}>{user?.email}</p>
              </div>

              {/* Phone */}
              {user?.profile?.phone && (
                <div style={profileFieldStyle}>
                  <label style={profileLabelStyle}>{translations.phone}</label>
                  <p style={profileValueStyle}>{user.profile.phone}</p>
                </div>
              )}

              {/* Company Name */}
              {user?.profile?.company_name && (
                <div style={profileFieldStyle}>
                  <label style={profileLabelStyle}>{translations.company}</label>
                  <p style={profileValueStyle}>{user.profile.company_name}</p>
                </div>
              )}

              {/* Role */}
              <div style={profileFieldStyle}>
                <label style={profileLabelStyle}>{translations.role}</label>
                <p style={{ ...profileValueStyle, ...profileRoleBadgeStyle }}>
                  {user?.profile?.role}
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* ===== LOGOUT SECTION ===== */}
        <div style={logoutContainerStyle}>
          <NeuButton
            variant="secondary"
            size="medium"
            onClick={handleLogout}
          >
            {translations.logout}
          </NeuButton>
        </div>
      </div>
    </div>
  );
}

