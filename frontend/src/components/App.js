import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ...existing imports...
import CustomPackageAdmin from './pages/CustomPackageAdmin';
import CustomPackageCreate from './pages/CustomPackageCreate';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* ...existing routes... */}
            <Route path="/admin/custom-packages" element={<CustomPackageAdmin />} />
            <Route path="/custom-package" element={<CustomPackageCreate />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
