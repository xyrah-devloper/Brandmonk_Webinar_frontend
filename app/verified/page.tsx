'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Award, CheckCircle, Ticket, ArrowLeft, Sparkles,
  User, Mail, Phone, BookOpen, FileCheck
} from 'lucide-react';

export default function VerifiedPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const student = useMemo(() => ({
    name: searchParams.get('name') || 'Student',
    email: searchParams.get('email') || '',
    mobile: searchParams.get('mobile') || '',
    courseName: searchParams.get('courseName') || '',
    certificateId: searchParams.get('certificateId') || '',
  }), [searchParams]);

  useEffect(() => {
    setMounted(true);

    const originalBodyOverflowX = document.body.style.overflowX;
    const originalBodyOverflowY = document.body.style.overflowY;
    const originalHtmlOverflowX = document.documentElement.style.overflowX;
    const originalHtmlOverflowY = document.documentElement.style.overflowY;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;

    document.body.style.setProperty('overflow-x', 'hidden', 'important');
    document.body.style.setProperty('overflow-y', 'auto', 'important');
    document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
    document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
    document.body.style.setProperty('height', 'auto', 'important');
    document.documentElement.style.setProperty('height', 'auto', 'important');

    return () => {
      document.body.style.overflowX = originalBodyOverflowX;
      document.body.style.overflowY = originalBodyOverflowY;
      document.documentElement.style.overflowX = originalHtmlOverflowX;
      document.documentElement.style.overflowY = originalHtmlOverflowY;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  const palette = {
    gold: ['#FFE066', '#FFD700', '#D4AF37', '#B8942F', '#FFF5C2', '#F0E68C'],
    burgundy: ['#4D1010', '#6B1F1F', '#7B2D2D', '#5B1A1A'],
    accent: ['#FFFFFF', '#FFF8E0', '#E8DAB8'],
  };

  const allColors = [...palette.gold, ...palette.burgundy, ...palette.accent];

  const confettiParticles = useMemo(() => {
    // Seeded-like deterministic generation using index-based math for stable SSR/hydration
    const makeBurst = (count: number, burstDelay: number) =>
      Array.from({ length: count }).map((_, i) => {
        const seed = (i + count) * 17.17;
        const angle = (i / count) * 360 + Math.sin(seed) * 30;
        const speed = 250 + Math.abs(Math.sin(seed * 1.3)) * 400;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * speed;
        const ty = Math.sin(rad) * speed - 180;
        const rotate = Math.sin(seed * 2.7) * 720;
        const size = 6 + Math.abs(Math.sin(seed * 3.1)) * 10;
        const shape = ['rect', 'circle', 'bar', 'star'][Math.floor(Math.abs(Math.sin(seed * 4.1)) * 4)] as 'rect' | 'circle' | 'bar' | 'star';
        const color = allColors[Math.floor(Math.abs(Math.sin(seed * 5.7)) * allColors.length)];
        const delay = burstDelay + Math.abs(Math.sin(seed * 6.3)) * 0.25;
        return { tx, ty, rotate, size, shape, color, delay };
      });

    return [
      ...makeBurst(90, 0),
      ...makeBurst(40, 0.25),
      ...makeBurst(30, 0.5),
    ];
  }, []);

  const floatingConfetti = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => {
      const seed = i * 13.13;
      const left = (i / 40) * 100 + Math.sin(seed) * 8;
      const size = 5 + Math.abs(Math.sin(seed * 2.1)) * 7;
      const color = allColors[Math.floor(Math.abs(Math.sin(seed * 3.5)) * allColors.length)];
      const shape = ['rect', 'circle'][Math.floor(Math.abs(Math.sin(seed * 4.2)) * 2)] as 'rect' | 'circle';
      const delay = 0.6 + Math.abs(Math.sin(seed * 5.5)) * 1.5;
      const duration = 3.5 + Math.abs(Math.sin(seed * 6.1)) * 2.5;
      const drift = -60 + Math.sin(seed * 7.7) * 120;
      return { left, size, color, shape, delay, duration, drift };
    }),
    []);

  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center justify-start pt-12 pb-10 px-4 overflow-x-hidden overflow-y-auto"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #FFFDF7 0%, #FAF6EC 35%, #F0E6D0 70%, #E8DAB8 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#FFE066]/12 rounded-full blur-[160px]" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#FFF2B2]/40 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-[#D4AF37]/15 to-transparent rounded-full blur-[80px]" />
      </div>

      {/* Confetti Blast */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Central flash */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,245,200,0.9) 0%, rgba(212,175,55,0.4) 40%, transparent 70%)' }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: '120vmax', height: '120vmax', opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
          {confettiParticles.map((p, i) => (
            <motion.div
              key={`blast-${i}`}
              className="absolute top-1/2 left-1/2 flex items-center justify-center"
              style={{
                width: p.size,
                height: p.shape === 'bar' ? p.size * 0.45 : p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: p.tx,
                y: p.ty + 180,
                opacity: 0,
                scale: 0.3,
                rotate: p.rotate,
              }}
              transition={{
                duration: 1.6,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {p.shape === 'star' ? (
                <svg viewBox="0 0 24 24" className="w-full h-full" fill={p.color}>
                  <path d="M12 2l2.9 6.26L22 9.27l-5.5 4.77L18.18 21 12 16.9 5.82 21 7.5 14.04 2 9.27l7.1-1.01L12 2z" />
                </svg>
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: p.color,
                    borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? '2px' : '9999px',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating confetti after blast */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {floatingConfetti.map((p, i) => (
            <motion.div
              key={`float-${i}`}
              className="absolute"
              style={{
                left: `${p.left}%`,
                top: '-20px',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
              }}
              initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
              animate={{
                y: ['0vh', '110vh'],
                x: [0, p.drift, p.drift * 0.5],
                opacity: [0, 1, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Success Card */}
      <motion.div
        className="relative z-10 w-full max-w-[520px]"
        initial={{ opacity: 0, scale: 0.82, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}>
        <div
          className="rounded-[32px] bg-white/95 backdrop-blur-sm relative overflow-hidden"
          style={{
            border: '2px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 40px 80px -20px rgba(30, 3, 3, 0.35), 0 0 50px 8px rgba(212, 175, 55, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
        >
          <div className="h-[4px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="px-6 py-8 md:px-10 md:py-10 text-center">
            {/* Top badge */}
            <div className="relative inline-flex items-center justify-center mb-5">
              <div className="absolute inset-0 bg-[#D4AF37]/30 blur-xl rounded-full scale-150" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FFE066] via-[#D4AF37] to-[#B8942F] p-[3px] shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Sparkles className="w-9 h-9 text-[#D4AF37]" />
                </div>
              </div>
            </div>

            <h1
              className="text-[28px] md:text-[40px] leading-[1.1] font-bold text-[#4D1010] mb-2 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Verified!
            </h1>

            <p className="text-[#6E5945] text-sm md:text-base font-semibold mb-6">
              Your registration has been confirmed successfully.
            </p>

            {/* Ticket */}
            <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/45 shadow-lg mb-6 text-left">
              <div
                className="px-5 py-4 flex items-center justify-between relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #4D1010 0%, #1E0303 100%)' }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/12 rounded-full blur-xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <p className="text-[#D4AF37] text-[9px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Entry Pass
                    </p>
                  </div>
                  <h2 className="text-white font-bold text-base tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Graduation Ticket
                  </h2>
                </div>
                <Ticket className="w-7 h-7 text-[#D4AF37] relative z-10" />
              </div>

              <div className="relative h-3 bg-white">
                <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-[#4D1010]/25" />
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FAF5EA] border-r border-[#D4AF37]/25 rounded-full" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FAF5EA] border-l border-[#D4AF37]/25 rounded-full" />
              </div>

              <div className="px-5 py-5 bg-white space-y-3.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-full bg-[#4D1010] flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[#4D1010] font-bold text-[11.5px] uppercase tracking-[0.12em]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Verification Success
                  </span>
                </div>

                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-[#B8942F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[#9C8B7A] font-semibold text-[10px] uppercase tracking-wider">Student Name</p>
                      <p className="text-[#3D2B1F] font-bold">{student.name}</p>
                    </div>
                  </div>

                  {student.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-[#B8942F] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[#9C8B7A] font-semibold text-[10px] uppercase tracking-wider">Email</p>
                        <p className="text-[#3D2B1F] font-bold">{student.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#B8942F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[#9C8B7A] font-semibold text-[10px] uppercase tracking-wider">Mobile Number</p>
                      <p className="text-[#3D2B1F] font-bold">{student.mobile}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="w-4 h-4 text-[#B8942F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[#9C8B7A] font-semibold text-[10px] uppercase tracking-wider">Course Name</p>
                      <p className="text-[#4D1010] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{student.courseName}</p>
                    </div>
                  </div>

                  {student.certificateId && (
                    <div className="flex items-start gap-3">
                      <FileCheck className="w-4 h-4 text-[#B8942F] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[#9C8B7A] font-semibold text-[10px] uppercase tracking-wider">Certificate ID</p>
                        <p className="text-[#3D2B1F] font-bold font-mono">{student.certificateId}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center pt-2 border-t border-[#4D1010]/5">
                  <p className="text-[#4D1010] text-xs font-bold italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Congratulations on your achievement!
                  </p>
                  <p className="text-[#D4AF37] text-[9.5px] mt-0.5 tracking-[0.18em] uppercase font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Brand Monk Academy
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#4D1010]/5 bg-[#4D1010]/3">
                <div className="h-7 bg-[repeating-linear-gradient(90deg,_#4D1010_0px,_#4D1010_1.5px,_transparent_1.5px,_transparent_3px)] opacity-35 rounded" />
              </div>
            </div>

            <Link
              href="/verifystudent"
              className="inline-flex items-center justify-center gap-2 text-sm font-extrabold text-[#4D1010] hover:text-[#7B2D2D] bg-white border border-gray-200/80 px-8 py-3 rounded-full shadow-sm hover:shadow hover:scale-[1.01] transition-all"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Verify Another Mobile Number
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 mt-10 md:mt-12 mb-4 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#D4AF37]/30 shadow-sm">
        <p className="text-[10px] md:text-[11px] font-semibold text-[#5B1A1A]/90 tracking-wide">
          © 2026 Brand Monk Academy. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
