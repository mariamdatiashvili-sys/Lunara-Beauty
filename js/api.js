/**
 * API Service for MockAPI
 * Base URL and helper methods for GET, POST, PUT, DELETE
 */

const API_BASE_URL = "https://696bd26e624d7ddccaa22077.mockapi.io/api/v1";

const api = {
    // Generic request helper
    async request(endpoint, method = 'GET', data = null) {
        const url = `${API_BASE_URL}/${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    },

    // HTTP Methods
    get(endpoint) {
        return this.request(endpoint, 'GET');
    },

    post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    },

    put(endpoint, id, data) {
        return this.request(`${endpoint}/${id}`, 'PUT', data);
    },

    patch(endpoint, id, data) {
        return this.request(`${endpoint}/${id}`, 'PATCH', data);
    },

    delete(endpoint, id) {
        return this.request(`${endpoint}/${id}`, 'DELETE');
    }
};
