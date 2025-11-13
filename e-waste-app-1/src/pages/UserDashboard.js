// import React, { useState, useEffect } from 'react';

// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import StatCard from '../components/StatCard';
// import Loader, { PageLoader } from '../components/Loader';
// import { authService } from '../services/authService';
// import { requestService } from '../services/requestService';
// import { userService } from '../services/userService';
// import RecyclingBackground from '../components/RecyclingBackground';
// import '../index.css';

// const UserDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     pickupAddress: '',
//     profilePicture: ''
//   });
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [loading, setLoading] = useState(true);
//   const [requestStats, setRequestStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     scheduled: 0,
//     completed: 0
//   });

//   // Report modal states
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [selectedDays, setSelectedDays] = useState(7);
//   const [generatingReport, setGeneratingReport] = useState(false);

//   // Certificate modal states
//   const [showCertificatesModal, setShowCertificatesModal] = useState(false);
//   const [certificates, setCertificates] = useState([]);
//   const [loadingCertificates, setLoadingCertificates] = useState(false);
//   const [showCertificatePreview, setShowCertificatePreview] = useState(false);
//   const [selectedCertificate, setSelectedCertificate] = useState(null);
//   const [downloadingCertificate, setDownloadingCertificate] = useState(false);

//   // Image modal states
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageZoom, setImageZoom] = useState(1);
//   const [downloadingImage, setDownloadingImage] = useState(false);

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([fetchUserProfile(), fetchRequestStats()]);
//     } catch (error) {
//       setNotification({ type: 'error', message: 'Failed to load dashboard data' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserProfile = async () => {
//     try {
//       const response = await authService.getUserProfile();
//       const userData = response.data;
//       setProfileData(userData);
//     } catch (error) {
//       console.error('Failed to load profile data:', error);
//     }
//   };

//   const fetchRequestStats = async () => {
//     try {
//       const response = await requestService.getMyRequests();
//       const requests = response.data || [];
      
//       const stats = {
//         total: requests.length,
//         pending: requests.filter(r => r.status === 'PENDING').length,
//         approved: requests.filter(r => r.status === 'APPROVED').length,
//         rejected: requests.filter(r => r.status === 'REJECTED').length,
//         scheduled: requests.filter(r => r.status === 'SCHEDULED').length,
//         completed: requests.filter(r => r.status === 'COMPLETED').length
//       };
      
//       setRequestStats(stats);
//     } catch (error) {
//       console.error('Failed to load request stats:', error);
//     }
//   };

//   const fetchCertificates = async () => {
//     setLoadingCertificates(true);
//     try {
//       const response = await userService.getCertificates();
//       setCertificates(response.data);
//     } catch (error) {
//       console.error('Failed to load certificates:', error);
//       setNotification({ type: 'error', message: 'Failed to load certificates' });
//     } finally {
//       setLoadingCertificates(false);
//     }
//   };

//   const handleShowCertificates = async () => {
//     setShowCertificatesModal(true);
//     await fetchCertificates();
//   };

//   const handleCertificatePreview = (certificate) => {
//     setSelectedCertificate(certificate);
//     setShowCertificatePreview(true);
//   };

//   const handleDownloadCertificate = async (certificate) => {
//     setDownloadingCertificate(true);
//     try {
//       const response = await userService.downloadCertificate(certificate.id);
      
//       // Create blob and download file
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Certificate_of_Appreciation_${certificate.completedRequests}_requests.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       setNotification({ type: 'success', message: 'Certificate downloaded successfully!' });
//     } catch (error) {
//       console.error('Failed to download certificate:', error);
//       setNotification({ type: 'error', message: 'Failed to download certificate. Please try again.' });
//     } finally {
//       setDownloadingCertificate(false);
//     }
//   };

//   const handleGenerateReport = async () => {
//     setGeneratingReport(true);
//     try {
//       const response = await userService.generateReport(selectedDays);
      
//       // Create blob and download file
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `ewaste_report_${selectedDays}days.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       setShowReportModal(false);
//       setNotification({ type: 'success', message: 'Report generated and downloaded successfully!' });
//     } catch (error) {
//       console.error('Failed to generate report:', error);
//       setNotification({ type: 'error', message: 'Failed to generate report. Please try again.' });
//     } finally {
//       setGeneratingReport(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const handleImageClick = (imageUrl, imageName) => {
//   setSelectedImage({ url: imageUrl, name: imageName });
//   setShowImageModal(true);
//   setImageZoom(1); // Reset zoom when opening modal
//   };

//   const handleZoomIn = () => {
//     setImageZoom(prev => Math.min(prev + 0.25, 3)); // Max zoom 3x
//   };

//   const handleZoomOut = () => {
//     setImageZoom(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 0.5x
//   };

//   const handleDownloadImage = async () => {
//     if (!selectedImage) return;
    
//     setDownloadingImage(true);
//     try {
//       const response = await fetch(selectedImage.url);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', selectedImage.name || 'device-image.jpg');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       setNotification({ type: 'success', message: 'Image downloaded successfully!' });
//     } catch (error) {
//       console.error('Failed to download image:', error);
//       setNotification({ type: 'error', message: 'Failed to download image' });
//     } finally {
//       setDownloadingImage(false);
//     }
//   };

//   const closeImageModal = () => {
//     setShowImageModal(false);
//     setSelectedImage(null);
//     setImageZoom(1);
//   };

//   if (loading) {
//     return (
//       <div>
//         <Navbar title="User Dashboard" />
//         <PageLoader text="Loading dashboard..." />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">
//       <Navbar title="User Dashboard" />
      
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
//         {/* <div className="stats-grid">
//           <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//           <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//           <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//           <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//           <StatCard title="Completed" count={requestStats.completed} color="purple" icon="completed" />
//           <StatCard title="Total Requests" count={requestStats.total} color="gray" icon="total" />
//         </div> */}

//         <div className="stats-container">
//           <div className="stats-grid-top">
//             <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//             <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//             <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//             <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//           </div>
//           <div className="stats-grid-bottom">
//             <StatCard title="Completed" count={requestStats.completed} color="purple" icon="completed" />
//             <StatCard title="Total Requests" count={requestStats.total} color="gray" icon="total" />
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="card">
//           <h2 className="section-title">Quick Actions</h2>
//           <div className="actions-grid">
//             <button 
//               onClick={() => navigate('/user/submit-request')}
//               className="action-button action-button-primary"
//             >
//               <div className="action-icon">
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//               </div>
//               <div className="action-content">
//                 <h3>Submit Request</h3>
//                 <p>Submit new e-waste pickup request</p>
//               </div>
//             </button>
            
//             <button 
//               onClick={() => navigate('/user/my-requests')}
//               className="action-button action-button-secondary"
//             >
//               <div className="action-icon">
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//               </div>
//               <div className="action-content">
//                 <h3>My Requests</h3>
//                 <p>View and track your requests</p>
//               </div>
//             </button>

//             <button 
//               onClick={() => setShowReportModal(true)}
//               className="action-button action-button-tertiary"
//             >
//               <div className="action-icon">
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <div className="action-content">
//                 <h3>Generate Report</h3>
//                 <p>Download your activity report</p>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Profile Overview */}
//         <div className="card">
//           <div className="section-header">
//             <h2 className="section-title">Profile Overview</h2>
//           </div>

//           <div className="profile-overview">
//             {/* Profile Picture */}
//             <div className="profile-picture-section">
//               {profileData.profilePicture ? (
//                 <img
//                   src={profileData.profilePicture}
//                   alt="Profile"
//                   className="profile-pic-large"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.nextSibling.style.display = 'flex';
//                   }}
//                 />
//               ) : null}
//               <div 
//                 className={`profile-placeholder-large ${profileData.profilePicture ? 'hidden' : ''}`}
//               >
//                 <span>
//                   {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
//                 </span>
//               </div>
//             </div>

//             {/* Profile Info */}
//             <div className="profile-info-grid">
//               <div className="profile-field">
//                 <label>Full Name</label>
//                 <p>{profileData.name || 'Not provided'}</p>
//               </div>
//               <div className="profile-field">
//                 <label>Email</label>
//                 <p>{profileData.email || 'Not provided'}</p>
//               </div>
//               <div className="profile-field">
//                 <label>Phone</label>
//                 <p>{profileData.phone || 'Not provided'}</p>
//               </div>
//               <div className="profile-field">
//                 <label>Pickup Address</label>
//                 <p>{profileData.pickupAddress || 'Not provided'}</p>
//               </div>
//             </div>

//             {/* Certificate Button */}
//             <div className="profile-actions">
//               <button 
//                 onClick={handleShowCertificates}
//                 className="certificate-button"
//               >
//                 <div className="certificate-icon">
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                   </svg>
//                 </div>
//                 <span>Certificates Earned</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Report Generation Modal */}
//       {showReportModal && (
//         <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Generate Report</h3>
//               <button 
//                 className="modal-close"
//                 onClick={() => setShowReportModal(false)}
//               >
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <p>Select the time range for your report:</p>
              
//               <div className="radio-group">
//                 <label className="radio-option">
//                   <input
//                     type="radio"
//                     name="days"
//                     value={3}
//                     checked={selectedDays === 3}
//                     onChange={(e) => setSelectedDays(parseInt(e.target.value))}
//                   />
//                   <span>Last 3 days</span>
//                 </label>
                
//                 <label className="radio-option">
//                   <input
//                     type="radio"
//                     name="days"
//                     value={7}
//                     checked={selectedDays === 7}
//                     onChange={(e) => setSelectedDays(parseInt(e.target.value))}
//                   />
//                   <span>Last 7 days</span>
//                 </label>
                
//                 <label className="radio-option">
//                   <input
//                     type="radio"
//                     name="days"
//                     value={30}
//                     checked={selectedDays === 30}
//                     onChange={(e) => setSelectedDays(parseInt(e.target.value))}
//                   />
//                   <span>Last 30 days</span>
//                 </label>
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 className="btn btn-secondary"
//                 onClick={() => setShowReportModal(false)}
//                 disabled={generatingReport}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="btn btn-primary"
//                 onClick={handleGenerateReport}
//                 disabled={generatingReport}
//               >
//                 {generatingReport ? 'Generating...' : 'Generate Report'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Certificates Modal */}
//       {showCertificatesModal && (
//         <div className="modal-overlay" onClick={() => setShowCertificatesModal(false)}>
//           <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Certificates Earned</h3>
//               <button 
//                 className="modal-close"
//                 onClick={() => setShowCertificatesModal(false)}
//               >
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="modal-body">
//               {loadingCertificates ? (
//                 <div className="certificate-loading">
//                   <Loader />
//                   <p>Loading certificates...</p>
//                 </div>
//               ) : certificates.length === 0 ? (
//                 <div className="no-certificates">
//                   <div className="no-certificates-icon">
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                     </svg>
//                   </div>
//                   <h4>No Certificates Yet</h4>
//                   <p>Complete 5 e-waste pickup requests to earn your first Certificate of Appreciation!</p>
//                   <p>You currently have <strong>{requestStats.completed}</strong> completed requests.</p>
//                   {requestStats.completed > 0 && (
//                     <p>Only <strong>{5 - (requestStats.completed % 5)}</strong> more to go!</p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="certificates-grid">
//                   {certificates.map((certificate) => (
//                     <div key={certificate.id} className="certificate-card">
//                       <div className="certificate-header">
//                         <div className="certificate-badge">
//                           <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                           </svg>
//                         </div>
//                         <h4>{certificate.title}</h4>
//                       </div>
                      
//                       <div className="certificate-info">
//                         <p className="certificate-description">
//                           {certificate.recognitionText}
//                         </p>
//                         <div className="certificate-details">
//                           <span className="certificate-date">
//                             Issued on {formatDate(certificate.issuedAt)}
//                           </span>
//                           <span className="certificate-requests">
//                             {certificate.completedRequests} requests completed
//                           </span>
//                         </div>
//                       </div>
                      
//                       <div className="certificate-actions">
//                         {/* <button 
//                           onClick={() => handleCertificatePreview(certificate)}
//                           className="btn btn-secondary btn-sm"
//                         >
//                           Preview
//                         </button> */}
//                         <button 
//                           onClick={() => handleDownloadCertificate(certificate)}
//                           className="btn btn-primary btn-sm"
//                           disabled={downloadingCertificate}
//                         >
//                           {downloadingCertificate ? 'Downloading...' : 'Download'}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Image Modal */}
//       {showImageModal && selectedImage && (
//         <div className="modal-overlay" onClick={closeImageModal}>
//           <div className="modal-content modal-image" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Device Image</h3>
//               <div className="image-controls">
//                 <button 
//                   className="zoom-btn"
//                   onClick={handleZoomOut}
//                   disabled={imageZoom <= 0.5}
//                 >
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
//                   </svg>
//                 </button>
//                 <span className="zoom-level">{Math.round(imageZoom * 100)}%</span>
//                 <button 
//                   className="zoom-btn"
//                   onClick={handleZoomIn}
//                   disabled={imageZoom >= 3}
//                 >
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
//                   </svg>
//                 </button>
//             </div>
//               <button className="modal-close" onClick={closeImageModal}>
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
      
//             <div className="modal-body image-modal-body">
//               <div className="image-container">
//                 <img
//                   src={selectedImage.url}
//                   alt="Device"
//                   style={{ transform: `scale(${imageZoom})` }}
//                   className="zoomable-image"
//                 />
//               </div>
//             </div>
      
//             <div className="modal-footer">
//               <button 
//                 className="btn btn-secondary"
//                 onClick={closeImageModal}
//               >
//                 Close
//               </button>
//               <button 
//                 className="btn btn-primary"
//                 onClick={handleDownloadImage}
//                 disabled={downloadingImage}
//               >
//                 {downloadingImage ? 'Downloading...' : 'Download Image'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Certificate Preview Modal */}
//       {/* {showCertificatePreview && selectedCertificate && (
//         <div className="modal-overlay" onClick={() => setShowCertificatePreview(false)}>
//           <div className="modal-content modal-preview" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Certificate Preview</h3>
//               <button 
//                 className="modal-close"
//                 onClick={() => setShowCertificatePreview(false)}
//               >
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <div className="certificate-preview">
//                 <div className="certificate-border">
//                   <div className="certificate-content">
//                     <h1 className="certificate-title">CERTIFICATE OF APPRECIATION</h1>
//                     <div className="certificate-decorative-line"></div>
//                     <p className="certificate-text">This certificate is proudly awarded to</p>
//                     <h2 className="certificate-name">{profileData.name.toUpperCase()}</h2>
//                     <p className="certificate-recognition">
//                       {selectedCertificate.recognitionText}
//                     </p>
//                     <p className="certificate-achievement">
//                       You have successfully completed <strong>{selectedCertificate.completedRequests}</strong> e-waste pickup requests,
//                       demonstrating your commitment to a cleaner and greener environment.
//                     </p>
//                     <div className="certificate-date-section">
//                       <p>Issued on: {formatDate(selectedCertificate.issuedAt)}</p>
//                     </div>
//                     <div className="certificate-signatures">
//                       <div className="signature-section">
//                         <div className="signature-line"></div>
//                         <p>System Administrator</p>
//                       </div>
//                       <div className="signature-section">
//                         <div className="signature-line"></div>
//                         <p>E-Waste Management Team</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 className="btn btn-secondary"
//                 onClick={() => setShowCertificatePreview(false)}
//               >
//                 Close
//               </button>
//               <button 
//                 className="btn btn-primary"
//                 onClick={() => handleDownloadCertificate(selectedCertificate)}
//                 disabled={downloadingCertificate}
//               >
//                 {downloadingCertificate ? 'Downloading...' : 'Download PDF'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default UserDashboard;

// 1. Enhanced UserDashboard.js with celebration and progress bar
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import StatCard from '../components/StatCard';
import Loader, { PageLoader } from '../components/Loader';
import { authService } from '../services/authService';
import { requestService } from '../services/requestService';
import { userService } from '../services/userService';
import RecyclingBackground from '../components/RecyclingBackground';
import '../index.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupAddress: '',
    profilePicture: ''
  });
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [requestStats, setRequestStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    scheduled: 0,
    completed: 0
  });

  // Certificate states
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);
  const [showCertificatesModal, setShowCertificatesModal] = useState(false);
  const [lastCertificateCount, setLastCertificateCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newCertificate, setNewCertificate] = useState(null);

  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUserProfile(), fetchRequestStats()]);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getUserProfile();
      const userData = response.data;
      setProfileData(userData);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  };

  const fetchRequestStats = async () => {
    try {
      const response = await requestService.getMyRequests();
      const requests = response.data || [];
      
      const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'PENDING').length,
        approved: requests.filter(r => r.status === 'APPROVED').length,
        rejected: requests.filter(r => r.status === 'REJECTED').length,
        scheduled: requests.filter(r => r.status === 'SCHEDULED').length,
        completed: requests.filter(r => r.status === 'COMPLETED').length
      };
      
      setRequestStats(stats);
    } catch (error) {
      console.error('Failed to load request stats:', error);
    }
  };

  const fetchCertificates = async () => {
    setLoadingCertificates(true);
    try {
      const response = await userService.getCertificates();
      const newCertificates = response.data;
      
      // Check for new certificates
      // if (newCertificates.length > lastCertificateCount && lastCertificateCount > 0) {
      //   const newest = newCertificates[0]; // Assuming they're ordered by date desc
      //   setNewCertificate(newest);
      //   triggerCelebration();
      // }

      if (lastCertificateCount !== null && newCertificates.length > lastCertificateCount) {
        const newest = newCertificates[0]; // Assuming they're ordered by date desc
        setNewCertificate(newest);
        triggerCelebration();
      }
      
      setCertificates(newCertificates);
      // setLastCertificateCount(newCertificates.length);
      if (lastCertificateCount === null) {
        setLastCertificateCount(newCertificates.length);
      } else {
        setLastCertificateCount(newCertificates.length);
      }
    } catch (error) {
      console.error('Failed to load certificates:', error);
      setNotification({ type: 'error', message: 'Failed to load certificates' });
    } finally {
      setLoadingCertificates(false);
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    createConfetti();
    
    // Auto-hide celebration after 5 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 5000);
  };

  // const createConfetti = () => {
  //   const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
  //   const confettiContainer = document.createElement('div');
  //   confettiContainer.className = 'confetti-container';
  //   document.body.appendChild(confettiContainer);

  //   for (let i = 0; i < 50; i++) {
  //     const confetti = document.createElement('div');
  //     confetti.className = 'confetti';
  //     confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  //     confetti.style.left = Math.random() * 100 + '%';
  //     confetti.style.animationDelay = Math.random() * 2 + 's';
  //     confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
  //     confettiContainer.appendChild(confetti);
  //   }

  //   // Remove confetti after animation
  //   setTimeout(() => {
  //     document.body.removeChild(confettiContainer);
  //   }, 6000);
  // };

  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a29bfe', '#fd79a8'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 1999;
      overflow: hidden;
    `;
    document.body.appendChild(confettiContainer);

    // Create more confetti pieces for better effect
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Random properties for each piece
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4; // 4-12px
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = Math.random() * 3 + 3; // 3-6 seconds
      const rotation = Math.random() * 360;
      
      confetti.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        left: ${left}%;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confettiFall ${duration}s linear ${delay}s forwards;
        transform: rotate(${rotation}deg);
      `;
      
      confettiContainer.appendChild(confetti);
    }

    // Remove confetti after animation completes
    setTimeout(() => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer);
      }
    }, 8000);
  };

   const testCelebration = () => {
    triggerCelebration();
    setNotification({ type: 'success', message: 'Test celebration triggered!' });
  };

  const handleShowCertificates = async () => {
    setShowCertificatesModal(true);
    await fetchCertificates();
     // Uncomment this line to test confetti when opening certificates modal
    // testCelebration();
  };

  const handleDownloadCertificate = async (certificate) => {
    setDownloadingCertificate(true);
    try {
      const response = await userService.downloadCertificate(certificate.id);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_of_Appreciation_${certificate.completedRequests}_requests.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setNotification({ type: 'success', message: 'Certificate downloaded successfully!' });
    } catch (error) {
      console.error('Failed to download certificate:', error);
      setNotification({ type: 'error', message: 'Failed to download certificate. Please try again.' });
    } finally {
      setDownloadingCertificate(false);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await userService.generateReport(selectedDays);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ewaste_report_${selectedDays}days.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setShowReportModal(false);
      setNotification({ type: 'success', message: 'Report generated and downloaded successfully!' });
    } catch (error) {
      console.error('Failed to generate report:', error);
      setNotification({ type: 'error', message: 'Failed to generate report. Please try again.' });
    } finally {
      setGeneratingReport(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate progress for next certificate
  const getNextCertificateProgress = () => {
    const completedRequests = requestStats.completed;
    const nextMilestone = Math.ceil(completedRequests / 5) * 5;
    const progress = completedRequests % 5;
    const remaining = nextMilestone - completedRequests;
    
    return {
      progress: progress,
      total: 5,
      remaining: remaining || 5,
      percentage: (progress / 5) * 100
    };
  };

  if (loading) {
    return (
      <div>
        <Navbar title="User Dashboard" />
        <PageLoader text="Loading dashboard..." />
      </div>
    );
  }

  const certificateProgress = getNextCertificateProgress();

  return (
    <div className="dashboard-page">
      <Navbar title="User Dashboard" />
      
      <div className="dashboard-container">
        {/* Celebration Modal */}
        {showCelebration && (
          <div className="celebration-modal-overlay">
            <div className="celebration-modal">
              <div className="celebration-content">
                <div className="celebration-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2>Congratulations!</h2>
                <p>You've earned a new Certificate of Appreciation!</p>
                {newCertificate && (
                  <p className="certificate-details">
                    For completing {newCertificate.completedRequests} e-waste pickup requests
                  </p>
                )}
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCelebration(false)}
                >
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add temporary test button - Remove this after testing */}
        {/* <div style={{ margin: '10px 0', textAlign: 'center' }}>
          <button 
            onClick={testCelebration}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Confetti (Remove after testing)
          </button>
        </div> */}

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

        {/* Quick Actions */}
        <div className="card">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <button 
              onClick={() => navigate('/user/submit-request')}
              className="action-button action-button-primary"
            >
              <div className="action-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="action-content">
                <h3>Submit E-Waste Request</h3>
                <p>Submit new e-waste pickup request</p>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/user/my-requests')}
              className="action-button action-button-secondary"
            >
              <div className="action-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="action-content">
                <h3>My Requests</h3>
                <p>View and track your requests</p>
              </div>
            </button>

            <button 
              onClick={() => setShowReportModal(true)}
              className="action-button action-button-tertiary"
            >
              <div className="action-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="action-content">
                <h3>Generate Report</h3>
                <p>Download your activity report</p>
              </div>
            </button>
          </div>
        </div>

        {/* Certificate Progress Bar */}
        <div className="card certificate-progress-card">
          <h3 className="section-title">Certificate Progress</h3>
          <div className="progress-container">
            <div className="progress-info">
              <div className="progress-text">
                <span>Progress to next certificate</span>
                <span className="progress-count">
                  {certificateProgress.progress}/{certificateProgress.total} requests completed
                </span>
              </div>
              <div className="progress-remaining">
                {certificateProgress.remaining === 5 
                  ? "Complete 5 requests to earn your certificate!" 
                  : `${certificateProgress.remaining} more requests needed`
                }
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${certificateProgress.percentage}%` }}
                ></div>
              </div>
              <div className="progress-percentage">{Math.round(certificateProgress.percentage)}%</div>
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Profile Overview</h2>
          </div>

          <div className="profile-overview">
            <div className="profile-picture-section">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="profile-pic-large"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`profile-placeholder-large ${profileData.profilePicture ? 'hidden' : ''}`}
              >
                <span>
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>

            <div className="profile-info-grid">
              <div className="profile-field">
                <label>Full Name</label>
                <p>{profileData.name || 'Not provided'}</p>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <p>{profileData.email || 'Not provided'}</p>
              </div>
              <div className="profile-field">
                <label>Phone</label>
                <p>{profileData.phone || 'Not provided'}</p>
              </div>
              <div className="profile-field">
                <label>Pickup Address</label>
                <p>{profileData.pickupAddress || 'Not provided'}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                onClick={handleShowCertificates}
                className="certificate-button"
              >
                <div className="certificate-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span>Certificates Earned ({certificates.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate Report</h3>
              <button 
                className="modal-close"
                onClick={() => setShowReportModal(false)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>Select the time range for your report:</p>
              
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="days"
                    value={3}
                    checked={selectedDays === 3}
                    onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                  />
                  <span>Last 3 days</span>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="days"
                    value={7}
                    checked={selectedDays === 7}
                    onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                  />
                  <span>Last 7 days</span>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="days"
                    value={30}
                    checked={selectedDays === 30}
                    onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                  />
                  <span>Last 30 days</span>
                </label>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowReportModal(false)}
                disabled={generatingReport}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleGenerateReport}
                disabled={generatingReport}
              >
                {generatingReport ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificates Modal */}
      {showCertificatesModal && (
        <div className="modal-overlay" onClick={() => setShowCertificatesModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Certificates Earned</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCertificatesModal(false)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              {loadingCertificates ? (
                <div className="certificate-loading">
                  <Loader />
                  <p>Loading certificates...</p>
                </div>
              ) : certificates.length === 0 ? (
                <div className="no-certificates">
                  <div className="no-certificates-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h4>No Certificates Yet</h4>
                  <p>Complete 5 e-waste pickup requests to earn your first Certificate of Appreciation!</p>
                  <p>You currently have <strong>{requestStats.completed}</strong> completed requests.</p>
                  {certificateProgress.remaining < 5 && (
                    <p>Only <strong>{certificateProgress.remaining}</strong> more to go!</p>
                  )}
                </div>
              ) : (
                <div className="certificates-grid">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="certificate-card">
                      <div className="certificate-header">
                        <div className="certificate-badge">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <h4>{certificate.title}</h4>
                      </div>
                      
                      <div className="certificate-info">
                        <p className="certificate-description">
                          {certificate.recognitionText}
                        </p>
                        <div className="certificate-details">
                          <span className="certificate-date">
                            Issued on {formatDate(certificate.issuedAt)}
                          </span>
                          <span className="certificate-requests">
                            {certificate.completedRequests} requests completed
                          </span>
                        </div>
                      </div>
                      
                      <div className="certificate-actions">
                        <button 
                          onClick={() => handleDownloadCertificate(certificate)}
                          className="btn btn-primary btn-sm"
                          disabled={downloadingCertificate}
                        >
                          {downloadingCertificate ? 'Downloading...' : 'Download'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

// // 1. Enhanced UserDashboard.js with celebration and progress bar
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import StatCard from '../components/StatCard';
// import Loader, { PageLoader } from '../components/Loader';
// import { authService } from '../services/authService';
// import { requestService } from '../services/requestService';
// import { userService } from '../services/userService';
// import RecyclingBackground from '../components/RecyclingBackground';
// import '../index.css';

// const UserDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     pickupAddress: '',
//     profilePicture: ''
//   });
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [loading, setLoading] = useState(true);
//   const [requestStats, setRequestStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     scheduled: 0,
//     completed: 0
//   });

//   // Certificate states
//   const [certificates, setCertificates] = useState([]);
//   const [loadingCertificates, setLoadingCertificates] = useState(false);
//   const [downloadingCertificate, setDownloadingCertificate] = useState(false);
//   const [showCertificatesModal, setShowCertificatesModal] = useState(false);
//   const [lastCertificateCount, setLastCertificateCount] = useState(0);
//   const [showCelebration, setShowCelebration] = useState(false);
//   const [newCertificate, setNewCertificate] = useState(null);

//   // Report modal states
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [selectedDays, setSelectedDays] = useState(7);
//   const [generatingReport, setGeneratingReport] = useState(false);

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([fetchUserProfile(), fetchRequestStats()]);
//     } catch (error) {
//       setNotification({ type: 'error', message: 'Failed to load dashboard data' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserProfile = async () => {
//     try {
//       const response = await authService.getUserProfile();
//       const userData = response.data;
//       setProfileData(userData);
//     } catch (error) {
//       console.error('Failed to load profile data:', error);
//     }
//   };

//   const fetchRequestStats = async () => {
//     try {
//       const response = await requestService.getMyRequests();
//       const requests = response.data || [];
      
//       const stats = {
//         total: requests.length,
//         pending: requests.filter(r => r.status === 'PENDING').length,
//         approved: requests.filter(r => r.status === 'APPROVED').length,
//         rejected: requests.filter(r => r.status === 'REJECTED').length,
//         scheduled: requests.filter(r => r.status === 'SCHEDULED').length,
//         completed: requests.filter(r => r.status === 'COMPLETED').length
//       };
      
//       setRequestStats(stats);
//     } catch (error) {
//       console.error('Failed to load request stats:', error);
//     }
//   };

//   const fetchCertificates = async () => {
//     setLoadingCertificates(true);
//     try {
//       const response = await userService.getCertificates();
//       const newCertificates = response.data;
      
//       // Check for new certificates
//       if (newCertificates.length > lastCertificateCount && lastCertificateCount > 0) {
//         const newest = newCertificates[0]; // Assuming they're ordered by date desc
//         setNewCertificate(newest);
//         triggerCelebration();
//       }
      
//       setCertificates(newCertificates);
//       setLastCertificateCount(newCertificates.length);
//     } catch (error) {
//       console.error('Failed to load certificates:', error);
//       setNotification({ type: 'error', message: 'Failed to load certificates' });
//     } finally {
//       setLoadingCertificates(false);
//     }
//   };

//   const triggerCelebration = () => {
//     setShowCelebration(true);
//     createConfetti();
    
//     // Auto-hide celebration after 5 seconds
//     setTimeout(() => {
//       setShowCelebration(false);
//     }, 5000);
//   };

//   const createConfetti = () => {
//     const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
//     const confettiContainer = document.createElement('div');
//     confettiContainer.className = 'confetti-container';
//     document.body.appendChild(confettiContainer);

//     for (let i = 0; i < 50; i++) {
//       const confetti = document.createElement('div');
//       confetti.className = 'confetti';
//       confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
//       confetti.style.left = Math.random() * 100 + '%';
//       confetti.style.animationDelay = Math.random() * 2 + 's';
//       confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
//       confettiContainer.appendChild(confetti);
//     }

//     // Remove confetti after animation
//     setTimeout(() => {
//       document.body.removeChild(confettiContainer);
//     }, 6000);
//   };

//   const handleShowCertificates = async () => {
//     setShowCertificatesModal(true);
//     await fetchCertificates();
//   };

//   const handleDownloadCertificate = async (certificate) => {
//     setDownloadingCertificate(true);
//     try {
//       const response = await userService.downloadCertificate(certificate.id);
      
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Certificate_of_Appreciation_${certificate.completedRequests}_requests.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       setNotification({ type: 'success', message: 'Certificate downloaded successfully!' });
//     } catch (error) {
//       console.error('Failed to download certificate:', error);
//       setNotification({ type: 'error', message: 'Failed to download certificate. Please try again.' });
//     } finally {
//       setDownloadingCertificate(false);
//     }
//   };

//   const handleGenerateReport = async () => {
//     setGeneratingReport(true);
//     try {
//       const response = await userService.generateReport(selectedDays);
      
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `ewaste_report_${selectedDays}days.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       setShowReportModal(false);
//       setNotification({ type: 'success', message: 'Report generated and downloaded successfully!' });
//     } catch (error) {
//       console.error('Failed to generate report:', error);
//       setNotification({ type: 'error', message: 'Failed to generate report. Please try again.' });
//     } finally {
//       setGeneratingReport(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Calculate progress for next certificate
//   const getNextCertificateProgress = () => {
//     const completedRequests = requestStats.completed;
//     const nextMilestone = Math.ceil(completedRequests / 5) * 5;
//     const progress = completedRequests % 5;
//     const remaining = nextMilestone - completedRequests;
    
//     return {
//       progress: progress,
//       total: 5,
//       remaining: remaining || 5,
//       percentage: (progress / 5) * 100
//     };
//   };

//   if (loading) {
//     return (
//       <div>
//         <Navbar title="User Dashboard" />
//         <PageLoader text="Loading dashboard..." />
//       </div>
//     );
//   }

//   const certificateProgress = getNextCertificateProgress();

//   return (
//     <div className="dashboard-page">
//       <Navbar title="User Dashboard" />
      
//       <div className="dashboard-container">
//         {/* Celebration Modal */}
//         {showCelebration && (
//           <div className="celebration-modal-overlay">
//             <div className="celebration-modal">
//               <div className="celebration-content">
//                 <div className="celebration-icon">
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                   </svg>
//                 </div>
//                 <h2>Congratulations!</h2>
//                 <p>You've earned a new Certificate of Appreciation!</p>
//                 {newCertificate && (
//                   <p className="certificate-details">
//                     For completing {newCertificate.completedRequests} e-waste pickup requests
//                   </p>
//                 )}
//                 <button 
//                   className="btn btn-primary"
//                   onClick={() => setShowCelebration(false)}
//                 >
//                   View Certificate
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

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
//         <div className="stats-container">
//           <div className="stats-grid-top">
//             <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//             <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//             <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//             <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//           </div>
//           <div className="stats-grid-bottom">
//             <StatCard title="Completed" count={requestStats.completed} color="purple" icon="completed" />
//             <StatCard title="Total Requests" count={requestStats.total} color="gray" icon="total" />
//           </div>
//         </div>

//         {/* Certificate Progress Bar */}
//         <div className="card certificate-progress-card">
//           <h3 className="section-title">Certificate Progress</h3>
//           <div className="progress-container">
//             <div className="progress-info">
//               <div className="progress-text">
//                 <span>Progress to next certificate</span>
//                 <span className="progress-count">
//                   {certificateProgress.progress}/{certificateProgress.total} requests completed
//                 </span>
//               </div>
//               <div className="progress-remaining">
//                 {certificateProgress.remaining === 5 
//                   ? "Complete 5 requests to earn your first certificate!" 
//                   : `${certificateProgress.remaining} more requests needed`
//                 }
//               </div>
//             </div>
//             <div className="progress-bar-container">
//               <div className="progress-bar">
//                 <div 
//                   className="progress-fill"
//                   style={{ width: `${certificateProgress.percentage}%` }}
//                 ></div>
//               </div>
//               <div className="progress-percentage">{Math.round(certificateProgress.percentage)}%</div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="card">
//           <h2 className="section-title">Quick Actions</h2>
//           <div className="actions-grid">
//             <button 
//               onClick={() => navigate('/user/submit-request')}
//               className="action-button action-button-primary"
//             >
//               <div className="action-icon">
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//               </div>
//               <div className="action-content">
//                 <h3>Submit Request</h3>
//                 <p>Submit new e-waste pickup request</p>
//               </div>
//             </button>
            
//             <button 
//               onClick={() => navigate('/user/my-requests')}
//               className="action-button action-button-secondary"
//             >
//               <div className="action-icon">
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//               </div>
//               <div className="action-content">
//                 <h3>My Requests</h3>
//                 <p>View and track your requests</p>
//               </div>
//             </button>

//             <button 
//               onClick={() => setShowReportModal(true)}
//               className="action-button action-button-tertiary"
//             >
//               <div className="action-icon">
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <div className="action-content">
//                 <h3>Generate Report</h3>
//                 <p>Download your activity report</p>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Profile Overview */}
//         <div className="card">
//           <div className="section-header">
//             <h2 className="section-title">Profile Overview</h2>
//           </div>

//           <div className="profile-overview">
//             <div className="profile-picture-section">
//               {profileData.profilePicture ? (
//                 <img
//                   src={profileData.profilePicture}
//                   alt="Profile"
//                   className="profile-pic-large"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.nextSibling.style.display = 'flex';
//                   }}
//                 />
//               ) : null}
//               <div 
//                 className={`profile-placeholder-large ${profileData.profilePicture ? 'hidden' : ''}`}
//               >
//                 <span>
//                   {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
//                 </span>
//               </div>
//             </div>

//             <div className="profile-info-grid">
//               <div className="profile-field">
//                 <label>Full Name</label>
//                 <p>{profileData.name || 'Not provided'}</p>
//               </div>
//               <div className="profile-field">
//                 <label>Email</label>
//                 <p>{profileData.email || 'Not provided'}</p>
//               </div>
//               <div className="profile-field">
//                 <label>Phone</label>
//                 <p>{profileData.phone || 'Not provided'}</p>
//               </div>
//               <div className="profile-field">
//                 <label>Pickup Address</label>
//                 <p>{profileData.pickupAddress || 'Not provided'}</p>
//               </div>
//             </div>

//             <div className="profile-actions">
//               <button 
//                 onClick={handleShowCertificates}
//                 className="certificate-button"
//               >
//                 <div className="certificate-icon">
//                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                   </svg>
//                 </div>
//                 <span>Certificates Earned ({certificates.length})</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Report Generation Modal */}
//       {showReportModal && (
//         <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Generate Report</h3>
//               <button 
//                 className="modal-close"
//                 onClick={() => setShowReportModal(false)}
//               >
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <p>Select the time range for your report:</p>
              
//               <div className="radio-group">
//                 <label className="radio-option">
//                   <input
//                     type="radio"
//                     name="days"
//                     value={3}
//                     checked={selectedDays === 3}
//                     onChange={(e) => setSelectedDays(parseInt(e.target.value))}
//                   />
//                   <span>Last 3 days</span>
//                 </label>
                
//                 <label className="radio-option">
//                   <input
//                     type="radio"
//                     name="days"
//                     value={7}
//                     checked={selectedDays === 7}
//                     onChange={(e) => setSelectedDays(parseInt(e.target.value))}
//                   />
//                   <span>Last 7 days</span>
//                 </label>
                
//                 <label className="radio-option">
//                   <input
//                     type="radio"
//                     name="days"
//                     value={30}
//                     checked={selectedDays === 30}
//                     onChange={(e) => setSelectedDays(parseInt(e.target.value))}
//                   />
//                   <span>Last 30 days</span>
//                 </label>
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 className="btn btn-secondary"
//                 onClick={() => setShowReportModal(false)}
//                 disabled={generatingReport}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="btn btn-primary"
//                 onClick={handleGenerateReport}
//                 disabled={generatingReport}
//               >
//                 {generatingReport ? 'Generating...' : 'Generate Report'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Certificates Modal */}
//       {showCertificatesModal && (
//         <div className="modal-overlay" onClick={() => setShowCertificatesModal(false)}>
//           <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Certificates Earned</h3>
//               <button 
//                 className="modal-close"
//                 onClick={() => setShowCertificatesModal(false)}
//               >
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="modal-body">
//               {loadingCertificates ? (
//                 <div className="certificate-loading">
//                   <Loader />
//                   <p>Loading certificates...</p>
//                 </div>
//               ) : certificates.length === 0 ? (
//                 <div className="no-certificates">
//                   <div className="no-certificates-icon">
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                     </svg>
//                   </div>
//                   <h4>No Certificates Yet</h4>
//                   <p>Complete 5 e-waste pickup requests to earn your first Certificate of Appreciation!</p>
//                   <p>You currently have <strong>{requestStats.completed}</strong> completed requests.</p>
//                   {certificateProgress.remaining < 5 && (
//                     <p>Only <strong>{certificateProgress.remaining}</strong> more to go!</p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="certificates-grid">
//                   {certificates.map((certificate) => (
//                     <div key={certificate.id} className="certificate-card">
//                       <div className="certificate-header">
//                         <div className="certificate-badge">
//                           <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                           </svg>
//                         </div>
//                         <h4>{certificate.title}</h4>
//                       </div>
                      
//                       <div className="certificate-info">
//                         <p className="certificate-description">
//                           {certificate.recognitionText}
//                         </p>
//                         <div className="certificate-details">
//                           <span className="certificate-date">
//                             Issued on {formatDate(certificate.issuedAt)}
//                           </span>
//                           <span className="certificate-requests">
//                             {certificate.completedRequests} requests completed
//                           </span>
//                         </div>
//                       </div>
                      
//                       <div className="certificate-actions">
//                         <button 
//                           onClick={() => handleDownloadCertificate(certificate)}
//                           className="btn btn-primary btn-sm"
//                           disabled={downloadingCertificate}
//                         >
//                           {downloadingCertificate ? 'Downloading...' : 'Download'}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;