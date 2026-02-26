import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Package, Menu, X, FileText } from 'lucide-react';
import logoUrl from '../../assets/uvpack.jpg';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navItems = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/fornecedores', icon: <Users size={20} />, label: 'Fornecedores' },
        { to: '/recebimento', icon: <PlusCircle size={20} />, label: 'Novo Lote' },
        { to: '/estoque', icon: <Package size={20} />, label: 'Estoque' },
        { to: '/notas-fiscais', icon: <FileText size={20} />, label: 'Histórico NFs' },
    ];

    return (
        <>
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <img src={logoUrl} alt="UVPack Logo" className="logo-image" />
                        <div className="logo-text">
                            <h2>UVPack</h2>
                            <p>Gestão de Bobinas</p>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
        </>
    );
}
