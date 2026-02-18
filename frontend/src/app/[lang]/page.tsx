'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
}

interface Settings {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  companyName: string;
  foundingYear: string;
  projectsCompleted: string;
  happyClients: string;
  teamMembers: string;
  yearsExperience: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
}

export default function HomePage() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const t = useTranslations();
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchServices(), fetchSettings()]);
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for services
  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('construction')) return '🏗️';
    if (lower.includes('logistics')) return '🚚';
    if (lower.includes('electric')) return '⚡';
    if (lower.includes('mining')) return '⛏️';
    return '🛠️';
  };

  // Color mapping for services
  const getColor = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('construction')) return 'text-blue-600';
    if (lower.includes('logistics')) return 'text-green-600';
    if (lower.includes('electric')) return 'text-yellow-600';
    if (lower.includes('mining')) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {settings?.heroTitle || t('hero.welcome')} <span className="text-yellow-400">{settings?.siteName || 'STRATERRA'}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">
            {settings?.heroSubtitle || t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href={`/${lang}/services`}
              className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              {t('hero.ourServices')}
            </Link>
            <Link 
              href={`/${lang}/contact`}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
            >
              {t('hero.contactUs')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section (unchanged) */}
      {/* ... */}

      {/* Why Choose Us Section (unchanged) */}
      {/* ... */}

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">{settings?.projectsCompleted || '500+'}</div>
              <div className="text-blue-200">{t('stats.projectsCompleted')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{settings?.happyClients || '50+'}</div>
              <div className="text-blue-200">{t('stats.happyClients')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{settings?.teamMembers || '200+'}</div>
              <div className="text-blue-200">{t('stats.teamMembers')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{settings?.yearsExperience || '15+'}</div>
              <div className="text-blue-200">{t('stats.yearsExperience')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">{settings?.ctaTitle || t('cta.title')}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {settings?.ctaSubtitle || t('cta.subtitle')}
          </p>
          <Link 
            href={`/${lang}/contact`}
            className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            {settings?.ctaButtonText || t('cta.button')}
            <svg className="w-5 h-5 ltr:ml-2 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}