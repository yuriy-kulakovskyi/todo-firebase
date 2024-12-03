import { useEffect, useState } from 'react';
import {
  updateBoardName,
  deleteBoard,
  addTaskToBoard,
  toggleTaskCompletion,
  editTaskInBoard,
  deleteTaskFromBoard,
  addCollaboratorToBoard,
  removeCollaboratorFromBoard,
} from '../../services/firebaseService';

import { BoardItemProps } from '@/interfaces/todo';

const BoardItem = ({ board, user, setBoards }: BoardItemProps) => {
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = useState('viewer');
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(board.name);
  const [taskName, setTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState('');
  const [allowEdit, setAllowEdit] = useState(false);
  const [allowView, setAllowView] = useState(false);

  useEffect(() => {
    if (
      board.admins.includes(user?.uid || '') ||
      board.collaborators.some((collab) => collab.email === user?.email)
    ) {
      setAllowEdit(true);
    } else {
      setAllowEdit(false);
    }
  }, [board, user]);

  const handleEdit = async () => {
    if (!newName.trim()) return;
    try {
      await updateBoardName(board.id, newName);
      setBoards((prev) =>
        prev.map((b) => (b.id === board.id ? { ...b, name: newName } : b))
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Помилка редагування дошки:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBoard(board.id);
      setBoards((prev) => prev.filter((b) => b.id !== board.id));
    } catch (error) {
      console.error('Помилка видалення дошки:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskFromBoard(board.id, taskId);
      setBoards((prev) =>
        prev.map((b) =>
          b.id === board.id
            ? {
              ...b,
              tasks: b.tasks.filter((task) => task.id !== taskId),
            }
            : b
        )
      );
    } catch (err) {
      console.error('Помилка видалення завдання:', err);
    }
  };

  const handleAddTask = async () => {
    if (!taskName.trim()) return;
    try {
      await addTaskToBoard(board.id, taskName);
      setTaskName('');
    } catch (error) {
      console.error('Помилка додавання завдання:', error);
    }
  };

  const handleEditTask = async (taskId: string) => {
    if (!editingTaskName.trim()) return;
    try {
      await editTaskInBoard(board.id, taskId, editingTaskName);
      setBoards((prev) =>
        prev.map((b) =>
          b.id === board.id
            ? {
              ...b,
              tasks: b.tasks.map((task) =>
                task.id === taskId ? { ...task, name: editingTaskName } : task
              ),
            }
            : b
        )
      );
      setEditingTaskId(null);
      setEditingTaskName('');
    } catch (error) {
      console.error('Помилка редагування завдання:', error);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await toggleTaskCompletion(board.id, taskId, !currentStatus);
      setBoards((prev) =>
        prev.map((b) =>
          b.id === board.id
            ? {
              ...b,
              tasks: b.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !currentStatus } : t
              ),
            }
            : b
        )
      );
    } catch (error) {
      console.error('Помилка оновлення статусу завдання:', error);
    }
  };

  const collaborators = board.collaborators || [];

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail.trim()) return;


    const newCollaborator = { email: newCollaboratorEmail, role: newCollaboratorRole };
    const updatedCollaborators = [...collaborators, newCollaborator];
    
    setBoards((prev) =>
      prev.map((b) =>
        b.id === board.id ? { ...b, collaborators: updatedCollaborators } : b
      )
    );

    try {
      await addCollaboratorToBoard(board.id, newCollaborator);
      setNewCollaboratorEmail('');
    } catch (error) {
      console.error('Помилка додавання співробітника:', error);
      setBoards((prev) =>
        prev.map((b) =>
          b.id === board.id ? { ...b, collaborators: board.collaborators } : b
        )
      );
    }
  };

  const handleRemoveCollaborator = async (collaboratorEmail: string) => {
    try {
      await removeCollaboratorFromBoard(board.id, collaboratorEmail);
      setBoards((prev) =>
        prev.map((b) =>
          b.id === board.id
            ? {
              ...b,
              collaborators: b.collaborators.filter(
                (collab) => collab.email !== collaboratorEmail
              ),
            }
            : b
        )
      );
    } catch (error) {
      console.error('Помилка видалення співробітника:', error);
    }
  };

  useEffect(() => {
    if (
      board.admins.includes(user?.uid || '') ||
      board.collaborators.some((collab) => collab.email === user?.email)
    ) {
      setAllowView(true);
    } else {
      setAllowView(false);
    }

    if (
      board.admins.includes(user?.uid || '') ||
      board.collaborators.some(
        (collab) => collab.email === user?.email && collab.role !== 'viewer'
      )
    ) {
      setAllowEdit(true);
    } else {
      setAllowEdit(false);
    }
  }, [board, user]);

  if (!allowView) {
    return null;
  }

  return (
    <div className="border p-4 mb-4">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 rounded flex-grow mr-2"
          />
        ) : (
          <h3 className="flex-grow text-lg font-bold">{board.name}</h3>
        )}
        {allowEdit && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button onClick={handleEdit} className="text-white bg-green-500 p-2">
                  Зберегти
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-white bg-gray-500 p-2"
                >
                  Скасувати
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-white bg-yellow-500 p-2 ml-2"
              >
                Редагувати
              </button>
            )}
            <button onClick={handleDelete} className="text-white bg-red-500 p-2">
              Видалити
            </button>
          </div>
        )}
      </div>

      {allowEdit && (
        <div className="mt-4">
          <h4>Співробітники:</h4>
          <ul>
            {(board.collaborators || []).map(({ email, role }, index: number) => (
              <li key={index} className="mt-2 flex items-center">
                <span>{email} ({role})</span>
                <button onClick={() => handleRemoveCollaborator(email)} className="ml-2 bg-red-500 text-white p-1 rounded">
                  Видалити
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex">
            <input
              type="email"
              value={newCollaboratorEmail}
              onChange={(e) => setNewCollaboratorEmail(e.target.value)}
              placeholder="Email співробітника"
              className="border p-2 rounded flex-grow mr-2"
            />
            <select
              value={newCollaboratorRole}
              onChange={(e) => setNewCollaboratorRole(e.target.value)}
              className="border p-2 rounded mr-2"
            >
              <option value="viewer">Глядач</option>
              <option value="editor">Редактор</option>
              <option value="admin">Адміністратор</option>
            </select>
            <button onClick={handleAddCollaborator} className="bg-blue-500 text-white p-2 rounded">
              Додати
            </button>
          </div>
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {board.tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingTaskName}
                  onChange={(e) => setEditingTaskName(e.target.value)}
                  className="border p-1 rounded flex-grow"
                />
                <button
                  onClick={() => handleEditTask(task.id)}
                  className="bg-green-500 text-white p-1 rounded"
                >
                  Зберегти
                </button>
                <button
                  onClick={() => {
                    setEditingTaskId(null);
                    setEditingTaskName('');
                  }}
                  className="bg-gray-500 text-white p-1 rounded"
                >
                  Скасувати
                </button>
              </>
            ) : (
              <>
                <span
                  className={`flex-grow ${task.completed ? 'line-through' : ''}`}
                >
                  {task.name}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className={`text-white ml-2 p-1 rounded ${task.completed ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                  >
                    {task.completed ? 'Не виконано' : 'Виконано'}
                  </button>
                  {allowEdit && <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskName(task.name);
                    }}
                    className="bg-yellow-500 text-white p-1 rounded"
                  >
                    Редагувати
                  </button>}
                  {allowEdit && <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Видалити
                  </button>}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {allowEdit && (
        <div className="mt-4 flex">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Нове завдання"
            className="border p-2 rounded flex-grow mr-2"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Додати завдання
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardItem;