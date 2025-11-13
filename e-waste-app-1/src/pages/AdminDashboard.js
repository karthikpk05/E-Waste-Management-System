// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import StatCard from '../components/StatCard';
// import EnhancedImageModal from '../components/EnhancedImageModal';
// import { PageLoader } from '../components/Loader';
// import { adminService } from "../services/adminService";
// import './AdminDashboard.css';

// // DetailModal Component with image click support
// const DetailModal = ({ request, closeModal, onAction, onImageClick }) => (
//   <div className="modal-overlay" onClick={closeModal}>
//     <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
//       <div className="modal-header">
//         <h3>Request Details</h3>
//         <button onClick={closeModal} className="modal-close">×</button>
//       </div>
//       <div className="modal-body">
//         {/* Device Info */}
//         <div className="detail-section">
//           <h4>Device Information</h4>
//           <div className="detail-grid">
//             <div><strong>Device Type:</strong> {request.deviceType}</div>
//             <div><strong>Brand:</strong> {request.brand}</div>
//             <div><strong>Model:</strong> {request.model}</div>
//             <div><strong>Condition:</strong> {request.condition}</div>
//             <div><strong>Quantity:</strong> {request.quantity}</div>
//             <div>
//               <strong>Status:</strong>{" "}
//               <span className={`status-badge status-${request.status.toLowerCase()}`}>
//                 {request.status}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* User Info */}
//         <div className="detail-section">
//           <h4>User Information</h4>
//           <div className="detail-grid">
//             <div><strong>Name:</strong> {request.userName || "Unknown User"}</div>
//             <div><strong>Email:</strong> {request.userEmail || "N/A"}</div>
//           </div>
//         </div>

//         {/* Pickup Info */}
//         <div className="detail-section">
//           <h4>Pickup Details</h4>
//           <div className="detail-grid">
//             <div><strong>Address:</strong> {request.pickupAddress}</div>
//             <div><strong>Preferred Time:</strong> {request.pickupTimeSlot || "N/A"}</div>
//             {request.pickupDateTime && (
//               <div><strong>Scheduled:</strong> {new Date(request.pickupDateTime).toLocaleString()}</div>
//             )}
//             {request.pickupPersonnel && (
//               <div><strong>Personnel:</strong> {request.pickupPersonnel}</div>
//             )}
//           </div>
//         </div>

//         {/* Remarks */}
//         {request.remarks && (
//           <div className="detail-section">
//             <h4>Remarks</h4>
//             <p>{request.remarks}</p>
//           </div>
//         )}

//         {/* Rejection Reason */}
//         {request.rejectionReason && (
//           <div className="detail-section">
//             <h4>Rejection Reason</h4>
//             <p>{request.rejectionReason}</p>
//           </div>
//         )}

//         {/* Images with enhanced click support */}
//         {request.imagePaths && request.imagePaths.length > 0 && (
//           <div className="detail-section">
//             <h4>Images ({request.imagePaths.length})</h4>
//             <div className="detail-images">
//               {request.imagePaths.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={`http://localhost:8080/files/${img}`}
//                   alt={`Device ${idx + 1}`}
//                   style={{ 
//                     width: "120px", 
//                     height: "120px",
//                     objectFit: "cover",
//                     marginRight: "10px",
//                     cursor: "pointer",
//                     borderRadius: "6px",
//                     border: "2px solid #dee2e6",
//                     transition: "all 0.3s ease"
//                   }}
//                   onClick={() => onImageClick && onImageClick(request.imagePaths, idx)}
//                   onMouseEnter={(e) => {
//                     e.target.style.borderColor = "#007bff";
//                     e.target.style.transform = "scale(1.05)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.borderColor = "#dee2e6";
//                     e.target.style.transform = "scale(1)";
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="detail-actions">
//           {request.status === "PENDING" && (
//             <>
//               <button onClick={() => onAction(request, "approve")} className="btn btn-success">
//                 Approve
//               </button>
//               <button onClick={() => onAction(request, "reject")} className="btn btn-danger">
//                 Reject
//               </button>
//             </>
//           )}
//           {request.status === "APPROVED" && (
//             <button onClick={() => onAction(request, "schedule")} className="btn btn-primary">
//               Schedule
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // ActionModal Component with pickup person selection
// const ActionModal = ({ request, actionType, actionData, setActionData, closeModal, executeAction, pickupPersons }) => (
//   <div className="modal-overlay" onClick={closeModal}>
//     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//       <div className="modal-header">
//         <h3>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Request</h3>
//         <button onClick={closeModal} className="modal-close">×</button>
//       </div>
//       <div className="modal-body">
//         <div className="request-summary">
//           <h4>{request.deviceType} - {request.brand} {request.model}</h4>
//           <p>User: {request.userName || 'Unknown User'} ({request.userEmail || 'N/A'})</p>
//         </div>

//         {actionType === 'approve' && <p>Are you sure you want to approve this request?</p>}

//         {actionType === 'reject' && (
//           <div className="form-group">
//             <label>Rejection Reason *</label>
//             <textarea
//               value={actionData.reason}
//               onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
//               className="form-input"
//               rows="4"
//             />
//           </div>
//         )}

//         {actionType === 'schedule' && (
//           <div className="form-grid">
//             <div className="form-group">
//               <label>Pickup Date *</label>
//               <input
//                 type="date"
//                 value={actionData.pickupDate}
//                 onChange={(e) => setActionData({ ...actionData, pickupDate: e.target.value })}
//                 min={new Date().toISOString().split('T')[0]}
//                 className="form-input"
//               />
//             </div>
//             <div className="form-group">
//               <label>Pickup Time *</label>
//               <input
//                 type="time"
//                 value={actionData.pickupTime}
//                 onChange={(e) => setActionData({ ...actionData, pickupTime: e.target.value })}
//                 className="form-input"
//               />
//             </div>
//             <div className="form-group" style={{ gridColumn: '1 / -1' }}>
//               <label>Assign Pickup Person</label>
//               <select
//                 value={actionData.pickupPersonId || ''}
//                 onChange={(e) => setActionData({ ...actionData, pickupPersonId: e.target.value || null })}
//                 className="form-input"
//               >
//                 <option value="">Select pickup person (optional)</option>
//                 {pickupPersons.map(person => (
//                   <option key={person.id} value={person.id}>
//                     {person.name} - {person.email}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}

//         <div className="modal-actions">
//           <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
//           <button onClick={executeAction} className={`btn ${actionType === 'reject' ? 'btn-danger' : 'btn-primary'}`}>
//             {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Report Generation Modal
// const ReportModal = ({ closeModal, generateReport }) => {
//   const [reportDays, setReportDays] = useState('30');
//   const [customDays, setCustomDays] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleGenerate = async () => {
//     const days = reportDays === 'custom' ? customDays : reportDays;
//     if (!days || days <= 0) {
//       alert('Please enter a valid number of days');
//       return;
//     }
//     setLoading(true);
//     try {
//       await generateReport(parseInt(days));
//       closeModal();
//     } catch (error) {
//       console.error('Error generating report:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={closeModal}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>Generate Admin Report</h3>
//           <button onClick={closeModal} className="modal-close">×</button>
//         </div>
//         <div className="modal-body">
//           <div className="form-group">
//             <label>Report Duration</label>
//             <select
//               value={reportDays}
//               onChange={(e) => setReportDays(e.target.value)}
//               className="form-input"
//             >
//               <option value="10">Last 10 days</option>
//               <option value="30">Last 30 days</option>
//               <option value="90">Last 90 days</option>
//               <option value="custom">Custom days</option>
//             </select>
//           </div>

//           {reportDays === 'custom' && (
//             <div className="form-group">
//               <label>Number of Days</label>
//               <input
//                 type="number"
//                 value={customDays}
//                 onChange={(e) => setCustomDays(e.target.value)}
//                 min="1"
//                 max="365"
//                 className="form-input"
//                 placeholder="Enter number of days"
//               />
//             </div>
//           )}

//           <div className="modal-actions">
//             <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
//             <button 
//               onClick={handleGenerate} 
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading ? 'Generating...' : 'Generate Report'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('requests');
//   const [requests, setRequests] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [pickupPersons, setPickupPersons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState({ type: '', message: '' });
  
//   // Enhanced image modal states
//   const [showEnhancedModal, setShowEnhancedModal] = useState(false);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [initialImageIndex, setInitialImageIndex] = useState(0);
  
