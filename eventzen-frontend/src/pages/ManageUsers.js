import { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const currentUserId = parseInt(localStorage.getItem("userId"));

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/users?userId=${currentUserId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data || []);
            setError("");
        } catch (error) {
            setError("Failed to load users");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:8081/users/${id}?userId=${currentUserId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            fetchUsers();
        } catch (error) {
            setError("Delete failed");
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Manage Users</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="card-grid">
                {users.map((u) => (
                    <div key={u.id} className="event-card event-ui-card">
                        <h3>{u.name || "No Name"}</h3>
                        <p><strong>Email:</strong> {u.email}</p>
                        <p><strong>Role:</strong> {u.role}</p>

                        {u.role !== "ADMIN" && u.id !== currentUserId && (
                            <button
                                className="small-box-btn"
                                onClick={() => handleDelete(u.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageUsers;