'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, Legend
} from 'recharts';
import { 
  LayoutDashboard, Video, Users, LogOut, Search, Bell,
  Plus, Calendar, MapPin, MoreVertical, ArrowRight, CheckCircle, 
  Award, TrendingUp, ChevronDown, Filter, ShieldCheck, Quote, Sparkles,
  ExternalLink, Trash2, Edit2, X, Loader2, BookOpen, Mail, AlertTriangle,
  Palette, Code, Share2, Laptop, Presentation
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://brandmonk-backend-1.onrender.com';

// --- Types ---
interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  webinarName: string;
  location: string;
  profession: string;
  certificateId: string;
  isEligible: boolean;
  certificateSent: boolean;
  dateOfRegistration: string;
  createdAt: string;
  collegeOrCompany?: string;
  department?: string;
  yearOfStudyOrExperience?: string;
  hasFollowedInstagram?: boolean;
}

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
  batchCode?: string;
  batchName?: string;
  trainer?: string;
  timing?: string;
  studentLimit?: number;
}

interface Stats {
  totalStudents: number;
  eligibleStudents: number;
  certificatesSent: number;
  monthlyRegistrations: { name: string; registrations: number }[];
  topWebinars: { name: string; count: number }[];
}

// --- Shadcn-like UI Components (Restored) ---

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`font-semibold leading-none tracking-tight text-slate-900 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, disabled }: any) => {
  const base = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200", 
    slate: "bg-slate-900 text-slate-50 hover:bg-slate-800",
    outline: "border border-slate-200 bg-transparent shadow-sm hover:bg-slate-50 text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    destructive: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  const variantClass = variants[variant as keyof typeof variants] || "bg-slate-900 text-white hover:bg-slate-800";
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variantClass} ${sizeClasses[size as keyof typeof sizeClasses]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default' }: any) => {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    outline: "text-slate-950",
    success: "border-transparent bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "border-transparent bg-amber-50 text-amber-700 border border-amber-100",
    purple: "border-transparent bg-purple-50 text-purple-700 border border-purple-100",
    blue: "border-transparent bg-blue-50 text-blue-700 border border-blue-100"
  };
  return <div className={`${base} ${variants[variant as keyof typeof variants]}`}>{children}</div>;
};

const Switch = ({ checked, onCheckedChange, disabled }: any) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onCheckedChange(!checked)}
    className={`
      peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50
      ${checked ? 'bg-emerald-600' : 'bg-slate-200'}
    `}
  >
    <span
      className={`
        pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform 
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
);

