import React, { useState, useEffect, useRef } from 'react';

const EWasteChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // API Base URL - adjust this to match your backend
  // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    initializeChat();
    loadUserInfo();
    checkBackendConnection();
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadUserInfo();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/health`);
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('connected');
        console.log('Backend connected:', data);
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const loadUserInfo = () => {
    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('token') || 
                  sessionStorage.getItem('authToken');
    
    const userData = localStorage.getItem('userInfo') || 
                     localStorage.getItem('user') || 
                     sessionStorage.getItem('user');
    
    const currentPath = window.location.pathname;
    const isOnUserPage = currentPath.startsWith('/user');
    const isOnAdminPage = currentPath.startsWith('/admin');
    const isOnPickupPage = currentPath.startsWith('/pickup');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUserInfo(user);
      } catch (error) {
        console.error('Could not parse user info:', error);
      }
    }
    
    if ((isOnUserPage || isOnAdminPage || isOnPickupPage) && !userInfo) {
      const roleFromPath = isOnUserPage ? 'user' : isOnAdminPage ? 'admin' : 'pickup';
      setUserInfo({
        name: 'User',
        role: roleFromPath,
        isLoggedIn: true
      });
    }
  };

  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      sender: 'bot',
      text: "👋 Hello! I'm your E-Waste Management Virtual Assistant. I can help you with pickup requests, tracking, login assistance, and system navigation.\n\nWhat would you like to do today?",
      timestamp: new Date(),
      quickReplies: [
        { text: "Request Pickup 📦", action: "pickup_request" },
        { text: "Track Request 📍", action: "track_request" },
        { text: "Login Help 🔐", action: "login_help" },
        { text: "System Guide 📖", action: "system_guide" }
      ]
    };
    setMessages([welcomeMessage]);
  };

  const addMessage = (sender, text, quickReplies = null) => {
    const message = {
      id: Date.now() + Math.random(),
      sender,
      text,
      timestamp: new Date(),
      quickReplies
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const simulateTyping = async (duration = 1200) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  // Call backend API for chat responses
  const callBackendAPI = async (message, enhanced = true) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const endpoint = enhanced ? '/api/chat/enhanced' : '/api/chat';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message,
          context: getUserContext()
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return enhanced ? data : { response: data.response, intent: 'general', quickReplies: [] };
    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  };

  const getUserContext = () => {
    return {
      user_role: userInfo?.role || null,
      is_logged_in: !!userInfo,
      user_name: userInfo?.name || null,
      current_path: window.location.pathname
    };
  };

  const handleLocalIntent = (intent, userMessage) => {
    switch (intent) {
      case 'greeting':
        const greeting = userInfo ? 
          `Hello ${userInfo.name}! 👋 Welcome back to your E-Waste Management System.` :
          "👋 Hello! Welcome to our E-Waste Management System.";
        
        return {
          response: greeting + " How can I help you today?",
          quickReplies: [
            { text: "Request New Pickup", action: "pickup_request" },
            { text: "Check My Requests", action: "track_request" },
            { text: "Account Help", action: userInfo ? "account_info" : "login_help" },
            { text: "System Guide", action: "system_guide" }
          ]
        };

      case 'pickup_request':
        const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
        const userPath = window.location.pathname;
        const isUserLoggedIn = !!(authToken || userInfo || userPath.startsWith('/user'));
        
        if (!isUserLoggedIn) {
          return {
            response: "🔐 To request a pickup, you'll need to be logged in first.\n\n" +
                     "**Why login?**\n" +
                     "• Schedule convenient pickup times\n" +
                     "• Select specific e-waste items\n" +
                     "• Track your request in real-time\n" +
                     "• Get pickup notifications\n" +
                     "• Earn eco-points for recycling",
            quickReplies: [
              { text: "Login to Account", action: "redirect:/login" },
              { text: "Create New Account", action: "redirect:/register" },
              { text: "Learn About Process", action: "pickup_process" }
            ]
          };
        } else {
          return {
            response: "🚛 Perfect! Let's get your e-waste pickup scheduled.\n\n" +
                     "**What we collect:**\n" +
                     "📱 Mobile phones, tablets, smartwatches\n" +
                     "💻 Laptops, computers, keyboards\n" +
                     "📺 TVs, monitors, projectors\n" +
                     "🔌 Chargers, cables, power banks\n" +
                     "🖨️ Printers, scanners\n" +
                     "🔋 Batteries (all types)",
            quickReplies: [
              { text: "Start Pickup Request", action: "redirect:/user/submit-request" },
              { text: "View My Requests", action: "redirect:/user/my-requests" },
              { text: "Preparation Tips", action: "prep_tips" }
            ]
          };
        }

      case 'track_request':
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const currentPath = window.location.pathname;
        const isOnUserPage = currentPath.startsWith('/user');
        const isLoggedIn = !!(token || userInfo || isOnUserPage);
        
        if (!isLoggedIn) {
          return {
            response: "🔍 To track your requests, please login to your account first.\n\n" +
                     "Once logged in, you can:\n" +
                     "• View all your pickup requests\n" +
                     "• See real-time status updates\n" +
                     "• Get pickup person contact info\n" +
                     "• Download pickup receipts",
            quickReplies: [
              { text: "Login Now", action: "redirect:/login" },
              { text: "Create Account", action: "redirect:/register" }
            ]
          };
        } else {
          return {
            response: "📋 Here's how to track your pickup requests:\n\n" +
                     "🔍 **My Requests Dashboard:**\n" +
                     "• View all your pickup requests\n" +
                     "• See real-time status updates\n" +
                     "• Contact pickup person\n" +
                     "• Download receipts\n\n" +
                     "📱 **Request Statuses:**\n" +
                     "• **Pending** - Awaiting assignment\n" +
                     "• **Assigned** - Pickup person assigned\n" +
                     "• **In Progress** - En route to you\n" +
                     "• **Completed** - Successfully collected",
            quickReplies: [
              { text: "View My Requests", action: "redirect:/user/my-requests" },
              { text: "Call Support", action: "call:+918003927830" }
            ]
          };
        }

      case 'login_help':
        return {
          response: "🔐 **Login Assistance**\n\n" +
                   "We have three types of accounts:\n\n" +
                   "👤 **User Account** - For residents\n" +
                   "• Request e-waste pickups\n" +
                   "• Track your requests\n\n" +
                   "🚛 **Pickup Person** - For collection staff\n" +
                   "• View assigned pickups\n" +
                   "• Complete collections\n" +
                   "• Verify OTPs\n\n" +
                   "👨‍💼 **Admin Account** - For system management\n" +
                   "• Manage users and requests\n" +
                   "• View analytics and reports",
          quickReplies: [
            { text: "User Login", action: "redirect:/login" },
            { text: "Pickup Person Login", action: "redirect:/login" },
            { text: "Admin Login", action: "redirect:/login" }
          ]
        };

      case 'system_guide':
        return {
          response: "📖 **E-Waste Management System Guide**\n\n" +
                   "**For Users:**\n" +
                   "1️⃣ Register/Login to your account\n" +
                   "2️⃣ Request pickup with item details\n" +
                   "3️⃣ Schedule convenient pickup time\n" +
                   "4️⃣ Prepare items for collection\n" +
                   "5️⃣ Hand over to pickup person\n" +
                   "6️⃣ Receive digital receipt\n\n" +
                   "**System Benefits:**\n" +
                   "🌱 Environmental protection\n" +
                   "🏆 Earn eco-points\n" +
                   "📱 Real-time tracking\n" +
                   "🔒 Secure data destruction",
          quickReplies: [
            { text: "Create Account", action: "redirect:/register" },
            { text: "Request Pickup", action: "pickup_request" },
            { text: "Contact Support", action: "support" }
          ]
        };

      default:
        return null;
    }
  };

  const detectIntent = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.match(/(hello|hi|hey|good morning|good afternoon|greetings)/)) {
      return 'greeting';
    }
    if (msg.match(/(pickup|collect|schedule|book|request)/)) {
      return 'pickup_request';
    }
    if (msg.match(/(track|status|where|when|progress|update|check)/)) {
      return 'track_request';
    }
    if (msg.match(/(login|sign in|log in|access|account)/)) {
      return 'login_help';
    }
    if (msg.match(/(register|sign up|create account|new account|join)/)) {
      return 'register_help';
    }
    if (msg.match(/(help|support|problem|issue|contact)/)) {
      return 'support';
    }
    if (msg.match(/(guide|how|what|explain|system)/)) {
      return 'system_guide';
    }
    if (msg.match(/(admin|manage|dashboard|analytics)/)) {
      return 'admin_help';
    }
    if (msg.match(/(pickup person|driver|collector|otp|complete)/)) {
      return 'pickup_person_help';
    }
    
    return 'general';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');

    await simulateTyping();

    try {
      if (connectionStatus === 'connected') {
        // Try backend API first
        try {
          const response = await callBackendAPI(userMessage, true);
          addMessage('bot', response.response, response.quickReplies || []);
        } catch (apiError) {
          console.warn('Backend API failed, using local fallback:', apiError);
          // Fallback to local intent handling
          const intent = detectIntent(userMessage);
          const localResponse = handleLocalIntent(intent, userMessage);
          if (localResponse) {
            addMessage('bot', localResponse.response, localResponse.quickReplies);
          } else {
            addMessage('bot', "I'm here to help with your E-Waste management needs! What would you like to know about?", [
              { text: "Request Pickup 📦", action: "pickup_request" },
              { text: "Track Requests 📍", action: "track_request" },
              { text: "Get Help 🎧", action: "support" }
            ]);
          }
        }
      } else {
        // Use local intent handling when backend is not available
        const intent = detectIntent(userMessage);
        const localResponse = handleLocalIntent(intent, userMessage);
        if (localResponse) {
          addMessage('bot', localResponse.response, localResponse.quickReplies);
        } else {
          addMessage('bot', "I'm here to help! Since I'm running in offline mode, I can provide basic guidance. What would you like to know about?", [
            { text: "System Guide", action: "system_guide" },
            { text: "Login Help", action: "login_help" },
            { text: "Contact Info", action: "support" }
          ]);
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
      addMessage('bot', "I'm having trouble processing that right now. Please try again or contact support.", [
        { text: "Try Again", action: "retry" },
        { text: "Contact Support", action: "support" }
      ]);
    }
  };

  const handleQuickReply = async (reply) => {
    addMessage('user', reply.text);
    
    await simulateTyping();
    
    if (reply.action.startsWith('redirect:')) {
      const path = reply.action.replace('redirect:', '');
      addMessage('bot', `Taking you to ${path}... 🔄\n\nIf the page doesn't load automatically, please navigate to: ${path}`);
      
      // In a real React app, you'd use navigate(path)
      setTimeout(() => {
        window.location.href = path;
      }, 1500);
    } else if (reply.action.startsWith('call:')) {
      const number = reply.action.replace('call:', '');
      window.open(`tel:${number}`);
      addMessage('bot', "📞 Calling support... If the call doesn't start automatically, please dial: " + number);
    } else if (reply.action === 'support') {
      addMessage('bot', "🎧 **Customer Support Center**\n\n" +
                       "We're here to help you!\n\n" +
                       "📞 **Phone Support:**\n" +
                       "• Toll-free: 1800-E-WASTE (1800-392783)\n" +
                       "• Available: 24/7\n\n" +
                       "📧 **Email Support:**\n" +
                       "• support@ewaste-management.com\n\n" +
                       "💬 **Live Chat:**\n" +
                       "• Available: 9 AM - 6 PM (Mon-Sat)", [
        { text: "Call Now", action: "call:+918003927830" },
        { text: "Email Support", action: "mailto:support@ewaste-management.com" }
      ]);
    } else {
      // Handle other actions with local intent system
      const localResponse = handleLocalIntent(reply.action);
      if (localResponse) {
        addMessage('bot', localResponse.response, localResponse.quickReplies);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected to Backend';
      case 'disconnected': return 'Offline Mode';
      default: return 'Checking Connection...';
    }
  };

  return (
    <>
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #1094b9ff 0%, #800596ff 100%)',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(16, 148, 185, 0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '28px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'pulse 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 12px 40px rgba(16, 148, 185, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 32px rgba(16, 148, 185, 0.3)';
          }}
        >
          💬
        </div>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          animation: 'slideUp 0.3s ease-out'
        }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #1094b9ff 0%, #800596ff 100%)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                  E-Waste Assistant
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  fontSize: '12px', 
                  opacity: 0.9 
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getConnectionStatusColor()
                  }}></div>
                  {getConnectionStatusText()}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            >
              ×
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f8fafc'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px',
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  position: 'relative'
                }}>
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: message.sender === 'user' 
                        ? '20px 20px 6px 20px' 
                        : '20px 20px 20px 6px',
                      backgroundColor: message.sender === 'user' ? '#3b82f6' : 'white',
                      color: message.sender === 'user' ? 'white' : '#374151',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      boxShadow: message.sender === 'user' 
                        ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                        : '0 4px 12px rgba(0,0,0,0.08)',
                      border: message.sender === 'bot' ? '1px solid #e5e7eb' : 'none'
                    }}
                  >
                    {message.text}
                    
                    <div style={{
                      fontSize: '11px',
                      opacity: 0.7,
                      marginTop: '6px',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {message.quickReplies && message.sender === 'bot' && (
                    <div style={{
                      marginTop: '12px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#f0f9ff',
                            border: '1px solid #0ea5e9',
                            color: '#0369a1',
                            borderRadius: '20px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: '500'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#0ea5e9';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f0f9ff';
                            e.target.style.color = '#0369a1';
                            e.target.style.transform = 'translateY(0px)';
                          }}
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '20px 20px 20px 6px',
                  padding: '16px 20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Assistant is typing</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#1094b9ff',
                          borderRadius: '50%',
                          animation: `bounce 1.4s infinite ease-in-out ${i * 0.16}s`
                        }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
              overflowX: 'auto'
            }}>
              {[
                { icon: '📦', text: 'Pickup', action: 'pickup_request' },
                { icon: '📍', text: 'Track', action: 'track_request' },
                { icon: '🔐', text: 'Login', action: 'login_help' },
                { icon: '🎧', text: 'Support', action: 'support' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply({ text: item.text, action: item.action })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '20px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    color: '#475569'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f1f5f9';
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about e-waste management..."
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    maxHeight: '120px',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '22px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    backgroundColor: '#ffffff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1094b9ff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 148, 185, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: input.trim() ? '#10b981' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  transition: 'all 0.2s',
                  boxShadow: input.trim() ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (input.trim()) {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (input.trim()) {
                    e.target.style.backgroundColor = '#10b981';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                ➤
              </button>
            </div>

            <div style={{
              marginTop: '12px',
              fontSize: '11px',
              color: '#9ca3af',
              textAlign: 'center'
            }}>
              💡 Try: "Request pickup", "Track my order", "What items do you accept?"
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          to { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default EWasteChatbot;