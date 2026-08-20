import { useState, createContext, useEffect } from "react";
import Home from "./modules/common/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import { getUserData } from "./api/authApi";
import ForgotPassword from "./modules/common/ForgotPassword";

// Admin
import AdminHome from "./modules/admin/AdminHome"; 
import AllUsers from "./modules/admin/AllUsers"; 
import AllPropertiesAdmin from "./modules/admin/AllProperty"; 
import AllBookingsAdmin from "./modules/admin/AllBookings"; 

// Owner
import OwnerHome from "./modules/user/owner/OwnerHome";
import AddProperty from "./modules/user/owner/AddProperty";
import AllPropertiesOwner from "./modules/user/owner/AllProperties";
import AllBookingsOwner from "./modules/user/owner/AllBookings"; 
 
// Renter
import RenterHome from "./modules/user/renter/RenterHome";
import AllPropertiesRenter from "./modules/user/renter/AllProperties"; 
import AllBookingsRenter from "./modules/user/renter/AllBookings"; 
import AllPropertiesCard from "./modules/user/AllPropertiesCards"; 

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); 
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getUserData(); 
        if(res.data.success) setUser(res.data.user);
      } catch (err) {
        console.log(err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if(loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white text-xl">Loading...</div>

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        {/* 1. Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/properties" element={<AllPropertiesCard />} /> 

        {/* 2. Owner Protected Routes */}
        <Route path="/ownerhome" element={user?.role === "owner" ? <OwnerHome /> : <Navigate to="/login" />} />
        <Route path="/add-property" element={user?.role === "owner" ? <AddProperty /> : <Navigate to="/login" />} />
        <Route path="/owner/properties" element={user?.role === "owner" ? <AllPropertiesOwner /> : <Navigate to="/login" />} />
        <Route path="/owner/bookings" element={user?.role === "owner" ? <AllBookingsOwner /> : <Navigate to="/login" />} />

        {/* 3. Renter Protected Routes */}
        <Route path="/renterhome" element={user?.role === "renter" ? <RenterHome /> : <Navigate to="/login" />} />
        <Route path="/renter/properties" element={user?.role === "renter" ? <AllPropertiesRenter /> : <Navigate to="/login" />} />
        <Route path="/renter/bookings" element={user?.role === "renter" ? <AllBookingsRenter /> : <Navigate to="/login" />} />

        {/* 4. Admin Protected Routes */}
        <Route path="/adminhome" element={user?.role === "admin" ? <AdminHome /> : <Navigate to="/login" />} />
        <Route path="/admin/users" element={user?.role === "admin" ? <AllUsers /> : <Navigate to="/login" />} />
        <Route path="/admin/properties" element={user?.role === "admin" ? <AllPropertiesAdmin /> : <Navigate to="/login" />} />
        <Route path="/admin/bookings" element={user?.role === "admin" ? <AllBookingsAdmin /> : <Navigate to="/login" />} /> {/* <- FIX KEL */}

        {/* 5. 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;