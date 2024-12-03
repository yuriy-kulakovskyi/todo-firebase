import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { createBoard, fetchBoards } from '../../services/firebaseService';
import { useBoards } from '@/hooks/useBoard';

const Modal = () => {
  const [boardName, setBoardName] = useState('');
  const [user] = useAuthState(auth);
  const { setBoards } = useBoards();

  const handleCreateBoard = async () => {
    if (boardName.trim() && user) {
      await createBoard(boardName, user.uid);
      const updatedBoards = await fetchBoards(); 
      setBoards(updatedBoards); 
      setBoardName('');
    }
  };
  
  
  return (
    <div className="p-4">
      <input
        type="text"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        placeholder="Назва дошки"
        className="border p-2 rounded"
      />
      <button onClick={handleCreateBoard} className="bg-blue-500 text-white p-2 ml-2 rounded">
        Створити
      </button>
    </div>
  );
};

export default Modal;
