import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useBoards = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'boards'), (snapshot) => {
      const updatedBoards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBoards(updatedBoards);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { boards, loading, setBoards };
};