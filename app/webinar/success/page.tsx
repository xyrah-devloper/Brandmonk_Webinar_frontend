'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  CheckCircle, 
  Download, 
  Instagram, 
  Loader2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import CertificateTemplate from '../../components/CertificateTemplate';
import { API_URL } from '@/utils/config';
const INSTAGRAM_URL = 'https://www.instagram.com/brandmonkacademy';

export default function SuccessPage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [processingFollow, setProcessingFollow] = useState(false);
  const [hasClickedFollow, setHasClickedFollow] = useState(false);
  const [error, setError] = useState('');
  const [downloadReady, setDownloadReady] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedStudent = sessionStorage.getItem('registeredStudent');
    if (storedStudent) {
      const parsed = JSON.parse(storedStudent);
      setStudent(parsed);
      
      if (parsed.hasFollowedInstagram) {
        setStep(3);
        setDownloadReady(true);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const handleFollowInstagram = () => {
    window.open(INSTAGRAM_URL, '_blank');
    setProcessingFollow(true);
    setTimeout(() => {
      setProcessingFollow(false);
      setHasClickedFollow(true);
    }, 3000);
  };

  const handleVerifyFollow = async () => {
    if (!student) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/students/instagram-verified`, {
        studentId: student._id
      });

      if (res.data.success) {
        setStudent({ ...student, hasFollowedInstagram: true });
        sessionStorage.setItem('registeredStudent', JSON.stringify({
          ...student,
          hasFollowedInstagram: true
        }));
        setStep(3);
        setDownloadReady(true);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async () => {
    if (!student || !certificateRef.current) return;
    
    setLoading(true);

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
    } catch (err) {
      console.error('Certificate generation failed:', err);
      setError('Failed to generate certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Registration Complete' },
    { num: 2, label: 'Follow Instagram' },
    { num: 3, label: 'Download Certificate' },
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      {/* Subtle Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/40 to-pink-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Professional Navbar */}
      <header className="relative z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <img 
                src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png"
                alt="Brand Monk Academy"
                className="h-1 w-auto object-contain"
              />
            </a>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              
              {/* <button 
                onClick={() => router.push('/')}
                className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Back to Home
              </button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Let's get your certificate
            </h1>
            <p className="text-slate-500">
              Complete the steps below to download your certificate
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step > s.num 
                      ? 'bg-indigo-600 text-white' 
                      : step === s.num 
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' 
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                  }`}>
                    {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    step >= s.num ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-20 sm:w-32 h-[2px] mx-2 mt-[-20px] transition-all duration-300 ${
                    step > s.num ? 'bg-indigo-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            
            {/* STEP 1: Registration Complete */}
            {step === 1 && (
              <div className="p-8 sm:p-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                    Registration Successful!
                  </h2>
                  <p className="text-slate-500 text-center mb-8">
                    You're all set for the webinar
                  </p>

                  {/* Student Info */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Name</span>
                      <span className="font-medium text-slate-900">{student.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Email</span>
                      <span className="font-medium text-slate-900">{student.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Program</span>
                      <span className="font-medium text-slate-900">{student.webinarName}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-slate-500">Certificate ID</span>
                      <span className="font-mono font-medium text-indigo-600">{student.certificateId}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Follow Instagram */}
            {step === 2 && (
              <div className="p-8 sm:p-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center mx-auto mb-6">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                    Follow us on Instagram
                  </h2>
                  <p className="text-slate-500 text-center mb-8">
                    Stay updated with our latest courses and content
                  </p>

                  {/* Instagram Profile Card */}
                  <div className="bg-slate-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <img 
                            src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png"
                            alt="BMA"
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">brandmonkacademy</p>
                        <p className="text-sm text-slate-500">Brand Monk Academy</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleFollowInstagram}
                      disabled={processingFollow}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      {processingFollow ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          Follow
                          <ExternalLink className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {!hasClickedFollow ? (
                    <div className="w-full py-4 bg-slate-100 text-slate-400 font-semibold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Click "Follow" above first
                    </div>
                  ) : (
                    <button
                      onClick={handleVerifyFollow}
                      disabled={loading}
                      className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          I've Followed - Continue
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => setStep(1)}
                    className="w-full mt-3 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm"
                  >
                    ← Go Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Download Certificate */}
            {step === 3 && downloadReady && (
              <div className="p-8 sm:p-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                    <Download className="w-8 h-8 text-amber-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                    Your Certificate is Ready!
                  </h2>
                  <p className="text-slate-500 text-center mb-8">
                    Congratulations on completing the webinar
                  </p>

                  {/* Certificate Preview */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border border-amber-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Participant</p>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <span className="text-amber-600 text-2xl">🏆</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Program</p>
                        <p className="font-medium text-slate-900 text-sm">{student.webinarName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Certificate ID</p>
                        <p className="font-mono font-medium text-indigo-600 text-sm">{student.certificateId}</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={generateCertificate}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Certificate
                      </>
                    )}
                  </button>

                  {/* <button
                    onClick={() => router.push('/')}
                    className="w-full mt-3 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm"
                  >
                    Back to Home
                  </button> */}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-slate-400 text-sm mt-8">
            Need help?{' '}
            <a href="mailto:info@brandmonkacademy.com" className="text-indigo-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </main>

      {/* Hidden Certificate Template for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {student && downloadReady && (
          <CertificateTemplate
            ref={certificateRef}
            studentName={student.name}
            courseName={student.webinarName}
            date={new Date().toLocaleDateString('en-IN', {
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
