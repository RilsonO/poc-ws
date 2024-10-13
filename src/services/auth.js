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
};
