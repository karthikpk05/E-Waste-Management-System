// // src/components/NotificationBell.js
// import React, { useState, useRef, useEffect } from "react";
// import { notificationService } from "../services/notificationService";
// import "../pages/NotificationBell.css";

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
//   const dropdownRef = useRef(null);
//   const pollIntervalRef = useRef(null);

//   useEffect(() => {
//     // Initial load
//     fetchNotificationStats();
    
//     // Set up polling for new notifications every 30 seconds
//     startPolling();

//     // Close dropdown when clicking outside
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       stopPolling();
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const startPolling = () => {
//     // Poll every 30 seconds
//     pollIntervalRef.current = setInterval(() => {
//       fetchNotificationStats();
//     }, 30000);
//   };

//   const stopPolling = () => {
//     if (pollIntervalRef.current) {
//       clearInterval(pollIntervalRef.current);
//     }
//   };

//   const fetchNotificationStats = async () => {
//     try {
//       const response = await notificationService.getNotificationStats();
//       setUnreadCount(response.data.unreadCount);
//     } catch (error) {
//       console.error("Failed to fetch notification stats:", error);
//     }
//   };

//   const fetchNotifications = async () => {
//     if (loading) return;
    
//     setLoading(true);
//     try {
//       const response = await notificationService.getNotifications();
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBellClick = () => {
//     setDropdownOpen(!dropdownOpen);
//     if (!dropdownOpen) {
//       fetchNotifications();
//     }
//   };

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       await notificationService.markAsRead(notificationId);
      
//       // Update local state
//       setNotifications(prev => 
//         prev.map(n => 
//           n.id === notificationId 
//             ? { ...n, isRead: true }
//             : n
//         )
//       );
      
//       // Update unread count
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     if (markingAllAsRead) return;
    
//     setMarkingAllAsRead(true);
//     try {
//       await notificationService.markAllAsRead();
      
//       // Update local state
//       setNotifications(prev => 
//         prev.map(n => ({ ...n, isRead: true }))
//       );
//       setUnreadCount(0);
//     } catch (error) {
//       console.error("Failed to mark all notifications as read:", error);
//     } finally {
//       setMarkingAllAsRead(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours}h ago`;
    
//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays < 7) return `${diffInDays}d ago`;
    
//     return date.toLocaleDateString();
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'REQUEST_SUBMITTED':
//         return (
//           <svg className="notification-type-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//         );
//       case 'REQUEST_APPROVED':
//         return (
//           <svg className="notification-type-icon approved" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         );
//       case 'REQUEST_REJECTED':
//         return (
//           <svg className="notification-type-icon rejected" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         );
//       case 'REQUEST_SCHEDULED':
//         return (
//           <svg className="notification-type-icon scheduled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//         );
//       case 'REQUEST_COMPLETED':
//         return (
//           <svg className="notification-type-icon completed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//           </svg>
//         );
//       case 'CERTIFICATE_EARNED':
//         return (
//           <svg className="notification-type-icon certificate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//           </svg>
//         );
//       default:
//         return (
//           <svg className="notification-type-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         );
//     }
//   };

//   return (
//     <div className="notification-bell" ref={dropdownRef}>
//       <button className="bell-button" onClick={handleBellClick}>
//         <svg
//           className="bell-icon"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 17h5l-5 5v-5zM10.97 4.97a.75.75 0 0 0-1.08 1.05l-3.99 4-.06.06a3 3 0 0 0 0 4.24l.06.06 4 3.99a.75.75 0 0 0 1.05-1.08l-4-3.99a1.5 1.5 0 0 1 0-2.12l3.99-4z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
//           />
//         </svg>
//         {unreadCount > 0 && (
//           <span className="notification-badge">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {dropdownOpen && (
//         <div className="notification-dropdown">
//           <div className="notification-header">
//             <h3>Notifications</h3>
//             {unreadCount > 0 && (
//               <button
//                 className="mark-all-read-btn"
//                 onClick={handleMarkAllAsRead}
//                 disabled={markingAllAsRead}
//               >
//                 {markingAllAsRead ? 'Marking...' : 'Mark all as read'}
//               </button>
//             )}
//           </div>

//           <div className="notification-content">
//             {loading ? (
//               <div className="notification-loading">
//                 <div className="loading-spinner"></div>
//                 <p>Loading notifications...</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="no-notifications">
//                 <svg className="no-notifications-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                 </svg>
//                 <p>No notifications yet</p>
//               </div>
//             ) : (
//               <div className="notification-list">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
//                     onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
//                   >
//                     <div className="notification-icon">
//                       {getNotificationIcon(notification.notificationType)}
//                     </div>
//                     <div className="notification-content">
//                       <p className="notification-message">
//                         {notification.message}
//                       </p>
//                       <span className="notification-time">
//                         {formatDate(notification.createdAt)}
//                       </span>
//                     </div>
//                     {!notification.isRead && (
//                       <div className="unread-indicator"></div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {notifications.length > 0 && (
//             <div className="notification-footer">
//               <button className="view-all-btn">
//                 View All Notifications
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;
// src/components/NotificationBell.js
import React, { useState, useRef, useEffect } from "react";
import { notificationService } from "../services/notificationService";
import "../pages/NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const dropdownRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    // Initial load
    fetchNotificationStats();
    
    // Set up polling for new notifications every 30 seconds
    startPolling();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      stopPolling();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const startPolling = () => {
    // Poll every 30 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchNotificationStats();
    }, 30000);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  };

  const fetchNotificationStats = async () => {
    try {
      const response = await notificationService.getNotificationStats();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notification stats:", error);
    }
  };

  const fetchNotifications = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, isRead: true }
            : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (markingAllAsRead) return;
    
    setMarkingAllAsRead(true);
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'REQUEST_SUBMITTED':
        return (
          <svg className="notification-type-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'REQUEST_APPROVED':
        return (
          <svg className="notification-type-icon approved" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'REQUEST_REJECTED':
        return (
          <svg className="notification-type-icon rejected" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'REQUEST_SCHEDULED':
        return (
          <svg className="notification-type-icon scheduled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'REQUEST_COMPLETED':
        return (
          <svg className="notification-type-icon completed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'CERTIFICATE_EARNED':
        return (
          <svg className="notification-type-icon certificate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return (
          <svg className="notification-type-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button className="bell-button" onClick={handleBellClick}>
        <svg
            className="bell-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Bell body */}
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            />
            {/* Bell clapper/bottom sound indicator */}
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m13.73 21a2 2 0 0 1-3.46 0"
            />
        </svg>
        {unreadCount > 0 && (
            <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
            </span>
        )}
        </button>

      
        {/* <button className="bell-button" onClick={handleBellClick}>
        <svg
            className="bell-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10 2C7.79086 2 6 3.79086 6 6V9L4 11H16L14 9V6C14 3.79086 12.2091 2 10 2Z" />
            <path d="M8.5 14C8.5 15.1046 9.39543 16 10.5 16C11.6046 16 12.5 15.1046 12.5 14H8.5Z" />
        </svg>
        {unreadCount > 0 && (
            <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
            </span>
        )}
        </button> */}

      {/* <button className="bell-button" onClick={handleBellClick}>
        <svg
            className="bell-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"
            />
            <path
            strokeLinecap="round"
            strokeLinejoin="round" 
            strokeWidth={2}
            d="M13.73 21a2 2 0 0 1-3.46 0"
            />
        </svg>
        {unreadCount > 0 && (
            <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
            </span>
        )}
        </button> */}

      {dropdownOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
                disabled={markingAllAsRead}
              >
                {markingAllAsRead ? 'Marking...' : 'Mark all as read'}
              </button>
            )}
          </div>

          <div className="notification-content">
            {loading ? (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                <svg className="no-notifications-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.notificationType)}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <span className="notification-time">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    {!notification.isRead && (
                      <div className="unread-indicator"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button className="view-all-btn">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;