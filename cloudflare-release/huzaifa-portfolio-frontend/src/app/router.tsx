import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import HomePage from '@/pages/public/HomePage';
const ContentEditorPage = lazy(() => import('@/pages/public/ContentEditorPage'));
const DashboardPreviewPage = lazy(() => import('@/pages/public/DashboardPreviewPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<div role="status" style={{padding:32}}>Loading / جارٍ التحميل…</div>}><Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cms" element={<ContentEditorPage />} />
      <Route path="/cms-preview" element={<HomePage />} />
      <Route path="/dashboard-preview" element={<DashboardPreviewPage />} />
      <Route path="/projects" element={<Navigate to="/#projects" replace />} />
      <Route path="/projects/:slug" element={<Navigate to="/#projects" replace />} />
      <Route path="/contact" element={<Navigate to="/#contact" replace />} />
      <Route path="/admin/*" element={<Navigate to="/cms" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></Suspense>
  );
}
