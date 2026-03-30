import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Services() {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [attendeesMap, setAttendeesMap] = useState({});
  const [dateMap, setDateMap] = useState({});
  const [selectedCategoryState, setSelectedCategoryState] = useState("ALL");

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedCategoryState(selectedCategory);
    } else {
      setSelectedCategoryState("ALL");
    }
  }, [selectedCategory]);

  const filteredServices =
    selectedCategoryState === "ALL"
      ? services
      : services.filter((s) => s.category === selectedCategoryState);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        : {};

      const response = await axios.get("http://localhost:8081/services", config);
      setServices(response.data);
    } catch (error) {
      setMessage("Failed to load services");
      setMessageType("error");
    }
  };

  const handleBook = async (serviceId) => {
    const customerId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");
    const attendees = attendeesMap[serviceId];
    const eventDate = dateMap[serviceId];

    if (role !== "CUSTOMER") {
      setMessage("Only customers can book services");
      setMessageType("error");
      return;
    }

    if (!attendees) {
      setMessage("Please enter attendees");
      setMessageType("error");
      return;
    }

    if (!eventDate) {
      setMessage("Please select event date");
      setMessageType("error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8081/bookings",
        {
          attendees: parseInt(attendees),
          eventDate: `${eventDate}T10:00:00`,
          customer: { id: parseInt(customerId) },
          service: { id: serviceId }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Booking request sent!");
      setMessageType("success");

      setAttendeesMap({
        ...attendeesMap,
        [serviceId]: ""
      });

      setDateMap({
        ...dateMap,
        [serviceId]: ""
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Booking failed");
      setMessageType("error");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">
        {selectedCategoryState === "ALL"
          ? "Explore Services"
          : `${selectedCategoryState} Services`}
      </h2>

      <p className="page-subtitle">
        Browse services and book vendors for your event.
      </p>

      {message && (
        <p style={{ color: messageType === "error" ? "red" : "green" }}>
          {message}
        </p>
      )}

      <div className="category-filters">
        <button onClick={() => setSelectedCategoryState("ALL")}>All</button>
        <button onClick={() => setSelectedCategoryState("VENUE")}>Venue</button>
        <button onClick={() => setSelectedCategoryState("CATERING")}>Catering</button>
        <button onClick={() => setSelectedCategoryState("MUSIC")}>Music</button>
        <button onClick={() => setSelectedCategoryState("DECORATION")}>Decoration</button>
        <button onClick={() => setSelectedCategoryState("ENTERTAINMENT")}>Entertainment</button>
        <button onClick={() => setSelectedCategoryState("EVENT_PLANNING")}>Event Planning</button>
      </div>

      <div className="card-grid">
        {filteredServices.map((s) => (
          <div key={s.id} className="event-card event-ui-card">
            <div className="event-card-header">
              <h3>{s.serviceName}</h3>
              <span className="event-price-badge">₹{s.price}</span>
            </div>

            <div className="event-details">
              <p><strong>Category:</strong> {s.category}</p>
              <p><strong>Vendor:</strong> {s.vendor?.name}</p>
              <p><strong>Description:</strong> {s.description}</p>
              {s.location && (
  <p><strong>Location:</strong> {s.location.name}, {s.location.address}</p>
)}
            </div>

            {s.category === "VENUE" ? (
              <button
                className="button"
                style={{ marginTop: "10px", width: "100%" }}
                onClick={() => navigate("/book-venue")}
              >
                Book Venue
              </button>
            ) : (
              <div className="booking-section">
                <input
                  type="date"
                  className="input"
                  value={dateMap[s.id] || ""}
                  onChange={(e) =>
                    setDateMap({
                      ...dateMap,
                      [s.id]: e.target.value
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Enter attendees"
                  className="input"
                  min="1"
                  value={attendeesMap[s.id] || ""}
                  onChange={(e) =>
                    setAttendeesMap({
                      ...attendeesMap,
                      [s.id]: e.target.value
                    })
                  }
                />

                <button
                  className="button book-btn"
                  onClick={() => handleBook(s.id)}
                >
                  Request Booking
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;