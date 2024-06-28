import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadData = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/data/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error uploading data: ' + error.message);
    }
};

export const getDatasets = async () => {
    try {
        const response = await axios.get(`${API_URL}/data`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching datasets: ' + error.message);
    }
};

export const cleanDataset = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/data/clean/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error cleaning dataset: ' + error.message);
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        return response.data;
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, credentials);
        return response.data;
    } catch (error) {
        throw new Error('Error logging in: ' + error.message);
    }
};
