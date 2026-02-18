'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Service {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const imageFormData = new FormData();
    imageFormData.append('image', file);
    imageFormData.append('folder', 'straterra/services');

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: imageFormData,
    });

    if (!uploadRes.ok) {
      const error = await uploadRes.json();
      throw new Error(error.error || 'Image upload failed');
    }

    const uploadData = await uploadRes.json();
    return uploadData.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let imageUrl = editingService?.image || '';

      // Upload image to Cloudinary first (if new image)
      if (formData.image) {
        setUploading(true);
        imageUrl = await uploadImage(formData.image);
        setUploading(false);
      }

      // Prepare service data as JSON
      const serviceData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        imageUrl: imageUrl,
      };

      const url = editingService 
        ? `/api/services/${editingService._id}`
        : '/api/services/create';
      
      const method = editingService ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(editingService ? 'Service updated successfully!' : 'Service created successfully!');
        setFormData({ title: '', category: '', description: '', image: null });
        setEditingService(null);
        setShowForm(false);
        fetchServices();
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert(error instanceof Error ? error.message : 'Failed to save service');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('Service deleted successfully!');
        fetchServices();
      } else {
        alert(data.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('An error occurred while deleting the service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      category: service.category,
      description: service.description,
      image: null,
    });
    setShowForm(true);
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Construction': return 'bg-blue-100 text-blue-800';
      case 'Logistics': return 'bg-green-100 text-green-800';
      case 'Electricity': return 'bg-yellow-100 text-yellow-800';
      case 'Mining': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', description: '', image: null });
    setEditingService(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          {showForm ? '← Back to List' : '+ Add New Service'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {editingService ? 'Edit Service' : 'Create New Service'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                placeholder="e.g., Commercial Construction"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Select a category</option>
                <option value="Construction">Construction</option>
                <option value="Logistics">Logistics</option>
                <option value="Electricity">Electricity</option>
                <option value="Mining">Mining</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                placeholder="Describe the service in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Image {!editingService && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ 
                  ...formData, 
                  image: e.target.files ? e.target.files[0] : null 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={!editingService}
              />
              {editingService && editingService.image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={editingService.image} 
                      alt={editingService.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 1200x800px. Max size: 5MB.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving || uploading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition flex items-center"
              >
                {(saving || uploading) && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {uploading ? 'Uploading Image...' : saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🛠️</div>
              <p className="text-xl text-gray-600 mb-4">No services found</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Your First Service
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Slug</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                              No img
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{service.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                            {service.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{service.slug}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            service.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(service)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(service._id)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 border-t">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-semibold">{services.length}</span> services
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}