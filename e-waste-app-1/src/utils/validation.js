// utils/validation.js

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\d{10}$/;
  return re.test(phone.replace(/[^\d]/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

// Added missing validation function
export const validateUsername = (username) => {
  // Username should be at least 3 characters and contain only alphanumeric characters and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};