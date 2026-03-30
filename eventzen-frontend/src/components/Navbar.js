import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getDashboardRoute = () => {
    if (role === "CUSTOMER") return "/customer-dashboard";
    if (role === "VENDOR") return "/vendor-dashboard";
    if (role === "ADMIN") return "/admin-dashboard";
    return "/";
  };

  return (
    <nav className="navbar">
      <h2>EventZen</h2>

      <div>
        <Link to="/" className="nav-link">Home</Link>

        {!token && (
          <>
            <Link to="/events" className="nav-link">Explore</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        {token && (
          <>
            <Link to={getDashboardRoute()} className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;