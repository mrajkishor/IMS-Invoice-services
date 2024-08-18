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
        <title>Chalaan || Invoice app</title>
        <meta name="description" content="" />
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
                      <img src="/assets/img/logo/logo.svg" alt="Logo" />

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
                          <a href="#0">About</a>
                        </li>
                        <li className="nav-item">
                          <a href="#0">Testimonial</a>
                        </li>
                        <li className="nav-item">
                          <a href="#0">Explore</a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#faq">FAQ</a>
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
                  <h1 className="wow fadeInUp" data-wow-delay=".2s">Complete Health-Care Solution App For Everyone</h1>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    Lorem ipsum dolor sit amet, consetetur sadipscing eserewd diam nonumy eirmod tempor invidunt ut labore.
                  </p>
                  <a href="#" onClick={(e) => e.preventDefault()} className="main-btn btn-hover wow fadeInUp" data-wow-delay=".6s">Get Started</a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-img wow fadeInUp" data-wow-delay=".5s">
                  <img src="/assets/img/hero/hero-img-1.png" alt="" className="img-1" />
                  <img src="/assets/img/hero/hero-img-2.png" alt="" className="img-2" />
                  <img src="/assets/img/hero/hero-img-3.png" alt="" className="img-3" />
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
                  <h1 className="mb-25 wow fadeInUp" data-wow-delay=".2s">Awesome Feature</h1>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    Lorem ipsum dolor samet consetetur sadipscing elitr, serewd diam nonumy eirmod tempor invidunt ut labore.
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
                    <h3>Easy To Use</h3>
                    <p>Lorem ipsum dolor samet consetet sadip scing elitr serewd diam nonumy eirmod tempor invidunt ut labore.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-8 col-sm-10">
                <div className="single-feature">
                  <div className="icon color-2">
                    <i className="lni lni-revenue"></i>
                  </div>
                  <div className="content">
                    <h3>Save Your Money</h3>
                    <p>Lorem ipsum dolor samet consetet sadip scing elitr serewd diam nonumy eirmod tempor invidunt ut labore.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-8 col-sm-10">
                <div className="single-feature">
                  <div className="icon color-3">
                    <i className="lni lni-sthethoscope"></i>
                  </div>
                  <div className="content">
                    <h3>24 Online Treatment</h3>
                    <p>Lorem ipsum dolor samet consetet sadip scing elitr serewd diam nonumy eirmod tempor invidunt ut labore.</p>
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
                  <h1 className="mb-25 wow fadeInUp" data-wow-delay=".2s">Frequently Asked Queries</h1>
                  <p className="mb-25 wow fadeInUp" data-wow-delay=".2s">Lorem ipsum dolor samet consenter discing elitr, serewd diam nonumy eirmod tempor invidunt.</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="accordion faq-wrapper" id="accordionExample">
                  <div className="single-faq">
                    <button className="w-100" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Can I make an online appointment?
                    </button>
                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                      <div className="faq-content">
                        Lorem ipsum dolor samet consenter discing elitr, serewd diam nonumy eirmod tempor invidunt.Lorem ipsum colewort samet consenter discing elitr.
                      </div>
                    </div>
                  </div>
                  <div className="single-faq">
                    <button className="w-100 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      How can I Select a best doctor?
                    </button>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                      <div className="faq-content">
                        Lorem ipsum dolor samet consenter discing elitr, serewd diam nonumy eirmod tempor invidunt.Lorem ipsum colewort samet consenter discing elitr.
                      </div>
                    </div>
                  </div>
                  <div className="single-faq">
                    <button className="w-100 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      How can i edit my personal information?
                    </button>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                      <div className="faq-content">
                        Lorem ipsum dolor samet consenter discing elitr, serewd diam nonumy eirmod tempor invidunt.Lorem ipsum colewort samet consenter discing elitr.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="faq-image">
                  <img src="/assets/img/faq/faq-img.svg" alt="" />
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
                <div className="col-xl-2 col-md-6">
                  <div className="footer-widget">
                    <h3>About Us</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Home</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Features</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Explore</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Testimonials</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="footer-widget">
                    <h3>Features</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Easy to use</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Work every device</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Always up to date</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Track your device</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="footer-widget">
                    <h3>Support</h3>
                    <ul className="links">
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Accounting Software</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
                      <li><a href="#" onClick={(e) => e.preventDefault()}>Accessibility</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="footer-widget">
                    <h3>Download App</h3>
                    <ul className="download">
                      <li>
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          <span className="icon"><i className="lni lni-apple"></i></span>
                          <span className="text">Download on the <b>App Store</b></span>
                        </a>
                      </li>
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
                    <p>Design and Developed by <a href="https://uideck.com" rel="nofollow" target="_blank">UIdeck</a></p>
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
