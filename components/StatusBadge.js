'use client';

// Reusable status badge with dot indicator
export default function StatusBadge({ status }) {
  const map = {
    submitted:    { label: 'Submitted',    cls: 'badge-submitted' },
    acknowledged: { label: 'Acknowledged', cls: 'badge-acknowledged' },
    assigned:     { label: 'Assigned',     cls: 'badge-assigned' },
    in_progress:  { label: 'In Progress',  cls: 'badge-in_progress' },
    resolved:     { label: 'Resolved',     cls: 'badge-resolved' },
    closed:       { label: 'Closed',       cls: 'badge-closed' },
    reopened:     { label: 'Reopened',     cls: 'badge-reopened' },
    pending:      { label: 'Pending',      cls: 'badge-pending' },
    completed:    { label: 'Completed',    cls: 'badge-completed' },
    present:      { label: 'Present',      cls: 'badge-present' },
    absent:       { label: 'Absent',       cls: 'badge-absent' },
    late:         { label: 'Late',         cls: 'badge-in_progress' },
    overdue:      { label: 'OVERDUE',      cls: 'badge-overdue' },
  };

  const s = map[status?.toLowerCase()] || { label: status || '—', cls: 'badge-submitted' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
