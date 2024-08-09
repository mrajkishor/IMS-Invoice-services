import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-10">
      {/* Hero Section */}
      <section className="text-center text-white mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          The Ultimate Invoice App
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
          Simplify your invoicing process and get paid faster with our easy-to-use app.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="#features" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105">
            View Templates
          </a>
          <a href="#download" className="bg-blue-600 border border-white px-6 py-3 rounded-full font-semibold shadow-lg text-white transition-transform transform hover:scale-105">
            Get Started
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white mb-20">
        <div className="p-8 bg-white/10 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Easy Invoicing</h2>
          <p>Create and send invoices in minutes.</p>
        </div>
        <div className="p-8 bg-white/10 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Track Payments</h2>
          <p>Keep track of paid and unpaid invoices.</p>
        </div>
        <div className="p-8 bg-white/10 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Get Paid Faster</h2>
          <p>Accept online payments directly through the app.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="text-center text-white mb-20">
        <h2 className="text-3xl font-semibold mb-8">What Our Users Say</h2>
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white/10 rounded-lg shadow-lg">
            <p className="mb-4">"This app has revolutionized my business!"</p>
            <p className="font-semibold">- Alex, Small Business Owner</p>
          </div>
          <div className="p-8 bg-white/10 rounded-lg shadow-lg">
            <p className="mb-4">"Invoicing has never been easier."</p>
            <p className="font-semibold">- Sam, Freelancer</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="download" className="text-center text-white">
        <h2 className="text-3xl font-semibold mb-8">Download the App Today</h2>
        <div className="flex justify-center space-x-4">
          {/* <a href="#" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105">
            App Store
          </a> */}
          <a href="#" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105">
            Google Play
          </a>
        </div>
      </section>
    </main>
  );
}
