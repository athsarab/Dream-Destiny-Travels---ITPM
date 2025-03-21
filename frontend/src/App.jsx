import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Shared/Navbar.jsx';
import Footer from './components/Shared/Footer.jsx';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard.jsx';
import CustomPackageAdmin from './pages/CustomPackageAdmin.jsx';
import EditPackagePage from './pages/EditPackagePage.jsx';

// Client Pages
import HomePage from './pages/HomePage.jsx';
import PackagePage from './pages/PackagePage.jsx';
import CustomPackageCreate from './pages/CustomPackageCreate.jsx';

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
