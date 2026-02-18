'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  isActive: boolean;
  views: number;
  applications: number;
  deadline: string;
  createdAt: string;
}

export default function CareersAdminPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    experience: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    qualifications: [''],
    benefits: [''],
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'year'
    },
    deadline: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Filter out empty array items
      const responsibilities = formData.responsibilities.filter(r => r.trim() !== '');
      const requirements = formData.requirements.filter(r => r.trim() !== '');
      const qualifications = formData.qualifications.filter(q => q.trim() !== '');
      const benefits = formData.benefits.filter(b => b.trim() !== '');

      const careerData = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        experience: formData.experience,
        description: formData.description,
        responsibilities,
        requirements,
        qualifications,
        benefits,
        salary: {
          min: formData.salary.min ? parseInt(formData.salary.min) : undefined,
          max: formData.salary.max ? parseInt(formData.salary.max) : undefined,
          currency: formData.salary.currency,
          period: formData.salary.period
        },
        deadline: formData.deadline,
      };

      const url = editingCareer 
        ? `/api/careers/${editingCareer._id}`
        : '/api/careers';
      
      const method = editingCareer ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(careerData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(editingCareer ? 'Job updated successfully!' : 'Job created successfully!');
        resetForm();
        fetchCareers();
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving career:', error);
      alert('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const res = await fetch(`/api/careers/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('Job deleted successfully!');
        fetchCareers();
      } else {
        alert(data.error || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting career:', error);
      alert('An error occurred');
    }
  };

  const handleEdit = (career: Career) => {
    fetch(`/api/careers/${career._id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          title: data.title,
          department: data.department,
          location: data.location,
          type: data.type,
          experience: data.experience || '',
          description: data.description,
          responsibilities: data.responsibilities || [''],
          requirements: data.requirements || [''],
          qualifications: data.qualifications || [''],
          benefits: data.benefits || [''],
          salary: {
            min: data.salary?.min?.toString() || '',
            max: data.salary?.max?.toString() || '',
            currency: data.salary?.currency || 'USD',
            period: data.salary?.period || 'year'
          },
          deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
        });
        setEditingCareer(career);
        setShowForm(true);
      });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: '',
      experience: '',
      description: '',
      responsibilities: [''],
      requirements: [''],
      qualifications: [''],
      benefits: [''],
      salary: {
        min: '',
        max: '',
        currency: 'USD',
        period: 'year'
      },
      deadline: '',
    });
    setEditingCareer(null);
    setShowForm(false);
  };

  const addArrayField = (field: 'responsibilities' | 'requirements' | 'qualifications' | 'benefits') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeArrayField = (field: 'responsibilities' | 'requirements' | 'qualifications' | 'benefits', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const updateArrayField = (field: 'responsibilities' | 'requirements' | 'qualifications' | 'benefits', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Careers Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? '← Back to List' : '+ Post New Job'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingCareer ? 'Edit Job' : 'Post New Job'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select department</option>
                  <option value="Construction">Construction</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Mining">Mining</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  placeholder="e.g., Houston, TX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  placeholder="e.g., 3-5 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities
              </label>
              {formData.responsibilities.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayField('responsibilities', index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="e.g., Manage construction projects"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('responsibilities', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('responsibilities')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Responsibility
              </button>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              {formData.requirements.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="e.g., Bachelor's degree"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('requirements', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('requirements')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Requirement
              </button>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Qualifications
              </label>
              {formData.qualifications.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayField('qualifications', index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="e.g., PMP Certification"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('qualifications', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('qualifications')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Qualification
              </button>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              {formData.benefits.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayField('benefits', index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="e.g., Health insurance"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('benefits', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('benefits')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Benefit
              </button>
            </div>

            {/* Salary Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Salary Information (Optional)</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min
                  </label>
                  <input
                    type="number"
                    value={formData.salary.min}
                    onChange={(e) => setFormData({
                      ...formData,
                      salary: { ...formData.salary, min: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max
                  </label>
                  <input
                    type="number"
                    value={formData.salary.max}
                    onChange={(e) => setFormData({
                      ...formData,
                      salary: { ...formData.salary, max: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="80000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.salary.currency}
                    onChange={(e) => setFormData({
                      ...formData,
                      salary: { ...formData.salary, currency: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AFG">AFG (؋)</option>
                    <option value="PKR">PKR (₨)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={formData.salary.period}
                    onChange={(e) => setFormData({
                      ...formData,
                      salary: { ...formData.salary, period: e.target.value as any }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="hour">Per Hour</option>
                    <option value="month">Per Month</option>
                    <option value="year">Per Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300"
              >
                {saving ? 'Saving...' : editingCareer ? 'Update Job' : 'Post Job'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : careers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-xl text-gray-600 mb-4">No jobs posted yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Deadline</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stats</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {careers.map((career) => (
                  <tr key={career._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{career.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(career.department)}`}>
                        {career.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">{career.location}</td>
                    <td className="px-6 py-4">{career.type}</td>
                    <td className="px-6 py-4">
                      {new Date(career.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3 text-sm">
                        <span title="Views">👁️ {career.views}</span>
                        <span title="Applications">📝 {career.applications}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(career)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(career._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                        <Link
                          href={`/admin/dashboard/applications?job=${career._id}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          Applications
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}