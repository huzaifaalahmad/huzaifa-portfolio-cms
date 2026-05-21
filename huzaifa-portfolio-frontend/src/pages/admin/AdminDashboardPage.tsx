import AdminLayout from '@/components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { metricsApi } from '@/services/api/metricsApi';

const baseCards = [
  ['Sections', 'Editable'],
  ['Access', 'Owner only'],
  ['Messages', 'Connected'],
  ['Backend', 'Ready'],
];

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({ siteVisits: 0, cvDownloads: 0 });

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await metricsApi.summary();
        setMetrics(res.data || { siteVisits: 0, cvDownloads: 0 });
      } catch (error) {
        console.error('Failed to load metrics', error);
      }
    }

    void loadMetrics();
  }, []);

  const cards = [
    ['Site Visits', String(metrics.siteVisits)],
    ['CV Downloads', String(metrics.cvDownloads)],
    ...baseCards,
  ];

  return (
    <AdminLayout>
      <div>
        <h1>Dashboard</h1>
        <p className="lead">Private overview for editable content, traffic, and CV downloads.</p>
        <div className="admin-cards">
          {cards.map((card) => (
            <article key={card[0]}>
              <span>{card[0]}</span>
              <strong>{card[1]}</strong>
            </article>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
