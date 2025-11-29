'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import Sidebar from '../../components/Sidebar';
import { FaSpinner, FaBell, FaDownload, FaSearch, FaChevronDown } from 'react-icons/fa';

export default function CertificatesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('https://brandmonk-backend-1.onrender.com/api/admin/students');
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = (student: any) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 800, 600, 'F');
    
    // Border
    doc.setLineWidth(10);
    doc.setDrawColor(17, 24, 39); // Gray-900 (Professional Black)
    doc.rect(20, 20, 760, 560);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(17, 24, 39);
    doc.text('CERTIFICATE OF COMPLETION', 400, 100, { align: 'center' });

    // Subheader
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('This is to certify that', 400, 180, { align: 'center' });

    // Student Name
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(50);
    doc.setTextColor(30, 30, 30);
    doc.text(student.name, 400, 250, { align: 'center' });

    // Body Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('has successfully completed the course', 400, 320, { align: 'center' });

    // Course Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(17, 24, 39);
    doc.text(student.course, 400, 380, { align: 'center' });

    // Date
    const date = new Date(student.createdAt).toLocaleDateString();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text(`Completed on: ${date}`, 400, 450, { align: 'center' });

    // Signature Line
    doc.setLineWidth(2);
    doc.setDrawColor(0, 0, 0);
    doc.line(250, 520, 550, 520);
    doc.setFontSize(14);
    doc.text('Brand Monk Academy', 400, 540, { align: 'center' });

    // Verification Link
    const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${student._id}`;
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.textWithLink('Click here to verify this certificate', 400, 570, { url: verifyUrl, align: 'center' });
    doc.setTextColor(150, 150, 150);
    doc.text(verifyUrl, 400, 585, { align: 'center' });

    doc.save(`${student.name}_Certificate.pdf`);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      <Sidebar />
      
      <div className="md:ml-64 transition-all duration-300">
        <header className="bg-white sticky top-0 z-20 px-8 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <FaBell size={18} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="h-9 w-9 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <FaChevronDown size={12} className="text-gray-400" />
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8">
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="relative w-full max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search for certificates..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="h-8 w-8 text-gray-900 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm border border-green-100">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{student.name}</div>
                              <div className="text-xs text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{student.course}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(student.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => generateCertificate(student)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors shadow-sm"
                          >
                            <FaDownload className="mr-1.5" size={12} />
                            Download PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