//   // Modal states
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showActionModal, setShowActionModal] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [actionType, setActionType] = useState('');
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [actionData, setActionData] = useState({
//     reason: '',
//     pickupDate: '',
//     pickupTime: '',
//     pickupPersonId: null
//   });
  
//   // Search and Filter states
//   const [requestSearchTerm, setRequestSearchTerm] = useState('');
//   const [userSearchTerm, setUserSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('ALL');
//   const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  
//   const [requestStats, setRequestStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     scheduled: 0,
//     completed: 0
//   });

//   const [userStats, setUserStats] = useState({
//     total: 0,
//     users: 0,
//     admins: 0,
//     pickupPersons: 0
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     calculateStats();
//     filterRequests();
//   }, [requests, requestSearchTerm, statusFilter]);

//   useEffect(() => {
//     calculateUserStats();
//     filterUsers();
//   }, [users, userSearchTerm, userRoleFilter]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [requestsResponse, usersResponse, pickupPersonsResponse] = await Promise.all([
//         adminService.getAllRequests(),
//         adminService.getAllUsers(),
//         adminService.getPickupPersons().catch(() => ({ data: [] }))
//       ]);
      
//       const requestsData = requestsResponse.data || [];
//       const usersData = usersResponse.data || [];
//       const pickupPersonsData = pickupPersonsResponse.data || [];
      
//       // Create a user lookup map for enhancing requests
//       const userMap = {};
//       usersData.forEach(user => {
//         if (user.id) {
//           userMap[user.id] = user;
//         }
//       });
      
//       // Enhance requests with complete user information
//       const enhancedRequests = requestsData.map(request => {
//         const userId = request.user?.id || request.userId;
//         const userFromMap = userMap[userId];
        
//         return {
//           ...request,
//           user: userFromMap || request.user || { name: 'Unknown User', email: 'N/A' },
//           // Normalize user fields for easier access
//           userName: userFromMap?.name || request.userName || request.user?.name || 'Unknown User',
//           userEmail: userFromMap?.email || request.userEmail || request.user?.email || 'N/A',
//           userId: userId || null
//         };
//       });
      
//       setRequests(enhancedRequests);
//       setUsers(usersData);
//       setPickupPersons(pickupPersonsData);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to load data';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = () => {
//     const stats = {
//       total: requests.length,
//       pending: requests.filter(r => r.status === 'PENDING').length,
//       approved: requests.filter(r => r.status === 'APPROVED').length,
//       rejected: requests.filter(r => r.status === 'REJECTED').length,
//       scheduled: requests.filter(r => r.status === 'SCHEDULED').length,
//       completed: requests.filter(r => r.status === 'COMPLETED').length
//     };
//     setRequestStats(stats);
//   };

//   const calculateUserStats = () => {
//     const stats = {
//       total: users.length,
//       users: users.filter(u => u.role && u.role.toLowerCase() === 'user').length,
//       admins: users.filter(u => u.role && u.role.toLowerCase() === 'admin').length,
//       pickupPersons: users.filter(u => u.role && u.role.toLowerCase() === 'pickup').length
//     };
//     setUserStats(stats);
//   };

//   // Enhanced getUserRequestStats with debugging
//   const getUserRequestStats = (user) => {
//     console.log('Checking user:', user.name, 'ID:', user.id, 'Email:', user.email);
//     console.log('Total requests in system:', requests.length);
    
//     if (requests.length > 0) {
//       console.log('Sample request structure:', requests[0]);
//     }
    
//     // Try multiple matching strategies
//     const userRequests = requests.filter(request => {
//       const matches = [
//         request.userId === user.id,
//         request.user?.id === user.id,
//         request.userEmail === user.email,
//         request.user?.email === user.email,
//         // Try string comparison in case of type mismatch
//         String(request.userId) === String(user.id),
//         String(request.user?.id) === String(user.id)
//       ];
      
//       const isMatch = matches.some(Boolean);
      
//       if (isMatch) {
//         console.log('Found matching request:', {
//           requestId: request.id || request.requestId,
//           userId: request.userId,
//           userObj: request.user,
//           userEmail: request.userEmail,
//           status: request.status
//         });
//       }
      
//       return isMatch;
//     });
    
//     const completedRequests = userRequests.filter(r => {
//       const isCompleted = r.status === 'COMPLETED' || r.status === 'completed';
//       if (isCompleted) {
//         console.log('Found completed request for user:', user.name);
//       }
//       return isCompleted;
//     });
    
//     console.log(`Final result for ${user.name}: ${userRequests.length} total, ${completedRequests.length} completed`);
    
//     return {
//       totalRequests: userRequests.length,
//       completedRequests: completedRequests.length
//     };
//   };

//   // Debug function to analyze data structure
//   // Replace your debugAllData function with this enhanced version:

// const debugAllData = () => {
//   console.clear();
//   console.log('=== COMPLETE DATA DEBUG ===');
  
//   console.log('Users count:', users.length);
//   console.log('Requests count:', requests.length);
  
//   console.log('\n--- USERS SAMPLE (Detailed) ---');
//   users.slice(0, 3).forEach((user, i) => {
//     console.log(`User ${i + 1}:`, JSON.stringify(user, null, 2));
//   });
  
//   console.log('\n--- REQUESTS SAMPLE (Detailed) ---');
//   requests.slice(0, 3).forEach((request, i) => {
//     console.log(`Request ${i + 1}:`, JSON.stringify(request, null, 2));
//   });
  
//   console.log('\n--- ROLE ANALYSIS ---');
//   const roleCount = {};
//   users.forEach(user => {
//     const role = user.role || 'undefined';
//     roleCount[role] = (roleCount[role] || 0) + 1;
//   });
//   console.log('Role distribution:', JSON.stringify(roleCount, null, 2));
  
//   console.log('\n--- STATUS ANALYSIS ---');
//   const statusCount = {};
//   requests.forEach(request => {
//     const status = request.status || 'undefined';
//     statusCount[status] = (statusCount[status] || 0) + 1;
//   });
//   console.log('Status distribution:', JSON.stringify(statusCount, null, 2));

//   // Test matching for first user
//   if (users.length > 0 && requests.length > 0) {
//     console.log('\n--- MATCHING TEST ---');
//     const testUser = users[0];
//     console.log('Testing with user:', JSON.stringify(testUser, null, 2));
    
//     console.log('Checking requests for matches:');
//     const matches = [];
//     requests.forEach((request, i) => {
//       const requestUserId = request.user?.id || request.userId;
//       const requestUserEmail = request.user?.email || request.userEmail;
      
//       const matchById = requestUserId && testUser.id && requestUserId.toString() === testUser.id.toString();
//       const matchByEmail = requestUserEmail && testUser.email && requestUserEmail.toLowerCase() === testUser.email.toLowerCase();
      
//       if (matchById || matchByEmail) {
//         matches.push({
//           requestIndex: i,
//           requestId: request.id || request.requestId,
//           matchedBy: matchById ? 'ID' : 'Email',
//           requestUserId: requestUserId,
//           requestUserEmail: requestUserEmail,
//           status: request.status
//         });
//       }
//     });
    
//     console.log(`Found ${matches.length} matching requests:`, JSON.stringify(matches, null, 2));
//   }
// };
//   // const debugAllData = () => {
//   //   console.clear();
//   //   console.log('=== COMPLETE DATA DEBUG ===');
    
//   //   console.log('Users count:', users.length);
//   //   console.log('Requests count:', requests.length);
    
//   //   console.log('\n--- USERS SAMPLE ---');
//   //   users.slice(0, 3).forEach((user, i) => {
//   //     console.log(`User ${i + 1}:`, {
//   //       id: user.id,
//   //       name: user.name,
//   //       email: user.email,
//   //       role: user.role,
//   //       fullObject: user
//   //     });
//   //   });
    
//   //   console.log('\n--- REQUESTS SAMPLE ---');
//   //   requests.slice(0, 3).forEach((request, i) => {
//   //     console.log(`Request ${i + 1}:`, {
//   //       id: request.id || request.requestId,
//   //       userId: request.userId,
//   //       userObject: request.user,
//   //       userEmail: request.userEmail,
//   //       userName: request.userName,
//   //       status: request.status,
//   //       fullObject: request
//   //     });
//   //   });
    
//   //   console.log('\n--- ROLE ANALYSIS ---');
//   //   const roleCount = {};
//   //   users.forEach(user => {
//   //     const role = user.role || 'undefined';
//   //     roleCount[role] = (roleCount[role] || 0) + 1;
//   //   });
//   //   console.log('Role distribution:', roleCount);
    
//   //   console.log('\n--- STATUS ANALYSIS ---');
//   //   const statusCount = {};
//   //   requests.forEach(request => {
//   //     const status = request.status || 'undefined';
//   //     statusCount[status] = (statusCount[status] || 0) + 1;
//   //   });
//   //   console.log('Status distribution:', statusCount);
//   // };

//   const filterRequests = () => {
//     let filtered = requests;

//     // Filter by status
//     if (statusFilter !== 'ALL') {
//       filtered = filtered.filter(request => request.status === statusFilter);
//     }

//     // Filter by search term
//     if (requestSearchTerm) {
//       const term = requestSearchTerm.toLowerCase();
//       filtered = filtered.filter(request => 
//         (request.userName || '').toLowerCase().includes(term) ||
//         (request.deviceType || '').toLowerCase().includes(term) ||
//         (request.brand || '').toLowerCase().includes(term) ||
//         (request.model || '').toLowerCase().includes(term) ||
//         (request.userEmail || '').toLowerCase().includes(term)
//       );
//     }

//     setFilteredRequests(filtered);
//   };

//   const filterUsers = () => {
//     let filtered = users;

//     // Filter by role
//     if (userRoleFilter !== 'ALL') {
//       filtered = filtered.filter(user => user.role === userRoleFilter);
//     }

//     // Filter by search term
//     if (userSearchTerm) {
//       const term = userSearchTerm.toLowerCase();
//       filtered = filtered.filter(user => 
//         (user.name || '').toLowerCase().includes(term) ||
//         (user.email || '').toLowerCase().includes(term) ||
//         (user.username || '').toLowerCase().includes(term)
//       );
//     }

//     setFilteredUsers(filtered);
//   };

//   const handleViewDetails = (request) => {
//     setSelectedRequest(request);
//     setShowDetailModal(true);
//   };

//   const handleAction = (request, action) => {
//     const requestId = request.id || request.requestId;

//     if (!requestId) {
//       console.error('Request ID is missing', request);
//       setNotification({ type: 'error', message: 'Invalid request selected' });
//       return;
//     }

//     const normalizedRequest = { ...request, id: requestId };
//     setSelectedRequest(normalizedRequest);
//     setActionType(action);
//     setActionData({ reason: '', pickupDate: '', pickupTime: '', pickupPersonId: null });
//     setShowDetailModal(false);
//     setShowActionModal(true);
//   };

//   const executeAction = async () => {
//     if (!selectedRequest?.id) return;

//     const requestId = selectedRequest.id;

//     try {
//       let response;
//       switch (actionType) {
//         case 'approve':
//           response = await adminService.approveRequest(requestId);
//           break;
//         case 'reject':
//           if (!actionData.reason.trim()) {
//             setNotification({ type: 'error', message: 'Rejection reason is required' });
//             return;
//           }
//           response = await adminService.rejectRequest(requestId, actionData.reason);
//           break;
//         case 'schedule':
//           if (!actionData.pickupDate || !actionData.pickupTime) {
//             setNotification({ type: 'error', message: 'Pickup date and time are required' });
//             return;
//           }
          
//           const selectedDate = new Date(actionData.pickupDate);
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
          
//           if (selectedDate < today) {
//             setNotification({ type: 'error', message: 'Pickup date cannot be in the past' });
//             return;
//           }
          
//           const pickupDateTime = `${actionData.pickupDate}T${actionData.pickupTime}`;
//           response = await adminService.scheduleRequest(
//             requestId,
//             pickupDateTime,
//             actionData.pickupPersonId
//           );
//           break;
//         default:
//           return;
//       }

//       const actionVerbs = {
//         approve: "approved",
//         reject: "rejected",
//         schedule: "scheduled",
//       };
  
//       setNotification({
//         type: 'success',
//         message: `Request ${actionVerbs[actionType]} successfully!`,
//       });

//       setShowActionModal(false);
//       fetchData();
//     } catch (error) {
//       console.error(`Error ${actionType}ing request:`, error);
      
//       let errorMessage = `Failed to ${actionType} request`;
//       if (error.response?.status === 403) {
//         errorMessage = 'Access denied. You may not have permission to perform this action.';
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setNotification({ type: 'error', message: errorMessage });
//     }
//   };

//   // Enhanced image modal functions
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

//   const generateReport = async (days) => {
//     try {
//       const response = await adminService.generateReport(days);
//       // Create a blob from the response and download
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `admin_report_${days}_days.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       setNotification({
//         type: 'success',
//         message: `Report for ${days} days generated successfully!`,
//       });
//     } catch (error) {
//       console.error('Error generating report:', error);
//       setNotification({
//         type: 'error',
//         message: 'Failed to generate report. Please try again.',
//       });
//     }
//   };

//   const closeActionModal = () => {
//     setShowActionModal(false);
//     setSelectedRequest(null);
//     setActionData({ reason: '', pickupDate: '', pickupTime: '', pickupPersonId: null });
//   };

//   const getStatusBadge = (status) => (
//     <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
//   );

//   const getRoleBadge = (role) => {
//     if (!role) {
//       return <span className="role-badge role-unknown">UNKNOWN</span>;
//     }
//     return (
//       <span className={`role-badge role-${role.toLowerCase()}`}>
//         {role.toUpperCase()}
//       </span>
//     );
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div>
//         <Navbar title="Admin Dashboard" />
//         <PageLoader text="Loading data..." />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">
//       <Navbar title="Admin Dashboard" />
//       <div className="dashboard-container">
//         {notification.message && (
//           <Notification 
//             type={notification.type} 
//             message={notification.message} 
//             onClose={() => setNotification({ type: '', message: '' })} 
//           />
//         )}

//         <div className="stats-container">
//           {activeTab === 'requests' ? (
//             <>
//               <div className="stats-grid-top">
//                 <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//                 <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//                 <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//                 <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//               </div>
//               <div className="stats-grid-bottom">
//                 <StatCard title="Completed" count={requestStats.completed} color="gray" icon="completed" />
//                 <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
//                 <StatCard title="Total Users" count={userStats.total} color="orange" icon="total" />
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="stats-grid-top">
//                 <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//                 <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//                 <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//                 <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//               </div>
//               <div className="stats-grid-bottom">
//                 <StatCard title="Completed" count={requestStats.completed} color="gray" icon="completed" />
//                 <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
//                 <StatCard title="Total Users" count={userStats.total} color="orange" icon="total" />
//               </div>
//             </>
//           )}
//         </div>

//         {/* Tab Navigation */}
//         <div className="tab-navigation">
//           <button 
//             className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
//             onClick={() => setActiveTab('requests')}
//           >
//             Request Management
//           </button>
//           <button 
//             className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
//             onClick={() => setActiveTab('users')}
//           >
//             User Management
//           </button>
//         </div>

//         {/* Tab Content */}
//         {activeTab === 'requests' && (
//           <>
//             {/* Search and Filter Section */}
//             <div className="search-filter-section">
//               <div className="search-bar">
//                 <input
//                   type="text"
//                   placeholder="Search by user name, device type, brand, model, or email..."
//                   value={requestSearchTerm}
//                   onChange={(e) => setRequestSearchTerm(e.target.value)}
//                   className="search-input"
//                 />
//                 <button className="search-btn">🔍</button>
//               </div>

//               <div className="filter-dropdown">
//                 <select 
//                   value={statusFilter} 
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="filter-select"
//                 >
//                   <option value="ALL">All Status</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="APPROVED">Approved</option>
//                   <option value="REJECTED">Rejected</option>
//                   <option value="SCHEDULED">Scheduled</option>
//                   <option value="COMPLETED">Completed</option>
//                 </select>
//               </div>

//               <button 
//                 onClick={() => setShowReportModal(true)}
//                 className="btn btn-primary"
//               >
//                 Generate Report
//               </button>
//             </div>

//             {/* Results Summary */}
//             <div className="results-summary">
//               Showing {filteredRequests.length} of {requests.length} requests
//               {requestSearchTerm && ` for "${requestSearchTerm}"`}
//               {statusFilter !== 'ALL' && ` with status "${statusFilter}"`}
//             </div>

//             {/* Requests Table */}
//             {filteredRequests.length === 0 ? (
//               <div className="empty-state">
//                 <p>No requests found matching your criteria.</p>
//               </div>
//             ) : (
//               <div className="requests-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>User</th>
//                       <th>Device</th>
//                       <th>Brand</th>
//                       <th>Model</th>
//                       <th>Status</th>
//                       <th>Date</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredRequests.map((request) => (
//                       <tr key={request.requestId}>
//                         <td>{request.userName || 'Unknown User'}</td>
//                         <td>{request.deviceType}</td>
//                         <td>{request.brand}</td>
//                         <td>{request.model}</td>
//                         <td>{getStatusBadge(request.status)}</td>
//                         <td>{formatDate(request.createdAt)}</td>
//                         <td>
//                           <button 
//                             onClick={() => handleViewDetails(request)}
//                             className="btn btn-info btn-sm"
//                           >
//                             View Details
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}

//         {activeTab === 'users' && (
//           <>
//             {/* User Search and Filter Section */}
//             <div className="search-filter-section">
//               <div className="search-bar">
//                 <input
//                   type="text"
//                   placeholder="Search by name or email..."
//                   value={userSearchTerm}
//                   onChange={(e) => setUserSearchTerm(e.target.value)}
//                   className="search-input"
//                 />
//                 <button className="search-btn">🔍</button>
//               </div>
//             </div>

//             {/* User Results Summary */}
//             <div className="results-summary">
//               Showing {filteredUsers.length} of {users.length} users
//               {userSearchTerm && ` for "${userSearchTerm}"`}
//               {userRoleFilter !== 'ALL' && ` with role "${userRoleFilter}"`}
//             </div>

//             {/* Users Table */}
//             {filteredUsers.length === 0 ? (
//               <div className="empty-state">
//                 <p>No users found matching your criteria.</p>
//               </div>
//             ) : (
//               <div className="requests-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Profile</th>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Phone</th>
//                       <th>Requests Submitted</th>
//                       <th>Pickups Completed</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map((user) => {
//                       const requestStats = getUserRequestStats(user);
//                       return (
//                         <tr key={user.id || user.email}>
//                           <td>
//                             <div className="user-profile-cell">
//                               {user.profilePicture ? (
//                                 <img
//                                   src={user.profilePicture}
//                                   alt="Profile"
//                                   className="user-profile-pic"
//                                   onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.nextSibling.style.display = 'flex';
//                                   }}
//                                 />
//                               ) : null}
//                               <div 
//                                 className={`user-profile-placeholder ${user.profilePicture ? 'hidden' : ''}`}
//                               >
//                                 <span>
//                                   {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
//                                 </span>
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <div className="user-name-cell">
//                               <strong>{user.name || 'N/A'}</strong>
//                               {/* <div className="user-role-badge">
//                                 {getRoleBadge(user.role)}
//                               </div> */}
//                             </div>
//                           </td>
//                           <td>
//                             <span title={`User ID: ${user.id || 'N/A'}`}>
//                               {user.email || 'N/A'}
//                             </span>
//                           </td>
//                           <td>{user.phone || 'N/A'}</td>
//                           <td>
//                             <span 
//                               className={`stats-badge stats-submitted ${requestStats.totalRequests > 0 ? '' : 'zero-stats'}`}
//                               title={`Total requests submitted by this user`}
//                             >
//                               {requestStats.totalRequests}
//                             </span>
//                           </td>
//                           <td>
//                             <span 
//                               className={`stats-badge stats-completed ${requestStats.completedRequests > 0 ? '' : 'zero-stats'}`}
//                               title={`Requests completed for this user`}
//                             >
//                               {requestStats.completedRequests}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Detail Modal */}
//       {showDetailModal && selectedRequest && (
//         <DetailModal 
//           request={selectedRequest}
//           closeModal={() => setShowDetailModal(false)}
//           onAction={handleAction}
//           onImageClick={openImageModal}
//         />
//       )}

//       {/* Action Modal */}
//       {showActionModal && selectedRequest && (
//         <ActionModal
//           request={selectedRequest}
//           actionType={actionType}
//           actionData={actionData}
//           setActionData={setActionData}
//           closeModal={closeActionModal}
//           executeAction={executeAction}
//           pickupPersons={pickupPersons}
//         />
//       )}

//       {/* Report Modal */}
//       {showReportModal && (
//         <ReportModal
//           closeModal={() => setShowReportModal(false)}
//           generateReport={generateReport}
//         />
//       )}

//       {/* Enhanced Image Modal */}
//       {showEnhancedModal && selectedImages.length > 0 && (
//         <EnhancedImageModal
//           images={selectedImages}
//           initialIndex={initialImageIndex}
//           closeModal={closeImageModal}
//         />
//       )}

//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import StatCard from '../components/StatCard';
import EnhancedImageModal from '../components/EnhancedImageModal';
import { PageLoader } from '../components/Loader';
import { adminService } from "../services/adminService";
// import { StatusDistributionChart, TimeSeriesChart, DeviceTypeChart, SummaryMetrics } from '../components/ResponsiveCharts';
import { StatusDistributionChart, TimeSeriesChart, SummaryMetrics } from '../components/ResponsiveCharts';
import './AdminDashboard.css';

// Add this at the top of your AdminDashboard component, after the imports
// const ResponsiveStyles = () => (
//   <style jsx>{`
//     @media (max-width: 1200px) {
//       .analytics-row {
//         grid-template-columns: 1fr !important;
//         gap: 25px !important;
//       }
//     }
    
//     @media (max-width: 768px) {
//       .pie-chart {
//         flex-direction: column !important;
//         gap: 20px !important;
//       }
      
//       .pie-chart-visual {
//         width: 120px !important;
//         height: 120px !important;
//       }
//     }
//   `}</style>
// );

// Then add <ResponsiveStyles /> right after your <Navbar> component

// DetailModal Component with image click support
const DetailModal = ({ request, closeModal, onAction, onImageClick }) => (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Request Details</h3>
        <button onClick={closeModal} className="modal-close">×</button>
      </div>
      <div className="modal-body">
        {/* Device Info */}
        <div className="detail-section">
          <h4>Device Information</h4>
          <div className="detail-grid">
            <div><strong>Device Type:</strong> {request.deviceType}</div>
            <div><strong>Brand:</strong> {request.brand}</div>
            <div><strong>Model:</strong> {request.model}</div>
            <div><strong>Condition:</strong> {request.condition}</div>
            <div><strong>Quantity:</strong> {request.quantity}</div>
            <div>
              <strong>Status:</strong>{" "}
              <span className={`status-badge status-${request.status.toLowerCase()}`}>
                {request.status}
              </span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="detail-section">
          <h4>User Information</h4>
          <div className="detail-grid">
            <div><strong>Name:</strong> {request.userName || "Unknown User"}</div>
            <div><strong>Email:</strong> {request.userEmail || "N/A"}</div>
          </div>
        </div>

        {/* Pickup Info */}
        <div className="detail-section">
          <h4>Pickup Details</h4>
          <div className="detail-grid">
            <div><strong>Address:</strong> {request.pickupAddress}</div>
            <div><strong>Preferred Time:</strong> {request.pickupTimeSlot || "N/A"}</div>
            {request.pickupDateTime && (
              <div><strong>Scheduled:</strong> {new Date(request.pickupDateTime).toLocaleString()}</div>
            )}
            {request.pickupPersonnel && (
              <div><strong>Personnel:</strong> {request.pickupPersonnel}</div>
            )}
          </div>
        </div>

        {/* Remarks */}
        {request.remarks && (
          <div className="detail-section">
            <h4>Remarks</h4>
            <p>{request.remarks}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {request.rejectionReason && (
          <div className="detail-section">
            <h4>Rejection Reason</h4>
            <p>{request.rejectionReason}</p>
          </div>
        )}

        {/* Images with enhanced click support */}
        {request.imagePaths && request.imagePaths.length > 0 && (
          <div className="detail-section">
            <h4>Images ({request.imagePaths.length})</h4>
            <div className="detail-images">
              {request.imagePaths.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:8080/files/${img}`}
                  alt={`Device ${idx + 1}`}
                  style={{ 
                    width: "120px", 
                    height: "120px",
                    objectFit: "cover",
                    marginRight: "10px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "2px solid #dee2e6",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => onImageClick && onImageClick(request.imagePaths, idx)}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#007bff";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#dee2e6";
                    e.target.style.transform = "scale(1)";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="detail-actions">
          {request.status === "PENDING" && (
            <>
              <button onClick={() => onAction(request, "approve")} className="btn btn-success">
                Approve
              </button>
              <button onClick={() => onAction(request, "reject")} className="btn btn-danger">
                Reject
              </button>
            </>
          )}
          {request.status === "APPROVED" && (
            <button onClick={() => onAction(request, "schedule")} className="btn btn-primary">
              Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ActionModal Component with pickup person selection
const ActionModal = ({ request, actionType, actionData, setActionData, closeModal, executeAction, pickupPersons }) => (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Request</h3>
        <button onClick={closeModal} className="modal-close">×</button>
      </div>
      <div className="modal-body">
        <div className="request-summary">
          <h4>{request.deviceType} - {request.brand} {request.model}</h4>
          <p>User: {request.userName || 'Unknown User'} ({request.userEmail || 'N/A'})</p>
        </div>

        {actionType === 'approve' && <p>Are you sure you want to approve this request?</p>}

        {actionType === 'reject' && (
          <div className="form-group">
            <label>Rejection Reason *</label>
            <textarea
              value={actionData.reason}
              onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
              className="form-input"
              rows="4"
            />
          </div>
        )}

        {actionType === 'schedule' && (
          <div className="form-grid">
            <div className="form-group">
              <label>Pickup Date *</label>
              <input
                type="date"
                value={actionData.pickupDate}
                onChange={(e) => setActionData({ ...actionData, pickupDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Pickup Time *</label>
              <input
                type="time"
                value={actionData.pickupTime}
                onChange={(e) => setActionData({ ...actionData, pickupTime: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Assign Pickup Person *</label>
              <select
                value={actionData.pickupPersonId || ''}
                onChange={(e) => setActionData({ ...actionData, pickupPersonId: e.target.value || null })}
                className="form-input"
              >
                <option value="">Select pickup person</option>
                {pickupPersons.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} - {person.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
          <button onClick={executeAction} className={`btn ${actionType === 'reject' ? 'btn-danger' : 'btn-primary'}`}>
            {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Report Generation Modal
const ReportModal = ({ closeModal, generateReport }) => {
  const [reportDays, setReportDays] = useState('30');
  const [customDays, setCustomDays] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const days = reportDays === 'custom' ? customDays : reportDays;
    if (!days || days <= 0) {
      alert('Please enter a valid number of days');
      return;
    }
    setLoading(true);
    try {
      await generateReport(parseInt(days));
      closeModal();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Generate Admin Report</h3>
          <button onClick={closeModal} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Report Duration</label>
            <select
              value={reportDays}
              onChange={(e) => setReportDays(e.target.value)}
              className="form-input"
            >
              <option value="10">Last 10 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="custom">Custom days</option>
            </select>
          </div>

          {reportDays === 'custom' && (
            <div className="form-group">
              <label>Number of Days</label>
              <input
                type="number"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                min="1"
                max="365"
                className="form-input"
                placeholder="Enter number of days"
              />
            </div>
          )}

          <div className="modal-actions">
            <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
            <button 
              onClick={handleGenerate} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Chart Components
// const StatusDistributionChart = ({ data }) => {
//   const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
//   return (
//     <div className="chart-container">
//       <h3 className="chart-title">Request Status Distribution</h3>
//       <div className="pie-chart">
//         <div className="pie-chart-legend">
//           {Object.entries(data).map(([status, count]) => {
//             const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
//             return (
//               <div key={status} className="legend-item">
//                 <div className={`legend-color status-${status.toLowerCase()}`}></div>
//                 <span className="legend-text">
//                   {status}: {count} ({percentage}%)
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//         <div className="pie-chart-visual">
//           {Object.entries(data).map(([status, count], index) => {
//             const percentage = total > 0 ? (count / total) * 100 : 0;
//             return (
//               <div
//                 key={status}
//                 className={`pie-slice pie-slice-${index} status-${status.toLowerCase()}`}
//                 style={{ '--percentage': percentage }}
//               >
//                 <span className="slice-label">{count > 0 ? count : ''}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// const TimeSeriesChart = ({ data, period }) => {
//   const maxValue = Math.max(...Object.values(data));
  
//   return (
//     <div className="chart-container">
//       <h3 className="chart-title">{period} Request Submissions</h3>
//       <div className="bar-chart">
//         <div className="bar-chart-y-axis">
//           <div className="y-axis-label">{maxValue}</div>
//           <div className="y-axis-label">{Math.floor(maxValue * 0.75)}</div>
//           <div className="y-axis-label">{Math.floor(maxValue * 0.5)}</div>
//           <div className="y-axis-label">{Math.floor(maxValue * 0.25)}</div>
//           <div className="y-axis-label">0</div>
//         </div>
//         <div className="bar-chart-bars">
//           {Object.entries(data).map(([period, count]) => (
//             <div key={period} className="bar-item">
//               <div 
//                 className="bar"
//                 style={{ 
//                   height: maxValue > 0 ? `${(count / maxValue) * 100}%` : '0%' 
//                 }}
//               >
//                 <span className="bar-value">{count}</span>
//               </div>
//               <div className="bar-label">{period}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

const DeviceTypeChart = ({ data }) => {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Popular Device Types</h3>
      <div className="horizontal-bar-chart">
        {sortedData.map(([device, count]) => {
          const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
          return (
            <div key={device} className="horizontal-bar-item">
              <div className="horizontal-bar-label">{device}</div>
              <div className="horizontal-bar-container">
                <div 
                  className="horizontal-bar"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="horizontal-bar-value">{count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pickupPersons, setPickupPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // Analytics states
  const [analyticsData, setAnalyticsData] = useState({
    statusDistribution: {},
    weeklyData: {},
    monthlyData: {},
    yearlyData: {},
    deviceTypes: {}
  });
  const [analyticsPeriod, setAnalyticsPeriod] = useState('monthly');
  
  // Enhanced image modal states
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionData, setActionData] = useState({
    reason: '',
    pickupDate: '',
    pickupTime: '',
    pickupPersonId: null
  });
  
  // Search and Filter states
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  
  const [requestStats, setRequestStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    scheduled: 0,
    completed: 0
  });

  const [userStats, setUserStats] = useState({
    total: 0,
    users: 0,
    admins: 0,
    pickupPersons: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateStats();
    filterRequests();
    calculateAnalyticsData();
  }, [requests, requestSearchTerm, statusFilter]);

  useEffect(() => {
    calculateUserStats();
    filterUsers();
  }, [users, userSearchTerm, userRoleFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsResponse, usersResponse, pickupPersonsResponse] = await Promise.all([
        adminService.getAllRequests(),
        adminService.getAllUsers(),
        adminService.getPickupPersons().catch(() => ({ data: [] }))
      ]);
      
      const requestsData = requestsResponse.data || [];
      const usersData = usersResponse.data || [];
      const pickupPersonsData = pickupPersonsResponse.data || [];
      
      // Create a user lookup map for enhancing requests
      const userMap = {};
      usersData.forEach(user => {
        if (user.id) {
          userMap[user.id] = user;
        }
      });
      
      // Enhance requests with complete user information
      const enhancedRequests = requestsData.map(request => {
        const userId = request.user?.id || request.userId;
        const userFromMap = userMap[userId];
        
        return {
          ...request,
          user: userFromMap || request.user || { name: 'Unknown User', email: 'N/A' },
          // Normalize user fields for easier access
          userName: userFromMap?.name || request.userName || request.user?.name || 'Unknown User',
          userEmail: userFromMap?.email || request.userEmail || request.user?.email || 'N/A',
          userId: userId || null
        };
      });
      
      setRequests(enhancedRequests);
      setUsers(usersData);
      setPickupPersons(pickupPersonsData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load data';
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      approved: requests.filter(r => r.status === 'APPROVED').length,
      rejected: requests.filter(r => r.status === 'REJECTED').length,
      scheduled: requests.filter(r => r.status === 'SCHEDULED').length,
      completed: requests.filter(r => r.status === 'COMPLETED').length
    };
    setRequestStats(stats);
  };

  const calculateUserStats = () => {
    const stats = {
      total: users.length,
      users: users.filter(u => u.role && u.role.toLowerCase() === 'user').length,
      admins: users.filter(u => u.role && u.role.toLowerCase() === 'admin').length,
      pickupPersons: users.filter(u => u.role && u.role.toLowerCase() === 'pickup').length
    };
    setUserStats(stats);
  };

  const calculateAnalyticsData = () => {
    // Status distribution
    const statusDistribution = {
      PENDING: requests.filter(r => r.status === 'PENDING').length,
      APPROVED: requests.filter(r => r.status === 'APPROVED').length,
      REJECTED: requests.filter(r => r.status === 'REJECTED').length,
      SCHEDULED: requests.filter(r => r.status === 'SCHEDULED').length,
      COMPLETED: requests.filter(r => r.status === 'COMPLETED').length
    };

    // Device types distribution
    const deviceTypes = {};
    requests.forEach(request => {
      const device = request.deviceType || 'Unknown';
      deviceTypes[device] = (deviceTypes[device] || 0) + 1;
    });

    // Time-based data
    const now = new Date();
    const weeklyData = {};
    const monthlyData = {};
    const yearlyData = {};

    // Initialize weekly data (last 7 days)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      weeklyData[dayName] = 0;
    }

    // Initialize monthly data (last 12 months)
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthName] = 0;
    }

    // Initialize yearly data (last 3 years)
    for (let i = 2; i >= 0; i--) {
      const year = now.getFullYear() - i;
      yearlyData[year] = 0;
    }

    // Count requests by time periods
    requests.forEach(request => {
      if (request.createdAt) {
        const createdDate = new Date(request.createdAt);
        
        // Weekly count
        const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
        if (daysDiff < 7) {
          const dayName = createdDate.toLocaleDateString('en-US', { weekday: 'short' });
          if (weeklyData[dayName] !== undefined) {
            weeklyData[dayName]++;
          }
        }
        
        // Monthly count (last 12 months)
        const monthsDiff = (now.getFullYear() - createdDate.getFullYear()) * 12 + now.getMonth() - createdDate.getMonth();
        if (monthsDiff < 12) {
          const monthName = createdDate.toLocaleDateString('en-US', { month: 'short' });
          if (monthlyData[monthName] !== undefined) {
            monthlyData[monthName]++;
          }
        }
        
        // Yearly count
        const year = createdDate.getFullYear();
        if (yearlyData[year] !== undefined) {
          yearlyData[year]++;
        }
      }
    });

    setAnalyticsData({
      statusDistribution,
      weeklyData,
      monthlyData,
      yearlyData,
      deviceTypes
    });
  };

  // Enhanced getUserRequestStats with debugging
  const getUserRequestStats = (user) => {
    console.log('Checking user:', user.name, 'ID:', user.id, 'Email:', user.email);
    console.log('Total requests in system:', requests.length);
    
    if (requests.length > 0) {
      console.log('Sample request structure:', requests[0]);
    }
    
    // Try multiple matching strategies
    const userRequests = requests.filter(request => {
      const matches = [
        request.userId === user.id,
        request.user?.id === user.id,
        request.userEmail === user.email,
        request.user?.email === user.email,
        // Try string comparison in case of type mismatch
        String(request.userId) === String(user.id),
        String(request.user?.id) === String(user.id)
      ];
      
      const isMatch = matches.some(Boolean);
      
      if (isMatch) {
        console.log('Found matching request:', {
          requestId: request.id || request.requestId,
          userId: request.userId,
          userObj: request.user,
          userEmail: request.userEmail,
          status: request.status
        });
      }
      
      return isMatch;
    });
    
    const completedRequests = userRequests.filter(r => {
      const isCompleted = r.status === 'COMPLETED' || r.status === 'completed';
      if (isCompleted) {
        console.log('Found completed request for user:', user.name);
      }
      return isCompleted;
    });
    
    console.log(`Final result for ${user.name}: ${userRequests.length} total, ${completedRequests.length} completed`);
    
    return {
      totalRequests: userRequests.length,
      completedRequests: completedRequests.length
    };
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Filter by search term
    if (requestSearchTerm) {
      const term = requestSearchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        (request.userName || '').toLowerCase().includes(term) ||
        (request.deviceType || '').toLowerCase().includes(term) ||
        (request.brand || '').toLowerCase().includes(term) ||
        (request.model || '').toLowerCase().includes(term) ||
        (request.userEmail || '').toLowerCase().includes(term)
      );
    }

    setFilteredRequests(filtered);
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (userRoleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === userRoleFilter);
    }

    // Filter by search term
    if (userSearchTerm) {
      const term = userSearchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        (user.name || '').toLowerCase().includes(term) ||
        (user.email || '').toLowerCase().includes(term) ||
        (user.username || '').toLowerCase().includes(term)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleAction = (request, action) => {
    const requestId = request.id || request.requestId;

    if (!requestId) {
      console.error('Request ID is missing', request);
      setNotification({ type: 'error', message: 'Invalid request selected' });
      return;
    }

    const normalizedRequest = { ...request, id: requestId };
    setSelectedRequest(normalizedRequest);
    setActionType(action);
    setActionData({ reason: '', pickupDate: '', pickupTime: '', pickupPersonId: null });
    setShowDetailModal(false);
    setShowActionModal(true);
  };

  const executeAction = async () => {
    if (!selectedRequest?.id) return;

    const requestId = selectedRequest.id;

    try {
      let response;
      switch (actionType) {
        case 'approve':
          response = await adminService.approveRequest(requestId);
          break;
        case 'reject':
          if (!actionData.reason.trim()) {
            setNotification({ type: 'error', message: 'Rejection reason is required' });
            return;
          }
          response = await adminService.rejectRequest(requestId, actionData.reason);
          break;
        case 'schedule':
          if (!actionData.pickupDate || !actionData.pickupTime) {
            setNotification({ type: 'error', message: 'Pickup date and time are required' });
            return;
          }
          
          const selectedDate = new Date(actionData.pickupDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            setNotification({ type: 'error', message: 'Pickup date cannot be in the past' });
            return;
          }
          
          const pickupDateTime = `${actionData.pickupDate}T${actionData.pickupTime}`;
          response = await adminService.scheduleRequest(
            requestId,
            pickupDateTime,
            actionData.pickupPersonId
          );
          break;
        default:
          return;
      }

      const actionVerbs = {
        approve: "approved",
        reject: "rejected",
        schedule: "scheduled",
      };
  
      setNotification({
        type: 'success',
        message: `Request ${actionVerbs[actionType]} successfully!`,
      });

      setShowActionModal(false);
      fetchData();
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      
      let errorMessage = `Failed to ${actionType} request`;
      if (error.response?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to perform this action.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setNotification({ type: 'error', message: errorMessage });
    }
  };

  // Enhanced image modal functions
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

  const generateReport = async (days) => {
    try {
      const response = await adminService.generateReport(days);
      // Create a blob from the response and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin_report_${days}_days.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setNotification({
        type: 'success',
        message: `Report for ${days} days generated successfully!`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      setNotification({
        type: 'error',
        message: 'Failed to generate report. Please try again.',
      });
    }
  };

  const closeActionModal = () => {
    setShowActionModal(false);
    setSelectedRequest(null);
    setActionData({ reason: '', pickupDate: '', pickupTime: '', pickupPersonId: null });
  };

  const getStatusBadge = (status) => (
    <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
  );

  const getRoleBadge = (role) => {
    if (!role) {
      return <span className="role-badge role-unknown">UNKNOWN</span>;
    }
    return (
      <span className={`role-badge role-${role.toLowerCase()}`}>
        {role.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar title="Admin Dashboard" />
        <PageLoader text="Loading data..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar title="Admin Dashboard" />
      <div className="dashboard-container">
        {notification.message && (
          <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: '', message: '' })} 
          />
        )}

        <div className="stats-container">
          {activeTab === 'requests' ? (
            <>
              <div className="stats-grid-top">
                <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
                <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
                <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
                <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
              </div>
              <div className="stats-grid-bottom">
                <StatCard title="Completed" count={requestStats.completed} color="gray" icon="completed" />
                <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
                <StatCard title="Total Users" count={userStats.total} color="orange" icon="total" />
              </div>
            </>
          ) : activeTab === 'users' ? (
            <>
              <div className="stats-grid-top">
                <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
                <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
                <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
                <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
              </div>
              <div className="stats-grid-bottom">
                <StatCard title="Completed" count={requestStats.completed} color="gray" icon="completed" />
                <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
                <StatCard title="Total Users" count={userStats.total} color="orange" icon="total" />
              </div>
            </>
          ) : (
            <>
              <div className="stats-grid-top">
                <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
                <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
                <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
                <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
              </div>
              <div className="stats-grid-bottom">
                <StatCard title="Completed" count={requestStats.completed} color="gray" icon="completed" />
                <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
                <StatCard title="Total Users" count={userStats.total} color="orange" icon="total" />
              </div>
            </>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Request Management
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Reports & Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'requests' && (
          <>
            {/* Search and Filter Section */}
            <div className="search-filter-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by user name, device type, brand, model, or email..."
                  value={requestSearchTerm}
                  onChange={(e) => setRequestSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn">🔍</button>
              </div>

              <div className="filter-dropdown">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="results-summary">
              Showing {filteredRequests.length} of {requests.length} requests
              {requestSearchTerm && ` for "${requestSearchTerm}"`}
              {statusFilter !== 'ALL' && ` with status "${statusFilter}"`}
            </div>

            {/* Requests Table */}
            {filteredRequests.length === 0 ? (
              <div className="empty-state">
                <p>No requests found matching your criteria.</p>
              </div>
            ) : (
              <div className="requests-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Device</th>
                      <th>Brand</th>
                      <th>Model</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.requestId}>
                        <td>{request.userName || 'Unknown User'}</td>
                        <td>{request.deviceType}</td>
                        <td>{request.brand}</td>
                        <td>{request.model}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>{formatDate(request.createdAt)}</td>
                        <td>
                          <button 
                            onClick={() => handleViewDetails(request)}
                            className="btn btn-info btn-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'users' && (
          <>
            {/* User Search and Filter Section */}
            <div className="search-filter-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn">🔍</button>
              </div>
            </div>

            {/* User Results Summary */}
            <div className="results-summary">
              Showing {filteredUsers.length} of {users.length} users
              {userSearchTerm && ` for "${userSearchTerm}"`}
              {userRoleFilter !== 'ALL' && ` with role "${userRoleFilter}"`}
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <p>No users found matching your criteria.</p>
              </div>
            ) : (
              <div className="requests-table">
                <table>
                  <thead>
                    <tr>
                      <th>Profile</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Requests Submitted</th>
                      <th>Pickups Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const requestStats = getUserRequestStats(user);
                      return (
                        <tr key={user.id || user.email}>
                          <td>
                            <div className="user-profile-cell">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt="Profile"
                                  className="user-profile-pic"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`user-profile-placeholder ${user.profilePicture ? 'hidden' : ''}`}
                              >
                                <span>
                                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="user-name-cell">
                              <strong>{user.name || 'N/A'}</strong>
                            </div>
                          </td>
                          <td>
                            <span title={`User ID: ${user.id || 'N/A'}`}>
                              {user.email || 'N/A'}
                            </span>
                          </td>
                          <td>{user.phone || 'N/A'}</td>
                          <td>
                            <span 
                              className={`stats-badge stats-submitted ${requestStats.totalRequests > 0 ? '' : 'zero-stats'}`}
                              title={`Total requests submitted by this user`}
                            >
                              {requestStats.totalRequests}
                            </span>
                          </td>
                          <td>
                            <span 
                              className={`stats-badge stats-completed ${requestStats.completedRequests > 0 ? '' : 'zero-stats'}`}
                              title={`Requests completed for this user`}
                            >
                              {requestStats.completedRequests}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}


        {/* Analytics Controls */}
        

{activeTab === 'analytics' && (
  <>
    <div className="analytics-controls">
      <div className="period-selector">
        <button 
          className={`period-btn ${analyticsPeriod === 'weekly' ? 'active' : ''}`}
          onClick={() => setAnalyticsPeriod('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`period-btn ${analyticsPeriod === 'monthly' ? 'active' : ''}`}
          onClick={() => setAnalyticsPeriod('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`period-btn ${analyticsPeriod === 'yearly' ? 'active' : ''}`}
          onClick={() => setAnalyticsPeriod('yearly')}
        >
          Yearly
        </button>
      </div>
      <button 
        onClick={() => setShowReportModal(true)}
        className="generate-report-btn"
      >
        📊 Generate Report
      </button>
    </div>

    <div className="analytics-grid">
      <div className="analytics-row">
        <StatusDistributionChart data={analyticsData.statusDistribution} />
        <TimeSeriesChart 
          data={
            analyticsPeriod === 'weekly' 
              ? analyticsData.weeklyData 
              : analyticsPeriod === 'monthly' 
                ? analyticsData.monthlyData 
                : analyticsData.yearlyData
          }
          period={analyticsPeriod.charAt(0).toUpperCase() + analyticsPeriod.slice(1)}
        />
      </div>
      <div className="analytics-row">
        <DeviceTypeChart data={analyticsData.deviceTypes} />
        <SummaryMetrics requestStats={requestStats} userStats={userStats} />
      </div>
    </div>
  </>
)}
        {/*{activeTab === 'analytics' && (
          <>
            <div className="analytics-controls">
              <div className="period-selector">
                <button 
                  className={`period-btn ${analyticsPeriod === 'weekly' ? 'active' : ''}`}
                  onClick={() => setAnalyticsPeriod('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={`period-btn ${analyticsPeriod === 'monthly' ? 'active' : ''}`}
                  onClick={() => setAnalyticsPeriod('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`period-btn ${analyticsPeriod === 'yearly' ? 'active' : ''}`}
                  onClick={() => setAnalyticsPeriod('yearly')}
                >
                  Yearly
                </button>
              </div>
              <button 
                onClick={() => setShowReportModal(true)}
                className="generate-report-btn"
              >
                📊 Generate Report
              </button>
            </div>

            <div className="analytics-grid">
              <div className="analytics-row">
                <StatusDistributionChart data={analyticsData.statusDistribution} />
                <TimeSeriesChart 
                  data={
                    analyticsPeriod === 'weekly' 
                      ? analyticsData.weeklyData 
                      : analyticsPeriod === 'monthly' 
                        ? analyticsData.monthlyData 
                        : analyticsData.yearlyData
                  }
                  period={analyticsPeriod.charAt(0).toUpperCase() + analyticsPeriod.slice(1)}
                />
              </div>
              <div className="analytics-row">
                <DeviceTypeChart data={analyticsData.deviceTypes} />
                <SummaryMetrics requestStats={requestStats} />
              </div>
            </div>
          </>
        )}*/}

      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <DetailModal 
          request={selectedRequest}
          closeModal={() => setShowDetailModal(false)}
          onAction={handleAction}
          onImageClick={openImageModal}
        />
      )}

      {/* Action Modal */}
      {showActionModal && selectedRequest && (
        <ActionModal
          request={selectedRequest}
          actionType={actionType}
          actionData={actionData}
          setActionData={setActionData}
          closeModal={closeActionModal}
          executeAction={executeAction}
          pickupPersons={pickupPersons}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          closeModal={() => setShowReportModal(false)}
          generateReport={generateReport}
        />
      )}

      {/* Enhanced Image Modal */}
      {showEnhancedModal && selectedImages.length > 0 && (
        <EnhancedImageModal
          images={selectedImages}
          initialIndex={initialImageIndex}
          closeModal={closeImageModal}
        />
      )}

    </div>
  );
};

export default AdminDashboard;

//final
// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import StatCard from '../components/StatCard';
// import EnhancedImageModal from '../components/EnhancedImageModal';
// import { PageLoader } from '../components/Loader';
// import { adminService } from "../services/adminService";
// import './AdminDashboard.css';

// // DetailModal Component with image click support
// const DetailModal = ({ request, closeModal, onAction, onImageClick }) => (
//   <div className="modal-overlay" onClick={closeModal}>
//     <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
//       <div className="modal-header">
//         <h3>Request Details</h3>
//         <button onClick={closeModal} className="modal-close">×</button>
//       </div>
//       <div className="modal-body">
//         {/* Device Info */}
//         <div className="detail-section">
//           <h4>Device Information</h4>
//           <div className="detail-grid">
//             <div><strong>Device Type:</strong> {request.deviceType}</div>
//             <div><strong>Brand:</strong> {request.brand}</div>
//             <div><strong>Model:</strong> {request.model}</div>
//             <div><strong>Condition:</strong> {request.condition}</div>
//             <div><strong>Quantity:</strong> {request.quantity}</div>
//             <div>
//               <strong>Status:</strong>{" "}
//               <span className={`status-badge status-${request.status.toLowerCase()}`}>
//                 {request.status}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* User Info */}
//         <div className="detail-section">
//           <h4>User Information</h4>
//           <div className="detail-grid">
//             <div><strong>Name:</strong> {request.userName || "Unknown User"}</div>
//             <div><strong>Email:</strong> {request.userEmail || "N/A"}</div>
//           </div>
//         </div>

//         {/* Pickup Info */}
//         <div className="detail-section">
//           <h4>Pickup Details</h4>
//           <div className="detail-grid">
//             <div><strong>Address:</strong> {request.pickupAddress}</div>
//             <div><strong>Preferred Time:</strong> {request.pickupTimeSlot || "N/A"}</div>
//             {request.pickupDateTime && (
//               <div><strong>Scheduled:</strong> {new Date(request.pickupDateTime).toLocaleString()}</div>
//             )}
//             {request.pickupPersonnel && (
//               <div><strong>Personnel:</strong> {request.pickupPersonnel}</div>
//             )}
//           </div>
//         </div>

//         {/* Remarks */}
//         {request.remarks && (
//           <div className="detail-section">
//             <h4>Remarks</h4>
//             <p>{request.remarks}</p>
//           </div>
//         )}

//         {/* Rejection Reason */}
//         {request.rejectionReason && (
//           <div className="detail-section">
//             <h4>Rejection Reason</h4>
//             <p>{request.rejectionReason}</p>
//           </div>
//         )}

//         {/* Images with enhanced click support */}
//         {request.imagePaths && request.imagePaths.length > 0 && (
//           <div className="detail-section">
//             <h4>Images ({request.imagePaths.length})</h4>
//             <div className="detail-images">
//               {request.imagePaths.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={`http://localhost:8080/files/${img}`}
//                   alt={`Device ${idx + 1}`}
//                   style={{ 
//                     width: "120px", 
//                     height: "120px",
//                     objectFit: "cover",
//                     marginRight: "10px",
//                     cursor: "pointer",
//                     borderRadius: "6px",
//                     border: "2px solid #dee2e6",
//                     transition: "all 0.3s ease"
//                   }}
//                   onClick={() => onImageClick && onImageClick(request.imagePaths, idx)}
//                   onMouseEnter={(e) => {
//                     e.target.style.borderColor = "#007bff";
//                     e.target.style.transform = "scale(1.05)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.borderColor = "#dee2e6";
//                     e.target.style.transform = "scale(1)";
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="detail-actions">
//           {request.status === "PENDING" && (
//             <>
//               <button onClick={() => onAction(request, "approve")} className="btn btn-success">
//                 Approve
//               </button>
//               <button onClick={() => onAction(request, "reject")} className="btn btn-danger">
//                 Reject
//               </button>
//             </>
//           )}
//           {request.status === "APPROVED" && (
//             <button onClick={() => onAction(request, "schedule")} className="btn btn-primary">
//               Schedule
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // ActionModal Component with pickup person selection
// const ActionModal = ({ request, actionType, actionData, setActionData, closeModal, executeAction, pickupPersons }) => (
//   <div className="modal-overlay" onClick={closeModal}>
//     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//       <div className="modal-header">
//         <h3>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Request</h3>
//         <button onClick={closeModal} className="modal-close">×</button>
//       </div>
//       <div className="modal-body">
//         <div className="request-summary">
//           <h4>{request.deviceType} - {request.brand} {request.model}</h4>
//           <p>User: {request.userName || 'Unknown User'} ({request.userEmail || 'N/A'})</p>
//         </div>

//         {actionType === 'approve' && <p>Are you sure you want to approve this request?</p>}

//         {actionType === 'reject' && (
//           <div className="form-group">
//             <label>Rejection Reason *</label>
//             <textarea
//               value={actionData.reason}
//               onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
//               className="form-input"
//               rows="4"
//             />
//           </div>
//         )}

//         {actionType === 'schedule' && (
//           <div className="form-grid">
//             <div className="form-group">
//               <label>Pickup Date *</label>
//               <input
//                 type="date"
//                 value={actionData.pickupDate}
//                 onChange={(e) => setActionData({ ...actionData, pickupDate: e.target.value })}
//                 min={new Date().toISOString().split('T')[0]}
//                 className="form-input"
//               />
//             </div>
//             <div className="form-group">
//               <label>Pickup Time *</label>
//               <input
//                 type="time"
//                 value={actionData.pickupTime}
//                 onChange={(e) => setActionData({ ...actionData, pickupTime: e.target.value })}
//                 className="form-input"
//               />
//             </div>
//             <div className="form-group" style={{ gridColumn: '1 / -1' }}>
//               <label>Assign Pickup Person</label>
//               <select
//                 value={actionData.pickupPersonId || ''}
//                 onChange={(e) => setActionData({ ...actionData, pickupPersonId: e.target.value || null })}
//                 className="form-input"
//               >
//                 <option value="">Select pickup person (optional)</option>
//                 {pickupPersons.map(person => (
//                   <option key={person.id} value={person.id}>
//                     {person.name} - {person.email}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}

//         <div className="modal-actions">
//           <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
//           <button onClick={executeAction} className={`btn ${actionType === 'reject' ? 'btn-danger' : 'btn-primary'}`}>
//             {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Report Generation Modal
// const ReportModal = ({ closeModal, generateReport }) => {
//   const [reportDays, setReportDays] = useState('30');
//   const [customDays, setCustomDays] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleGenerate = async () => {
//     const days = reportDays === 'custom' ? customDays : reportDays;
//     if (!days || days <= 0) {
//       alert('Please enter a valid number of days');
//       return;
//     }
//     setLoading(true);
//     try {
//       await generateReport(parseInt(days));
//       closeModal();
//     } catch (error) {
//       console.error('Error generating report:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={closeModal}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>Generate Admin Report</h3>
//           <button onClick={closeModal} className="modal-close">×</button>
//         </div>
//         <div className="modal-body">
//           <div className="form-group">
//             <label>Report Duration</label>
//             <select
//               value={reportDays}
//               onChange={(e) => setReportDays(e.target.value)}
//               className="form-input"
//             >
//               <option value="10">Last 10 days</option>
//               <option value="30">Last 30 days</option>
//               <option value="90">Last 90 days</option>
//               <option value="custom">Custom days</option>
//             </select>
//           </div>

//           {reportDays === 'custom' && (
//             <div className="form-group">
//               <label>Number of Days</label>
//               <input
//                 type="number"
//                 value={customDays}
//                 onChange={(e) => setCustomDays(e.target.value)}
//                 min="1"
//                 max="365"
//                 className="form-input"
//                 placeholder="Enter number of days"
//               />
//             </div>
//           )}

//           <div className="modal-actions">
//             <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
//             <button 
//               onClick={handleGenerate} 
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading ? 'Generating...' : 'Generate Report'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('requests');
//   const [requests, setRequests] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [pickupPersons, setPickupPersons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState({ type: '', message: '' });
  
//   // Enhanced image modal states
//   const [showEnhancedModal, setShowEnhancedModal] = useState(false);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [initialImageIndex, setInitialImageIndex] = useState(0);
  
//   // Modal states
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showActionModal, setShowActionModal] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [actionType, setActionType] = useState('');
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [actionData, setActionData] = useState({
//     reason: '',
//     pickupDate: '',
//     pickupTime: '',
//     pickupPersonId: null
//   });
  
//   // Search and Filter states
//   const [requestSearchTerm, setRequestSearchTerm] = useState('');
//   const [userSearchTerm, setUserSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('ALL');
//   const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  
//   const [requestStats, setRequestStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     scheduled: 0,
//     completed: 0
//   });

//   const [userStats, setUserStats] = useState({
//     total: 0,
//     users: 0,
//     admins: 0,
//     pickupPersons: 0
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     calculateStats();
//     filterRequests();
//   }, [requests, requestSearchTerm, statusFilter]);

//   useEffect(() => {
//     calculateUserStats();
//     filterUsers();
//   }, [users, userSearchTerm, userRoleFilter]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [requestsResponse, usersResponse, pickupPersonsResponse] = await Promise.all([
//         adminService.getAllRequests(),
//         adminService.getAllUsers(),
//         adminService.getPickupPersons().catch(() => ({ data: [] }))
//       ]);
      
//       const requestsData = requestsResponse.data || [];
//       const usersData = usersResponse.data || [];
//       const pickupPersonsData = pickupPersonsResponse.data || [];
      
//       // Create a user lookup map for enhancing requests
//       const userMap = {};
//       usersData.forEach(user => {
//         if (user.id) {
//           userMap[user.id] = user;
//         }
//       });
      
//       // Enhance requests with complete user information
//       const enhancedRequests = requestsData.map(request => {
//         const userId = request.user?.id || request.userId;
//         const userFromMap = userMap[userId];
        
//         return {
//           ...request,
//           user: userFromMap || request.user || { name: 'Unknown User', email: 'N/A' },
//           // Normalize user fields for easier access
//           userName: userFromMap?.name || request.userName || request.user?.name || 'Unknown User',
//           userEmail: userFromMap?.email || request.userEmail || request.user?.email || 'N/A',
//           userId: userId || null
//         };
//       });
      
//       setRequests(enhancedRequests);
//       setUsers(usersData);
//       setPickupPersons(pickupPersonsData);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to load data';
//       setNotification({ type: 'error', message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = () => {
//     const stats = {
//       total: requests.length,
//       pending: requests.filter(r => r.status === 'PENDING').length,
//       approved: requests.filter(r => r.status === 'APPROVED').length,
//       rejected: requests.filter(r => r.status === 'REJECTED').length,
//       scheduled: requests.filter(r => r.status === 'SCHEDULED').length,
//       completed: requests.filter(r => r.status === 'COMPLETED').length
//     };
//     setRequestStats(stats);
//   };

//   const calculateUserStats = () => {
//     const stats = {
//       total: users.length,
//       users: users.filter(u => u.role && u.role.toLowerCase() === 'user').length,
//       admins: users.filter(u => u.role && u.role.toLowerCase() === 'admin').length,
//       pickupPersons: users.filter(u => u.role && u.role.toLowerCase() === 'pickup').length
//     };
//     setUserStats(stats);
//   };

//   const getUserRequestStats = (user) => {
//     // Match requests by user ID (primary) or email (fallback)
//     const userRequests = requests.filter(request => {
//       // Try to get user ID from different possible fields
//       const requestUserId = request.user?.id || request.userId;
//       const requestUserEmail = request.user?.email || request.userEmail;
      
//       // Match by ID first (most reliable)
//       if (requestUserId && user.id && requestUserId === user.id) {
//         return true;
//       }
      
//       // Fallback to email matching
//       if (requestUserEmail && user.email && requestUserEmail === user.email) {
//         return true;
//       }
      
//       return false;
//     });
    
//     // Count completed requests
//     const completedRequests = userRequests.filter(request => 
//       request.status && request.status.toLowerCase() === 'completed'
//     );
    
//     return {
//       totalRequests: userRequests.length,
//       completedRequests: completedRequests.length
//     };
//   };

//   const filterRequests = () => {
//     let filtered = requests;

//     // Filter by status
//     if (statusFilter !== 'ALL') {
//       filtered = filtered.filter(request => request.status === statusFilter);
//     }

//     // Filter by search term
//     if (requestSearchTerm) {
//       const term = requestSearchTerm.toLowerCase();
//       filtered = filtered.filter(request => 
//         (request.userName || '').toLowerCase().includes(term) ||
//         (request.deviceType || '').toLowerCase().includes(term) ||
//         (request.brand || '').toLowerCase().includes(term) ||
//         (request.model || '').toLowerCase().includes(term) ||
//         (request.userEmail || '').toLowerCase().includes(term)
//       );
//     }

//     setFilteredRequests(filtered);
//   };

//   const filterUsers = () => {
//     let filtered = users;

//     // Filter by role
//     if (userRoleFilter !== 'ALL') {
//       filtered = filtered.filter(user => user.role === userRoleFilter);
//     }

//     // Filter by search term
//     if (userSearchTerm) {
//       const term = userSearchTerm.toLowerCase();
//       filtered = filtered.filter(user => 
//         (user.name || '').toLowerCase().includes(term) ||
//         (user.email || '').toLowerCase().includes(term) ||
//         (user.username || '').toLowerCase().includes(term)
//       );
//     }

//     setFilteredUsers(filtered);
//   };

//   const handleViewDetails = (request) => {
//     setSelectedRequest(request);
//     setShowDetailModal(true);
//   };

//   const handleAction = (request, action) => {
//     const requestId = request.id || request.requestId;

//     if (!requestId) {
//       console.error('Request ID is missing', request);
//       setNotification({ type: 'error', message: 'Invalid request selected' });
//       return;
//     }

//     const normalizedRequest = { ...request, id: requestId };
//     setSelectedRequest(normalizedRequest);
//     setActionType(action);
//     setActionData({ reason: '', pickupDate: '', pickupTime: '', pickupPersonId: null });
//     setShowDetailModal(false);
//     setShowActionModal(true);
//   };

//   const executeAction = async () => {
//     if (!selectedRequest?.id) return;

//     const requestId = selectedRequest.id;

//     try {
//       let response;
//       switch (actionType) {
//         case 'approve':
//           response = await adminService.approveRequest(requestId);
//           break;
//         case 'reject':
//           if (!actionData.reason.trim()) {
//             setNotification({ type: 'error', message: 'Rejection reason is required' });
//             return;
//           }
//           response = await adminService.rejectRequest(requestId, actionData.reason);
//           break;
//         case 'schedule':
//           if (!actionData.pickupDate || !actionData.pickupTime) {
//             setNotification({ type: 'error', message: 'Pickup date and time are required' });
//             return;
//           }
          
//           const selectedDate = new Date(actionData.pickupDate);
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
          
//           if (selectedDate < today) {
//             setNotification({ type: 'error', message: 'Pickup date cannot be in the past' });
//             return;
//           }
          
//           const pickupDateTime = `${actionData.pickupDate}T${actionData.pickupTime}`;
//           response = await adminService.scheduleRequest(
//             requestId,
//             pickupDateTime,
//             actionData.pickupPersonId
//           );
//           break;
//         default:
//           return;
//       }

//       const actionVerbs = {
//         approve: "approved",
//         reject: "rejected",
//         schedule: "scheduled",
//       };
  
//       setNotification({
//         type: 'success',
//         message: `Request ${actionVerbs[actionType]} successfully!`,
//       });

//       setShowActionModal(false);
//       fetchData();
//     } catch (error) {
//       console.error(`Error ${actionType}ing request:`, error);
      
//       let errorMessage = `Failed to ${actionType} request`;
//       if (error.response?.status === 403) {
//         errorMessage = 'Access denied. You may not have permission to perform this action.';
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setNotification({ type: 'error', message: errorMessage });
//     }
//   };

//   // Enhanced image modal functions
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

//   const generateReport = async (days) => {
//     try {
//       const response = await adminService.generateReport(days);
//       // Create a blob from the response and download
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `admin_report_${days}_days.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       setNotification({
//         type: 'success',
//         message: `Report for ${days} days generated successfully!`,
//       });
//     } catch (error) {
//       console.error('Error generating report:', error);
//       setNotification({
//         type: 'error',
//         message: 'Failed to generate report. Please try again.',
//       });
//     }
//   };

//   const closeActionModal = () => {
//     setShowActionModal(false);
//     setSelectedRequest(null);
//     setActionData({ reason: '', pickupDate: '', pickupTime: '', pickupPersonId: null });
//   };

//   const getStatusBadge = (status) => (
//     <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
//   );

//   const getRoleBadge = (role) => {
//     if (!role) {
//       return <span className="role-badge role-unknown">UNKNOWN</span>;
//     }
//     return (
//       <span className={`role-badge role-${role.toLowerCase()}`}>
//         {role.toUpperCase()}
//       </span>
//     );
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div>
//         <Navbar title="Admin Dashboard" />
//         <PageLoader text="Loading data..." />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">
//       <Navbar title="Admin Dashboard" />
//       <div className="dashboard-container">
//         {notification.message && (
//           <Notification 
//             type={notification.type} 
//             message={notification.message} 
//             onClose={() => setNotification({ type: '', message: '' })} 
//           />
//         )}

//         {/* Stats Grid */}
//         {/* <div className="stats-grid">
//           {activeTab === 'requests' ? (
//             <>
//               <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
//               <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//               <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//               <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//               <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//               <StatCard title="Completed" count={requestStats.completed} color="gray" icon="completed" />
//             </>
//           ) : ( */}

          
//         <div className="stats-container">
//           {activeTab === 'requests' ? (
//             <>
//               <div className="stats-grid-top">
//                 <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//                 <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//                 <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//                 <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//               </div>
//               <div className="stats-grid-bottom">
//                 <StatCard title="Completed" count={requestStats.completed} color="gray" icon="completed" />
//                 <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
//               </div>
//             </>
//           ) : (
//             <>
//               {/* <StatCard title="Total Users" count={userStats.total} color="purple" icon="total" />
//               <StatCard title="Regular Users" count={userStats.users} color="blue" icon="user" />
//               <StatCard title="Admins" count={userStats.admins} color="red" icon="admin" />
//               <StatCard title="Pickup Personnel" count={userStats.pickupPersons} color="green" icon="pickup" /> */}
//               <div className="stats-grid-top">
//                 <StatCard title="Total Users" count={userStats.total} color="purple" icon="total" />
//                 <StatCard title="Regular Users" count={userStats.users} color="blue" icon="user" />
//                 <StatCard title="Admins" count={userStats.admins} color="red" icon="admin" />
//                 <StatCard title="Pickup Personnel" count={userStats.pickupPersons} color="green" icon="pickup" />
//               </div>
//             </>
//           )}
//         </div>

//         {/* Tab Navigation */}
//         <div className="tab-navigation">
//           <button 
//             className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
//             onClick={() => setActiveTab('requests')}
//           >
//             Request Management
//           </button>
//           <button 
//             className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
//             onClick={() => setActiveTab('users')}
//           >
//             User Management
//           </button>
//         </div>

//         {/* Tab Content */}
//         {activeTab === 'requests' && (
//           <>
//             {/* Search and Filter Section */}
//             <div className="search-filter-section">
//               <div className="search-bar">
//                 <input
//                   type="text"
//                   placeholder="Search by user name, device type, brand, model, or email..."
//                   value={requestSearchTerm}
//                   onChange={(e) => setRequestSearchTerm(e.target.value)}
//                   className="search-input"
//                 />
//                 <button className="search-btn">🔍</button>
//               </div>

//               <div className="filter-dropdown">
//                 <select 
//                   value={statusFilter} 
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="filter-select"
//                 >
//                   <option value="ALL">All Status</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="APPROVED">Approved</option>
//                   <option value="REJECTED">Rejected</option>
//                   <option value="SCHEDULED">Scheduled</option>
//                   <option value="COMPLETED">Completed</option>
//                 </select>
//               </div>

//               <button 
//                 onClick={() => setShowReportModal(true)}
//                 className="btn btn-primary"
//               >
//                 Generate Report
//               </button>
//             </div>

//             {/* Results Summary */}
//             <div className="results-summary">
//               Showing {filteredRequests.length} of {requests.length} requests
//               {requestSearchTerm && ` for "${requestSearchTerm}"`}
//               {statusFilter !== 'ALL' && ` with status "${statusFilter}"`}
//             </div>

//             {/* Requests Table */}
//             {filteredRequests.length === 0 ? (
//               <div className="empty-state">
//                 <p>No requests found matching your criteria.</p>
//               </div>
//             ) : (
//               <div className="requests-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>User</th>
//                       <th>Device</th>
//                       <th>Brand</th>
//                       <th>Model</th>
//                       <th>Status</th>
//                       <th>Date</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredRequests.map((request) => (
//                       <tr key={request.requestId}>
//                         <td>{request.userName || 'Unknown User'}</td>
//                         <td>{request.deviceType}</td>
//                         <td>{request.brand}</td>
//                         <td>{request.model}</td>
//                         <td>{getStatusBadge(request.status)}</td>
//                         <td>{formatDate(request.createdAt)}</td>
//                         <td>
//                           <button 
//                             onClick={() => handleViewDetails(request)}
//                             className="btn btn-info btn-sm"
//                           >
//                             View Details
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}

//         {activeTab === 'users' && (
//           <>
//             {/* User Search and Filter Section */}
//             <div className="search-filter-section">
//               <div className="search-bar">
//                 <input
//                   type="text"
//                   placeholder="Search by name or email..."
//                   value={userSearchTerm}
//                   onChange={(e) => setUserSearchTerm(e.target.value)}
//                   className="search-input"
//                 />
//                 <button className="search-btn">🔍</button>
//               </div>

//               <div className="filter-dropdown">
//                 <select 
//                   value={userRoleFilter} 
//                   onChange={(e) => setUserRoleFilter(e.target.value)}
//                   className="filter-select"
//                 >
//                   <option value="ALL">All Roles</option>
//                   <option value="user">Users</option>
//                   <option value="admin">Admins</option>
//                   <option value="pickup">Pickup Personnel</option>
//                 </select>
//               </div>
//             </div>

//             {/* User Results Summary */}
//             <div className="results-summary">
//               Showing {filteredUsers.length} of {users.length} users
//               {userSearchTerm && ` for "${userSearchTerm}"`}
//               {userRoleFilter !== 'ALL' && ` with role "${userRoleFilter}"`}
//             </div>

//             {/* Users Table */}
//             {filteredUsers.length === 0 ? (
//               <div className="empty-state">
//                 <p>No users found matching your criteria.</p>
//               </div>
//             ) : (
//               <div className="requests-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Profile</th>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Phone</th>
//                       <th>Requests Submitted</th>
//                       <th>Pickups Completed</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map((user) => {
//                       const requestStats = getUserRequestStats(user);
//                       return (
//                         <tr key={user.id || user.email}>
//                           <td>
//                             <div className="user-profile-cell">
//                               {user.profilePicture ? (
//                                 <img
//                                   src={user.profilePicture}
//                                   alt="Profile"
//                                   className="user-profile-pic"
//                                   onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.nextSibling.style.display = 'flex';
//                                   }}
//                                 />
//                               ) : null}
//                               <div 
//                                 className={`user-profile-placeholder ${user.profilePicture ? 'hidden' : ''}`}
//                               >
//                                 <span>
//                                   {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
//                                 </span>
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <div className="user-name-cell">
//                               <strong>{user.name || 'N/A'}</strong>
//                               <div className="user-role-badge">
//                                 {getRoleBadge(user.role)}
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <span title={`User ID: ${user.id || 'N/A'}`}>
//                               {user.email || 'N/A'}
//                             </span>
//                           </td>
//                           <td>{user.phone || 'N/A'}</td>
//                           <td>
//                             <span 
//                               className={`stats-badge stats-submitted ${requestStats.totalRequests > 0 ? '' : 'zero-stats'}`}
//                               title={`Total requests submitted by this user`}
//                             >
//                               {requestStats.totalRequests}
//                             </span>
//                           </td>
//                           <td>
//                             <span 
//                               className={`stats-badge stats-completed ${requestStats.completedRequests > 0 ? '' : 'zero-stats'}`}
//                               title={`Requests completed for this user`}
//                             >
//                               {requestStats.completedRequests}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Detail Modal */}
//       {showDetailModal && selectedRequest && (
//         <DetailModal 
//           request={selectedRequest}
//           closeModal={() => setShowDetailModal(false)}
//           onAction={handleAction}
//           onImageClick={openImageModal}
//         />
//       )}

//       {/* Action Modal */}
//       {showActionModal && selectedRequest && (
//         <ActionModal
//           request={selectedRequest}
//           actionType={actionType}
//           actionData={actionData}
//           setActionData={setActionData}
//           closeModal={closeActionModal}
//           executeAction={executeAction}
//           pickupPersons={pickupPersons}
//         />
//       )}

//       {/* Report Modal */}
//       {showReportModal && (
//         <ReportModal
//           closeModal={() => setShowReportModal(false)}
//           generateReport={generateReport}
//         />
//       )}

//       {/* Enhanced Image Modal */}
//       {showEnhancedModal && selectedImages.length > 0 && (
//         <EnhancedImageModal
//           images={selectedImages}
//           initialIndex={initialImageIndex}
//           closeModal={closeImageModal}
//         />
//       )}

//     </div>
//   );
// };

// export default AdminDashboard;

// // Updated AdminDashboard: split into two tabs: Request Management and User Management (includes pickup-person management)
// import React, { useEffect, useState } from "react";
// import { requestService } from "../services/requestService";
// import { adminService } from "../services/adminService";
// import "./AdminDashboard.css";

// const AdminDashboard = () => {
//   const [tab, setTab] = useState("requests"); // requests | users | pickups
//   const [requests, setRequests] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [pickupPersons, setPickupPersons] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const loadRequests = async () => {
//     setLoading(true);
//     try {
//       // reuse existing admin endpoint for requests: /api/admin/requests
//       const res = await fetch("/api/admin/requests", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       const data = await res.json();
//       setRequests(data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUsers = async () => {
//     try {
//       const res = await adminService.getAllUsers();
//       setUsers(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const loadPickupPersons = async () => {
//     try {
//       const res = await adminService.getPickupPersonnel();
//       setPickupPersons(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadRequests();
//     loadUsers();
//     loadPickupPersons();
//   }, []);

//   const onSchedule = async (requestId) => {
//     // show a simple prompt for date/time & selected pickup person id (replace with modal in UI)
//     const pickupDateTime = prompt("Enter pickup datetime (YYYY-MM-DDTHH:mm):");
//     if (!pickupDateTime) return;
//     const pickId = prompt("Enter pickup person ID from list:\n" + pickupPersons.map(p => `${p.id}: ${p.name}`).join("\n"));
//     if (!pickId) return;
//     try {
//       await requestService.scheduleWithPickup(requestId, pickupDateTime, parseInt(pickId, 10));
//       alert("Scheduled successfully");
//       await loadRequests();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to schedule");
//     }
//   };

//   const onAddPickupPerson = async () => {
//     const name = prompt("Name:");
//     if (!name) return;
//     const email = prompt("Email:");
//     if (!email) return;
//     const password = prompt("Password:");
//     if (!password) return;
//     try {
//       await adminService.addPickupPerson({ name, email, password });
//       alert("Pickup person added");
//       await loadPickupPersons();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add pickup person");
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       <h2>Admin Dashboard</h2>
//       <div className="admin-tabs">
//         <button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Request Management</button>
//         <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>User Management</button>
//         <button className={tab === "pickups" ? "active" : ""} onClick={() => setTab("pickups")}>Pickup Persons</button>
//       </div>

//       {tab === "requests" && (
//         <div className="tab-content">
//           <h3>Requests</h3>
//           {loading && <p>Loading...</p>}
//           {requests.map(r => (
//             <div key={r.requestId} className="request-card">
//               <div><strong>ID:</strong> {r.requestId}</div>
//               <div><strong>Device:</strong> {r.deviceType} ({r.brand} {r.model})</div>
//               <div><strong>User:</strong> {r.userName || r.user?.name}</div>
//               <div><strong>Status:</strong> {r.status}</div>
//               <div className="request-actions">
//                 <button onClick={() => onSchedule(r.requestId)}>Schedule</button>
//                 <button onClick={() => requestService.approveRequest(r.requestId)}>Approve</button>
//                 <button onClick={() => {
//                   const reason = prompt("Reason for rejection:");
//                   if (reason) requestService.rejectRequest(r.requestId, reason).then(loadRequests);
//                 }}>Reject</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {tab === "users" && (
//         <div className="tab-content">
//           <h3>Users</h3>
//           {users.map(u => (
//             <div key={u.id} className="user-card">
//               <div>{u.name} - {u.email}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {tab === "pickups" && (
//         <div className="tab-content">
//           <h3>Pickup Persons</h3>
//           <button onClick={onAddPickupPerson}>Add Pickup Person</button>
//           {pickupPersons.map(p => (
//             <div key={p.id} className="pickup-person-card">
//               <div><strong>{p.name}</strong> ({p.email})</div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import Notification from '../components/Notification';
// import StatCard from '../components/StatCard';
// import { PageLoader } from '../components/Loader';
// import { adminService } from "../services/adminService";
// import RequestManagement from '../components/RequestManagement';
// import UserManagement from '../components/UserManagement';
// import './AdminDashboard.css';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('requests');
//   const [requests, setRequests] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [pickupPersons, setPickupPersons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState({ type: '', message: '' });
  
//   const [requestStats, setRequestStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     scheduled: 0,
//     completed: 0
//   });

//   const [userStats, setUserStats] = useState({
//     totalUsers: 0,
//     totalPickupPersons: 0,
//     activeUsers: 0
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchRequests(),
//         fetchUsers(),
//         fetchPickupPersons()
//       ]);
//     } catch (error) {
//       setNotification({ type: 'error', message: 'Failed to load dashboard data' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRequests = async () => {
//     try {
//       const [requestsResponse, usersResponse] = await Promise.all([
//         adminService.getAllRequests(),
//         adminService.getAllUsers()
//       ]);
      
//       const requestsData = requestsResponse.data || [];
//       const usersData = usersResponse.data || [];
      
//       // Create a user lookup map
//       const userMap = {};
//       usersData.forEach(user => {
//         userMap[user.id] = user;
//       });
      
//       // Enhance requests with complete user information
//       const enhancedRequests = requestsData.map(request => ({
//         ...request,
//         user: userMap[request.user?.id] || request.user || { name: 'Unknown User', email: 'N/A' }
//       }));
      
//       setRequests(enhancedRequests);
//       calculateRequestStats(enhancedRequests);
//     } catch (error) {
//       console.error('Failed to load requests:', error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await adminService.getAllUsers();
//       const usersData = response.data || [];
//       setUsers(usersData);
      
//       // Calculate user stats
//       const totalUsers = usersData.filter(user => user.role === 'user').length;
//       const activeUsers = usersData.filter(user => user.role === 'user' && user.active !== false).length;
      
//       setUserStats(prev => ({
//         ...prev,
//         totalUsers,
//         activeUsers
//       }));
//     } catch (error) {
//       console.error('Failed to load users:', error);
//     }
//   };

//   const fetchPickupPersons = async () => {
//     try {
//       const response = await adminService.getPickupPersonnel();
//       const pickupData = response.data || [];
//       setPickupPersons(pickupData);
      
//       setUserStats(prev => ({
//         ...prev,
//         totalPickupPersons: pickupData.length
//       }));
//     } catch (error) {
//       console.error('Failed to load pickup persons:', error);
//     }
//   };

//   const calculateRequestStats = (requestsData) => {
//     const stats = {
//       total: requestsData.length,
//       pending: requestsData.filter(r => r.status === 'PENDING').length,
//       approved: requestsData.filter(r => r.status === 'APPROVED').length,
//       rejected: requestsData.filter(r => r.status === 'REJECTED').length,
//       scheduled: requestsData.filter(r => r.status === 'SCHEDULED').length,
//       completed: requestsData.filter(r => r.status === 'COMPLETED').length
//     };
//     setRequestStats(stats);
//   };

//   const handleNotification = (type, message) => {
//     setNotification({ type, message });
//   };

//   const refreshRequests = () => {
//     fetchRequests();
//   };

//   const refreshUsers = () => {
//     fetchUsers();
//     fetchPickupPersons();
//   };

//   if (loading) {
//     return (
//       <div>
//         <Navbar title="Admin Dashboard" />
//         <PageLoader text="Loading dashboard..." />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">
//       <Navbar title="Admin Dashboard" />
      
//       <div className="dashboard-container">
//         {notification.message && (
//           <Notification 
//             type={notification.type} 
//             message={notification.message} 
//             onClose={() => setNotification({ type: '', message: '' })} 
//           />
//         )}

//         {/* Stats Grid */}
//         <div className="stats-grid">
//           {activeTab === 'requests' ? (
//             <>
//               <StatCard title="Total Requests" count={requestStats.total} color="purple" icon="total" />
//               <StatCard title="Pending" count={requestStats.pending} color="yellow" icon="pending" />
//               <StatCard title="Approved" count={requestStats.approved} color="green" icon="approved" />
//               <StatCard title="Rejected" count={requestStats.rejected} color="red" icon="rejected" />
//               <StatCard title="Scheduled" count={requestStats.scheduled} color="blue" icon="scheduled" />
//               <StatCard title="Completed" count={requestStats.completed} color="green" icon="approved" />
//             </>
//           ) : (
//             <>
//               <StatCard title="Total Users" count={userStats.totalUsers} color="blue" icon="total" />
//               <StatCard title="Active Users" count={userStats.activeUsers} color="green" icon="approved" />
//               <StatCard title="Pickup Persons" count={userStats.totalPickupPersons} color="purple" icon="total" />
//             </>
//           )}
//         </div>

//         {/* Tab Navigation */}
//         <div className="tab-navigation">
//           <button 
//             className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
//             onClick={() => setActiveTab('requests')}
//           >
//             Request Management
//           </button>
//           <button 
//             className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
//             onClick={() => setActiveTab('users')}
//           >
//             User Management
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content">
//           {activeTab === 'requests' ? (
//             <RequestManagement 
//               requests={requests}
//               pickupPersons={pickupPersons}
//               onNotification={handleNotification}
//               onRefresh={refreshRequests}
//             />
//           ) : (
//             <UserManagement
//               users={users}
//               pickupPersons={pickupPersons}
//               onNotification={handleNotification}
//               onRefresh={refreshUsers}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
