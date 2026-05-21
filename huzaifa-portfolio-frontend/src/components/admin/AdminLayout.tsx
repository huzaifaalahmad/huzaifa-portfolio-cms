import { Link, useLocation, useNavigate } from 'react-router-dom';

const sections = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Site Content', to: '/admin/settings' },
  { label: 'Projects / Work', to: '/admin/projects' },
  { label: 'Skills', to: '/admin/skills' },
  { label: 'Experience', to: '/admin/experience' },
  { label: 'Education', to: '/admin/education' },
  { label: 'Messages', to: '/admin/messages' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    nav('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside>
        <h2>Huzaifa Admin</h2>
        {sections.map((section) => (
          <Link className={location.pathname === section.to ? 'active' : ''} key={section.to} to={section.to}>
            {section.label}
          </Link>
        ))}
        <button onClick={logout}>Logout</button>
      </aside>
      <main>{children}</main>
    </div>
  );
}
