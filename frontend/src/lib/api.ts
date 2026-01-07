import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      const { status, data } = error.response;
      
      if (status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      
      // Retorna mensagem de erro do servidor ou genérica
      return Promise.reject({
        message: data?.message || 'Erro ao processar requisição',
        status,
        data,
      });
    } else if (error.request) {
      // Requisição feita mas sem resposta
      return Promise.reject({
        message: 'Erro de conexão. Verifique sua internet.',
        status: 0,
      });
    } else {
      // Erro ao configurar a requisição
      return Promise.reject({
        message: 'Erro ao processar requisição',
        status: 0,
      });
    }
  }
);

export default api;
