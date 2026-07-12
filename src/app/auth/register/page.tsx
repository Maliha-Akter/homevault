// src/app/signup/page.jsx
import RegisterComponent from '@/components/RegisterComponent';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterComponent />
    </Suspense>
  );
}