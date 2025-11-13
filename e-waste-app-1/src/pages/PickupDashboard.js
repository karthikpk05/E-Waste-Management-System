import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import StatCard from '../components/StatCard';
import { PageLoader } from '../components/Loader';
import EnhancedImageModal from '../components/EnhancedImageModal';
import PickupMapView from '../components/PickupMapView';
import { pickupService } from '../services/pickupService';

// OTP Modal Component (unchanged)
const OtpModal = ({ request, closeModal, onVerify }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onVerify(request.requestId || request.id, otp);
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Enter OTP</h3>
          <button onClick={closeModal} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <div className="request-summary">
            <h4>{request.deviceType} - {request.brand} {request.model}</h4>
            <p>User: {request.userName || request.user?.name || 'Unknown User'}</p>
            <p>The user should have received an OTP via email. Please ask them for the OTP to complete the pickup.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>OTP *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="form-input"
                maxLength="6"
                autoFocus
              />
              {error && <div className="error-text">{error}</div>}
            </div>

            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PickupDashboard = () => {
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [completingRequest, setCompletingRequest] = useState(null);
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    fetchPickupData();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Could not get current location:', error);
          // Set default location to Tiruppur, Tamil Nadu if geolocation fails
          setCurrentLocation({
            latitude: 11.0168,
            longitude: 76.9558
          });
        }
      );
    } else {
      // Set default location if geolocation is not supported
      setCurrentLocation({
        latitude: 11.0168,
        longitude: 76.9558
      });
    }
  };

  const fetchPickupData = async () => {
    setLoading(true);
    try {
      const [assignedResponse, completedResponse] = await Promise.all([
        pickupService.getAssignedPickups(),
        pickupService.getCompletedPickups()
      ]);

      const assignedData = assignedResponse.data || [];
      const completedData = completedResponse.data || [];

      // Log the data to see what we're getting from backend
      console.log('Assigned pickups data:', assignedData);
      
      // Count pickups with valid location data
      const pickupsWithLocation = assignedData.filter(pickup => 
        pickup.latitude != null && pickup.longitude != null
      );
      
      console.log(`Total assigned pickups: ${assignedData.length}`);
      console.log(`Pickups with location data: ${pickupsWithLocation.length}`);

      setAssignedPickups(assignedData);
      setCompletedPickups(completedData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load pickup data';
      setNotification({ type: 'error', message: errorMessage });
      console.error('Error fetching pickup data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePickup = async (request) => {
    const requestId = request.requestId || request.id;
    setCompletingRequest(requestId);
    
    try {
      await pickupService.completePickup(requestId);
      setSelectedRequest(request);
      setShowOtpModal(true);
      setNotification({ 
        type: 'success', 
        message: 'OTP has been sent to the user. Please ask them for the OTP.' 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to initiate pickup completion';
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setCompletingRequest(null);
    }
  };

  const handleVerifyOtp = async (requestId, otp) => {
    await pickupService.verifyOtp(requestId, otp);
    setNotification({ 
      type: 'success', 
      message: 'Pickup completed successfully!' 
    });
    await fetchPickupData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setSelectedRequest(null);
  };

  const openImageModal = (images, startIndex = 0) => {
    if (images && images.length > 0) {
      setSelectedImages(images);
      setInitialImageIndex(startIndex);
      setShowEnhancedModal(true);
    }
  };

  const closeImageModal = () => {
    setShowEnhancedModal(false);
    setSelectedImages([]);
    setInitialImageIndex(0);
  };

  const handleGetDirections = (pickup) => {
    if (!pickup.latitude || !pickup.longitude) {
      setNotification({ 
        type: 'error', 
        message: 'Location data not available for this pickup' 
      });
      return;
    }

    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pickup.latitude},${pickup.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Filter pickups that have valid location data
  const pickupsWithLocation = assignedPickups.filter(pickup => 
    pickup.latitude != null && pickup.longitude != null
  );

  if (loading) {
    return (
      <div>
        <Navbar title="Pickup Dashboard" />
        <PageLoader text="Loading pickups..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar title="Pickup Dashboard" />
      
      <div className="dashboard-container">
        {/* Notification */}
        {notification.message && (
          <div className="notification-wrapper">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification({ type: '', message: '' })}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard
            title="Assigned Pickups"
            count={assignedPickups.length}
            color="blue"
            icon="scheduled"
          />
          {/* <StatCard
            title="With Location Data"
            count={pickupsWithLocation.length}
            color="green"
            icon="approved"
          /> */}
          <StatCard
            title="Total Completed"
            count={completedPickups.length}
            color="purple"
            icon="total"
          />
        </div>

        {/* Assigned Pickups with Map/List Toggle */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Assigned Pickups</h2>
            <div className="header-actions">
              <div className="view-toggle" style={{ marginRight: '10px' }}>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ marginRight: '5px' }}
                >
                  List View
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={pickupsWithLocation.length === 0}
                  title={pickupsWithLocation.length === 0 ? 'No pickups with location data available' : ''}
                >
                  Map View ({pickupsWithLocation.length})
                </button>
              </div>
              <button onClick={fetchPickupData} className="btn btn-secondary">
                Refresh
              </button>
            </div>
          </div>

          {assignedPickups.length === 0 ? (
            <div className="empty-state">
              <p>No assigned pickups found.</p>
            </div>
          ) : (
            <>
              {/* Map View */}
              {viewMode === 'map' && (
                <div style={{ marginTop: '20px' }}>
                  {pickupsWithLocation.length > 0 ? (
                    <PickupMapView
                      pickups={pickupsWithLocation}
                      height="500px"
                      showRoutes={true}
                      currentLocation={currentLocation}
                      onGetDirections={handleGetDirections}
                    />
                  ) : (
                    <div className="empty-state">
                      <h3>No Location Data Available</h3>
                      <p>None of your assigned pickups have location coordinates.</p>
                      <small>
                        Location data is only available for requests submitted after the map feature was added.
                        <br />
                        New requests will automatically include location data.
                      </small>
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="pickups-list">
                  {assignedPickups.map(pickup => (
                    <div key={pickup.requestId || pickup.id} className="pickup-card" style={{
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '16px',
                      backgroundColor: '#fff'
                    }}>
                      <div className="pickup-header" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                            {pickup.deviceType} - {pickup.brand} {pickup.model}
                          </h3>
                          <p style={{ margin: '0', color: '#6c757d', fontSize: '14px' }}>
                            Scheduled: {formatDate(pickup.pickupDateTime)}
                          </p>
                          {pickup.latitude && pickup.longitude && (
                            <div style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              marginTop: '4px',
                              padding: '2px 8px',
                              backgroundColor: '#e8f5e8',
                              color: '#2e7d32',
                              borderRadius: '12px',
                              fontSize: '12px'
                            }}>
                              📍 Location Available
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {pickup.latitude && pickup.longitude && (
                            <button
                              onClick={() => handleGetDirections(pickup)}
                              className="btn btn-success"
                              style={{ minWidth: '120px' }}
                            >
                              Get Directions
                            </button>
                          )}
                          <button
                            onClick={() => handleCompletePickup(pickup)}
                            disabled={completingRequest === (pickup.requestId || pickup.id)}
                            className="btn btn-primary"
                            style={{ minWidth: '120px' }}
                          >
                            {completingRequest === (pickup.requestId || pickup.id) ? 'Processing...' : 'Complete Pickup'}
                          </button>
                        </div>
                      </div>

                      <div className="pickup-details" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                          <div>
                            <strong>User:</strong> {pickup.userName || pickup.user?.name || 'Unknown'}
                          </div>
                          <div>
                            <strong>Email:</strong> {pickup.userEmail || pickup.user?.email || 'N/A'}
                          </div>
                          <div>
                            <strong>Phone:</strong> {pickup.userPhone || pickup.user?.phone || 'N/A'}
                          </div>
                          <div>
                            <strong>Condition:</strong> {pickup.condition}
                          </div>
                          <div>
                            <strong>Quantity:</strong> {pickup.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="pickup-address" style={{ marginBottom: '16px' }}>
                        <strong>Pickup Address:</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#495057' }}>{pickup.pickupAddress}</p>
                        {pickup.latitude && pickup.longitude ? (
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                            📍 Coordinates: {pickup.latitude.toFixed(6)}, {pickup.longitude.toFixed(6)}
                          </p>
                        ) : (
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#dc3545' }}>
                            ⚠️ No location coordinates available
                          </p>
                        )}
                      </div>

                      {pickup.remarks && (
                        <div className="pickup-remarks" style={{ marginBottom: '16px' }}>
                          <strong>Remarks:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#495057' }}>{pickup.remarks}</p>
                        </div>
                      )}

                      {/* Images */}
                      {pickup.imagePaths && pickup.imagePaths.length > 0 && (
                        <div className="pickup-images">
                          <strong>Images ({pickup.imagePaths.length}):</strong>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {pickup.imagePaths.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={`http://localhost:8080/files/${image}`}
                                alt="Device"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  border: '1px solid #dee2e6',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                                onClick={() => openImageModal(pickup.imagePaths, index)}
                                onMouseEnter={(e) => {
                                  e.target.style.borderColor = '#007bff';
                                  e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.borderColor = '#dee2e6';
                                  e.target.style.transform = 'scale(1)';
                                }}
                              />
                            ))}
                            {pickup.imagePaths.length > 3 && (
                              <div 
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #dee2e6',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  color: '#6c757d',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                                onClick={() => openImageModal(pickup.imagePaths, 3)}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#e9ecef';
                                  e.target.style.borderColor = '#007bff';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = '#f8f9fa';
                                  e.target.style.borderColor = '#dee2e6';
                                }}
                              >
                                +{pickup.imagePaths.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Completed Pickups */}
        <div className="card">
          <h2 className="section-title">Recent Completed Pickups</h2>
          
          {completedPickups.length === 0 ? (
            <div className="empty-state">
              <p>No completed pickups yet.</p>
            </div>
          ) : (
            <div className="completed-pickups-table">
              <table>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>User</th>
                    <th>Completed Date</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {completedPickups.slice(0, 10).map(pickup => (
                    <tr key={pickup.requestId || pickup.id}>
                      <td>{pickup.deviceType} - {pickup.brand} {pickup.model}</td>
                      <td>{pickup.userName || pickup.user?.name || 'Unknown'}</td>
                      <td>{formatDate(pickup.completedAt || pickup.updatedAt)}</td>
                      <td>{pickup.pickupAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {showEnhancedModal && selectedImages.length > 0 && (
        <EnhancedImageModal
          images={selectedImages}
          initialIndex={initialImageIndex}
          closeModal={closeImageModal}
        />
      )}

      {/* OTP Modal */}
      {showOtpModal && selectedRequest && (
        <OtpModal
          request={selectedRequest}
          closeModal={closeOtpModal}
          onVerify={handleVerifyOtp}
        />
      )}
    </div>
  );
};

export default PickupDashboard;

// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import StatCard from '../components/StatCard';
// import { PageLoader } from '../components/Loader';
// import EnhancedImageModal from '../components/EnhancedImageModal';
// import PickupMapView from '../components/PickupMapView';
// import { pickupService } from '../services/pickupService';

// // OTP Modal Component
// const OtpModal = ({ request, closeModal, onVerify }) => {
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!otp.trim()) {
//       setError('Please enter the OTP');
//       return;
//     }

//     setLoading(true);
//     setError('');
    
//     try {
//       await onVerify(request.requestId || request.id, otp);
//       closeModal();
//     } catch (error) {
//       setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={closeModal}>
//       <div className="modal-content" onClick={e => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>Enter OTP</h3>
//           <button onClick={closeModal} className="modal-close">×</button>
//         </div>
//         <div className="modal-body">
//           <div className="request-summary">
//             <h4>{request.deviceType} - {request.brand} {request.model}</h4>
//             <p>User: {request.userName || request.user?.name || 'Unknown User'}</p>
//             <p>The user should have received an OTP via email. Please ask them for the OTP to complete the pickup.</p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>OTP *</label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter 6-digit OTP"
//                 className="form-input"
//                 maxLength="6"
//                 autoFocus
//               />
//               {error && <div className="error-text">{error}</div>}
//             </div>

//             <div className="modal-actions">
//               <button type="button" onClick={closeModal} className="btn btn-secondary">
//                 Cancel
//               </button>
//               <button type="submit" disabled={loading} className="btn btn-primary">
//                 {loading ? 'Verifying...' : 'Verify OTP'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PickupDashboard = () => {
//   const [assignedPickups, setAssignedPickups] = useState([]);
//   const [completedPickups, setCompletedPickups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [completingRequest, setCompletingRequest] = useState(null);
//   const [showEnhancedModal, setShowEnhancedModal] = useState(false);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [initialImageIndex, setInitialImageIndex] = useState(0);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [showMapView, setShowMapView] = useState(false);

//   useEffect(() => {
//     fetchPickupData();
//     getCurrentLocation();
//   }, []);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//           });
//         },
//         (error) => {
//           console.log('Could not get current location:', error);
//           // Set default location to Tiruppur, Tamil Nadu if geolocation fails
//           setCurrentLocation({
//             latitude: 11.0168,
//             longitude: 76.9558
//           });
//         }
//       );
//     } else {
//       // Set default location if geolocation is not supported
//       setCurrentLocation({
//         latitude: 11.0168,
//         longitude: 76.9558
//       });
//     }
//   };

//   const fetchPickupData = async () => {
//     setLoading(true);
//     try {
//       const [assignedResponse, completedResponse] = await Promise.all([
//         pickupService.getAssignedPickups(),
//         pickupService.getCompletedPickups()
//       ]);

//       // Filter out pickups that don't have location data and add default if missing
//       const processedAssigned = (assignedResponse.data || []).map(pickup => ({
//         ...pickup,
//         latitude: pickup.latitude || 11.0168, // Default to Tiruppur if missing
//         longitude: pickup.longitude || 76.9558
//       }));

//       setAssignedPickups(processedAssigned);
//       setCompletedPickups(completedResponse.data || []);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to load pickup data';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCompletePickup = async (request) => {
//     const requestId = request.requestId || request.id;
//     setCompletingRequest(requestId);
    
//     try {
//       // Step 1: Generate and send OTP to user
//       await pickupService.completePickup(requestId);
      
//       // Step 2: Show OTP input modal
//       setSelectedRequest(request);
//       setShowOtpModal(true);
      
//       setNotification({ 
//         type: 'success', 
//         message: 'OTP has been sent to the user. Please ask them for the OTP.' 
//       });
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to initiate pickup completion';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setCompletingRequest(null);
//     }
//   };

//   const handleVerifyOtp = async (requestId, otp) => {
//     await pickupService.verifyOtp(requestId, otp);
//     setNotification({ 
//       type: 'success', 
//       message: 'Pickup completed successfully!' 
//     });
    
//     // Refresh the pickup data
//     await fetchPickupData();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const closeOtpModal = () => {
//     setShowOtpModal(false);
//     setSelectedRequest(null);
//   };

//   const openImageModal = (images, startIndex = 0) => {
//     if (images && images.length > 0) {
//       setSelectedImages(images);
//       setInitialImageIndex(startIndex);
//       setShowEnhancedModal(true);
//     }
//   };

//   const closeImageModal = () => {
//     setShowEnhancedModal(false);
//     setSelectedImages([]);
//     setInitialImageIndex(0);
//   };

//   const handleGetDirections = (pickup) => {
//     // Open Google Maps with directions from current location to pickup location
//     const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${pickup.latitude},${pickup.longitude}&travelmode=driving`;
//     window.open(url, '_blank');
//   };

//   if (loading) {
//     return (
//       <div>
//         <Navbar title="Pickup Dashboard" />
//         <PageLoader text="Loading pickups..." />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">
//       <Navbar title="Pickup Dashboard" />
      
//       <div className="dashboard-container">
//         {/* Notification */}
//         {notification.message && (
//           <div className="notification-wrapper">
//             <Notification
//               type={notification.type}
//               message={notification.message}
//               onClose={() => setNotification({ type: '', message: '' })}
//             />
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="stats-grid">
//           <StatCard
//             title="Assigned Pickups"
//             count={assignedPickups.length}
//             color="blue"
//             icon="scheduled"
//           />
//           <StatCard
//             title="Total Completed"
//             count={completedPickups.length}
//             color="purple"
//             icon="total"
//           />
//         </div>

//         {/* Map Toggle */}
//         {assignedPickups.length > 0 && (
//           <div className="card">
//             <div className="section-header">
//               <h2 className="section-title">Pickup Locations</h2>
//               <div className="header-actions">
//                 <button 
//                   onClick={() => setShowMapView(!showMapView)} 
//                   className={`btn ${showMapView ? 'btn-secondary' : 'btn-primary'}`}
//                 >
//                   {showMapView ? 'Hide Map' : 'Show Map'}
//                 </button>
//                 <button onClick={fetchPickupData} className="btn btn-secondary">
//                   Refresh
//                 </button>
//               </div>
//             </div>

//             {showMapView && (
//               <div style={{ marginTop: '20px' }}>
//                 <PickupMapView
//                   pickups={assignedPickups}
//                   currentLocation={currentLocation}
//                   height="500px"
//                   showRoutes={true}
//                   onGetDirections={handleGetDirections}
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Assigned Pickups */}
//         <div className="card">
//           <div className="section-header">
//             <h2 className="section-title">Assigned Pickups</h2>
//             <button onClick={fetchPickupData} className="btn btn-secondary">
//               Refresh
//             </button>
//           </div>

//           {assignedPickups.length === 0 ? (
//             <div className="empty-state">
//               <p>No assigned pickups found.</p>
//             </div>
//           ) : (
//             <div className="pickups-list">
//               {assignedPickups.map(pickup => (
//                 <div key={pickup.requestId || pickup.id} className="pickup-card" style={{
//                   border: '1px solid #dee2e6',
//                   borderRadius: '8px',
//                   padding: '20px',
//                   marginBottom: '16px',
//                   backgroundColor: '#fff'
//                 }}>
//                   <div className="pickup-header" style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'flex-start',
//                     marginBottom: '16px'
//                   }}>
//                     <div>
//                       <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
//                         {pickup.deviceType} - {pickup.brand} {pickup.model}
//                       </h3>
//                       <p style={{ margin: '0', color: '#6c757d', fontSize: '14px' }}>
//                         Scheduled: {formatDate(pickup.pickupDateTime)}
//                       </p>
//                     </div>
//                     <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//                       <button
//                         onClick={() => handleGetDirections(pickup)}
//                         className="btn btn-success"
//                         style={{ minWidth: '120px' }}
//                         disabled={!currentLocation}
//                       >
//                         Get Directions
//                       </button>
//                       <button
//                         onClick={() => handleCompletePickup(pickup)}
//                         disabled={completingRequest === (pickup.requestId || pickup.id)}
//                         className="btn btn-primary"
//                         style={{ minWidth: '120px' }}
//                       >
//                         {completingRequest === (pickup.requestId || pickup.id) ? 'Processing...' : 'Complete Pickup'}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="pickup-details" style={{ marginBottom: '16px' }}>
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
//                       <div>
//                         <strong>User:</strong> {pickup.userName || pickup.user?.name || 'Unknown'}
//                       </div>
//                       <div>
//                         <strong>Email:</strong> {pickup.userEmail || pickup.user?.email || 'N/A'}
//                       </div>
//                       <div>
//                         <strong>Phone:</strong> {pickup.userPhone || pickup.user?.phone || 'N/A'}
//                       </div>
//                       <div>
//                         <strong>Condition:</strong> {pickup.condition}
//                       </div>
//                       <div>
//                         <strong>Quantity:</strong> {pickup.quantity}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="pickup-address" style={{ marginBottom: '16px' }}>
//                     <strong>Pickup Address:</strong>
//                     <p style={{ margin: '4px 0 0 0', color: '#495057' }}>{pickup.pickupAddress}</p>
//                     {pickup.latitude && pickup.longitude && (
//                       <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
//                         Coordinates: {pickup.latitude.toFixed(6)}, {pickup.longitude.toFixed(6)}
//                       </p>
//                     )}
//                   </div>

//                   {pickup.remarks && (
//                     <div className="pickup-remarks" style={{ marginBottom: '16px' }}>
//                       <strong>Remarks:</strong>
//                       <p style={{ margin: '4px 0 0 0', color: '#495057' }}>{pickup.remarks}</p>
//                     </div>
//                   )}

//                   {/* Images */}
//                   {pickup.imagePaths && pickup.imagePaths.length > 0 && (
//                     <div className="pickup-images">
//                       <strong>Images ({pickup.imagePaths.length}):</strong>
//                       <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
//                         {pickup.imagePaths.slice(0, 3).map((image, index) => (
//                           <img
//                             key={index}
//                             src={`http://localhost:8080/files/${image}`}
//                             alt="Device"
//                             style={{
//                               width: '80px',
//                               height: '80px',
//                               objectFit: 'cover',
//                               borderRadius: '4px',
//                               border: '1px solid #dee2e6',
//                               cursor: 'pointer',
//                               transition: 'all 0.3s ease'
//                             }}
//                             onClick={() => openImageModal(pickup.imagePaths, index)}
//                             onMouseEnter={(e) => {
//                               e.target.style.borderColor = '#007bff';
//                               e.target.style.transform = 'scale(1.05)';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.borderColor = '#dee2e6';
//                               e.target.style.transform = 'scale(1)';
//                             }}
//                           />
//                         ))}
//                         {pickup.imagePaths.length > 3 && (
//                           <div 
//                             style={{
//                               width: '80px',
//                               height: '80px',
//                               backgroundColor: '#f8f9fa',
//                               border: '1px solid #dee2e6',
//                               borderRadius: '4px',
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               fontSize: '12px',
//                               color: '#6c757d',
//                               cursor: 'pointer',
//                               transition: 'all 0.3s ease'
//                             }}
//                             onClick={() => openImageModal(pickup.imagePaths, 3)}
//                             onMouseEnter={(e) => {
//                               e.target.style.backgroundColor = '#e9ecef';
//                               e.target.style.borderColor = '#007bff';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.backgroundColor = '#f8f9fa';
//                               e.target.style.borderColor = '#dee2e6';
//                             }}
//                           >
//                             +{pickup.imagePaths.length - 3} more
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Completed Pickups */}
//         <div className="card">
//           <h2 className="section-title">Recent Completed Pickups</h2>
          
//           {completedPickups.length === 0 ? (
//             <div className="empty-state">
//               <p>No completed pickups yet.</p>
//             </div>
//           ) : (
//             <div className="completed-pickups-table">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Device</th>
//                     <th>User</th>
//                     <th>Completed Date</th>
//                     <th>Address</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {completedPickups.slice(0, 10).map(pickup => (
//                     <tr key={pickup.requestId || pickup.id}>
//                       <td>{pickup.deviceType} - {pickup.brand} {pickup.model}</td>
//                       <td>{pickup.userName || pickup.user?.name || 'Unknown'}</td>
//                       <td>{formatDate(pickup.completedAt || pickup.updatedAt)}</td>
//                       <td>{pickup.pickupAddress}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enhanced Image Modal */}
//       {showEnhancedModal && selectedImages.length > 0 && (
//         <EnhancedImageModal
//           images={selectedImages}
//           initialIndex={initialImageIndex}
//           closeModal={closeImageModal}
//         />
//       )}

//       {/* OTP Modal */}
//       {showOtpModal && selectedRequest && (
//         <OtpModal
//           request={selectedRequest}
//           closeModal={closeOtpModal}
//           onVerify={handleVerifyOtp}
//         />
//       )}
//     </div>
//   );
// };

// export default PickupDashboard;
