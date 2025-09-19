import axios from 'axios';
import { API_BASE } from '../config';

const client = axios.create({ baseURL: API_BASE, withCredentials: true });

export const register = (payload) => client.post('/auth/register', payload).then(r=>r.data);
export const login = (payload) => client.post('/auth/login', payload).then(r=>r.data);
export const logout = () => client.post('/auth/logout').then(r=>r.data);
export const me = () => client.get('/auth/me').then(r=>r.data);
