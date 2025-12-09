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
  ArrowLeft,
  Star,
  X,
  Heart,
  ExternalLink
} from 'lucide-react';
import CertificateTemplate from '../../components/CertificateTemplate';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Google Business Review URL
const GOOGLE_REVIEW_URL = 'https://www.google.com/search?num=10&sca_esv=d340eac8d7c27e5b&biw=1526&bih=728&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-ExfS61xhBIxu5eWrTTjbJnBrVoj6St3qJRJQy7_Regxi9rBug5lX1IYYydSvg_vveZJ32370cJw5ZIhVlhhSW0vP_pzp9jMPw31aObFmzFTA-peJ5g%3D%3D&q=Brand+Monk+Academy+Reviews&sa=X&ved=2ahUKEwjhne-x96yRAxUEcGwGHaSxJNMQ0bkNegQILxAE';

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
  
  // Star Rating State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

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

  // Show rating modal when download button is clicked
  const handleDownloadClick = () => {
    setShowRatingModal(true);
  };

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (selectedRating === 0) return;
    
    // Close rating modal
    setShowRatingModal(false);
    
    // Start downloading the certificate
    await generateCertificate();
    
    if (selectedRating >= 4) {
      // 4-5 stars: Open Google Business review in new tab
      window.open(GOOGLE_REVIEW_URL, '_blank');
    } else {
      // 1-3 stars: Show thank you popup
      setShowThankYouPopup(true);
    }
  };

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
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course</span>
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

            {/* Download Button */}
            <button
              onClick={handleDownloadClick}
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

      {/* ============ STAR RATING MODAL ============ */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-8 pt-10 pb-8 text-center">
              <button
                onClick={() => setShowRatingModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Rate Your Experience</h2>
              <p className="text-white/80 text-sm">How was your learning journey with us?</p>
            </div>
            
            {/* Rating Stars */}
            <div className="px-8 py-8">
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-2 transition-all duration-200 hover:scale-110"
                  >
                    <Star 
                      className={`w-12 h-12 transition-all duration-200 ${
                        star <= (hoveredRating || selectedRating)
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              {/* Rating Label */}
              <div className="text-center mb-6">
                {selectedRating === 0 && (
                  <p className="text-gray-500">Tap a star to rate</p>
                )}
                {selectedRating === 1 && <p className="text-red-500 font-medium">Poor 😔</p>}
                {selectedRating === 2 && <p className="text-orange-500 font-medium">Fair 😐</p>}
                {selectedRating === 3 && <p className="text-yellow-600 font-medium">Good 🙂</p>}
                {selectedRating === 4 && <p className="text-green-500 font-medium">Very Good 😊</p>}
                {selectedRating === 5 && <p className="text-emerald-600 font-medium">Excellent! 🤩</p>}
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedRating === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5'
                }`}
              >
                <Download className="w-5 h-5" />
                Submit & Download Certificate
              </button>
            </div>
            
            {/* Info Text */}
            <div className="px-8 pb-8">
              <p className="text-center text-gray-400 text-xs">
                Your feedback helps us improve our courses
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============ THANK YOU POPUP ============ */}
      {showThankYouPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Confetti Background */}
            <div className="relative bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 px-8 pt-12 pb-10 text-center overflow-hidden">
              {/* Floating decorations */}
              <div className="absolute top-4 left-6 text-3xl animate-bounce">🎉</div>
              <div className="absolute top-8 right-8 text-2xl animate-bounce delay-100">✨</div>
              <div className="absolute bottom-6 left-10 text-2xl animate-bounce delay-200">🌟</div>
              <div className="absolute bottom-4 right-6 text-3xl animate-bounce delay-75">🎊</div>
              
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-5">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Thank You!</h2>
              <p className="text-white/90 text-lg">We appreciate your feedback</p>
            </div>
            
            {/* Message */}
            <div className="px-8 py-8 text-center">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your certificate has been downloaded successfully. We're grateful for your time and hope you enjoyed learning with <span className="font-semibold text-gray-800">Brand Monk Academy</span>!
              </p>
              
              <button
                onClick={() => setShowThankYouPopup(false)}
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
            
            {/* Footer */}
            <div className="px-8 pb-6">
              <p className="text-center text-gray-400 text-sm">
                Keep learning, keep growing! 🚀
              </p>
            </div>
          </div>
        </div>
      )}

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
