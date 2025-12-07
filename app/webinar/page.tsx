'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WebinarPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page (registration form)
    router.push('/');
  }, [router]);

  return null;
}
