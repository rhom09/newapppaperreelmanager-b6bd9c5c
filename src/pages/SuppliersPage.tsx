import { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { formatCNPJ, generatePrefixFromName } from '../utils/idGenerator';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '../components/Common/ConfirmModal';
import type { Supplier } from '../types';
import './Suppliers.css';

export function SuppliersPage() {
  const { data, addSupplier, updateSupplier, deleteSupplier } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null);

  const openAddModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteSupplier(deleteConfirm.id, true);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="suppliers-container">
      <header className="page-header suppliers-header">
        <div>
          <h1>Fornecedores</h1>
          <p className="subtitle">Gerenciamento de fornecedores e seus lotes</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          Novo Fornecedor
        </button>
      </header>

      {data.suppliers.length > 0 ? (
        <div className="suppliers-grid">
          {data.suppliers.map(supplier => {
            const supplierReelsCount = data.reels.filter(r => r.supplierId === supplier.id).length;

            return (
              <div key={supplier.id} className="card supplier-card">
                <div className="supplier-card-header">
                  <h3>{supplier.name}</h3>
                  <div className="card-actions">
                    <button className="icon-btn edit-btn" onClick={() => openEditModal(supplier)} title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(supplier.id, supplier.name)} title="Remover">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="supplier-details">
                  <p><strong>CNPJ:</strong> {formatCNPJ(supplier.cnpj)}</p>
                  <p><strong>E-mail:</strong> {supplier.email || '-'}</p>
                  <p><strong>Prefixo:</strong> <span className="supplier-prefix">{supplier.prefix}</span></p>
                </div>

                <div className="supplier-footer">
                  <Link to={`/estoque?fornecedor=${supplier.id}`} className="supplier-link">
                    <Package size={18} />
                    <span>Ver {supplierReelsCount} Bobinas</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state card">
          <Users size={48} className="empty-icon" />
          <h3>Nenhum fornecedor cadastrado</h3>
          <p>Cadastre seu primeiro fornecedor para iniciar os recebimentos.</p>
          <button className="btn btn-primary mt-4" onClick={openAddModal}>
            <Plus size={20} />
            Cadastrar Fornecedor
          </button>
        </div>
      )}

      {isModalOpen && (
        <SupplierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          supplier={editingSupplier}
          onSave={(supplierData) => {
            if (editingSupplier) {
              updateSupplier(editingSupplier.id, supplierData);
            } else {
              addSupplier(supplierData);
            }
            setIsModalOpen(false);
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Excluir Fornecedor"
        message={`Tem certeza que deseja remover o fornecedor "${deleteConfirm?.name}"? Todas as bobinas e notas fiscais associadas também serão removidas permanentemente.`}
        confirmText="Excluir"
      />
    </div>
  );
}

// Em inline por simplicidade de arquivo. Para projetos maiores pode ser extraído.
function SupplierModal({
  isOpen,
  onClose,
  supplier,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onSave: (data: any) => void
}) {
  const [name, setName] = useState(supplier?.name || '');
  const [cnpj, setCnpj] = useState(supplier?.cnpj || '');
  const [email, setEmail] = useState(supplier?.email || '');
  const [prefix, setPrefix] = useState(supplier?.prefix || '');
  const [autoPrefix, setAutoPrefix] = useState(!supplier?.prefix);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // CNPJ basic validation (must have 14 digits)
    if (cnpj.length !== 14) {
      setError('CNPJ deve conter 14 dígitos.');
      return;
    }

    setError(null);
    const finalPrefix = autoPrefix && !prefix ? generatePrefixFromName(name) : prefix;
    onSave({ name, cnpj, email, prefix: finalPrefix });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoPrefix) {
      setPrefix(generatePrefixFromName(val));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h2>{supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Nome / Razão Social *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Ex: Papéis Apice"
            />
          </div>

          <div className="form-group">
            <label>CNPJ *</label>
            <input
              id="supplier-cnpj"
              type="text"
              required
              value={formatCNPJ(cnpj)}
              onChange={e => {
                setCnpj(e.target.value.replace(/\D/g, ''));
                if (error) setError(null);
              }}
              className={error ? 'input-error' : ''}
              maxLength={18}
              placeholder="00.000.000/0000-00"
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contato@empresa.com"
            />
          </div>

          <div className="form-group">
            <div className="label-with-toggle">
              <label>Prefixo de Material</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={autoPrefix}
                  onChange={e => setAutoPrefix(e.target.checked)}
                />
                Automático
              </label>
            </div>
            <input
              type="text"
              value={prefix}
              onChange={e => {
                setPrefix(e.target.value.toUpperCase());
                setAutoPrefix(false);
              }}
              disabled={autoPrefix && name.length === 0}
              placeholder="Ex: APC"
              maxLength={5}
            />
            <small className="help-text">Prefixo usado para gerar IDs de lotes (ex: APC.F-001)</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Fornecedor</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Fallback icon for empty state if not imported above
function Users(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}
