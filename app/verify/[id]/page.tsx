'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  Award,
  Calendar,
  User,
  BookOpen,
  Loader2,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { API_URL } from '@/utils/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VerifyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/students/${resolvedParams.id}`);
        if (res.data.success) {
          setStudent(res.data.student);
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.response?.data?.message || 'Certificate not found');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [resolvedParams.id]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="animated-bg" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Verifying certificate...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 mb-8">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Certificate Not Found
              </h1>
              <p className="text-gray-400 mb-8">
                {error}
              </p>
              <a href="/" className="btn-primary inline-flex">
                Go to Registration
              </a>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mb-8 floating pulse-glow">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                <span className="gradient-text">Certificate Verified!</span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-8">
                This certificate is authentic and valid.
              </p>

              <div className="glass-card p-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Certificate Holder</p>
                      <p className="text-white font-semibold text-lg">{student.name}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Webinar/Course</p>
                      <p className="text-white font-semibold">{student.webinarName}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Certificate ID</p>
                      <p className="text-indigo-400 font-mono font-bold">{student.certificateId}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Issue Date</p>
                      <p className="text-white font-semibold">
                        {new Date(student.dateOfRegistration || student.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <p className="text-green-300 text-sm">
                    This certificate has been verified as authentic by Brand Monk Academy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
