import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      nav('/');
    } catch (err) {
      setErr(err?.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <form onSubmit={submit}>
          {err && <div className="err">{err}</div>}
          <label>Name<input value={name} onChange={e=>setName(e.target.value)} /></label>
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
          <button className="btn">Register</button>
        </form>
        <div className="muted">Have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  );
}
