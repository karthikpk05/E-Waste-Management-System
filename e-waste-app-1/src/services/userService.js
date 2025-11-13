
// import axios from "axios";

// const API_URL = "http://localhost:8080/api";

// export const userService = {
//     generateReport: async (days) => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_URL}/user/report`, {
//         params: { days },
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: "blob",
//     });
//     },
// };

import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const userService = {
    generateReport: async (days) => {
        const token = localStorage.getItem("token");
        return axios.get(`${API_URL}/user/report`, {
            params: { days },
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
        });
    },
    
    // Certificate endpoints
    getCertificates: async () => {
        const token = localStorage.getItem("token");
        return axios.get(`${API_URL}/user/certificates`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
    
    downloadCertificate: async (certificateId) => {
        const token = localStorage.getItem("token");
        return axios.get(`${API_URL}/user/certificates/${certificateId}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
        });
    },
};

// // 1. Updated userService.js - Add certificate endpoints
// import axios from "axios";

// const API_URL = "http://localhost:8080/api";

// export const userService = {
//     generateReport: async (days) => {
//         const token = localStorage.getItem("token");
//         return axios.get(`${API_URL}/user/report`, {
//             params: { days },
//             headers: { Authorization: `Bearer ${token}` },
//             responseType: "blob",
//         });
//     },
    
//     // New Certificate endpoints
//     getCertificates: async () => {
//         const token = localStorage.getItem("token");
//         return axios.get(`${API_URL}/user/certificates`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//     },
    
//     downloadCertificate: async (certificateId) => {
//         const token = localStorage.getItem("token");
//         return axios.get(`${API_URL}/user/certificates/${certificateId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//             responseType: "blob",
//         });
//     },
// };


