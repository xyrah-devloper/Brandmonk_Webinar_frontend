'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Award, Calendar, BookOpen } from 'lucide-react';
import { API_URL } from '@/utils/config';

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
        const joinedId = Array.isArray(id)
          ? id.map(segment => decodeURIComponent(segment)).join('/')
          : decodeURIComponent(id || '');

        if (!joinedId) return;

        // Some QR/filenames use underscores instead of slashes (e.g. BMAJUNDMMES_Q0506S306)
        const certificateId = joinedId.replace(/_/g, '/');

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
              {decodeURIComponent(Array.isArray(id) ? id.join('/') : id || '')}
            </span>{' '}
            could not be verified.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = student?.dateOfRegistration
    ? new Date(student.dateOfRegistration).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'Date not available';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header with Logos */}
        <div className="bg-white border-b-2 border-emerald-600 px-6 py-5">
          <div className="flex items-center justify-center gap-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/3/3e/Skill_India.png"
              className="h-14 object-contain"
              alt="Skill India"
            />
            <div className="w-px h-10 bg-slate-300"></div>
            <img
              src="https://pibindia.wordpress.com/wp-content/uploads/2016/10/nsdc-logo.png"
              className="h-14 object-contain"
              alt="NSDC"
            />
            <div className="w-px h-10 bg-slate-300"></div>
            <img
              src="https://www.itrc.co.in/thumbnail.php?file=abstract-images/mesc.jpg&size=article_large"
              className="h-14 object-contain"
              alt="MESC"
            />
          </div>
        </div>

        <div className="px-8 py-10">
          {/* Verified Badge */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-sm font-semibold text-xs tracking-[0.2em] uppercase">
              <Award className="w-4 h-4" />
              VERIFIED CERTIFICATE
            </div>
          </div>

          {/* Student Info */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {student.name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              has successfully completed
            </p>
          </div>

          {/* Course Details */}
          <div className="bg-slate-50 rounded-none p-5 space-y-4 mb-6 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] font-semibold">
                  Course
                </p>
                <p className="font-semibold text-slate-900">
                  {student.courseName}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-200"></div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-700 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] font-semibold">
                  Certificate ID
                </p>
                <p className="font-mono font-semibold text-slate-900 text-sm">
                  {student.certificateId}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-200"></div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] font-semibold">
                  Date Issued
                </p>
                <p className="font-semibold text-slate-900 text-sm">
                  {formattedDate}
                </p>
              </div>
            </div> 
          </div>

          {/* Footer */}
          <div className="text-center pt-5 border-t border-slate-200">
            <p className="text-[11px] text-slate-400 tracking-wide">
              This certificate has been verified and is authentic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
