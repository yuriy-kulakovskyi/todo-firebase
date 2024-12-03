import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  role: string | null; // Додаємо роль
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  role: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null); // Стан для ролі
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, role }}>
      {loading ? <div className="flex justify-center items-center h-screen">Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);