import { useEffect, useState } from "react";
import axios from "axios";

function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const url =
        role === "ADMIN"
          ? "http://localhost:8081/bookings"
          : `http://localhost:8081/bookings/vendor/${userId}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBookings(response.data);
      setError("");
    } catch (error) {
      setError("Failed to load bookings");
      setSuccess("");
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `http://localhost:8081/bookings/${bookingId}/status?vendorId=${userId}&status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(
        status === "ACCEPTED"
          ? "Booking accepted successfully!"
          : "Booking rejected successfully!"
      );
      setError("");
      fetchBookings();
    } catch (error) {
      setError(error.response?.data?.message || "Status update failed");
      setSuccess("");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">
        {role === "ADMIN" ? "All Bookings" : "Vendor Bookings"}
      </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <div className="card-grid">
        {bookings.map((b) => (
          <div key={b.id} className="event-card event-ui-card">
            <h3>{b.service?.serviceName}</h3>

            <p><strong>Customer:</strong> {b.customer?.name}</p>
            <p><strong>Category:</strong> {b.service?.category}</p>
            <p><strong>Vendor:</strong> {b.service?.vendor?.name}</p>
            <p><strong>Event Date:</strong> {b.eventDate}</p>
            <p><strong>Attendees:</strong> {b.attendees}</p>
            <p><strong>Status:</strong> {b.status}</p>

            {b.status === "PENDING" && (
              <div className="booking-action-row">
                <button
                  className="small-box-btn"
                  onClick={() => updateStatus(b.id, "ACCEPTED")}
                >
                  Accept
                </button>

                <button
                  className="small-box-btn"
                  onClick={() => updateStatus(b.id, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorBookings;