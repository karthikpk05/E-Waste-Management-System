// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Notification from '../components/Notification';
// import { validateEmail, validateRequired } from '../utils/validation';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};

//     if (!validateRequired(formData.email)) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!validateRequired(formData.password)) {
//       newErrors.password = 'Password is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     setNotification({ type: '', message: '' });

//     try {
//       // Try to login - the backend will determine the role
//       const user = await login(formData);
      
//       setNotification({ type: 'success', message: 'Login successful!' });

//       // Redirect based on the user's role
//       setTimeout(() => {
//         switch (user.role) {
//           case 'admin':
//             navigate('/admin');
//             break;
//           case 'pickup':
//             navigate('/pickup');
//             break;
//           case 'user':
//           default:
//             navigate('/user');
//             break;
//         }
//       }, 1000);
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || 'Login failed. Please check your credentials.';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   return (
//     <div className="login-container">
//       <button 
//         className="back-to-home"
//         onClick={() => navigate('/')}
//       > 
//         ← Back to Home
//       </button>
//       <div className="login-content">
//         <div className="login-header">
//           <h1>E-Waste Management System</h1>
//         </div>

//         <div className="login-card">
//           <h2>Welcome Back</h2>
//           <p className="login-subtitle">Sign in to your account</p>

//           <Notification
//             type={notification.type}
//             message={notification.message}
//             onClose={() => setNotification({ type: '', message: '' })}
//           />

//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className={errors.email ? 'error' : ''}
//               />
//               {errors.email && <div className="error-text">{errors.email}</div>}
//             </div>

//             <div className="form-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 className={errors.password ? 'error' : ''}
//               />
//               {errors.password && (
//                 <div className="error-text">{errors.password}</div>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="login-btn"
//               disabled={loading}
//             >
//               {loading ? (
//                 <span>
//                   <div className="spinner"></div>
//                   Logging in...
//                 </span>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           <div className="register-link">
//             <p>
//               Don't have an account? <Link to="/register">Register here</Link>
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .login-container {
//           min-height: 100vh;
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: linear-gradient(135deg, #667eea04 0%, #ffffff01 100%);
//           padding: 20px;
//         }

//         .login-content {
//           position: relative;
//           z-index: 10;
//           width: 100%;
//           max-width: 450px;
//           margin-right: 450px;
//         }

//         .login-header {
//           text-align: center;
//           margin-bottom: 30px;
//         }

//         .back-to-home {
//           background: rgba(255, 255, 255, 0.2);
//           color: black;
//           border: 1px solid rgba(0, 0, 0, 1);
//           padding: 10px 20px;
//           border-radius: 25px;
//           cursor: pointer;
//           font-size: 14px;
//           margin-bottom: 700px;
//           margin-right: 300px;
//           backdrop-filter: blur(10px);
//           transition: all 0.3s ease;
//         }

//         .back-to-home:hover {
//           background: rgba(255, 255, 255, 0.3);
//           transform: translateY(-2px);
//         }

//         .login-header h1 {
//           color: black;
//           font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
//           font-size: 32px;
//           font-weight: 700;
//           margin: 0;
//           text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
//         }

//         .login-card {
//           background: rgba(254, 254, 254, 0.95);
//           backdrop-filter: blur(20px);
//           border-radius: 20px;
//           padding: 40px;
//           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.3);
//         }

//         .login-card h2 {
//           text-align: center;
//           color: #1f2937;
//           font-size: 28px;
//           font-weight: 700;
//           margin: 0 0 10px 0;
//         }

//         .login-subtitle {
//           text-align: center;
//           color: #6b7280;
//           font-size: 14px;
//           margin: 0 0 30px 0;
//         }

//         .form-group {
//           margin-bottom: 20px;
//         }

//         .form-group label {
//           display: block;
//           color: #374151;
//           font-weight: 600;
//           margin-bottom: 8px;
//         }

//         .form-group input {
//           width: 100%;
//           padding: 14px 16px;
//           border: 2px solid #e5e7eb;
//           border-radius: 10px;
//           font-size: 16px;
//           transition: all 0.3s ease;
//           background: white;
//           box-sizing: border-box;
//         }

//         .form-group input:focus {
//           outline: none;
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//         }

//         .form-group input.error {
//           border-color: #ef4444;
//         }

//         .error-text {
//           color: #ef4444;
//           font-size: 14px;
//           margin-top: 5px;
//         }

//         .login-btn {
//           width: 100%;
//           padding: 16px;
//           border: none;
//           border-radius: 12px;
//           font-size: 16px;
//           font-weight: 600;
//           color: white;
//           background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
//           cursor: pointer;
//           transition: all 0.3s ease;
//           margin-bottom: 20px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//         }

//         .login-btn:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
//         }

//         .login-btn:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .spinner {
//           width: 16px;
//           height: 16px;
//           border: 2px solid rgba(255, 255, 255, 0.3);
//           border-top: 2px solid white;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .register-link {
//           text-align: center;
//           color: #6b7280;
//         }

//         .register-link a {
//           color: #3b82f6;
//           text-decoration: none;
//           font-weight: 600;
//         }

//         .register-link a:hover {
//           text-decoration: underline;
//         }

//         /* Responsive Design */
//         @media (max-width: 480px) {
//           .login-card {
//             padding: 30px 20px;
//           }

//           .login-header h1 {
//             font-size: 24px;
//           }

//           .login-card h2 {
//             font-size: 24px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Notification from '../components/Notification';
import { validateEmail, validateRequired } from '../utils/validation';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      // Try to login - the backend will determine the role
      const user = await login(formData);
      
      setNotification({ type: 'success', message: 'Login successful!' });

      // Redirect based on the user's role
      setTimeout(() => {
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'pickup':
            navigate('/pickup');
            break;
          case 'user':
          default:
            navigate('/user');
            break;
        }
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="login-container">
      <button 
        className="back-to-home"
        onClick={() => navigate('/')}
      > 
        ← Back to Home
      </button>
      <div className="login-content">
        <div className="login-header">
          <h1>E-Waste Management System</h1>
        </div>

        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Log in to your account</p>

          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ type: '', message: '' })}
          />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <div className="error-text">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <div className="spinner"></div>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea04 0%, #ffffff01 100%);
          padding: 20px;
        }

        .login-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 450px;
          margin-right: 450px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .back-to-home {
          background: rgba(255, 255, 255, 0.2);
          color: black;
          border: 1px solid rgba(0, 0, 0, 1);
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 700px;
          margin-right: 300px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .back-to-home:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .login-header h1 {
          color: black;
          font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .login-card {
          background: rgba(254, 254, 254, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .login-card h2 {
          text-align: center;
          color: #1f2937;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 10px 0;
        }

        .login-subtitle {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 30px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #374151;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input.error {
          border-color: #ef4444;
        }

        .error-text {
          color: #ef4444;
          font-size: 14px;
          margin-top: 5px;
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .register-link {
          text-align: center;
          color: #6b7280;
        }

        .register-link a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }

          .login-header h1 {
            font-size: 24px;
          }

          .login-card h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;