const Input = ({ label, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
    <input 
      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  </div>
);

// --- Page Component ---

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States
  const [studentTypeFilter, setStudentTypeFilter] = useState<'All' | 'Webinar' | 'Course'>('All');
  const [webinarTypeFilter, setWebinarTypeFilter] = useState<'All' | 'Webinar' | 'Course'>('All');
  const [studentCourseFilter, setStudentCourseFilter] = useState<string>('All');
  const [studentRegisterType, setStudentRegisterType] = useState<'Webinar' | 'Course'>('Course');

  // Search
  const [studentSearch, setStudentSearch] = useState('');
  const [webinarSearch, setWebinarSearch] = useState('');
  
  // Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddWebinarOpen, setIsAddWebinarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', webinarName: '', location: '', profession: '' });
  const [newWebinar, setNewWebinar] = useState({ name: '', type: 'Webinar', description: '', date: '', location: '' });
  
  // Chennai Admin Batch States
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
  const [batchForm, setBatchForm] = useState({
    batchCode: '',
    batchName: '',
    trainer: '',
    timing: '',
    startDate: '',
    studentLimit: ''
  });

  // Quote
  const [quote, setQuote] = useState("Success is not the key to happiness. Happiness is the key to success.");

  useEffect(() => {
    const adminData = sessionStorage.getItem('adminData');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
      fetchData();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const [studentsRes, statsRes, webinarsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/students`),
        axios.get(`${API_URL}/api/admin/stats`),
        axios.get(`${API_URL}/api/webinars`)
      ]);

      if (studentsRes.data.success) setStudents(studentsRes.data.students);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (webinarsRes.data.success) setWebinars(webinarsRes.data.webinars);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Derived Stats (Frontend Calculation Fallback) ---
  const derivedStats = {
     monthlyRegistrations: stats?.monthlyRegistrations?.length ? stats.monthlyRegistrations : (() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        const counts = new Array(12).fill(0);
        
        students.forEach(s => {
           const d = new Date(s.createdAt || s.dateOfRegistration);
           if (d.getFullYear() === currentYear) {
              counts[d.getMonth()]++;
           }
        });
        
        return months.map((m, i) => ({ name: m, registrations: counts[i] }));
     })(),
     topWebinars: stats?.topWebinars?.length ? stats.topWebinars : (() => {
        const counts: Record<string, number> = {};
        students.forEach(s => {
            counts[s.webinarName] = (counts[s.webinarName] || 0) + 1;
        });
        
        // Convert to array and sort
        return Object.entries(counts)
           .map(([name, count]) => ({ name, count }))
           .sort((a, b) => b.count - a.count)
           .slice(0, 5); // Top 5
     })()
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/admin/students`, newStudent);
      if (res.data.success) {
        setStudents([res.data.student, ...students]);
        setIsAddStudentOpen(false);
        setNewStudent({ name: '', email: '', phone: '', webinarName: '', location: '', profession: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add student:', err);
      alert('Failed to add student. Please check input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddWebinar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/webinars`, newWebinar);
      if (res.data.success) {
        setWebinars([res.data.webinar, ...webinars]);
        setIsAddWebinarOpen(false);
        setNewWebinar({ name: '', type: 'Webinar', description: '', date: '', location: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add webinar:', err);
      alert('Failed to add webinar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseName) return;
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: selectedCourseName,
        type: 'Course',
        description: `${selectedCourseName} Batch - ${batchForm.batchCode}`,
        date: batchForm.startDate || new Date().toISOString(),
        location: 'Chennai', // Default to Chennai as per requirement? Or make it optional.
        batchCode: batchForm.batchCode,
        batchName: batchForm.batchName,
        trainer: batchForm.trainer,
        timing: batchForm.timing,
        studentLimit: batchForm.studentLimit ? parseInt(batchForm.studentLimit) : 0
      };

      const res = await axios.post(`${API_URL}/api/webinars`, payload);
      if (res.data.success) {
        setWebinars([res.data.webinar, ...webinars]);
        setSelectedCourseName(null); // Close modal
        setBatchForm({ batchCode: '', batchName: '', trainer: '', timing: '', startDate: '', studentLimit: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create batch:', err);
      alert('Failed to create batch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    try {
      const res = await axios.delete(`${API_URL}/api/admin/students/${id}`);
      if (res.data.success) {
        setStudents(students.filter(s => s._id !== id));
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  const handleDeleteWebinar = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course/webinar?')) return;
    try {
      const res = await axios.delete(`${API_URL}/api/webinars/${id}`);
      if (res.data.success) {
        setWebinars(webinars.filter(w => w._id !== id));
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete webinar:', err);
    }
  };

  const handleToggleWebinarStatus = async (id: string) => {
    try {
      const res = await axios.patch(`${API_URL}/api/webinars/${id}/toggle`);
      if (res.data.success) {
        setWebinars(webinars.map(w => w._id === id ? res.data.webinar : w));
        // If data from backend doesn't have registrationLink, it might be lost in state if not merged properly, 
        // but 'webinar' from backend usually doesn't have it unless added by controller. 
        // The controller toggle returns the object. 
        // Let's just refetch or rely on map.
        // Actually, let's just flip the boolean locally to be safe if backend doesn't return everything
        // setWebinars(webinars.map(w => w._id === id ? { ...w, isActive: !w.isActive } : w));
         fetchData(); 
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleToggleEligibility = async (studentId: string, currentStatus: boolean) => {
    try {
      const res = await axios.patch(`${API_URL}/api/admin/students/${studentId}/eligibility`, {
        isEligible: !currentStatus
      });
      if (res.data.success) {
        if (res.data.student) {
             setStudents(students.map(s => s._id === studentId ? res.data.student : s));
        } else {
             setStudents(students.map(s => s._id === studentId ? { ...s, isEligible: !currentStatus } : s));
        }
      }
    } catch (err) {
      console.error('Failed to update eligibility:', err);
    }
  };

  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  const handleSendCertificate = async (studentId: string) => {
    try {
       setSendingEmailId(studentId);
       const res = await axios.post(`${API_URL}/api/admin/students/${studentId}/send-certificate`);
       if (res.data.success) {
          setStudents(students.map(s => s._id === studentId ? { ...s, certificateSent: true } : s));
       }
    } catch (err: any) {
       console.error('Failed to send certificate:', err);
       alert(err.response?.data?.message || 'Failed to send certificate email.');
    } finally {
       setSendingEmailId(null);
    }
  };

  // Filter Logic
  const getProgramType = (programName: string) => {
    const webinar = webinars.find(w => w.name === programName);
    return webinar?.type || 'Webinar';
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone?.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesCourse = studentCourseFilter === 'All' || s.webinarName === studentCourseFilter;
    const type = getProgramType(s.webinarName);
    const matchesType = studentTypeFilter === 'All' || type === studentTypeFilter;
    return matchesSearch && matchesCourse && matchesType;
  });

  const filteredWebinars = webinars.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(webinarSearch.toLowerCase());
    const matchesType = webinarTypeFilter === 'All' || w.type === webinarTypeFilter;
    return matchesSearch && matchesType;
  });

  const uniqueCourseNames = Array.from(new Set(students.map(s => s.webinarName))).sort();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white shadow-[2px_0_20px_rgba(0,0,0,0.02)]">
        <div className="flex h-20 items-center px-8 border-b border-slate-100">
          <div className="flex items-center justify-center w-full">
            <img 
              src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png" 
              alt="BrandMonk Academy" 
              className="h-12 w-auto object-contain" 
            />
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-[calc(100vh-80px)] p-4">
          <nav className="space-y-2 mt-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'webinars', label: 'Webinars', icon: Presentation },
              { id: 'students', label: 'Student Records', icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-4">
            <button 
              onClick={() => router.push('/admin/login')} 
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64 w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-8 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab === 'dashboard' ? 'Overview' : activeTab === 'webinars' ? 'Courses & Webinars' : 'Students'}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Welcome back hello, {admin?.username}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="relative rounded-full p-2.5 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-white" />
              </button>
              <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white">
                {admin?.username?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Overview */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 {[
                   { label: 'Total Registrations', value: stats?.totalStudents || 0, sub: 'All time students', icon: Users },
                   { label: 'Active Courses', value: webinars.filter(w => w.isActive).length, sub: 'Currently running', icon: Video },
                   { label: 'Certificates Sent', value: stats?.certificatesSent || 0, sub: 'Successfully issued', icon: Award },
                   { label: 'Eligible Students', value: stats?.eligibleStudents || 0, sub: 'Met criteria', icon: CheckCircle },
                 ].map((stat, i) => (
                   <Card key={i}>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
                       <stat.icon className="h-4 w-4 text-slate-400" />
                     </CardHeader>
                     <CardContent>
                       <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                       <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                     </CardContent>
                   </Card>
                 ))}
              </div>

              {/* Charts Section - NEW GRID */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
                
                {/* Registration Trends Chart */}
                <Card className="col-span-8 lg:col-span-5 shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle>Registration Trends</CardTitle>
                    <p className="text-sm text-slate-500">Monthly student registrations for the current year.</p>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[350px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={derivedStats.monthlyRegistrations}>
                           <defs>
                             <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                           <XAxis 
                             dataKey="name" 
                             stroke="#64748B" 
                             fontSize={12} 
                             tickLine={false} 
                             axisLine={false} 
                             dy={10} 
                           />
                           <YAxis 
                             stroke="#64748B" 
                             fontSize={12} 
                             tickLine={false} 
                             axisLine={false} 
                             tickFormatter={(value) => `${value}`}
                           />
                           <Tooltip 
                             cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                             contentStyle={{ background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                             itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                           />
                           <Area 
                             type="monotone" 
                             dataKey="registrations" 
                             stroke="#10b981" 
                             strokeWidth={3}
                             fillOpacity={1} 
                             fill="url(#colorReg)" 
                           />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Programs Chart - NEW */}
                <Card className="col-span-8 lg:col-span-3 shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle>Top Programs</CardTitle>
                    <p className="text-sm text-slate-500">Most popular courses by registration.</p>
                  </CardHeader>
                  <CardContent>
                     <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart 
                              layout="vertical"
                              data={derivedStats.topWebinars}
                              margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
                           >
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                              <XAxis type="number" hide />
                              <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={100}
                                tick={{ fontSize: 11, fill: '#64748B' }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                              />
                              <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={24} background={{ fill: '#f8fafc' }}>
                                {derivedStats.topWebinars.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={index === 0 ? '#4F46E5' : index === 1 ? '#6366f1' : '#818cf8'} />
                                ))}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </CardContent>
                </Card>

                {/* Recent Registrations - Full Width */}
                <Card className="col-span-8 shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle>Recent Registrations</CardTitle>
                    <p className="text-sm text-slate-500">Latest students to join the academy.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                       {students.slice(0, 5).map((student, i) => (
                         <div key={i} className="flex items-center group justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors">
                           <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                               {student.name[0]}
                             </div>
                             <div className="space-y-1">
                               <p className="text-sm font-semibold leading-none text-slate-900">{student.name}</p>
                               <p className="text-xs text-slate-500">{student.email}</p>
                             </div>
                           </div>
                           <div className="hidden md:block text-sm font-medium text-slate-600">
                             {student.webinarName} ({(getProgramType(student.webinarName))})
                           </div>
                           <div className="font-medium text-xs text-slate-500">
                             {new Date(student.createdAt).toLocaleDateString()}
                           </div>
                         </div>
                       ))}
                       {students.length === 0 && (
                          <div className="text-center text-slate-400 py-8">No recent activity.</div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'courses' && (
             (admin?.username?.toLowerCase().includes('chennai') || admin?.location === 'Chennai') ? (
               <div className="space-y-8">
                 {/* Chennai Admin: Course Selection */}
                 <div>
                   <h2 className="text-2xl font-bold tracking-tight mb-6 text-slate-900">Select a Course to Add Batch</h2>
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                     {[
                       { name: "Video Editing", icon: Video, color: "text-purple-600", bg: "bg-purple-100" },
                       { name: "Digital Marketing", icon: Share2, color: "text-blue-600", bg: "bg-blue-100" },
                       { name: "Data Analytics", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
                       { name: "UI/UX", icon: Palette, color: "text-pink-600", bg: "bg-pink-100" },
                       { name: "Fullstack Development", icon: Code, color: "text-orange-600", bg: "bg-orange-100" }
                     ].map((course) => (
                       <button 
                         key={course.name}
                         onClick={() => setSelectedCourseName(course.name)}
                         className="h-32 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
                       >
                         <div className={`w-12 h-12 rounded-full ${course.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                            <course.icon className={`w-6 h-6 ${course.color}`} />
                         </div>
                         <span className="font-semibold text-slate-700 group-hover:text-emerald-700 text-center text-sm px-2">{course.name}</span>
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Active Batches List */}
                 <div>
                    <h3 className="text-xl font-bold tracking-tight mb-4 text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      Active Batches
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {webinars.filter(w => w.type === 'Course').map(batch => (
                         <Card key={batch._id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className={`h-2 bg-gradient-to-r ${batch.isActive ? 'from-emerald-500 to-teal-500' : 'from-slate-400 to-slate-500'}`} />
                            <CardContent className="pt-6">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-lg text-slate-900">{batch.name}</h4>
                                  <Badge variant={batch.isActive ? 'success' : 'secondary'}>{batch.isActive ? 'Active' : 'Completed'}</Badge>
                               </div>
                               
                               <div className="space-y-3 mt-4 bg-slate-50 p-4 rounded-lg">
                                  {batch.batchCode && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Batch Code:</span>
                                      <span className="font-medium text-slate-900">{batch.batchCode}</span>
                                    </div>
                                  )}
                                  {batch.date && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Start Date:</span>
                                      <span className="font-medium text-slate-900">{new Date(batch.date).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  {batch.trainer && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Trainer:</span>
                                      <span className="font-medium text-slate-900">{batch.trainer}</span>
                                    </div>
                                  )}
                                  <div 
                                    className="flex justify-between text-sm cursor-pointer hover:bg-emerald-50 -mx-4 px-4 py-2 rounded-lg transition-colors group"
                                    onClick={() => {
                                      setStudentCourseFilter(batch.name);
                                      setActiveTab('students');
                                    }}
                                    title="Click to view students enrolled in this course"
                                  >
                                      <span className="text-slate-500 group-hover:text-emerald-600">Students:</span>
                                      <span className="font-medium text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                                        {batch.totalRegistrations} / {batch.studentLimit || '∞'}
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </span>
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-3 mt-6">
                                  <Button variant="outline" size="sm" onClick={() => {
                                    const link = `${window.location.protocol}//${window.location.host}/register/${batch.slug}`;
                                    navigator.clipboard.writeText(link);
                                    alert(`Link copied: ${link}`);
                                  }} className="col-span-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                     <ExternalLink className="w-4 h-4 mr-2" /> Copy Registration Link
                                  </Button>
                                  <Button variant="secondary" size="sm" onClick={() => window.open(`/register/${batch.slug}`, '_blank')}>
                                     View Form
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleToggleWebinarStatus(batch._id)}>
                                     {batch.isActive ? 'Mark Done' : 'Activate'}
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteWebinar(batch._id)} className="col-span-2">
                                     <Trash2 className="w-4 h-4 mr-2" /> Delete Batch
                                  </Button>
                               </div>
                            </CardContent>
                         </Card>
                       ))}
                       {webinars.filter(w => w.type === 'Course').length === 0 && (
                          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">No active batches. Select a course above to create one.</p>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Batch Creation Modal */}
                 {selectedCourseName && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">Create {selectedCourseName} Batch</h3>
                            <p className="text-sm text-slate-500">Enter batch details below</p>
                          </div>
                          <button onClick={() => setSelectedCourseName(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                          </button>
                        </div>
                        
                        <form onSubmit={handleCreateBatch} className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                             <Input 
                               label="Batch Code" 
                               value={batchForm.batchCode} 
                               onChange={(e: any) => setBatchForm({...batchForm, batchCode: e.target.value})}
                               placeholder="e.g. FSD-01"
                             />
                             <Input 
                               label="Batch Name" 
                               value={batchForm.batchName} 
                               onChange={(e: any) => setBatchForm({...batchForm, batchName: e.target.value})}
                               placeholder="e.g. October Batch"
                             />
                           </div>
                           
                           <Input 
                             label="Trainer Name" 
                             value={batchForm.trainer} 
                             onChange={(e: any) => setBatchForm({...batchForm, trainer: e.target.value})}
                             placeholder="Trainer Name"
                           />
                           
                           <div className="grid grid-cols-2 gap-4">
                             <Input 
                               label="Start Date" 
                               type="date"
                               value={batchForm.startDate} 
                               onChange={(e: any) => setBatchForm({...batchForm, startDate: e.target.value})}
                             />
                             <Input 
                               label="Timing" 
                               value={batchForm.timing} 
                               onChange={(e: any) => setBatchForm({...batchForm, timing: e.target.value})}
                               placeholder="e.g. 10 AM - 12 PM"
                             />
                           </div>

                           <Input 
                             label="Number of Students (Limit)" 
                             type="number"
                             value={batchForm.studentLimit} 
                             onChange={(e: any) => setBatchForm({...batchForm, studentLimit: e.target.value})}
                             placeholder="Leave empty for unlimited"
                           />

                           <div className="pt-4 flex gap-3">
                             <Button type="button" variant="secondary" className="flex-1" onClick={() => setSelectedCourseName(null)}>Cancel</Button>
                             <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
                               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                               {isSubmitting ? 'Creating...' : 'Create Batch'}
                             </Button>
                           </div>
                        </form>
                      </div>
                    </div>
                 )}
               </div>
             ) : (
                // Standard Admin View (Coimbatore / Super Admin)
                 <div className="space-y-6">
                   <div className="flex justify-between items-center">
                     <div>
                        <h2 className="text-2xl font-bold tracking-tight">Courses & Webinars</h2>
                        <p className="text-slate-500 text-sm mt-1">Manage your educational content available to students.</p>
                     </div>
                     
                     <div className="flex gap-4">
                        <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white p-1">
                          {['All', 'Course', 'Webinar'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setWebinarTypeFilter(type as any)}
                              className={`h-full px-4 rounded-md text-sm font-medium transition-all ${
                                webinarTypeFilter === type ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {type === 'All' ? 'All' : type + 's'}
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input 
                            className="h-10 rounded-lg border border-slate-200 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                            placeholder="Search courses..." 
                            value={webinarSearch}
                            onChange={(e) => setWebinarSearch(e.target.value)}
                          />
                        </div>
                        <Button onClick={() => setIsAddWebinarOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredWebinars.map((webinar) => (
                       <Card key={webinar._id} className="overflow-hidden hover:shadow-lg transition-all group border-slate-200">
                         <div className={`h-2 bg-gradient-to-r ${webinar.type === 'Course' ? 'from-indigo-500 to-blue-500' : 'from-emerald-500 to-teal-500'}`} />
                         <CardContent className="pt-6">
                           <div className="flex justify-between items-start mb-4">
                             <div className="p-3 bg-slate-50 rounded-xl">
                               {webinar.type === 'Course' ? (
                                  <BookOpen className="w-6 h-6 text-slate-700" />
                               ) : (
                                  <Video className="w-6 h-6 text-slate-700" />
                               )}
                             </div>
                             <div className="flex gap-2">
                                <Badge variant={webinar.type === 'Course' ? 'blue' : 'success'}>{webinar.type}</Badge>
                                <Badge variant={webinar.isActive ? 'outline' : 'secondary'}>{webinar.isActive ? 'Active' : 'Inactive'}</Badge>
                             </div>
                           </div>
                           <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{webinar.name}</h3>
                           <p className="text-sm text-slate-500 mb-6 line-clamp-2">{webinar.description}</p>
                           
                           <div className="space-y-3 border-t border-slate-100 pt-4">
                             <div className="flex items-center text-sm text-slate-600 gap-2">
                               <Calendar className="w-4 h-4 text-slate-400" />
                               {new Date(webinar.date).toLocaleDateString()}
                             </div>
                             <div className="flex items-center text-sm text-slate-600 gap-2">
                               <MapPin className="w-4 h-4 text-slate-400" />
                               {webinar.location || 'Online'}
                             </div>
                             <div className="flex items-center text-sm text-slate-600 gap-2">
                               <Users className="w-4 h-4 text-slate-400" />
                               <span className="font-semibold text-slate-900">{webinar.totalRegistrations}</span> Registrations
                             </div>
                           </div>
                           
                             <div className="mt-6 flex flex-col gap-2">
                               {webinar.type !== 'Course' && (
                                 <Button 
                                   variant="outline" 
                                   size="sm" 
                                   className="w-full"
                                   onClick={() => window.open(`/register/${webinar.slug}`, '_blank')}
                                 >
                                   <ExternalLink className="w-4 h-4 mr-2" /> View Link
                                 </Button>
                               )}
                             <Button 
                               variant="destructive" 
                               size="sm" 
                               className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none"
                               onClick={() => handleDeleteWebinar(webinar._id)}
                             >
                               <Trash2 className="w-4 h-4 mr-2" /> Delete
                             </Button>
                           </div>
                         </CardContent>
                       </Card>
                     ))}
                     {filteredWebinars.length === 0 && (
                       <div className="col-span-full py-12 text-center text-slate-400">
                         No {webinarTypeFilter === 'All' ? 'content' : webinarTypeFilter.toLowerCase() + 's'} found matching your search.
                       </div>
                     )}
                   </div>
                 </div>
             )
          )}

          {/* Dedicated Webinars Tab */}
          {activeTab === 'webinars' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Webinars</h2>
                  <p className="text-slate-500 text-sm mt-1">Create webinars with Instagram follow requirement for certificate access.</p>
                </div>
                <Button onClick={() => setIsAddWebinarOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Webinar
                </Button>
              </div>

              {/* Info Banner */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">How Webinar Registration Works</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Students register → Follow Instagram → Verify follow → Download Certificate
                  </p>
                </div>
              </div>

              {/* Webinars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webinars.filter(w => w.type === 'Webinar').map((webinar) => (
                  <Card key={webinar._id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                          <Presentation className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="success">Webinar</Badge>
                          <Badge variant={webinar.isActive ? 'outline' : 'secondary'}>
                            {webinar.isActive ? 'Active' : 'Closed'}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-slate-900 mb-2">{webinar.name}</h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{webinar.description}</p>

                      <div className="space-y-2 border-t border-slate-100 pt-4">
                        <div className="flex items-center text-sm text-slate-600 gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(webinar.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-slate-600 gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {webinar.location || 'Online'}
                        </div>
                        <div 
                          className="flex items-center text-sm text-slate-600 gap-2 cursor-pointer hover:bg-purple-50 -mx-2 px-2 py-1 rounded-lg transition-colors group"
                          onClick={() => {
                            setStudentCourseFilter(webinar.name);
                            setActiveTab('students');
                          }}
                          title="Click to view registered students"
                        >
                          <Users className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
                          <span className="font-semibold text-slate-900 group-hover:text-purple-600">{webinar.totalRegistrations}</span>
                          <span className="group-hover:text-purple-600">Registrations</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-purple-500 transition-opacity" />
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                          onClick={() => {
                            const link = `${window.location.protocol}//${window.location.host}/register/${webinar.slug}`;
                            navigator.clipboard.writeText(link);
                            alert(`Registration link copied!\n\n${link}\n\nStudents will be asked to follow Instagram before downloading certificate.`);
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" /> Copy Registration Link
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.open(`/register/${webinar.slug}`, '_blank')}
                          >
                            Preview
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                            onClick={() => handleDeleteWebinar(webinar._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {webinars.filter(w => w.type === 'Webinar').length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-slate-300">
                    <Presentation className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Webinars Yet</h3>
                    <p className="text-slate-500 mb-4">Create your first webinar to generate registration links.</p>
                    <Button onClick={() => setIsAddWebinarOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Create Webinar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
             <Card className="shadow-sm border-slate-200 overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                 <div>
                   <CardTitle>Students</CardTitle>
                   <p className="text-sm text-slate-500 mt-1">Manage student registrations and certificates.</p>
                 </div>
                 <div className="flex gap-3">
                    <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white p-1">
                      {['All', 'Course', 'Webinar'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setStudentTypeFilter(type as any)}
                          className={`h-full px-4 rounded-md text-sm font-medium transition-all ${
                            studentTypeFilter === type ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {type === 'All' ? 'All' : type + 's'}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        className="h-10 w-64 rounded-lg border border-slate-200 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                        placeholder="Search students..." 
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                       <select
                         className="h-10 rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none max-w-[150px]"
                         value={studentCourseFilter}
                         onChange={(e) => setStudentCourseFilter(e.target.value)}
                       >
                         <option value="All">All Programs</option>
                         {uniqueCourseNames.map((name, i) => (
                           <option key={i} value={name}>{name}</option>
                         ))}
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                    <Button variant="slate" onClick={() => setIsAddStudentOpen(true)} className="shadow-lg shadow-slate-200 ml-2">
                       <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                 </div>
               </CardHeader>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b border-slate-100 bg-white text-left">
                       <th className="px-6 py-4 font-semibold text-slate-500">Name</th>
                       <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
                       <th className="px-6 py-4 font-semibold text-slate-500">Enrolled Program</th>
                       <th className="px-6 py-4 font-semibold text-slate-500">Contact</th>
                       <th className="px-6 py-4 font-semibold text-slate-500">Location</th>
                       <th className="px-6 py-4 font-semibold text-slate-500 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 bg-white">
                     {filteredStudents.map((student) => {
                       const type = getProgramType(student.webinarName);
                       return (
                         <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                 {student.name[0]}
                               </div>
                               <div>
                                 <div className="font-semibold text-slate-900">{student.name}</div>
                                 <div className="text-xs text-slate-500">{student.certificateId}</div>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             {type === 'Webinar' ? (
                               <Badge variant="secondary">Registered</Badge>
                             ) : (
                               <Badge variant={student.isEligible ? 'success' : 'secondary'}>
                                 {student.isEligible ? 'Eligible' : 'Pending'}
                               </Badge>
                             )}
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex flex-col gap-1.5 items-start">
                               <span className="font-medium text-slate-600">{student.webinarName}</span>
                               <Badge variant={type === 'Course' ? 'blue' : 'success'}>
                                  {type}
                               </Badge>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-slate-500">
                             <div>{student.email}</div>
                             <div className="text-xs mt-0.5">{student.phone || 'N/A'}</div>
                           </td>
                           <td className="px-6 py-4 text-slate-500">{student.location || 'N/A'}</td>
                           <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-3">
                                {type === 'Course' && (
                                  <>
                                    <div className="flex items-center gap-2" title={admin?.username !== 'coimbatore_admin' ? "Only Coimbatore Admin can manage eligibility" : "Toggle Certificate Eligibility"}>
                                       <span className="text-xs font-medium text-slate-500">Eligible</span>
                                       <Switch 
                                         checked={student.isEligible}
                                         onCheckedChange={() => handleToggleEligibility(student._id, student.isEligible)}
                                         disabled={admin?.username !== 'coimbatore_admin'}
                                       />
                                    </div>
                                    
                                    {student.isEligible && (
                                      <button 
                                        onClick={() => handleSendCertificate(student._id)}
                                        disabled={admin?.username !== 'coimbatore_admin' || sendingEmailId === student._id}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                                          admin?.username !== 'coimbatore_admin' 
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                            : student.certificateSent 
                                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                        }`}
                                      >
                                        {sendingEmailId === student._id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Mail className="w-3 h-3" />
                                        )}
                                        {sendingEmailId === student._id ? 'Sending...' : (student.certificateSent ? 'Sent Email' : 'Send Email')}
                                      </button>
                                    )}
                                  </>
                                )}
                                
                                <button 
                                  onClick={() => handleDeleteStudent(student._id)}
                                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                           </td>
                         </tr>
                       );
                     })}
                     {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            No students found matching your filters.
                          </td>
                        </tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </Card>
          )}
        </main>
      </div>
      
      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white shadow-2xl animate-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>Add New Student</CardTitle>
              <button onClick={() => setIsAddStudentOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddStudent} className="space-y-4">
                <Input label="Full Name" placeholder="e.g. John Doe" value={newStudent.name} onChange={(e: any) => setNewStudent({...newStudent, name: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email" type="email" placeholder="john@example.com" value={newStudent.email} onChange={(e: any) => setNewStudent({...newStudent, email: e.target.value})} required />
                  <Input label="Phone" placeholder="+91 98765 43210" value={newStudent.phone} onChange={(e: any) => setNewStudent({...newStudent, phone: e.target.value})} required />
                </div>
                
                <div className="space-y-3">
                   <div className="space-y-2">
                       <label className="text-sm font-medium leading-none">Program Type</label>
                       <div className="flex gap-4">
                          {['Course', 'Webinar'].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="studentRegisterType" 
                                value={type} 
                                checked={studentRegisterType === type} 
                                onChange={(e) => {
                                   setStudentRegisterType(type as any);
                                   setNewStudent({...newStudent, webinarName: ''});
                                }}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                              />
                              <span className="text-sm text-slate-700">{type}</span>
                            </label>
                          ))}
                       </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-sm font-medium leading-none">Select {studentRegisterType}</label>
                     <div className="relative">
                       <select 
                         className="flex h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                         value={newStudent.webinarName}
                         onChange={(e) => setNewStudent({...newStudent, webinarName: e.target.value})}
                         required
                       >
                         <option value="" disabled>Select a {studentRegisterType}</option>
                         {webinars
                           .filter(w => w.type === studentRegisterType)
                           .map((w) => (
                             <option key={w._id} value={w.name}>{w.name}</option>
                           ))
                         }
                       </select>
                       <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                     </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Location" placeholder="e.g. Chennai" value={newStudent.location} onChange={(e: any) => setNewStudent({...newStudent, location: e.target.value})} required />
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Profession</label>
                    <div className="relative">
                      <select 
                        className="flex h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newStudent.profession}
                        onChange={(e) => setNewStudent({...newStudent, profession: e.target.value})}
                        required
                      >
                        <option value="" disabled>Select Profession</option>
                        <option value="Student">Student</option>
                        <option value="Entrepreneur">Entrepreneur</option>
                        <option value="Working Professional">Working Professional</option>
                        <option value="Home Maker">Home Maker</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Others">Others</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 bg-black h-4 w-4 animate-spin" />}
                    Add Student
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Webinar Modal */}
      {isAddWebinarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white shadow-2xl animate-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>Add New Program</CardTitle>
              <button onClick={() => setIsAddWebinarOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddWebinar} className="space-y-4">
                <Input label="Name" placeholder="e.g. Advanced Digital Marketing" value={newWebinar.name} onChange={(e: any) => setNewWebinar({...newWebinar, name: e.target.value})} required />
                
                <div className="space-y-2">
                   <label className="text-sm font-medium leading-none">Type</label>
                   <div className="flex gap-4">
                      {['Webinar', 'Course'].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="type" 
                            value={type} 
                            checked={newWebinar.type === type} 
                            onChange={(e) => setNewWebinar({...newWebinar, type: e.target.value})}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                          />
                          <span className="text-sm text-slate-700">{type}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <Input label="Description" placeholder="Brief description..." value={newWebinar.description} onChange={(e: any) => setNewWebinar({...newWebinar, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date" type="date" value={newWebinar.date} onChange={(e: any) => setNewWebinar({...newWebinar, date: e.target.value})} required />
                  <Input label="Location" placeholder="e.g. Online / Coimbatore" value={newWebinar.location} onChange={(e: any) => setNewWebinar({...newWebinar, location: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddWebinarOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
