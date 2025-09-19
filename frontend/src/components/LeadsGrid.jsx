import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import * as api from '../api/leadApi';
import LeadForm from './LeadForm';

export default function LeadsGrid() {
  const [rowData, setRowData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);
  const gridRef = useRef();

  const fetch = useCallback(async () => {
    const params = { page, limit, ...filters };
    const res = await api.getLeads(params);
    setRowData(res.data);
    setTotal(res.total);
    setTotalPages(res.totalPages);
  }, [page, limit, filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const onPageChange = (delta) => {
    setPage(p => Math.max(1, Math.min(totalPages, p + delta)));
  };

  // Action buttons as React component
  const ActionsCell = ({ data }) => {
    const handleEdit = () => setSelected(data);
    const handleDelete = async () => {
      if (!window.confirm('Delete lead?')) return;
      await api.deleteLead(data._id);
      fetch();
    };
    return (
      <div className="grid-actions">
        <button className="btn tiny" onClick={handleEdit}>Edit</button>
        <button className="btn tiny danger" onClick={handleDelete}>Del</button>
      </div>
    );
  };

  const columns = [
    { field: 'first_name', headerName: 'First', sortable: true, filter: true },
    { field: 'last_name', headerName: 'Last' },
    { field: 'email', flex: 1 },
    { field: 'company' },
    { field: 'city' },
    { field: 'state' },
    { field: 'source' },
    { field: 'status' },
    { field: 'score', width: 100 },
    { field: 'lead_value', headerName: 'Value', width: 120 },
    { 
      field: 'last_activity_at', 
      headerName: 'Last Activity', 
      valueGetter: params => params.data.last_activity_at ? new Date(params.data.last_activity_at).toLocaleString() : '-' 
    },
    { 
      field: 'is_qualified', 
      headerName: 'Qualified', 
      width: 100, 
      valueGetter: params => params.data.is_qualified ? 'Yes' : 'No' 
    },
    {
      headerName: 'Actions', 
      width: 140, 
      cellRendererFramework: ActionsCell
    }
  ];

  const onSaved = () => { setSelected(null); fetch(); };

  return (
    <div className="leads-layout">
      <div className="leads-toolbar">
        <div>
          <button className="btn" onClick={() => setSelected({})}>+ New Lead</button>
        </div>
        <div className="filters">
          <input placeholder="Email contains" onBlur={e => setFilters(f => ({ ...f, email_contains: e.target.value || undefined }))} />
          <select onChange={e => setFilters(f => ({ ...f, status_eq: e.target.value || undefined }))}>
            <option value="">Status (all)</option>
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="qualified">qualified</option>
            <option value="lost">lost</option>
            <option value="won">won</option>
          </select>
          <button className="btn" onClick={() => { setPage(1); fetch(); }}>Apply</button>
        </div>
      </div>

      <div className="ag-theme-alpine grid" style={{ height: '520px' }} ref={gridRef}>
        <AgGridReact 
          rowData={rowData} 
          columnDefs={columns} 
          domLayout="normal" 
          pagination={false} 
          suppressCellSelection 
        />
      </div>

      <div className="pager">
        <div>Showing page {page}/{totalPages} — {total} leads</div>
        <div>
          <button className="btn" onClick={() => onPageChange(-1)} disabled={page <= 1}>Prev</button>
          <button className="btn" onClick={() => onPageChange(1)} disabled={page >= totalPages}>Next</button>
        </div>
      </div>

      {selected && <LeadForm lead={selected} onClose={() => setSelected(null)} onSaved={onSaved} />}
    </div>
  );
}
