'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { FaSpinner, FaBell, FaBookOpen, FaUsers, FaChevronDown } from 'react-icons/fa';

export default function CoursesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      const res = await axios.get('https://brandmonk-backend.onrender.com/api/admin/students');
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false);
    }
  };

  // Group students by course
  const courses = students.reduce((acc: any, student: any) => {
    if (!acc[student.course]) {
      acc[student.course] = {
        name: student.course,
        count: 0,
        students: []
      };
    }
    acc[student.course].count++;
    acc[student.course].students.push(student);
    return acc;
  }, {});

  const courseList = Object.values(courses);

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      <Sidebar />
      
      <div className="md:ml-64 transition-all duration-300">
        <header className="bg-white sticky top-0 z-20 px-8 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="h-8 w-8 text-gray-900 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseList.map((course: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                    <FaBookOpen size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaUsers className="mr-2" size={14} />
                    <span>{course.count} Students Enrolled</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div className="bg-gray-900 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex -space-x-2 overflow-hidden">
                    {course.students.slice(0, 5).map((student: any, i: number) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 border border-gray-200">
                        {student.name.charAt(0)}
                      </div>
                    ))}
                    {course.count > 5 && (
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500 border border-gray-200">
                        +{course.count - 5}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {courseList.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No courses found. Add students to see courses here.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
