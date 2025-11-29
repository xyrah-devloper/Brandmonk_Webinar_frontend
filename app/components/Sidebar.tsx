import Link from 'next/link';
import Image from 'next/image';
import { 
  FaChartPie, 
  FaUserGraduate, 
  FaCertificate, 
  FaBook, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="relative w-8 h-8">
          <Image 
            src="/image.png" 
            alt="Brand Monk Logo" 
            fill
            className="object-contain"
          />
        </div>
        <span className="text-xl font-bold text-gray-900">Brand Monk</span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Main Menu</div>
        
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group">
          <FaChartPie size={18} className="group-hover:text-gray-900" />
          <span className="font-medium">Dashboard</span>
        </Link>
        
        <Link href="/admin/students" className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group">
          <FaUserGraduate size={18} className="group-hover:text-gray-900" />
          <span className="font-medium">Students</span>
        </Link>

        <Link href="/admin/certificates" className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group">
          <FaCertificate size={18} className="group-hover:text-gray-900" />
          <span className="font-medium">Certificates</span>
        </Link>

        <Link href="/admin/courses" className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group">
          <FaBook size={18} className="group-hover:text-gray-900" />
          <span className="font-medium">Courses</span>
        </Link>
      </div>

      <div className="p-4 border-t border-gray-100">
        <Link href="/admin/login" className="flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <FaSignOutAlt size={18} />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
