'use client';

import { Award, Video, Users, ArrowRight, MousePointerClick, Download, Calendar, MapPin, X, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Webinar {
  _id: string;
  name: string;
  slug: string;
  type: 'Webinar' | 'Course';
  description: string;
  date: string;
  location: string;
  isActive: boolean;
  totalRegistrations: number;
}

export default function Home() {
  const [view, setView] = useState<'home' | 'webinars'>('home');
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWebinars = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/api/webinars`);
      if (res.data.success) {
        setWebinars(res.data.webinars);
      } else {
        setError('Failed to load webinars.');
      }
    } catch (err) {
      console.error(err);
      setError('System details unavailable. Please contact administration.');
    } finally {
      setLoading(false);
    }
  };

  const handleWebinarClick = () => {
    setView('webinars');
    fetchWebinars();
  };

  return (
    <div className="desk-bg no-scroll">
      <div className="certificate-container landscape">
        <div className="certificate-border">
          <div className="certificate-inner-border">
            
            {/* Corner decorations */}
            <div className="corner-decoration corner-tl"></div>
            <div className="corner-decoration corner-tr"></div>
            <div className="corner-decoration corner-bl"></div>
            <div className="corner-decoration corner-br"></div>

            <div className="cert-content-grid">
              
              {/* LEFT SIDE: Identity & Purpose */}
              <div className="cert-column left-col relative">
                <div className="mb-4">
                   <img 
                      src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png" 
                      alt="Brand Monk Academy Seal" 
                      className="h-16 w-auto mx-auto object-contain mix-blend-multiply opacity-90"
                    />
                </div>
                <h1 className="cert-title main-title">Brand Monk<br/>Academy</h1>
                <p className="cert-subtitle">Official Student Portal</p>
                
                <div className="cert-divider-small"></div>
                
                <p className="cert-text-desc">
                  <span className="drop-cap">B</span>randmonk's new platform automates certificate generation and increases Google Business reviews and Instagram followers. This is a promising solution for converting leads.
                </p>

                <div className="seal-area mt-auto">
                   <div className="gold-seal relative">
                      <div className="seal-ribbon"></div>
                      <div className="seal-text">OFFICIAL<br/>MEMBER</div>
                   </div>
                   <div className="signature-area">
                      <div className="hand-signature-small">Brand Monk</div>
                      <div className="signature-line-small"></div>
                      <p className="signature-label-small">Authorized Signature</p>
                   </div>
                </div>
              </div>

              {/* VERTICAL DIVIDER */}
              <div className="cert-vertical-divider"></div>

              {/* RIGHT SIDE: Dynamic Content */}
              <div className="cert-column right-col relative">
                
                {/* Header Area containing Title + Staff Button */}
                <div className="flex justify-between items-start mb-6">
                   <h2 className="cert-section-title mb-0">Platform Guide</h2>
                   <Link href="/admin/login">
                     <button className="flex items-center gap-3 px-6 py-3 bg-[#c0392b] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#a93226] transition-all transform hover:scale-105 rounded shadow-md border-2 border-[#fff9f0] ring-2 ring-[#c0392b]">
                       <Award className="w-5 h-5" />
                       Staff Login
                     </button>
                   </Link>
                </div>

                {view === 'home' ? (
                  <div className="flex flex-col h-full">
                    
                    {/* Steps centered in upper portion */}
                    <div className="steps-container mb-8">
                      <div className="step-item">
                        <div className="step-text text-center"><span className="font-serif italic text-2xl text-[#DAA520]">1</span></div>
                        <div className="step-text text-center"><strong>Attend</strong></div>
                      </div>
                       <div className="step-arrow text-[#DAA520]">→</div>
                      <div className="step-item">
                        <div className="step-text text-center"><span className="font-serif italic text-2xl text-[#DAA520]">2</span></div>
                        <div className="step-text text-center"><strong>Follow Us</strong></div>
                      </div>
                       <div className="step-arrow text-[#DAA520]">→</div>
                      <div className="step-item">
                        <div className="step-text text-center"><span className="font-serif italic text-2xl text-[#DAA520]">3</span></div>
                        <div className="step-text text-center"><strong>Download Certificate</strong></div>
                      </div>
                    </div>

                    <div className="cert-divider-small mb-8"></div>

                    {/* Registry Actions */}
                    <div className="flex-grow flex flex-col justify-center gap-6">
                      <div className="text-center font-serif text-[#1a237e] text-lg font-bold border-b border-[#1a237e] pb-2">
                        COURSE CATALOGUE & REGISTRY
                      </div>

                      <button 
                         onClick={handleWebinarClick}
                         className="flex items-center justify-between w-full p-5 border-2 border-[#1a237e] bg-white hover:shadow-lg transition-all group rounded-sm"
                      >
                         <div className="flex items-center gap-4">
                            <span className="font-serif font-bold text-3xl text-[#DAA520] group-hover:text-[#1a237e] transition-colors">I.</span>
                            <div className="text-left">
                               <h3 className="font-serif text-xl font-bold text-[#333]">View Webinars & Events</h3>
                               <p className="font-serif italic text-sm text-gray-500">Access schedules, stats, and certificates</p>
                            </div>
                         </div>
                         <div className="bg-[#1a237e] text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest group-hover:bg-[#333] transition-colors">
                            Enter
                         </div>
                      </button>
                    </div>
                    
                    {/* Notice at the bottom, nicely contained */}
                    <div className="mt-auto pt-4">
                      <div className="p-4 bg-[#f7f3e8] border border-[#d4c5b0] text-center relative rounded-sm">
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fff9f0] px-2 font-serif text-xs text-[#1a237e] font-bold uppercase tracking-widest">
                            Important Notice
                         </div>
                         <p className="font-serif text-xs text-gray-600 italic leading-relaxed">
                            "Certificates of completion and community access passes are automatically issued within your specific event dashboard upon verification of attendance."
                         </p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="h-full flex flex-col relative w-full">
                    {/* Retro Ledger Header */}
                    <div className="flex justify-between items-end mb-6 border-b-4 double border-[#333] pb-2">
                       <div>
                          <h2 className="font-serif text-3xl font-bold text-[#1a237e] uppercase tracking-wide">Registry</h2>
                          <p className="font-serif text-xs text-gray-500 uppercase tracking-widest">Official Record of Events</p>
                       </div>
                       <button 
                         onClick={() => setView('home')}
                         className="mb-1 text-xs text-black font-bold uppercase tracking-widest border border-[#333] px-3 py-1 hover:bg-[#333] hover:text-white transition-colors"
                       >
                         Return to Main
                       </button>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                          <Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" />
                          <p className="font-serif italic text-gray-500">Retrieving archives...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center p-8 bg-red-50 text-red-600 rounded border border-red-200 font-serif">
                          {error}
                        </div>
                      ) : webinars.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 font-serif italic">
                          No records found in the archive.
                        </div>
                      ) : (
                        <div className="space-y-0">
                          {webinars.map((webinar, index) => (
                            <div key={webinar._id} className="border-b border-dashed border-[#ccc] py-4 hover:bg-[#1a237e]/5 transition-colors group px-2">
                              <div className="flex justify-between items-baseline mb-1">
                                <div className="flex items-baseline gap-2">
                                   <span className="font-mono text-gray-400 text-xs text-opacity-50">{(index + 1).toString().padStart(2, '0')}.</span>
                                   <h3 className="font-serif text-lg font-bold text-[#333] group-hover:text-[#1a237e]">
                                     {webinar.name}
                                   </h3>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                  webinar.isActive ? 'text-emerald-700' : 'text-gray-400'
                                }`}>
                                  {webinar.isActive ? '[ Open ]' : '[ Closed ]'}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center pl-6">
                                <div className="flex gap-6 text-xs text-gray-600 font-serif">
                                   <span>{new Date(webinar.date).toLocaleDateString()}</span>
                                   <span>{webinar.location || 'Online'}</span>
                                   <span className="text-[#1a237e] font-bold">{webinar.totalRegistrations} Enrolled</span>
                                </div>
                                {webinar.isActive && (
                                   <Link 
                                     href={`/register/${webinar.slug}`}
                                     className="text-xs font-bold text-[#1a237e] underline decoration-1 underline-offset-4 hover:no-underline"
                                   >
                                     Register Now
                                   </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
