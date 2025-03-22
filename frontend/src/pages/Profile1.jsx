import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaHome, FaSignOutAlt, FaCheckCircle, FaClock , FaMapMarkerAlt } from 'react-icons/fa';
import { FaEnvelope , FaCalendar , FaUser  } from "react-icons/fa";
import { motion } from "framer-motion";


const Profile1 = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/Login1');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/login');
      }
    };

    const fetchUserBookings = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/custom-packages/bookings', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        });
        setBookings(response.data.filter(booking => booking.email === userInfo.email));
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };

    fetchUserProfile();
    fetchUserBookings();
  }, [navigate]);

  if (!user)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="flex items-center justify-center h-screen"
      >
        <div className="text-lg font-semibold">Loading...</div>
      </motion.div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex pt-20">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-800 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-700">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-blue-400">{user.role}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Personal Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <FaEnvelope size={18} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <FaPhone size={18} />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <FaMapMarkerAlt size={18} />
                <span>{user.location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FaHome size={18} />
                <span>Home</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FaSignOutAlt size={18} />
                <span>Sign Out</span>
              </button> 
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gray-800 rounded-lg">
                <span className="text-blue-400">Premium</span>
                <span className="text-gray-400"> Member</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Total Bookings</h3>
                <FaCalendar className="text-blue-400" />
              </div>
              <p className="text-3xl font-bold mt-2">{bookings.length}</p>
              <p className="text-green-400 text-sm mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Hours Consulted</h3>
                <FaClock className="text-purple-400" />
              </div>
              <p className="text-3xl font-bold mt-2">156</p>
              <p className="text-green-400 text-sm mt-2">↑ 8% from last month</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Success Rate</h3>
                <FaUser className="text-green-400" />
              </div>
              <p className="text-3xl font-bold mt-2">98%</p>
              <p className="text-green-400 text-sm mt-2">↑ 3% from last month</p>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr 
                      key={booking._id}
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-4">{booking.selectedOptions.service}</td>
                      <td className="py-4 px-4">{new Date(booking.travelDate).toLocaleDateString()}</td>
                      <td className="py-4 px-4">{new Date(booking.travelDate).toLocaleTimeString()}</td>
                      <td className="py-4 px-4">{booking.location}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          booking.status === 'approved' 
                            ? 'bg-green-500/20 text-green-400' 
                            : booking.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {booking.status === 'approved' ? <FaCheckCircle size={14} /> : <FaClock size={14} />}
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile1;