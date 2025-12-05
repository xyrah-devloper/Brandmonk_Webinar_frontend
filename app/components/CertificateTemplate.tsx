import React, { forwardRef } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  date: string;
  verifyUrl: string;
}

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ studentName, courseName, date, verifyUrl }, ref) => {
    return (
      <div 
        ref={ref} 
        className="relative w-[1000px] h-[700px] flex-shrink-0 overflow-hidden" 
        style={{ 
            backgroundColor: '#ffffff', 
            color: '#000000',
            borderColor: 'transparent',
            borderWidth: 0,
            borderStyle: 'none'
        }}
      >
        {/* Certificate Background Image */}
        <img 
            src="/certificate.png" 
            alt="Certificate Background" 
            className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Content Overlays */}
        <div className="relative z-10 w-full h-full">
            
            {/* Student Name */}
            <div 
                className="absolute w-full text-center" 
                style={{ 
                    top: '50%', 
                    left: '33%', 
                    transform: 'translate(-50%, -48%)',
                }}
            >
                <h2 
                    className={`${playfair.className} text-5xl font-bold tracking-wide`} 
                    style={{ color: '#000000' }}
                >
                    {studentName}
                </h2>
            </div>

            {/* Course Name */}
            <div 
                className="absolute" 
                style={{ 
                    top: '61.2%', 
                    left: '33%', 
                    transform: 'translateY(-60%)',
                }}
            >
                <p 
                    className={`${inter.className} text-xl font-bold uppercase tracking-wider`} 
                    style={{ color: '#000000' }}
                >
                    {courseName}
                </p>
            </div>

            {/* Date */}
            <div 
                className="absolute" 
                style={{ 
                    top: '64.5%', 
                    left: '37%', 
                    transform: 'translateY(-50%)',
                }}
            >
                <p 
                    className={`${inter.className} text-lg font-medium`} 
                    style={{ color: '#000000' }}
                >
                    {date}
                </p>
            </div>

            {/* Verification Link (Optional - keep it small at bottom) */}
            <div 
                className="absolute bottom-4 left-16 text-[10px] font-medium" 
                style={{ color: '#000000' }}
            >
                <span style={{ opacity: 0.7 }}>{verifyUrl}</span>
            </div>

        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
