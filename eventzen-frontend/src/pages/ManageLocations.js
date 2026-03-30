import { useEffect, useState } from "react";
import axios from "axios";

function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    capacity: ""
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/locations?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocations(response.data);
    } catch {
      setMessage("Failed to load locations");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      address: "",
      capacity: ""
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (loc) => {
    setForm({
      name: loc.name || "",
      address: loc.address || "",
      capacity: loc.capacity || ""
    });
    setEditingId(loc.id);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      address: form.address,
      capacity: parseInt(form.capacity),
      vendor: { id: parseInt(userId) }
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8081/locations/${editingId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMessage("Location updated successfully");
      } else {
        await axios.post(
          "http://localhost:8081/locations",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMessage("Location created successfully");
      }

      resetForm();
      fetchLocations();
    } catch {
      setMessage(editingId ? "Update failed" : "Create failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8081/locations/${id}?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("Location deleted");

      if (editingId === id) {
        resetForm();
      }

      fetchLocations();
    } catch {
      setMessage("Delete failed");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Manage Locations</h2>

      {message && <p className="center-text">{message}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="form-box">
        <input
          name="name"
          placeholder="Location Name"
          className="input"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Address"
          className="input"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          className="input"
          value={form.capacity}
          onChange={handleChange}
          required
        />

        <div className="booking-action-row">
          <button className="button">
            {editingId ? "Update Location" : "Create Location"}
          </button>

          {editingId && (
            <button
              type="button"
              className="small-box-btn"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="card-grid">
        {locations
          
          .map((loc) => (
            <div key={loc.id} className="event-card event-ui-card">
              <h3>{loc.name}</h3>

              <div className="event-details">
                <p><strong>Address:</strong> {loc.address}</p>
                <p><strong>Capacity:</strong> {loc.capacity}</p>
              </div>

              <div className="booking-action-row">
                <button
                  className="small-box-btn"
                  onClick={() => handleEdit(loc)}
                >
                  Edit
                </button>

                <button
                  className="small-box-btn"
                  onClick={() => handleDelete(loc.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ManageLocations;