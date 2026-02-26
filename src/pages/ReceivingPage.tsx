import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { generateNextMaterialCode } from '../utils/idGenerator';
import { CheckCircle2, AlertCircle, ArrowRight, Save } from 'lucide-react';
import './Receiving.css';

export function ReceivingPage() {
  const { data, addReceiving } = useAppData();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [supplierId, setSupplierId] = useState('');
  const [nfNumber, setNfNumber] = useState('');
  const [totalGrossWeight, setTotalGrossWeight] = useState('');
  const [totalLinearMeters, setTotalLinearMeters] = useState('');
  const [totalVolumes, setTotalVolumes] = useState('');

  // Step 2 State
  const [reelsInput, setReelsInput] = useState<any[]>([]);

  // Derived state for validation
  const supplier = data.suppliers.find(s => s.id === supplierId);
  const supplierReelsCount = useMemo(() => {
    return data.reels.filter(r => r.supplierId === supplierId).length;
  }, [data.reels, supplierId]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !nfNumber || Number(totalVolumes) <= 0) return;

    // Initialize reels based on volumes
    const initialReels = Array.from({ length: Number(totalVolumes) }).map((_, idx) => ({
      tempId: Math.random().toString(),
      materialCode: supplier ? generateNextMaterialCode(supplier.prefix, supplierReelsCount + idx) : '',
      clientCode: '',
      grammage: '',
      width: '',
      linearMeters: '',
      netWeight: '',
      grossWeight: '',
      status: 'disponivel' as const,
      remainingMeters: 0 // Will sync with linearMeters on save
    }));

    setReelsInput(initialReels);
    setStep(2);
  };

  const updateReel = (tempId: string, field: string, value: any) => {
    setReelsInput(prev => prev.map(r => r.tempId === tempId ? { ...r, [field]: value } : r));
  };

  const currentTotalWeight = reelsInput.reduce((acc, curr) => acc + Number(curr.grossWeight || 0), 0);
  const currentTotalMeters = reelsInput.reduce((acc, curr) => acc + Number(curr.linearMeters || 0), 0);

  const targetWeight = Number(totalGrossWeight);
  const targetMeters = Number(totalLinearMeters);

  const isValidWeight = Math.abs(currentTotalWeight - targetWeight) < 1; // 1kg margin
  const isValidMeters = Math.abs(currentTotalMeters - targetMeters) < 1; // 1m margin
  const isAllFilled = reelsInput.every(r => r.clientCode && r.grammage && r.width && r.linearMeters && r.netWeight && r.grossWeight);

  const canSubmit = isValidWeight && isValidMeters && isAllFilled;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const nf = {
      number: nfNumber,
      supplierId,
      totalGrossWeight: targetWeight,
      totalLinearMeters: targetMeters,
      totalVolumes: Number(totalVolumes)
    };

    const reelsToSave = reelsInput.map(r => ({
      materialCode: r.materialCode,
      width: Number(r.width),
      linearMeters: Number(r.linearMeters),
      remainingMeters: Number(r.linearMeters),
      grammage: Number(r.grammage),
      netWeight: Number(r.netWeight),
      grossWeight: Number(r.grossWeight),
      clientCode: String(r.clientCode),
      status: r.status
    }));

    addReceiving(nf, reelsToSave);
    navigate('/estoque');
  };

  if (data.suppliers.length === 0) {
    return (
      <div className="receiving-container">
        <header className="page-header">
          <h1>Recebimento (Novo Lote)</h1>
        </header>
        <div className="empty-state card">
          <AlertCircle size={48} className="empty-icon text-warning" />
          <h3>Nenhum fornecedor cadastrado</h3>
          <p>Para registrar uma entrada, é necessário ter fornecedores cadastrados.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/fornecedores')}>
            Cadastrar Fornecedor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="receiving-container">
      <header className="page-header">
        <h1>Recebimento (Novo Lote)</h1>
        <p className="subtitle">Cadastre bobinas recebidas (Etapa {step} de 2)</p>
      </header>

      {step === 1 && (
        <div className="card form-card step-card animate-fade-in">
          <h2>1. Dados da Nota Fiscal</h2>
          <form onSubmit={handleNextStep} className="nf-form grid-form">
            <div className="form-group">
              <label>Fornecedor (Origem) *</label>
              <select required value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                <option value="" disabled>Selecione um fornecedor</option>
                {data.suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.prefix})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Número da NF *</label>
              <input type="text" required value={nfNumber} onChange={e => setNfNumber(e.target.value)} placeholder="000.000.000" />
            </div>

            <div className="form-group half-width">
              <label>Peso Bruto Total (kg) *</label>
              <input type="number" step="0.01" required value={totalGrossWeight} onChange={e => setTotalGrossWeight(e.target.value)} />
            </div>

            <div className="form-group half-width">
              <label>Metragem Total (m) *</label>
              <input type="number" step="0.1" required value={totalLinearMeters} onChange={e => setTotalLinearMeters(e.target.value)} />
            </div>

            <div className="form-group half-width">
              <label>Quantidade de Volumes (Bobinas) *</label>
              <input type="number" min="1" max="100" required value={totalVolumes} onChange={e => setTotalVolumes(e.target.value)} />
            </div>

            <div className="form-actions full-width">
              <button type="submit" className="btn btn-primary">
                Continuar <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="step-2-container animate-fade-in">
          <div className="validation-panel card sticky-top">
            <div className="validation-header">
              <h3>Validação do Lote</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>Voltar</button>
            </div>

            <div className="validation-stats">
              <div className={`stat-item ${isValidWeight ? 'valid' : 'invalid'}`}>
                <span className="stat-label">Peso Bruto:</span>
                <span className="stat-value">{currentTotalWeight.toFixed(2)} / {targetWeight.toFixed(2)} kg</span>
                {isValidWeight ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </div>
              <div className={`stat-item ${isValidMeters ? 'valid' : 'invalid'}`}>
                <span className="stat-label">Metragem:</span>
                <span className="stat-value">{currentTotalMeters.toFixed(2)} / {targetMeters.toFixed(2)} m</span>
                {isValidMeters ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </div>
            </div>

            {!isAllFilled && <p className="validation-error">Preencha todos os campos obrigatórios em todas as bobinas.</p>}

            <button
              className="btn btn-primary full-width mt-4 submit-lot-btn"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              <Save size={18} />
              Finalizar e Salvar Lote
            </button>
          </div>

          <div className="reels-list">
            {reelsInput.map((reel, index) => (
              <div key={reel.tempId} className="reel-form-card card">
                <div className="reel-header">
                  <h4>Bobina #{index + 1}</h4>
                  <div className="reel-badges">
                    <span className="badge material-badge">{reel.materialCode}</span>
                  </div>
                </div>

                <div className="reel-grid">
                  <div className="form-group">
                    <label>Código Cliente *</label>
                    <input type="text" value={reel.clientCode} onChange={e => updateReel(reel.tempId, 'clientCode', e.target.value)} placeholder="Ex: KLABIN-123" />
                  </div>
                  <div className="form-group row-cols-3">
                    <div>
                      <label>Gramatura (g/m²) *</label>
                      <input type="number" value={reel.grammage} onChange={e => updateReel(reel.tempId, 'grammage', e.target.value)} />
                    </div>
                    <div>
                      <label>Largura (mm) *</label>
                      <input type="number" value={reel.width} onChange={e => updateReel(reel.tempId, 'width', e.target.value)} />
                    </div>
                    <div>
                      <label>Metros (m) *</label>
                      <input type="number" step="0.1" value={reel.linearMeters} onChange={e => updateReel(reel.tempId, 'linearMeters', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group row-cols-2">
                    <div>
                      <label>Peso Líq. (kg) *</label>
                      <input type="number" step="0.01" value={reel.netWeight} onChange={e => updateReel(reel.tempId, 'netWeight', e.target.value)} />
                    </div>
                    <div>
                      <label>Peso Bruto (kg) *</label>
                      <input type="number" step="0.01" value={reel.grossWeight} onChange={e => updateReel(reel.tempId, 'grossWeight', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
