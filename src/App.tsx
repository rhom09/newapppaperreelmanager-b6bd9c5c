import { ImcCalculator } from './components/ImcCalculator'

function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-4 text-2xl font-bold shadow-lg">
            ⚖️
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Calculadora de IMC
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Índice de Massa Corporal — OMS
          </p>
        </div>
        <ImcCalculator />
      </div>
    </main>
  )
}

export default App
