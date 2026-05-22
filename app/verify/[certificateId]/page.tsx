'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  XCircle,
  Calendar,
  Phone,
  Mail,
  Award,
  Download,
  Share2,
  Home
} from 'lucide-react';
import { API_URL } from '@/utils/config';

interface Certificate {
  _id: string;
  name: string;
  courseName: string;
  courseSlug: string;
  certificateId: string;
  batch?: string;
  email?: string;
  phoneNumber?: string;
  isEligible: boolean;
  dateOfRegistration: string;
  certificateSent: boolean;
  certificateSentAt?: string;
}

interface PageProps {
  params: Promise<{ certificateId: string }>;
}

export default function CertificateVerificationPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!resolvedParams?.certificateId) return;

    const fetchCertificate = async () => {
      try {
        console.log('Verifying certificate:', resolvedParams.certificateId);
        const res = await axios.get(
          `${API_URL}/api/course-students/verify/${resolvedParams.certificateId}`
        );

        if (res.data.success && res.data.certificate) {
          setCertificate(res.data.certificate);
          setVerified(true);
        } else {
          setError('Certificate not found or invalid');
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(
          err.response?.data?.message || 'Failed to verify certificate'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [resolvedParams?.certificateId]);

  const shareOnSocial = (platform: string) => {
    const text = `I just completed the ${certificate?.courseName} course at Brand Monk Academy and received my certificate! 🎓`;
    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://brandmonkacademy.com`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://brandmonkacademy.com`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=https://brandmonkacademy.com`
    };

    window.open(urls[platform], '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !verified || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png"
              alt="Brand Monk Academy"
              className="h-16 mx-auto"
            />
          </div>
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Certificate Not Found
            </h1>
            <p className="text-gray-500 mb-8">
              {error || 'The certificate could not be verified. Please check the URL and try again.'}
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4 py-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png"
            alt="Brand Monk Academy"
            className="h-16 mx-auto"
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 overflow-hidden">
          {/* Success Header */}
          <div className="px-8 pt-10 pb-6 text-center bg-gradient-to-r from-emerald-500 to-teal-500">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Certificate Verified
            </h1>
            <p className="text-white/90 text-lg">
              This is a valid Brand Monk Academy certificate
            </p>
          </div>

          {/* Certificate Details */}
          <div className="px-8 py-8">
            {/* Student Name */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Certificate Holder
              </p>
              <h2 className="text-4xl font-bold text-gray-900">
                {certificate.name}
              </h2>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Course */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Course Completed
                </p>
                <p className="text-lg font-bold text-gray-900">{certificate.courseName}</p>
              </div>

              {/* Certificate ID */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  Certificate ID
                </p>
                <p className="text-lg font-bold text-gray-900 font-mono">
                  {certificate.certificateId}
                </p>
              </div>

              {/* Issue Date */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    Issue Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(certificate.dateOfRegistration).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {certificate.isEligible ? 'Valid' : 'Invalid'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            {(certificate.email || certificate.phoneNumber) && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">
                  Contact Information
                </p>
                <div className="space-y-2">
                  {certificate.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{certificate.email}</span>
                    </div>
                  )}
                  {certificate.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{certificate.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Batch Info */}
            {certificate.batch && (
              <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-200">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  Batch/Timing
                </p>
                <p className="text-gray-900 font-semibold">{certificate.batch}</p>
              </div>
            )}

            {/* Security Badge */}
            <div className="bg-green-50 rounded-xl p-4 mb-8 border border-green-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-wider">
                  Authenticity Verified
                </p>
                <p className="text-sm text-green-700 mt-1">
                  This certificate has been digitally verified and is authentic. The holder has successfully completed the
                  {' '}
                  <strong>{certificate.courseName}</strong> course at Brand Monk Academy.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Certificate
              </button>

              <div className="relative group">
                <button className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>

                {/* Share Menu */}
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 first:rounded-t-lg font-medium"
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => shareOnSocial('linkedin')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => shareOnSocial('facebook')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 last:rounded-b-lg font-medium"
                  >
                    Share on Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm font-medium">
              Verified Certificate • Brand Monk Academy 🎓
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            <a href="/" className="text-emerald-600 hover:text-emerald-700 font-bold">
              Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
