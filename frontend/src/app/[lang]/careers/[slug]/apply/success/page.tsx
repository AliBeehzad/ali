import Link from 'next/link';

export default function ApplySuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for your interest in joining our team. We've received your application and will review it shortly.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold mb-2">What happens next?</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Our HR team will review your application
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  If your profile matches our requirements, we'll contact you within 5-7 business days
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  You'll receive an email confirmation with more details
                </li>
              </ul>
            </div>
            
            <div className="space-x-4">
              <Link
                href="/careers"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
              >
                Browse More Jobs
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition inline-block"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}