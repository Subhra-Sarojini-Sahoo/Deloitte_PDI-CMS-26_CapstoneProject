import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="home-hero">
        <div className="hero-content">
          <h1>Make Every Event Effortless with EventZen</h1>
          <p>
            Discover venues, book services, and manage your events seamlessly in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/services" className="hero-btn">Explore Services</Link>
            <Link to="/register" className="hero-btn secondary">Get Started</Link>
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="showcase-section">
        <p className="showcase-label">Explore</p>
        <h2 className="showcase-title">What you can organize</h2>
        <p className="showcase-subtitle">Find the right tools for your event</p>

        <div className="explore-layout">
          <div className="explore-card small">
            <div className="explore-image">
              <img src="/images/venue.jpg" alt="Venues" />
            </div>
            <div className="explore-content">
              <p className="card-tag">Venues</p>
              <h3>Book spaces</h3>
              <p>Reserve the perfect location</p>
              <Link to="/services?category=VENUE" className="card-link">Browse</Link>
            </div>
          </div>

          <div className="explore-card small">
            <div className="explore-image">
              <img src="/images/catering.jpg" alt="Catering" />
            </div>
            <div className="explore-content">
              <p className="card-tag">Catering</p>
              <h3>Arrange food service</h3>
              <p>Find caterers</p>
              <Link to="/services?category=CATERING" className="card-link">Vendors</Link>
            </div>
          </div>

          <div className="explore-card wide">
            <div className="explore-image large">
              <img src="/images/discover.jpg" alt="Discover" />
            </div>
            <div className="explore-content wide-content">
              <p className="card-tag">Connect with event professionals</p>
              <h3>Discover</h3>
              <p>View all categories</p>
              <Link to="/services" className="card-link">Explore</Link>
            </div>
          </div>
        </div>
      </section>

        {/* HOW IT WORKS */}
<section className="showcase-section">
  <p className="showcase-label">Process</p>
  <h2 className="showcase-title">How EventZen Works</h2>
  <p className="showcase-subtitle">
    Plan your event in simple steps
  </p>

  <div className="explore-layout">
    <div className="explore-card small">
      <div className="explore-image">
        <img src="/images/wedding.jpg" alt="Choose event" />
      </div>
      <div className="explore-content">
        <p className="card-tag">Step 1</p>
        <h3>Choose Event Type</h3>
        <p>Select wedding, birthday, corporate, or custom event.</p>
      </div>
    </div>

    <div className="explore-card small">
      <div className="explore-image">
        <img src="/images/corporate.jpg" alt="Book services" />
      </div>
      <div className="explore-content">
        <p className="card-tag">Step 2</p>
        <h3>Book Services</h3>
        <p>Reserve venue, catering, decor, photography, and music.</p>
      </div>
    </div>

    <div className="explore-card wide">
      <div className="explore-image large">
        <img src="/images/birthday.jpg" alt="Track and enjoy" />
      </div>
      <div className="explore-content wide-content">
        <p className="card-tag">Step 3</p>
        <h3>Track & Enjoy</h3>
        <p>
          Monitor booking status, vendor confirmations, and enjoy the event stress-free.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* CTA BANNER */}
      <section className="planning-banner">
        <div className="planning-overlay">
          <h2>Ready to begin planning</h2>
          <p>Join thousands organizing events with EventZen</p>
          {/* <div className="planning-buttons">
            <Link to="/register" className="planning-btn light">Get Started</Link>
            <Link to="/services" className="planning-btn dark">Learn More</Link>
          </div> */}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="modern-footer">
        <div className="footer-newsletter">
          <h2 className="footer-logo">EventZen</h2>
          
        </div>

        <div className="footer-links">
          <div>
            <h4>Vendor</h4> 
            <p>Dashboard</p> 
            <p>Manage Services</p>
             <p>Bookings</p>
          </div>

          <div>
           <h4>General</h4> 
           <p>Home</p>
            <p>Login</p> 
            <p>Register</p>
          </div>

         
        </div>
      </footer>
    </div>
  );
}

export default Home;