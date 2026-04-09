import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { contractService } from '../services/contractService';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import NeuButton from '../components/NeuButton';

export default function ContractDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContract();
  }, [id]);

  const loadContract = async () => {
    try {
      const data = await contractService.getContract(id);
      setContract(data);
    } catch (err) {
      setError('Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const calculateProgress = () => {
    if (!contract) return 0;
    const start = new Date(contract.start_date);
    const end = new Date(contract.end_date);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  // ===== STYLE DEFINITIONS =====

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: 'clamp(1rem, 2vw, 2rem)'
  };

  const maxWidthWrapperStyle = {
    maxWidth: '80rem',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const backButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1rem',
    color: 'var(--color-muted)'
  };

  const errorBoxStyle = {
    backgroundColor: '#FEE2E2',
    borderLeft: '4px solid #EF4444',
    padding: '1.5rem',
    borderRadius: 'var(--radius-base)',
    marginBottom: '2rem'
  };

  const errorTextStyle = {
    color: '#7F1D1D',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    marginTop: '0.5rem'
  };

  const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const detailCardStyle = {
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 'var(--radius-base)',
    transition: 'all 300ms ease-out'
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--color-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem'
  };

  const valueStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--color-foreground)'
  };

  const smallValueStyle = {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: 'var(--color-foreground)',
    marginTop: '0.25rem'
  };

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 'var(--radius-inner)',
    overflow: 'hidden',
    marginTop: '1rem'
  };

  const progressFillStyle = (progress) => ({
    height: '100%',
    width: `${progress}%`,
    backgroundColor: 'var(--color-accent-secondary)',
    transition: 'width 300ms ease-out'
  });

  const actionContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    flexWrap: 'wrap'
  };

  // ===== RENDER STATES =====

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={loadingStyle}>Loading contract...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={errorBoxStyle}>
            <p style={errorTextStyle}>{error}</p>
          </div>
          <button
            style={backButtonStyle}
            onClick={() => navigate('/contracts')}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = 'var(--shadow-inset-deep)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'var(--shadow-inset)';
            }}
          >
            ← Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={loadingStyle}>Contract not found</div>
          <button style={backButtonStyle} onClick={() => navigate('/contracts')}>
            ← Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Back Button */}
        <button
          style={backButtonStyle}
          onClick={() => navigate('/contracts')}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset-deep)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset)';
          }}
        >
          ← Back to Contracts
        </button>

        {/* Header with Status */}
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Contract {contract.contract_number}</h1>
            <p style={subtitleStyle}>
              Created: {new Date(contract.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={contract.status} type="contract" />
        </div>

        {/* Tenant Info (Admin Only) */}
        {isAdmin() && contract.tenant_info && (
          <DashboardCard title="Tenant Information" icon="👤" className="mb-8">
            <div style={detailsGridStyle}>
              <div style={detailCardStyle}>
                <div style={labelStyle}>Username</div>
                <div style={valueStyle}>{contract.tenant_info.username}</div>
                <div style={smallValueStyle}>{contract.tenant_info.email}</div>
              </div>
              {contract.tenant_info?.profile?.company_name && (
                <div style={detailCardStyle}>
                  <div style={labelStyle}>Company</div>
                  <div style={smallValueStyle}>{contract.tenant_info.profile.company_name}</div>
                </div>
              )}
            </div>
          </DashboardCard>
        )}

        {/* Zone Info Card */}
        <DashboardCard title="Industrial Zone" icon="🏭" className="mb-8">
          <div style={detailsGridStyle}>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Zone Name</div>
              <div style={valueStyle}>{contract.zone_info?.name}</div>
              <div style={smallValueStyle}>{contract.zone_info?.location}</div>
            </div>
          </div>
        </DashboardCard>

        {/* Contract Terms Card */}
        <DashboardCard title="Contract Terms" icon="📋" className="mb-8">
          <div style={detailsGridStyle}>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Contracted Area</div>
              <div style={valueStyle}>{contract.area?.toLocaleString() || 0} m²</div>
            </div>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Monthly Rent</div>
              <div style={valueStyle}>{formatPrice(contract.monthly_rent)}</div>
            </div>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Duration</div>
              <div style={valueStyle}>{contract.duration_months || 0} months</div>
            </div>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Total Value</div>
              <div style={valueStyle}>{formatPrice(contract.total_value)}</div>
            </div>
          </div>
        </DashboardCard>

        {/* Timeline Card */}
        <DashboardCard title="Timeline" icon="📅" className="mb-8">
          <div style={detailsGridStyle}>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Start Date</div>
              <div style={valueStyle}>
                {new Date(contract.start_date).toLocaleDateString()}
              </div>
            </div>
            <div style={detailCardStyle}>
              <div style={labelStyle}>End Date</div>
              <div style={valueStyle}>
                {new Date(contract.end_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Contract Progress (if Active) */}
        {contract.status === 'ACTIVE' && (
          <DashboardCard title="Contract Progress" icon="⏳" className="mb-8">
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
                  Progress
                </span>
                <span style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: '600' }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(progress)}></div>
              </div>
              <div style={{ marginTop: '0.75rem', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                {contract.days_remaining || 0} days remaining
              </div>
            </div>
          </DashboardCard>
        )}

        {/* Related Request Link */}
        {contract.rental_request_id && (
          <div style={actionContainerStyle}>
            <NeuButton
              variant="secondary"
              size="medium"
              onClick={() => navigate(`/rentals/${contract.rental_request_id}`)}
              style={{ width: '100%' }}
            >
              📋 View Original Rental Request
            </NeuButton>
          </div>
        )}
      </div>
    </div>
  );
}
