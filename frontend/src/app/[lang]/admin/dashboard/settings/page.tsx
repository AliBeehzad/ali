'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Settings {
  // General Settings
  siteName: string;
  siteDescription: string;
  companyName: string;
  foundingYear: string;
  
  // Homepage Settings
  heroTitle: string;
  heroSubtitle: string;
  
  // Statistics
  projectsCompleted: string;
  happyClients: string;
  teamMembers: string;
  yearsExperience: string;
  
  // CTA Settings
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  
  // Contact Information
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  contactAddress: string;
  mapEmbed: string;
  
  // Social Media
  facebookUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

export default function SettingsPage() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const [settings, setSettings] = useState<Settings>({
    // General Settings
    siteName: 'STRATERRA',
    siteDescription: 'Your trusted partner in Construction, Logistics, Electricity, and Mining services',
    companyName: 'STRATERRA Industrial Group',
    foundingYear: '2010',
    
    // Homepage Settings
    heroTitle: 'Welcome to',
    heroSubtitle: 'Your trusted partner in Construction, Logistics, Electricity, and Mining services',
    
    // Statistics
    projectsCompleted: '500+',
    happyClients: '50+',
    teamMembers: '200+',
    yearsExperience: '15+',
    
    // CTA Settings
    ctaTitle: 'Ready to Start Your Project?',
    ctaSubtitle: 'Contact us today for a free consultation and quote. Our team is ready to help you with your next project.',
    ctaButtonText: 'Get in Touch',
    
    // Contact Information
    contactPhone: '+93764084531',
    whatsappNumber: '+93764084531',
    contactEmail: 'info@straterra.com',
    contactAddress: 'Logar-Pul-e-Alam, Afghanistan',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13150.237465823132!2d69.022922!3d34.514673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d1694281c1125d%3A0x9b5e5f5b5f5b5f5b!2sPul-e-Alam%2C%20Afghanistan!5e0!3m2!1sen!2s!4v1234567890',
    
    // Social Media
    facebookUrl: '#',
    linkedinUrl: '#',
    twitterUrl: '#',
    instagramUrl: '#',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'General Settings' },
    { id: 'homepage', name: 'Homepage' },
    { id: 'stats', name: 'Statistics' },
    { id: 'cta', name: 'Call to Action' },
    { id: 'contact', name: 'Contact Info' },
    { id: 'social', name: 'Social Media' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <Link
          href={`/${lang}/admin/dashboard`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8 overflow-x-auto">
        <nav className="flex space-x-8 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">General Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => updateSetting('companyName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Founding Year
              </label>
              <input
                type="text"
                value={settings.foundingYear}
                onChange={(e) => updateSetting('foundingYear', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Homepage Tab */}
        {activeTab === 'homepage' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Homepage Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => updateSetting('heroTitle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Welcome to"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <textarea
                value={settings.heroSubtitle}
                onChange={(e) => updateSetting('heroSubtitle', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Statistics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projects Completed
                </label>
                <input
                  type="text"
                  value={settings.projectsCompleted}
                  onChange={(e) => updateSetting('projectsCompleted', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Happy Clients
                </label>
                <input
                  type="text"
                  value={settings.happyClients}
                  onChange={(e) => updateSetting('happyClients', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members
                </label>
                <input
                  type="text"
                  value={settings.teamMembers}
                  onChange={(e) => updateSetting('teamMembers', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years Experience
                </label>
                <input
                  type="text"
                  value={settings.yearsExperience}
                  onChange={(e) => updateSetting('yearsExperience', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA Tab */}
        {activeTab === 'cta' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Call to Action</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Title
              </label>
              <input
                type="text"
                value={settings.ctaTitle}
                onChange={(e) => updateSetting('ctaTitle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Subtitle
              </label>
              <textarea
                value={settings.ctaSubtitle}
                onChange={(e) => updateSetting('ctaSubtitle', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={settings.ctaButtonText}
                onChange={(e) => updateSetting('ctaButtonText', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Contact Tab - NEW with all fields */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => updateSetting('contactPhone', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+93764084531"
              />
              <p className="text-xs text-gray-500 mt-1">Format: +93764084531</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+93764084531"
              />
              <p className="text-xs text-gray-500 mt-1">Format: +93764084531 (with country code)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting('contactEmail', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="info@straterra.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={settings.contactAddress}
                onChange={(e) => updateSetting('contactAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Logar-Pul-e-Alam, Afghanistan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Embed URL
              </label>
              <textarea
                value={settings.mapEmbed}
                onChange={(e) => updateSetting('mapEmbed', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this from Google Maps by clicking Share → Embed map. Copy the src URL.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">How to get Google Maps Embed URL:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal pl-4">
                <li>Go to Google Maps and search for your location</li>
                <li>Click the "Share" button</li>
                <li>Select the "Embed a map" tab</li>
                <li>Copy the iframe src URL (the part inside src="...")</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Social Media Links</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => updateSetting('facebookUrl', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.linkedinUrl}
                onChange={(e) => updateSetting('linkedinUrl', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/company/yourpage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                value={settings.twitterUrl}
                onChange={(e) => updateSetting('twitterUrl', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => updateSetting('instagramUrl', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/yourpage"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}