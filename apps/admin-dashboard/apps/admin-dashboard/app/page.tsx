import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next-navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      router.push('/(protected)/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return null; // This component only runs the effect and redirects
}
