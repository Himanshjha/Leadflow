import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage(){
  const [email,setEmail]=useState('test@leadflow.local');
  const [password,setPassword]=useState('Password123');
  const [err,setErr]=useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      nav('/');
    } catch (err) {
      setErr(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>LeadFlow — Login</h2>
        <form onSubmit={submit}>
          {err && <div className="err">{err}</div>}
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
          <button className="btn">Login</button>
        </form>
        <div className="muted">New? <Link to="/register">Register</Link></div>
        <div className="muted">Test user: <b>test@leadflow.local</b> / <b>Password123</b></div>
      </div>
    </div>
  );
}
