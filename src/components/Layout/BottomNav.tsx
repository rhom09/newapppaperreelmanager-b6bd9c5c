import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Package, FileText } from 'lucide-react';

export function BottomNav() {
    const navItems = [
        { to: '/', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
        { to: '/fornecedores', icon: <Users size={22} />, label: 'Fornecedores' },
        { to: '/recebimento', icon: <PlusCircle size={22} />, label: 'Novo Lote' },
        { to: '/estoque', icon: <Package size={22} />, label: 'Estoque' },
        { to: '/notas-fiscais', icon: <FileText size={22} />, label: 'NFs' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
