import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/image.png" 
                alt="Brand Monk Logo" 
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-gray-700 transition-colors">
              Brand Monk
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Student Portal
            </Link>
            <Link 
              href="/admin/login" 
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
