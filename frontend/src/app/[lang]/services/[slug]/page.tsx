'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Service {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchService();
    }
  }, [params.slug]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the by-slug API endpoint
      const res = await fetch(`/api/services/by-slug/${params.slug}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Service not found');
        }
        throw new Error('Failed to fetch service');
      }
      
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get category color for styling
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Construction': return 'bg-blue-600';
      case 'Logistics': return 'bg-green-600';
      case 'Electricity': return 'bg-yellow-600';
      case 'Mining': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getCategoryLightColor = (category: string) => {
    switch(category) {
      case 'Construction': return 'bg-blue-100 text-blue-800';
      case 'Logistics': return 'bg-green-100 text-green-800';
      case 'Electricity': return 'bg-yellow-100 text-yellow-800';
      case 'Mining': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600">Loading service details...</div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Service Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || "The service you're looking for doesn't exist or may have been removed."}
          </p>
          <Link 
            href="/services" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const categoryColor = getCategoryColor(service.category);
  const categoryLightColor = getCategoryLightColor(service.category);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <section className="relative h-[60vh] min-h-[500px]">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              {/* Category Badge */}
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${categoryColor} text-white`}>
                {service.category}
              </span>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                {service.title}
              </h1>
              
              {/* Breadcrumb */}
              <div className="flex items-center justify-center text-white/80 text-sm">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/services" className="hover:text-white transition">Services</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{service.title}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Service Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-lg ${categoryColor} flex items-center justify-center text-white text-2xl mr-4`}>
                  {service.category === 'Construction' && '🏗️'}
                  {service.category === 'Logistics' && '🚚'}
                  {service.category === 'Electricity' && '⚡'}
                  {service.category === 'Mining' && '⛏️'}
                  {!['Construction', 'Logistics', 'Electricity', 'Mining'].includes(service.category) && '🛠️'}
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Service Overview</h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Features Section */}
            {service.features && service.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Key Features & Benefits</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {service.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start p-4 bg-gray-50 rounded-xl hover:shadow-md transition"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${categoryLightColor}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">{feature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Service Details</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${categoryLightColor}`}>
                      {service.category}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Service ID:</span>
                    <span className="font-medium text-gray-800">{service._id}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Slug:</span>
                    <span className="font-medium text-gray-800">{service.slug}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                      service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Why Choose This Service</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Expert team with industry experience</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Quality materials and workmanship</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">On-time project delivery</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Competitive pricing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className={`bg-gradient-to-r ${categoryColor} to-blue-800 rounded-2xl shadow-xl p-8 md:p-12 text-center`}>
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Contact our team today to discuss how our {service.title.toLowerCase()} can benefit your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center"
                >
                  Request a Quote
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/portfolio"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
                >
                  View Related Projects
                </Link>
              </div>
            </div>

            {/* Back to Services Link */}
            <div className="text-center mt-12">
              <Link
                href="/services"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}