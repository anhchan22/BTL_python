import React, { useState, useEffect } from 'react';
import { HourglassIcon, AlertTriangle, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as userService from '../services/userService';
import StatusBadge from '../components/StatusBadge';
import { translations } from '../utils/vietnamese-translations';

export default function UserManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch all users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await userService.getAllUsers();
    if (result.success) {
      setUsers(result.data.users || result.data || []);
    } else {
      showSnackbar(result.error, 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const openRoleDialog = (selectedUser) => {
    setSelectedUser(selectedUser);
    setNewRole(selectedUser.profile.role);
    setDialogOpen(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser || newRole === selectedUser.profile.role) {
      setDialogOpen(false);
      return;
    }

    // Validate: cannot demote last admin
    if (selectedUser.profile.role === 'ADMIN' && newRole === 'TENANT') {
      const adminCount = users.filter(u => u.profile.role === 'ADMIN').length;
      if (adminCount <= 1) {
        showSnackbar(translations.cannotDemoteLastAdminSnackbar, 'error');
        setDialogOpen(false);
        return;
      }
    }

    // Optimistic update
    const optimisticUser = { ...selectedUser, profile: { ...selectedUser.profile, role: newRole } };
    setUsers(users.map(u => u.id === selectedUser.id ? optimisticUser : u));
    setDialogOpen(false);

    // API call
    const result = await userService.changeUserRole(selectedUser.id, newRole);
    if (result.success) {
      showSnackbar(result.data.message || `Role changed to ${newRole}`, 'success');
      setSelectedUser(null);
    } else {
      // Revert optimistic update on error
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      showSnackbar(result.error, 'error');
    }
  };

  const canDemote = (targetUser) => {
    if (!targetUser || !targetUser.profile) return false;
    if (targetUser.profile.role === 'TENANT') return false;
    const adminCount = users.filter(u => u.profile.role === 'ADMIN').length;
    return adminCount > 1;
  };

  // ===== STYLE DEFINITIONS =====

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: 'clamp(1rem, 2vw, 2rem)'
  };

  const maxWidthWrapperStyle = {
    maxWidth: '90rem',
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

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontSize: '1rem',
    color: 'var(--color-muted)'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 'var(--radius-base)',
    borderLeft: '4px solid #3B82F6',
    color: 'var(--color-foreground)'
  };

  const tableWrapperStyle = {
    overflow: 'auto',
    borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-extruded)',
    backgroundColor: 'var(--color-background)',
    marginBottom: '2rem'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem'
  };

  const headerCellStyle = {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    fontWeight: '600',
    borderBottom: '2px solid var(--color-muted)',
    borderBottomOpacity: '0.2'
  };

  const bodyCellStyle = {
    padding: '1rem',
    borderBottom: '1px solid var(--color-muted)',
    borderBottomOpacity: '0.1',
    color: 'var(--color-foreground)'
  };

  const rowHoverStyle = {
    transition: 'background-color 300ms ease-out'
  };

  const actionButtonStyle = {
    padding: '0.4rem 0.8rem',
    borderRadius: 'var(--radius-inner)',
    border: 'none',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 300ms ease-out',
    boxShadow: 'var(--shadow-extruded-small)'
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
    maxWidth: '450px',
    width: '90%',
    boxShadow: 'var(--shadow-extruded)'
  };

  const dialogTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--color-foreground)',
    marginBottom: '1.5rem'
  };

  const userInfoStyle = {
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 'var(--radius-inner)',
    marginBottom: '1.5rem',
    fontSize: '0.9rem'
  };

  const roleButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem'
  };

  const roleButtonStyle = (isSelected) => ({
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-inner)',
    border: 'none',
    backgroundColor: isSelected ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.2)',
    color: isSelected ? 'white' : 'var(--color-foreground)',
    fontWeight: isSelected ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 300ms ease-out',
    boxShadow: isSelected ? 'var(--shadow-extruded)' : 'var(--shadow-inset)'
  });

  const warningBoxStyle = {
    backgroundColor: '#FEF3C7',
    borderLeft: '4px solid #F59E0B',
    padding: '1rem',
    borderRadius: 'var(--radius-inner)',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    color: '#92400E'
  };

  const dialogButtonsStyle = {
    display: 'flex',
    gap: '1rem'
  };

  const dialogButtonStyle = (isConfirm = false) => ({
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: isConfirm ? 'var(--color-accent)' : 'var(--color-background)',
    color: isConfirm ? 'white' : 'var(--color-foreground)',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: isConfirm ? 'var(--shadow-extruded)' : 'var(--shadow-inset)',
    transition: 'all 300ms ease-out'
  });

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

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={loadingStyle}><HourglassIcon size={20} strokeWidth={2} style={{ marginRight: '0.4rem', display: 'inline' }} />{translations.loadingUsers}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>👥 {translations.userManagementTitle}</h1>
          <p style={subtitleStyle}>{translations.manageUserRoles}</p>
        </div>

        {/* Empty State */}
        {users.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>{translations.noUsersFound}</p>
          </div>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={rowHoverStyle}>
                  <th style={headerCellStyle}>{translations.username}</th>
                  <th style={headerCellStyle}>{translations.email}</th>
                  <th style={headerCellStyle}>{translations.fullName}</th>
                  <th style={headerCellStyle}>{translations.role}</th>
                  <th style={headerCellStyle}>{translations.actions}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    style={rowHoverStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={bodyCellStyle}><strong>{u.username}</strong></td>
                    <td style={bodyCellStyle}>{u.email}</td>
                    <td style={bodyCellStyle}>
                      {u.first_name && u.last_name
                        ? `${u.first_name} ${u.last_name}`
                        : '(No name)'}
                    </td>
                    <td style={bodyCellStyle}>
                      <StatusBadge status={u.profile.role} type="user" />
                    </td>
                    <td style={bodyCellStyle}>
                      <button
                        style={actionButtonStyle}
                        onClick={() => openRoleDialog(u)}
                        disabled={u.id === user.id}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--color-accent-light)';
                          e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'var(--color-accent)';
                          e.target.style.boxShadow = 'var(--shadow-extruded-small)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                        title={u.id === user.id ? 'Cannot change own role' : 'Change role'}
                      >
                        ✏️ {translations.edit}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Change Dialog */}
      <div style={dialogOverlayStyle} onClick={() => setDialogOpen(false)}>
        <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
          <div style={dialogTitleStyle}>{translations.changeUserRole}</div>

          {selectedUser && (
            <>
              <div style={userInfoStyle}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>{translations.username}:</strong> {selectedUser.username}
                </div>
                <div>
                  <strong>{translations.currentRole}</strong> {selectedUser.profile.role}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                  {translations.selectNewRole}
                </div>
                <div style={roleButtonsStyle}>
                  {['TENANT', 'ADMIN'].map((role) => (
                    <button
                      key={role}
                      style={roleButtonStyle(newRole === role)}
                      onClick={() => setNewRole(role)}
                      onMouseEnter={(e) => {
                        if (newRole !== role) {
                          e.target.style.opacity = '0.8';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (newRole !== role) {
                          e.target.style.opacity = '1';
                        }
                      }}
                    >
                      {role === 'ADMIN' ? '👑' : '👤'} {role}
                    </button>
                  ))}
                </div>
              </div>

              {!canDemote(selectedUser) && selectedUser?.profile?.role === 'ADMIN' && newRole === 'TENANT' && (
                <div style={warningBoxStyle}>
                  <AlertTriangle size={18} strokeWidth={2} style={{ marginRight: '0.4rem', display: 'inline' }} />
                  {translations.cannotDemoteLastAdmin}
                </div>
              )}

              <div style={dialogButtonsStyle}>
                <button
                  style={dialogButtonStyle(false)}
                  onClick={() => setDialogOpen(false)}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = 'var(--shadow-inset-deep)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'var(--shadow-inset)';
                  }}
                >
                  {translations.cancel}
                </button>
                <button
                  style={{
                    ...dialogButtonStyle(true),
                    opacity: newRole === selectedUser?.profile?.role || (selectedUser && !canDemote(selectedUser) && selectedUser.profile.role === 'ADMIN' && newRole === 'TENANT') ? 0.5 : 1,
                    cursor: newRole === selectedUser?.profile?.role || (selectedUser && !canDemote(selectedUser) && selectedUser.profile.role === 'ADMIN' && newRole === 'TENANT') ? 'not-allowed' : 'pointer'
                  }}
                  onClick={handleRoleChange}
                  disabled={newRole === selectedUser?.profile?.role || (selectedUser && !canDemote(selectedUser) && selectedUser.profile.role === 'ADMIN' && newRole === 'TENANT')}
                  onMouseEnter={(e) => {
                    if (!(newRole === selectedUser?.profile?.role || (selectedUser && !canDemote(selectedUser) && selectedUser.profile.role === 'ADMIN' && newRole === 'TENANT'))) {
                      e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(newRole === selectedUser?.profile?.role || (selectedUser && !canDemote(selectedUser) && selectedUser.profile.role === 'ADMIN' && newRole === 'TENANT'))) {
                      e.target.style.boxShadow = 'var(--shadow-extruded)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {translations.saveRole}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Snackbar Notification */}
      {snackbar.open && (
        <div style={snackbar.severity === 'success' ? snackbarSuccessStyle : snackbarErrorStyle}>
          {snackbar.severity === 'success' ? <Check size={18} strokeWidth={2} style={{ marginRight: '0.4rem', display: 'inline' }} /> : <AlertCircle size={18} strokeWidth={2} style={{ marginRight: '0.4rem', display: 'inline' }} />}
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
