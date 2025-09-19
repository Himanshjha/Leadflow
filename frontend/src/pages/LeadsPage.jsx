import React from 'react';
import LeadsGrid from '../components/LeadsGrid';
import { useAuth } from '../context/AuthContext';

export default function LeadsPage(){
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="topbar">
        <div className="brand">LeadFlow</div>
        <div className="top-actions">
          <div className="muted">Signed in as <b>{user?.name}</b></div>
          <button className="btn ghost" onClick={logout}>Logout</button>
        </div>
      </header>
      <main className="container">
        <LeadsGrid />
      </main>
      <footer className="footer">Built for Erino — Lead Management System</footer>
    </div>
  );
}
