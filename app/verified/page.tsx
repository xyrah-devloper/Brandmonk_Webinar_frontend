'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Award, CheckCircle, Ticket, ArrowLeft, Sparkles,
  User, Mail, Phone, BookOpen
} from 'lucide-react';

function VerifiedContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const student = useMemo(() => ({
    name: searchParams.get('name') || 'Student',
    email: searchParams.get('email') || '',
    mobile: searchParams.get('mobile') || '',
    courseName: searchParams.get('courseName') || '24th Graduation Function',
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
    document.body.style.setProperty('overflow-y', 'hidden', 'important');
    document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
    document.documentElement.style.setProperty('overflow-y', 'hidden', 'important');
    document.body.style.setProperty('height', '100vh', 'important');
    document.documentElement.style.setProperty('height', '100vh', 'important');

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
      className="pass-wrapper h-screen w-full relative flex flex-col items-center justify-between py-6 px-4 overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #FFFDF7 0%, #FAF6EC 35%, #F0E6D0 70%, #E8DAB8 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        html, body {
          background-color: #FAF6EC !important;
          overflow: hidden !important;
          overflow-x: hidden !important;
          overflow-y: hidden !important;
          height: 100vh !important;
          max-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Screen-height based responsive adjustments to prevent overflow/scrolling */
        @media (max-height: 850px) {
          .pass-wrapper {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
          .badge-container {
            width: 64px !important;
            height: 64px !important;
            margin-bottom: 8px !important;
          }
          .badge-container svg {
            width: 32px !important;
            height: 32px !important;
          }
          .main-heading {
            font-size: 26px !important;
            margin-bottom: 4px !important;
          }
          .sub-text {
            font-size: 13px !important;
            margin-bottom: 16px !important;
          }
          .ticket-card {
            max-width: 390px !important;
          }
          .ticket-header {
            padding: 14px 20px !important;
          }
          .ticket-header h2 {
            font-size: 20px !important;
          }
          .ticket-body {
            padding: 16px 20px !important;
            gap: 10px !important;
          }
          .details-list {
            gap: 8px !important;
          }
          .barcode-container {
            height: 26px !important;
          }
          .return-btn {
            height: 48px !important;
            margin-top: 14px !important;
            max-width: 390px !important;
          }
        }

        @media (max-height: 740px) {
          .pass-wrapper {
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }
          .badge-container {
            width: 52px !important;
            height: 52px !important;
            margin-bottom: 6px !important;
          }
          .badge-container svg {
            width: 26px !important;
            height: 26px !important;
          }
          .main-heading {
            font-size: 22px !important;
            margin-bottom: 2px !important;
          }
          .sub-text {
            font-size: 12px !important;
            margin-bottom: 12px !important;
          }
          .ticket-card {
            max-width: 330px !important;
          }
          .ticket-header {
            padding: 10px 14px !important;
          }
          .ticket-header h2 {
            font-size: 18px !important;
          }
          .ticket-body {
            padding: 12px 16px !important;
            gap: 6px !important;
          }
          .details-list {
            gap: 6px !important;
          }
          .details-list svg {
            width: 14px !important;
            height: 14px !important;
          }
          .barcode-container {
            height: 20px !important;
          }
          .return-btn {
            height: 42px !important;
            margin-top: 10px !important;
            max-width: 330px !important;
            font-size: 13px !important;
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
        }

        @media (max-height: 640px) {
          .pass-wrapper {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
          }
          .badge-container {
            display: none !important;
          }
          .main-heading {
            font-size: 18px !important;
            margin-bottom: 2px !important;
          }
          .sub-text {
            font-size: 10.5px !important;
            margin-bottom: 8px !important;
          }
          .ticket-card {
            max-width: 290px !important;
          }
          .ticket-header {
            padding: 8px 12px !important;
          }
          .ticket-header h2 {
            font-size: 15px !important;
          }
          .ticket-body {
            padding: 8px 12px !important;
            gap: 4px !important;
          }
          .details-list {
            gap: 4px !important;
          }
          .barcode-container {
            height: 16px !important;
          }
          .return-btn {
            height: 36px !important;
            margin-top: 8px !important;
            max-width: 290px !important;
            font-size: 12px !important;
          }
        }
      `}} />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#FFE066]/12 rounded-full blur-[160px]" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#FFF2B2]/40 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-[#D4AF37]/15 to-transparent rounded-full blur-[80px]" />
      </div>

      {/* Confetti Blast */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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

      {/* Main Container */}
      <motion.div
        className="relative z-10 w-full max-w-[520px] flex-1 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Top circular sparkles badge */}
        <div className="badge-container relative inline-flex items-center justify-center mb-5 z-20 w-20 h-20">
          <div className="absolute inset-0 bg-[#D4AF37]/25 blur-xl rounded-full scale-150" />
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-[#D4AF37]/50 shadow-lg animate-twinkle">
            <Sparkles className="w-10 h-10 text-[#D4AF37]" />
          </div>
        </div>

        {/* Header Text */}
        <h1
          className="main-heading text-[30px] md:text-[38px] leading-[1.1] font-bold text-[#4D1010] mb-2 tracking-tight text-center font-serif"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Boarding Pass
        </h1>

        <p className="sub-text text-[#6E5945] text-sm md:text-base font-semibold text-center mb-6 max-w-[380px] leading-relaxed">
          Your registration has been confirmed successfully.
        </p>

        {/* Ticket Container */}
        <div
          id="boarding-pass-card"
          className="ticket-card w-full max-w-[460px] bg-white rounded-[28px] overflow-hidden border border-[#D4AF37]/35 shadow-2xl relative"
        >
          {/* Ticket Header */}
          <div className="ticket-header bg-gradient-to-br from-[#4D1010] to-[#1E0303] px-6 py-4.5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[10px] font-extrabold tracking-[0.2em] uppercase">
                  Boarding Pass
                </span>
              </div>
              <Ticket className="w-6 h-6 text-[#D4AF37]" />
            </div>

            <h2
              className="text-white font-bold text-xl tracking-wide font-serif"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Boarding Pass
            </h2>
          </div>

          {/* Perforated Separator with Side Cuts */}
          <div className="relative h-5 bg-white flex items-center overflow-hidden">
            {/* Left Cutout */}
            <div
              className="absolute -left-3 w-5 h-5 bg-[#FAF6EC] border border-[#D4AF37]/20 rounded-full z-10"
              style={{ boxShadow: 'inset -3px 0 5px rgba(30,3,3,0.04)' }}
            />
            {/* Right Cutout */}
            <div
              className="absolute -right-3 w-5 h-5 bg-[#FAF6EC] border border-[#D4AF37]/20 rounded-full z-10"
              style={{ boxShadow: 'inset 3px 0 5px rgba(30,3,3,0.04)' }}
            />
            {/* Dashed line */}
            <div className="w-full border-t border-dashed border-[#4D1010]/20 mx-4" />
          </div>

          {/* Ticket Body */}
          <div className="ticket-body bg-white px-7 pb-6 pt-1.5 text-left flex flex-col justify-center gap-4">
            {/* Verification Success Badge */}
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-6 h-6 rounded-full bg-[#4D1010] flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <span
                className="text-[#4D1010] font-bold text-[11px] uppercase tracking-[0.12em] font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Boarding Pass
              </span>
            </div>

            {/* Details List */}
            <div className="details-list flex flex-col gap-3 text-xs md:text-sm">
              <div className="flex items-start gap-3">
                <User className="w-4.5 h-4.5 text-[#B8942F] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#9C8B7A] font-semibold text-[9px] uppercase tracking-wider">Student Name</p>
                  <p className="text-[#3D2B1F] font-bold">{student.name}</p>
                </div>
              </div>

              {student.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4.5 h-4.5 text-[#B8942F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[#9C8B7A] font-semibold text-[9px] uppercase tracking-wider">Email</p>
                    <p className="text-[#3D2B1F] font-bold">{student.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Phone className="w-4.5 h-4.5 text-[#B8942F] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#9C8B7A] font-semibold text-[9px] uppercase tracking-wider">Mobile Number</p>
                  <p className="text-[#3D2B1F] font-bold">{student.mobile}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="w-4.5 h-4.5 text-[#B8942F] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#9C8B7A] font-semibold text-[9px] uppercase tracking-wider">Course Name</p>
                  <p
                    className="text-[#4D1010] font-bold font-serif"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {student.courseName}
                  </p>
                </div>
              </div>

            </div>

            {/* Note */}
            <div className="text-center pt-2 border-t border-[#4D1010]/5">
              <p
                className="text-[#4D1010] text-[12px] font-bold italic font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Congratulations on your achievement!
              </p>
              <p
                className="text-[#D4AF37] text-[9px] mt-0.5 tracking-[0.18em] uppercase font-bold font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Brand Monk Academy
              </p>
            </div>

            {/* Barcode Section */}
            <div className="pt-2 border-t border-[#4D1010]/5 bg-[#4D1010]/3">
              <div className="barcode-container h-8 bg-[repeating-linear-gradient(90deg,_#4D1010_0px,_#4D1010_1.5px,_transparent_1.5px,_transparent_3px)] opacity-35 rounded" />
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          href="/verifystudent"
          className="return-btn w-full max-w-[460px] mt-6 inline-flex items-center justify-center gap-2 text-sm font-extrabold text-[#4D1010] hover:text-[#7B2D2D] bg-white border border-gray-200/80 px-8 py-3.5 rounded-full shadow-md hover:shadow hover:scale-[1.01] transition-all"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Verify Another Mobile Number
        </Link>
      </motion.div>

      {/* Footer copyright */}
      <div className="relative z-10 mt-4 mb-2 px-5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#D4AF37]/35 shadow-sm text-center">
        <p className="text-[10px] md:text-[11px] font-semibold text-[#5B1A1A]/90 tracking-wide">
          © 2026 Brand Monk Academy. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

function VerifiedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6EC]">
          <div className="text-[#4D1010] font-serif text-lg font-semibold animate-pulse">
            Loading...
          </div>
        </div>
      }
    >
      <VerifiedContent />
    </Suspense>
  );
}

export default VerifiedPage;
