import React, { forwardRef } from 'react';

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  date: string;
  verifyUrl: string;
  certificateId: string;
  type?: 'Standard' | 'Government';
}

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ studentName, courseName, date, verifyUrl, certificateId, type = 'Standard' }, ref) => {
    // Generate QR code URL using public API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(verifyUrl)}`;
    
    // Choose background image based on type
    const bgImage = type === 'Government' ? '/certificate1.png' : '/certificate.png';
    
    // Define styles based on type
    const isGovt = type === 'Government';

    return (
      <div 
        ref={ref} 
        className="relative flex-shrink-0 overflow-hidden" 
        style={{ 
          width: '1000px',
          height: '700px',
          backgroundColor: '#ffffff', 
          color: '#000000',
          fontFamily: 'Georgia, serif'
        }}
      >
        {/* Certificate Background Image */}
        <img 
          src={bgImage} 
          alt="Certificate Background" 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Content Overlays - Positioned based on actual certificate layout */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          
          {/* Student Name - Left aligned to match underline start */}
          {(() => {
            const wordCount = studentName.trim().split(/\s+/).length;
            const nameLength = studentName.length;
            // Calculate font size based on word count and length
            let fontSize = '44px';
            if (wordCount >= 2 || nameLength > 15) {
              fontSize = nameLength > 22 ? '30px' : nameLength > 18 ? '36px' : '38px';
            }
            return (
              <div 
                style={{ 
                  position: 'absolute',
                  // Adjust top/left for Government certificate if needed. Assuming similar for now or just generic centering if I can't see it.
                  // For now, I'll keep the same position for Standard, and try to guess or use same for Govt.
                  // Ideally, Govt cert might need different coordinates.
                  top: isGovt ? '325px' : '335px', 
                  left: isGovt ? '0' : '88px',
                  width: isGovt ? '100%' : 'auto', // Center aligning for Govt as is typical, left for Standard
                  textAlign: isGovt ? 'center' : 'left',
                  display: 'flex',
                  justifyContent: isGovt ? 'center' : 'flex-start'
                }}
              >
                <h2 
                  style={{ 
                    fontSize: fontSize,
                    fontWeight: 'bold',
                    color: isGovt ? '#000000' : '#1a1a1a',
                    fontFamily: '"Playfair Display", Georgia, serif',
                    margin: 0,
                    letterSpacing: nameLength > 20 ? '1px' : '2px',
                    lineHeight: '1.3',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {studentName}
                </h2>
              </div>
            );
          })()}

          {/* Course/Webinar Name - After "WEBINAR WHICH WAS HELD ON" text */}
          <div 
            style={{ 
              position: 'absolute',
              top: isGovt ? '435px' : '412px', 
              left: isGovt ? '0' : '333px',
              width: isGovt ? '100%' : 'auto',
              textAlign: isGovt ? 'center' : 'left'
            }}
          >
            <p 
              style={{ 
                fontSize: isGovt ? '20px' : '18px',
                fontWeight: 'bold',
                color: isGovt ? '#000000' : '#8B4513',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontFamily: 'Arial, sans-serif',
                margin: 0
              }}
            >
              {courseName}
            </p>
          </div>

          {/* Date - Centered below webinar info */}
          <div 
            style={{ 
              position: 'absolute',
              width: isGovt ? '100%' : '55%',
              textAlign: 'center',
              top: isGovt ? '490px' : '440px', 
              left: isGovt ? '0' : '160px',
            }}
          >
            <p 
              style={{ 
                fontSize: '16px',
                fontWeight: '600',
                color: '#333333',
                fontFamily: 'Arial, sans-serif',
                margin: 0
              }}
            >
              {date}
            </p>
          </div>

          {/* QR Code & ID - Near NSDC Logo (Stacked) */}
          <div 
            style={{ 
              position: 'absolute',
              bottom: isGovt ? '60px' : '15px', 
              left: isGovt ? '51%' : '520px', 
              transform: isGovt ? 'translateX(-50%)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <img 
              src={qrCodeUrl}
              alt="Verification QR Code"
              style={{
                width: isGovt ? '70px' : '50px',
                height: isGovt ? '70px' : '50px',
                border: '2px solid #333',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}
            />
            <p 
              style={{ 
                fontSize: '10px',
                fontWeight: '700',
                color: '#555555',
                letterSpacing: '1px',
                fontFamily: '"Poppins", sans-serif',
                fontStyle: 'normal',
                margin: 0
              }}
            >
              ID: {certificateId}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
