import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import CustomPackageAdmin from './pages/CustomPackageAdmin';
import EditPackagePage from './pages/EditPackagePage';

// Client Pages
import HomePage from './pages/HomePage';
import PackagePage from './pages/PackagePage';
import CustomPackageCreate from './pages/CustomPackageCreate';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/package/:id" element={<PackagePage />} />
            <Route path="/custom-package" element={<CustomPackageCreate />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/custom-packages" element={<CustomPackageAdmin />} />
            <Route path="/admin/edit/:id" element={<EditPackagePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
