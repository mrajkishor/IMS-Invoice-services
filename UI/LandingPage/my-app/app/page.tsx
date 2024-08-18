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
        <meta name="description" content="Chalaan is your go-to solution for generating, managing, and sharing invoices seamlessly." />
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
                          <a className="page-scroll" href="#feature">Features</a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#about">About</a>
                        </li>
                        {/*<li className="nav-item">
                          <a className="page-scroll" href="#testimonials">Testimonials</a>
                        </li> */}
                        <li className="nav-item">
                          <a className="page-scroll" href="#faq">FAQ</a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#footer">Contact</a>
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
                  <h1 className="wow fadeInUp" data-wow-delay=".2s">Effortless Invoice Management for Your Business</h1>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    Generate, manage, and share invoices with ease. Chalaan streamlines your invoicing process, so you can focus on growing your business.
                  </p>
                  <a href="#footer" className="main-btn btn-hover wow fadeInUp" data-wow-delay=".6s">Get Started</a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-img wow fadeInUp" data-wow-delay=".5s">
                  <img src="/assets/img/hero/invoice-app-hero.png" alt="Chalaan Invoice App" className="img-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="feature" className="feature-section pt-140">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-5 col-xl-6 col-lg-7">
                <div className="section-title text-center mb-30">
                  <h1 className="mb-25 wow fadeInUp" data-wow-delay=".2s">Powerful Features</h1>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    Chalaan comes packed with all the tools you need to manage invoices, track payments, and keep your business running smoothly.
                  </p>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-8 col-sm-10">
                <div className="single-feature">
                  <div className="icon color-1">
                    <i className="lni lni-file"></i>
                  </div>
                  <div className="content">
                    <h3>Create and Customize</h3>
                    <p>Easily create and customize invoices to fit your brand. Choose from a variety of templates and add your own logo and colors.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-8 col-sm-10">
                <div className="single-feature">
                  <div className="icon color-2">
                    <i className="lni lni-credit-cards"></i>
                  </div>
                  <div className="content">
                    <h3>Accept Payments</h3>
                    <p>Accept payments directly through your invoices. Integrated payment options make it easy for your clients to pay on time.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-8 col-sm-10">
                <div className="single-feature">
                  <div className="icon color-3">
                    <i className="lni lni-lock"></i>
                  </div>
                  <div className="content">
                    <h3>Secure & Reliable</h3>
                    <p>Your data is secure with Chalaan. We use advanced encryption to ensure that your invoices and payment information are protected.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section pt-140">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-5 col-xl-6 col-lg-7">
                <div className="section-title text-center mb-30">
                  <h1 className="mb-25 wow fadeInUp" data-wow-delay=".2s">About Chalaan</h1>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    Chalaan is a powerful, yet easy-to-use invoice management app designed for small business owners, freelancers, and shopkeepers. With Chalaan, you can quickly create, customize, and manage your invoices, ensuring you get paid on time, every time.
                  </p>
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
                  <p className="mb-25 wow fadeInUp" data-wow-delay=".2s">Got questions? We’ve got answers. Here are some of the most common questions we get about Chalaan.</p>
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
                        Creating an invoice is simple. Just select a template, add your details, and save or send it directly from the app.
                      </div>
                    </div>
                  </div>
                  <div className="single-faq">
                    <button className="w-100 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Can I track invoice payments?
                    </button>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                      <div className="faq-content">
                        Yes, Chalaan allows you to track payments, send reminders, and view payment history for each invoice.
                      </div>
                    </div>
                  </div>
                  <div className="single-faq">
                    <button className="w-100 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Is my data secure?
                    </button>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                      <div className="faq-content">
                        Absolutely. We use industry-standard encryption to protect your data at all times.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="faq-image">
                  <img src="/assets/img/faq/faq-img.svg" alt="Chalaan FAQ" />
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

                <div className="col-xl-6 col-md-6">
                  <div className="footer-widget">
                    <h3>Contact Us</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Email: mrajkishor331@gmail.com</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Phone: +91-7683922389</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Address: Tarnaka, Hyderabad, IN</a></li>
                    </ul>
                  </div>
                </div>


                <div className="col-xl-2 col-md-6">
                  <div className="footer-widget">
                    <h3>Navigation</h3>

                    <ul className="links">
                      <li><a href="#home">Home</a></li>
                      <li><a href="#feature">Features</a></li>
                      <li><a href="#about">About</a></li>
                      <li><a href="#faq">FAQ</a></li>
                    </ul>
                  </div>
                </div>


                {/* <div className="col-xl-3 col-md-6">
                  <div className="footer-widget">
                    <h3>Features</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Create & Customize</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Track Payments</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Send Reminders</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Export Data</a></li>
                    </ul>
                  </div>
                </div> */}
                <div className="col-xl-2 col-md-6">
                  <div className="footer-widget">
                    <h3>Support</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Help Center</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Contact Us</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-2 col-md-6">
                  <div className="footer-widget">
                    <h3>Download App</h3>
                    <ul className="download">
                      {/* <li>
                        <a href="#" onClick={(e) => e.preventDefault()} className='inactive-btn'>
                          <span className="icon"><i className="lni lni-apple"></i></span>
                          <span className="text">Download on the <b>App Store</b></span>
                        </a>
                      </li> */}
                      <li>
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          <span className="icon"><i className="lni lni-play-store"></i></span>
                          <span className="text">GET IT ON <b>Play Store</b></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="copy-right-wrapper">
              <div className="row">
                <div className="col-md-6">
                  <div className="copy-right">
                    <p>© Copy rights 2024 | All Rights Reserved </p>
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
