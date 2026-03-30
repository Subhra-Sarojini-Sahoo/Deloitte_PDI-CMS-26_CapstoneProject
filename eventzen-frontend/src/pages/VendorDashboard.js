import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function VendorDashboard() {
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [totalServices, setTotalServices] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [acceptedBookings, setAcceptedBookings] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // SERVICES
      const serviceRes = await axios.get(
        `http://localhost:8081/services/vendor/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTotalServices(serviceRes.data.length);

      // BOOKINGS
      const bookingRes = await axios.get(
        `http://localhost:8081/bookings/vendor/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const bookings = bookingRes.data;

      setTotalBookings(bookings.length);

      setPendingBookings(
        bookings.filter((b) => b.status === "PENDING").length
      );

      setAcceptedBookings(
        bookings.filter((b) => b.status === "ACCEPTED").length
      );

    } catch {
      console.log("Failed to load dashboard data");
    }
  };

  return (
    <div className="dashboard-layout">

      <div className="sidebar">
  <h2 className="logo">EventZen</h2>

  <Link to="/vendor-dashboard" className="sidebar-link active">Dashboard</Link>
  <Link to="/manage-services" className="sidebar-link">My Services</Link>
  <Link to="/manage-locations" className="sidebar-link">Manage Locations</Link>
  <Link to="/manage-budget" className="sidebar-link">Manage Budget</Link>
  <Link to="/vendor-bookings" className="sidebar-link">Bookings</Link>
  <Link to="/profile" className="sidebar-link">Profile</Link>
</div>

      
      <div className="dashboard-content">
        <h2 className="page-title">Dashboard</h2>

        <p>
          Welcome back{userName ? `, ${userName}` : ""}!
        </p>
        <p className="page-subtitle">
          Manage your services and bookings
        </p>

        
        <div className="dashboard-cards">

          <div className="dash-card">
            <h4>Total Services</h4>
            <p>{totalServices}</p>
          </div>

          <div className="dash-card">
            <h4>Total Bookings</h4>
            <p>{totalBookings}</p>
          </div>

          <div className="dash-card">
            <h4>Pending Requests</h4>
            <p>{pendingBookings}</p>
          </div>

          <div className="dash-card">
            <h4>Accepted Bookings</h4>
            <p>{acceptedBookings}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default VendorDashboard;