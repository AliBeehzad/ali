'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Project {
  _id: string;
  title: string;
  slug: string;
  client: string;
  location: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  images: { url: string }[];
  featuredImage: string;
  projectValue?: string;
  testimonial?: {
    clientName: string;
    clientPosition: string;
    content: string;
    rating?: number;
  };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (params.slug) {
      fetchProject();
    }
  }, [params.slug]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/by-slug/${params.slug}`);
      
      if (!res.ok) {
        throw new Error('Project not found');
      }
      
      const data = await res.json();
      setProject(data);
      setSelectedImage(data.featuredImage);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Construction': return 'bg-blue-600';
      case 'Logistics': return 'bg-green-600';
      case 'Electricity': return 'bg-yellow-600';
      case 'Mining': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Project Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || "The project you're looking for doesn't exist."}
          </p>
          <Link 
            href="/portfolio" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const categoryColor = getCategoryColor(project.category);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px]">
        <img
          src={selectedImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl">
              <div className="flex gap-3 mb-4">
                <span className={`${categoryColor} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                  {project.category}
                </span>
                {project.projectValue && (
                  <span className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm">
                    {project.projectValue}
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-gray-200 mb-2">{project.client}</p>
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.location}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Thumbnails */}
      {project.images && project.images.length > 0 && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex gap-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedImage(project.featuredImage)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === project.featuredImage ? 'border-blue-600' : 'border-transparent'
                }`}
              >
                <img src={project.featuredImage} alt="Featured" className="w-full h-full object-cover" />
              </button>
              {project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image.url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === image.url ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={image.url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Details */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-8">{project.description}</p>

                {project.challenge && (
                  <>
                    <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
                    <p className="text-gray-700 mb-8">{project.challenge}</p>
                  </>
                )}

                {project.solution && (
                  <>
                    <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                    <p className="text-gray-700 mb-8">{project.solution}</p>
                  </>
                )}

                {project.results && project.results.length > 0 && (
                  <>
                    <h3 className="text-2xl font-bold mb-4">Key Results</h3>
                    <ul className="space-y-3">
                      {project.results.map((result, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
                <h3 className="text-2xl font-bold mb-6">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Client</div>
                    <div className="font-semibold text-lg">{project.client}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-semibold">{project.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-semibold">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm text-white ${categoryColor}`}>
                        {project.category}
                      </span>
                    </div>
                  </div>
                  {project.projectValue && (
                    <div>
                      <div className="text-sm text-gray-500">Project Value</div>
                      <div className="font-semibold text-blue-600">{project.projectValue}</div>
                    </div>
                  )}
                </div>

                {project.testimonial && (
                  <div className="mt-8 pt-8 border-t">
                    <h4 className="font-semibold mb-2">Client Testimonial</h4>
                    <p className="text-gray-600 italic">"{project.testimonial.content}"</p>
                    <div className="mt-2">
                      <p className="font-medium">{project.testimonial.clientName}</p>
                      <p className="text-sm text-gray-500">{project.testimonial.clientPosition}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-3">
                  <Link
                    href="/contact"
                    className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Discuss Similar Project
                  </Link>
                  <Link
                    href="/portfolio"
                    className="block w-full bg-gray-100 text-gray-700 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Back to Portfolio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}