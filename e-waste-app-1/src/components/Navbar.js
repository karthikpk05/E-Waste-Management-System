// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import NotificationBell from "./NotificationBell";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     // Close dropdown when clicking outside
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev);
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   return (
//     <nav className="custom-navbar">
//       <div className="navbar-container">
//         <div className="navbar-content">
//           {/* Left Side Brand */}
//           <div className="navbar-title">
//             <h1>E-Waste Management</h1>
//           </div>

//           {/* Right Side - Notifications & Profile */}
//           <div className="navbar-right">
//             {/* Notification Bell - Only show for users */}
//             {user?.role === 'user' && <NotificationBell />}
            
//             {/* Profile Dropdown */}
//             <div className="profile-dropdown" ref={dropdownRef}>
//               <button className="profile-button" onClick={toggleDropdown}>
//                 <div className="profile-avatar">
//                   {/* Profile Photo */}
//                   {user?.profilePicture ? (
//                     <img
//                       src={user.profilePicture}
//                       alt="Profile"
//                       className="profile-image"
//                       onError={(e) => {
//                         e.target.style.display = "none";
//                         e.target.nextSibling.style.display = "flex";
//                       }}
//                     />
//                   ) : null}

//                   {/* Fallback to first letter of username */}
//                   <div
//                     className={`profile-placeholder ${
//                       user?.profilePicture ? "hidden" : ""
//                     }`}
//                   >
//                     <span>
//                       {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//                     </span>
//                   </div>
//                 </div>
//               </button>

//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <div className="dropdown-user-info">
//                     <p className="user-name">{user?.name || "User"}</p>
//                     <p className="user-email">{user?.email || ""}</p>
//                   </div>
//                   <div className="dropdown-items">
//                     {user?.role === "admin" ? (
//                       <button
//                         className="dropdown-item"
//                         onClick={() => navigate("/admin/add-pickup-person")}
//                       >
//                         Add Pickup Person
//                       </button>
//                     ) : (
//                       <button
//                         className="dropdown-item"
//                         onClick={() => navigate("/user/edit-profile")}
//                       >
//                         Edit Profile
//                       </button>
//                     )}
//                     <button
//                       className="dropdown-item logout"
//                       onClick={handleLogout}
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Left Side Brand */}
          <div className="navbar-title">
            <h1>E-Waste Management</h1>
          </div>

          {/* Right Side - Notifications & Profile */}
          <div className="navbar-right">
            {/* Notification Bell - Only show for users */}
            {user?.role === 'user' && <NotificationBell />}
            
            {/* Profile Dropdown */}
            <div className="profile-dropdown" ref={dropdownRef}>
              <button className="profile-button" onClick={toggleDropdown}>
                <div className="profile-avatar">
                  {/* Profile Photo */}
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="profile-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* Fallback to first letter of username */}
                  <div
                    className={`profile-placeholder ${
                      user?.profilePicture ? "hidden" : ""
                    }`}
                  >
                    <span>
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                </div>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-user-info">
                    <p className="user-name">{user?.name || "User"}</p>
                    <p className="user-email">{user?.email || ""}</p>
                  </div>
                  <div className="dropdown-items">
                    {/* Admin: Show Add Pickup Person */}
                    {user?.role === "admin" && (
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/admin/add-pickup-person");
                          setDropdownOpen(false);
                        }}
                      >
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Add Pickup Person
                      </button>
                    )}

                    {/* User: Show Edit Profile */}
                    {user?.role === "user" && (
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/user/edit-profile");
                          setDropdownOpen(false);
                        }}
                      >
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                    )}

                    {/* Pickup: No additional menu items, only logout */}

                    {/* Logout: Available for all roles */}
                    <button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;