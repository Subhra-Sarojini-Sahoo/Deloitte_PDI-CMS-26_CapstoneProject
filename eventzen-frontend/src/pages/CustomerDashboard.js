import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function CustomerDashboard() {
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [acceptedBookings, setAcceptedBookings] = useState(0);
  const [rejectedBookings, setRejectedBookings] = useState(0);



  const fetchBookings = async () => {
    try {
      const response = await axios.get(
          `http://localhost:8081/bookings/customer/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
      );

      console.log("Customer bookings:", response.data);

      const bookings = response.data;

      setTotalBookings(bookings.length);
      setPendingBookings(
          bookings.filter((b) => b.status === "PENDING").length
      );
      setAcceptedBookings(
          bookings.filter((b) => b.status === "ACCEPTED").length
      );
      setRejectedBookings(
          bookings.filter((b) => b.status === "REJECTED").length
      );
    } catch (error) {
      console.log("Failed to load dashboard data", error);
    }
  };

  useEffect(() => {
    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-layout">

      <div className="sidebar">
        <h2 className="logo">EventZen</h2>

        <Link to="/customer-dashboard" className="sidebar-link active">Dashboard</Link>
        <Link to="/services" className="sidebar-link">Explore Services</Link>
        <Link to="/my-bookings" className="sidebar-link">My Bookings</Link>
         <Link to="/book-venue" className="sidebar-link">Book Venue</Link>
        <Link to="/profile" className="sidebar-link">Profile</Link>
      </div>

      <div className="dashboard-content">
        <h2 className="page-title">Dashboard</h2>
        <p>Welcome back{userName ? `, ${userName}` : ""}!</p>
        <p className="page-subtitle">Explore services and manage your bookings</p>

        <div className="dashboard-cards">
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

          <div className="dash-card">
            <h4>Rejected Bookings</h4>
            <p>{rejectedBookings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;