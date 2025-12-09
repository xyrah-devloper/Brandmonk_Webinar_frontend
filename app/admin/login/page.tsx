'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Lock, 
  User, 
  Loader2, 
  Shield,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://brandmonk-backend-1.onrender.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, formData);
      
      if (res.data.success) {
        // Store admin data in sessionStorage
        sessionStorage.setItem('adminData', JSON.stringify(res.data.admin));
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="desk-bg no-scroll">
       <div className="certificate-container" style={{ width: '600px', margin: '0 auto', maxWidth: '95vw', minHeight: 'auto', padding: '40px' }}>
        <div className="certificate-border">
          <div className="certificate-inner-border bg-[#fff9f0] relative">
            
            {/* Corner decorations */}
            <div className="corner-decoration corner-tl"></div>
            <div className="corner-decoration corner-tr"></div>
            <div className="corner-decoration corner-bl"></div>
            <div className="corner-decoration corner-br"></div>

            <div className="text-center mb-8">
              <div className="mb-6">
                 <img 
                    src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png" 
                    alt="Brand Monk Academy" 
                    className="h-12 w-auto mx-auto object-contain mix-blend-multiply opacity-90"
                 />
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#1a237e] uppercase tracking-[0.2em] border-b border-[#DAA520] pb-2 inline-block">
                Admin Portal
              </h1>
              <p className="font-sans text-xs text-[#666] uppercase tracking-widest mt-3 font-medium">
                Authorized Personnel Access
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-6">
               <div className="space-y-5">
                  {/* Username Field */}
                  <div className="relative group">
                    <label htmlFor="username" className="block text-[10px] font-bold text-[#555] uppercase tracking-widest mb-1.5 ml-1">
                      Admin Username
                    </label>
                    <div className="relative flex items-center bg-white border border-[#ccc] group-focus-within:border-[#1a237e] group-focus-within:ring-1 group-focus-within:ring-[#1a237e] transition-all rounded-sm px-3 shadow-sm">
                      <User className="w-4 h-4 text-[#888]" />
                      <input 
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="w-full bg-transparent border-none focus:ring-0 text-[#333] font-serif placeholder-gray-300 py-2.5 px-3 text-sm focus:outline-none"
                        placeholder="Enter Username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative group">
                    <label htmlFor="password" className="block text-[10px] font-bold text-[#555] uppercase tracking-widest mb-1.5 ml-1">
                      Password
                    </label>
                    <div className="relative flex items-center bg-white border border-[#ccc] group-focus-within:border-[#1a237e] group-focus-within:ring-1 group-focus-within:ring-[#1a237e] transition-all rounded-sm px-3 shadow-sm h-[44px]">
                      <Lock className="w-4 h-4 text-[#888]" />
                      <input 
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full bg-transparent border-none focus:ring-0 text-[#333] font-serif placeholder-gray-300 py-2.5 px-3 text-sm focus:outline-none"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
               </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-sm">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1a237e] text-white font-bold text-xs uppercase tracking-[0.25em] shadow-md hover:shadow-xl transition-all hover:bg-[#283593] rounded-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                       <>
                         <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                       </>
                    ) : (
                       <span>Login to Dashboard</span>
                    )}
                  </button>
                </div>
            </form>
            
            <div className="mt-8 pt-4 border-t border-[#d4c5b0] text-center">
               {/* <p className="text-[10px] uppercase font-bold text-[#1a237e] mb-2 opacity-70">Authorized Credentials Only</p>
               <div className="text-[10px] text-[#666] font-mono leading-tight opacity-60">
                  <p>Chennai: chennai_admin / chennai@123</p>
                  <p>Coimbatore: coimbatore_admin / coimbatore@123</p>
               </div> */}
               
               <Link href="/" className="inline-block mt-4 text-xs font-serif italic text-[#1a237e] hover:underline">
                  ← Return to Public Registry
               </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
