'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const t = useTranslations('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Navigation items with language prefix
  const navigation = [
    { name: t('home'), href: `/${lang}` },
    { 
      name: t('services'), 
      href: `/${lang}/services`,
      dropdown: [
        { name: t('construction'), href: `/${lang}/services/construction` },
        { name: t('logistics'), href: `/${lang}/services/logistics` },
        { name: t('electricity'), href: `/${lang}/services/electricity` },
        { name: t('mining'), href: `/${lang}/services/mining` },
      ]
    },
    { name: t('portfolio'), href: `/${lang}/portfolio` },
    { name: t('about'), href: `/${lang}/about` },
    { name: t('careers'), href: `/${lang}/careers` },
    { name: t('contact'), href: `/${lang}/contact` },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-md'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center space-x-2 rtl:space-x-reverse group">
            <span className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition">
              STRATERRA
            </span>
            <span className="text-sm text-gray-500 hidden sm:inline border-l-2 rtl:border-r-2 rtl:border-l-0 border-gray-300 ltr:pl-2 rtl:pr-2">
              {t('industrialGroup')}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      className={`px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg flex items-center space-x-1 rtl:space-x-reverse transition-colors ${
                        pathname.startsWith(`/${lang}/services`) ? 'text-blue-600 bg-blue-50' : ''
                      }`}
                      onMouseEnter={() => setServicesDropdown(true)}
                      onClick={() => setServicesDropdown(!servicesDropdown)}
                    >
                      <span>{item.name}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          servicesDropdown ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className="absolute ltr:left-0 rtl:right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top"
                      onMouseEnter={() => setServicesDropdown(true)}
                      onMouseLeave={() => setServicesDropdown(false)}
                    >
                      <div className={`absolute -top-2 ltr:left-4 rtl:right-4 w-4 h-4 bg-white transform rotate-45`}></div>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                            pathname === subItem.href ? 'bg-blue-50 text-blue-600 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            <span>{subItem.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-colors inline-block ${
                      pathname === item.href ? 'text-blue-600 bg-blue-50' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Language Switcher */}
            <div className="ml-4 rtl:mr-4 rtl:ml-0">
              <LanguageSwitcher />
            </div>

            {/* Admin Button */}
            <Link
              href={`/${lang}/admin/login`}
              className="ml-2 rtl:mr-2 rtl:ml-0 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 rtl:space-x-reverse"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{t('admin')}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0'
        }`}>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900 px-4 py-2 bg-white rounded-lg">
                      {item.name}
                    </div>
                    <div className="ml-4 rtl:mr-4 rtl:ml-0 space-y-1 pl-4 rtl:pr-4 rtl:pl-0 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gray-200">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors ${
                            pathname === subItem.href ? 'text-blue-600 bg-white font-medium' : ''
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            <span>{subItem.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-4 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-colors ${
                      pathname === item.href ? 'text-blue-600 bg-white font-medium' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="py-3 px-4">
              <LanguageSwitcher />
            </div>

            {/* Mobile Admin Button */}
            <Link
              href={`/${lang}/admin/login`}
              className="block mt-4 bg-blue-600 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-700 transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{t('adminLogin')}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}