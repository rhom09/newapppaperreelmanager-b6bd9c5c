import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import './Layout.css';

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="app-main">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
