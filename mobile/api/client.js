import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace string with environment variables later, hardcoded for initial test
const LOCAL_IP = '10.0.2.2';
const API_BASE_URL = `http://${LOCAL_IP}:8010/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    //
  }
  return config;
});

export const loginApi = async (email, password) => {
  const response = await apiClient.post('/login', { email, password });
  return response.data;
};

export const getMeApi = async () => {
  const response = await apiClient.get('/me');
  return response.data;
};

export const processAgentTask = async (taskType, input) => {
  try {
    const response = await apiClient.post('/agent/process', {
      task_type: taskType,
      input: input,
    });
    return response.data;
  } catch (error) {
    console.error('API Error details:', error.response?.data || error.message);
    throw new Error('Could not connect to the local Agent orchestrator.');
  }
};
