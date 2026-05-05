import AdminLayout from '@/components/admin/AdminLayout';
const cards=[['Sections','12'],['Projects','3'],['Messages','Connected'],['Backend','Ready']];
export default function AdminDashboardPage(){return <AdminLayout><div><h1>Dashboard</h1><p className="lead">Overview of editable portfolio content and backend integration status.</p><div className="admin-cards">{cards.map(c=><article key={c[0]}><span>{c[0]}</span><strong>{c[1]}</strong></article>)}</div></div></AdminLayout>}
