
import React from 'react';

const Notification = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;