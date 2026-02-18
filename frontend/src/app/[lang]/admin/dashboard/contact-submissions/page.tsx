'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Submission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`/api/contact?status=${filter}`);
      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        fetchSubmissions();
        if (selectedSubmission?._id === id) {
          setSelectedSubmission({ ...selectedSubmission, status: status as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const res = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchSubmissions();
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'unread': return 'bg-yellow-100 text-yellow-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedSubmission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedSubmission(null)}
          className="mb-6 text-blue-600 hover:underline inline-flex items-center"
        >
          ← Back to All Submissions
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Message from {selectedSubmission.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSubmission.status)}`}>
              {selectedSubmission.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Sender Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{selectedSubmission.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">
                    <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </div>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">
                      <a href={`tel:${selectedSubmission.phone}`} className="text-blue-600 hover:underline">
                        {selectedSubmission.phone}
                      </a>
                    </div>
                  </div>
                )}
                {selectedSubmission.service && (
                  <div>
                    <div className="text-sm text-gray-500">Service Interested</div>
                    <div className="font-medium">{selectedSubmission.service}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">Received</div>
                  <div className="font-medium">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">Technical Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><span className="font-medium">IP Address:</span> {selectedSubmission.ipAddress || 'Unknown'}</div>
                  <div><span className="font-medium">User Agent:</span> {selectedSubmission.userAgent || 'Unknown'}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Message</h2>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {selectedSubmission.message}
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-semibold">Update Status</h3>
                <div className="flex gap-2">
                  {['unread', 'read', 'replied'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedSubmission._id, status)}
                      disabled={selectedSubmission.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedSubmission.status === status
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Mark as {status}
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: Your message to STRATERRA`}
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Reply via Email
                  </a>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => deleteSubmission(selectedSubmission._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete Submission
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
        <h1 className="text-3xl font-bold">Contact Form Submissions</h1>
        <Link
          href={`/${lang}/admin/dashboard`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unread' ? 'bg-yellow-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'replied' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Replied
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 mb-4">No submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Service</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Received</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{sub.name}</td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${sub.email}`} className="text-blue-600 hover:underline">
                        {sub.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">{sub.service || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
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