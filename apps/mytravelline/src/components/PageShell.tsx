import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <main style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }}>
      {children}
    </main>
  );
}
