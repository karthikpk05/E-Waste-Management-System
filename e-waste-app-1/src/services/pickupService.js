// // New pickupService to handle pickup-person flows: assigned/completed lists, complete/verify OTP
// import axios from "axios";
// const API_URL = "http://localhost:8080/api";

// export const pickupService = {
//   getAssignedPickups: async () => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_URL}/pickup/assigned`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   },

//   getCompletedPickups: async () => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_URL}/pickup/completed`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   },

//   // Generate OTP and send to user
//   completePickup: async (requestId) => {
//     const token = localStorage.getItem("token");
//     return axios.put(`${API_URL}/pickup/requests/${requestId}/complete`, {}, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   },

//   // Verify OTP
//   verifyOtp: async (requestId, otp) => {
//     const token = localStorage.getItem("token");
//     return axios.post(`${API_URL}/pickup/requests/${requestId}/verify-otp`, { otp }, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   }
// };

// New service for pickup person functionality - handles assigned pickups, completion, and OTP verification
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const pickupService = {
  // Get assigned pickups for the logged-in pickup person
  getAssignedPickups: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/pickup/assigned`, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    });
  },

  // Get completed pickups for the logged-in pickup person
  getCompletedPickups: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/pickup/completed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Mark pickup as complete - this generates and emails OTP to user
  completePickup: async (requestId) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/pickup/${requestId}/complete`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  },

  // Verify OTP entered by pickup person to finalize completion
  verifyOtp: async (requestId, otp) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/pickup/${requestId}/verify-otp`, 
      { otp }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  },
};
  