'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  deadline: string;
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await fetch('/api/careers');
      const data = await res.json();
      setCareers(data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['All', 'Construction', 'Logistics', 'Electricity', 'Mining', 'Corporate'];
  const types = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];

  const filteredCareers = careers.filter(career => {
    const matchesDepartment = selectedDepartment === 'All' || career.department === selectedDepartment;
    const matchesType = selectedType === 'All' || career.type === selectedType;
    return matchesDepartment && matchesType;
  });

  const getDepartmentColor = (department: string) => {
    switch(department) {
      case 'Construction': return 'bg-blue-100 text-blue-800';
      case 'Logistics': return 'bg-green-100 text-green-800';
      case 'Electricity': return 'bg-yellow-100 text-yellow-800';
      case 'Mining': return 'bg-red-100 text-red-800';
      case 'Corporate': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Build your career with STRATERRA. We're looking for talented individuals who share our passion for excellence.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="w-full md:w-auto">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-auto">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading jobs...</p>
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No Jobs Found</h2>
              <p className="text-xl text-gray-600 mb-8">
                {selectedDepartment !== 'All' || selectedType !== 'All'
                  ? 'No jobs match your filters. Try adjusting your criteria.'
                  : 'No job openings at the moment. Please check back later.'}
              </p>
              {(selectedDepartment !== 'All' || selectedType !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedDepartment('All');
                    setSelectedType('All');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {filteredCareers.map((job) => {
                const deadlinePassed = isDeadlinePassed(job.deadline);
                return (
                  <div
                    key={job._id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition ${
                      deadlinePassed ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(job.department)}`}>
                              {job.department}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              📍 {job.location}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              ⏰ {job.type}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              💼 {job.experience}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {job.description}
                          </p>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Posted {new Date(job.deadline).toLocaleDateString()}</span>
                            {deadlinePassed && (
                              <span className="ml-3 text-red-600 font-medium">
                                Deadline Passed
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Link
                          href={deadlinePassed ? '#' : `/careers/${job.slug}`}
                          className={`px-6 py-3 rounded-lg font-semibold transition ${
                            deadlinePassed
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          onClick={(e) => deadlinePassed && e.preventDefault()}
                        >
                          {deadlinePassed ? 'Closed' : 'Apply Now'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}