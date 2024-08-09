import Image from "next/image";
import "./Home.css"; // Import the CSS file for styling

export default function Home() {
  return (
    <main className="main-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          The Ultimate Invoice App
        </h1>
        <p className="hero-description">
          Simplify your invoicing process and get paid faster with our easy-to-use app.
        </p>
        <div className="button-group">
          <a href="#features" className="btn btn-primary">
            View Templates
          </a>
          <a href="#download" className="btn btn-secondary">
            Get Started
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="feature-item">
          <h2 className="feature-title">Easy Invoicing</h2>
          <p>Create and send invoices in minutes.</p>
        </div>
        <div className="feature-item">
          <h2 className="feature-title">Track Payments</h2>
          <p>Keep track of paid and unpaid invoices.</p>
        </div>
        <div className="feature-item">
          <h2 className="feature-title">Get Paid Faster</h2>
          <p>Accept online payments directly through the app.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-item">
            <p className="testimonial-quote">"This app has revolutionized my business!"</p>
            <p className="testimonial-author">- Alex, Small Business Owner</p>
          </div>
          <div className="testimonial-item">
            <p className="testimonial-quote">"Invoicing has never been easier."</p>
            <p className="testimonial-author">- Sam, Freelancer</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="download" className="cta-section">
        <h2 className="cta-title">Download the App Today</h2>
        <div className="button-group">
          <a href="#" className="btn btn-primary">
            Google Play
          </a>
        </div>
      </section>
    </main>
  );
}
