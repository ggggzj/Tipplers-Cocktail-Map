// App.tsx — Main Application Router
// This is the top-level component that defines navigation between pages.
// - Uses React Router to handle page switching.
// - Defines two main routes:
//   "/" → DiscoverPage (homepage with bar recommendations)
//   "/bars/:id" → BarDetailPage (detailed info for a single bar).
// - Applies global layout and theming across the app.

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiscoverPage from './pages/DiscoverPage';
import BarDetailPage from './pages/BarDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-paper bg-paper-grain font-sans text-ink">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/bars/:id" element={<BarDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;