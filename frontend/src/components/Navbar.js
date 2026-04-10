import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Factory, Clipboard, FileText, Users, User, Crown, Settings, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as notificationService from '../services/notificationService';
import { translations } from '../utils/vietnamese-translations';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  // ===== NOTIFICATION POLLING =====
  React.useEffect(() => {
    // Skip polling if user is not authenticated
    if (!user) return;

    // Fetch unread count immediately on mount
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.warn('No access token found in localStorage');
          return;
        }
        const data = await notificationService.getUnreadCount();
        setUnreadCount(data.unread_count || 0);

        // Automatically clear unread count after 5 seconds
        if (data.unread_count > 0) {
          setTimeout(() => setUnreadCount(0), 4000);
        }
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
        // Don't spam console with repeated errors
      }
    };

    // Fetch immediately
    fetchUnreadCount();

    // Set up polling interval (30 seconds)
    const intervalId = setInterval(fetchUnreadCount, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [user]);

  if (!user) return null;

  // ===== STYLE DEFINITIONS =====

  const navbarStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(23, 37, 84, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    borderBottomLeftRadius: 'var(--radius-base)',
    borderBottomRightRadius: 'var(--radius-base)',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    height: 80,
  };

  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%',
    padding: '0 clamp(1rem, 2vw, 2rem)',
    margin: '0 auto'
  };

  const logoStyle = {
    fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
    fontWeight: '800',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    textDecoration: 'none',
    flex: 1
  };

  const navLinksStyle = {
    display: 'flex',
    gap: 'clamp(1rem, 3vw, 2rem)',
    alignItems: 'center',
    flexGrow: 1,
    marginLeft: '2rem'
  };

  const navLinkStyle = {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '0.65rem 1rem',
    borderRadius: 'var(--radius-inner)',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    background: 'transparent',
    fontFamily: '"DM Sans", sans-serif',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    minHeight: '44px'
  };

  const roleBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.875rem',
    borderRadius: 'var(--radius-inner)',
    backgroundColor: user.profile?.role === 'ADMIN' ? 'rgba(108, 99, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600',
    border: '1px solid ' + (user.profile?.role === 'ADMIN' ? 'rgba(108, 99, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'),
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    minHeight: '32px'
  };

  const userMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginLeft: '1rem'
  };

  const userButtonStyle = {
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.65rem',
    borderRadius: 'var(--radius-inner)',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    background: 'rgba(108, 99, 255, 0.2)',
    boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    minWidth: '44px',
    willChange: 'transform, box-shadow, background-color'
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: '1rem',
    marginTop: '0.75rem',
    backgroundColor: '#1E293B',
    borderRadius: 'var(--radius-base)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -10px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minWidth: '200px',
    zIndex: 1000,
    overflow: 'hidden',
    display: menuOpen ? 'block' : 'none',
    animation: menuOpen ? 'dropdownSlideDown 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none'
  };

  const dropdownItemStyle = {
    padding: '0.875rem 1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    background: '#1E293B',
    borderRadius: 'var(--radius-inner)',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontFamily: '"DM Sans", sans-serif',
    display: 'block',
    willChange: 'background-color, transform'
  };

  const dropdownDisabledStyle = {
    ...dropdownItemStyle,
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'default',
    opacity: 0.6,
    fontSize: '0.85rem',
    fontWeight: '500'
  };

  const dropdownDividerStyle = {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0.5rem 0'
  };

  // ===== NOTIFICATION BADGE STYLES =====
  const notificationBadgeContainerStyle = {
    position: 'relative',
    display: 'inline-block'
  };

  const notificationBadgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#EF4444',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    boxShadow: '0 0 20px rgba(239, 68, 68, 0.6), 4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(23, 37, 84, 0.95)',
    zIndex: 10,
    animation: 'notificationPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
  };

  return (
    <nav style={navbarStyle}>
      <style>{`
        @keyframes notificationPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes dropdownSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div style={navContainerStyle}>
        {/* Logo */}
        <div
          style={{ ...logoStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.textShadow = '0 0 20px rgba(108, 99, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.textShadow = 'none';
          }}
          onClick={() => navigate('/dashboard')}
        >
          <Building2 size={24} strokeWidth={2} color="white" />
          <span>{translations.appTitle}</span>
        </div>

        {/* Desktop Nav Links */}
        <div style={navLinksStyle}>
          <button
            style={navLinkStyle}
            onClick={() => navigate('/zones')}
            onMouseEnter={(e) => {
              e.target.style.color = 'white';
              e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
              e.target.style.boxShadow = '0 0 20px rgba(108, 99, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.85)';
              e.target.style.backgroundColor = 'transparent';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Factory size={18} strokeWidth={2} />
            {translations.zones}
          </button>

          <div style={notificationBadgeContainerStyle}>
            <button
              style={navLinkStyle}
              onClick={() => navigate('/rental-requests')}
              onMouseEnter={(e) => {
                e.target.style.color = 'white';
                e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
                e.target.style.boxShadow = '0 0 20px rgba(108, 99, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.85)';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Clipboard size={18} strokeWidth={2} />
              {translations.requests}
            </button>
            {unreadCount > 0 && (
              <div style={notificationBadgeStyle}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>

          <button
            style={navLinkStyle}
            onClick={() => navigate('/contracts')}
            onMouseEnter={(e) => {
              e.target.style.color = 'white';
              e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
              e.target.style.boxShadow = '0 0 20px rgba(108, 99, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.85)';
              e.target.style.backgroundColor = 'transparent';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FileText size={18} strokeWidth={2} />
            {translations.contracts}
          </button>

          {isAdmin && isAdmin() && (
            <button
              style={navLinkStyle}
              onClick={() => navigate('/admin/users')}
              onMouseEnter={(e) => {
                e.target.style.color = 'white';
                e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
                e.target.style.boxShadow = '0 0 20px rgba(108, 99, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.85)';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Users size={18} strokeWidth={2} />
              {translations.manageUsers}
            </button>
          )}
        </div>

        {/* User Menu */}
        <div style={userMenuStyle}>
          {/* Role Badge */}
          <div style={roleBadgeStyle}>
            {user.profile?.role === 'ADMIN' ? <Crown size={14} strokeWidth={2} /> : <User size={14} strokeWidth={2} />}
            <span>{user.profile?.role || 'TENANT'}</span>
          </div>

          {/* User Button */}
        <button
          style={userButtonStyle}
          onClick={handleMenuToggle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.4)';
            e.target.style.boxShadow = '0 0 25px rgba(108, 99, 255, 0.6)';
            e.target.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
            e.target.style.boxShadow = '0 0 15px rgba(108, 99, 255, 0.3)';
            e.target.style.transform = 'scale(1)';
          }}
          title={user.username}
          aria-label="User menu"
        >
          <User size={20} strokeWidth={2} color="white" />
        </button>

          {/* Dropdown Menu */}
          <div style={dropdownMenuStyle}>
            <div style={dropdownDisabledStyle}>
              {user.username}
            </div>
            <div style={dropdownDividerStyle}></div>
            <button
              style={dropdownItemStyle}
              onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.3)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1E293B';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <Settings size={16} strokeWidth={2} style={{ marginRight: '0.4rem', display: 'inline' }} />
              {translations.myProfile}
            </button>
            <button
              style={dropdownItemStyle}
              onClick={() => {
                handleMenuClose();
                navigate('/dashboard');
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.3)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1E293B';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <BarChart3 size={16} strokeWidth={2} style={{ marginRight: '0.4rem', display: 'inline' }} />
              {translations.dashboard}
            </button>
            <div style={dropdownDividerStyle}></div>
            <button
              style={dropdownItemStyle}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
                e.target.style.color = '#FECACA';
                e.target.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1E293B';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <LogOut size={16} strokeWidth={2} style={{ marginRight: '0.4rem', display: 'inline' }} />
              {translations.logout}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
