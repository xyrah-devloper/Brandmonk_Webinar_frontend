'use client';

import { useState } from 'react';
import axios from 'axios';
import {
  Upload,
  Download,
  Plus,
  Trash2,
  Check,
  X,
  AlertCircle,
  Loader2,
  Copy,
  CheckCircle2,
  Eye,
  Send
} from 'lucide-react';
import { API_URL } from '@/utils/config';

interface StudentData {
  name: string;
  phoneNumber?: string;
  courseName: string;
  courseSlug: string;
  batch?: string;
  email?: string;
}

interface GeneratedCertificate {
  name: string;
  certificateId: string;
  course: string;
}

export default function CertificateGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [currentStudent, setCurrentStudent] = useState<StudentData>({
    name: '',
    courseName: '',
    courseSlug: '',
    phoneNumber: '',
    email: '',
    batch: ''
  });

  const [loading, setLoading] = useState(false);
  const [generatedCerts, setGeneratedCerts] = useState<GeneratedCertificate[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const courseOptions = [
    { name: 'Video Editing', slug: 'video-editing' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Graphic Design', slug: 'graphic-design' },
    { name: 'Social Media Marketing', slug: 'social-media' }
  ];

  const handleAddStudent = () => {
    if (!currentStudent.name || !currentStudent.courseName || !currentStudent.courseSlug) {
      setError('Name, Course Name, and Course are required');
      return;
    }

    setStudents([...students, currentStudent]);
    setCurrentStudent({
      name: '',
      courseName: '',
      courseSlug: '',
      phoneNumber: '',
      email: '',
      batch: ''
    });
    setError('');
  };

  const handleRemoveStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const handleCourseChange = (slug: string) => {
    const course = courseOptions.find(c => c.slug === slug);
    setCurrentStudent({
      ...currentStudent,
      courseSlug: slug,
      courseName: course?.name || ''
    });
  };

  const handleGenerateCertificates = async () => {
    if (students.length === 0) {
      setError('Please add at least one student');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/api/course-students/bulk/generate`, {
        students
      });

      if (response.data.success) {
        setGeneratedCerts(response.data.results.details.success || []);
        setSuccess(
          `Successfully generated certificates for ${response.data.results.created} students`
        );
        setStudents([]);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate certificates');
      console.error('Certificate generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadCSV = () => {
    if (generatedCerts.length === 0) return;

    const headers = ['Student Name', 'Certificate ID', 'Course'];
    const rows = generatedCerts.map(cert => [cert.name, cert.certificateId, cert.course]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificates-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Certificate Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create and manage student certificates with verification
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-900 font-medium">Success</p>
              <p className="text-emerald-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('manual');
                setStudents([]);
                setGeneratedCerts([]);
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'manual'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Manual Entry
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('bulk');
                setStudents([]);
                setGeneratedCerts([]);
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'bulk'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Bulk Upload
              </div>
            </button>
          </div>

          {/* Manual Entry Tab */}
          {activeTab === 'manual' && (
            <div className="p-8">
              <div className="space-y-6 mb-8">
                {/* Student Input Form */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add Student
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        value={currentStudent.name}
                        onChange={(e) =>
                          setCurrentStudent({ ...currentStudent, name: e.target.value })
                        }
                        placeholder="Full Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={currentStudent.phoneNumber}
                        onChange={(e) =>
                          setCurrentStudent({
                            ...currentStudent,
                            phoneNumber: e.target.value
                          })
                        }
                        placeholder="Phone Number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course *
                      </label>
                      <select
                        value={currentStudent.courseSlug}
                        onChange={(e) => handleCourseChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Select Course</option>
                        {courseOptions.map((course) => (
                          <option key={course.slug} value={course.slug}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batch
                      </label>
                      <input
                        type="text"
                        value={currentStudent.batch}
                        onChange={(e) =>
                          setCurrentStudent({ ...currentStudent, batch: e.target.value })
                        }
                        placeholder="e.g., 6.30 PM"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={currentStudent.email}
                        onChange={(e) =>
                          setCurrentStudent({ ...currentStudent, email: e.target.value })
                        }
                        placeholder="Email Address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddStudent}
                    className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Student to List
                  </button>
                </div>

                {/* Students List */}
                {students.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Students to Process ({students.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {students.map((student, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">
                              {student.courseName}
                              {student.batch && ` • ${student.batch}`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveStudent(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              {students.length > 0 && (
                <div className="flex gap-4">
                  <button
                    onClick={handleGenerateCertificates}
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Certificates...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Generate {students.length} Certificate(s)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bulk Upload Tab */}
          {activeTab === 'bulk' && (
            <div className="p-8">
              <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 text-center mb-6">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Student Data
                </h3>
                <p className="text-gray-600 mb-4">
                  Use the CSV template below to upload multiple students at once
                </p>
                <button
                  onClick={() => {
                    const template = 'Name,PhoneNumber,Course,Batch,Email\nJohn Doe,9876543210,Video Editing,6:30 PM,john@email.com';
                    const element = document.createElement('a');
                    element.setAttribute(
                      'href',
                      'data:text/csv;charset=utf-8,' + encodeURIComponent(template)
                    );
                    element.setAttribute('download', 'certificate_template.csv');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 text-sm">
                  <strong>CSV Format:</strong> Name, Phone Number (optional), Course Name, Batch (optional), Email (optional)
                </p>
              </div>
            </div>
          )}

          {/* Generated Certificates Display */}
          {generatedCerts.length > 0 && (
            <div className="p-8 border-t border-gray-200">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Generated Certificates ({generatedCerts.length})
                </h3>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Student Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Certificate ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Course
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedCerts.map((cert, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{cert.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-emerald-600">
                              {cert.certificateId}
                            </code>
                            <button
                              onClick={() => handleCopyToClipboard(cert.certificateId, cert.certificateId)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              {copied === cert.certificateId ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{cert.course}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Certificate">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Send Email">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
