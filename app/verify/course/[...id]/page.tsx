'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Award, Calendar, BookOpen } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface CourseStudent {
  _id: string;
  name: string;
  courseName: string;
  courseSlug: string;
  certificateId: string;
  isEligible: boolean;
  dateOfRegistration: string;
}

export default function VerifyCourseId() {
  const { id } = useParams();
  const [student, setStudent] = useState<CourseStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const certificateId = Array.isArray(id)
          ? id.map(segment => decodeURIComponent(segment)).join('/')
          : decodeURIComponent(id || '');

        if (!certificateId) return;

        const res = await axios.get(
          `${API_URL}/api/course-students/${encodeURIComponent(certificateId)}`
        );

        if (res.data.success) {
          setStudent(res.data.student);
        } else {
          setError('Certificate not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Certificate not found or invalid.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Certificate Not Found
          </h1>
          <p className="text-slate-500 mb-6">
            The certificate ID{' '}
            <span className="font-mono bg-slate-100 px-2 py-1 rounded">
              {id}
            </span>{' '}
            could not be verified.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = '8 February 2026';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Header with Logos */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/3/3e/Skill_India.png"
              className="h-10 object-contain bg-white rounded-lg px-2 py-1"
              alt="Skill India"
            />
            <img
              src="https://pibindia.wordpress.com/wp-content/uploads/2016/10/nsdc-logo.png"
              className="h-10 object-contain bg-white rounded-lg px-2 py-1"
              alt="NSDC"
            />
            <img
              src="https://www.itrc.co.in/thumbnail.php?file=abstract-images/mesc.jpg&size=article_large"
              className="h-10 object-contain bg-white rounded-lg px-2 py-1"
              alt="MESC"
            />
          </div>
        </div>

        <div className="p-8">
          {/* Verified Badge */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-2.5 rounded-full font-bold text-sm tracking-wide">
              <Award className="w-5 h-5" />
              VERIFIED CERTIFICATE
            </div>
          </div>

          {/* Student Info */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {student.name}
            </h1>
            <p className="text-slate-500">
              has successfully completed
            </p>
          </div>

          {/* Course Details */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 space-y-4 mb-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Course
                </p>
                <p className="font-bold text-slate-900 text-lg">
                  {student.courseName}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-200"></div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Certificate ID
                </p>
                <p className="font-mono font-bold text-slate-900">
                  {student.certificateId}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-200"></div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Date Issued
                </p>
                <p className="font-bold text-slate-900">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              This certificate has been verified and is authentic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
