// src/services/notificationService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get unread notifications only
  getUnreadNotifications: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/notifications/unread`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get notification statistics (total count, unread count)
  getNotificationStats: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/notifications/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Mark single notification as read
  markAsRead: async (notificationId) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/notifications/read-all`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};