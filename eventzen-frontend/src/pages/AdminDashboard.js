import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalLocations, setTotalLocations] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    try {
       const usersRes = await axios.get("http://localhost:8081/users", { headers });

      const users = Array.isArray(usersRes.data)
      ? usersRes.data
      : usersRes.data?.data || [];

console.log("Users:", users);

      setTotalUsers(users.length);
      setTotalCustomers(
        users.filter((u) => u.role?.toUpperCase() === "CUSTOMER").length
      );
      setTotalVendors(
        users.filter((u) => u.role?.toUpperCase() === "VENDOR").length
      );
    } catch (error) {
      console.log("Users fetch failed:", error.response?.data || error.message);
    }

    try {
      const servicesRes = await axios.get("http://localhost:8081/services", { headers });
      setTotalServices((servicesRes.data || []).length);
    } catch (error) {
      console.log("Services fetch failed:", error.response?.data || error.message);
    }

    try {
      const bookingsRes = await axios.get("http://localhost:8081/bookings", { headers });
      setTotalBookings((bookingsRes.data || []).length);
    } catch (error) {
      console.log("Bookings fetch failed:", error.response?.data || error.message);
    }

    try {
      const locationsRes = await axios.get("http://localhost:8081/locations", { headers });
      setTotalLocations((locationsRes.data || []).length);
    } catch (error) {
      console.log("Locations fetch failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <h2 className="logo">EventZen</h2>

        <Link to="/admin-dashboard" className="sidebar-link active">Dashboard</Link>
        <Link to="/manage-users" className="sidebar-link">Manage Users</Link>
        <Link to="/manage-services" className="sidebar-link">Manage Services</Link>
        <Link to="/manage-locations" className="sidebar-link">Manage Locations</Link>
        <Link to="/bookings" className="sidebar-link">Bookings</Link>
        <Link to="/profile" className="sidebar-link">Profile</Link>
      </div>

      <div className="dashboard-content">
        <h2 className="page-title">Admin Dashboard</h2>
        <p>Welcome back{userName ? `, ${userName}` : ""}!</p>
        <p className="page-subtitle">Monitor users, services, bookings and locations</p>

        <div className="dashboard-cards">
          <div className="dash-card">
            <h4>Total Users</h4>
            <p>{totalUsers}</p>
          </div>

          <div className="dash-card">
            <h4>Total Customers</h4>
            <p>{totalCustomers}</p>
          </div>

          <div className="dash-card">
            <h4>Total Vendors</h4>
            <p>{totalVendors}</p>
          </div>

          <div className="dash-card">
            <h4>Total Services</h4>
            <p>{totalServices}</p>
          </div>

          <div className="dash-card">
            <h4>Total Bookings</h4>
            <p>{totalBookings}</p>
          </div>

          <div className="dash-card">
            <h4>Total Locations</h4>
            <p>{totalLocations}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;