import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import PackagePage from './pages/PackagePage';
import EditPackagePage from './pages/EditPackagePage';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/edit/:id" element={<EditPackagePage />} />
          <Route path="/package/:id" element={<PackagePage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
