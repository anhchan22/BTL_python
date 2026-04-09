import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { rentalService } from '../services/rentalService';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import NeuButton from '../components/NeuButton';

export default function RentalRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const data = await rentalService.getRequest(id);
      setRequest(data);
    } catch (err) {
      setError('Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    try {
      if (action === 'approve') {
        await rentalService.approveRequest(id, adminNote);
      } else if (action === 'reject') {
        await rentalService.rejectRequest(id, adminNote);
      } else if (action === 'cancel') {
        await rentalService.cancelRequest(id);
      }
      setDialogOpen(false);
      loadRequest();
    } catch (err) {
      setError(`Failed to ${action} request`);
    }
  };

  const openDialog = (type) => {
    setDialogType(type);
    setAdminNote('');
    setDialogOpen(true);
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

  const actionContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    flexWrap: 'wrap'
  };

  const dialogOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: dialogOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const dialogStyle = {
    backgroundColor: 'var(--color-background)',
    borderRadius: 'var(--radius-base)',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    boxShadow: 'var(--shadow-extruded)',
    animation: 'slideUp 300ms ease-out'
  };

  const dialogTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--color-foreground)',
    marginBottom: '1rem'
  };

  const textareaStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-base)',
    backgroundColor: 'var(--color-background)',
    border: '1px solid var(--color-muted)',
    borderOpacity: '0.2',
    color: 'var(--color-foreground)',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.875rem',
    minHeight: '100px',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out',
    marginTop: '1rem',
    marginBottom: '1rem',
    resize: 'vertical'
  };

  const dialogButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // ===== RENDER STATES =====

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={loadingStyle}>Loading rental request...</div>
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
            onClick={() => navigate('/rentals')}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = 'var(--shadow-inset-deep)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'var(--shadow-inset)';
            }}
          >
            ← Back to Requests
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={loadingStyle}>Request not found</div>
          <button style={backButtonStyle} onClick={() => navigate('/rentals')}>
            ← Back to Requests
          </button>
        </div>
      </div>
    );
  }

  const canApprove = isAdmin() && request.status === 'PENDING';
  const canCancel = !isAdmin() && request.tenant === user?.id && request.status === 'PENDING';

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Back Button */}
        <button
          style={backButtonStyle}
          onClick={() => navigate('/rentals')}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset-deep)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset)';
          }}
        >
          ← Back to Requests
        </button>

        {/* Header with Status */}
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Rental Request #{request.id}</h1>
          </div>
          <StatusBadge status={request.status} type="rental" />
        </div>

        {/* Zone Info Card */}
        <DashboardCard title="Zone Details" icon="🏭" className="mb-8">
          <div style={detailsGridStyle}>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Zone Name</div>
              <div style={valueStyle}>{request.zone_info?.name}</div>
              <div style={smallValueStyle}>{request.zone_info?.location}</div>
            </div>
          </div>
        </DashboardCard>

        {/* Tenant Info (Admin Only) */}
        {isAdmin() && request.tenant_info && (
          <DashboardCard title="Tenant Information" icon="👤" className="mb-8">
            <div style={detailsGridStyle}>
              <div style={detailCardStyle}>
                <div style={labelStyle}>Username</div>
                <div style={valueStyle}>{request.tenant_info.username}</div>
              </div>
              <div style={detailCardStyle}>
                <div style={labelStyle}>Email</div>
                <div style={smallValueStyle}>{request.tenant_info.email}</div>
              </div>
            </div>
          </DashboardCard>
        )}

        {/* Request Details Card */}
        <DashboardCard title="Request Details" icon="📋" className="mb-8">
          <div style={detailsGridStyle}>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Requested Area</div>
              <div style={valueStyle}>{request.requested_area?.toLocaleString() || 0} m²</div>
            </div>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Rental Duration</div>
              <div style={valueStyle}>{request.rental_duration || 0} months</div>
            </div>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Monthly Cost</div>
              <div style={valueStyle}>{formatPrice(request.estimated_monthly_cost)}</div>
            </div>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Total Cost</div>
              <div style={valueStyle}>{formatPrice(request.total_cost)}</div>
            </div>
            <div style={detailCardStyle}>
              <div style={labelStyle}>Requested Date</div>
              <div style={smallValueStyle}>
                {request.requested_at ? new Date(request.requested_at).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Review Info (if reviewed) */}
        {request.reviewed_at && (
          <DashboardCard title="Review Information" icon="✓" className="mb-8">
            <div style={detailsGridStyle}>
              <div style={detailCardStyle}>
                <div style={labelStyle}>Reviewed Date</div>
                <div style={smallValueStyle}>
                  {new Date(request.reviewed_at).toLocaleString()}
                </div>
              </div>
              {request.admin_note && (
                <div style={{ ...detailCardStyle, gridColumn: '1 / -1' }}>
                  <div style={labelStyle}>Admin Note</div>
                  <div style={smallValueStyle}>{request.admin_note}</div>
                </div>
              )}
            </div>
          </DashboardCard>
        )}

        {/* Action Buttons */}
        {canApprove && (
          <div style={actionContainerStyle}>
            <NeuButton
              variant="primary"
              size="medium"
              onClick={() => openDialog('approve')}
              style={{ flex: 1 }}
            >
              ✓ Approve Request
            </NeuButton>
            <NeuButton
              variant="secondary"
              size="medium"
              onClick={() => openDialog('reject')}
              style={{ flex: 1 }}
            >
              ✗ Reject Request
            </NeuButton>
          </div>
        )}

        {canCancel && (
          <div style={actionContainerStyle}>
            <NeuButton
              variant="secondary"
              size="medium"
              onClick={() => openDialog('cancel')}
              style={{ width: '100%' }}
            >
              ✗ Cancel Request
            </NeuButton>
          </div>
        )}
      </div>

      {/* Dialog Overlay */}
      <div style={dialogOverlayStyle} onClick={() => setDialogOpen(false)}>
        <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
          <div style={dialogTitleStyle}>
            {dialogType === 'approve' ? '✓ Approve Request' :
             dialogType === 'reject' ? '✗ Reject Request' :
             '✗ Cancel Request'}
          </div>

          {dialogType !== 'cancel' && (
            <textarea
              style={textareaStyle}
              placeholder="Enter optional note..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          )}

          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', margin: '0.5rem 0' }}>
            {dialogType === 'approve' ? 'This will reduce the zone\'s available area.' :
             dialogType === 'reject' ? 'The tenant will be notified of rejection.' :
             'You can create a new request later.'}
          </p>

          <div style={dialogButtonsStyle}>
            <button
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-base)',
                border: 'none',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-inset)',
                transition: 'all 300ms ease-out'
              }}
              onClick={() => setDialogOpen(false)}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = 'var(--shadow-inset-deep)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'var(--shadow-inset)';
              }}
            >
              Cancel
            </button>
            <button
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-base)',
                border: 'none',
                backgroundColor: dialogType === 'approve' ? 'var(--color-accent-secondary)' : 'var(--color-accent)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-extruded)',
                transition: 'all 300ms ease-out'
              }}
              onClick={() => handleAction(dialogType)}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'var(--shadow-extruded)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
