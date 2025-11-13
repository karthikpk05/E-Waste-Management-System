// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import Loader from '../components/Loader';
// import { requestService } from '../services/requestService';
// import { authService } from '../services/authService';
// import { validateRequired } from '../utils/validation';

// const EwasteRequestForm = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     deviceType: '',
//     customDeviceType: '',
//     brand: '',
//     model: '',
//     condition: '',
//     quantity: 1,
//     pickupAddress: '',
//     pickupTimeSlot: '',
//     remarks: ''
//   });
  
//   const [images, setImages] = useState({
//     leftView: null,
//     rightView: null,
//     topView: null,
//     bottomView: null,
//     overallView: null
//   });
  
//   const [imagePreviews, setImagePreviews] = useState({
//     leftView: null,
//     rightView: null,
//     topView: null,
//     bottomView: null,
//     overallView: null
//   });
  
//   const [errors, setErrors] = useState({});
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [loading, setLoading] = useState(false);
//   const [dragActive, setDragActive] = useState({
//     leftView: false,
//     rightView: false,
//     topView: false,
//     bottomView: false,
//     overallView: false
//   });

//   const deviceTypes = [
//     'Laptop','Mobile','TV','Printer','Desktop Computer',
//     'Tablet','Monitor','Keyboard','Mouse','Router','Camera','Other'
//   ];

//   const conditions = ['Working', 'Damaged', 'Dead'];

//   const timeSlots = [
//     '9:00 AM - 12:00 PM',
//     '12:00 PM - 3:00 PM',
//     '3:00 PM - 6:00 PM',
//     'Any Time'
//   ];

//   const imageTypes = [
//     { key: 'leftView', label: 'Left View', required: true },
//     { key: 'rightView', label: 'Right View', required: true },
//     { key: 'topView', label: 'Top View', required: true },
//     { key: 'bottomView', label: 'Bottom View', required: true },
//     { key: 'overallView', label: 'Overall View', required: true }
//   ];

//   useEffect(() => {
//     if (user?.pickupAddress) {
//       setFormData(prev => ({ ...prev, pickupAddress: user.pickupAddress }));
//     } else {
//       fetchUserProfile();
//     }
//   }, [user]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await authService.getUserProfile();
//       const userData = response.data;
//       if (userData.pickupAddress) {
//         setFormData(prev => ({ ...prev, pickupAddress: userData.pickupAddress }));
//       }
//     } catch (error) {
//       console.error('Failed to fetch user profile:', error);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Existing validations
//     if (!validateRequired(formData.deviceType)) newErrors.deviceType = 'Device type is required';
//     if (formData.deviceType === 'Other' && !validateRequired(formData.customDeviceType)) {
//       newErrors.customDeviceType = 'Please specify the device type';
//     }
//     if (!validateRequired(formData.brand)) newErrors.brand = 'Brand is required';
//     if (!validateRequired(formData.model)) newErrors.model = 'Model is required';
//     if (!validateRequired(formData.condition)) newErrors.condition = 'Condition is required';
//     if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
//     if (!validateRequired(formData.pickupAddress)) newErrors.pickupAddress = 'Pickup address is required';
//     if (!validateRequired(formData.pickupTimeSlot)) newErrors.pickupTimeSlot = 'Preferred time slot is required';
    
//     // Image validations
//     imageTypes.forEach(({ key, label, required }) => {
//       if (required && !images[key]) {
//         newErrors[key] = `${label} image is required`;
//       }
//     });
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleDrag = (e, imageType) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(prev => ({ ...prev, [imageType]: true }));
//     } else if (e.type === "dragleave") {
//       setDragActive(prev => ({ ...prev, [imageType]: false }));
//     }
//   };

//   const handleDrop = (e, imageType) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(prev => ({ ...prev, [imageType]: false }));
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileSelect(e.dataTransfer.files[0], imageType);
//     }
//   };

//   const handleImageChange = (e, imageType) => {
//     if (e.target.files && e.target.files[0]) {
//       handleFileSelect(e.target.files[0], imageType);
//     }
//   };

//   const handleFileSelect = (file, imageType) => {
//     if (!file.type.startsWith('image/')) {
//       setNotification({ type: 'error', message: 'Only image files are allowed' });
//       return;
//     }
    
