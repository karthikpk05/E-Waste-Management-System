// // Updated AddPickupPerson component to use new API structure with password field
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import Loader from '../components/Loader';
// import { adminService } from '../services/adminService';
// import { validateRequired, validateEmail, validatePhone, validatePassword } from '../utils/validation';

// const AddPickupPerson = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',  
//     name: '',
//     email: '',
//     password: '', // Added password field as required by backend
//     phone: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [loading, setLoading] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!validateRequired(formData.username)) {
//       newErrors.username = 'Username is required';
//     }

//     if (!validateRequired(formData.name)) {
//       newErrors.name = 'Name is required';
//     }

//     if (!validateRequired(formData.email)) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!validateRequired(formData.password)) {
//       newErrors.password = 'Password is required';
//     } else if (!validatePassword(formData.password)) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!validateRequired(formData.phone)) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!validatePhone(formData.phone)) {
//       newErrors.phone = 'Please enter a valid 10-digit phone number';
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
//       // Use the updated service method
//       await adminService.addPickupPerson(formData);
//       setNotification({ type: 'success', message: 'Pickup person added successfully!' });
      
//       setTimeout(() => {
//         navigate('/admin');
//       }, 2000);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to add pickup person. Please try again.';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   return (
//     <div className="dashboard-page">
//       <Navbar title="Add Pickup Person" />
//       {loading && <Loader />}
      
//       <div className="form-container">
//         <div className="card">
//           <div className="form-header">
//             <h2 className="form-title">Add New Pickup Person</h2>
//             <button 
//               onClick={() => navigate('/admin')} 
//               className="btn btn-secondary"
//             >
//               Back to Dashboard
//             </button>
//           </div>

//           {notification.message && (
//             <div className="notification-wrapper">
//               <Notification
//                 type={notification.type}
//                 message={notification.message}
//                 onClose={() => setNotification({ type: '', message: '' })}
//               />
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="profile-form">
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>User Name *</label>
//                 <input
//                       type="text"
//                       name="username"
//                       value={formData.username}
//                       onChange={handleChange}
//                       placeholder="Enter username"
//                       className="form-input"
//                 />
//                 {errors.username && <span className="error-text">{errors.username}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Email *</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter email address"
//                   className="form-input"
//                 />
//                 {errors.email && <span className="error-text">{errors.email}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Password *</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter password (min. 6 characters)"
//                   className="form-input"
//                 />
//                 {errors.password && <span className="error-text">{errors.password}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Phone Number *</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="Enter phone number"
//                   className="form-input"
//                 />
//                 {errors.phone && <span className="error-text">{errors.phone}</span>}
//               </div>
//             </div>

//             <div className="form-actions">
//               <button
//                 type="button"
//                 onClick={() => navigate('/admin')}
//                 className="btn btn-secondary"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="btn btn-primary"
//               >
//                 {loading && <Loader size="small" />}
//                 <span>{loading ? 'Adding...' : 'Add Person'}</span>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPickupPerson;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import { adminService } from '../services/adminService';
import { validateRequired, validateEmail, validatePhone, validatePassword, validateUsername } from '../utils/validation';

const AddPickupPerson = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',  
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.username)) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
    }

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
      await adminService.addPickupPerson(formData);
      setNotification({ 
        type: 'success', 
        message: 'Pickup person added successfully!' 
      });
      
      // Clear form
      setFormData({
        username: '',
        name: '',
        email: '',
        password: '',
        phone: ''
      });
      
      // Navigate back after success
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error adding pickup person:', error);
      let errorMessage = 'Failed to add pickup person. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Please check all required fields and try again.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Username or email already exists.';
      }
      
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar title="Add Pickup Person" />
      {loading && <Loader />}
      
      <div className="form-container">
        <div className="card">
          <div className="form-header">
            <h2 className="form-title">Add New Pickup Person</h2>
            <button 
              onClick={() => navigate('/admin')} 
              className="btn btn-secondary"
              type="button"
            >
              Back to Dashboard
            </button>
          </div>

          {notification.message && (
            <div className="notification-wrapper">
              <Notification
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ type: '', message: '' })}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password (min. 6 characters)"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <Loader size="small" />
                    <span>Adding...</span>
                  </>
                ) : (
                  'Add Person'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPickupPerson;