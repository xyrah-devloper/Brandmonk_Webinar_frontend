'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    const adminData = sessionStorage.getItem('adminData');
    if (adminData) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return null;
}