//     if (file.size > 5 * 1024 * 1024) {
//       setNotification({ type: 'error', message: 'Each image must be under 5MB' });
//       return;
//     }

//     // Update images state
//     setImages(prev => ({ ...prev, [imageType]: file }));
    
//     // Clear error for this image type
//     if (errors[imageType]) {
//       setErrors(prev => ({ ...prev, [imageType]: '' }));
//     }

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setImagePreviews(prev => ({ 
//         ...prev, 
//         [imageType]: { url: e.target.result, name: file.name }
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const removeImage = (e, imageType) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setImages(prev => ({ ...prev, [imageType]: null }));
//     setImagePreviews(prev => ({ ...prev, [imageType]: null }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     setLoading(true);
//     setNotification({ type: '', message: '' });
    
//     try {
//       const submitData = new FormData();
//       const deviceType = formData.deviceType === 'Other' ? formData.customDeviceType : formData.deviceType;
      
//       // Add form data
//       submitData.append('deviceType', deviceType);
//       submitData.append('brand', formData.brand);
//       submitData.append('model', formData.model);
//       submitData.append('condition', formData.condition);
//       submitData.append('quantity', formData.quantity);
//       submitData.append('pickupAddress', formData.pickupAddress);
//       submitData.append('pickupTimeSlot', formData.pickupTimeSlot);
//       submitData.append('remarks', formData.remarks);
      
//       // Add images with specific names
//       Object.entries(images).forEach(([key, file]) => {
//         if (file) {
//           submitData.append('images', file, `${key}_${file.name}`);
//         }
//       });
      
//       await requestService.submitRequest(submitData);
//       setNotification({ type: 'success', message: 'E-waste request submitted successfully!' });
//       setTimeout(() => navigate('/user/my-requests'), 2000);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to submit request. Please try again.';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard-page">
//       <Navbar title="Submit E-waste Request" />
//       {loading && <Loader />}
//       <div className="form-container">
//         <div className="card">
//           <div className="form-header">
//             <h2 className="form-title">New E-waste Request</h2>
//             <button onClick={() => navigate('/user')} className="btn btn-secondary">
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

//           <form onSubmit={handleSubmit} className="request-form">
//             <div className="form-grid">
//               {/* Device Type */}
//               <div className="form-group">
//                 <label>Device Type *</label>
//                 <select
//                   name="deviceType"
//                   value={formData.deviceType}
//                   onChange={handleChange}
//                   className="form-input"
//                 >
//                   <option value="">Select device type</option>
//                   {deviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
//                 </select>
//                 {errors.deviceType && <span className="error-text">{errors.deviceType}</span>}
//               </div>

//               {formData.deviceType === 'Other' && (
//                 <div className="form-group">
//                   <label>Specify Device Type *</label>
//                   <input
//                     type="text"
//                     name="customDeviceType"
//                     value={formData.customDeviceType}
//                     onChange={handleChange}
//                     placeholder="e.g. Smart Watch, Gaming Console"
//                     className="form-input"
//                   />
//                   {errors.customDeviceType && <span className="error-text">{errors.customDeviceType}</span>}
//                 </div>
//               )}

//               {/* Brand */}
//               <div className="form-group">
//                 <label>Brand *</label>
//                 <input
//                   type="text"
//                   name="brand"
//                   value={formData.brand}
//                   onChange={handleChange}
//                   placeholder="e.g. Apple, Samsung, HP"
//                   className="form-input"
//                 />
//                 {errors.brand && <span className="error-text">{errors.brand}</span>}
//               </div>

//               {/* Model */}
//               <div className="form-group">
//                 <label>Model *</label>
//                 <input
//                   type="text"
//                   name="model"
//                   value={formData.model}
//                   onChange={handleChange}
//                   placeholder="e.g. iPhone 12, MacBook Pro"
//                   className="form-input"
//                 />
//                 {errors.model && <span className="error-text">{errors.model}</span>}
//               </div>

//               {/* Condition */}
//               <div className="form-group">
//                 <label>Condition *</label>
//                 <select
//                   name="condition"
//                   value={formData.condition}
//                   onChange={handleChange}
//                   className="form-input"
//                 >
//                   <option value="">Select condition</option>
//                   {conditions.map(c => <option key={c} value={c}>{c}</option>)}
//                 </select>
//                 {errors.condition && <span className="error-text">{errors.condition}</span>}
//               </div>

//               {/* Quantity */}
//               <div className="form-group">
//                 <label>Quantity *</label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                   min="1"
//                   className="form-input"
//                 />
//                 {errors.quantity && <span className="error-text">{errors.quantity}</span>}
//               </div>

//               {/* Pickup Time Slot */}
//               <div className="form-group">
//                 <label>Preferred Pickup Time *</label>
//                 <select
//                   name="pickupTimeSlot"
//                   value={formData.pickupTimeSlot}
//                   onChange={handleChange}
//                   className="form-input"
//                 >
//                   <option value="">Select preferred time</option>
//                   {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
//                 </select>
//                 {errors.pickupTimeSlot && <span className="error-text">{errors.pickupTimeSlot}</span>}
//               </div>

//               {/* Pickup Address */}
//               <div className="form-group full-width">
//                 <label>Pickup Address *</label>
//                 <textarea
//                   name="pickupAddress"
//                   value={formData.pickupAddress}
//                   onChange={handleChange}
//                   placeholder="Enter pickup address"
//                   className="form-input"
//                   rows="3"
//                 />
//                 {errors.pickupAddress && <span className="error-text">{errors.pickupAddress}</span>}
//               </div>

//               {/* Remarks */}
//               <div className="form-group full-width">
//                 <label>Additional Remarks</label>
//                 <textarea
//                   name="remarks"
//                   value={formData.remarks}
//                   onChange={handleChange}
//                   placeholder="Optional notes about the device"
//                   className="form-input"
//                   rows="3"
//                 />
//               </div>

//               {/* Image Upload Zones */}
//               <div className="images-section full-width">
//                 <h3 className="images-title">Device Images (All 5 photos required) *</h3>
//                 <div className="images-grid">
//                   {imageTypes.map(({ key, label, required }) => (
//                     <div key={key} className="image-upload-zone">
//                       <label className="image-label">
//                         {label} {required && '*'}
//                       </label>
//                       <div className="image-upload-container">
//                         <div
//                           className={`file-drop-zone-small ${dragActive[key] ? 'active' : ''} ${imagePreviews[key] ? 'has-image' : ''}`}
//                           onDragEnter={(e) => handleDrag(e, key)}
//                           onDragOver={(e) => handleDrag(e, key)}
//                           onDragLeave={(e) => handleDrag(e, key)}
//                           onDrop={(e) => handleDrop(e, key)}
//                         >
//                           {imagePreviews[key] ? (
//                             <div className="image-preview-small">
//                               <img src={imagePreviews[key].url} alt={label} />
//                               <div className="image-overlay">
//                                 <span className="image-name">{imagePreviews[key].name}</span>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="drop-zone-content">
//                               <div className="drop-icon">📷</div>
//                               <p className="drop-text">Drop image or click</p>
//                               <p className="drop-subtext">{label}</p>
//                             </div>
//                           )}
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => handleImageChange(e, key)}
//                             className="file-input"
//                           />
//                         </div>
//                         {imagePreviews[key] && (
//                           <button 
//                             type="button" 
//                             onClick={(e) => removeImage(e, key)} 
//                             className="remove-btn-small"
//                           >
//                             ×
//                           </button>
//                         )}
//                       </div>
//                       {errors[key] && <span className="error-text">{errors[key]}</span>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="form-actions">
//               <button type="submit" className="btn btn-primary">Submit Request</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EwasteRequestForm;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import LocationMapSelector from '../components/LocationMapSelector';
import { requestService } from '../services/requestService';
import { authService } from '../services/authService';
import { validateRequired } from '../utils/validation';

const EwasteRequestForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    deviceType: '',
    customDeviceType: '',
    brand: '',
    model: '',
    condition: '',
    quantity: 1,
    pickupAddress: '',
    pickupTimeSlot: '',
    remarks: '',
    // New location fields
    latitude: null,
    longitude: null
  });
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const [images, setImages] = useState({
    leftView: null,
    rightView: null,
    topView: null,
    bottomView: null,
    overallView: null
  });
  
  const [imagePreviews, setImagePreviews] = useState({
    leftView: null,
    rightView: null,
    topView: null,
    bottomView: null,
    overallView: null
  });
  
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState({
    leftView: false,
    rightView: false,
    topView: false,
    bottomView: false,
    overallView: false
  });

  const deviceTypes = [
    'Laptop','Mobile','TV','Printer','Desktop Computer',
    'Tablet','Monitor','Keyboard','Mouse','Router','Camera','Other'
  ];

  const conditions = ['Working', 'Damaged', 'Dead'];

  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    'Any Time'
  ];

  const imageTypes = [
    { key: 'leftView', label: 'Left View', required: true },
    { key: 'rightView', label: 'Right View', required: true },
    { key: 'topView', label: 'Top View', required: true },
    { key: 'bottomView', label: 'Bottom View', required: true },
    { key: 'overallView', label: 'Overall View', required: true }
  ];

  useEffect(() => {
    if (user?.pickupAddress) {
      setFormData(prev => ({ ...prev, pickupAddress: user.pickupAddress }));
    } else {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getUserProfile();
      const userData = response.data;
      if (userData.pickupAddress) {
        setFormData(prev => ({ ...prev, pickupAddress: userData.pickupAddress }));
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  // Handle location selection from map
  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setFormData(prev => ({
      ...prev,
      pickupAddress: locationData.formattedAddress,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    }));
    
    // Clear any location-related errors
    if (errors.pickupAddress) {
      setErrors(prev => ({ ...prev, pickupAddress: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Existing validations
    if (!validateRequired(formData.deviceType)) newErrors.deviceType = 'Device type is required';
    if (formData.deviceType === 'Other' && !validateRequired(formData.customDeviceType)) {
      newErrors.customDeviceType = 'Please specify the device type';
    }
    if (!validateRequired(formData.brand)) newErrors.brand = 'Brand is required';
    if (!validateRequired(formData.model)) newErrors.model = 'Model is required';
    if (!validateRequired(formData.condition)) newErrors.condition = 'Condition is required';
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    
    // Location validations
    if (!selectedLocation || !formData.latitude || !formData.longitude) {
      newErrors.pickupAddress = 'Please select a pickup location on the map';
    }
    if (!validateRequired(formData.pickupTimeSlot)) newErrors.pickupTimeSlot = 'Preferred time slot is required';
    
    // Image validations
    imageTypes.forEach(({ key, label, required }) => {
      if (required && !images[key]) {
        newErrors[key] = `${label} image is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDrag = (e, imageType) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [imageType]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [imageType]: false }));
    }
  };

  const handleDrop = (e, imageType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [imageType]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0], imageType);
    }
  };

  const handleImageChange = (e, imageType) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0], imageType);
    }
  };

  const handleFileSelect = (file, imageType) => {
    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', message: 'Only image files are allowed' });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setNotification({ type: 'error', message: 'Each image must be under 5MB' });
      return;
    }

    // Update images state
    setImages(prev => ({ ...prev, [imageType]: file }));
    
    // Clear error for this image type
    if (errors[imageType]) {
      setErrors(prev => ({ ...prev, [imageType]: '' }));
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreviews(prev => ({ 
        ...prev, 
        [imageType]: { url: e.target.result, name: file.name }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e, imageType) => {
    e.preventDefault();
    e.stopPropagation();
    setImages(prev => ({ ...prev, [imageType]: null }));
    setImagePreviews(prev => ({ ...prev, [imageType]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setNotification({ type: '', message: '' });
    
    try {
      const submitData = new FormData();
      const deviceType = formData.deviceType === 'Other' ? formData.customDeviceType : formData.deviceType;
      
      // Add form data including location
      submitData.append('deviceType', deviceType);
      submitData.append('brand', formData.brand);
      submitData.append('model', formData.model);
      submitData.append('condition', formData.condition);
      submitData.append('quantity', formData.quantity);
      submitData.append('pickupAddress', formData.pickupAddress);
      submitData.append('pickupTimeSlot', formData.pickupTimeSlot);
      submitData.append('remarks', formData.remarks);
      
      // Add location coordinates
      submitData.append('latitude', formData.latitude);
      submitData.append('longitude', formData.longitude);
      
      // Add images with specific names
      Object.entries(images).forEach(([key, file]) => {
        if (file) {
          submitData.append('images', file, `${key}_${file.name}`);
        }
      });
      
      await requestService.submitRequest(submitData);
      setNotification({ type: 'success', message: 'E-waste request submitted successfully!' });
      setTimeout(() => navigate('/user/my-requests'), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit request. Please try again.';
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar title="Submit E-waste Request" />
      {loading && <Loader />}
      <div className="form-container">
        <div className="card">
          <div className="form-header">
            <h2 className="form-title">New E-waste Request</h2>
            <button onClick={() => navigate('/user')} className="btn btn-secondary">
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

          <form onSubmit={handleSubmit} className="request-form">
            <div className="form-grid">
              {/* Device Type */}
              <div className="form-group">
                <label>Device Type *</label>
                <select
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select device type</option>
                  {deviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.deviceType && <span className="error-text">{errors.deviceType}</span>}
              </div>

              {formData.deviceType === 'Other' && (
                <div className="form-group">
                  <label>Specify Device Type *</label>
                  <input
                    type="text"
                    name="customDeviceType"
                    value={formData.customDeviceType}
                    onChange={handleChange}
                    placeholder="e.g. Smart Watch, Gaming Console"
                    className="form-input"
                  />
                  {errors.customDeviceType && <span className="error-text">{errors.customDeviceType}</span>}
                </div>
              )}

              {/* Brand */}
              <div className="form-group">
                <label>Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Apple, Samsung, HP"
                  className="form-input"
                />
                {errors.brand && <span className="error-text">{errors.brand}</span>}
              </div>

              {/* Model */}
              <div className="form-group">
                <label>Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 12, MacBook Pro"
                  className="form-input"
                />
                {errors.model && <span className="error-text">{errors.model}</span>}
              </div>

              {/* Condition */}
              <div className="form-group">
                <label>Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select condition</option>
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.condition && <span className="error-text">{errors.condition}</span>}
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="form-input"
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>

              {/* Pickup Time Slot */}
              <div className="form-group">
                <label>Preferred Pickup Time *</label>
                <select
                  name="pickupTimeSlot"
                  value={formData.pickupTimeSlot}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select preferred time</option>
                  {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
                {errors.pickupTimeSlot && <span className="error-text">{errors.pickupTimeSlot}</span>}
              </div>

              {/* Location Selection */}
              <div className="form-group full-width">
                <label>Pickup Location *</label>
                <LocationMapSelector
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  height="350px"
                  showSearch={true}
                />
                {errors.pickupAddress && <span className="error-text">{errors.pickupAddress}</span>}
              </div>

              {/* Remarks */}
              <div className="form-group full-width">
                <label>Additional Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Optional notes about the device"
                  className="form-input"
                  rows="3"
                />
              </div>

              {/* Image Upload Zones */}
              <div className="images-section full-width">
                <h3 className="images-title">Device Images (All 5 photos required) *</h3>
                <div className="images-grid">
                  {imageTypes.map(({ key, label, required }) => (
                    <div key={key} className="image-upload-zone">
                      <label className="image-label">
                        {label} {required && '*'}
                      </label>
                      <div className="image-upload-container">
                        <div
                          className={`file-drop-zone-small ${dragActive[key] ? 'active' : ''} ${imagePreviews[key] ? 'has-image' : ''}`}
                          onDragEnter={(e) => handleDrag(e, key)}
                          onDragOver={(e) => handleDrag(e, key)}
                          onDragLeave={(e) => handleDrag(e, key)}
                          onDrop={(e) => handleDrop(e, key)}
                        >
                          {imagePreviews[key] ? (
                            <div className="image-preview-small">
                              <img src={imagePreviews[key].url} alt={label} />
                              <div className="image-overlay">
                                <span className="image-name">{imagePreviews[key].name}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="drop-zone-content">
                              <div className="drop-icon">📷</div>
                              <p className="drop-text">Drop image or click</p>
                              <p className="drop-subtext">{label}</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, key)}
                            className="file-input"
                          />
                        </div>
                        {imagePreviews[key] && (
                          <button 
                            type="button" 
                            onClick={(e) => removeImage(e, key)} 
                            className="remove-btn-small"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      {errors[key] && <span className="error-text">{errors[key]}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EwasteRequestForm;