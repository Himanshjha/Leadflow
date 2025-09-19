import axios from 'axios';
import { API_BASE } from '../config';

const client = axios.create({ baseURL: API_BASE, withCredentials: true });

export const getLeads = (params) => client.get('/leads', { params }).then(r=>r.data);
export const createLead = (payload) => client.post('/leads', payload).then(r=>r.data);
export const getLead = (id) => client.get(`/leads/${id}`).then(r=>r.data);
export const updateLead = (id, payload) => client.put(`/leads/${id}`, payload).then(r=>r.data);
export const deleteLead = (id) => client.delete(`/leads/${id}`).then(r=>r.data);
