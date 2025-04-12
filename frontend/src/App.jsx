import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Shared/Navbar.jsx';
import Footer from './components/Shared/Footer.jsx';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard.jsx';
import CustomPackageAdmin from './pages/CustomPackageAdmin.jsx';
import EditPackagePage from './pages/EditPackagePage.jsx';
import EmployeeManagement from './pages/EmployeeManagement.jsx';

// Client Pages
import HomePage from './pages/HomePage.jsx';
import PackagePage from './pages/PackagePage.jsx';
import CustomPackageCreate from './pages/CustomPackageCreate.jsx';

// Employee Manager Pages
import EmployeeManagerDashboard from './pages/EmployeeManagerDashboard.jsx';
import AddEmployeeForm from './pages/AddEmployeeForm.jsx';
import EmployeeList from './pages/EmployeeList.jsx';
import HotelManagement from './pages/HotelManagement.jsx';
import HotelList from './pages/HotelList.jsx';
import VehicleManagement from './pages/VehicleManagement.jsx';
import VehicleList from './pages/VehicleList.jsx';
import AddHotel from './pages/AddHotel.jsx';
import EditHotel from './pages/EditHotel.jsx';

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
            <Route path="/admin/resources" element={<EmployeeManagement />} />

            {/* Employee Manager Routes */}
            <Route path="/employee-manager" element={<EmployeeManagerDashboard />} />
            <Route path="/employee-manager/add-employee" element={<AddEmployeeForm />} />
            <Route path="/employee-manager/employee-list" element={<EmployeeList />} />
            <Route path="/employee-manager/edit-employee/:id" element={<AddEmployeeForm />} />
            <Route path="/employee-manager/hotels" element={<HotelManagement />} />
            <Route path="/employee-manager/hotels-list" element={<HotelList />} />
            <Route path="/employee-manager/edit-hotel/:id" element={<EditHotel />} />
            <Route path="/employee-manager/vehicles" element={<VehicleManagement />} />
            <Route path="/employee-manager/vehicles-list" element={<VehicleList />} />
            <Route path="/employee-manager/edit-vehicle/:id" element={<VehicleManagement />} />
            <Route path="/employee-manager/add-hotel" element={<AddHotel />} />
            
            {/* Redirect edit hotel requests to hotel management page */}
            <Route path="/employee-manager/edit-hotel/:id" element={<EditHotel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
