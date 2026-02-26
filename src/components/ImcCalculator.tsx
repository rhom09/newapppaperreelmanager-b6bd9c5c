import { useState } from 'react'

type ImcCategory = {
  label: string
  color: string
  min: number
  max: number
}

const categories: ImcCategory[] = [
  { label: 'Abaixo do peso', color: 'bg-underweight', min: 0, max: 18.5 },
  { label: 'Peso normal', color: 'bg-normal', min: 18.5, max: 25 },
  { label: 'Sobrepeso', color: 'bg-overweight', min: 25, max: 30 },
  { label: 'Obesidade Grau I', color: 'bg-obese1', min: 30, max: 35 },
  { label: 'Obesidade Grau II', color: 'bg-obese2', min: 35, max: 40 },
  { label: 'Obesidade Grau III', color: 'bg-obese3', min: 40, max: 100 },
]

function getCategory(imc: number): ImcCategory {
  return categories.find(c => imc < c.max) ?? categories[categories.length - 1]
}

function getBarPercent(imc: number): number {
  return Math.min(Math.max((imc / 45) * 100, 2), 100)
}

export function ImcCalculator() {
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const calcular = () => {
    const p = parseFloat(peso.replace(',', '.'))
    const a = parseFloat(altura.replace(',', '.'))
    if (!p || !a || p <= 0 || a <= 0) return
    const alturaM = a > 3 ? a / 100 : a
    setResult(p / (alturaM * alturaM))
  }

  const limpar = () => {
    setPeso('')
    setAltura('')
    setResult(null)
  }

  const cat = result !== null ? getCategory(result) : null

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-card rounded-[var(--radius-lg)] border border-border shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Peso (kg)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ex: 72.5"
            value={peso}
            onChange={e => setPeso(e.target.value)}
            className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Altura (cm ou m)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ex: 175 ou 1.75"
            value={altura}
            onChange={e => setAltura(e.target.value)}
            className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={calcular}
            className="flex-1 py-3 rounded-[var(--radius-sm)] bg-primary text-primary-foreground font-semibold shadow hover:opacity-90 transition"
          >
            Calcular
          </button>
          <button
            onClick={limpar}
            className="px-5 py-3 rounded-[var(--radius-sm)] border border-border text-muted-foreground font-medium hover:bg-muted transition"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result !== null && cat && (
        <div className="bg-card rounded-[var(--radius-lg)] border border-border shadow-sm p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Seu IMC</p>
            <p className="text-5xl font-extrabold text-foreground tracking-tight">
              {result.toFixed(1)}
            </p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold text-white ${cat.color}`}>
              {cat.label}
            </span>
          </div>

          {/* Scale bar */}
          <div className="relative h-3 rounded-full overflow-hidden flex">
            {categories.map(c => (
              <div key={c.label} className={`flex-1 ${c.color}`} />
            ))}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-foreground rounded-full shadow"
              style={{ left: `${getBarPercent(result)}%` }}
            />
          </div>
        </div>
      )}

      {/* Reference Table */}
      <div className="bg-card rounded-[var(--radius-lg)] border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Tabela de Referência (OMS)</h3>
        </div>
        <div className="divide-y divide-border">
          {categories.map(c => (
            <div key={c.label} className="flex items-center justify-between px-5 py-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                <span className="text-foreground">{c.label}</span>
              </div>
              <span className="text-muted-foreground font-mono text-xs">
                {c.min === 0 ? `< ${c.max}` : c.max === 100 ? `≥ ${c.min}` : `${c.min} – ${c.max}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
