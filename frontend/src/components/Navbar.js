import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as notificationService from '../services/notificationService';

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
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    textDecoration: 'none',
    flex: 1
  };

  const logoHoverStyle = {
    ...logoStyle,
    opacity: 0.8,
    textShadow: '0 0 20px rgba(108, 99, 255, 0.3)'
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
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-inner)',
    transition: 'all 0.3s ease-out',
    border: 'none',
    background: 'transparent',
    fontFamily: '"DM Sans", sans-serif',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const navLinkHoverStyle = {
    ...navLinkStyle,
    color: 'white',
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    boxShadow: '0 0 15px rgba(108, 99, 255, 0.2)'
  };

  const roleBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 0.75rem',
    borderRadius: 'var(--radius-inner)',
    backgroundColor: user.profile?.role === 'ADMIN' ? 'rgba(108, 99, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600',
    border: '1px solid ' + (user.profile?.role === 'ADMIN' ? 'rgba(108, 99, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'),
    transition: 'all 0.3s ease-out',
    cursor: 'default'
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
    padding: '0.5rem',
    borderRadius: 'var(--radius-inner)',
    transition: 'all 0.3s ease-out', // Hiệu ứng mượt
    border: 'none',
    background: 'rgba(108, 99, 255, 0.2)', // Sáng hơn ở trạng thái ban đầu
    boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)', // Hiệu ứng sáng ban đầu
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const userButtonHoverStyle = {
    ...userButtonStyle,
    backgroundColor: 'rgba(108, 99, 255, 0.4)', // Màu sáng hơn khi hover
    boxShadow: '0 0 25px rgba(108, 99, 255, 0.6)', // Hiệu ứng sáng mạnh hơn khi hover
    transform: 'scale(1.1)', // Phóng to nhẹ khi hover
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: '1rem',
    marginTop: '0.5rem',
    backgroundColor: '#1E293B', // Solid background for neumorphism
    borderRadius: 'var(--radius-base)',
    boxShadow: '8px 8px 16px #0F172A, -8px -8px 16px #334155', // Neumorphic shadows
    border: 'none',
    minWidth: '200px',
    zIndex: 1000,
    overflow: 'hidden',
    display: menuOpen ? 'block' : 'none',
  };

  const dropdownItemStyle = {
    padding: '0.75rem 1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    border: 'none',
    background: '#1E293B', // Match menu background
    boxShadow: '4px 4px 8px #0F172A, -4px -4px 8px #334155', // Raised effect
    borderRadius: 'var(--radius-inner)',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontFamily: '"DM Sans", sans-serif',
    display: 'block',
  };

  const dropdownItemHoverStyle = {
    ...dropdownItemStyle,
    backgroundColor: '#334155', // Slightly darker for pressed effect
    boxShadow: 'inset 4px 4px 8px #0F172A, inset -4px -4px 8px #334155', // Inset shadow for pressed look
    color: 'white',
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
      `}</style>
      <div style={navContainerStyle}>
        {/* Logo */}
        <div
          style={logoStyle}
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
          🏢 Industrial Zone Rental
        </div>

        {/* Desktop Nav Links */}
        <div style={navLinksStyle}>
          <button
            style={navLinkStyle}
            onClick={() => navigate('/zones')}
            onMouseEnter={(e) => {
              e.target.style.color = 'white';
              e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
              e.target.style.boxShadow = '0 0 15px rgba(108, 99, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.85)';
              e.target.style.backgroundColor = 'transparent';
              e.target.style.boxShadow = 'none';
            }}
          >
            🏭 Zones
          </button>

          <div style={notificationBadgeContainerStyle}>
            <button
              style={navLinkStyle}
              onClick={() => navigate('/rentals')}
              onMouseEnter={(e) => {
                e.target.style.color = 'white';
                e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
                e.target.style.boxShadow = '0 0 15px rgba(108, 99, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.85)';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.boxShadow = 'none';
              }}
            >
              📋 Requests
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
              e.target.style.boxShadow = '0 0 15px rgba(108, 99, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.85)';
              e.target.style.backgroundColor = 'transparent';
              e.target.style.boxShadow = 'none';
            }}
          >
            📜 Contracts
          </button>

          {isAdmin && isAdmin() && (
            <button
              style={navLinkStyle}
              onClick={() => navigate('/admin/users')}
              onMouseEnter={(e) => {
                e.target.style.color = 'white';
                e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
                e.target.style.boxShadow = '0 0 15px rgba(108, 99, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.85)';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.boxShadow = 'none';
              }}
            >
              👥 Manage Users
            </button>
          )}
        </div>

        {/* User Menu */}
        <div style={userMenuStyle}>
          {/* Role Badge */}
          <div style={roleBadgeStyle}>
            {user.profile?.role === 'ADMIN' ? '👑' : '👤'} {user.profile?.role || 'TENANT'}
          </div>

          {/* User Button */}
        <button
          style={userButtonStyle}
          onClick={handleMenuToggle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.4)'; // Màu sáng hơn khi hover
            e.target.style.boxShadow = '0 0 25px rgba(108, 99, 255, 0.6)'; // Hiệu ứng sáng mạnh hơn khi hover
            e.target.style.transform = 'scale(1.1)'; // Phóng to nhẹ khi hover
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.2)'; // Trở về trạng thái ban đầu
            e.target.style.boxShadow = '0 0 15px rgba(108, 99, 255, 0.3)'; // Trở về trạng thái ban đầu
            e.target.style.transform = 'scale(1)'; // Trở về kích thước ban đầu
          }}
          title={user.username}
        >
          👤
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
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              ⚙️ My Profile
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
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              📊 Dashboard
            </button>
            <div style={dropdownDividerStyle}></div>
            <button
              style={dropdownItemStyle}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
                e.target.style.color = '#FECACA';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
