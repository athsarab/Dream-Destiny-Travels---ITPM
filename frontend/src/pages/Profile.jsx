import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaHome, FaSignOutAlt, FaCheckCircle, FaClock } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
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

    fetchUserProfile();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>
        <ul>
          <li className="mb-4 flex items-center">
            <FaHome className="mr-2" />
            <a href="/">Home</a>
          </li>
          <li className="mb-4 flex items-center">
            <FaUserCircle className="mr-2" />
            <a href="/profile">Profile</a>
          </li>
          <li className="mb-4 flex items-center">
            <FaSignOutAlt className="mr-2" />
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <FaUserCircle className="text-6xl mr-4" />
          <div>
            <h2 className="text-3xl font-bold">Welcome, {user.username}</h2>
            <p className="text-gray-400">{user.role}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Customer Details</h3>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Location:</strong> {user.location}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2">Booking ID</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;