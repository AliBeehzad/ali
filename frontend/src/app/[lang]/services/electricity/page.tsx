'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Service {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
}

export default function ElectricityServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      // Filter for Electricity category
      const electricityServices = data.filter((s: Service) => s.category === 'Electricity');
      setServices(electricityServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => '⚡';
  const getColor = () => 'text-yellow-600';

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="text-7xl mb-4">⚡</div>
          <h1 className="text-5xl font-bold mb-4">Electrical Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Professional electrical installations and maintenance for industrial and commercial facilities
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              <p className="mt-2 text-gray-600">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No Electrical Services Yet</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We're currently updating our electrical services. Please check back soon or contact us for immediate inquiries.
              </p>
              <Link
                href="/contact"
                className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition inline-flex items-center"
              >
                Contact Us
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className={`text-4xl mb-3 ${getColor()}`}>{getIcon()}</div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-600 transition">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                    <span className="text-yellow-600 font-semibold inline-flex items-center group-hover:underline">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Our Electrical Expertise</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">High-Voltage Systems</h3>
              <p className="text-gray-600">Installation and maintenance of high-voltage electrical systems</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Industrial Maintenance</h3>
              <p className="text-gray-600">24/7 emergency repair and preventive maintenance services</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">☀️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Renewable Energy</h3>
              <p className="text-gray-600">Solar and wind power installation and integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Need Electrical Services?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact our electrical team for professional installation and maintenance
          </p>
          <Link
            href="/contact"
            className="bg-yellow-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-700 transition inline-flex items-center"
          >
            Get a Quote
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}