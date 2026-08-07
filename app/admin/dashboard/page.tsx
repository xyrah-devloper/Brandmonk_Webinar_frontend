'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Palette, Code, Share2, Laptop, Presentation, Download, Upload, QrCode, Eye
} from 'lucide-react';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import { API_URL } from '@/utils/config';
import { dmJune190Names } from './dmJune190Names';
import { latestLatestStudents } from './latestLatestStudentsData';

// --- Types ---
interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  webinarName: string;
  webinarSlug?: string;
  webinarId?: string;
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
  certificateType?: 'Standard' | 'Government';
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

const CardDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-slate-500 ${className}`}>{children}</p>
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

  // Certificate Generator State
  const [certTemplate, setCertTemplate] = useState<string | null>(null);
  const [generatedCerts, setGeneratedCerts] = useState<Record<string, { id: string, name: string, dataUrl: string }[]>>({});
  const [isGeneratingCerts, setIsGeneratingCerts] = useState(false);
  const [selectedCertCourse, setSelectedCertCourse] = useState<string>('');
  const [courseStudents, setCourseStudents] = useState<{ _id: string, name: string, courseName: string, courseSlug: string, certificateId: string }[]>([]);
  const [selectedCertStudent, setSelectedCertStudent] = useState<string>(''); // For single student selection

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
  const [isUploading, setIsUploading] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [qrStudent, setQrStudent] = useState<Student | null>(null);

  // Verification form entries (from /verifystudent page)
  const [verificationEntries, setVerificationEntries] = useState<any[]>([]);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSearch, setVerificationSearch] = useState('');
  const [verificationCourseFilter, setVerificationCourseFilter] = useState<string>('All');
  const [verificationStatusFilter, setVerificationStatusFilter] = useState<'All' | 'inDb' | 'notInDb'>('All');
  const [verificationTimeFilter, setVerificationTimeFilter] = useState<'All' | 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth'>('All');

  // Forms
  const [newStudent, setNewStudent] = useState({
    name: '', email: '', phone: '', webinarName: '', location: '', profession: '', certificateType: 'Government'
  });
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

  // Certificate generation helper for any course
  const generateCertificatesForStudents = async (
    studentsToGenerate: { name: string; certificateId: string }[],
    courseSlug: string
  ) => {
    if (!certTemplate || studentsToGenerate.length === 0) return;

    setIsGeneratingCerts(true);
    setSelectedCertCourse(courseSlug);

    try {
      const newCerts: { id: string; name: string; dataUrl: string }[] = [];
      const templateImg = new Image();
      templateImg.src = certTemplate;
      await new Promise((resolve) => (templateImg.onload = resolve));

      // Ensure Niconne is loaded so every certificate uses the same font
      if (document.fonts) {
        try {
          await document.fonts.load('1em "Niconne"');
        } catch (e) {
          console.warn('Niconne font load failed, using fallback', e);
        }
      }

      const isLongId = courseSlug === 'digital-marketing' || courseSlug === 'digital-marketing-june-190' || courseSlug === 'data-analytics' || courseSlug === 'artificial-intelligence' || courseSlug === 'ui-ux';

      for (const student of studentsToGenerate) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        canvas.width = templateImg.width;
        canvas.height = templateImg.height;
        ctx.drawImage(templateImg, 0, 0);

        // Name (Title Case) - auto-scale to fill gap
        const titleCaseName = student.name
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        const maxNameWidth = canvas.width * 0.78;
        let nameFontSize = 140;
        ctx.font = `${nameFontSize}px "Niconne", cursive`;
        while (nameFontSize > 46 && ctx.measureText(titleCaseName).width > maxNameWidth) {
          nameFontSize -= 2;
          ctx.font = `${nameFontSize}px "Niconne", cursive`;
        }
        ctx.fillStyle = '#6f3230';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(titleCaseName, canvas.width / 2, canvas.height * 0.54);

        // Certificate ID (Poppins) - smaller for longer IDs
        const certIdFontSize = isLongId ? canvas.width * 0.0175 : canvas.width * 0.019;
        ctx.font = `${certIdFontSize}px "Poppins", sans-serif`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(student.certificateId, canvas.width * 0.775, canvas.height * 0.918);

        // QR code
        const qrUrl = `${window.location.origin}/verify/course/${student.certificateId}`;
        const qrDataUrl = await QRCode.toDataURL(qrUrl, { margin: 1, width: 260, color: { dark: '#000000', light: '#FFFFFF' } });
        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => (qrImg.onload = resolve));
        const qrSize = Math.min(canvas.width * 0.135, 220);
        ctx.drawImage(qrImg, ((canvas.width - qrSize) / 2) + (canvas.width * 0.010), canvas.height * 0.835, qrSize, qrSize);

        newCerts.push({ id: student.certificateId, name: student.name, dataUrl: canvas.toDataURL('image/png') });
      }

      setGeneratedCerts((prev) => ({ ...prev, [courseSlug]: newCerts }));
    } catch (err) {
      console.error(err);
      alert('Error generating certificates');
    } finally {
      setIsGeneratingCerts(false);
    }
  };

  const courseLabelMap: Record<string, string> = {
    'video-editing': 'VE',
    'digital-marketing': 'DM',
    'digital-marketing-june-190': 'DM_June190',
    'data-analytics': 'DA',
    'artificial-intelligence': 'AI',
    'ui-ux': 'UIUX',
    'digital-marketing-latest': 'DM_Latest',
    'ui-ux-latest': 'UIUX_Latest'
  };

  // Fetch students from DB and generate certificates for any course
  const generateCertificatesForCourseFromDB = async (courseSlug: string) => {
    try {
      const res = await axios.get(`${API_URL}/api/course-students/course/${courseSlug}`);
      if (!res.data.success || !res.data.students?.length) {
        alert(`No students found for ${courseLabelMap[courseSlug] || courseSlug}`);
        return;
      }
      await generateCertificatesForStudents(res.data.students, courseSlug);
    } catch (err) {
      console.error(err);
      alert(`Failed to fetch ${courseLabelMap[courseSlug] || courseSlug} students`);
    }
  };

  // Generate certificates for all courses at once
  const generateAllCourses = async () => {
    const allCourses = ['video-editing', 'digital-marketing', 'ui-ux', 'data-analytics', 'artificial-intelligence'];
    for (const courseSlug of allCourses) {
      await generateCertificatesForCourseFromDB(courseSlug);
    }
  };

  // New students added in this batch - generate certificates for these alone
  const newStudentNamesByCourse: Record<string, string[]> = {
    'digital-marketing': [
      'Nirmal Raj', 'Harish M R', 'Naveen Vinayak S', 'Lakshmi Durgaa M', 'Abuthahir J',
      'Gayathri V', 'SANDHIYA S', 'ABINAYA M', 'DHAYANANDHAN V', 'NAVEENKUMAR M', 'Atulaananth M',
      'Radhamani S', 'Rekha'
    ],
    'ui-ux': [
      'Dinesh Kumar K', 'Mathavan S', 'Balaji K C', 'Ganesh K', 'Boomika S',
      'CHEZLIYAN N L', 'SHYAM KUMAR A', 'ABISHEK K', 'ISHWARYA MOOGAMBIGA B'
    ],
    'video-editing': [
      'Kavitha M', 'Banupriya M', 'Sabarivasan M', 'D RAJA', 'SIVAPRAKASH B',
      'Gayathri M N', 'Elanchezhiyan'
    ]
  };

  const generateNewStudentsCertificates = async () => {
    const courses = Object.keys(newStudentNamesByCourse) as string[];
    for (const courseSlug of courses) {
      try {
        const res = await axios.get(`${API_URL}/api/course-students/course/${courseSlug}`);
        if (!res.data.success || !res.data.students?.length) {
          console.log(`No students found for ${courseSlug}`);
          continue;
        }
        const allowedNames = new Set(
          newStudentNamesByCourse[courseSlug].map(n => n.trim().toUpperCase())
        );
        const filtered = res.data.students.filter((s: any) =>
          allowedNames.has(s.name.trim().toUpperCase())
        );
        if (filtered.length === 0) {
          console.log(`No new students found for ${courseSlug}`);
          continue;
        }
        await generateCertificatesForStudents(filtered, courseSlug);
      } catch (err) {
        console.error(`Failed to generate new certificates for ${courseSlug}:`, err);
      }
    }
  };

  // Generate certificates for latest batch students
  const generateLatestCertificates = async () => {
    const courses = Object.keys(latestLatestStudents) as string[];
    for (const courseSlug of courses) {
      try {
        const studentsToGenerate = latestLatestStudents[courseSlug];
        if (!studentsToGenerate || studentsToGenerate.length === 0) {
          console.log(`No latest students found for ${courseSlug}`);
          continue;
        }
        await generateCertificatesForStudents(studentsToGenerate, courseSlug);
      } catch (err) {
        console.error(`Failed to generate latest certificates for ${courseSlug}:`, err);
      }
    }
  };

  // Export generated certificates for a course as a single PDF (one per page)
  const exportCoursePDF = async (courseSlug: string) => {
    const courseCerts = generatedCerts[courseSlug];
    if (!courseCerts || courseCerts.length === 0) {
      alert('No certificates generated yet. Generate certificates first.');
      return;
    }

    try {
      setIsGeneratingCerts(true);
      const courseLabel = courseLabelMap[courseSlug] || 'Course';
      const pdf = new jsPDF('l', 'mm', 'a4'); // A4 landscape
      const pageWidth = 297;
      const pageHeight = 210;

      for (let i = 0; i < courseCerts.length; i++) {
        const cert = courseCerts[i];
        if (i > 0) pdf.addPage('a4', 'l');
        pdf.addImage(cert.dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
      }

      pdf.save(`${courseLabel}_Certificates_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF.');
    } finally {
      setIsGeneratingCerts(false);
    }
  };

  useEffect(() => {
    const adminData = sessionStorage.getItem('adminData');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
      fetchData();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === 'verifications') {
      fetchVerificationEntries();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [studentsRes, statsRes, webinarsRes] = await Promise.allSettled([
        axios.get(`${API_URL}/api/admin/students`),
        axios.get(`${API_URL}/api/admin/stats`),
        axios.get(`${API_URL}/api/webinars`)
      ]);

      if (studentsRes.status === 'fulfilled' && studentsRes.value?.data?.success) {
        const studentsData = Array.isArray(studentsRes.value.data.students) ? studentsRes.value.data.students : [];
        setStudents(studentsData);

        // Log duplicates in console if any exist
        if (studentsRes.value.data.duplicates && studentsRes.value.data.duplicates.length > 0) {
          const duplicates = studentsRes.value.data.duplicates;
          console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`🔄 DUPLICATE REGISTRATIONS FOUND: ${duplicates.length}`);
          console.log(`📊 Total in DB: ${studentsRes.value.data.totalInDB} | Unique: ${studentsData.length}`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          duplicates.forEach((dup: any, index: number) => {
            console.log(`${index + 1}. ${dup.name} (${dup.email})`);
            console.log(`   Course: ${dup.course}`);
            console.log(`   Registered: ${new Date(dup.registeredAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}`);
            console.log('');
          });
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        }
      } else {
        setStudents([]);
      }

      if (statsRes.status === 'fulfilled' && statsRes.value?.data?.success) {
        setStats(statsRes.value.data.stats);
      } else {
        setStats({
          totalStudents: 0,
          eligibleStudents: 0,
          certificatesSent: 0,
          monthlyRegistrations: [],
          topWebinars: []
        });
      }

      if (webinarsRes.status === 'fulfilled' && webinarsRes.value?.data?.success) {
        const webinarsData = Array.isArray(webinarsRes.value.data.webinars) ? webinarsRes.value.data.webinars : [];
        setWebinars(webinarsData);
      } else {
        setWebinars([]);
      }

      if (studentsRes.status === 'rejected' || statsRes.status === 'rejected' || webinarsRes.status === 'rejected') {
        console.error('One or more dashboard API calls failed', {
          studentsError: studentsRes.status === 'rejected' ? studentsRes.reason : null,
          statsError: statsRes.status === 'rejected' ? statsRes.reason : null,
          webinarsError: webinarsRes.status === 'rejected' ? webinarsRes.reason : null
        });
      }


    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationEntries = async () => {
    setVerificationLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/verify-student/entries`);
      if (res.data.success) {
        setVerificationEntries(res.data.entries || []);
      } else {
        setVerificationEntries([]);
      }
    } catch (err) {
      console.error('Failed to fetch verification entries:', err);
      setVerificationEntries([]);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleDeleteVerification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this verification entry?')) return;
    try {
      await axios.delete(`${API_URL}/api/verify-student/entries/${id}`);
      fetchVerificationEntries();
    } catch (err) {
      console.error('Failed to delete verification entry:', err);
      alert('Failed to delete verification entry');
    }
  };

  const filteredVerificationEntries = useMemo(() => {
    return verificationEntries.filter(entry => {
      const search = verificationSearch.trim().toLowerCase();
      if (search) {
        const name = (entry.name || '').toLowerCase();
        const email = (entry.email || '').toLowerCase();
        const mobile = (entry.mobile || '').toLowerCase();
        if (!name.includes(search) && !email.includes(search) && !mobile.includes(search)) return false;
      }

      if (verificationCourseFilter !== 'All') {
        const course = entry.courseName || 'N/A';
        if (course !== verificationCourseFilter) return false;
      }

      if (verificationStatusFilter !== 'All') {
        const inDb = Boolean(entry.certificateId && !String(entry.certificateId).startsWith('BMA-GRAD-'));
        if (verificationStatusFilter === 'inDb' && !inDb) return false;
        if (verificationStatusFilter === 'notInDb' && inDb) return false;
      }

      if (verificationTimeFilter !== 'All' && entry.createdAt) {
        const date = new Date(entry.createdAt);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        const last7 = new Date(today); last7.setDate(last7.getDate() - 6);
        const last30 = new Date(today); last30.setDate(last30.getDate() - 29);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        switch (verificationTimeFilter) {
          case 'today':
            if (date < today) return false;
            break;
          case 'yesterday':
            if (date < yesterday || date >= today) return false;
            break;
          case 'last7':
            if (date < last7) return false;
            break;
          case 'last30':
            if (date < last30) return false;
            break;
          case 'thisMonth':
            if (date < thisMonth) return false;
            break;
        }
      }
      return true;
    });
  }, [verificationEntries, verificationSearch, verificationCourseFilter, verificationStatusFilter, verificationTimeFilter]);

  const verificationCourseOptions = useMemo(() => {
    const courses = new Set<string>();
    verificationEntries.forEach(entry => courses.add(entry.courseName || 'N/A'));
    return ['All', ...Array.from(courses).sort()];
  }, [verificationEntries]);

  // --- Levenshtein Distance Helper for Fuzzy Matching ---
  const levenshteinDistance = (str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[len1][len2];
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  };

  // --- Smart Webinar Matching Helper ---
  const findMatchingWebinar = (studentWebinarName: string, debug: boolean = false): Webinar | undefined => {
    if (!studentWebinarName) return undefined;

    const studentName = studentWebinarName.trim();

    // 1. Try exact match first
    let match = webinars.find(w => w.name === studentName);
    if (match) return match;

    // 2. Try case-insensitive exact match
    match = webinars.find(w => w.name.toLowerCase() === studentName.toLowerCase());
    if (match) return match;

    // 3. Try similarity-based fuzzy matching (threshold: 0.50 = 50% similar)
    let bestMatch: Webinar | undefined;
    let bestSimilarity = 0;
    const SIMILARITY_THRESHOLD = 0.50; // 50% similarity required (lowered to catch more variations)

    webinars.forEach(w => {
      const similarity = calculateSimilarity(studentName, w.name);
      if (similarity > bestSimilarity && similarity >= SIMILARITY_THRESHOLD) {
        bestSimilarity = similarity;
        bestMatch = w;
      }
    });

    if (bestMatch) return bestMatch;

    // 4. Try matching by first significant word (ignore common words)
    const ignoreWords = ['the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'at', 'to'];
    const studentWords = studentName.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !ignoreWords.includes(w));

    if (studentWords.length > 0) {
      match = webinars.find(w => {
        const webinarWords = w.name.toLowerCase().split(/\s+/).filter(word => word.length > 2 && !ignoreWords.includes(word));
        return webinarWords.some(ww => studentWords.some(sw => ww === sw || ww.includes(sw) || sw.includes(ww)));
      });

      if (match) return match;
    }

    // 5. Try partial substring match (one contains the other, min 5 chars)
    match = webinars.find(w => {
      const studentLower = studentName.toLowerCase();
      const webinarLower = w.name.toLowerCase();

      if (studentLower.length >= 5 && webinarLower.length >= 5) {
        return studentLower.includes(webinarLower) || webinarLower.includes(studentLower);
      }
      return false;
    });

    if (match) return match;

    // 6. No match found
    return undefined;
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
    topWebinars: (() => {
      const counts: Record<string, number> = {};

      // Count students using smart matching
      students.forEach(s => {
        const webinar = findMatchingWebinar(s.webinarName);
        if (webinar) {
          counts[webinar.name] = (counts[webinar.name] || 0) + 1;
        }
      });

      // Convert to array and sort
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5
    })()
  };

  // Calculate actual registration counts from students using smart matching
  const webinarsWithCounts = webinars.map(w => {
    // Count students by slug (supports repeated webinars with same name)
    // Fallbacks keep older/manual records from disappearing entirely.
    const actualCount = students.filter(s => {
      if (s.webinarSlug && w.slug) return s.webinarSlug === w.slug;

      // Legacy fallback: if student has webinarId stored
      if (s.webinarId) return String(s.webinarId) === String(w._id);

      // Last-resort fallback: old records that only stored webinarName
      const matchedWebinar = findMatchingWebinar(s.webinarName);
      return matchedWebinar && matchedWebinar._id === w._id;
    }).length;

    return {
      ...w,
      totalRegistrations: actualCount
    };
  });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/admin/students`, newStudent);
      if (res.data.success) {
        setStudents([res.data.student, ...students]);
        setIsAddStudentOpen(false);
        setNewStudent({ name: '', email: '', phone: '', webinarName: '', location: '', profession: '', certificateType: 'Government' });
        fetchData();

        // Auto-open QR for the new student
        setQrStudent(res.data.student);
        setIsQROpen(true);
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
  const [isRemovingDuplicates, setIsRemovingDuplicates] = useState(false);

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

  const handleRemoveDuplicates = async () => {
    if (!window.confirm('⚠️ This will permanently delete duplicate registrations (same email + same course).\n\nOnly the FIRST registration will be kept.\n\nAre you sure you want to continue?')) {
      return;
    }

    setIsRemovingDuplicates(true);
    try {
      const res = await axios.post(`${API_URL}/api/admin/students/remove-duplicates`);
      if (res.data.success) {
        alert(`✅ ${res.data.message}\n\nRemoved: ${res.data.removed} duplicates`);
        fetchData(); // Refresh all data
      }
    } catch (err: any) {
      console.error('Failed to remove duplicates:', err);
      alert(err.response?.data?.message || 'Failed to remove duplicates.');
    } finally {
      setIsRemovingDuplicates(false);
    }
  };

  // Download students data as XLSX
  const downloadStudentsXLSX = () => {
    // Prepare data for export
    const exportData = students.map((student, index) => ({
      'S.No': index + 1,
      'Name': student.name,
      'Email': student.email,
      'Phone': student.phone || 'N/A',
      'Program Name': student.webinarName,
      'Program Type': getProgramType(student.webinarName),
      'Location': student.location || 'N/A',
      'Profession': student.profession || 'N/A',
      'College/Company': student.collegeOrCompany || 'N/A',
      'Department': student.department || 'N/A',
      'Year/Experience': student.yearOfStudyOrExperience || 'N/A',
      'Certificate ID': student.certificateId,
      'Instagram Followed': student.hasFollowedInstagram ? 'Yes' : 'No',
      'Registration Date': new Date(student.dateOfRegistration || student.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 6 },   // S.No
      { wch: 25 },  // Name
      { wch: 30 },  // Email
      { wch: 15 },  // Phone
      { wch: 25 },  // Program Name
      { wch: 12 },  // Program Type
      { wch: 15 },  // Location
      { wch: 20 },  // Profession
      { wch: 25 },  // College/Company
      { wch: 20 },  // Department
      { wch: 15 },  // Year/Experience
      { wch: 18 },  // Certificate ID
      { wch: 16 },  // Instagram Followed
      { wch: 18 },  // Registration Date
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Generate filename with date
    const today = new Date().toISOString().split('T')[0];
    const filename = `BrandMonk_Students_${today}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };

  // Upload and import students from XLSX file
  const handleUploadXLSX = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsUploading(true);

    try {
      // Read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            alert('No data found in the Excel file');
            setIsUploading(false);
            return;
          }

          console.log('Parsed XLSX data:', jsonData.length, 'rows');
          console.log('Sample row:', jsonData[0]);

          // Send to backend
          const res = await axios.post(`${API_URL}/api/admin/students/bulk-import`, {
            students: jsonData
          });

          if (res.data.success) {
            const { results } = res.data;
            alert(`Import Complete!\n\n✅ ${results.success} students added\n⏭️ ${results.skipped} skipped (duplicates)\n❌ ${results.failed} failed`);

            // Refresh data
            fetchData();
          } else {
            alert('Import failed: ' + res.data.message);
          }
        } catch (parseError: any) {
          console.error('XLSX parse error:', parseError);
          alert('Failed to parse Excel file: ' + parseError.message);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        alert('Failed to read file');
        setIsUploading(false);
      };

      reader.readAsBinaryString(file);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
      setIsUploading(false);
    }

    // Reset file input
    event.target.value = '';
  };

  // Filter Logic
  const getProgramType = (programName: string) => {
    const webinar = findMatchingWebinar(programName);
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

  const filteredWebinars = webinarsWithCounts.filter(w => {
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
              src="/logo bm.png"
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
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'verifications', label: 'Verifications', icon: ShieldCheck },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${activeTab === item.id
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
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'courses' && 'Course Management'}
              {activeTab === 'webinars' && 'Webinar Management'}
              {activeTab === 'students' && 'Student Records'}

              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'courses' && 'Course Management'}
              {activeTab === 'webinars' && 'Webinar Management'}
              {activeTab === 'students' && 'Student Records'}
              {activeTab === 'certificates' && 'Certificate Generator'}
              {activeTab === 'verifications' && 'Student Verifications'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Welcome back, <span className="font-medium text-slate-700">{admin?.username}</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{admin?.username}</p>
                <p className="text-xs text-slate-500 capitalize">{admin?.role || 'Admin'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white">
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
                {(() => {
                  // Calculate actual total from webinar counts
                  const actualTotalCounted = derivedStats.topWebinars.reduce((sum, w) => sum + w.count, 0);
                  // Get total from all webinars (including those not in top 5)
                  const allWebinarCounts = webinarsWithCounts.reduce((sum, w) => sum + w.totalRegistrations, 0);
                  const uniqueStudents = students.length; // Frontend receives deduplicated data
                  const databaseTotal = stats?.totalStudents || 0; // Backend database total (may include duplicates)
                  const hasDiscrepancy = allWebinarCounts !== uniqueStudents;
                  const hasDuplicates = databaseTotal > uniqueStudents;

                  return [
                    {
                      label: 'Total Registrations',
                      value: uniqueStudents,
                      sub: 'Unique students',
                      icon: Users,
                      warning: hasDiscrepancy,
                      info: hasDuplicates
                    },
                    { label: 'Active Courses', value: webinars.filter(w => w.isActive).length, sub: 'Currently running', icon: Video },
                    { label: 'Certificates Sent', value: stats?.certificatesSent || 0, sub: 'Successfully issued', icon: Award },
                    { label: 'Eligible Students', value: stats?.eligibleStudents || 0, sub: 'Met criteria', icon: CheckCircle },
                  ].map((stat, i) => (
                    <Card key={i} className={stat.warning ? 'border-amber-200 bg-amber-50/30' : stat.info ? 'border-blue-200 bg-blue-50/30' : ''}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.warning ? 'text-amber-500' : stat.info ? 'text-blue-500' : 'text-slate-400'}`} />
                      </CardHeader>
                      <CardContent>
                        <div className={`text-3xl font-bold ${stat.warning ? 'text-amber-600' : stat.info ? 'text-blue-600' : 'text-slate-900'}`}>{stat.value}</div>
                        <p className={`text-xs mt-1 ${stat.warning ? 'text-amber-600 font-semibold' : stat.info ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>{stat.sub}</p>
                      </CardContent>
                    </Card>
                  ));
                })()}
              </div>

              {/* Charts Section - NEW GRID */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">

                {/* Registration Trends Chart */}
                <Card className="col-span-8 lg:col-span-5 shadow-sm border-slate-200 min-w-0">
                  <CardHeader>
                    <CardTitle>Registration Trends</CardTitle>
                    <p className="text-sm text-slate-500">Monthly student registrations for the current year.</p>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[350px] w-full min-w-0 min-h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={derivedStats.monthlyRegistrations}>
                          <defs>
                            <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                <Card className="col-span-8 lg:col-span-3 shadow-sm border-slate-200 min-w-0">
                  <CardHeader>
                    <CardTitle>Top Programs</CardTitle>
                    <p className="text-sm text-slate-500">Most popular courses by registration.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full min-w-0 min-h-[320px]">
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
                            cursor={{ fill: '#f1f5f9' }}
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
                    {webinarsWithCounts.filter(w => w.type === 'Course').map(batch => (
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {webinarsWithCounts.filter(w => w.type === 'Course').length === 0 && (
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
                            onChange={(e: any) => setBatchForm({ ...batchForm, batchCode: e.target.value })}
                            placeholder="e.g. FSD-01"
                          />
                          <Input
                            label="Batch Name"
                            value={batchForm.batchName}
                            onChange={(e: any) => setBatchForm({ ...batchForm, batchName: e.target.value })}
                            placeholder="e.g. October Batch"
                          />
                        </div>

                        <Input
                          label="Trainer Name"
                          value={batchForm.trainer}
                          onChange={(e: any) => setBatchForm({ ...batchForm, trainer: e.target.value })}
                          placeholder="Trainer Name"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Start Date"
                            type="date"
                            value={batchForm.startDate}
                            onChange={(e: any) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                          />
                          <Input
                            label="Timing"
                            value={batchForm.timing}
                            onChange={(e: any) => setBatchForm({ ...batchForm, timing: e.target.value })}
                            placeholder="e.g. 10 AM - 12 PM"
                          />
                        </div>

                        <Input
                          label="Number of Students (Limit)"
                          type="number"
                          value={batchForm.studentLimit}
                          onChange={(e: any) => setBatchForm({ ...batchForm, studentLimit: e.target.value })}
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
              // Standard Admin View (Coimbatore / Super Admin) - Courses Only
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your courses available to students.</p>
                  </div>

                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        className="h-10 rounded-lg border border-slate-200 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Search courses..."
                        value={webinarSearch}
                        onChange={(e) => setWebinarSearch(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setNewStudent({ ...newStudent, webinarName: '', certificateType: 'Government' });
                        setIsAddStudentOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                    <Button onClick={() => setIsAddWebinarOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Course
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {webinarsWithCounts.filter(w => w.type === 'Course' && w.name.toLowerCase().includes(webinarSearch.toLowerCase())).map((webinar) => (
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
                          <Button
                            className="w-full bg-slate-900 text-white hover:bg-slate-800"
                            onClick={() => {
                              setNewStudent({
                                ...newStudent,
                                webinarName: webinar.name,
                                certificateType: 'Government' // Reset or default
                              });
                              setIsAddStudentOpen(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Student
                          </Button>

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
                  {webinarsWithCounts.filter(w => w.type === 'Course' && w.name.toLowerCase().includes(webinarSearch.toLowerCase())).length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400">
                      No courses found matching your search.
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
                {webinarsWithCounts.filter(w => w.type === 'Webinar').map((webinar) => (
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
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(`/register/${webinar.slug}`, '_blank')}
                          >
                            Preview Form
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {webinarsWithCounts.filter(w => w.type === 'Webinar').length === 0 && (
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
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Student Records</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">Manage student registrations and certificates.</p>
                    </div>
                    <Button variant="slate" onClick={() => setIsAddStudentOpen(true)} className="shadow-lg shadow-slate-200">
                      <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                      {['All', 'Course', 'Webinar'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setStudentTypeFilter(type as any)}
                          className={`h-full px-4 rounded-md text-sm font-medium transition-all ${studentTypeFilter === type ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                          {type === 'All' ? 'All' : type + 's'}
                        </button>
                      ))}
                    </div>

                    <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-4 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Search students..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <select
                        className="h-10 rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none min-w-[150px]"
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

                    <div className="flex gap-2 ml-auto">
                      <Button
                        variant="outline"
                        onClick={downloadStudentsXLSX}
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 shadow-sm"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>

                      <div className="relative">
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleUploadXLSX}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={isUploading}
                          id="xlsx-upload"
                        />
                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 pointer-events-none shadow-sm"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" /> Upload
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-white text-left">
                      <th className="px-4 py-4 font-semibold text-slate-500 text-center w-16">S.No</th>
                      <th className="px-6 py-4 font-semibold text-slate-500">Name</th>
                      <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
                      <th className="px-6 py-4 font-semibold text-slate-500">Enrolled Program</th>
                      <th className="px-6 py-4 font-semibold text-slate-500">Contact</th>
                      <th className="px-6 py-4 font-semibold text-slate-500">Location</th>
                      <th className="px-6 py-4 font-semibold text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredStudents.map((student, index) => {
                      const type = getProgramType(student.webinarName);
                      return (
                        <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-4 text-center text-slate-500 font-medium">
                            {index + 1}
                          </td>
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
                                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${admin?.username !== 'coimbatore_admin'
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
                                onClick={() => {
                                  setQrStudent(student);
                                  setIsQROpen(true);
                                }}
                                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                title="View/Generate QR Code"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>

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



          {/* Certificate Generator Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Certificate Generator</CardTitle>
                  <p className="text-sm text-slate-500">Generate certificates with student names and certificate IDs.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Upload Template */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">1. Upload Certificate Template</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setCertTemplate(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {!certTemplate ? (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-sm text-slate-600 font-medium">Click to upload template image</p>
                          <p className="text-xs text-slate-400">PNG, JPG (Certificate Template)</p>
                        </div>
                      ) : (
                        <div className="relative inline-block border border-slate-200 shadow-lg rounded-lg overflow-hidden max-h-[400px]">
                          <img src={certTemplate} alt="Template" className="max-h-[400px] object-contain" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setCertTemplate(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Generate Certificates */}
                  {certTemplate && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <label className="text-sm font-medium">2. Generate New Certificates</label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            disabled={isGeneratingCerts}
                            onClick={generateLatestCertificates}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                          >
                            {isGeneratingCerts ? (
                              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
                            ) : (
                              <><Sparkles className="w-4 h-4 mr-2" /> Generate Latest Certificates</>
                            )}
                          </Button>
                          <Button
                            disabled={isGeneratingCerts}
                            onClick={generateNewStudentsCertificates}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            {isGeneratingCerts ? (
                              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
                            ) : (
                              <><Sparkles className="w-4 h-4 mr-2" /> Generate New Students Certificates</>
                            )}
                          </Button>
                          <Button
                            disabled={isGeneratingCerts}
                            onClick={generateAllCourses}
                            className="bg-slate-900 hover:bg-slate-800 text-white"
                          >
                            {isGeneratingCerts ? (
                              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
                            ) : (
                              <><Sparkles className="w-4 h-4 mr-2" /> Generate All Certificates</>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { slug: 'video-editing', label: 'VE', title: 'Video Editing', color: 'bg-purple-600 hover:bg-purple-700', icon: Video },
                          { slug: 'digital-marketing', label: 'DM', title: 'Digital Marketing', color: 'bg-blue-600 hover:bg-blue-700', icon: Award },
                          { slug: 'ui-ux', label: 'UI/UX', title: 'UI/UX', color: 'bg-amber-600 hover:bg-amber-700', icon: Palette },
                          { slug: 'data-analytics', label: 'DA', title: 'Data Analytics', color: 'bg-emerald-600 hover:bg-emerald-700', icon: TrendingUp },
                          { slug: 'artificial-intelligence', label: 'AI', title: 'Artificial Intelligence', color: 'bg-rose-600 hover:bg-rose-700', icon: Sparkles },
                        ].map((course) => {
                          const generated = generatedCerts[course.slug];
                          const Icon = course.icon;
                          return (
                            <Card key={course.slug} className="border-slate-200 p-4 flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${course.color.replace('hover:bg-', 'bg-').split(' ')[0]} flex items-center justify-center text-white`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-900">{course.title}</h4>
                                  <p className="text-xs text-slate-500">{generated ? `${generated.length} generated` : 'Not generated'}</p>
                                </div>
                              </div>
                              <Button
                                disabled={isGeneratingCerts}
                                onClick={async () => {
                                  await generateCertificatesForCourseFromDB(course.slug);
                                }}
                                className={`h-10 w-full ${course.color} text-white`}
                              >
                                {isGeneratingCerts && selectedCertCourse === course.slug ? (
                                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
                                ) : (
                                  <><Sparkles className="w-4 h-4 mr-2" /> Generate {course.label} Certificates</>
                                )}
                              </Button>
                              {generated && generated.length > 0 && (
                                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                                  <Button
                                    onClick={async () => {
                                      try {
                                        const zip = new JSZip();
                                        generated.forEach((cert) => {
                                          const base64Data = cert.dataUrl.split(',')[1];
                                          const fileName = `${cert.name.replace(/[^a-z0-9]/gi, '_')}_${cert.id.replace(/[^a-z0-9]/gi, '_')}_${course.label}_Certificate.png`;
                                          zip.file(fileName, base64Data, { base64: true });
                                        });
                                        const content = await zip.generateAsync({ type: 'blob' });
                                        const url = window.URL.createObjectURL(content);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `${course.label}_Certificates_${new Date().toISOString().slice(0, 10)}.zip`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                      } catch (error) {
                                        console.error('Error creating zip:', error);
                                        alert('Failed to create zip file.');
                                      }
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                  >
                                    <Download className="w-4 h-4 mr-2" /> Download {course.label} ZIP
                                  </Button>
                                  <Button
                                    onClick={() => exportCoursePDF(course.slug)}
                                    disabled={isGeneratingCerts}
                                    className="bg-rose-600 hover:bg-rose-700 text-white"
                                  >
                                    {isGeneratingCerts ? (
                                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Exporting...</>
                                    ) : (
                                      <><Download className="w-4 h-4 mr-2" /> Export {course.label} PDF</>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>

                      {/* DM June190 batch (kept separate because it uses a filtered name list) */}
                      <div className="mt-4">
                        <Button
                          disabled={isGeneratingCerts}
                          onClick={async () => {
                            try {
                              const res = await axios.get(`${API_URL}/api/course-students/course/digital-marketing`);
                              if (!res.data.success || !res.data.students?.length) {
                                alert('No Digital Marketing students found in database');
                                return;
                              }
                              const normalize = (name: string) =>
                                name.trim().toUpperCase().replace(/\s+/g, ' ').replace(/\./g, '').replace(/,/g, '');
                              const allowedNames = new Set(dmJune190Names.map(normalize));
                              const filtered = res.data.students.filter((s: any) =>
                                allowedNames.has(normalize(s.name))
                              );
                              if (filtered.length === 0) {
                                alert('None of the 190 DM June students found in database');
                                return;
                              }
                              await generateCertificatesForStudents(filtered, 'digital-marketing-june-190');
                            } catch (err) {
                              console.error(err);
                              alert('Failed to fetch DM students');
                            }
                          }}
                          className="h-12 bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
                        >
                          {isGeneratingCerts && selectedCertCourse === 'digital-marketing-june-190' ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating...</>
                          ) : (
                            <><Sparkles className="w-5 h-5 mr-2" /> Generate DM June190 Certificates ({dmJune190Names.length})</>
                          )}
                        </Button>
                        {generatedCerts['digital-marketing-june-190'] && generatedCerts['digital-marketing-june-190'].length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button
                              onClick={async () => {
                                try {
                                  const zip = new JSZip();
                                  generatedCerts['digital-marketing-june-190'].forEach((cert) => {
                                    const base64Data = cert.dataUrl.split(',')[1];
                                    const fileName = `${cert.name.replace(/[^a-z0-9]/gi, '_')}_${cert.id.replace(/[^a-z0-9]/gi, '_')}_DM_June190_Certificate.png`;
                                    zip.file(fileName, base64Data, { base64: true });
                                  });
                                  const content = await zip.generateAsync({ type: 'blob' });
                                  const url = window.URL.createObjectURL(content);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = `DM_June190_Certificates_${new Date().toISOString().slice(0, 10)}.zip`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                } catch (error) {
                                  console.error('Error creating zip:', error);
                                  alert('Failed to create zip file.');
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Download className="w-4 h-4 mr-2" /> Download DM June190 ZIP
                            </Button>
                            <Button
                              onClick={() => exportCoursePDF('digital-marketing-june-190')}
                              disabled={isGeneratingCerts}
                              className="bg-rose-600 hover:bg-rose-700 text-white"
                            >
                              {isGeneratingCerts ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Exporting...</>
                              ) : (
                                <><Download className="w-4 h-4 mr-2" /> Export DM June190 PDF</>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* Results */}
              {Object.keys(generatedCerts).length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">Generated Certificates</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.keys(generatedCerts).map((courseSlug) => (
                          <button
                            key={courseSlug}
                            onClick={() => setSelectedCertCourse(courseSlug)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCertCourse === courseSlug
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                          >
                            {courseLabelMap[courseSlug] || courseSlug} ({generatedCerts[courseSlug]?.length || 0})
                          </button>
                        ))}
                      </div>
                    </div>
                    {selectedCertCourse && generatedCerts[selectedCertCourse] && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={async () => {
                            const courseCerts = generatedCerts[selectedCertCourse];
                            if (!courseCerts || courseCerts.length === 0) return;

                            try {
                              const zip = new JSZip();
                              const courseLabel = courseLabelMap[selectedCertCourse] || 'Course';

                              courseCerts.forEach((cert) => {
                                const base64Data = cert.dataUrl.split(',')[1];
                                const fileName = `${cert.name.replace(/[^a-z0-9]/gi, '_')}_${cert.id.replace(/[^a-z0-9]/gi, '_')}_${courseLabel}_Certificate.png`;
                                zip.file(fileName, base64Data, { base64: true });
                              });

                              const content = await zip.generateAsync({ type: "blob" });
                              const url = window.URL.createObjectURL(content);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `${courseLabel}_Certificates_${new Date().toISOString().slice(0, 10)}.zip`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error("Error creating zip:", error);
                              alert("Failed to create zip file.");
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" /> Download {courseLabelMap[selectedCertCourse] || 'Course'} ZIP ({generatedCerts[selectedCertCourse]?.length || 0})
                        </Button>
                        <Button
                          onClick={() => exportCoursePDF(selectedCertCourse)}
                          disabled={isGeneratingCerts}
                          className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          {isGeneratingCerts ? (
                            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Exporting...</>
                          ) : (
                            <><Download className="w-4 h-4 mr-2" /> Export PDF ({generatedCerts[selectedCertCourse]?.length || 0})</>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  {selectedCertCourse && generatedCerts[selectedCertCourse] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedCerts[selectedCertCourse].map((cert) => (
                        <Card key={cert.id} className="overflow-hidden">
                          <div className="relative aspect-[1.414] bg-slate-100 group">
                            <img src={cert.dataUrl} alt={cert.name} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                className="p-2 bg-white rounded-full hover:bg-emerald-50 text-emerald-600 shadow-lg"
                                onClick={() => {
                                  const w = window.open('about:blank');
                                  const image = new Image();
                                  image.src = cert.dataUrl;
                                  setTimeout(function () {
                                    w?.document.write(image.outerHTML);
                                  }, 0);
                                }}
                                title="View Full Size"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <a
                                href={cert.dataUrl}
                                download={`${cert.name.replace(/[^a-z0-9]/gi, '_')}_${cert.id.replace(/[^a-z0-9]/gi, '_')}_${courseLabelMap[selectedCertCourse] || 'Course'}_Certificate.png`}
                                className="p-2 bg-white rounded-full hover:bg-blue-50 text-blue-600 shadow-lg"
                                title="Download"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                          <div className="p-3 border-t border-slate-100 flex justify-between items-center">
                            <p className="font-semibold text-sm truncate">{cert.name}</p>
                            <a
                              href={cert.dataUrl}
                              download={`${cert.name.replace(/[^a-z0-9]/gi, '_')}_${cert.id.replace(/[^a-z0-9]/gi, '_')}_${courseLabelMap[selectedCertCourse] || 'Course'}_Certificate.png`}
                              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center"
                            >
                              <Download className="w-3 h-3 mr-1" /> Download
                            </a>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Student Verifications Tab */}
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Verification Form Submissions</CardTitle>
                    <CardDescription>Students who filled the verification form at /verifystudent</CardDescription>
                  </div>
                  <Button
                    onClick={fetchVerificationEntries}
                    disabled={verificationLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {verificationLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4 mr-2" /> Refresh</>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {verificationEntries.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No verification form submissions yet.</p>
                      <p className="text-sm mt-1">Submissions from the /verifystudent page will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search name, email, mobile..."
                            value={verificationSearch}
                            onChange={(e) => setVerificationSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <select
                          value={verificationCourseFilter}
                          onChange={(e) => setVerificationCourseFilter(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          {verificationCourseOptions.map((course) => (
                            <option key={course} value={course}>{course === 'All' ? 'All Courses' : course}</option>
                          ))}
                        </select>
                        <select
                          value={verificationStatusFilter}
                          onChange={(e) => setVerificationStatusFilter(e.target.value as any)}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="All">All Status</option>
                          <option value="inDb">In DB (Green)</option>
                          <option value="notInDb">Not in DB (Red)</option>
                        </select>
                        <select
                          value={verificationTimeFilter}
                          onChange={(e) => setVerificationTimeFilter(e.target.value as any)}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="All">All Time</option>
                          <option value="today">Today</option>
                          <option value="yesterday">Yesterday</option>
                          <option value="last7">Last 7 Days</option>
                          <option value="last30">Last 30 Days</option>
                          <option value="thisMonth">This Month</option>
                        </select>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setVerificationSearch('');
                            setVerificationCourseFilter('All');
                            setVerificationStatusFilter('All');
                            setVerificationTimeFilter('All');
                          }}
                        >
                          Clear
                        </Button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-600 font-semibold">
                            <tr>
                              <th className="px-4 py-3">#</th>
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Mobile Number</th>
                              <th className="px-4 py-3">Course Name</th>
                              <th className="px-4 py-3">Submitted At</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredVerificationEntries.map((entry, index) => {
                              const isInDb = Boolean(entry.certificateId && !String(entry.certificateId).startsWith('BMA-GRAD-'));
                              return (
                                <tr
                                  key={entry._id || index}
                                  className={isInDb ? 'bg-emerald-50/40 hover:bg-emerald-100/60' : 'bg-rose-50/40 hover:bg-rose-100/60'}
                                >
                                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                                  <td className="px-4 py-3 font-medium text-slate-900">{entry.name}</td>
                                  <td className="px-4 py-3">{entry.email || 'N/A'}</td>
                                  <td className="px-4 py-3">{entry.mobile || 'N/A'}</td>
                                  <td className="px-4 py-3">{isInDb ? (entry.courseName || 'N/A') : 'N/A'}</td>
                                  <td className="px-4 py-3 text-slate-500">
                                    {entry.createdAt ? new Date(entry.createdAt).toLocaleString('en-IN') : 'N/A'}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <button
                                      onClick={() => handleDeleteVerification(entry._id)}
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-100 px-2 py-1 rounded-md transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {filteredVerificationEntries.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <p>No entries match the selected filters.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
                <Input label="Full Name" placeholder="e.g. John Doe" value={newStudent.name} onChange={(e: any) => setNewStudent({ ...newStudent, name: e.target.value })} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email" type="email" placeholder="john@example.com" value={newStudent.email} onChange={(e: any) => setNewStudent({ ...newStudent, email: e.target.value })} required />
                  <Input label="Phone" placeholder="+91 98765 43210" value={newStudent.phone} onChange={(e: any) => setNewStudent({ ...newStudent, phone: e.target.value })} required />
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
                              setNewStudent({ ...newStudent, webinarName: '' });
                            }}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                          />
                          <span className="text-sm text-slate-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      label="Course / Webinar Name"
                      placeholder="Type the course name here..."
                      value={newStudent.webinarName}
                      onChange={(e: any) => setNewStudent({ ...newStudent, webinarName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Location" placeholder="e.g. Chennai" value={newStudent.location} onChange={(e: any) => setNewStudent({ ...newStudent, location: e.target.value })} required />
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Profession</label>
                    <div className="relative">
                      <select
                        className="flex h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newStudent.profession}
                        onChange={(e) => setNewStudent({ ...newStudent, profession: e.target.value })}
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
                <Input label="Name" placeholder="e.g. AI Digital Marketing" value={newWebinar.name} onChange={(e: any) => setNewWebinar({ ...newWebinar, name: e.target.value })} required />

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
                          onChange={(e) => setNewWebinar({ ...newWebinar, type: e.target.value })}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <span className="text-sm text-slate-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Input label="Description" placeholder="Brief description..." value={newWebinar.description} onChange={(e: any) => setNewWebinar({ ...newWebinar, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date" type="date" value={newWebinar.date} onChange={(e: any) => setNewWebinar({ ...newWebinar, date: e.target.value })} required />
                  <Input label="Location" placeholder="e.g. Online / Coimbatore" value={newWebinar.location} onChange={(e: any) => setNewWebinar({ ...newWebinar, location: e.target.value })} />
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

      {/* QR Code Modal for Verification */}
      {isQROpen && qrStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm bg-white shadow-2xl animate-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>Verification QR Code</CardTitle>
              <button onClick={() => setIsQROpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
              <div className="p-4 bg-white border-2 border-slate-900 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${qrStudent.certificateId || qrStudent._id}`)}`}
                  alt="Student Verification QR"
                  className="w-48 h-48"
                />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-bold text-lg">{qrStudent.name}</h3>
                <p className="text-sm text-slate-500">{qrStudent.webinarName}</p>
                <Badge variant={qrStudent.certificateType === 'Government' ? 'purple' : 'default'} className="mt-2">
                  {qrStudent.certificateType || 'Standard'} Certificate
                </Badge>
              </div>

              <div className="grid grid-cols-1 w-full gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      const qrUrl = `${window.location.origin}/verify/${qrStudent.certificateId || qrStudent._id}`;
                      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${qrStudent.name.replace(/\s+/g, '_')}_QR.png`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      alert('Failed to download QR code');
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2" /> Download QR Image
                </Button>
                <p className="text-xs text-center text-slate-400 mt-2">
                  Scan to verify validity. Validates on this platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


    </div>
  );
}
