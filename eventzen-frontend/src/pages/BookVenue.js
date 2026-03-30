import { useEffect, useState } from "react";
import axios from "axios";

function BookVenue() {
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [attendees, setAttendees] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get("http://localhost:8081/services", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const venueServices = response.data.filter(
        (service) => service.category === "VENUE"
      );

      setVenues(venueServices);
    } catch (err) {
      setError("Failed to load venues");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVenueId || !bookingDate || !startTime || !endTime || !purpose || !attendees) {
      setError("Please fill all fields");
      setMessage("");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8081/bookings",
        {
          customer: { id: parseInt(userId) },
          service: { id: parseInt(selectedVenueId) },
          eventDate: bookingDate,
          startTime,
          endTime,
          purpose,
          attendees: parseInt(attendees)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("Venue booking request sent successfully");
      setError("");
      setSelectedVenueId("");
      setBookingDate("");
      setStartTime("");
      setEndTime("");
      setPurpose("");
      setAttendees("");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Failed to submit venue booking request");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Book Venue</h2>

      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <label>Select Venue</label>
          <select
            className="input"
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
          >
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.serviceName} - ₹{venue.price}
              </option>
            ))}
          </select>

          <label>Date</label>
          <input
            type="date"
            className="input"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />

          <label>Start Time</label>
          <input
            type="time"
            className="input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <label>End Time</label>
          <input
            type="time"
            className="input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <label>Purpose</label>
          <input
            type="text"
            className="input"
            placeholder="Birthday, engagement, corporate event..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />

          <label>Attendees</label>
          <input
            type="number"
            className="input"
            placeholder="Enter number of attendees"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
          />

          <button type="submit" className="button">
            Request Booking
          </button>
        </form>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}

export default BookVenue;