import { Collaborator, Task } from '@/interfaces/todo';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, arrayUnion, getDoc, arrayRemove } from 'firebase/firestore';

export const createBoard = async (name: string, userId: string) => {
  await addDoc(collection(db, 'boards'), {
    name,
    tasks: [],
    admins: [userId],
  });
};

export const deleteBoard = async (boardId: string) => {
  await deleteDoc(doc(db, 'boards', boardId));
};

export const updateBoardName = async (boardId: string, newName: string) => {
  await updateDoc(doc(db, 'boards', boardId), { name: newName });
};

export const fetchBoards = async () => {
  const querySnapshot = await getDocs(collection(db, 'boards'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTaskToBoard = async (boardId: string, taskName: string) => {
  const taskId = `${Date.now()}`; 
  const newTask = { id: taskId, name: taskName, completed: false };

  const boardRef = doc(db, 'boards', boardId);
  await updateDoc(boardRef, {
    tasks: arrayUnion(newTask),
  });

  return newTask;
};

export const toggleTaskCompletion = async (
  boardId: string,
  taskId: string,
  completed: boolean
) => {
  const boardRef = doc(db, 'boards', boardId);
  const boardSnap = await getDoc(boardRef);

  if (!boardSnap.exists()) {
    throw new Error('Дошка не знайдена');
  }

  const boardData = boardSnap.data();
  const updatedTasks = boardData.tasks.map((task: Task) =>
    task.id === taskId ? { ...task, completed } : task
  );

  await updateDoc(boardRef, { tasks: updatedTasks });
};

export const editTaskInBoard = async (
  boardId: string,
  taskId: string,
  updatedTaskName: string
) => {
  const boardRef = doc(db, 'boards', boardId);
  const boardSnap = await getDoc(boardRef);

  if (!boardSnap.exists()) {
    throw new Error('Дошка не знайдена');
  }

  const boardData = boardSnap.data();
  const updatedTasks = boardData.tasks.map((task: any) =>
    task.id === taskId ? { ...task, name: updatedTaskName } : task
  );

  await updateDoc(boardRef, { tasks: updatedTasks });
};

export const deleteTaskFromBoard = async (boardId: string, taskId: string) => {
  const boardRef = doc(db, 'boards', boardId);
  const boardSnap = await getDoc(boardRef);

  if (!boardSnap.exists()) {
    throw new Error('Дошка не знайдена');
  }

  const boardData = boardSnap.data();
  const updatedTasks = boardData.tasks.filter((task: any) => task.id !== taskId);

  await updateDoc(boardRef, { tasks: updatedTasks });
};

// Додавання співробітника до дошки
export const addCollaboratorToBoard = async (boardId: string, collaborator: Collaborator) => {
  const boardRef = doc(db, 'boards', boardId);
  await updateDoc(boardRef, {
    collaborators: arrayUnion(collaborator),
  });
};

// Видалення співробітника з дошки
export const removeCollaboratorFromBoard = async (boardId: string, email: string) => {
  const boardRef = doc(db, 'boards', boardId);

  // Отримуємо список користувачів
  const querySnapshot = await getDocs(collection(db, 'users'));
  const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Знайти користувача за email
  const user = users.find(user => user.email === email);

  if (!user) {
    console.log('Користувач не знайдений');
    return;
  }

  // Перевірити чи користувач вже є в колабораторах
  const boardDoc = await getDoc(boardRef);
  const boardData = boardDoc.data();
  const collaborators = boardData?.collaborators || [];

  const collaboratorToRemove = collaborators.find((collaborator: Collaborator) => collaborator.email === email);
  
  if (!collaboratorToRemove) {
    console.log('Користувач не є колаборатором');
    return;
  }

  // Видаляємо користувача з колабораторів
  await updateDoc(boardRef, {
    collaborators: arrayRemove(collaboratorToRemove), // Точний об'єкт для видалення
  });

  console.log('Користувача видалено');
};
