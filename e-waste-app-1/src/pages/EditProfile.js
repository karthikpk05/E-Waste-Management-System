// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import Loader, { PageLoader } from '../components/Loader';
// import { authService } from '../services/authService';
// import { validateEmail, validatePhone, validateRequired } from '../utils/validation';

// const EditProfile = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     pickupAddress: '',
//     profilePicture: ''
//   });
//   const [originalData, setOriginalData] = useState({});
//   const [errors, setErrors] = useState({});
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     setLoading(true);
//     try {
//       const response = await authService.getUserProfile();
//       const userData = response.data;
//       setProfileData(userData);
//       setOriginalData(userData);
//     } catch (error) {
//       setNotification({ type: 'error', message: 'Failed to load profile data' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!validateRequired(profileData.name)) {
//       newErrors.name = 'Name is required';
//     }

//     if (!validateRequired(profileData.email)) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(profileData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!validateRequired(profileData.phone)) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!validatePhone(profileData.phone)) {
//       newErrors.phone = 'Please enter a valid 10-digit phone number';
//     }

//     if (!validateRequired(profileData.pickupAddress)) {
//       newErrors.pickupAddress = 'Pickup address is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setSaving(true);
//     setNotification({ type: '', message: '' });

//     try {
//       await authService.updateUserProfile(profileData);
//       setOriginalData(profileData);
//       setNotification({ type: 'success', message: 'Profile updated successfully!' });
      
//       setTimeout(() => {
//         navigate('/user');
//       }, 2000);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to update profile';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setProfileData(originalData);
//     setErrors({});
//     setNotification({ type: '', message: '' });
//     navigate('/user');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({
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

//   if (loading) {
//     return (
//       <div>
//         <Navbar title="Edit Profile" />
//         <PageLoader text="Loading profile..." />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">
//       <Navbar title="Edit Profile" />
      
//       <div className="form-container">
//         <div className="card">
//           <div className="form-header">
//             <h2 className="form-title">Edit Profile</h2>
//             <button 
//               onClick={() => navigate('/user')}
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

//           {/* Profile Picture */}
//           <div className="profile-picture-section centered">
//             {profileData.profilePicture ? (
//               <img
//                 src={profileData.profilePicture}
//                 alt="Profile"
//                 className="profile-pic-extra-large"
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                   e.target.nextSibling.style.display = 'flex';
//                 }}
//               />
//             ) : null}
//             <div 
//               className={`profile-placeholder-extra-large ${profileData.profilePicture ? 'hidden' : ''}`}
//             >
//               <span>
//                 {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
//               </span>
//             </div>
//           </div>

//           <form className="profile-form">
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Full Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={profileData.name}
//                   onChange={handleChange}
//                   placeholder="Enter your full name"
//                   className="form-input"
//                 />
//                 {errors.name && <span className="error-text">{errors.name}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Email *</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={profileData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email"
//                   className="form-input"
//                 />
//                 {errors.email && <span className="error-text">{errors.email}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Phone Number *</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={profileData.phone}
//                   onChange={handleChange}
//                   placeholder="Enter your phone number"
//                   className="form-input"
//                 />
//                 {errors.phone && <span className="error-text">{errors.phone}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Profile Picture URL</label>
//                 <input
//                   type="url"
//                   name="profilePicture"
//                   value={profileData.profilePicture}
//                   onChange={handleChange}
//                   placeholder="Enter profile picture URL"
//                   className="form-input"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Pickup Address *</label>
//               <input
//                 type="text"
//                 name="pickupAddress"
//                 value={profileData.pickupAddress}
//                 onChange={handleChange}
//                 placeholder="Enter your pickup address"
//                 className="form-input"
//               />
//               {errors.pickupAddress && <span className="error-text">{errors.pickupAddress}</span>}
//             </div>

//             <div className="form-actions">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="btn btn-secondary"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="btn btn-primary"
//               >
//                 {saving && <Loader size="small" />}
//                 <span>{saving ? 'Saving...' : 'Save Changes'}</span>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;

