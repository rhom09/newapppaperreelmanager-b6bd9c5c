import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/Layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { ReceivingPage } from './pages/ReceivingPage';
import { InventoryPage } from './pages/InventoryPage';
import { NfHistoryPage } from './pages/NfHistoryPage';

// Stub Pages

function App() {
  return (
    <AppProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/fornecedores" element={<SuppliersPage />} />
            <Route path="/recebimento" element={<ReceivingPage />} />
            <Route path="/estoque" element={<InventoryPage />} />
            <Route path="/notas-fiscais" element={<NfHistoryPage />} />
          </Routes>
        </AppShell>
      </Router>
    </AppProvider>
  );
}

export default App;
