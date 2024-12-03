"use client";

import HomePage from '@/ui/Home';
import { AuthProvider } from '../ui/AuthProvider';

const Home = () => {
  return (
    <main>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </main>
  )
};

export default Home;
