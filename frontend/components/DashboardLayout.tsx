'use client';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  role: 'admin' | 'buyer' | 'seller';
  children: React.ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        {children}
      </main>
    </div>
  );
}
