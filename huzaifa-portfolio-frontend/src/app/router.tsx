import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/public/HomePage';
import ProjectsPage from '@/pages/public/ProjectsPage';
import ProjectDetailsPage from '@/pages/public/ProjectDetailsPage';
import ContactPage from '@/pages/public/ContactPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCrudPage from '@/pages/admin/AdminCrudPage';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/:section" element={<ProtectedRoute><AdminCrudPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
