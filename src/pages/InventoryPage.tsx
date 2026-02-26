import { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Edit2, PackageOpen, Trash2 } from 'lucide-react';
import { ConfirmModal } from '../components/Common/ConfirmModal';
import type { Reel, ReelStatus } from '../types';
import './Inventory.css';

export function InventoryPage() {
  const { data, updateReelStatus, deleteReel } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReelStatus | 'todos'>('todos');

  // Use search params for initial supplier filter if coming from Suppliers page
  const initialSupplierFilter = searchParams.get('fornecedor') || 'todos';
  const [supplierFilter, setSupplierFilter] = useState<string>(initialSupplierFilter);

  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Reel | null>(null);

  const filteredReels = useMemo(() => {
    return data.reels.filter(reel => {
      // Status filter
      if (statusFilter !== 'todos' && reel.status !== statusFilter) return false;

      // Supplier filter
      if (supplierFilter !== 'todos' && reel.supplierId !== supplierFilter) return false;

      // Search (NF, MaterialCode, ClientCode, or UVPACK ID)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const nfMatch = reel.nfNumber.toLowerCase().includes(term);
        const codeMatch = reel.materialCode.toLowerCase().includes(term);
        const clientMatch = reel.clientCode.toLowerCase().includes(term);
        const uvpacMatch = String(reel.uvpacId).includes(term);
        if (!nfMatch && !codeMatch && !clientMatch && !uvpacMatch) return false;
      }

      return true;
    }).sort((a, b) => b.uvpacId - a.uvpacId);
  }, [data.reels, statusFilter, supplierFilter, searchTerm]);

  const getStatusBadge = (status: ReelStatus) => {
    switch (status) {
      case 'disponivel': return <span className="status-badge status-green">Disponível</span>;
      case 'em_uso': return <span className="status-badge status-yellow">Em Uso</span>;
      case 'esgotado': return <span className="status-badge status-red">Esgotado</span>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setSupplierFilter('todos');
    setSearchParams({});
  };

  const handleDeleteReel = (reel: Reel) => {
    setDeleteConfirm(reel);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteReel(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="inventory-container">
      <header className="page-header">
        <h1>Estoque de Bobinas</h1>
        <p className="subtitle">Consulte e atualize o status dos lotes</p>
      </header>

      <div className="card filters-card">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por NF, Material, Cliente ou ID UVPACK..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <Filter size={18} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
              <option value="todos">Todos os Status</option>
              <option value="disponivel">Disponível</option>
              <option value="em_uso">Em Uso</option>
              <option value="esgotado">Esgotado</option>
            </select>
          </div>

          <div className="filter-item">
            <select value={supplierFilter} onChange={e => {
              setSupplierFilter(e.target.value);
              if (searchParams.has('fornecedor')) {
                setSearchParams({}); // Clear from URL if changed
              }
            }}>
              <option value="todos">Todos os Fornecedores</option>
              {data.suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.prefix})</option>
              ))}
            </select>
          </div>

          {(searchTerm || statusFilter !== 'todos' || supplierFilter !== 'todos') && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>Limpar</button>
          )}
        </div>
      </div>

      <div className="card inventory-card">
        {filteredReels.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table inventory-table desktop-only">
              <thead>
                <tr>
                  <th>ID UVPACK</th>
                  <th>Cód. Material</th>
                  <th>NF</th>
                  <th>Fornecedor</th>
                  <th>Cód. Cliente</th>
                  <th>Metragem</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredReels.map(reel => {
                  const supplier = data.suppliers.find(s => s.id === reel.supplierId);
                  const isEsgotado = reel.status === 'esgotado';

                  return (
                    <tr key={reel.id} className={isEsgotado ? 'row-dimmed' : ''}>
                      <td><span className="uvpac-id">#{reel.uvpacId}</span></td>
                      <td><strong>{reel.materialCode}</strong></td>
                      <td>{reel.nfNumber}</td>
                      <td>{supplier?.prefix || '-'}</td>
                      <td>{reel.clientCode}</td>
                      <td>
                        {reel.remainingMeters} / {reel.linearMeters} m
                        <div className="meter-bar-bg">
                          <div
                            className="meter-bar-fill"
                            style={{
                              width: `${(reel.remainingMeters / reel.linearMeters) * 100}%`,
                              backgroundColor: reel.remainingMeters < reel.linearMeters * 0.2 ? 'var(--status-red)' : 'var(--accent)'
                            }}
                          />
                        </div>
                      </td>
                      <td>{getStatusBadge(reel.status)}</td>
                      <td>
                        <button className="icon-btn edit-btn" onClick={() => setEditingReel(reel)} title="Atualizar Status">
                          <Edit2 size={18} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => handleDeleteReel(reel)} title="Excluir Bobina">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="mobile-list mobile-only">
              {filteredReels.map(reel => {
                const supplier = data.suppliers.find(s => s.id === reel.supplierId);
                const isEsgotado = reel.status === 'esgotado';
                return (
                  <div key={reel.id} className={`mobile-card ${isEsgotado ? 'row-dimmed' : ''}`}>
                    <div className="mc-header">
                      <div className="mc-titles">
                        <span className="uvpac-id">#{reel.uvpacId}</span>
                        <strong>{reel.materialCode}</strong>
                      </div>
                      {getStatusBadge(reel.status)}
                    </div>
                    <div className="mc-body">
                      <p><span>NF:</span> {reel.nfNumber}</p>
                      <p><span>Fornecedor:</span> {supplier?.prefix}</p>
                      <p><span>Cód. Cliente:</span> {reel.clientCode}</p>
                      <div className="mc-meters">
                        <span>Metragem: {reel.remainingMeters} / {reel.linearMeters} m</span>
                        <div className="meter-bar-bg">
                          <div
                            className="meter-bar-fill"
                            style={{
                              width: `${(reel.remainingMeters / reel.linearMeters) * 100}%`,
                              backgroundColor: reel.remainingMeters < reel.linearMeters * 0.2 ? 'var(--status-red)' : 'var(--accent)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mc-footer">
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setEditingReel(reel)}>
                        <Edit2 size={16} /> Editar
                      </button>
                      <button className="btn btn-secondary btn-sm delete-btn" style={{ flex: 1 }} onClick={() => handleDeleteReel(reel)}>
                        <Trash2 size={16} /> Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <PackageOpen size={48} className="empty-icon text-secondary" />
            <h3>Nenhuma bobina encontrada</h3>
            <p>Tente ajustar os filtros ou fazer uma nova busca.</p>
          </div>
        )}
      </div>

      {editingReel && (
        <ReelEditModal
          isOpen={!!editingReel}
          reel={editingReel}
          onClose={() => setEditingReel(null)}
          onSave={(status, remaining) => {
            updateReelStatus(editingReel.id, status, remaining);
            setEditingReel(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Excluir Bobina"
        message={`Deseja realmente excluir a bobina #${deleteConfirm?.uvpacId} (${deleteConfirm?.materialCode})? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
      />
    </div>
  );
}

function ReelEditModal({
  isOpen,
  reel,
  onClose,
  onSave
}: {
  isOpen: boolean;
  reel: Reel;
  onClose: () => void;
  onSave: (status: ReelStatus, remaining: number) => void;
}) {
  const [status, setStatus] = useState<ReelStatus>(reel.status);
  const [remainingMeters, setRemainingMeters] = useState(reel.remainingMeters.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalMeters = Number(remainingMeters);
    if (status === 'esgotado') finalMeters = 0;
    if (status === 'disponivel') finalMeters = reel.linearMeters; // Reset option if mistakenly marked

    onSave(status, finalMeters);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>Atualizar Bobina #{reel.uvpacId}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="reel-info-summary">
            <p><strong>Material:</strong> {reel.materialCode}</p>
            <p><strong>Metragem Original:</strong> {reel.linearMeters} m</p>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={e => {
              const val = e.target.value as ReelStatus;
              setStatus(val);
              if (val === 'esgotado') setRemainingMeters('0');
              if (val === 'disponivel') setRemainingMeters(reel.linearMeters.toString());
            }}>
              <option value="disponivel">Disponível (Não iniciada)</option>
              <option value="em_uso">Em Uso (Gasta parcialmente)</option>
              <option value="esgotado">Esgotado (Finalizada)</option>
            </select>
          </div>

          {status === 'em_uso' && (
            <div className="form-group">
              <label>Metragem Restante (m) *</label>
              <input
                type="number"
                step="0.1"
                max={reel.linearMeters}
                min="0.1"
                required
                value={remainingMeters}
                onChange={e => setRemainingMeters(e.target.value)}
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
