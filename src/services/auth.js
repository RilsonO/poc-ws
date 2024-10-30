import { api } from './api';

export const Auth = {
  async login(email, password) {
    const options = {
      method: 'POST',
      url: '/api/auth/login',
      data: {
        email,
        password,
      },
    };

    try {
      const response = await api.request(options);
      return response;
    } catch (error) {
      console.log('[Axios error] error:', error);

      throw error;
    }
  },

  async messages(friendId) {
    const options = {
      method: 'GET',
      url: `/api/messages/${friendId}`,
    };

    try {
      const response = await api.request(options);
      return response;
    } catch (error) {
      console.log('[Axios error] error:', error);
      throw error;
    }
  },
};
