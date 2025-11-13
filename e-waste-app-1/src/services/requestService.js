// // requestService.js
// import axios from "axios";

// const API_URL = "http://localhost:8080/api";

// export const requestService = {
//   submitRequest: async (formData) => {
//     const token = localStorage.getItem("token");
//     return axios.post(`${API_URL}/requests/submit`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       },
//     });
//   },

//   getMyRequests: async () => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_URL}/requests/my`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   },
// };
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const requestService = {
  submitRequest: async (formData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/requests/submit`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
  },

  // Updated to use new endpoint
  getMyRequests: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/requests/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};



// // Updated: added scheduleWithPickup method for admin scheduling (send pickupPersonId)
// // Also kept existing submitRequest & getMyRequests
// import axios from "axios";

// const API_URL = "http://localhost:8080/api";

// export const requestService = {
//   submitRequest: async (formData) => {
//     const token = localStorage.getItem("token");
//     return axios.post(`${API_URL}/requests/submit`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       },
//     });
//   },

//   getMyRequests: async () => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_URL}/requests/my`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   },

//   // Admin scheduling: include pickupPersonId
//   scheduleWithPickup: async (requestId, pickupDateTime, pickupPersonId) => {
//     const token = localStorage.getItem("token");
//     return axios.put(`${API_URL}/admin/requests/${requestId}/schedule`, {
//       pickupDateTime,
//       pickupPersonId
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   },

//   approveRequest: async (requestId) => {
//     const token = localStorage.getItem("token");
//     return axios.put(`${API_URL}/admin/requests/${requestId}/approve`, {}, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   },

//   rejectRequest: async (requestId, reason) => {
//     const token = localStorage.getItem("token");
//     return axios.put(`${API_URL}/admin/requests/${requestId}/reject`, { reason }, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   }
// };
