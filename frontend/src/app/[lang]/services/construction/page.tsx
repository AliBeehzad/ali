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

export default function ConstructionServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      console.log('All services:', data); // Debug: see what categories are coming
      
      // Filter for Construction category - make sure case matches
      const constructionServices = data.filter((s: Service) => 
        s.category === 'Construction' || s.category === 'construction'
      );
      
      console.log('Filtered construction services:', constructionServices);
      setServices(constructionServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="text-7xl mb-4">🏗️</div>
          <h1 className="text-5xl font-bold mb-4">Construction Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Professional construction solutions for industrial and commercial projects
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">🏗️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No Construction Services Yet</h2>
              <p className="text-xl text-gray-600 mb-4">
                We're currently updating our construction services.
              </p>
              <p className="text-gray-500 mb-8">
                Please check back later or contact us for immediate inquiries about construction projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center justify-center"
                >
                  Contact Us
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/services"
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition inline-flex items-center justify-center"
                >
                  View All Services
                </Link>
              </div>
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
                    <div className="text-4xl mb-3 text-blue-600">🏗️</div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                    <span className="text-blue-600 font-semibold inline-flex items-center group-hover:underline">
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
    </main>
  );
}