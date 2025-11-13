import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const adminService = {
  getAllUsers: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getAllRequests: async (status = null) => {
    const token = localStorage.getItem("token");
    const params = status ? { status } : {};
    return axios.get(`${API_URL}/admin/requests`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get specific request by ID
  getRequestById: async (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/admin/requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  approveRequest: async (requestId) => {
    const token = localStorage.getItem("token");
    if (!requestId) throw new Error("Request ID is missing");
    return axios.put(`${API_URL}/admin/requests/${requestId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  rejectRequest: async (requestId, reason) => {
    const token = localStorage.getItem("token");
    if (!requestId) throw new Error("Request ID is missing");
    return axios.put(`${API_URL}/admin/requests/${requestId}/reject`, { reason }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  },

  scheduleRequest: async (requestId, pickupDateTime, pickupPersonId) => {
    const token = localStorage.getItem("token");
    console.log('Schedule - Token exists:', !!token);
    
    if (!requestId) throw new Error("Request ID is missing");
    
    console.log('Scheduling request:', {
      requestId,
      pickupDateTime,
      pickupPersonId,
      url: `${API_URL}/admin/requests/${requestId}/schedule`
    });
    
    const payload = {
      pickupDateTime, // Expected format: "2025-09-20T10:00"
      pickupPersonId: pickupPersonId ? pickupPersonId.toString() : null
    };
    
    console.log('Final payload:', payload);
    
    try {
      return axios.put(`${API_URL}/admin/requests/${requestId}/schedule`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Schedule request failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url,
        method: error.config?.method
      });
      throw error;
    }
  },

  // Generate admin report
  generateReport: async (days = 30) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/admin/report`, {
      params: { days },
      headers: { 
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Important for handling PDF response
    });
  },

  getPickupPersons: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/admin/pickup-person`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  addPickupPerson: async (personData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/admin/pickup-person`, personData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  },

  // Legacy method names for backward compatibility
  addPickupPersonnel: async (personData) => {
    return adminService.addPickupPerson(personData);
  },

  getPickupPersonnel: async () => {
    return adminService.getPickupPersons();
  },
};

// // services/adminService.js
// import axios from "axios";

// const API_URL = "http://localhost:8080/api";

// export const adminService = {
//   getAllUsers: async () => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_URL}/admin/users`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   },

//   getAllRequests: async (status = null) => {
//     const token = localStorage.getItem("token");
//     const params = status ? { status } : {};
//     return axios.get(`${API_URL}/admin/requests`, {
//       params,
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   },

//   // Get specific request by ID
//   getRequestById: async (id) => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_URL}/admin/requests/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   },

//   approveRequest: async (requestId) => {
//     const token = localStorage.getItem("token");
//     if (!requestId) throw new Error("Request ID is missing");
//     return axios.put(`${API_URL}/admin/requests/${requestId}/approve`, {}, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   },

//   rejectRequest: async (requestId, reason) => {
//     const token = localStorage.getItem("token");
//     if (!requestId) throw new Error("Request ID is missing");
//     return axios.put(`${API_URL}/admin/requests/${requestId}/reject`, { reason }, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//   },

//   scheduleRequest: async (requestId, pickupDateTime, pickupPersonId) => {
//     const token = localStorage.getItem("token");
//     console.log('Schedule - Token exists:', !!token);
    
//     if (!requestId) throw new Error("Request ID is missing");
    
//     console.log('Scheduling request:', {
//       requestId,
//       pickupDateTime,
//       pickupPersonId,
//       url: `${API_URL}/admin/requests/${requestId}/schedule`
//     });
    
//     const payload = {
//       pickupDateTime, // Expected format: "2025-09-20T10:00"
//       pickupPersonId: pickupPersonId ? pickupPersonId.toString() : null
//     };
    
//     console.log('Final payload:', payload);
    
//     try {
//       return axios.put(`${API_URL}/admin/requests/${requestId}/schedule`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//     } catch (error) {
//       console.error('Schedule request failed:', {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         headers: error.response?.headers,
//         url: error.config?.url,
//         method: error.config?.method
//       });
//       throw error;
//     }
//   },

//   getPickupPersons: async () => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_URL}/admin/pickup-person`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   },

//   addPickupPerson: async (personData) => {
//     const token = localStorage.getItem("token");
//     return axios.post(`${API_URL}/admin/pickup-person`, personData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//   },

//   // Legacy method names for backward compatibility
//   addPickupPersonnel: async (personData) => {
//     return adminService.addPickupPerson(personData);
//   },

//   getPickupPersonnel: async () => {
//     return adminService.getPickupPersons();
//   },
// };