import { useEffect, useState } from "react";
import axios from "axios";

function ManageServices() {
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    locationId: ""
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    fetchServices();
    fetchLocations();
  }, []);

  const fetchServices = async () => {
    try {
      const url =
        role === "ADMIN"
          ? "http://localhost:8081/services"
          : `http://localhost:8081/services/vendor/${userId}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setServices(response.data);
      setError("");
    } catch {
      setError("Failed to load services");
      setSuccess("");
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/locations?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLocations(response.data);
      setError("");
    } catch {
      setError("Failed to load locations");
    }
  };

  const resetForm = () => {
    setForm({
      serviceName: "",
      category: "",
      description: "",
      price: "",
      locationId: ""
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (service) => {
    setForm({
      serviceName: service.serviceName || "",
      category: service.category || "",
      description: service.description || "",
      price: service.price || "",
      locationId: service.location?.id || ""
    });
    setEditingId(service.id);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      serviceName: form.serviceName,
      category: form.category,
      description: form.description,
      price: parseInt(form.price),
      availabilityStatus: "AVAILABLE",
      vendor: { id: parseInt(userId) },
      location:
        form.category === "VENUE" && form.locationId
          ? { id: parseInt(form.locationId) }
          : null
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8081/services/${editingId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccess("Service updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8081/services",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccess("Service created successfully!");
      }

      setError("");
      resetForm();
      fetchServices();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          (editingId ? "Update failed" : "Create failed")
      );
      setSuccess("");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8081/services/${id}?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess("Service deleted");
      setError("");

      if (editingId === id) {
        resetForm();
      }

      fetchServices();
    } catch {
      setError("Delete failed");
      setSuccess("");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">My Services</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit} className="form-box">
        <input
          name="serviceName"
          placeholder="Service Name"
          className="input"
          value={form.serviceName}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="input"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="VENUE">Venue</option>
          <option value="CATERING">Catering</option>
          <option value="MUSIC">Music</option>
          <option value="DECORATION">Decoration</option>
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="EVENT_PLANNING">Event Planning</option>
          <option value="BIRTHDAY_PLANNER">Birthday Planner</option>
        </select>

        {form.category === "VENUE" && (
          <select
            name="locationId"
            className="input"
            value={form.locationId}
            onChange={handleChange}
            required
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} - {loc.address}
              </option>
            ))}
          </select>
        )}

        <textarea
          name="description"
          placeholder="Description"
          className="input"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="input"
          value={form.price}
          onChange={handleChange}
          required
        />

        <div className="booking-action-row">
          <button className="button">
            {editingId ? "Update Service" : "Add Service"}
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

      <div className="card-grid">
        {services.map((s) => (
          <div key={s.id} className="event-card event-ui-card">
            <h3>{s.serviceName}</h3>

            <div className="event-details">
              <p><strong>Category:</strong> {s.category}</p>
              <p><strong>Price:</strong> ₹{s.price}</p>
              <p><strong>Description:</strong> {s.description}</p>
              {s.location && (
                <p><strong>Location:</strong> {s.location.name}</p>
              )}
              <p><strong>Status:</strong> {s.availabilityStatus}</p>
            </div>

            <div className="booking-action-row">
              <button
                className="small-box-btn"
                onClick={() => handleEdit(s)}
              >
                Edit
              </button>

              <button
                className="small-box-btn"
                onClick={() => handleDelete(s.id)}
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

export default ManageServices;