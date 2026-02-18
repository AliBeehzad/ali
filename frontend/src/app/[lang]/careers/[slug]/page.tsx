'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits?: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  deadline: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchJob();
    }
  }, [params.slug]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/careers/by-slug/${params.slug}`);
      
      if (!res.ok) {
        throw new Error('Job not found');
      }
      
      const data = await res.json();
      setJob(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentColor = (department: string) => {
    switch(department) {
      case 'Construction': return 'bg-blue-600';
      case 'Logistics': return 'bg-green-600';
      case 'Electricity': return 'bg-yellow-600';
      case 'Mining': return 'bg-red-600';
      case 'Corporate': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getDepartmentLightColor = (department: string) => {
    switch(department) {
      case 'Construction': return 'bg-blue-100 text-blue-800';
      case 'Logistics': return 'bg-green-100 text-green-800';
      case 'Electricity': return 'bg-yellow-100 text-yellow-800';
      case 'Mining': return 'bg-red-100 text-red-800';
      case 'Corporate': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (salary?: Career['salary']) => {
    if (!salary || !salary.min || !salary.max) return null;
    
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AFG': '؋',
      'PKR': '₨',
      'INR': '₹',
      'AED': 'د.إ'
    };
    
    const symbol = currencySymbols[salary.currency] || salary.currency;
    const periodText = salary.period === 'hour' ? 'hr' : salary.period === 'month' ? 'mo' : 'yr';
    
    return `${symbol}${salary.min.toLocaleString()} - ${symbol}${salary.max.toLocaleString()}/${periodText}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Job Not Found</h1>
          <p className="text-gray-600 mb-8">
            The job you're looking for doesn't exist or may have been removed.
          </p>
          <Link 
            href="/careers" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  const departmentColor = getDepartmentColor(job.department);
  const departmentLightColor = getDepartmentLightColor(job.department);
  const salaryDisplay = formatSalary(job.salary);
  const isDeadlinePassed = new Date(job.deadline) < new Date();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`${departmentColor} text-white py-16`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`${departmentLightColor} px-4 py-1 rounded-full text-sm font-medium`}>
                {job.department}
              </span>
              <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm">
                {job.type}
              </span>
              <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{job.title}</h1>
            <p className="text-xl text-white/90 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {job.experience} experience required
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-4">Preferred Qualifications</h2>
                  <ul className="space-y-3">
                    {job.qualifications.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Job Info & Apply */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                <h3 className="text-xl font-bold mb-6">Job Information</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Department</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${departmentLightColor}`}>
                      {job.department}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Job Type</span>
                    <span className="font-medium">{job.type}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Experience</span>
                    <span className="font-medium">{job.experience}</span>
                  </div>
                  
                  {salaryDisplay && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Salary Range</span>
                      <span className="font-semibold text-green-600">{salaryDisplay}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Deadline</span>
                    <span className={`font-medium ${isDeadlinePassed ? 'text-red-600' : ''}`}>
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {job.benefits && job.benefits.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-500 mb-2">Benefits</div>
                      <div className="space-y-1">
                        {job.benefits.map((benefit, index) => (
                          <div key={index} className="text-sm text-gray-700 flex items-start">
                            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  <Link
                    href={isDeadlinePassed ? '#' : `/careers/${job.slug}/apply`}
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
                      isDeadlinePassed
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={(e) => isDeadlinePassed && e.preventDefault()}
                  >
                    {isDeadlinePassed ? 'Applications Closed' : 'Apply Now'}
                  </Link>
                  
                  <Link
                    href="/careers"
                    className="block w-full bg-gray-100 text-gray-700 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Back to All Jobs
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