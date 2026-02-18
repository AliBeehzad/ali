'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Stats {
  services: number;
  projects: number;
  careers: number;
  applications: number;
  pendingApplications: number;
  contactSubmissions: number;
  unreadContactSubmissions: number;
}

export default function AdminDashboardPage() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    services: 0,
    projects: 0,
    careers: 0,
    applications: 0,
    pendingApplications: 0,
    contactSubmissions: 0,
    unreadContactSubmissions: 0
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push(`/${lang}/admin/login`);
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      const validatedUser: User = {
        id: parsedUser.id || '',
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        role: parsedUser.role || 'admin'
      };
      setUser(validatedUser);
      fetchStats();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push(`/${lang}/admin/login`);
    } finally {
      setLoading(false);
    }
  }, [lang, router]);

  const fetchStats = async () => {
    try {
      // Fetch services count
      const servicesRes = await fetch('/api/services');
      const servicesData = await servicesRes.json();
      
      // Fetch projects count
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();
      
      // Fetch careers count
      const careersRes = await fetch('/api/careers');
      const careersData = await careersRes.json();
      
      // Fetch applications count
      const appsRes = await fetch('/api/applications');
      const appsData = await appsRes.json();

      // Fetch contact submissions count
      const contactRes = await fetch('/api/contact?limit=1000');
      const contactData = await contactRes.json();

      setStats({
        services: servicesData.length || 0,
        projects: projectsData.length || 0,
        careers: careersData.length || 0,
        applications: appsData.length || 0,
        pendingApplications: appsData.filter((app: any) => app.status === 'pending').length || 0,
        contactSubmissions: contactData.length || 0,
        unreadContactSubmissions: contactData.filter((sub: any) => sub.status === 'unread').length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push(`/${lang}/admin/login`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      name: 'Total Services', 
      value: stats.services, 
      icon: '🛠️', 
      color: 'bg-blue-500',
      href: `/${lang}/admin/dashboard/services`
    },
    { 
      name: 'Portfolio Items', 
      value: stats.projects, 
      icon: '📁', 
      color: 'bg-green-500',
      href: `/${lang}/admin/dashboard/portfolio`
    },
    { 
      name: 'Open Positions', 
      value: stats.careers, 
      icon: '👥', 
      color: 'bg-purple-500',
      href: `/${lang}/admin/dashboard/careers`
    },
    { 
      name: 'Total Applications', 
      value: stats.applications, 
      icon: '📝', 
      color: 'bg-yellow-500',
      href: `/${lang}/admin/dashboard/applications`,
      badge: stats.pendingApplications > 0 ? `${stats.pendingApplications} pending` : null
    },
    { 
      name: 'Contact Messages', 
      value: stats.contactSubmissions, 
      icon: '📨', 
      color: 'bg-indigo-500',
      href: `/${lang}/admin/dashboard/contact-submissions`,
      badge: stats.unreadContactSubmissions > 0 ? `${stats.unreadContactSubmissions} unread` : null
    },
  ];

  const quickActions = [
    { name: 'Add New Service', href: `/${lang}/admin/dashboard/services`, icon: '➕', color: 'blue' },
    { name: 'Add New Project', href: `/${lang}/admin/dashboard/portfolio`, icon: '➕', color: 'green' },
    { name: 'Post New Job', href: `/${lang}/admin/dashboard/careers`, icon: '➕', color: 'purple' },
    { name: 'View Applications', href: `/${lang}/admin/dashboard/applications`, icon: '👁️', color: 'yellow' },
    { name: 'View Contact Messages', href: `/${lang}/admin/dashboard/contact-submissions`, icon: '📨', color: 'indigo' },
    { name: 'Settings', href: `/${lang}/admin/dashboard/settings`, icon: '⚙️', color: 'gray' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">STRATERRA Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.username}</span> ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.username}! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your website today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition relative"
            >
              {stat.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stat.badge}
                </span>
              )}
              <div className="flex items-center">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className={`bg-${action.color}-50 hover:bg-${action.color}-100 p-4 rounded-lg transition flex items-center space-x-3`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Services Card */}
          <Link href={`/${lang}/admin/dashboard/services`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Services</h3>
              <span className="text-3xl">🛠️</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Manage your services - add, edit, or delete services</p>
            <span className="text-blue-600 text-sm font-medium">Manage →</span>
          </Link>

          {/* Portfolio Card */}
          <Link href={`/${lang}/admin/dashboard/portfolio`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Portfolio</h3>
              <span className="text-3xl">📁</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Manage portfolio projects with images and details</p>
            <span className="text-blue-600 text-sm font-medium">Manage →</span>
          </Link>

          {/* Careers Card */}
          <Link href={`/${lang}/admin/dashboard/careers`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Careers</h3>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Post and manage job openings</p>
            <span className="text-blue-600 text-sm font-medium">Manage →</span>
          </Link>

          {/* Applications Card */}
          <Link href={`/${lang}/admin/dashboard/applications`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Applications</h3>
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Review job applications from candidates</p>
            <span className="text-blue-600 text-sm font-medium">View →</span>
          </Link>

          {/* Contact Submissions Card - NEW */}
          <Link href={`/${lang}/admin/dashboard/contact-submissions`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition relative">
            {stats.unreadContactSubmissions > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.unreadContactSubmissions} new
              </span>
            )}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Contact Messages</h3>
              <span className="text-3xl">📨</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">View messages from your contact form</p>
            <span className="text-blue-600 text-sm font-medium">View →</span>
          </Link>

          {/* Settings Card */}
          <Link href={`/${lang}/admin/dashboard/settings`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Configure website content and information</p>
            <span className="text-blue-600 text-sm font-medium">Configure →</span>
          </Link>

          {/* Profile Card */}
          <Link href={`/${lang}/admin/dashboard/profile`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
              <span className="text-3xl">👤</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Update your profile and change password</p>
            <span className="text-blue-600 text-sm font-medium">Edit →</span>
          </Link>
        </div>

        {/* Recent Activity Preview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
              <Link href={`/${lang}/admin/dashboard/applications`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            
            {stats.applications === 0 ? (
              <p className="text-gray-500 text-center py-8">No applications yet</p>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">
                  You have <span className="font-semibold">{stats.applications}</span> total applications,
                  with <span className="font-semibold text-yellow-600">{stats.pendingApplications}</span> pending review.
                </p>
                <Link
                  href={`/${lang}/admin/dashboard/applications?status=pending`}
                  className="inline-block bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm hover:bg-yellow-100 transition"
                >
                  Review Pending Applications
                </Link>
              </div>
            )}
          </div>

          {/* Recent Contact Messages Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Contact Messages</h3>
              <Link href={`/${lang}/admin/dashboard/contact-submissions`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            
            {stats.contactSubmissions === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages yet</p>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">
                  You have <span className="font-semibold">{stats.contactSubmissions}</span> total messages,
                  with <span className="font-semibold text-red-600">{stats.unreadContactSubmissions}</span> unread.
                </p>
                <Link
                  href={`/${lang}/admin/dashboard/contact-submissions?status=unread`}
                  className="inline-block bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-100 transition"
                >
                  View Unread Messages
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}