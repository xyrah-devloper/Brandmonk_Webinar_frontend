'use client';

import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/utils/config';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Verification</h1>
          <p className="text-slate-500 mt-2">Enter your mobile number to verify your course details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Verifying...</>
            ) : (
              'Verify'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-bold text-emerald-900">Verified Successfully</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                <p className="text-lg font-semibold text-slate-900">{result.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Mobile Number</p>
                <p className="text-lg font-semibold text-slate-900">{result.mobile}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Course</p>
                <p className="text-lg font-semibold text-slate-900">{result.courseName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
