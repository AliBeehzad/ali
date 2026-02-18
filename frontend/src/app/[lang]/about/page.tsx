import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">About STRATERRA</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Delivering excellence in industrial services since 2010
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                STRATERRA Industrial Group is a multidisciplinary company providing 
                construction, logistics, mining, and electrical engineering services.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Our team consists of experienced engineers, technicians, and project 
                managers dedicated to delivering safe, efficient, and high-quality 
                solutions for industrial and infrastructure projects.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With over 15 years of experience, we have successfully completed 
                more than 500 projects across the United States.
              </p>
            </div>
            <div className="bg-blue-100 p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">500+</div>
                  <div className="text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">50+</div>
                  <div className="text-gray-600">Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">200+</div>
                  <div className="text-gray-600">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">15+</div>
                  <div className="text-gray-600">Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To provide high-quality industrial services while ensuring safety, 
                building long-term partnerships, and contributing to national 
                development through modern engineering practices.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become a trusted regional leader in infrastructure and industrial 
                services by delivering reliable, innovative, and sustainable 
                engineering solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Work With Us?</h2>
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </main>
  );
}