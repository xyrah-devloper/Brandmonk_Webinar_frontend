'use client';

import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/utils/config';
import { Loader2, CheckCircle, XCircle, Ticket, ShieldCheck, Lock, Phone, Clock, Zap, HelpCircle } from 'lucide-react';

export default function VerifyStudentPage() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/verify-student`, { mobile });
      if (res.data.success) {
        setResult(res.data.student);
      } else {
        setError(res.data.message || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle background shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-800/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-24 h-24 bg-amber-300/10 rounded-full blur-2xl" />
      <div className="absolute top-10 right-20 w-16 h-16 bg-yellow-200/30 rounded-full blur-xl" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Header */}
        <div className="bg-[#7B3F00] rounded-t-3xl px-6 pt-6 pb-16 text-center relative overflow-hidden">
          {/* Logo */}
          <div className="mb-6 flex justify-start">
            <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center border border-white/30 shadow-sm">
              <img
                src="/logo%20(2).avif"
                alt="BrandMonk Academy"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12 bg-amber-300/60" />
              <p className="text-amber-200 text-[11px] font-semibold tracking-[0.2em] uppercase font-serif">
                24th Graduation Function
              </p>
              <div className="h-px w-12 bg-amber-300/60" />
            </div>

            <h1 className="text-3xl font-bold text-white font-serif tracking-wide mb-2">
              Student Verification
            </h1>
            <p className="text-amber-100/80 text-sm max-w-[300px] mx-auto leading-relaxed">
              Please verify your registered mobile number to access your course details.
            </p>
          </div>
        </div>

        {/* White card overlapping header */}
        <div className="bg-white rounded-t-[2.5rem] rounded-b-3xl shadow-2xl -mt-10 px-6 pt-10 pb-8 relative">
          {/* Center badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-[#FAF6EF]">
              <ShieldCheck className="w-6 h-6 text-[#7B3F00]" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">Mobile Number</label>
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#7B3F00] focus-within:border-[#7B3F00] transition-all bg-white">
                <div className="flex items-center gap-2 px-3 py-3.5 bg-stone-50 border-r border-stone-200 text-stone-700 select-none">
                  <span className="text-[10px] font-bold text-stone-500">IN</span>
                  <span className="text-sm font-medium">+91</span>
                  <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="flex-1 px-4 py-3.5 outline-none text-stone-800 placeholder-stone-400 bg-transparent"
                  required
                />
                <Phone className="w-5 h-5 text-stone-400 mr-4" />
              </div>
              <p className="text-stone-500 text-xs mt-2">Enter the mobile number you used during registration.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7B3F00] hover:bg-[#6A3500] disabled:bg-[#A67C52] text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-amber-900/20"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Verifying...</>
              ) : (
                <><ShieldCheck className="w-5 h-5 mr-2" /> Verify Mobile Number</>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-stone-400 text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Support link */}
          <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
            <HelpCircle className="w-4 h-4 text-stone-400" />
            <span>Need help? <a href="#" className="text-[#7B3F00] font-semibold hover:underline">Contact support</a></span>
          </div>
        </div>

        {/* Bottom features */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center p-3">
            <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2">
              <Lock className="w-4 h-4 text-[#7B3F00]" />
            </div>
            <p className="text-stone-800 text-xs font-semibold">Secure & Private</p>
            <p className="text-stone-500 text-[10px] mt-0.5">Your information is protected</p>
          </div>
          <div className="text-center p-3">
            <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4 text-[#7B3F00]" />
            </div>
            <p className="text-stone-800 text-xs font-semibold">Quick Verification</p>
            <p className="text-stone-500 text-[10px] mt-0.5">Takes less than 30 seconds</p>
          </div>
          <div className="text-center p-3">
            <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2">
              <Zap className="w-4 h-4 text-[#7B3F00]" />
            </div>
            <p className="text-stone-800 text-xs font-semibold">Instant Access</p>
            <p className="text-stone-500 text-[10px] mt-0.5">Get your course details instantly</p>
          </div>
        </div>

        {/* Ticket Result */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-[#7B3F00] px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-amber-200 text-[10px] font-semibold tracking-widest uppercase font-serif">Entry Pass</p>
                <h2 className="text-white font-bold text-xl font-serif tracking-wide">Graduation Ticket</h2>
              </div>
              <Ticket className="w-8 h-8 text-amber-300" />
            </div>

            <div className="relative h-4 bg-[#FAF6EF]">
              <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-stone-300" />
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FAF6EF] rounded-full" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FAF6EF] rounded-full" />
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-[#7B3F00]" />
                <span className="text-[#7B3F00] font-bold text-sm uppercase tracking-wide font-serif">Verified</span>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-y-4 text-sm">
                <span className="text-stone-500 font-medium">Name</span>
                <span className="text-stone-900 font-bold text-right">{result.name}</span>

                <span className="text-stone-500 font-medium">Mobile</span>
                <span className="text-stone-900 font-semibold text-right">{result.mobile}</span>

                <span className="text-stone-500 font-medium">Course</span>
                <span className="text-[#7B3F00] font-bold text-right">{result.courseName}</span>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-200">
                <p className="text-center text-stone-700 text-sm font-medium font-serif italic">
                  Congratulations on your achievement.
                </p>
                <p className="text-center text-stone-500 text-xs mt-1 font-serif tracking-wider uppercase">
                  BrandMonk Academy
                </p>
              </div>
            </div>

            <div className="bg-stone-100 px-6 py-3 border-t border-stone-200">
              <div className="h-8 bg-[repeating-linear-gradient(90deg,_#444_0px,_#444_2px,_transparent_2px,_transparent_4px)] opacity-40" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
