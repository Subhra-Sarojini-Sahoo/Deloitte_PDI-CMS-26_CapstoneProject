import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import MyBookings from "./pages/MyBookings";
import ManageLocations from "./pages/ManageLocations";
import ManageServices from "./pages/ManageServices";
import ManageUsers from "./pages/ManageUsers";
import "./styles/styles.css";
import VendorDashboard from "./pages/VendorDashboard";
import VendorBookings from "./pages/VendorBookings";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ManageBudget from "./pages/ManageBudget";
import BookVenue from "./pages/BookVenue";
import Profile from "./pages/Profile";

function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-locations" element={<ManageLocations />} />
        <Route path="/manage-services" element={<ManageServices />} />
        <Route path="/manage-budget" element={<ManageBudget />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/vendor-bookings" element={<VendorBookings />} />
        <Route path="/book-venue" element={<BookVenue />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<VendorBookings />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;