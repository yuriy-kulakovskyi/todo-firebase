import { useAuthState } from 'react-firebase-hooks/auth';
import { useBoards } from '../../hooks/useBoard';
import BoardItem from './todolist-item';
import { auth } from '@/lib/firebase';

const BoardsList = () => {
  const { boards, loading, setBoards } = useBoards();
  const [user] = useAuthState(auth);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      {boards.map((board) => (
        <BoardItem
          key={board.id}
          board={board}
          user={user}
          setBoards={setBoards}
        />
      ))}
    </div>
  );
};

export default BoardsList;