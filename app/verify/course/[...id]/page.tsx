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
    <div className="min-h-screen bg-slate-900 flex flex-col">

      {/* NAV WITH LOGOS */}
      <div className="bg-white shadow-sm py-3 flex justify-center gap-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/3/3e/Skill_India.png"
          className="h-10 object-contain"
        />
        <img
          src="https://pibindia.wordpress.com/wp-content/uploads/2016/10/nsdc-logo.png"
          className="h-10 object-contain"
        />
        <img
          src="https://www.itrc.co.in/thumbnail.php?file=abstract-images/mesc.jpg&size=article_large"
          className="h-10 object-contain"
        />
      </div>

      {/* MAIN CARD */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">

          {/* Verified Badge */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm">
              <Award className="w-4 h-4" />
              VERIFIED CERTIFICATE
            </div>
          </div>

          {/* Student Info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {student.name}
            </h1>
            <p className="text-slate-500 text-sm">
              has successfully completed
            </p>
          </div>

          {/* Course Details */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Course
                </p>
                <p className="font-semibold text-slate-900">
                  {student.courseName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Date of Certificate issued
                </p>
                <p className="font-semibold text-slate-900">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="text-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400 mb-1">Certificate ID</p>
            <p className="font-mono text-sm text-black bg-slate-100 px-3 py-2 rounded-lg inline-block">
              {student.certificateId}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-semibold">
              Verified Certificate
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
