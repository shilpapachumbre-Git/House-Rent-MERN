import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // IMP: Fallback takla. Jar .env nahi milala tari backend hit hoil
  const API_URL = import.meta.env.VITE_API_URL || "https://house-rent-mern.onrender.com";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/users`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if(res.data.success){ 
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log("Error fetching users:", error.response?.data?.message);
      alert(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (userid, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/admin/handlestatus`, 
        { userid, status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if(res.data.success){
        alert(res.data.message); 
        fetchUsers(); 
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  if(loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4">No users found</td></tr>
            ) : users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-700">
                <td className="py-2 px-4 border-b border-gray-700">{user.name}</td>
                <td className="py-2 px-4 border-b border-gray-700">{user.email}</td>
                <td className="py-2 px-4 border-b border-gray-700 capitalize">
                  {user.role === 'renter' ? 'Renter' : user.role === 'owner' ? 'Owner' : 'Admin'} 
                </td> 
                <td className={`py-2 px-4 border-b border-gray-700 text-center font-medium ${
                  user.isGranted ? "text-green-400" : "text-red-400"
                }`}>
                  {user.isGranted ? "Granted" : "Not Granted"}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-center">
                  {user.role === "owner" && !user.isGranted && ( 
                    <button onClick={() => handleStatus(user._id, true)} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">Grant</button>
                  )}
                  {user.role === "owner" && user.isGranted && ( 
                    <button onClick={() => handleStatus(user._id, false)} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">Ungrant</button>
                  )}
                  {user.role !== "owner" && <span className="text-gray-500">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;