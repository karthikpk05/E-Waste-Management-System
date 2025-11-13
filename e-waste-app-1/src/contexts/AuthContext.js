// // Updated AuthContext to support pickup person role and separate login endpoints
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { authService } from "../services/authService";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load user & token from localStorage safely
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (storedToken) setToken(storedToken);

//     if (storedUser && storedUser !== "undefined") {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Failed to parse stored user:", error);
//         localStorage.removeItem("user");
//         setUser(null);
//       }
//     }

//     setLoading(false);
//   }, []);

//   // Updated login function to support three roles: user, admin, pickup
//   const login = async (credentials, userType = 'user') => {
//     try {
//       let response;
      
//       // Call appropriate login endpoint based on user type
//       switch (userType) {
//         case 'admin':
//           response = await authService.loginAdmin(credentials);
//           break;
//         case 'pickup':
//           response = await authService.loginPickup(credentials);
//           break;
//         case 'user':
//         default:
//           response = await authService.loginUser(credentials);
//           break;
//       }

//       const {
//         accessToken,
//         refreshToken,
//         principal,
//         name,
//         email,
//         profilePicture,
//         phone
//       } = response.data;

//       // Save tokens
//       localStorage.setItem("token", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       // Build user object with backend fields
//       const userWithRole = {
//         name,
//         email,
//         profilePicture,
//         phone,
//         role: principal?.toLowerCase(), // "user", "admin", or "pickup"
//       };

//       setUser(userWithRole);
//       setToken(accessToken);

//       localStorage.setItem("user", JSON.stringify(userWithRole));

//       return userWithRole;
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     }
//   };

//   // Register function (unchanged)
//   const register = async (userData) => {
//     try {
//       const response = await authService.register(userData);
//       return response;
//     } catch (error) {
//       console.error("Registration failed:", error);
//       throw error;
//     }
//   };

//   // Logout function (unchanged)
//   const logout = async () => {
//     try {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       if (storedUser?.email) {
//         await authService.logout(storedUser.email);
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("user");
//       setToken(null);
//       setUser(null);
//     }
//   };

//   const value = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     loading,
//   };

//   return (
//     <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user & token from localStorage safely
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // Updated login function - tries all endpoints to determine role
  const login = async (credentials) => {
    try {
      let response = null;
      let loginError = null;

      // Try user login first
      try {
        response = await authService.loginUser(credentials);
      } catch (err) {
        loginError = err;
      }

      // If user login fails, try admin login
      if (!response) {
        try {
          response = await authService.loginAdmin(credentials);
        } catch (err) {
          loginError = err;
        }
      }

      // If admin login fails, try pickup login
      if (!response) {
        try {
          response = await authService.loginPickup(credentials);
        } catch (err) {
          loginError = err;
        }
      }

      // If all login attempts fail, throw the last error
      if (!response) {
        throw loginError || new Error("Login failed");
      }

      const {
        accessToken,
        refreshToken,
        principal,
        name,
        email,
        profilePicture,
        phone
      } = response.data;

      // Save tokens
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Build user object with backend fields
      const userWithRole = {
        name,
        email,
        profilePicture,
        phone,
        role: principal?.toLowerCase(), // "user", "admin", or "pickup"
      };

      setUser(userWithRole);
      setToken(accessToken);

      localStorage.setItem("user", JSON.stringify(userWithRole));

      return userWithRole;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Register function (unchanged)
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Logout function (unchanged)
  const logout = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.email) {
        await authService.logout(storedUser.email);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};