// import Loader, { PageLoader } from '../components/Loader';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import LocationMapSelector from '../components/LocationMapSelector';
import { authService } from '../services/authService';
import { validateEmail, validatePhone, validateRequired } from '../utils/validation';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickupAddress: '',
    pickupLatitude: null,
    pickupLongitude: null,
    profilePicture: ''
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getUserProfile();
      const userData = response.data;
      
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        pickupAddress: userData.pickupAddress || '',
        pickupLatitude: userData.pickupLatitude || null,
        pickupLongitude: userData.pickupLongitude || null,
        profilePicture: userData.profilePicture || ''
      });

      // Set initial location if coordinates exist
      if (userData.pickupLatitude && userData.pickupLongitude) {
        setSelectedLocation({
          latitude: userData.pickupLatitude,
          longitude: userData.pickupLongitude,
          formattedAddress: userData.pickupAddress
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setNotification({ 
        type: 'error', 
        message: 'Failed to load profile data' 
      });
    } finally {
      setInitialLoading(false);
    }
  };

  // Handle location selection from map
  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setFormData(prev => ({
      ...prev,
      pickupAddress: locationData.formattedAddress,
      pickupLatitude: locationData.latitude,
      pickupLongitude: locationData.longitude
    }));
    
    // Clear any pickup address errors
    if (errors.pickupAddress) {
      setErrors(prev => ({ ...prev, pickupAddress: '' }));
    }
  };
  // const handleCancel = () => {
  //   setProfileData(originalData);
  //   setErrors({});
  //   setNotification({ type: '', message: '' });
  //   navigate('/user');
  // };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!validateRequired(formData.pickupAddress)) {
      newErrors.pickupAddress = 'Pickup address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      // Include location coordinates in update data
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        pickupAddress: formData.pickupAddress,
        pickupLatitude: formData.pickupLatitude,
        pickupLongitude: formData.pickupLongitude,
        profilePicture: formData.profilePicture
      };

      await authService.updateUserProfile(updateData);
      setNotification({ 
        type: 'success', 
        message: 'Profile updated successfully!' 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
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

  if (initialLoading) {
    return (
      <div>
        <Navbar title="Update Profile" />
        <div className="dashboard-page">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '300px' 
          }}>
            <div>Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar title="Update Profile" />
      
      <div className="dashboard-container">
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="form-header">
            <h2 className="form-title">Update Your Profile</h2>
            <button 
              onClick={() => navigate('/user')}
              className="btn btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>

          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ type: '', message: '' })}
          />

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
              {/* Left Column - Personal Details */}
              <div>
                <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Personal Information</h3>
                
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                  {errors.name && <div className="error-text">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label>Email (Read-only)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="form-input"
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#6c757d', fontSize: '12px' }}>
                    Email cannot be changed
                  </small>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit phone number"
                    className="form-input"
                  />
                  {errors.phone && <div className="error-text">{errors.phone}</div>}
                </div>

                <div className="form-group">
                  <label>Profile Picture URL (Optional)</label>
                  <input
                    type="url"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    placeholder="Enter profile picture URL"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Right Column - Location Selection */}
              <div>
                <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Pickup Location</h3>
                
                <div className="form-group">
                  <label>Update Pickup Address *</label>
                  <div style={{ marginBottom: '8px', fontSize: '14px', color: '#6c757d' }}>
                    Click on the map to update your pickup location
                  </div>
                  <LocationMapSelector
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleLocationSelect}
                    height="350px"
                    showSearch={true}
                    center={selectedLocation ? [selectedLocation.latitude, selectedLocation.longitude] : [11.0168, 76.9558]}
                    zoom={selectedLocation ? 15 : 13}
                  />
                  {errors.pickupAddress && <div className="error-text">{errors.pickupAddress}</div>}
                </div>

                {selectedLocation && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '10px', 
                    backgroundColor: '#e8f5e8', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    <strong>Current Location:</strong><br />
                    {selectedLocation.formattedAddress}
                    <br />
                    <small style={{ color: '#6c757d' }}>
                      Coordinates: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              {/* <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button> */}
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ minWidth: '200px' }}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="card" style={{ maxWidth: '900px', margin: '20px auto', backgroundColor: '#f8f9fa' }}>
          <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Profile Update Information</h4>
          <ul style={{ paddingLeft: '20px', color: '#6c757d', margin: 0 }}>
            <li>Your email address cannot be changed for security reasons</li>
            <li>Update your pickup location to ensure accurate service delivery</li>
            <li>You can search for your address or click directly on the map</li>
            <li>All changes will be saved to your account immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;