'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { GraduationCap, Calendar, MapPin, Clock, Award, Users } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const seatNumbers = searchParams.get('seats') || 'N/A';
  const totalSeats = searchParams.get('total') || '0';
  const studentName = searchParams.get('student') || 'Graduate';
  const course = searchParams.get('course') || 'Program';
  const batch = searchParams.get('batch') || '2024';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Main Program Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-8 px-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
            </div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <GraduationCap className="w-16 h-16 text-amber-300" />
                </div>
              </div>
              <p className="text-amber-200 text-sm font-semibold tracking-widest mb-2">PROGRAM / LEAFLET</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Graduation Ceremony
              </h1>
              <p className="text-white/90 text-lg">BrandMonk Academy</p>
            </div>
          </div>

          {/* Date Banner */}
          <div className="bg-amber-400 py-4 px-8 text-center">
            <p className="text-2xl font-bold text-indigo-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Congratulations */}
            <div className="text-center border-b-2 border-indigo-200 pb-8">
              <p className="text-sm text-indigo-600 font-semibold mb-2">CONGRATULATIONS</p>
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {studentName}
              </h2>
              <p className="text-lg text-slate-700">
                <span className="font-semibold">{course}</span> • Batch {batch}
              </p>
            </div>

            {/* Your Seats */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-amber-900">Your Seat Numbers</h3>
                </div>
                <div className="bg-white rounded-xl p-4 mb-3 border-2 border-amber-300">
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    {seatNumbers}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-amber-800">
                  <Users className="w-5 h-5" />
                  <p className="font-semibold">Total Seats Booked: <span className="text-2xl font-black">{totalSeats}</span></p>
                </div>
              </div>
            </div>

            {/* Program Schedule */}
            <div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center pb-3 border-b-2 border-indigo-200" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ceremony Schedule
              </h3>
              <div className="space-y-3">
                {[
                  { time: '10:00 AM', event: 'Opening Procession', desc: 'Academic Procession – Entrance of Graduates & Faculty' },
                  { time: '10:15 AM', event: 'Welcome Address', desc: 'Dr. Mukilan Palanisamy – CEO, BrandMonk Academy' },
                  { time: '10:30 AM', event: 'Keynote Speech', desc: 'Industry Leader – Innovation & Digital Excellence' },
                  { time: '11:00 AM', event: 'Presentation of Degrees', desc: 'Conferring of Diplomas & Awards by Dean' },
                  { time: '12:30 PM', event: 'Valedictorian Speech', desc: 'Top Graduate – Class of ' + batch },
                  { time: '1:00 PM', event: 'Special Performances', desc: 'Live Music & Cultural Celebration' },
                  { time: '1:30 PM', event: 'Closing Remarks', desc: 'Vote of Thanks – Vice-Chancellor' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white rounded-lg border border-indigo-100 hover:shadow-md transition">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-100 rounded-lg px-3 py-2">
                        <p className="text-sm font-bold text-indigo-900">{item.time}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-indigo-900 mb-1">{item.event}</p>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">Venue Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-purple-900">Grand Hall, BrandMonk Academy</p>
                    <p className="text-sm text-slate-600">Chennai, Tamil Nadu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-purple-900">Reporting Time</p>
                    <p className="text-sm text-slate-600">9:30 AM - Gates Open</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Important Information
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>Please arrive 30 minutes before the ceremony begins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>Carry your seat numbers and valid ID for entry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>Formal attire is recommended for graduates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>Light refreshments will be served after the ceremony</span>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t-2 border-indigo-200">
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                We're Proud of You! 🌟
              </p>
              <p className="text-slate-600 mb-6">Join us in celebrating this momentous achievement</p>
              
              {/* Social & Contact */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">📧</span> info@brandmonkacademy.com
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">#</span>BrandMonkGrad{batch}
                </div>
              </div>

              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3 text-center">
            <p className="text-white font-semibold text-sm">
              BrandMonk Academy © {new Date().getFullYear()} • Empowering Future Leaders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GraduationSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-indigo-900 text-xl">Loading your graduation details...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
