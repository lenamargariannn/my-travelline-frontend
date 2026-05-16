import { Link } from 'react-router-dom';
import { HiGlobe, HiHeart, HiShieldCheck, HiSparkles } from 'react-icons/hi';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient py-20">
        <div className="container-main text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">About My TravelLine</h1>
          <p className="mt-4 text-xl text-primary-100 italic">Creating Timeless Memories</p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-main max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Story</h2>
          </div>
          <div className="text-secondary-600 space-y-4 leading-relaxed">
            <p>
              My TravelLine was founded with a simple yet powerful mission: to create timeless memories
              for travelers around the world. We believe that travel is more than just visiting places—it's
              about experiencing cultures, forging connections, and creating stories worth telling.
            </p>
            <p>
              Our team of passionate travel experts handcrafts every tour, ensuring that each
              experience is unique, authentic, and unforgettable. From the pristine beaches of the
              Maldives to the ancient temples of Kyoto, we bring you the world's most extraordinary
              destinations.
            </p>
            <p>
              With years of experience and a dedication to excellence, we've helped thousands of
              travelers discover their dream destinations. Let us be your guide to creating memories
              that will last a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HiGlobe, title: 'Expert Curated', desc: 'Every tour is handcrafted by travel experts with deep local knowledge.' },
              { icon: HiHeart, title: 'Personalized', desc: 'Tailored experiences designed around your preferences and travel style.' },
              { icon: HiShieldCheck, title: 'Safe & Secure', desc: '24/7 support and trusted local partners ensure your safety.' },
              { icon: HiSparkles, title: 'Unforgettable', desc: 'Unique experiences that create memories lasting a lifetime.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{item.title}</h3>
                <p className="text-sm text-secondary-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-700 text-center text-white">
        <div className="container-main">
          <h2 className="text-3xl font-heading font-bold">Ready to Start Your Journey?</h2>
          <p className="mt-4 text-primary-100 max-w-xl mx-auto">
            Let our travel experts help you plan the perfect trip.
          </p>
          <Link to="/contact" className="btn bg-white text-primary-700 hover:bg-primary-50 mt-8 font-semibold px-8 py-3 rounded-lg inline-block">
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
