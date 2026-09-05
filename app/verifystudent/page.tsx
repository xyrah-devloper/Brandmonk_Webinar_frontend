'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/utils/config';
import {
  Loader2, CheckCircle, XCircle, Ticket, ShieldCheck, Lock,
  Phone, Clock, Zap, HelpCircle, GraduationCap,
  ChevronDown, Star, ArrowLeft, Award, User, Mail
} from 'lucide-react';

export default function VerifyStudentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Override body/html overflow to force single screen layout
    const originalBodyOverflowX = document.body.style.overflowX;
    const originalBodyOverflowY = document.body.style.overflowY;
    const originalHtmlOverflowX = document.documentElement.style.overflowX;
    const originalHtmlOverflowY = document.documentElement.style.overflowY;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;

    document.body.style.setProperty("overflow-x", "hidden", "important");
    document.body.style.setProperty("overflow-y", "auto", "important");
    document.documentElement.style.setProperty("overflow-x", "hidden", "important");
    document.documentElement.style.setProperty("overflow-y", "auto", "important");
    document.body.style.setProperty("height", "auto", "important");
    document.documentElement.style.setProperty("height", "auto", "important");

    return () => {
      document.body.style.overflowX = originalBodyOverflowX;
      document.body.style.overflowY = originalBodyOverflowY;
      document.documentElement.style.overflowX = originalHtmlOverflowX;
      document.documentElement.style.overflowY = originalHtmlOverflowY;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/verify-student`, { name, email, mobile });
      if (res.data.success) {
        console.log('[VerifyStudent] Submission successful:', res.data);
        if (res.data.emailStatus) {
          if (res.data.emailStatus.success) {
            console.log('[VerifyStudent] Onboarding email accepted:', res.data.emailStatus);
          } else {
            console.error('[VerifyStudent] Onboarding email failed:', res.data.emailStatus);
          }
        }
        const studentData = res.data.student || {};
        const queryParams = new URLSearchParams({
          name: studentData.name || name,
          email: studentData.email || email,
          mobile: studentData.mobile || mobile,
          courseName: studentData.courseName || '24th Graduation Function',
        });
        router.push(`/verified?${queryParams.toString()}`);
      } else {
        setError(res.data.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('[VerifyStudent] Submission error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Denser gold confetti and streams scattered across the page
  const confettiParticles = [
    { top: '7%', left: '5%', width: '16px', height: '6px', rotate: '32deg', opacity: 0.85, anim: 'animate-float-slow', delay: '0s' },
    { top: '5%', left: '16%', width: '8px', height: '8px', rotate: '45deg', opacity: 0.7, anim: 'animate-float-fast', delay: '1s' },
    { top: '12%', left: '10%', width: '12px', height: '5px', rotate: '-25deg', opacity: 0.8, anim: 'animate-float-slow', delay: '2s' },
    { top: '20%', left: '20%', width: '9px', height: '9px', rotate: '15deg', opacity: 0.75, anim: 'animate-twinkle', delay: '0.5s' },
    { top: '16%', left: '27%', width: '14px', height: '6px', rotate: '55deg', opacity: 0.8, anim: 'animate-float-slow', delay: '1.5s' },
    { top: '28%', left: '3%', width: '13px', height: '5px', rotate: '-12deg', opacity: 0.75, anim: 'animate-float-fast', delay: '0.2s' },
    { top: '32%', left: '14%', width: '7px', height: '7px', rotate: '20deg', opacity: 0.65, anim: 'animate-twinkle', delay: '1.2s' },
    { top: '24%', left: '36%', width: '11px', height: '5px', rotate: '40deg', opacity: 0.8, anim: 'animate-float-slow', delay: '2.5s' },
    { top: '38%', left: '8%', width: '9px', height: '4px', rotate: '-35deg', opacity: 0.7, anim: 'animate-float-fast', delay: '0.8s' },
    { top: '44%', left: '25%', width: '14px', height: '6px', rotate: '18deg', opacity: 0.85, anim: 'animate-float-slow', delay: '3s' },

    { top: '4%', right: '28%', width: '18px', height: '7px', rotate: '-35deg', opacity: 0.8, anim: 'animate-float-slow', delay: '0.5s' },
    { top: '9%', right: '20%', width: '9px', height: '9px', rotate: '22deg', opacity: 0.8, anim: 'animate-float-fast', delay: '1.5s' },
    { top: '15%', right: '32%', width: '12px', height: '5px', rotate: '15deg', opacity: 0.7, anim: 'animate-twinkle', delay: '2.2s' },
    { top: '18%', right: '12%', width: '15px', height: '6px', rotate: '-48deg', opacity: 0.85, anim: 'animate-float-slow', delay: '0s' },
    { top: '26%', right: '4%', width: '7px', height: '7px', rotate: '10deg', opacity: 0.7, anim: 'animate-float-fast', delay: '1.8s' },
    { top: '30%', right: '26%', width: '11px', height: '5px', rotate: '30deg', opacity: 0.8, anim: 'animate-twinkle', delay: '0.9s' },
    { top: '38%', right: '16%', width: '10px', height: '10px', rotate: '-15deg', opacity: 0.7, anim: 'animate-float-slow', delay: '2.8s' },
    { top: '45%', right: '32%', width: '13px', height: '5px', rotate: '40deg', opacity: 0.85, anim: 'animate-float-fast', delay: '0.3s' },

    { bottom: '32%', left: '8%', width: '12px', height: '5px', rotate: '28deg', opacity: 0.7, anim: 'animate-float-slow', delay: '1.1s' },
    { bottom: '25%', left: '24%', width: '8px', height: '8px', rotate: '-10deg', opacity: 0.7, anim: 'animate-twinkle', delay: '0.4s' },
    { bottom: '16%', left: '14%', width: '13px', height: '5px', rotate: '42deg', opacity: 0.85, anim: 'animate-float-fast', delay: '1.7s' },
    { bottom: '10%', left: '5%', width: '9px', height: '9px', rotate: '15deg', opacity: 0.65, anim: 'animate-float-slow', delay: '0s' },
    { bottom: '34%', right: '10%', width: '14px', height: '6px', rotate: '-22deg', opacity: 0.8, anim: 'animate-float-slow', delay: '2.4s' },
    { bottom: '22%', right: '28%', width: '9px', height: '9px', rotate: '35deg', opacity: 0.7, anim: 'animate-twinkle', delay: '1.3s' },
    { bottom: '14%', right: '16%', width: '12px', height: '5px', rotate: '-15deg', opacity: 0.85, anim: 'animate-float-fast', delay: '0.7s' },
    { bottom: '7%', right: '6%', width: '8px', height: '8px', rotate: '50deg', opacity: 0.75, anim: 'animate-float-slow', delay: '1.9s' },

    // Extra varied confetti for richer distribution
    { top: '48%', left: '42%', width: '6px', height: '6px', rotate: '25deg', opacity: 0.6, anim: 'animate-twinkle', delay: '0.6s' },
    { top: '52%', right: '40%', width: '10px', height: '4px', rotate: '-28deg', opacity: 0.7, anim: 'animate-float-fast', delay: '2.1s' },
    { top: '58%', left: '18%', width: '7px', height: '7px', rotate: '40deg', opacity: 0.65, anim: 'animate-twinkle', delay: '1.4s' },
    { top: '62%', right: '22%', width: '12px', height: '5px', rotate: '15deg', opacity: 0.75, anim: 'animate-float-slow', delay: '0.1s' },
    { top: '68%', left: '38%', width: '8px', height: '8px', rotate: '-40deg', opacity: 0.6, anim: 'animate-float-fast', delay: '3.2s' },
    { bottom: '40%', left: '48%', width: '5px', height: '5px', rotate: '35deg', opacity: 0.55, anim: 'animate-twinkle', delay: '2.6s' },
    { top: '35%', right: '8%', width: '11px', height: '4px', rotate: '-18deg', opacity: 0.7, anim: 'animate-float-slow', delay: '1.6s' },
    { top: '42%', left: '6%', width: '9px', height: '9px', rotate: '55deg', opacity: 0.65, anim: 'animate-twinkle', delay: '0.3s' },
  ];

  return (
    <div
      className="main-wrapper min-h-screen h-auto w-full overflow-y-auto overflow-x-hidden relative flex flex-col justify-start items-center py-5 px-4 pb-12 select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #FFFDF7 0%, #FAF6EC 35%, #F0E6D0 70%, #E8DAB8 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ====== GLOBAL SCROLL OVERRIDE & PREMIUM KEYFRAME ANIMATIONS ====== */}
      <style dangerouslySetInnerHTML={{
        __html: `
        html, body {
          background-color: #1E0303 !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          height: auto !important;
          min-height: 100vh !important;
          max-height: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        * {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Gold glitter floating, drifting, and twinkling animations */
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); filter: brightness(1.2); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(8deg); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-12deg); }
        }

        .animate-twinkle {
          animation: twinkle 3s infinite ease-in-out;
        }

        .animate-float-slow {
          animation: float-slow 7s infinite ease-in-out;
        }

        .animate-float-fast {
          animation: float-fast 5s infinite ease-in-out;
        }

        /* Responsive Scaling based on Screen Height to prevent any overflow clipping */
        @media (max-height: 850px) {
          .main-wrapper {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
          .logo-branding-container {
            top: 14px !important;
            gap: 10px !important;
          }
          .logo-container {
            width: 120px !important;
            height: 120px !important;
          }
          .logo-text {
            font-size: 15px !important;
          }
          .cap-container {
            top: 12px !important;
            right: 12px !important;
            width: 200px !important;
            height: 170px !important;
          }
          .main-content-column {
            padding-top: 24px !important;
            gap: 12px !important;
          }
          .hero-heading {
            font-size: 36px !important;
          }
          .hero-subtitle {
            font-size: 13px !important;
          }
          .verification-card {
            padding: 28px 32px !important;
          }
          .input-container {
            height: 56px !important;
          }
          .verify-button {
            height: 54px !important;
          }
          .features-bar {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
          .features-icon-badge {
            width: 32px !important;
            height: 32px !important;
          }
        }

        @media (max-height: 720px) {
          .main-wrapper {
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }
          .logo-branding-container {
            top: 10px !important;
          }
          .logo-container {
            width: 110px !important;
            height: 110px !important;
          }
          .logo-text {
            font-size: 13px !important;
          }
          .cap-container {
            width: 160px !important;
            height: 135px !important;
          }
          .main-content-column {
            padding-top: 16px !important;
            gap: 8px !important;
          }
          .laurel-badge-wrapper {
            margin-bottom: 4px !important;
            scale: 0.85;
          }
          .hero-heading {
            font-size: 30px !important;
          }
          .hero-subtitle {
            font-size: 12px !important;
            margin-bottom: 4px !important;
          }
          .verification-card {
            padding: 20px 24px !important;
            border-radius: 28px !important;
          }
          .input-container {
            height: 48px !important;
          }
          .verify-button {
            height: 46px !important;
          }
          .features-bar {
            padding-top: 8px !important;
            padding-bottom: 8px !important;
            border-radius: 16px !important;
          }
          .features-icon-badge {
            width: 28px !important;
            height: 28px !important;
          }
          .features-title-text {
            font-size: 9.5px !important;
          }
        }

        @media (max-height: 680px) {
          .main-wrapper {
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
          .logo-branding-container {
            top: 6px !important;
            scale: 0.85;
          }
          .cap-container {
            width: 130px !important;
            height: 110px !important;
            top: 6px !important;
            right: 12px !important;
          }
          .main-content-column {
            padding-top: 48px !important;
            gap: 6px !important;
          }
          .laurel-badge-wrapper {
            margin-bottom: 2px !important;
            scale: 0.7;
          }
          .hero-heading {
            font-size: 22px !important;
            margin-bottom: 1px !important;
          }
          .hero-subtitle {
            font-size: 11px !important;
            margin-bottom: 2px !important;
          }
          .verification-card {
            padding: 16px 22px !important;
            border-radius: 22px !important;
          }
          .input-container {
            height: 42px !important;
          }
          .verify-button {
            height: 40px !important;
          }
          .features-bar {
            padding-top: 6px !important;
            padding-bottom: 6px !important;
            border-radius: 12px !important;
          }
          .features-icon-badge {
            width: 24px !important;
            height: 24px !important;
          }
          .features-title-text {
            font-size: 9px !important;
          }
        }

        @media (max-width: 480px) {
          .verification-card {
            border-radius: 20px !important;
          }
          .input-container {
            padding-left: 0px !important;
            padding-right: 0px !important;
            height: 60px !important;
          }
          .input-container input {
            font-size: 15px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
          .verify-button {
            height: 54px !important;
            border-radius: 14px !important;
          }
          .verify-button span {
            font-size: 15px !important;
          }
          .logo-branding-container {
            top: 10px !important;
            left: 10px !important;
          }
          .logo-container {
            width: 52px !important;
            height: 52px !important;
          }
        }

        @media (max-width: 767px) {
          .cap-container {
            width: 110px !important;
            height: 90px !important;
            top: 12px !important;
            right: 12px !important;
          }
        }
      `}} />

      {/* ====== LUXURY LIGHTING & BLOOM EFFECTS ====== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Top warm spotlight */}
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#FFF2B2]/45 to-transparent rounded-full blur-[120px]" />
        {/* Center warm radial glow behind content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#FFE066]/12 rounded-full blur-[160px]" />
        {/* Bottom warm bloom */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#D4AF37]/15 to-transparent rounded-full blur-[100px]" />
        {/* Subtle ivory wash from left */}
        <div className="absolute top-[20%] left-[-5%] w-[500px] h-[700px] bg-gradient-to-r from-[#FFF8E0]/30 to-transparent rounded-full blur-[120px]" />
        {/* Subtle ivory wash from right */}
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[700px] bg-gradient-to-l from-[#FFF8E0]/30 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* ====== BACKGROUND CORNER RIBBONS ====== */}
      <div className="pointer-events-none absolute -left-0 -right-0 -top-0 -bottom-2 overflow-hidden z-0">
        <svg className="w-full h-[calc(100%+8px)]" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="burgundyGrad1" x1="720" y1="900" x2="720" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E0303" />
              <stop offset="50%" stopColor="#3F0A0A" />
              <stop offset="100%" stopColor="#5B1A1A" />
            </linearGradient>
            <linearGradient id="burgundyGrad2" x1="720" y1="900" x2="720" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2E0606" />
              <stop offset="50%" stopColor="#4D1010" />
              <stop offset="100%" stopColor="#6B1F1F" />
            </linearGradient>
            <linearGradient id="burgundyGrad3" x1="720" y1="900" x2="720" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3A0808" />
              <stop offset="50%" stopColor="#5B1A1A" />
              <stop offset="100%" stopColor="#7B2D2D" />
            </linearGradient>
            <linearGradient id="goldBorderGrad" x1="0" y1="450" x2="1440" y2="450" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B8942F" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#FFF5C2" />
              <stop offset="75%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8942F" />
            </linearGradient>
            <linearGradient id="goldReflect" x1="0" y1="450" x2="1440" y2="450" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#FFF5C2" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FFEAA5" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#FFF5C2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Desktop View Elements */}
          <g className="hidden md:block">
            {/* Outer U-Shape Burgundy Frame - darkest layer */}
            <path d="M 0,0 L 0,110 A 720 720 0 0 0 720 830 A 720 720 0 0 0 1440 110 L 1440,0 L 1440,900 L 0,900 Z" fill="url(#burgundyGrad1)" />

            {/* Second layer - slightly inset, lighter burgundy for depth */}
            <path d="M 0,0 L 0,120 A 710 710 0 0 0 720 820 A 710 710 0 0 0 1440 120 L 1440,0 L 1440,900 L 0,900 Z" fill="url(#burgundyGrad2)" opacity="0.6" />

            {/* Third layer - innermost, lightest for multi-layered depth */}
            <path d="M 0,0 L 0,130 A 700 700 0 0 0 720 810 A 700 700 0 0 0 1440 130 L 1440,0 L 1440,900 L 0,900 Z" fill="url(#burgundyGrad3)" opacity="0.3" />

            {/* U-Shape Shadow layer */}
            <path d="M 0,110 A 720 720 0 0 0 720 830 A 720 720 0 0 0 1440 110 L 1440,900 L 0,900 Z" fill="#250505" opacity="0.35" />

            {/* Triple Gold Borders along the U-Shape - outer thick */}
            <path d="M 0,110 A 720 720 0 0 0 720 830 A 720 720 0 0 0 1440 110" stroke="url(#goldBorderGrad)" strokeWidth="7" fill="none" />
            {/* Gold reflection sheen */}
            <path d="M 0,110 A 720 720 0 0 0 720 830 A 720 720 0 0 0 1440 110" stroke="url(#goldReflect)" strokeWidth="4" fill="none" opacity="0.6" />
            {/* Inner thin bright gold line */}
            <path d="M 0,110 A 720 720 0 0 0 720 830 A 720 720 0 0 0 1440 110" stroke="#FFF5D6" strokeWidth="2.2" strokeOpacity="0.9" fill="none" />
            {/* Outer offset gold line for secondary double-border effect */}
            <path d="M 0,98 A 732 732 0 0 0 720 842 A 732 732 0 0 0 1440 98" stroke="#D4AF37" strokeWidth="2.2" strokeOpacity="0.85" fill="none" />
          </g>

          {/* Mobile View Elements */}
          <g className="md:hidden">
            {/* Outer U-Shape Burgundy Frame - darkest layer */}
            <path d="M 0,680 Q 720,840 1440,680 L 1440,900 L 0,900 Z" fill="url(#burgundyGrad1)" />

            {/* Second layer - slightly inset, lighter burgundy for depth */}
            <path d="M 0,690 Q 720,845 1440,690 L 1440,900 L 0,900 Z" fill="url(#burgundyGrad2)" opacity="0.6" />

            {/* Third layer - innermost, lightest for multi-layered depth */}
            <path d="M 0,700 Q 720,850 1440,700 L 1440,900 L 0,900 Z" fill="url(#burgundyGrad3)" opacity="0.3" />

            {/* U-Shape Shadow layer */}
            <path d="M 0,680 Q 720,840 1440,680 L 1440,900 L 0,900 Z" fill="#250505" opacity="0.35" />

            {/* Triple Gold Borders along the U-Shape - outer thick */}
            <path d="M 0,680 Q 720,840 1440,680" stroke="url(#goldBorderGrad)" strokeWidth="8" fill="none" />
            {/* Gold reflection sheen */}
            <path d="M 0,680 Q 720,840 1440,680" stroke="url(#goldReflect)" strokeWidth="4" fill="none" opacity="0.6" />
            {/* Inner thin bright gold line */}
            <path d="M 0,680 Q 720,840 1440,680" stroke="#FFF5D6" strokeWidth="2.5" strokeOpacity="0.9" fill="none" />
            {/* Outer offset gold line for secondary double-border effect */}
            <path d="M 0,668 Q 720,830 1440,668" stroke="#D4AF37" strokeWidth="2.5" strokeOpacity="0.85" fill="none" />
          </g>
        </svg>

        {/* Pulsing Light lens flares */}
        <div className="absolute left-[14%] top-[41%] w-10 h-10 rounded-full bg-white blur-[2px] opacity-85 animate-twinkle" style={{ boxShadow: '0 0 25px 10px #FFF2B2, 0 0 45px 20px rgba(255,255,255,0.65)' }} />
        <div className="absolute right-[14%] top-[41%] w-10 h-10 rounded-full bg-white blur-[2px] opacity-85 animate-twinkle" style={{ boxShadow: '0 0 25px 10px #FFF2B2, 0 0 45px 20px rgba(255,255,255,0.65)' }} />
        <div className="absolute left-[50%] -translate-x-1/2 bottom-[13%] w-12 h-12 rounded-full bg-white blur-[3px] opacity-95 hidden md:block" style={{ boxShadow: '0 0 30px 14px #FFF2B2, 0 0 60px 25px rgba(255,255,255,0.8)' }} />

        {/* Detailed graduation crowd silhouettes fading naturally into background */}
        <div className="absolute left-[4vw] bottom-[20vh] w-[340px] h-[340px] opacity-[0.075] hidden md:block">
          <img
            src="/graduates-silhouette.png"
            alt="Graduates celebrating"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="absolute right-[4vw] bottom-[20vh] w-[340px] h-[340px] opacity-[0.075] hidden md:block">
          <img
            src="/graduates-silhouette.png"
            alt="Graduates celebrating"
            className="w-full h-full object-contain scale-x-[-1]"
          />
        </div>

        {/* Centered mobile silhouette */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[15vh] w-[280px] h-[280px] opacity-[0.05] md:hidden z-0 pointer-events-none">
          <img
            src="/graduates-silhouette.png"
            alt="Graduates celebrating"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Animated Gold Confetti / Glitter Particles */}
        {confettiParticles.map((p, idx) => (
          <div
            key={idx}
            className={`absolute bg-gradient-to-br from-[#FFE066] via-[#D4AF37] to-[#B8942F] rounded-sm shadow-sm ${p.anim} ${p.bottom ? 'hidden md:block' : ''}`}
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              bottom: p.bottom,
              width: p.width,
              height: p.height,
              transform: `rotate(${p.rotate})`,
              opacity: p.opacity,
              animationDelay: p.delay,
            }}
          />
        ))}

        {/* Golden Sparkles & bokeh */}
        <div className="absolute top-[18%] left-[26%] w-2.5 h-2.5 rounded-full bg-[#FFE985] opacity-80 blur-[0.5px] animate-twinkle" />
        <div className="absolute top-[14%] right-[14%] w-3.5 h-3.5 rounded-full bg-[#D4AF37] opacity-70 animate-float-slow" />
        <div className="absolute top-[32%] left-[45%] w-2 h-2 rounded-full bg-white opacity-90 animate-twinkle" />
        <div className="absolute bottom-[36%] left-[12%] w-2.5 h-2.5 rounded-full bg-[#D4AF37] opacity-75 animate-float-fast" />
        <div className="absolute top-[55%] right-[10%] w-2 h-2 rounded-full bg-[#FFE985] opacity-70 blur-[0.5px] animate-twinkle" />
        <div className="absolute top-[65%] left-[20%] w-3 h-3 rounded-full bg-[#D4AF37] opacity-60 animate-float-slow" />
        <div className="absolute bottom-[20%] right-[35%] w-1.5 h-1.5 rounded-full bg-white opacity-85 animate-twinkle" />
        <div className="absolute top-[45%] right-[42%] w-2 h-2 rounded-full bg-[#FFE066] opacity-65 blur-[0.5px] animate-float-fast" />
      </div>

      {/* ====== WARM RADIAL GLOW BEHIND CENTER CONTENT ====== */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255, 240, 180, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)' }} />

      {/* ====== FLOATING 3D PHOTOREALISTIC VELVET GRADUATION CAP (USING TRANSPARENT PNG /graduation-cap.png) ====== */}
      <div className="cap-container absolute top-3 right-3 md:top-8 md:right-16 lg:right-24 z-10 pointer-events-none w-[110px] h-[90px] md:w-[220px] md:h-[220px]" style={{ filter: 'drop-shadow(0 15px 30px rgba(30, 3, 3, 0.4))' }}>
        <img
          src="/graduation-cap.png"
          alt="Graduation Cap"
          className="w-full h-full object-contain"
        />
      </div>

      {/* ====== LOGO BRANDING ====== */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 logo-branding-container">
        <div className="logo-container relative w-14 h-14 md:w-36 md:h-36 flex items-center justify-center overflow-hidden">
          <img
            src="/logo bm.png"
            alt="BrandMonk Academy"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* ====== MAIN SCALED CONTENT COLUMN ====== */}
      <div className="main-content-column w-full flex flex-col justify-start gap-10 md:gap-0 items-center z-10 max-w-[760px] my-auto pt-[64px] md:pt-[40px] pb-12">

        {/* ====== HEADER SECTION ====== */}
        <div className="flex w-full items-center justify-center flex-col relative px-4 md:px-0 mb-4 md:mb-0">

          {/* Text branding centered */}
          <div className="text-center flex flex-col items-center w-full z-10">
            {/* Gold Laurel Badge */}
            <div className="laurel-badge-wrapper relative inline-flex items-center justify-center mb-3 scale-[0.8] md:scale-[0.9]">
              <div className="absolute inset-0 bg-[#D4AF37]/35 blur-xl rounded-full scale-125" />

              {/* Laurel Wreath Left */}
              <svg className="absolute -left-8 top-1/2 -translate-y-1/2 w-7 h-11 opacity-90" viewBox="0 0 28 48" fill="none">
                <path d="M14 4 Q6 12, 4 24 Q6 36, 14 44" stroke="#D4AF37" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <ellipse cx="8" cy="12" rx="3.8" ry="2" fill="#D4AF37" transform="rotate(-30 8 12)" />
                <ellipse cx="6" cy="22" rx="3.8" ry="2" fill="#D4AF37" transform="rotate(-20 6 22)" />
                <ellipse cx="6" cy="32" rx="3.8" ry="2" fill="#D4AF37" transform="rotate(10 6 32)" />
              </svg>

              {/* Laurel Wreath Right */}
              <svg className="absolute -right-8 top-1/2 -translate-y-1/2 w-7 h-11 opacity-90" viewBox="0 0 28 48" fill="none">
                <path d="M14 4 Q22 12, 24 24 Q22 36, 14 44" stroke="#D4AF37" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <ellipse cx="20" cy="12" rx="3.8" ry="2" fill="#D4AF37" transform="rotate(30 20 12)" />
                <ellipse cx="22" cy="22" rx="3.8" ry="2" fill="#D4AF37" transform="rotate(20 22 22)" />
                <ellipse cx="22" cy="32" rx="3.8" ry="2" fill="#D4AF37" transform="rotate(-10 22 32)" />
              </svg>

              {/* Central Badge */}
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#4D1010] to-[#1E0303] flex items-center justify-center shadow-lg border border-[#D4AF37]/65">
                <GraduationCap className="w-6 h-6 text-[#D4AF37]" strokeWidth={2} />
              </div>
            </div>

            {/* Event Title */}
            <div className="flex flex-col items-center mb-2.5">
              <p
                className="text-[#B8942F] text-[10px] md:text-[14px] font-black tracking-[0.22em] uppercase leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                24th Graduation Function
              </p>
              <div className="h-[0.8px] w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-1.5" />
            </div>

            {/* Page Heading */}
            <h1
              className="hero-heading text-[28px] md:text-[52px] leading-[1.1] font-bold mb-2 tracking-tight text-[#4D1010]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Student Verification
            </h1>

            {/* Gold Star Divider */}
            <div className="flex items-center gap-2 md:gap-3.5 mb-2.5 md:mb-3">
              <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/80" />
              <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/80" />
            </div>

            {/* Page Subtitle */}
            <p className="hero-subtitle text-[#6E5945] text-[10.5px] md:text-sm max-w-[280px] md:max-w-[440px] leading-relaxed font-bold">
              Verify your registered mobile number to access your graduation details.
            </p>
          </div>
        </div>

        {/* ====== PURE WHITE VERIFICATION CARD ====== */}
        <div className="relative w-full max-w-[620px] z-10 flex flex-col justify-center">
          <div
            className="verification-card w-full rounded-[32px] bg-white/95 backdrop-blur-sm relative"
            style={{
              border: '2px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 40px 80px -20px rgba(30, 3, 3, 0.35), 0 0 50px 8px rgba(212, 175, 55, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Top gold accent line passing through the shield badge center */}
            <div className="absolute top-[0px] left-[2px] right-[2px] h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent z-10" />

            <div className="px-5 py-6 md:px-10 md:py-9 relative flex flex-col justify-center">

              {/* Overlapping circular shield check badge centered on the gold line */}
              <div className="absolute -top-[38px] left-1/2 -translate-x-1/2 z-10" style={{ filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))' }}>
                <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center p-[5px] relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFE066] via-[#D4AF37] to-[#B8942F] p-[3px]">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center" />
                  </div>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="relative z-10">
                    <defs>
                      <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#7B2D2D" />
                        <stop offset="1" stopColor="#4D1010" />
                      </linearGradient>
                    </defs>
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="url(#shieldGrad)" stroke="#D4AF37" strokeWidth="1" />
                    <path d="M8 12L11 15L16 9" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* CARD CONTENT */}
              {submitted ? (
                <div className="text-center py-8 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#4D1010] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Thank You!
                  </h3>
                  <p className="text-sm text-[#6E5945] font-medium mb-6">
                    Your details have been submitted successfully.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMobile('');
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#4D1010] bg-white border border-gray-200 px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                    Submit Another Response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  {/* Name Field */}
                  <div>
                    <label
                      className="block text-[14px] md:text-[15px] font-black text-[#4D1010] mb-2 tracking-wide"
                    >
                      Full Name
                    </label>

                    <div
                      className="input-container flex items-center rounded-[18px] overflow-hidden transition-all bg-white/90 backdrop-blur-sm h-[64px] border border-gray-200/80 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20"
                      style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.04)' }}
                    >
                      <div className="px-3 md:px-5 h-full flex items-center border-r border-gray-200/80">
                        <User className="w-5 h-5 text-[#4D1010]" strokeWidth={2} />
                      </div>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="flex-1 px-3 md:px-5 h-full outline-none text-[#3D2B1F] placeholder-[#9C8B7A] bg-transparent text-sm md:text-base font-bold min-w-0 w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      className="block text-[14px] md:text-[15px] font-black text-[#4D1010] mb-2 tracking-wide"
                    >
                      Email Address
                    </label>

                    <div
                      className="input-container flex items-center rounded-[18px] overflow-hidden transition-all bg-white/90 backdrop-blur-sm h-[64px] border border-gray-200/80 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20"
                      style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.04)' }}
                    >
                      <div className="px-3 md:px-5 h-full flex items-center border-r border-gray-200/80">
                        <Mail className="w-5 h-5 text-[#4D1010]" strokeWidth={2} />
                      </div>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 px-3 md:px-5 h-full outline-none text-[#3D2B1F] placeholder-[#9C8B7A] bg-transparent text-sm md:text-base font-bold min-w-0 w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <label
                      className="block text-[14px] md:text-[15px] font-black text-[#4D1010] mb-2 tracking-wide"
                    >
                      Mobile Number
                    </label>

                    <div
                      className="input-container flex items-center rounded-[18px] overflow-hidden transition-all bg-white/90 backdrop-blur-sm h-[64px] border border-gray-200/80 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20"
                      style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.04)' }}
                    >
                      {/* Country prefix */}
                      <div className="flex items-center gap-1.5 px-3 md:px-5 h-full select-none border-r border-gray-200/80">
                        <span className="text-[10px] font-black text-[#4D1010]/60 tracking-wider">IN</span>
                        <span className="text-sm md:text-base font-extrabold text-[#4D1010]">+91</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#4D1010]/45" />
                      </div>

                      {/* Input */}
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                        className="flex-1 px-3 md:px-5 h-full outline-none text-[#3D2B1F] placeholder-[#9C8B7A] bg-transparent text-sm md:text-base font-bold min-w-0 w-full"
                        required
                      />

                      {/* Phone Icon */}
                      <div className="pr-3 md:pr-5">
                        <Phone className="w-5 h-5 text-[#4D1010]" strokeWidth={2} />
                      </div>
                    </div>

                    <p className="text-[#6E5945]/70 text-[12px] mt-2.5 font-medium">
                      Enter the mobile number you used during registration.
                    </p>
                  </div>

                  {/* Premium gradient verify button with gold border, shadow, and golden glow */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="verify-button w-full relative overflow-hidden rounded-2xl font-bold text-white h-[60px] transition-all flex items-center justify-center gap-2 group disabled:opacity-75 cursor-pointer active:scale-[0.99]"
                    style={{
                      background: 'linear-gradient(135deg, #4D1010 0%, #6C1A1A 50%, #3F0A0A 100%)',
                      border: '2.2px solid rgba(212, 175, 55, 0.85)',
                      boxShadow: '0 0 25px rgba(212, 175, 55, 0.35), 0 14px 32px rgba(30, 3, 3, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-base tracking-wide">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5.5 h-5.5 text-[#D4AF37]" strokeWidth={2.2} />
                        <span className="text-base tracking-wide">Submit</span>
                      </>
                    )}
                  </button>

                  {/* Error Notification */}
                  {error && (
                    <div className="p-4 rounded-xl flex items-start gap-3" style={{
                      background: 'rgba(220, 38, 38, 0.07)',
                      border: '1.5px solid rgba(220, 38, 38, 0.25)',
                    }}>
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-700 text-sm font-bold leading-snug">{error}</p>
                        <p className="text-red-500/80 text-[11px] font-medium mt-1">
                          Your boarding pass cannot be generated. Please contact the academy admin for assistance.
                        </p>
                      </div>
                    </div>
                  )}


                </form>
              )}
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
          </div>

          {/* ====== FLOATING DIPLOMA SCROLL (USING TRANSPARENT PNG /component.png) ====== */}
          <div className="absolute -bottom-10 -left-16 z-20 pointer-events-none hidden md:block w-[210px] h-[180px]" style={{ filter: 'drop-shadow(0 15px 30px rgba(30, 3, 3, 0.45))' }}>
            <img
              src="/component.png"
              alt="Diploma Scroll"
              className="w-full h-full object-contain -rotate-[18deg]"
            />
          </div>

          {/* ====== FLOATING DIPLOMA SCROLL FOR MOBILE (hidden to keep submit button visible) ====== */}
          <div className="absolute -bottom-24 left-[20px] z-20 pointer-events-none hidden w-[180px] h-[150px]" style={{ filter: 'drop-shadow(0 15px 30px rgba(30, 3, 3, 0.45))' }}>
            <img
              src="/component.png"
              alt="Diploma Scroll"
              className="w-full h-full object-contain -rotate-[18deg]"
            />
          </div>
        </div>



        {/* Footer text */}
        <div className="relative z-10 text-[9px] text-[#FFEAA5]/50 select-none text-center mt-3 md:mt-5 hidden md:block">
          © 2026 Brand Monk Academy. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
