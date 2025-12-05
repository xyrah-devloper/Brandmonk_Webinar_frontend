import React from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export default function CertificatePage() {
  // These would typically come from props or a database
  const studentName = "AJEETH R";
  const courseName = "{course_name}";
  const date = "{Date}";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      {/* Certificate Container - Landscape Aspect Ratio */}
      <div className="relative w-[1000px] h-[700px] bg-white shadow-2xl overflow-hidden flex">
        
        <div className="absolute inset-0 z-0">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-purple-100/50 to-transparent" />
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 transform rotate-45 translate-x-32 -translate-y-32" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 transform rotate-45 translate-x-48 translate-y-48" />
            <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-400/20 transform rotate-45 translate-x-24" />
        </div>

        {/* Content Area */}
        <div className="relative z-10 w-full h-full flex flex-col px-16 py-12">
            
            {/* Header Section */}
            <div className="mt-8">
                <h1 className={`${playfair.className} text-8xl text-black font-medium tracking-tight`}>
                    Certificate
                </h1>
                <p className={`${inter.className} text-xl tracking-[0.4em] text-black mt-4 uppercase font-medium`}>
                    of participation
                </p>
            </div>

            {/* Awarded To Section */}
            <div className="mt-20">
                <p className={`${inter.className} text-sm text-gray-600 uppercase tracking-widest font-medium`}>
                    This certificate is proudly awarded to
                </p>
                <div className="mt-12 mb-4">
                    <h2 className={`${playfair.className} text-5xl text-black font-bold`}>
                        {studentName}
                    </h2>
                </div>
            </div>

            {/* Separator Line */}
            <div className="w-2/3 h-px bg-gray-400 mt-4 mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-gray-600 rounded-full"></div>
            </div>

            {/* Details Section */}
            <div className="space-y-2">
                <p className={`${inter.className} text-lg text-black uppercase tracking-wide`}>
                    For participating in the <span className="font-bold">{courseName}</span>
                </p>
                <p className={`${inter.className} text-lg text-black uppercase tracking-wide`}>
                    Webinar which was held on <span className="font-bold">{date}</span>
                </p>
            </div>

            {/* Footer Section */}
            <div className="mt-auto flex justify-between items-end w-full pr-16">
                
                {/* Signature */}
                <div className="flex flex-col items-center mb-4">
                    {/* Signature Image Placeholder */}
                    <div className={`${playfair.className} text-4xl text-green-700 italic mb-2`}>
                        Ajeeth R
                    </div>
                    <div className="w-48 h-px bg-gray-400 relative">
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-gray-600 rounded-full"></div>
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    <p className={`${inter.className} text-sm font-bold text-black mt-2`}>
                        AJEETH R
                    </p>
                    <p className={`${inter.className} text-xs text-black italic`}>
                        CEO
                    </p>
                </div>

                {/* Logos */}
                <div className="flex items-center gap-6 mb-4">
                    {/* Brand Monk Logo Placeholder */}
                    <div className="w-16 h-16 rounded-full border-2 border-yellow-600 flex items-center justify-center bg-white">
                        <span className="text-[8px] text-center font-bold text-yellow-800">BRAND MONK<br/>ACADEMY</span>
                    </div>
                    
                    {/* NSDC Logo Placeholder */}
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1">
                             <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                                <div className="bg-blue-500 rounded-sm"></div>
                                <div className="bg-green-500 rounded-sm"></div>
                                <div className="bg-orange-500 rounded-sm"></div>
                                <div className="bg-red-500 rounded-sm"></div>
                             </div>
                             <div className="flex flex-col">
                                 <span className="text-lg font-bold leading-none">N·S·D·C</span>
                                 <span className="text-[6px] leading-tight text-gray-600">National<br/>Skill Development<br/>Corporation</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Text */}
            <div className="absolute bottom-4 left-16 text-[10px] text-black font-medium">
                Digital signature is attested. For certificate verification contact info@brandmonkacademy.com
            </div>

        </div>
      </div>
    </div>
  );
}
