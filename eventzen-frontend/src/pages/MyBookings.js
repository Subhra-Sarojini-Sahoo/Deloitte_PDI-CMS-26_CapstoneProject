import { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attendeesMap, setAttendeesMap] = useState({});

  const fetchBookings = async () => {
    const customerId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    if (role !== "CUSTOMER") {
      setError("Only customers can view bookings");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8081/bookings/customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBookings(response.data);
      setError("");
    } catch (error) {
      setError("Failed to load bookings");
    }
  };

  const cancelBooking = async (bookingId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:8081/bookings/${bookingId}/cancel?userId=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess("Booking cancelled successfully!");
      setError("");
      fetchBookings();
    } catch (error) {
      setError(error.response?.data?.message || "Cancel failed");
      setSuccess("");
    }
  };

  const updateAttendees = async (bookingId) => {
    const userId = localStorage.getItem("userId");
    const attendees = attendeesMap[bookingId];
    const token = localStorage.getItem("token");

    if (!attendees) {
      setError("Please enter attendees");
      setSuccess("");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8081/bookings/${bookingId}/attendees?userId=${userId}&attendees=${attendees}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess("Attendees updated successfully!");
      setError("");

      setAttendeesMap({
        ...attendeesMap,
        [bookingId]: ""
      });

      fetchBookings();
    } catch (error) {
      setError(error.response?.data?.message || "Update failed");
      setSuccess("");
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
    <div className="page-container">
      <h2 className="page-title">My Bookings</h2>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <div className="card-grid">
        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="booking-card-header">
              <h3>{b.service?.serviceName}</h3>
              <span className={`status-badge ${b.status?.toLowerCase()}`}>
                {b.status}
              </span>
            </div>

            <div className="booking-details">
              <p><strong>Category:</strong> {b.service?.category}</p>
              <p><strong>Price:</strong> ₹{b.service?.price}</p>
              <p><strong>Event Date:</strong> {b.eventDate}</p>

              {b.startTime && b.endTime && (
                <p><strong>Time:</strong> {b.startTime} - {b.endTime}</p>
              )}

              <p><strong>Vendor:</strong> {b.service?.vendor?.name}</p>
              <p><strong>Attendees:</strong> {b.attendees}</p>

              {b.purpose && (
                <p><strong>Purpose:</strong> {b.purpose}</p>
              )}
            </div>

            {b.status !== "REJECTED" && (
              <div className="booking-actions">
                <input
                  type="number"
                  placeholder="Update attendees"
                  className="small-input"
                  value={attendeesMap[b.id] || ""}
                  onChange={(e) =>
                    setAttendeesMap({
                      ...attendeesMap,
                      [b.id]: e.target.value
                    })
                  }
                />

                <div className="booking-btn-row">
                  <button
                    className="small-action-btn"
                    onClick={() => updateAttendees(b.id)}
                  >
                    Update
                  </button>

                  <button
                    className="small-action-btn cancel-btn"
                    onClick={() => cancelBooking(b.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;