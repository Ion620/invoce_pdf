import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials) => {
        const response = await axios.post('/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post('/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await axios.post('/logout');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/user');
        return response.data;
    }
};

export const clientService = {
    getAll: async (params = {}) => {
        const response = await api.get('/clients', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },

    create: async (clientData) => {
        const response = await api.post('/clients', clientData);
        return response.data;
    },

    update: async (id, clientData) => {
        const response = await api.put(`/clients/${id}`, clientData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    }
};

export const facturaService = {
    getAll: async (params = {}) => {
        const response = await api.get('/facturi', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/facturi/${id}`);
        return response.data;
    },

    create: async (facturaData) => {
        const response = await api.post('/facturi', facturaData);
        return response.data;
    },

    update: async (id, facturaData) => {
        const response = await api.put(`/facturi/${id}`, facturaData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/facturi/${id}`);
        return response.data;
    },

    generatePdf: async (id) => {
        const response = await api.get(`/facturi/${id}/pdf`, {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf'
            }
        });

        // Verificăm dacă răspunsul este într-adevăr un PDF
        if (response.headers['content-type'] === 'application/pdf') {
            return {
                data: response.data,
                contentType: 'application/pdf',
                success: true
            };
        } else {
            console.error('Răspunsul nu este PDF:', response);
            return {
                success: false,
                error: 'Răspunsul nu este în format PDF'
            };
        }
    }
};

export const productService = {
    getAll: async () => {
        const response = await api.get('/products');
        return response.data;
    }
};

export default {
    auth: authService,
    client: clientService,
    factura: facturaService,
    product: productService
};
