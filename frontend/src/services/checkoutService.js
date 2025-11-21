const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getCustomerId = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.id;
  }
  return null;
};

const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const checkoutService = {
  // Preview checkout (tính toán giá)
  preview: async (previewData) => {
    const customerId = getCustomerId();
    const sessionId = getSessionId();
    const queryParam = customerId ? `customerId=${customerId}` : `sessionId=${sessionId}`;
    
    const response = await fetch(`${API_URL}/api/checkout/preview?${queryParam}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(previewData),
    });
    
    const result = await response.json();
    return result;
  },
};

