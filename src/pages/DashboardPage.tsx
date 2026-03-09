import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Package, CheckCircle2, Ruler, Users, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css';

export function DashboardPage() {
  const { data } = useAppData();

  const [statusFilter, setStatusFilter] = useState('todos');
  const [supplierFilter, setSupplierFilter] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nfFilter, setNfFilter] = useState('');

  const setDateRange = (days: number | 'month') => {
    const end = new Date();
    let start = new Date();

    if (days === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else {
      start.setDate(end.getDate() - days);
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const filteredNFs = useMemo(() => {
    return data.notasFiscais.filter(nf => {
      const matchNf = nfFilter === '' || nf.number.toLowerCase().includes(nfFilter.toLowerCase());
      const matchSupplier = supplierFilter === 'todos' || nf.supplierId === supplierFilter;

      const nfDateObj = new Date(nf.createdAt);
      const nfDate = nfDateObj.toISOString().split('T')[0];
      const matchStart = startDate === '' || nfDate >= startDate;
      const matchEnd = endDate === '' || nfDate <= endDate;

      return matchNf && matchSupplier && matchStart && matchEnd;
    });
  }, [data.notasFiscais, nfFilter, supplierFilter, startDate, endDate]);

  const filteredReels = useMemo(() => {
    const nfIds = new Set(filteredNFs.map(nf => nf.id));
    return data.reels.filter(reel => {
      const matchStatus = statusFilter === 'todos' || reel.status === statusFilter;
      const matchSupplier = supplierFilter === 'todos' || reel.supplierId === supplierFilter;
      const matchNf = nfIds.has(reel.nfId);
      return matchStatus && matchSupplier && matchNf;
    });
  }, [data.reels, statusFilter, supplierFilter, filteredNFs]);

  const totalReels = filteredReels.length;
  const availableReels = filteredReels.filter(r => r.status === 'disponivel').length;

  // Total meters currently in stock (available + remaining from in use)
  const totalMeters = filteredReels
    .filter(r => r.status !== 'esgotado')
    .reduce((acc, curr) => acc + curr.remainingMeters, 0);

  const activeSuppliers = data.suppliers.length;

  // Chart data: meters per supplier
  const supplierStock = data.suppliers.map(sup => {
    const meters = filteredReels
      .filter(r => r.supplierId === sup.id && r.status !== 'esgotado')
      .reduce((acc, curr) => acc + curr.remainingMeters, 0);
    return { name: sup.name, m: meters };
  }).filter(item => item.m > 0)
    .sort((a, b) => b.m - a.m);

  // Last entries (NFs)
  const lastEntries = [...filteredNFs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="dashboard-container">
      <header className="page-header dashboard-header">
        <div className="header-title-section">
          <h1>Dashboard</h1>
          <p className="subtitle">Visão geral do estoque de bobinas UVPack</p>
        </div>

        <div className="dashboard-filters">
          <div className="filter-select-wrapper filter-status">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="todos">Todos os Status</option>
              <option value="disponivel">Disponível</option>
              <option value="em_uso">Em Uso</option>
              <option value="esgotado">Esgotado</option>
            </select>
          </div>

          <div className="filter-select-wrapper filter-supplier">
            <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
              <option value="todos">Todos os Fornecedores</option>
              {data.suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-date-group">
            <DateInputField
              label="De"
              value={startDate}
              onChange={setStartDate}
            />
            <DateInputField
              label="Até"
              value={endDate}
              onChange={setEndDate}
            />
          </div>

          <div className="filter-nf-wrapper">
            <input
              type="text"
              value={nfFilter}
              onChange={e => setNfFilter(e.target.value)}
              placeholder="Nota Fiscal"
            />
          </div>

          <div className="filter-shortcuts">
            <button className="shortcut-btn" onClick={() => setDateRange(7)}>7d</button>
            <button className="shortcut-btn" onClick={() => setDateRange(30)}>30d</button>
            <button className="shortcut-btn" onClick={() => setDateRange('month')}>Mês</button>
            {(startDate || endDate || statusFilter !== 'todos' || supplierFilter !== 'todos' || nfFilter) && (
              <button className="shortcut-btn clear-btn" onClick={() => {
                setStartDate('');
                setEndDate('');
                setStatusFilter('todos');
                setSupplierFilter('todos');
                setNfFilter('');
              }}>Limpar</button>
            )}
          </div>
        </div>
      </header>

      <div className="kpi-grid">
        <KPICard title="Total de Bobinas" value={totalReels} icon={<Package />} />
        <KPICard title="Bobinas Disponíveis" value={availableReels} icon={<CheckCircle2 />} color="var(--status-green)" />
        <KPICard
          title="Metragem Estimada em Estoque"
          value={`${totalMeters.toLocaleString('pt-BR')} m`}
          icon={<Ruler />}
          tooltip="Quantidade de metragem somada das bobinas disponíveis e em uso (estoque restante)."
        />
        <KPICard title="Fornecedores" value={activeSuppliers} icon={<Users />} />
      </div>

      <div className="dashboard-content">
        <div className="card chart-card">
          <h3>Estoque por Fornecedor (Metragem)</h3>
          {supplierStock.length > 0 ? (
            <div className="chart-wrapper" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={320}>
                <BarChart
                  data={supplierStock}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  style={{ outline: 'none' }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-secondary)"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                    interval={0}
                    tickFormatter={(value) => value.length > 8 ? value.substring(0, 8) + '...' : value}
                  />
                  <YAxis
                    stroke="var(--text-secondary)"
                    tick={{ fill: 'var(--text-secondary)' }}
                    tickFormatter={(value) => `${value}m`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                    itemStyle={{ color: 'var(--accent)' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    formatter={(value: number | undefined) => [`${(value || 0).toLocaleString('pt-BR')} m`, 'Metragem']}
                  />
                  <Bar dataKey="m" radius={[4, 4, 0, 0]} style={{ outline: 'none' }}>
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
              <table className="data-table" style={{ minWidth: '400px' }}>
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

function KPICard({
  title,
  value,
  icon,
  color = 'var(--accent)',
  tooltip
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  tooltip?: string;
}) {
  return (
    <div className="kpi-card card">
      <div className="kpi-icon" style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div className="kpi-info">
        <div className="kpi-title-row">
          <h4>{title}</h4>
          {tooltip && (
            <div className="tooltip-container">
              <HelpCircle size={14} className="help-icon" />
              <div className="tooltip-text">{tooltip}</div>
            </div>
          )}
        </div>
        <span className="kpi-value">{value}</span>
      </div>
    </div>
  );
}

function DateInputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formatted = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('pt-BR')
    : null;
  return (
    <div
      className="date-field-wrapper"
      onClick={() => inputRef.current?.showPicker?.() ?? inputRef.current?.click()}
    >
      <span className="date-field-label">{label}</span>
      <div className="date-field-display">
        <svg
          className="date-field-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className={`date-field-value ${!formatted ? 'date-field-placeholder' : ''}`}>
          {formatted ?? 'dd/mm/aaaa'}
        </span>
      </div>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="date-field-input-hidden"
      />
    </div>
  );
}
