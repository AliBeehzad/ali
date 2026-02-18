'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  slug: string;
  client: string;
  location: string;
  category: string;
  description: string;
  featuredImage: string;
  projectValue?: string;
  featured: boolean;
  completed: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    location: '',
    category: '',
    description: '',
    challenge: '',
    solution: '',
    results: [''],
    projectValue: '',
    featured: false,
    completed: true,
    featuredImage: null as File | null,
    additionalImages: [] as File[],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const imageFormData = new FormData();
    imageFormData.append('image', file);
    imageFormData.append('folder', `straterra/${folder}`);

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
      let featuredImageUrl = editingProject?.featuredImage || '';

      // Upload featured image
      if (formData.featuredImage) {
        setUploading(true);
        featuredImageUrl = await uploadImage(formData.featuredImage, 'projects/featured');
        setUploading(false);
      }

      // Upload additional images
      const additionalImageUrls = [];
      for (const file of formData.additionalImages) {
        const url = await uploadImage(file, 'projects/gallery');
        additionalImageUrls.push({ url, public_id: url.split('/').pop() || '' });
      }

      // Filter out empty results
      const results = formData.results.filter(r => r.trim() !== '');

      const projectData = {
        title: formData.title,
        client: formData.client,
        location: formData.location,
        category: formData.category,
        description: formData.description,
        challenge: formData.challenge,
        solution: formData.solution,
        results,
        projectValue: formData.projectValue,
        featured: formData.featured,
        completed: formData.completed,
        featuredImage: featuredImageUrl,
        images: additionalImageUrls,
      };

      const url = editingProject 
        ? `/api/projects/${editingProject._id}`
        : '/api/projects';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
        resetForm();
        fetchProjects();
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error instanceof Error ? error.message : 'Failed to save project');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('Project deleted successfully!');
        fetchProjects();
      } else {
        alert(data.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('An error occurred while deleting the project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    // You'll need to fetch full project details including arrays
    fetch(`/api/projects/${project._id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          title: data.title,
          client: data.client,
          location: data.location,
          category: data.category,
          description: data.description,
          challenge: data.challenge || '',
          solution: data.solution || '',
          results: data.results || [''],
          projectValue: data.projectValue || '',
          featured: data.featured || false,
          completed: data.completed || true,
          featuredImage: null,
          additionalImages: [],
        });
        setShowForm(true);
      });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      location: '',
      category: '',
      description: '',
      challenge: '',
      solution: '',
      results: [''],
      projectValue: '',
      featured: false,
      completed: true,
      featuredImage: null,
      additionalImages: [],
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const addResultField = () => {
    setFormData({
      ...formData,
      results: [...formData.results, ''],
    });
  };

  const removeResultField = (index: number) => {
    const newResults = formData.results.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      results: newResults,
    });
  };

  const updateResultField = (index: number, value: string) => {
    const newResults = [...formData.results];
    newResults[index] = value;
    setFormData({
      ...formData,
      results: newResults,
    });
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Portfolio Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          {showForm ? '← Back to List' : '+ Add New Project'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., Houston, TX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Construction">Construction</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Mining">Mining</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Challenge & Solution */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge
                </label>
                <textarea
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution
                </label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Results */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Results
              </label>
              {formData.results.map((result, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={result}
                    onChange={(e) => updateResultField(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Completed 3 months ahead of schedule"
                  />
                  <button
                    type="button"
                    onClick={() => removeResultField(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResultField}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Another Result
              </button>
            </div>

            {/* Project Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Value
                </label>
                <input
                  type="text"
                  value={formData.projectValue}
                  onChange={(e) => setFormData({ ...formData, projectValue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $15M"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Featured Project</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.completed}
                    onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Completed</span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image {!editingProject && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ 
                  ...formData, 
                  featuredImage: e.target.files ? e.target.files[0] : null 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required={!editingProject}
              />
              {editingProject && editingProject.featuredImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Current featured image:</p>
                  <img 
                    src={editingProject.featuredImage} 
                    alt="Current" 
                    className="w-32 h-32 object-cover rounded-lg mt-1"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Gallery Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFormData({ 
                  ...formData, 
                  additionalImages: e.target.files ? Array.from(e.target.files) : [] 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can select multiple images
              </p>
            </div>

            {/* Submit Buttons */}
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
                {uploading ? 'Uploading Images...' : saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
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
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl text-gray-600 mb-4">No projects found</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Your First Project
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
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Client</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Featured</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {project.featuredImage ? (
                            <img
                              src={project.featuredImage}
                              alt={project.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                              No img
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{project.title}</td>
                        <td className="px-6 py-4 text-gray-700">{project.client}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{project.location}</td>
                        <td className="px-6 py-4">
                          {project.featured ? (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(project._id)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
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
                  Total: <span className="font-semibold">{projects.length}</span> projects
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}