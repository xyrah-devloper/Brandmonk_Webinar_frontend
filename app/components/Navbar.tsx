'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full py-3 px-6" style={{
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(16, 185, 129, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png"
            alt="Brand Monk Academy"
            style={{ 
              height: '50px', 
              width: 'auto'
            }}
          />
        </Link>
        
        {/* Admin Button */}
        <Link 
          href="/admin/login" 
          className="btn-premium btn-premium-dark"
          style={{ padding: '12px 28px', fontSize: '14px' }}
        >
          <span>Admin Portal</span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </nav>
  );
}
