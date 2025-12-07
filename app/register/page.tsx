'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page - need webinar slug to register
    router.push('/');
  }, [router]);

  return null;
}
