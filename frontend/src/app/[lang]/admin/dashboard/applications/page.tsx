'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Application {
  _id: string;
  careerId: {
    _id: string;
    title: string;
    department: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: {
    url: string;
    filename: string;
  };
  coverLetter?: string;
  experience: number;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
}

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [jobs, setJobs] = useState<any[]>([]);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/careers');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(`Application marked as ${status}`);
        fetchApplications();
        setViewingApplication(null);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Application deleted successfully');
        fetchApplications();
        setViewingApplication(null);
      } else {
        alert('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (selectedJob !== 'all' && app.careerId?._id !== selectedJob) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewingApplication) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setViewingApplication(null)}
          className="mb-6 text-blue-600 hover:underline inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Applications
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Application Details</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingApplication.status)}`}>
              {viewingApplication.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Full Name</div>
                  <div className="font-medium">{viewingApplication.firstName} {viewingApplication.lastName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{viewingApplication.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{viewingApplication.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Experience</div>
                  <div className="font-medium">{viewingApplication.experience} years</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Applied For</div>
                  <div className="font-medium">{viewingApplication.careerId?.title}</div>
                  <div className="text-sm text-gray-500">{viewingApplication.careerId?.department}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Applied On</div>
                  <div className="font-medium">{new Date(viewingApplication.appliedAt).toLocaleString()}</div>
                </div>
              </div>

              {viewingApplication.coverLetter && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Cover Letter</h3>
                  <p className="text-gray-700 whitespace-pre-line">{viewingApplication.coverLetter}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Resume</h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-medium">{viewingApplication.resume.filename}</p>
                      <p className="text-sm text-gray-500">Resume</p>
                    </div>
                  </div>
                  <a
                    href={viewingApplication.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Download
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Update Status</h2>
                <div className="space-y-2">
                  {['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateApplicationStatus(viewingApplication._id, status)}
                      disabled={viewingApplication.status === status}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        viewingApplication.status === status
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        status === 'pending' ? 'bg-yellow-500' :
                        status === 'reviewed' ? 'bg-blue-500' :
                        status === 'shortlisted' ? 'bg-green-500' :
                        status === 'rejected' ? 'bg-red-500' :
                        'bg-purple-500'
                      }`}></span>
                      Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => deleteApplication(viewingApplication._id)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Applications</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="all">All Jobs</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 mb-4">No applications found</p>
            {(selectedJob !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSelectedJob('all');
                  setSelectedStatus('all');
                }}
                className="text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Applicant</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Job</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Experience</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Applied</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{app.firstName} {app.lastName}</div>
                      <div className="text-sm text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{app.careerId?.title}</div>
                      <div className="text-sm text-gray-500">{app.careerId?.department}</div>
                    </td>
                    <td className="px-6 py-4">{app.experience} years</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewingApplication(app)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}