// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import StatCard from '../components/StatCard';
// import { PageLoader } from '../components/Loader';
// import { requestService } from '../services/requestService';

// const MyRequests = () => {
//   const navigate = useNavigate();
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [requestStats, setRequestStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     scheduled: 0
//   });

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const response = await requestService.getMyRequests();
//       const requestsData = response.data || [];
//       setRequests(requestsData);

//       const stats = {
//         total: requestsData.length,
//         pending: requestsData.filter(r => r.status === 'PENDING').length,
//         approved: requestsData.filter(r => r.status === 'APPROVED').length,
//         rejected: requestsData.filter(r => r.status === 'REJECTED').length,
//         scheduled: requestsData.filter(r => r.status === 'SCHEDULED').length
//       };
//       setRequestStats(stats);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to load requests';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
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

//   const formatPickupDateTime = (date, time) => {
//     if (!date || !time) return 'N/A';
//     return `${new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })} at ${time}`;
//   };

//   const openImageModal = (images) => {
//     if (images && images.length > 0) {
//       setSelectedImages(images);
//       setShowImageModal(true);
//     }
//   };

//   const closeImageModal = () => {
//     setShowImageModal(false);
//     setSelectedImages([]);
//   };

//   if (loading) {
//     return (
//       <div>
//         <Navbar title="My E-waste Requests" />
//         <PageLoader text="Loading requests..." />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">
//       <Navbar title="My E-waste Requests" />
      
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
//           <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//           <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//           <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//           <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//           <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
//         </div>

//         {/* Main Content */}
//         <div className="card">
//           <div className="section-header">
//             <h2 className="section-title">My Requests</h2>
//             <div className="header-actions">
//               <button onClick={fetchRequests} className="btn btn-secondary">
//                 Refresh
//               </button>
//               <button onClick={() => navigate('/user/submit-request')} className="btn btn-primary">
//                 New Request
//               </button>
//               <button onClick={() => navigate('/user')} className="btn btn-secondary">
//                 Back to Dashboard
//               </button>
//             </div>
//           </div>

//           {requests.length === 0 ? (
//             <div className="empty-state">
//               <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//               <p className="empty-text">No requests found</p>
//               <button onClick={() => navigate('/user/submit-request')} className="btn btn-primary">
//                 Submit Your First Request
//               </button>
//             </div>
//           ) : (
//             <div className="requests-list">
//               {requests.map((request) => (
//                 <div key={request.id} className="request-card">
//                   <div className="request-header">
//                     <div className="request-info">
//                       <h3 className="request-title">
//                         {request.deviceType} - {request.brand} {request.model}
//                       </h3>
//                       <p className="request-date">
//                         Submitted: {formatDate(request.createdAt)}
//                       </p>
//                     </div>
//                     <div className="request-status">
//                       {getStatusBadge(request.status)}
//                     </div>
//                   </div>

//                   <div className="request-details">
//                     <div className="detail-item">
//                       <span className="detail-label">Condition:</span>
//                       <span className="detail-value">{request.condition}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="detail-label">Quantity:</span>
//                       <span className="detail-value">{request.quantity}</span>
//                     </div>
//                     {request.pickupTimeSlot && (
//                       <div className="detail-item">
//                         <span className="detail-label">Preferred Time:</span>
//                         <span className="detail-value">{request.pickupTimeSlot}</span>
//                       </div>
//                     )}
//                     <div className="detail-item detail-full">
//                       <span className="detail-label">Pickup Address:</span>
//                       <span className="detail-value">{request.pickupAddress}</span>
//                     </div>
//                     {request.remarks && (
//                       <div className="detail-item detail-full">
//                         <span className="detail-label">Remarks:</span>
//                         <span className="detail-value">{request.remarks}</span>
//                       </div>
//                     )}

//                     {/* Rejection Reason */}
//                     {request.status === 'REJECTED' && request.rejectionReason && (
//                       <div className="detail-item detail-full">
//                         <span className="detail-label">Rejection Reason:</span>
//                         <div className="rejection-reason">
//                           <span className="detail-value">{request.rejectionReason}</span>
//                         </div>
//                       </div>
//                     )}

//                     {/* Scheduled Details */}
//                     {request.status === 'SCHEDULED' && (
//                       <>
//                         <div className="detail-item detail-full">
//                           <span className="detail-label">Scheduled Pickup:</span>
//                           <span className="detail-value scheduled-pickup">
//                             {formatPickupDateTime(request.pickupDate, request.pickupTime)}
//                           </span>
//                         </div>
//                         {request.pickupPersonnel && (
//                           <div className="detail-item">
//                             <span className="detail-label">Pickup Personnel:</span>
//                             <span className="detail-value">{request.pickupPersonnel}</span>
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>

//                   {request.images && request.images.length > 0 && (
//                     <div className="request-images">
//                       <span className="detail-label">
//                         Images ({request.images.length}):
//                       </span>
//                       <div className="image-thumbnails">
//                         {request.images.slice(0, 3).map((image, index) => (
//                           <img
//                             key={index}
//                             src={`http://localhost:8080${image}`}
//                             alt="Device"
//                             className="image-thumbnail"
//                             onClick={() => openImageModal(request.images)}
//                           />
//                         ))}
//                         {request.images.length > 3 && (
//                           <div
//                             className="image-thumbnail more-images"
//                             onClick={() => openImageModal(request.images)}
//                           >
//                             <span>+{request.images.length - 3}</span>
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
//       </div>

//       {/* Image Modal */}
//       {showImageModal && (
//         <div className="modal-overlay" onClick={closeImageModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3 className="modal-title">Request Images</h3>
//               <button onClick={closeImageModal} className="modal-close">
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="modal-images">
//                 {selectedImages.map((image, index) => (
//                   <img
//                     key={index}
//                     src={`http://localhost:8080${image}`}
//                     alt="Device"
//                     className="modal-image"
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyRequests;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import StatCard from '../components/StatCard';
import { PageLoader } from '../components/Loader';
import EnhancedImageModal from '../components/EnhancedImageModal';
import { requestService } from '../services/requestService';

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', message: '' });
  // const [selectedImages, setSelectedImages] = useState([]);
  // const [showImageModal, setShowImageModal] = useState(false);
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [requestStats, setRequestStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    scheduled: 0
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await requestService.getMyRequests();
      const requestsData = response.data || [];

      // Map backend imagePaths to images for easier frontend handling
      const mappedRequests = requestsData.map(r => ({
        ...r,
        images: r.imagePaths || []
      }));

      setRequests(mappedRequests);

      const stats = {
        total: mappedRequests.length,
        pending: mappedRequests.filter(r => r.status === 'PENDING').length,
        approved: mappedRequests.filter(r => r.status === 'APPROVED').length,
        rejected: mappedRequests.filter(r => r.status === 'REJECTED').length,
        scheduled: mappedRequests.filter(r => r.status === 'SCHEDULED').length
      };
      setRequestStats(stats);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load requests';
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => (
    <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
  );

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

  const formatPickupDateTime = (date, time) => {
    if (!date || !time) return 'N/A';
    return `${new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })} at ${time}`;
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

  // const openImageModal = (images) => {
  //   if (images && images.length > 0) {
  //     setSelectedImages(images);
  //     setShowImageModal(true);
  //   }
  // };

  // const closeImageModal = () => {
  //   setShowImageModal(false);
  //   setSelectedImages([]);
  // };

  if (loading) {
    return (
      <div>
        <Navbar title="My E-waste Requests" />
        <PageLoader text="Loading requests..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar title="My E-waste Requests" />

      <div className="dashboard-container">
        {notification.message && (
          <div className="notification-wrapper">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification({ type: '', message: '' })}
            />
          </div>
        )}

        {/* Stats */}
        {/* <div className="stats-grid"> */}
          {/* <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
          <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
          <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
          <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
          <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" /> */}
        <div className="stats-container">
          <div className="stats-grid-top">
            <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
            <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
            <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
            <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
          </div>
          <div className="stats-grid-bottom">
            <StatCard title="Completed" count={requestStats.completed} color="purple" icon="completed" />
            <StatCard title="Total Requests" count={requestStats.total} color="gray" icon="total" />
          </div>
        </div>

        {/* Requests List */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">My Requests</h2>
            <div className="header-actions">
              <button onClick={fetchRequests} className="btn btn-secondary">Refresh</button>
              <button onClick={() => navigate('/user/submit-request')} className="btn btn-primary">New Request</button>
              <button onClick={() => navigate('/user')} className="btn btn-secondary">Back to Dashboard</button>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="empty-state">
              <p>No requests found</p>
              <button onClick={() => navigate('/user/submit-request')} className="btn btn-primary">
                Submit Your First Request
              </button>
            </div>
          ) : (
            <div className="requests-list">
              {requests.map(request => (
                <div key={request.requestId} className="request-card">
                  <div className="request-header">
                    <h3>{request.deviceType} - {request.brand} {request.model}</h3>
                    <div>{getStatusBadge(request.status)}</div>
                  </div>

                  <div className="request-details">
                    <p>Condition: {request.condition}</p>
                    <p>Quantity: {request.quantity}</p>
                    <p>Pickup Address: {request.pickupAddress}</p>
                    {request.remarks && <p>Remarks: {request.remarks}</p>}

                    {request.status === 'REJECTED' && request.rejectionReason && (
                      <p>Rejection Reason: {request.rejectionReason}</p>
                    )}

                    {request.status === 'SCHEDULED' && (
                      <>
                        <p>Scheduled Pickup: {formatPickupDateTime(request.pickupDateTime, request.pickupTimeSlot)}</p>
                        {request.pickupPersonnel && <p>Pickup Personnel: {request.pickupPersonnel}</p>}
                      </>
                    )}
                  </div>

                  {/* Images */}
                  {request.images.length > 0 && (
                    <div className="request-images">
                      <p>Images ({request.images.length}):</p>
                      <div className="image-thumbnails">
                        {request.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:8080/files/${image}`}
                            alt="Device"
                            className="image-thumbnail"
                            onClick={() => openImageModal(request.images, index)}
                          />
                        ))}
                        {request.images.length > 3 && (
                          <div 
                            className="image-thumbnail more-images" 
                            onClick={() => openImageModal(request.images, 3)}
                          >
                            +{request.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  {/* {request.images.length > 0 && (
                    <div className="request-images">
                      <p>Images ({request.images.length}):</p>
                      <div className="image-thumbnails">
                        {request.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:8080/files/${image}`}
                            alt="Device"
                            className="image-thumbnail"
                            onClick={() => openImageModal(request.images)}
                          />
                        ))}
                        {request.images.length > 3 && (
                          <div className="image-thumbnail more-images" onClick={() => openImageModal(request.images)}>
                            +{request.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )} */}
                </div>
              ))}
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
      {/* Image Modal */}
      {/* {showImageModal && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Images</h3>
              <button onClick={closeImageModal} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              {selectedImages.map((image, index) => (
                <img key={index} src={`http://localhost:8080/files/${image}`} alt="Device" className="modal-image" />
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MyRequests;