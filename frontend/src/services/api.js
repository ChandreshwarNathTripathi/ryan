const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('xshotel_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    if (query) url += `${url.includes('?') ? '&' : '?'}${query}`;
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP error! status: ${response.status}`);
    error.response = { data, status: response.status };
    error.friendlyMessage = data?.message || 'An unexpected error occurred. Please try again.';
    throw error;
  }

  return { data };
}

const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

// 1. Auth Services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.patch('/auth/profile', profileData),
};

// 2. Room Services
export const roomService = {
  getRooms: (params = {}) => api.get('/rooms', { params }),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

// 3. Booking Services
export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
  getAllBookings: (params = {}) => api.get('/bookings', { params }),
  updateBookingStatus: (id, statusData) =>
    api.patch(`/bookings/${id}/status`, statusData),
};

// 4. Review Services
export const reviewService = {
  getReviews: (params = {}) => api.get('/reviews', { params }),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReviewStatus: (id, data) => api.patch(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// 5. User Services (Admin)
export const userService = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
};

// 6. Admin Analytics & Stats
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
