'use client';

import { useState, useEffect, useRef, use } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Download,
  Loader2,
  XCircle,
  Award,
  CheckCircle,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import CertificateTemplate from '../../components/CertificateTemplate';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CertificatePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!resolvedParams?.id) return;

    const fetchStudent = async () => {
      try {
        console.log('Fetching certificate for ID:', resolvedParams.id);
        console.log('Using API URL:', API_URL);
        const res = await axios.get(`${API_URL}/api/students/${resolvedParams.id}`);
        console.log('API Response:', res.status, res.data);
        if (res.data.success) {
          setStudent(res.data.student);
        }
      } catch (err: any) {
        console.error('Fetch error detail:', {
          id: resolvedParams.id,
          url: `${API_URL}/api/students/${resolvedParams.id}`,
          status: err.response?.status,
          message: err.message,
          response: err.response?.data
        });
        setError(err.response?.data?.message || 'Certificate not found');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [resolvedParams.id]);

  const generateCertificate = async () => {
    if (!student || !certificateRef.current) return;
    
    setDownloading(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1000, 700]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 1000, 700);
      pdf.save(`${student.name.replace(/\s+/g, '_')}_Certificate.pdf`);
      setDownloaded(true);
    } catch (err) {
      console.error('Certificate generation failed:', err);
      setError('Failed to generate certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
              {error}
            </p>
            <a 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!student.isEligible) {
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
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Certificate Pending
            </h1>
            <p className="text-gray-500 mb-8">
              Your certificate is not yet approved. Please wait for admin approval.
            </p>
            <a 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-900 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
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
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="w-full max-w-xl relative">
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
          {/* Header with Icon */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
              Your Certificate is Ready!
            </h1>
            <p className="text-gray-500 text-lg">
              Congratulations, <span className="font-semibold text-gray-700">{student.name}</span>!
            </p>
          </div>

          {/* Certificate Details */}
          <div className="px-8 pb-8">
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Webinar</span>
                  <span className="font-bold text-gray-900 text-lg">{student.webinarName}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Certificate ID</span>
                  <span className="font-mono font-bold text-emerald-600">{student.certificateId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Issue Date</span>
                  <span className="font-semibold text-gray-700">
                    {new Date(student.dateOfRegistration || student.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {downloaded && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl mb-6 border border-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-emerald-700 font-medium">Certificate downloaded successfully!</p>
              </div>
            )}

            {/* Download Button - Pill shape with neumorphism */}
            <button
              onClick={generateCertificate}
              disabled={downloading}
              className="w-full py-5 bg-emerald-600 text-white text-lg font-bold rounded-full flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]
                hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.6),inset_0_-3px_0_rgba(0,0,0,0.1)]
                hover:translate-y-[-2px]
                active:translate-y-[1px]
                active:shadow-[0_5px_20px_-10px_rgba(16,185,129,0.5),inset_0_3px_0_rgba(0,0,0,0.1)]
              "
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Certificate...
                </>
              ) : downloaded ? (
                <>
                  <Download className="w-5 h-5" />
                  Download Again
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Certificate (PDF)
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
            <p className="text-center text-gray-500 text-sm font-medium">
              Share your achievement on social media and tag us!
            </p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="text-center mt-8">
          <a 
            href="https://brandmonkacademy.com"
            className="text-emerald-600 hover:text-emerald-700 font-bold text-sm"
          >
            Visit Brand Monk Academy →
          </a>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Verified & Authentic Certificate</span>
        </div>
      </div>

      {/* Hidden Certificate Template for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {student && student.isEligible && (
          <CertificateTemplate
            ref={certificateRef}
            studentName={student.name}
            courseName={student.webinarName}
            date={new Date(student.dateOfRegistration || student.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            verifyUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${student._id}`}
            certificateId={student.certificateId}
          />
        )}
      </div>
    </div>
  );
}
