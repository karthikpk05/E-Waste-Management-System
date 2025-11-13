// utils/chatbotService.js
// Enhanced chatbot service utilities
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Basic chat service (compatible with existing code)
export async function sendMessageToChatbot(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': getAuthToken() // Include auth token if available
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
}

// Enhanced chat service with actions and quick replies
export async function sendEnhancedMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/enhanced`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending enhanced message:', error);
    return {
      response: "I'm sorry, I'm having trouble connecting. Please try again.",
      intent: "error",
      quickReplies: [
        { text: "Try Again", action: "retry" },
        { text: "Contact Support", action: "support" }
      ]
    };
  }
}

// Contextual chat service for logged-in users
export async function sendContextualMessage(message, context = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/contextual`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify({ message, context })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending contextual message:', error);
    throw error;
  }
}

// Intent detection service
export async function detectMessageIntent(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error detecting intent:', error);
    return { intent: 'general', confidence: 0.5 };
  }
}

// Get conversation starters
export async function getConversationStarters() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/starters`);
    const data = await response.json();
    return data.starters;
  } catch (error) {
    console.error('Error fetching conversation starters:', error);
    return [
      { text: "How do I request a pickup?", category: "pickup" },
      { text: "Track my request", category: "tracking" },
      { text: "Contact support", category: "support" }
    ];
  }
}

// Submit feedback for chatbot responses
export async function submitChatbotFeedback(messageId, rating, comment = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, rating, comment })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}

// Check chatbot service health
export async function checkChatbotHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/health`);
    return await response.json();
  } catch (error) {
    console.error('Error checking chatbot health:', error);
    return { status: 'unavailable' };
  }
}

// Utility functions
function getAuthToken() {
  // Get JWT token from localStorage, sessionStorage, or context
  return localStorage.getItem('authToken') ? 
    `Bearer ${localStorage.getItem('authToken')}` : '';
}

export function getUserContext() {
  // Extract user context from stored auth info
  const token = localStorage.getItem('authToken');
  if (!token) {
    return { is_logged_in: false };
  }
  
  try {
    // In a real app, decode JWT token to get user info
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return {
      is_logged_in: true,
      user_role: userInfo.role || 'user',
      user_id: userInfo.id || null,
      user_name: userInfo.name || null
    };
  } catch (error) {
    return { is_logged_in: false };
  }
}

// Action handlers for quick replies
export const handleChatbotAction = (action, navigate = null) => {
  const [actionType, value] = action.split(':');
  
  switch (actionType) {
    case 'redirect':
      if (navigate) {
        navigate(value);
      } else {
        window.location.href = value;
      }
      break;
      
    case 'tel':
      window.open(`tel:${value}`);
      break;
      
    case 'mailto':
      window.open(`mailto:${value}`);
      break;
      
    case 'external':
      window.open(value, '_blank');
      break;
      
    case 'scroll':
      const element = document.getElementById(value);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      break;
      
    default:
      console.warn(`Unknown action type: ${actionType}`);
  }
};

// Message formatting utilities
export const formatChatMessage = (message) => {
  // Handle markdown-style formatting
  return message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
};

// Local storage for conversation history
export const conversationStorage = {
  save: (messages) => {
    try {
      localStorage.setItem('ewaste_chat_history', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  },
  
  load: () => {
    try {
      const history = localStorage.getItem('ewaste_chat_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading conversation history:', error);
      return [];
    }
  },
  
  clear: () => {
    localStorage.removeItem('ewaste_chat_history');
  }
};

// Export default service object for easier importing
const chatbotService = {
  sendMessage: sendMessageToChatbot,
  sendEnhancedMessage,
  sendContextualMessage,
  detectIntent: detectMessageIntent,
  getStarters: getConversationStarters,
  submitFeedback: submitChatbotFeedback,
  checkHealth: checkChatbotHealth,
  getUserContext,
  handleAction: handleChatbotAction,
  formatMessage: formatChatMessage,
  storage: conversationStorage
};

export default chatbotService;