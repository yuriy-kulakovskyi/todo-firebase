import { useAuth } from "./AuthProvider";
import Header from "./todo/Header";
import TodoList from "./todo/todoList";
import React, { useEffect } from "react";
import Modal from "./todo/modal";

const HomePage = () => {
  const { currentUser, role } = useAuth();
  
  return (
    <main className="flex flex-col items-center justify-center gap-[20px]">
      <Header 
        nick={currentUser.displayName}
        role={role}
      />

      <Modal />

      <TodoList />
    </main>
  );
}
 
export default HomePage;