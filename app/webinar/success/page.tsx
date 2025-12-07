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
  Lock,
  ArrowRight,
  Loader2,
  ExternalLink,
  RefreshCw,
  Award,
  Shield,
  Home as HomeIcon
} from 'lucide-react';
// Navbar removed to fit the retro desk theme
import CertificateTemplate from '../../components/CertificateTemplate';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://brandmonk-backend-1.onrender.com';
const INSTAGRAM_URL = 'https://www.instagram.com/brandmonkacademy';

export default function SuccessPage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [step, setStep] = useState<'thankyou' | 'follow' | 'verify' | 'download'>('thankyou');
  const [loading, setLoading] = useState(false);
  const [processingFollow, setProcessingFollow] = useState(false);
  const [error, setError] = useState('');
  const [downloadReady, setDownloadReady] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedStudent = sessionStorage.getItem('registeredStudent');
    if (storedStudent) {
      const parsed = JSON.parse(storedStudent);
      setStudent(parsed);
      
      if (parsed.hasFollowedInstagram) {
        setStep('download');
        setDownloadReady(true);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const handleFollowInstagram = () => {
    window.open(INSTAGRAM_URL, '_blank');
    setProcessingFollow(true);
    // 6 seconds delay before showing verify step
    setTimeout(() => {
      setStep('verify');
      setProcessingFollow(false);
    }, 6000);
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
        setStep('download');
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
      <div className="desk-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#DAA520] animate-spin" />
      </div>
    );
  }

  return (
    <div className="desk-bg no-scroll">
      {/* Background container matching Home Page */}
      <div className="certificate-container landscape">
        <div className="certificate-border">
          <div className="certificate-inner-border">
            
            {/* Corner decorations */}
            <div className="corner-decoration corner-tl"></div>
            <div className="corner-decoration corner-tr"></div>
            <div className="corner-decoration corner-bl"></div>
            <div className="corner-decoration corner-br"></div>

            <div className="cert-content-grid">
              
              {/* LEFT SIDE: Identity & Info */}
              <div className="cert-column left-col relative">
                <div className="mb-4">
                   <img 
                      src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png" 
                      alt="Brand Monk Academy Seal" 
                      className="h-16 w-auto mx-auto object-contain mix-blend-multiply opacity-90"
                    />
                </div>
                <h1 className="cert-title main-title text-center">Brand Monk<br/>Academy</h1>
                <p className="cert-subtitle text-center">Webinar Certification</p>
                
                <div className="cert-divider-small"></div>
                
                <div className="text-center space-y-4 font-serif text-[#1a237e]">
                  <div className="border-b border-[#DAA520] pb-2 inline-block px-4">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Student Name</p>
                    <p className="text-xl font-bold">{student.name}</p>
                  </div>
                  
                  <div className="border-b border-[#DAA520] pb-2 inline-block px-4">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Webinar/Course</p>
                    <p className="text-lg font-bold">{student.webinarName}</p>
                  </div>
                  
                  <div>
                     <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Certificate ID</p>
                     <p className="font-mono font-bold text-[#c0392b] tracking-wider">{student.certificateId}</p>
                  </div>
                </div>

                <div className="seal-area mt-auto">
                   <div className="gold-seal relative">
                      <div className="seal-ribbon"></div>
                      <div className="seal-text">VERIFIED<br/>SOURCE</div>
                   </div>
                   <div className="signature-area">
                      <div className="hand-signature-small">Brand Monk</div>
                      <div className="signature-line-small"></div>
                      <p className="signature-label-small">Registrar</p>
                   </div>
                </div>
              </div>

              {/* VERTICAL DIVIDER */}
              <div className="cert-vertical-divider"></div>

              {/* RIGHT SIDE: Action Steps */}
              <div className="cert-column right-col relative flex flex-col justify-center text-center">
                
                {/* Step Content Swapper */}
                <div className="flex-grow flex flex-col justify-center items-center max-w-md mx-auto w-full">
                  
                  {/* STEP 1: THANK YOU */}
                  {step === 'thankyou' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-6">
                         <div className="w-16 h-16 rounded-full border-2 border-[#1a237e] flex items-center justify-center mx-auto bg-white">
                            <CheckCircle className="w-8 h-8 text-[#1a237e]" />
                         </div>
                      </div>
                      <h2 className="font-cinzel text-2xl font-bold text-[#1a237e] mb-2">Registration Confirmed</h2>
                      <p className="font-serif text-gray-600 italic mb-8">
                        "We formally acknowledge your enrollment. Proceed to claim your digital credentials."
                      </p>
                      
                      <button
                        onClick={() => setStep('follow')}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-3 bg-[#1a237e] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#2c3e50] transition-all transform hover:scale-[1.02] shadow-lg border-2 border-[#DAA520]"
                      >
                        <Award className="w-5 h-5 text-[#DAA520]" />
                        <span>Claim Certificate</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* STEP 2: FOLLOW INSTAGRAM */}
                  {step === 'follow' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-6">
                         <div className="w-16 h-16 rounded-full border-2 border-[#1a237e] flex items-center justify-center mx-auto bg-white">
                            <Lock className="w-8 h-8 text-[#1a237e]" />
                         </div>
                      </div>
                      <h2 className="font-cinzel text-2xl font-bold text-[#1a237e] mb-2">Unlock Credentials</h2>
                      <p className="font-serif text-gray-600 italic mb-8">
                        "To release the seal on your certificate, adhere to the academy's social registry."
                      </p>

                      <div className="p-4 bg-[#f9f7f2] border border-[#d4c5b0] rounded mb-6 flex items-center gap-4 text-left shadow-inner">
                        <div className="bg-gradient-to-br from-purple-600 to-orange-500 p-2 rounded text-white">
                           <Instagram className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="font-bold font-serif text-[#1a237e]">@brandmonkacademy</p>
                           <p className="text-xs text-gray-500 uppercase tracking-widest">Official Channel</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 w-full">
                        <button
                          onClick={handleFollowInstagram}
                          disabled={processingFollow}
                          className={`w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#c13584] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#a02c6d] transition-all shadow-md ${processingFollow ? 'opacity-75' : ''}`}
                        >
                          {processingFollow ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <Instagram className="w-4 h-4" />
                              <span>Follow Registry</span>
                              <ExternalLink className="w-4 h-4" />
                            </>
                          )}
                        </button>
                        
                        <button
                           onClick={() => setStep('thankyou')}
                           className="text-xs font-bold text-gray-500 hover:text-[#1a237e] uppercase tracking-widest border-b border-transparent hover:border-[#1a237e]"
                        >
                           Return to Previous
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: VERIFY */}
                  {step === 'verify' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-6">
                         <div className="w-16 h-16 rounded-full border-2 border-[#DAA520] flex items-center justify-center mx-auto bg-[#fff9f0]">
                            <Users className="w-8 h-8 text-[#DAA520]" />
                         </div>
                      </div>
                      <h2 className="font-cinzel text-2xl font-bold text-[#1a237e] mb-2">Verify Attendance</h2>
                      <p className="font-serif text-gray-600 italic mb-6">
                        "Confirming your support of the academy."
                      </p>
                      
                      {error && (
                         <div className="mb-4 text-xs font-bold text-red-600 bg-red-50 p-2 border border-red-200">
                           {error}
                         </div>
                      )}

                      <div className="flex flex-col gap-3 w-full">
                        <button
                          onClick={handleVerifyFollow}
                          disabled={loading}
                          className={`w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#1a237e] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#2c3e50] transition-all shadow-md border border-[#DAA520] ${loading ? 'opacity-70' : ''}`}
                        >
                           {loading ? (
                             <>
                               <Loader2 className="w-4 h-4 animate-spin" />
                               <span>Checking Records...</span>
                             </>
                           ) : (
                             <>
                               <CheckCircle className="w-4 h-4" />
                               <span>Confirm Follow</span>
                             </>
                           )}
                        </button>

                        <button
                          onClick={handleFollowInstagram}
                          className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-[#1a237e] text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-all border border-[#1a237e]"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Re-Open Instagram</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: DOWNLOAD */}
                  {step === 'download' && downloadReady && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-4">
                         <div className="w-20 h-20 rounded-full border-4 double border-[#DAA520] flex items-center justify-center mx-auto bg-[#fff9f0] shadow-xl">
                            <Award className="w-10 h-10 text-[#DAA520]" />
                         </div>
                      </div>
                      <h2 className="font-cinzel text-3xl font-bold text-[#1a237e] mb-2">Certificate Granted</h2>
                      <p className="font-serif text-gray-600 italic mb-8">
                        "This document serves as efficient proof of your completion."
                      </p>
                      
                      {error && (
                         <div className="mb-4 text-xs font-bold text-red-600 bg-red-50 p-2 border border-red-200">
                           {error}
                         </div>
                      )}

                      <div className="flex flex-col gap-4 w-full">
                        <button
                          onClick={generateCertificate}
                          disabled={loading}
                          className={`group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#c0392b] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#a93226] transition-all shadow-lg border-2 border-[#fff] outline outline-2 outline-[#c0392b] ${loading ? 'opacity-70' : ''}`}
                        >
                           {loading ? (
                             <>
                               <Loader2 className="w-5 h-5 animate-spin" />
                               <span>Scribing Document...</span>
                             </>
                           ) : (
                             <>
                               <Download className="w-5 h-5" />
                               <span>Download Certificate (PDF)</span>
                               <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
                             </>
                           )}
                        </button>
                        
                        <button
                          onClick={() => router.push('/')}
                          className="text-xs font-bold text-[#1a237e] uppercase tracking-widest hover:underline decoration-1 underline-offset-4"
                        >
                          Return to Registry
                        </button>
                      </div>
                      
                      <div className="mt-8 flex items-center justify-center gap-2 text-[#DAA520] opacity-80">
                         <Shield className="w-4 h-4" />
                         <span className="text-[10px] uppercase tracking-widest font-bold">Securely Signed</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

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

// Helper icon component since 'Users' was imported but might need local definition if lucide version varies
function Users({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
