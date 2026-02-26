import { useAppData } from '../hooks/useAppData';
import { Package, CheckCircle2, Ruler, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css';

export function DashboardPage() {
  const { data } = useAppData();

  const totalReels = data.reels.length;
  const availableReels = data.reels.filter(r => r.status === 'disponivel').length;
  
  // Total meters currently in stock (available + remaining from in use)
  const totalMeters = data.reels
    .filter(r => r.status !== 'esgotado')
    .reduce((acc, curr) => acc + curr.remainingMeters, 0);

  const activeSuppliers = data.suppliers.length;

  // Chart data: meters per supplier
  const supplierStock = data.suppliers.map(sup => {
    const meters = data.reels
      .filter(r => r.supplierId === sup.id && r.status !== 'esgotado')
      .reduce((acc, curr) => acc + curr.remainingMeters, 0);
    return { name: sup.name, m: meters };
  }).filter(item => item.m > 0)
    .sort((a, b) => b.m - a.m);

  // Last entries (NFs)
  const lastEntries = [...data.notasFiscais]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Visão geral do estoque de bobinas UVPack</p>
      </header>

      <div className="kpi-grid">
        <KPICard title="Total de Bobinas" value={totalReels} icon={<Package />} />
        <KPICard title="Bobinas Disponíveis" value={availableReels} icon={<CheckCircle2 />} color="var(--status-green)" />
        <KPICard title="Metragem Estimada" value={`${totalMeters.toLocaleString('pt-BR')} m`} icon={<Ruler />} />
        <KPICard title="Fornecedores" value={activeSuppliers} icon={<Users />} />
      </div>

      <div className="dashboard-content">
        <div className="card chart-card">
          <h3>Estoque por Fornecedor (Metragem)</h3>
          {supplierStock.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierStock} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="var(--text-secondary)" />
                  <YAxis dataKey="name" type="category" width={100} stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--accent)' }}
                    formatter={(value: number | undefined) => [`${(value || 0).toLocaleString('pt-BR')} m`, 'Metragem']}
                  />
                  <Bar dataKey="m" radius={[0, 4, 4, 0]}>
                    {supplierStock.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--accent)' : 'var(--accent-hover)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state-mini">Nenhum estoque disponível</div>
          )}
        </div>

        <div className="card table-card">
          <h3>Últimas Entradas (NFs)</h3>
          {lastEntries.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nº NF</th>
                    <th>Fornecedor</th>
                    <th>Volumes</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {lastEntries.map(nf => {
                    const sup = data.suppliers.find(s => s.id === nf.supplierId);
                    return (
                      <tr key={nf.id}>
                        <td><strong>{nf.number}</strong></td>
                        <td>{sup?.name || 'Desconhecido'}</td>
                        <td>{nf.totalVolumes}</td>
                        <td>{new Date(nf.createdAt).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-mini">Nenhuma entrada registrada</div>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color = 'var(--accent)' }: { title: string; value: string | number; icon: React.ReactNode; color?: string }) {
  return (
    <div className="kpi-card card">
      <div className="kpi-icon" style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div className="kpi-info">
        <h4>{title}</h4>
        <span className="kpi-value">{value}</span>
      </div>
    </div>
  );
}
