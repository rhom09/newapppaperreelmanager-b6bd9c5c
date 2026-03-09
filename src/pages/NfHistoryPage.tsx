import { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Search, Edit2, Package, Calendar, Tag, FileText, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '../components/Common/ConfirmModal';
import './NfHistory.css';
import type { NotaFiscal } from '../types';

export function NfHistoryPage() {
    const { data, updateNotaFiscal, deleteNotaFiscal } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingNf, setEditingNf] = useState<NotaFiscal | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<NotaFiscal | null>(null);

    const filteredNfs = useMemo(() => {
        return data.notasFiscais.filter(nf => {
            const supplier = data.suppliers.find(s => s.id === nf.supplierId);
            const term = searchTerm.toLowerCase();
            return (
                nf.number.toLowerCase().includes(term) ||
                (supplier?.name.toLowerCase().includes(term) ?? false)
            );
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [data.notasFiscais, data.suppliers, searchTerm]);

    const handleUpdateNf = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingNf) {
            updateNotaFiscal(editingNf.id, {
                number: editingNf.number,
                totalGrossWeight: editingNf.totalGrossWeight,
                totalLinearMeters: editingNf.totalLinearMeters,
                totalVolumes: editingNf.totalVolumes
            });
            setEditingNf(null);
        }
    };

    const handleDeleteNf = (nf: NotaFiscal) => {
        setDeleteConfirm(nf);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteNotaFiscal(deleteConfirm.id, true);
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="nf-history-page">
            <header className="nf-history-header">
                <h1>Histórico de Notas Fiscais</h1>
                <div className="nf-history-actions">
                    <div className="search-container">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por NF ou Fornecedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="data-table-container">
                <table className="data-table desktop-only">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>NF Nº</th>
                            <th>Fornecedor</th>
                            <th>Volumes</th>
                            <th>Peso Total</th>
                            <th>Metragem Total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredNfs.map(nf => {
                            const supplier = data.suppliers.find(s => s.id === nf.supplierId);
                            return (
                                <tr key={nf.id}>
                                    <td>{new Date(nf.createdAt).toLocaleDateString('pt-BR')}</td>
                                    <td><span className="mono">{nf.number}</span></td>
                                    <td>{supplier?.name ?? 'Desconhecido'}</td>
                                    <td>{nf.totalVolumes}</td>
                                    <td>{nf.totalGrossWeight.toLocaleString('pt-BR')} kg</td>
                                    <td>{nf.totalLinearMeters.toLocaleString('pt-BR')} m</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="icon-btn edit-btn"
                                                title="Editar"
                                                onClick={() => setEditingNf(nf)}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <Link
                                                to={`/estoque?search=${nf.number}`}
                                                className="icon-btn view-btn"
                                                title="Ver Bobinas"
                                            >
                                                <Package size={18} />
                                            </Link>
                                            <button
                                                className="icon-btn delete-btn"
                                                title="Excluir NF"
                                                onClick={() => handleDeleteNf(nf)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="card-list mobile-only">
                    {filteredNfs.map(nf => {
                        const supplier = data.suppliers.find(s => s.id === nf.supplierId);
                        return (
                            <div key={nf.id} className="mobile-card">
                                <div className="card-header">
                                    <div className="card-title">
                                        <FileText size={18} className="accent" />
                                        <span>NF {nf.number}</span>
                                    </div>
                                    <div className="card-actions">
                                        <button onClick={() => setEditingNf(nf)} className="icon-btn edit-btn">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteNf(nf)} className="icon-btn delete-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="card-info">
                                        <div className="info-item">
                                            <Calendar size={14} />
                                            <span>{new Date(nf.createdAt).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="info-item">
                                            <Tag size={14} />
                                            <span>{supplier?.name}</span>
                                        </div>
                                    </div>
                                    <div className="card-stats">
                                        <div className="stat">
                                            <label>Volumes</label>
                                            <span>{nf.totalVolumes}</span>
                                        </div>
                                        <div className="stat">
                                            <label>Peso</label>
                                            <span>{nf.totalGrossWeight.toLocaleString('pt-BR')}kg</span>
                                        </div>
                                        <div className="stat">
                                            <label>Metragem</label>
                                            <span>{nf.totalLinearMeters.toLocaleString('pt-BR')}m</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link to={`/estoque?fornecedor=${nf.supplierId}&search=${nf.number}`} className="btn btn-secondary full-width">
                                        <Package size={16} /> Ver Bobinas
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {editingNf && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Editar Nota Fiscal</h2>
                            <button className="close-btn" onClick={() => setEditingNf(null)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdateNf}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Número da NF</label>
                                    <input
                                        type="text"
                                        value={editingNf.number}
                                        onChange={e => setEditingNf({ ...editingNf, number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Peso Bruto Total (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editingNf.totalGrossWeight}
                                        onChange={e => setEditingNf({ ...editingNf, totalGrossWeight: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Metragem Total (m)</label>
                                    <input
                                        type="number"
                                        value={editingNf.totalLinearMeters}
                                        onChange={e => setEditingNf({ ...editingNf, totalLinearMeters: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Qtd. Volumes</label>
                                    <input
                                        type="number"
                                        value={editingNf.totalVolumes}
                                        onChange={e => setEditingNf({ ...editingNf, totalVolumes: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setEditingNf(null)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
                title="Excluir Nota Fiscal"
                message={`Deseja remover a Nota Fiscal ${deleteConfirm?.number}? Isso também removerá permanentemente todas as bobinas associadas.`}
                confirmText="Excluir"
            />
        </div>
    );
}

// Fixed import of X icon which was missing from lucide-react imports above
import { X } from 'lucide-react';
