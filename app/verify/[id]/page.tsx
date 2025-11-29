'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { CheckCircle, XCircle, Loader2, ShieldCheck, Calendar, BookOpen, User, AlertCircle } from 'lucide-react';

export default function VerifyCertificate() {
  const params = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`https://brandmonk-backend.onrender.com/api/students/${params.id}`);
        if (res.data.success) {
          setStudent(res.data.student);
        }
      } catch (err) {
        setError('Invalid Certificate ID. This certificate does not exist in our records.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id && params.id !== 'undefined') {
      fetchStudent();
    } else if (params.id === 'undefined') {
      setLoading(false);
      setError('Invalid Certificate Link. Please regenerate your certificate.');
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
          {/* Top Accent Bar */}
          <div className={`h-2 w-full ${loading ? 'bg-gray-200' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-10 w-10 text-gray-900 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Verifying authenticity...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <div className="mx-auto h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">{error}</p>
              <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-400 font-mono break-all">
                ID: {params.id}
              </div>
            </div>
          ) : (
            <div>
              <div className="p-8 text-center border-b border-gray-100 bg-gray-50/50">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 ring-8 ring-green-50">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Valid Certificate</h2>
                <p className="text-gray-500 mt-1 text-sm">This certificate is authentic and issued by Brand Monk Academy.</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-gray-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Issued To</p>
                    <p className="text-base font-bold text-gray-900">{student.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-gray-700">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Course</p>
                    <p className="text-base font-bold text-gray-900">{student.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-gray-700">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Issue Date</p>
                    <p className="text-base font-bold text-gray-900">
                      {new Date(student.createdAt || student.dateOfCompletion).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                    <ShieldCheck className="h-3 w-3" />
                    Secure Verification System
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
