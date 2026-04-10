/**
 * CODE EXAMPLES - Notification Badge Implementation
 *
 * This file contains complete, production-ready code examples
 * for adding notification badge with polling to Navbar.js
 */

// ============================================================================
// EXAMPLE 1: Notification State & Polling Setup
// Location: Navbar.js - Add after line 8 (after menuOpen state)
// ============================================================================

const [unreadCount, setUnreadCount] = React.useState(0);
const [isPolling, setIsPolling] = React.useState(true);

React.useEffect(() => {
  if (!user) return; // Only poll if user is logged in

  // Function to fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      // Get token from localStorage or your auth context
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');

      const response = await fetch('/api/notifications/unread-count/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newCount = data.unread_count || 0;
        setUnreadCount(newCount);
      } else if (response.status === 401) {
        // Token expired, user logged out
        setIsPolling(false);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
      // Continue polling even on error - don't break the flow
    }
  };

  // Fetch immediately on component mount
  if (isPolling) {
    fetchUnreadCount();
  }

  // Set up polling interval (30 seconds = 30000ms)
  const pollInterval = setInterval(() => {
    if (isPolling) {
      fetchUnreadCount();
    }
  }, 30000);

  // Cleanup interval on component unmount
  return () => {
    clearInterval(pollInterval);
  };
}, [user, isPolling]);

// ============================================================================
// EXAMPLE 2: Notification Badge UI Component
// Location: Navbar.js - Add around line 295 inside userMenuStyle div
// Insert BEFORE the user button
// ============================================================================

{/* Notification Badge */}
{unreadCount > 0 && (
  <div
    style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {/* Badge Dot/Number */}
    <div
      style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: '#EF4444', // Red for notifications
        color: 'white',
        minWidth: '24px',
        height: '24px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.65rem',
        fontWeight: '700',
        fontFamily: '"DM Sans", sans-serif',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.3)',
        zIndex: 20,
        animation: 'notificationBadgePopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        paddingLeft: unreadCount > 99 ? 0 : '2px',
        paddingRight: unreadCount > 99 ? 0 : '2px',
        lineHeight: '1'
      }}
      key={unreadCount} // Force re-animation on count change
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>

    {/* Pulse Animation (Optional - uncomment if desired) */}
    <div
      style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid #EF4444',
        opacity: 0.3,
        animation: 'notificationBadgePulse 2s ease-in-out infinite'
      }}
    />
  </div>
)}

{/* CSS Animations - Add to globals.css or embed in component */}
<style>{`
  @keyframes notificationBadgePopIn {
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

  @keyframes notificationBadgePulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.1;
    }
  }
`}</style>

// ============================================================================
// EXAMPLE 3: Badge with Tooltip (Enhanced Version)
// Location: Navbar.js - Alternative to Example 2 with hover tooltip
// ============================================================================

const [showBadgeTooltip, setShowBadgeTooltip] = React.useState(false);

{/* Notification Badge with Tooltip */}
{unreadCount > 0 && (
  <div
    style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    onMouseEnter={() => setShowBadgeTooltip(true)}
    onMouseLeave={() => setShowBadgeTooltip(false)}
  >
    {/* Badge Dot */}
    <div
      style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: '#EF4444',
        color: 'white',
        minWidth: '24px',
        height: '24px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.65rem',
        fontWeight: '700',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5)',
        zIndex: 20,
        animation: 'notificationBadgePopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        transition: 'all 200ms ease-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.7)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.5)';
      }}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>

    {/* Tooltip on Hover */}
    {showBadgeTooltip && (
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          right: 0,
          backgroundColor: '#3D4852',
          color: 'white',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-inner)',
          fontSize: '0.75rem',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-extruded)',
          zIndex: 100,
          animation: 'slideDown 200ms ease-out'
        }}
      >
        {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
      </div>
    )}
  </div>
)}

// ============================================================================
// EXAMPLE 4: Notification Click Handler (Future Enhancement)
// Location: Navbar.js - Add function to navigate to notifications page
// ============================================================================

const handleNotificationClick = () => {
  navigate('/notifications');
  // Optionally mark all as read here
  markAllNotificationsAsRead();
};

const markAllNotificationsAsRead = async () => {
  try {
    const token = localStorage.getItem('token');
    await fetch('/api/notifications/mark-all-read/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    setUnreadCount(0);
  } catch (err) {
    console.error('Failed to mark notifications as read:', err);
  }
};

// ============================================================================
// EXAMPLE 5: Alternative - Using UserService (If Available)
// Location: Navbar.js - Replace fetch with service method
// ============================================================================

// Import at top of file:
// import { userService } from '../services/userService';

React.useEffect(() => {
  if (!user) return;

  // Use userService if available
  const fetchUnreadCount = async () => {
    try {
      if (userService?.getUnreadNotificationCount) {
        const count = await userService.getUnreadNotificationCount();
        setUnreadCount(count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  fetchUnreadCount();

  const pollInterval = setInterval(fetchUnreadCount, 30000);
  return () => clearInterval(pollInterval);
}, [user]);

// ============================================================================
// EXAMPLE 6: Testing & Debugging
// Console commands to test notification polling
// ============================================================================

/*
// Run in browser console while on the page:

// 1. Check current unread count in component state
console.log('Unread count in state (check React DevTools)');

// 2. Manually trigger fetch to test endpoint
fetch('/api/notifications/unread-count/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(d => console.log('Unread count:', d.unread_count));

// 3. Simulate notification by updating state (use React DevTools)
// Find Navbar component > state > unreadCount > edit to 5

// 4. Monitor network requests to check polling interval
// Open DevTools Network tab > filter by "unread-count" > check requests every 30s

// 5. Check for memory leaks
// Enable "Detach from page" in DevTools
// Leave page running for 5 minutes
// Check console for any errors or memory growth
*/

// ============================================================================
// EXPECTED API RESPONSE FORMAT
// ============================================================================

/*
GET /api/notifications/unread-count/
Headers: Authorization: Bearer <token>

Response (200 OK):
{
  "unread_count": 3
}

Response (401 Unauthorized):
{
  "detail": "Invalid token"
}

Response (500 Internal Server Error):
{
  "detail": "Server error"
}
*/
