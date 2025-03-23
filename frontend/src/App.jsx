import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import EditHotel from './pages/EditHotel.jsx';

// Login and Register
import Login from './pages/Login1.jsx';
import Register from './pages/Signup1.jsx';

// User Profile
import Profile1 from './pages/Profile1.jsx'; // Updated import name

// Blog Page
import Blog from './pages/Blog.jsx';

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
            <Route path="/employee-manager/vehicles" element={<EmployeeManagerDashboard />} />

            {/* Login and Register */}  
            <Route path="/Login1" element={<Login />} />
            <Route path="/Signup1" element={<Register />} />

            {/* User Profile */}
            <Route path="/profile1" element={<Profile1 />} /> {/* Changed from Profile to Profile1 */}

            {/* Blog Page */}
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
