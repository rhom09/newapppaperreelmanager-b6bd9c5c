import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAppData } from '../../hooks/useAppData';
import logoUrl from '../../assets/uvpack.jpg';
import './Layout.css';

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const { loading, error } = useAppData();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Conectando ao Supabase...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-screen">
                <div className="error-card card">
                    <h2>Ops! Algo deu errado</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <header className="mobile-header">
                <div className="mobile-header-logo">
                    <img src={logoUrl} alt="UVPack Logo" />
                    <div className="mobile-header-text">
                        <strong>UVPack</strong>
                        <span className="subtitle">Gestão de Bobinas</span>
                    </div>
                </div>
            </header>
            <Sidebar />
            <main className="app-main">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
