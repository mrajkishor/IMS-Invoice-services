'use client';

import Head from 'next/head';
import '../public/assets/css/bootstrap-5.0.0-beta2.min.css';
import '../public/assets/css/LineIcons.2.0.css';
import '../public/assets/css/tiny-slider.css';
import '../public/assets/css/animate.css';
import '../public/assets/css/main.css';

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>Chalaan || Invoice App</title>
        <meta name="description" content="Chalaan is a user-friendly invoice app that helps you create and manage invoices effortlessly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/x-icon" href="/assets/img/favicon.svg" />
      </Head>

      <body>
        {/* Preloader */}
        <div className="preloader">
          <div className="loader">
            <div className="spinner">
              <div className="spinner-container">
                <div className="spinner-rotator">
                  <div className="spinner-left">
                    <div className="spinner-circle"></div>
                  </div>
                  <div className="spinner-right">
                    <div className="spinner-circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="header">
          <div className="navbar-area">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand" href="/">
                      <img src="/assets/img/logo/logo.svg" alt="Chalaan Logo" />
                    </a>
                    <button
                      className="navbar-toggler"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent"
                      aria-controls="navbarSupportedContent"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span className="toggler-icon"></span>
                      <span className="toggler-icon"></span>
                      <span className="toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                      <ul id="nav" className="navbar-nav ms-auto">
                        <li className="nav-item">
                          <a className="page-scroll active" href="#home">Home</a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#features">Features</a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#pricing">Pricing</a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#faq">FAQ</a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#contact">Contact</a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="hero-content">
                  <h1 className="wow fadeInUp" data-wow-delay=".2s">Effortless Invoicing for Your Business</h1>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    Create, manage, and send invoices easily with Chalaan. Stay on top of your finances with minimal effort.
                  </p>
                  {/* <a href="#" onClick={(e) => e.preventDefault()} className="main-btn btn-hover wow fadeInUp" data-wow-delay=".6s">Get Started</a> */}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <span className="icon"><i className="lni lni-play-store"></i></span>
                    <span className="text">GET IT ON <b>Play Store</b></span>
                  </a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-img wow fadeInUp" data-wow-delay=".5s">
                  <img src="/assets/img/hero/hero-img-1.png" alt="Invoice App Preview" className="img-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="feature-section pt-140">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-5 col-xl-6 col-lg-7">
                <div className="section-title text-center mb-30">
                  <h1 className="mb-25 wow fadeInUp" data-wow-delay=".2s">Key Features</h1>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    Discover the powerful features that make Chalaan the ideal choice for managing your business invoices.
                  </p>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-8 col-sm-10">
                <div className="single-feature">
                  <div className="icon color-1">
                    <i className="lni lni-pointer-up"></i>
                  </div>
                  <div className="content">
                    <h3>Simple Interface</h3>
                    <p>Easily navigate through the app and create invoices with just a few clicks.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-8 col-sm-10">
                <div className="single-feature">
                  <div className="icon color-2">
                    <i className="lni lni-revenue"></i>
                  </div>
                  <div className="content">
                    <h3>Automated Reminders</h3>
                    <p>Send automatic payment reminders to your clients and get paid faster.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-8 col-sm-10">
                <div className="single-feature">
                  <div className="icon color-3">
                    <i className="lni lni-files"></i>
                  </div>
                  <div className="content">
                    <h3>Customizable Templates</h3>
                    <p>Choose from a variety of professional templates to match your brand's style.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="faq-section pt-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-5 col-xl-6 col-lg-7">
                <div className="section-title text-center mb-60">
                  <h1 className="mb-25 wow fadeInUp" data-wow-delay=".2s">Frequently Asked Questions</h1>
                  <p className="mb-25 wow fadeInUp" data-wow-delay=".2s">Find answers to common questions about using Chalaan for your invoicing needs.</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="accordion faq-wrapper" id="accordionExample">
                  <div className="single-faq">
                    <button className="w-100" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      How do I create an invoice?
                    </button>
                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                      <div className="faq-content">
                        Creating an invoice is easy. Simply navigate to the 'Create Invoice' section, fill in the necessary details, and hit 'Generate'.
                      </div>
                    </div>
                  </div>
                  <div className="single-faq">
                    <button className="w-100 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Can I customize the invoice template?
                    </button>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                      <div className="faq-content">
                        Yes, Chalaan offers multiple templates that you can customize to fit your brand's identity.
                      </div>
                    </div>
                  </div>
                  <div className="single-faq">
                    <button className="w-100 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      How do I track invoice payments?
                    </button>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                      <div className="faq-content">
                        You can track payments directly within the app. Chalaan provides detailed tracking and automatic reminders for overdue payments.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="faq-image">
                  <img src="/assets/img/faq/invoice-faq-img.svg" alt="FAQ Image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="footer" className="footer">
          <div className="container">
            <div className="widget-wrapper">
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <div className="footer-widget">
                    <h3>About Chalaan</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Home</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Features</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Pricing</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Contact</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="footer-widget">
                    <h3>Support</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Help Center</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>FAQs</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="footer-widget">
                    <h3>Contact Us</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Email: support@chalaan.com</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Phone: +91-7683922389</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Address: Tarnaka, Hyderabad, IN</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="footer-widget">
                    <h3>Follow Us</h3>
                    <ul className="socials">
                      <li><a href="#" onClick={(e) => e.preventDefault()}><i className="lni lni-facebook-filled"></i></a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}><i className="lni lni-twitter-filled"></i></a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}><i className="lni lni-instagram-filled"></i></a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}><i className="lni lni-linkedin-original"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="copy-right-wrapper">
              <div className="row">
                <div className="col-md-6">
                  <div className="copy-right">
                    <p>&copy; 2024 Chalaan. All rights reserved.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="socials">
                    <ul>
                      <li><a href="#" onClick={(e) => e.preventDefault()}><i className="lni lni-facebook-filled"></i></a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}><i className="lni lni-twitter-filled"></i></a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}><i className="lni lni-instagram-filled"></i></a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}><i className="lni lni-linkedin-original"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Scroll to Top */}
        <a href="#" onClick={(e) => e.preventDefault()} className="scroll-top btn-hover">
          <i className="lni lni-chevron-up"></i>
        </a>

        {/* JavaScript Files */}
        <script src="/assets/js/bootstrap-5.0.0-beta2.min.js"></script>
        <script src="/assets/js/tiny-slider.js"></script>
        <script src="/assets/js/wow.min.js"></script>
        <script src="/assets/js/polifill.js"></script>
        <script src="/assets/js/main.js"></script>
      </body>
    </>
  );
}
