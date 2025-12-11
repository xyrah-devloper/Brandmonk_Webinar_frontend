'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Printer, Linkedin, Twitter, Link as LinkIcon, Check, MapPin, Calendar, Clock, Quote, Download, ImageIcon } from 'lucide-react';
import { toJpeg } from 'html-to-image';

function SuccessContent() {
  const searchParams = useSearchParams();
  const seatStart = searchParams.get('seats') || '001';
  const totalSeats = searchParams.get('total') || '1';
  const studentName = searchParams.get('student') || 'Graduate Name';
  const course = searchParams.get('course') || 'Course Name';
  const batch = searchParams.get('batch') || '2024';
  
  // Calculate Seat Range String
  const seatEnd = parseInt(seatStart) + parseInt(totalSeats) - 1;
  const seatDisplay = parseInt(totalSeats) > 1 
    ? `${seatStart} - ${String(seatEnd).padStart(3, '0')}`
    : seatStart;

  const [photo, setPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<'newspaper' | 'program' | null>(null);

  useEffect(() => {
    const storedPhoto = sessionStorage.getItem('graduationPhoto');
    if (storedPhoto) {
      setPhoto(storedPhoto);
    }
  }, []);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Excited to announce that I have officially graduated! 🎓 Check out my graduation kit here. #BrandMonkGrad${batch}`;
    
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadCard = async (cardId: 'newspaper' | 'program') => {
    const element = document.getElementById(`card-${cardId}`);
    if (!element) return;
    
    setDownloading(cardId);
    try {
        // use html-to-image which supports modern CSS colors better
        const dataUrl = await toJpeg(element, { 
            quality: 0.95,
            backgroundColor: cardId === 'newspaper' ? '#F4F1EA' : '#FFFBF0' 
        });
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${studentName.replace(/\s+/g, '_')}_Graduation_${cardId === 'newspaper' ? 'Announcement' : 'Invite'}.jpg`;
        link.click();
    } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download image. Please try again.");
    } finally {
        setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-6 md:py-12 px-4 print:p-0 print:bg-white font-sans">
      {/* Navigation (Hidden on Print) */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
           <img src="/image.png" alt="Logo" className="w-10 h-10 object-contain" />
          Graduation Kit
        </h1>
        
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <div className="flex gap-2 mr-4 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
             <button onClick={() => handleShare('linkedin')} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition" title="Share on LinkedIn">
                <Linkedin className="w-4 h-4" />
             </button>
             <button onClick={() => handleShare('twitter')} className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition" title="Share on X">
                <Twitter className="w-4 h-4" />
             </button>
             <button onClick={() => handleShare('copy')} className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition relative" title="Copy Link">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
             </button>
          </div>

          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition shadow-lg font-medium text-xs md:text-sm uppercase tracking-wide"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-white text-slate-800 border-2 border-slate-200 rounded-full hover:bg-slate-50 transition shadow-lg font-medium text-xs md:text-sm uppercase tracking-wide"
          >
            Done
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 print:block print:gap-0">
        
        {/* ==============================================
            CARD 1: RETRO NEWSPAPER (Social Announcement Ver.)
           ============================================== */}
        <div className="flex flex-col gap-4 print:break-after-page print:h-screen">
            <div className="flex justify-between items-center print:hidden">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-[0.2em]">Newspaper Announcement</h3>
                <button 
                    onClick={() => downloadCard('newspaper')}
                    disabled={downloading === 'newspaper'}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                    {downloading === 'newspaper' ? 'Saving...' : <><ImageIcon className="w-4 h-4" /> Save Image</>}
                </button>
            </div>

            <div id="card-newspaper" className="relative shadow-2xl overflow-hidden h-auto min-h-[500px] md:min-h-0 md:aspect-[2/3] flex flex-col p-6 md:p-8 print:shadow-none print:w-full print:h-full print:aspect-auto bg-[#F4F1EA] text-slate-900">
                {/* Texture */}
                <div className="absolute inset-0 bg-noise opacity-[0.4] mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                {/* LOGO STAMP - BIGGER & CLEARER */}
                <div className="absolute top-4 right-4 md:top-5 md:right-5 z-30 transform rotate-12 border-4 border-double border-slate-800 rounded-full p-1.5 md:p-2 bg-[#F4F1EA]">
                    <img src="/image.png" alt="BrandMonk" className="w-12 h-12 md:w-16 md:h-16 object-contain grayscale-0 contrast-125" />
                </div>

                {/* MASTHEAD */}
                <div className="relative border-b-4 border-double border-slate-900 mb-4 pb-2 text-center z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl text-slate-900 mb-2 leading-none tracking-tight pt-2" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>
                        The BrandMonk<br className="md:hidden"/> Academy
                    </h1>
                    <div className="flex justify-between border-t border-slate-900 border-b pt-1 pb-1 mt-2 text-[8px] md:text-[10px] md:text-xs font-serif uppercase tracking-widest font-bold">
                        <span>Official Issue</span>
                        <span>Sat, Jan 10, 2026</span>
                        <span>Price: Smiles</span>
                    </div>
                </div>

                {/* HEADLINE: PERSONAL ANNOUNCEMENT */}
                <div className="text-left mb-6 relative z-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black uppercase text-slate-900 leading-[0.9] mb-3 tracking-wide">
                        EXTRA! EXTRA!<br/>
                        <span className="text-amber-700">I AM OFFICIALLY<br/>GRADUATING!</span>
                    </h2>
                     <div className="w-16 md:w-24 h-1 bg-slate-900 mb-2"></div>
                </div>

                {/* CONTENT GRID */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                    
                    {/* LEFT COL: PHOTO (Dominant) */}
                    <div className="md:col-span-7 flex flex-col">
                        <div className="relative border-[3px] border-slate-900 p-1 bg-white shadow-[4px_4px_0px_#000] mb-2 transform -rotate-1">
                             <div className="aspect-[3/4] w-full overflow-hidden bg-slate-200 grayscale-[0%] contrast-[1.05] filter sepia-[0.1]">
                                {photo ? (
                                    <img src={photo} alt={studentName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-serif">Photo Needed</div>
                                )}
                             </div>
                        </div>
                        <p className="text-[9px] font-sans font-bold text-center text-slate-600 uppercase tracking-wider mt-1">
                            {studentName}: Ready for the Future
                        </p>
                    </div>

                    {/* RIGHT COL: PERSONAL STORY */}
                    <div className="md:col-span-5 flex flex-col text-left">
                        
                        <div className="prose prose-sm font-serif text-justify text-slate-800 leading-snug text-[11px] md:text-xs pb-4 mb-4 h-full flex flex-col">
                            <p className="first-letter:text-3xl md:first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-1 mb-4">
                                <strong>I did it!</strong> After months of hard work, caffeine, and dedication, I am thrilled to announce that I have successfully completed my journey at BrandMonk Academy.
                            </p>
                            <p className="mb-4 hidden md:block">
                                To my family, friends, and mentors—thank you for believing in me. This degree belongs to us all. 
                            </p>
                            
                            {/* Quote Box */}
                            <div className="mt-auto border-t-2 border-b-2 border-slate-900 py-3 text-center">
                                <Quote className="w-3 h-3 md:w-4 md:h-4 mx-auto mb-1 text-slate-400 rotate-180" />
                                <p className="font-bold uppercase text-[9px] md:text-[10px] tracking-widest">Next Stop: <br/>The World</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                 <div className="mt-2 text-center relative z-10 border-t border-slate-900 pt-2 flex justify-between items-center">
                     <p className="font-serif italic text-[10px] md:text-xs text-slate-600">Join me in celebrating the Class of {batch}!</p>
                     <p className="font-sans font-bold text-[8px] md:text-[10px] uppercase tracking-wider">brandmonkacademy.com</p>
                 </div>
            </div>
        </div>


        {/* ==============================================
            CARD 2: PROFESSIONAL PROGRAM CARD (Royal Theme)
           ============================================== */}
        <div className="flex flex-col gap-4 print:break-after-page print:h-screen">
            <div className="flex justify-between items-center print:hidden">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-[0.2em]">Ceremony Invitation</h3>
                <button 
                    onClick={() => downloadCard('program')}
                    disabled={downloading === 'program'}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                    {downloading === 'program' ? 'Saving...' : <><ImageIcon className="w-4 h-4" /> Save Image</>}
                </button>
            </div>

             <div id="card-program" className="relative bg-[#FFFBF0] text-slate-800 shadow-2xl overflow-hidden h-auto min-h-[600px] md:min-h-0 md:aspect-[2/3] flex flex-col print:shadow-none print:w-full print:h-full print:aspect-auto border border-slate-200">
                
                {/* Subtle Background Texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fbbf24 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* 1. TOP HEADER BAR */}
                <div className="pt-6 md:pt-8 pb-2 px-4 md:px-8 relative z-10 text-center">
                    <div className="border-b-2 border-amber-500/50 pb-4 flex justify-between items-center">
                        <span className="font-serif text-lg md:text-xl lg:text-2xl font-bold text-[#1e3a8a] tracking-widest uppercase">10 January 2026</span>
                        <img src="/image.png" alt="BrandMonk" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                    </div>
                </div>

                {/* 2. MAIN TITLE AREA */}
                <div className="text-center px-4 mt-4 md:mt-6 mb-2 relative z-10 w-full">
                    <p className="font-script text-xl md:text-2xl text-slate-400 mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>BrandMonk Academy Proudly Presents</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1e3a8a] tracking-widest mb-3 uppercase">
                        GRADUATION
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-8 md:w-12 bg-amber-500"></div>
                        <p className="text-sm md:text-lg font-sans font-medium text-amber-600 tracking-[0.4em] uppercase">CEREMONY</p>
                        <div className="h-[1px] w-8 md:w-12 bg-amber-500"></div>
                    </div>
                </div>

                {/* 3. SCHEDULE CONTENT - ALIGNED GRID */}
                <div className="flex-1 px-4 md:px-12 py-4 relative z-10 flex flex-col justify-center">
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 md:gap-x-6 gap-y-4 md:gap-y-6 items-start w-full max-w-lg mx-auto">
                        {[
                             { time: '10:00 AM', event: 'OPENING PROCESSION', desc: 'Entrance of Graduates & Faculty' },
                             { time: '10:15 AM', event: 'WELCOME ADDRESS', desc: 'Dr. Mukilan Palanisamy – CEO' },
                             { time: '11:00 AM', event: 'AWARDING OF DEGREES', desc: 'Conferring of Diplomas' },
                             { time: '12:30 PM', event: 'VALEDICTORIAN SPEECH', desc: `Class of ${batch} Valedictorian` },
                             { time: '01:30 PM', event: 'CLOSING REMARKS', desc: 'Vote of Thanks' },
                        ].map((item, i) => (
                            <div key={i} className="contents group">
                                {/* Time Column (Right Aligned) */}
                                <div className="text-right pt-0.5">
                                     <span className="text-amber-600 font-bold font-mono text-[10px] md:text-sm tracking-widest whitespace-nowrap">{item.time}</span>
                                </div>
                                
                                {/* Divider Column */}
                                <div className="flex flex-col items-center h-full">
                                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#1e3a8a] mt-1.5"></div>
                                    {i < 4 && <div className="w-[1px] bg-slate-200 flex-1 my-1"></div>}
                                </div>

                                {/* Event Column (Left Aligned) */}
                                <div className="text-left pb-2">
                                     <p className="text-[#1e3a8a] font-bold text-xs md:text-sm lg:text-base tracking-wide uppercase leading-none mb-1">{item.event}</p>
                                     <p className="text-slate-500 text-[10px] md:text-xs font-serif italic leading-tight">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. FOOTER (Dark Blue Bar) */}
                <div className="bg-[#1e3a8a] text-white p-4 md:p-6 relative z-10 mt-auto">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[#fbbf24] text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Venue</p>
                            <p className="font-serif text-sm md:text-lg leading-tight">BrandMonk Campus,<br/>Grand Hall</p>
                        </div>
                        
                        <div className="text-right">
                             <div className="inline-block border-2 border-[#fbbf24] px-3 md:px-4 py-1.5 md:py-2 rounded-sm bg-[#1e40af]">
                                <p className="text-[#fbbf24] text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-center mb-1">Pass Number</p>
                                <p className="font-mono text-lg md:text-xl font-bold tracking-widest leading-none text-white text-center">
                                    {seatDisplay}
                                </p>
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-blue-800 flex justify-between text-[8px] md:text-[10px] text-blue-200 uppercase tracking-widest">
                        <span>#BrandMonkGrad{batch}</span>
                        <span>brandmonkacademy.com</span>
                    </div>
                </div>

             </div>
        </div>

      </div>
      
      {/* Import FONTS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;700&family=Great+Vibes&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        
        @media print {
            @page { margin: 0; size: auto; }
            body { background: white; }
            .print\:h-screen { height: 100vh; }
            .print\:break-after-page { page-break-after: always; }
        }
        
        .bg-noise {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}

export default function GraduationSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-slate-900 font-serif animate-pulse tracking-widest text-sm uppercase">Printing your Kit...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
