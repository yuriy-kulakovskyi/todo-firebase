"use client";

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { db } from '../lib/firebase'; 
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('user'); 
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });

        const userDoc = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDoc, { displayName, email, role });

        setError('');
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Display Name"
        className="border p-2 rounded"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">
        Register
      </button>
    </div>
  );
}