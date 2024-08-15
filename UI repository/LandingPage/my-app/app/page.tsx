import Image from "next/image";
import templateImage1 from '../public/images/templates/template_1.png';
import templateImage2 from '../public/images/templates/tempalte_2.png';
import templateImage3 from '../public/images/templates/tempalte_3.png';
import templateImage4 from '../public/images/templates/template_4.png';
import appScreenshot from '../public/images/app_screenshots/sample_1.jpg';
import "./Home.css";
import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';

export default function Home() {
  return (
    <main className="main-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
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
              Download on Googlplay
            </a>
          </div>
        </div>
        <div className="hero-image-container">
          <DeviceFrameset device="iPhone 8" color="gold" >
            <Image src={appScreenshot} alt="Invoice App Screenshot" layout="responsive" />
          </DeviceFrameset>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="feature-item">
          <Image src={templateImage1} alt="Template Image" className="feature-image" layout="responsive" />
          {/* <h2 className="feature-title">Default</h2> */}
          <p>Default</p>
          {/* <hclassName="feature-title">Easy Invoicing</h2> */}
          {/* <p>Create and send invoices in minutes.</p> */}
        </div>
        <div className="feature-item">
          <Image src={templateImage2} alt="Template Image" className="feature-image" layout="responsive" />
          <p>Modern</p>
          {/* <h2 className="feature-title">Track Payments</h2>
          <p>Keep track of paid and unpaid invoices.</p> */}
        </div>
        <div className="feature-item">
          <Image src={templateImage4} alt="Template Image" className="feature-image" layout="responsive" />
          <p>Stylish</p>
          {/* <h2 className="feature-title">Get Paid Faster</h2>
          <p>Accept online payments directly through the app.</p> */}
        </div>

        <div className="feature-item">
          <Image src={templateImage3} alt="Template Image" className="feature-image" layout="responsive" />
          <p>Golden</p>
          {/* <h2 className="feature-title">Get Paid Faster</h2>
          <p>Accept online payments directly through the app.</p> */}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-item">
            <p className="testimonial-quote">&quot;This app has revolutionized my business!&quot;</p>
            <p className="testimonial-author">- Alex, Small Business Owner</p>
          </div>
          <div className="testimonial-item">
            <p className="testimonial-quote">&quot;Invoicing has never been easier.&quot;</p>
            <p className="testimonial-author">- Sam, Freelancer</p>
          </div>
        </div>
      </section>

    </main>
  );
}
