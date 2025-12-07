'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Loader2, 
  ArrowRight,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronDown
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const PROFESSIONS = [
  'Student',
  'Entrepreneur', 
  'Working Professional',
  'Home Maker',
  'Freelance',
  'Others'
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function RegisterPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [webinar, setWebinar] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    profession: ''
  });

  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/webinars/slug/${resolvedParams.slug}`);
        if (res.data.success) {
          setWebinar(res.data.webinar);
        }
      } catch (err: any) {
        console.error('Webinar fetch error:', err);
        setNotFound(true);
      } finally {
        setPageLoading(false);
      }
    };

    fetchWebinar();
  }, [resolvedParams.slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.phone || 
        !formData.location || !formData.profession) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/students/register`, {
        ...formData,
        webinarSlug: resolvedParams.slug
      });
      
      if (res.data.success) {
        sessionStorage.setItem('registeredStudent', JSON.stringify(res.data.student));
        router.push('/webinar/success');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading webinar details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Webinar Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            This registration link is invalid or the webinar is no longer accepting registrations.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-12 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="w-full max-w-xl mx-auto relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png"
            alt="Brand Monk Academy"
            className="h-24 mx-auto"
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Webinar Registration
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                  Complete your registration below
                </p>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Webinar Info Banner */}
          <div className="mx-8 mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{webinar?.name}</h2>
                {webinar?.date && (
                  <p className="text-emerald-700 font-medium">
                    {new Date(webinar.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-gray-900 text-lg font-medium border-0 border-b-2 border-gray-200 pb-3 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Your full name"
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Profession
                </label>
                <div className="relative">
                  <select
                    name="profession"
                    required
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full text-gray-900 text-lg font-medium border border-gray-200 rounded-2xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all bg-transparent appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-400">Select</option>
                    {PROFESSIONS.map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-gray-900 text-lg font-medium border-0 border-b-2 border-gray-200 pb-3 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="name@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-gray-900 text-lg font-medium border-0 border-b-2 border-gray-200 pb-3 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Location - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Location (City, Country)
                </label>
                <input
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full text-gray-900 text-lg font-medium border-0 border-b-2 border-gray-200 pb-3 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Chennai, India"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button - Pill shape with neumorphism */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 py-5 bg-emerald-600 text-white text-lg font-bold rounded-full flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]
                hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.6),inset_0_-3px_0_rgba(0,0,0,0.1)]
                hover:translate-y-[-2px]
                active:translate-y-[1px]
                active:shadow-[0_5px_20px_-10px_rgba(16,185,129,0.5),inset_0_3px_0_rgba(0,0,0,0.1)]
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Register Now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
            <p className="text-center text-gray-500 text-sm font-medium">
              By registering, you agree to receive updates about our webinars and courses.
            </p>
          </div>
        </div>

        {/* Bottom Help Text */}
        <p className="text-center text-gray-500 text-sm mt-8 font-medium">
          Need help? Contact us at{' '}
          <a href="mailto:info@brandmonkacademy.com" className="text-emerald-600 hover:text-emerald-700 font-bold">
            info@brandmonkacademy.com
          </a>
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Your data is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}

