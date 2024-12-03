export interface Collaborator {
  email: string;
  role: string;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export interface Board {
  id: string;
  name: string;
  admins: string[];
  tasks: Task[];
  collaborators: Collaborator[];
}

export interface BoardItemProps {
  board: Board;
  user: { uid: string; email: string } | null;
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
}