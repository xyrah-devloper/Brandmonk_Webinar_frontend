'use client';

import { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import Navbar from './components/Navbar';
import { CheckCircle, Download, Loader2, Mail, ArrowRight, RefreshCw } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStudent(null);

    try {
      const res = await axios.post('http://localhost:5000/api/students/verify', { email });
      if (res.data.success) {
        setStudent(res.data.student);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = () => {
    if (!student) return;
    
    // Ensure we have an ID for verification
    if (!student._id) {
      alert("Please re-verify your email to generate a valid certificate with verification link.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 800, 600, 'F');
    
    // Border
    doc.setLineWidth(10);
    doc.setDrawColor(55, 65, 81); // Dark Gray (Professional)
    doc.rect(20, 20, 760, 560);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(55, 65, 81);
    doc.text('CERTIFICATE OF COMPLETION', 400, 120, { align: 'center' });

    // Subheader
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(100, 100, 100);
    doc.text('This certificate is proudly presented to', 400, 180, { align: 'center' });

    // Student Name
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(50);
    doc.setTextColor(30, 30, 30);
    doc.text(student.name, 400, 260, { align: 'center' });
    
    // Line under name
    doc.setLineWidth(1);
    doc.setDrawColor(200, 200, 200);
    doc.line(200, 270, 600, 270);

    // Body Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50);
    doc.text('For successfully completing the comprehensive course on', 400, 330, { align: 'center' });

    // Course Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(55, 65, 81);
    doc.text(student.course, 400, 390, { align: 'center' });

    // Date
    const date = new Date(student.dateOfCompletion).toLocaleDateString();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(120, 120, 120);
    doc.text(`Awarded on ${date}`, 400, 460, { align: 'center' });

    // Signature Area
    doc.setFontSize(12);
    doc.text('Authorized Signature', 250, 530, { align: 'center' });
    doc.text('Brand Monk Academy', 550, 530, { align: 'center' });
    
    doc.setLineWidth(1);
    doc.line(150, 510, 350, 510);
    doc.line(450, 510, 650, 510);

    // Verification Link
    const verifyUrl = `http://localhost:3000/verify/${student._id}`;
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.textWithLink('Click here to verify this certificate', 400, 570, { url: verifyUrl, align: 'center' });
    doc.setTextColor(150, 150, 150);
    doc.text(verifyUrl, 400, 585, { align: 'center' });

    doc.save(`${student.name}_Certificate.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans text-gray-900">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
          {/* Top Accent Bar */}
          <div className="h-2 bg-gray-800 w-full"></div>
          
          <div className="p-8">
            {!student ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verify your enrollment
                </h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                  Please enter the email address associated with your course registration to download your certificate.
                </p>

                <form onSubmit={handleVerify} className="space-y-5">
                  <div className="text-left">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all sm:text-sm bg-gray-50"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-xs text-gray-400">
                  Questions? Email us at <a href="mailto:support@brandmonk.com" className="text-gray-600 hover:underline">support@brandmonk.com</a>
                </div>
              </div>
            ) : (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mx-auto h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verified Successfully
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                  Welcome back, <span className="font-semibold text-gray-900">{student.name}</span>.
                  <br />
                  Your certificate for <span className="font-semibold text-gray-900">{student.course}</span> is ready.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={generateCertificate}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all hover:scale-[1.02]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </button>
                  
                  <button
                    onClick={() => setStudent(null)}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Verify another email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
