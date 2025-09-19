import React, { useState, useEffect } from 'react';
import * as api from '../api/leadApi';

const empty = {
  first_name: '', last_name:'', email:'', phone:'', company:'', city:'', state:'', source:'website',
  status:'new', score:0, lead_value:0, last_activity_at:'', is_qualified:false
};

export default function LeadForm({ lead, onClose, onSaved }){
  const [form,setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  useEffect(()=> {
    if (lead && lead._id) {
      setForm({
        ...lead,
        last_activity_at: lead.last_activity_at ? new Date(lead.last_activity_at).toISOString().slice(0,16) : ''
      });
    } else if (lead && Object.keys(lead).length===0) {
      setForm(empty);
    } else {
      setForm(empty);
    }
  }, [lead]);

  const handle = (k,v) => setForm(s=> ({...s, [k]: v}));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.last_activity_at === '') payload.last_activity_at = null;
      if (lead && lead._id) {
        await api.updateLead(lead._id, payload);
      } else {
        await api.createLead(payload);
      }
      onSaved();
    } catch (err) {
      alert(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{lead && lead._id ? 'Edit Lead' : 'Create Lead'}</h3>
          <button className="btn tiny" onClick={onClose}>X</button>
        </div>
        <form className="lead-form" onSubmit={submit}>
          <div className="row">
            <label>First Name<input value={form.first_name} onChange={e=>handle('first_name', e.target.value)} required/></label>
            <label>Last Name<input value={form.last_name} onChange={e=>handle('last_name', e.target.value)} /></label>
          </div>
          <div className="row">
            <label>Email<input value={form.email} onChange={e=>handle('email', e.target.value)} required/></label>
            <label>Phone<input value={form.phone} onChange={e=>handle('phone', e.target.value)} /></label>
          </div>
          <div className="row">
            <label>Company<input value={form.company} onChange={e=>handle('company', e.target.value)} /></label>
            <label>City<input value={form.city} onChange={e=>handle('city', e.target.value)} /></label>
          </div>
          <div className="row">
            <label>State<input value={form.state} onChange={e=>handle('state', e.target.value)} /></label>
            <label>Source
              <select value={form.source} onChange={e=>handle('source', e.target.value)}>
                <option value="website">website</option><option value="facebook_ads">facebook_ads</option>
                <option value="google_ads">google_ads</option><option value="referral">referral</option>
                <option value="events">events</option><option value="other">other</option>
              </select>
            </label>
          </div>
          <div className="row">
            <label>Status
              <select value={form.status} onChange={e=>handle('status', e.target.value)}>
                <option value="new">new</option><option value="contacted">contacted</option><option value="qualified">qualified</option><option value="lost">lost</option><option value="won">won</option>
              </select>
            </label>
            <label>Score<input type="number" min="0" max="100" value={form.score} onChange={e=>handle('score', Number(e.target.value))} /></label>
          </div>
          <div className="row">
            <label>Lead Value<input type="number" value={form.lead_value} onChange={e=>handle('lead_value', Number(e.target.value))} /></label>
            <label>Last Activity<input type="datetime-local" value={form.last_activity_at} onChange={e=>handle('last_activity_at', e.target.value)} /></label>
          </div>
          <div className="row">
            <label className="row-inline">Qualified
              <input type="checkbox" checked={form.is_qualified} onChange={e=>handle('is_qualified', e.target.checked)} />
            </label>
          </div>

          <div className="modal-actions">
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="btn ghost" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
