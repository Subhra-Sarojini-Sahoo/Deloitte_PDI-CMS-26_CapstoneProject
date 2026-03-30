import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/users/${userId}?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(res.data);
    } catch {
      setError("Failed to load profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="page-container">
      <h2 className="page-title">My Profile</h2>

      {error && <p className="error-text">{error}</p>}

      {user && (
        <div className="profile-card">
          <div className="profile-row">
            <span>Name</span>
            <span>{user.name}</span>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <span>{user.email}</span>
          </div>

          <div className="profile-row">
            <span>Phone</span>
            <span>{user.phone || "Not provided"}</span>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <span>{user.role}</span>
          </div>

          <div className="profile-actions">
            <button
              className="button logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;