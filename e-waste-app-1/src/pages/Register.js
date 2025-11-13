
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Notification from '../components/Notification';
// // import RecyclingBackground from '../components/RecyclingBackground';
// import { validateEmail, validatePhone, validatePassword, validateRequired } from '../utils/validation';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     pickupAddress: '',
//     profilePicture: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [loading, setLoading] = useState(false);

//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};

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

//     if (!validateRequired(formData.pickupAddress)) {
//       newErrors.pickupAddress = 'Pickup address is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setNotification({ type: '', message: '' });

//     try {
//       await register(formData);
//       setNotification({ type: 'success', message: 'Registration successful! Please login.' });
      
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
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
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   return (
//     <div className="container">
//       <div className="header">
//         <h1>E-Waste Management System</h1>
//       </div>

//       <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
//         <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>User Registration</h2>

//         <Notification
//           type={notification.type}
//           message={notification.message}
//           onClose={() => setNotification({ type: '', message: '' })}
//         />

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Full Name *</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//             />
//             {errors.name && <div className="error-text">{errors.name}</div>}
//           </div>

//           <div className="form-group">
//             <label>Email *</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//             />
//             {errors.email && <div className="error-text">{errors.email}</div>}
//           </div>

//           <div className="form-group">
//             <label>Password *</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password (min. 6 characters)"
//             />
//             {errors.password && <div className="error-text">{errors.password}</div>}
//           </div>

//           <div className="form-group">
//             <label>Phone Number *</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="Enter your 10-digit phone number"
//             />
//             {errors.phone && <div className="error-text">{errors.phone}</div>}
//           </div>

//           <div className="form-group">
//             <label>Pickup Address *</label>
//             <input
//               type="text"
//               name="pickupAddress"
//               value={formData.pickupAddress}
//               onChange={handleChange}
//               placeholder="Enter your pickup address"
//             />
//             {errors.pickupAddress && <div className="error-text">{errors.pickupAddress}</div>}
//           </div>
//           <div className="form-group">
//             <label>Profile Picture URL (Optional)</label>
//             <input
//               type="url"
//               name="profilePicture"
//               value={formData.profilePicture}
//               onChange={handleChange}
//               placeholder="Enter profile picture URL"
//             />
//           </div>
//           <button
//             type="submit"
//             className="btn btn-primary"
//             style={{ width: '100%', marginBottom: '20px' }}
//             disabled={loading}
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </form>
//         <div style={{ textAlign: 'center' }}>
//           <p>Already have an account? <Link to="/login">Login here</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Register;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Notification from '../components/Notification';
import LocationMapSelector from '../components/LocationMapSelector';
import { validateEmail, validatePhone, validatePassword, validateRequired } from '../utils/validation';
import { AlignCenter } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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

  const { register } = useAuth();
  const navigate = useNavigate();

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

  const validateForm = () => {
    const newErrors = {};

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
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Location validation
    if (!selectedLocation || !formData.pickupLatitude || !formData.pickupLongitude) {
      newErrors.pickupAddress = 'Please select your pickup location on the map';
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
      // Include location coordinates in registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        pickupAddress: formData.pickupAddress,
        pickupLatitude: formData.pickupLatitude,
        pickupLongitude: formData.pickupLongitude,
        profilePicture: formData.profilePicture
      };

      await register(registrationData);
      setNotification({ type: 'success', message: 'Registration successful! Please login.' });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
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
    <div className="container">
      <div className="header">
        <h1>E-Waste Management System</h1>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>User Registration</h2>

        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: '', message: '' })}
        />

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Left Column - Personal Details */}
            <div>
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
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password (min. 6 characters)"
                  className="form-input"
                />
                {errors.password && <div className="error-text">{errors.password}</div>}
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
              <div className="form-group">
                <label>Pickup Location *</label>
                <div style={{ marginBottom: '8px', fontSize: '14px', color: '#6c757d' }}>
                  Select your pickup address from the map below
                </div>
                <LocationMapSelector
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  height="350px"
                  showSearch={true}
                  center={[11.0168, 76.9558]} // Default to Tiruppur, Tamil Nadu
                  zoom={13}
                />
                {errors.pickupAddress && <div className="error-text">{errors.pickupAddress}</div>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '30px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '20px' }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>

      {/* Registration Info */}
      <div className="card" style={{ maxWidth: '800px', margin: '20px auto', backgroundColor: '#f8f9fa' }}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Registration Information</h3>
        <ul style={{ paddingLeft: '20px', color: '#6c757d' }}>
          <li>All fields marked with (*) are required</li>
          <li>Select your pickup location accurately on the map</li>
          <li>You can search for your address or click directly on the map</li>
          <li>After registration, you can submit e-waste pickup requests from your dashboard</li>
        </ul>
      </div>
    </div>
  );
};

export default Register;