'use client';

// Reusable status badge with dot indicator
export default function StatusBadge({ status }) {
  const map = {
    submitted:    { label: 'दर्ज (Submitted)',    cls: 'badge-submitted' },
    acknowledged: { label: 'स्वीकृत (Acknowledged)', cls: 'badge-acknowledged' },
    assigned:     { label: 'आवंटित (Assigned)',     cls: 'badge-assigned' },
    in_progress:  { label: 'प्रगति पर (In Progress)',  cls: 'badge-in_progress' },
    resolved:     { label: 'निस्तारित (Resolved)',     cls: 'badge-resolved' },
    closed:       { label: 'समाधान पूर्ण (Closed)',       cls: 'badge-closed' },
    reopened:     { label: 'पुनः खुली (Reopened)',     cls: 'badge-reopened' },
    open:         { label: 'खुली / लंबित (Open)',      cls: 'badge-submitted' },
    pending:      { label: 'लंबित (Pending)',      cls: 'badge-pending' },
    completed:    { label: 'पूर्ण (Completed)',    cls: 'badge-completed' },
    present:      { label: 'उपस्थित (Present)',      cls: 'badge-present' },
    absent:       { label: 'अनुपस्थित (Absent)',       cls: 'badge-absent' },
    late:         { label: 'विलंब (Late)',         cls: 'badge-in_progress' },
    overdue:      { label: 'समय सीमा पार (Overdue)', cls: 'badge-overdue' },
  };

  const s = map[status?.toLowerCase()] || { label: status || '—', cls: 'badge-submitted' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
