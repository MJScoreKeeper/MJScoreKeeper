import type { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen max-w-2xl mx-auto bg-white shadow-lg">
      {children}
    </div>
  );
}
