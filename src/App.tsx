import { useState, useEffect } from "react";
import type { Task, TaskStatus, TaskPriority } from "./types/task";
import { Column } from "./components/Column";
import { Card } from "./components/Card";
import { TaskModal } from "./components/TaskModal";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("nexo_tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("nexo_theme");
    if (savedTheme) {
      return JSON.parse(savedTheme);
    }
    return true;
  });

  // Estado que controla o Modal Central (Pop-up estilo Samsung)
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    task?: Task | null;
    defaultStatus: TaskStatus;
  }>({
    isOpen: false,
    mode: "create",
    task: null,
    defaultStatus: "to_do",
  });

  // Sincroniza o Dark Mode com o HTML e localStorage
  useEffect(() => {
    localStorage.setItem("nexo_theme", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Sincroniza as tarefas com o localStorage
  useEffect(() => {
    localStorage.setItem("nexo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Funções de gerenciamento de tarefas
  const handleMoveTask = (id: number, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Abre modal para criar tarefa em uma coluna específica
  const handleOpenCreateModal = (status: TaskStatus) => {
    setModalState({
      isOpen: true,
      mode: "create",
      task: null,
      defaultStatus: status,
    });
  };

  // Abre modal para editar tarefa existente
  const handleOpenEditModal = (task: Task) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      task,
      defaultStatus: task.status,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Salva tanto criação quanto edição através do modal central
  const handleSaveModalTask = (taskData: {
    id?: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
  }) => {
    if (modalState.mode === "create") {
      const newTask: Task = {
        id: Date.now(),
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
      };
      setTasks((prev) => [...prev, newTask]);
    } else if (modalState.mode === "edit" && taskData.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
              }
            : t
        )
      );
    }
  };

  // Filtragem das tarefas por coluna
  const todoTasks = tasks.filter((task) => task.status === "to_do");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Cabeçalho Superior com Logo e Botão de Tema */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-300 dark:border-slate-800 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            NEXO Kanban
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gerenciamento de tarefas limpo e personalizável
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer shadow-sm"
        >
          {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
        </button>
      </header>

      {/* Área do Kanban com as Colunas */}
      <main className="px-6 pb-8">
        <div className="flex items-start gap-6 overflow-x-auto pb-6">
          {/* Coluna 1: A fazer */}
          <Column
            title="A fazer"
            count={todoTasks.length}
            onAddTask={() => handleOpenCreateModal("to_do")}
          >
            {todoTasks.map((task) => (
              <Card
                key={task.id}
                title={task.title}
                description={task.description}
                id={task.id}
                status={task.status}
                priority={task.priority}
                onMove={handleMoveTask}
                onDelete={handleDeleteTask}
                onEdit={() => handleOpenEditModal(task)}
              />
            ))}
          </Column>

          {/* Coluna 2: Em progresso */}
          <Column
            title="Em progresso"
            count={inProgressTasks.length}
            onAddTask={() => handleOpenCreateModal("in_progress")}
          >
            {inProgressTasks.map((task) => (
              <Card
                key={task.id}
                title={task.title}
                description={task.description}
                id={task.id}
                status={task.status}
                priority={task.priority}
                onMove={handleMoveTask}
                onDelete={handleDeleteTask}
                onEdit={() => handleOpenEditModal(task)}
              />
            ))}
          </Column>

          {/* Coluna 3: Concluído */}
          <Column
            title="Concluído"
            count={doneTasks.length}
            onAddTask={() => handleOpenCreateModal("done")}
          >
            {doneTasks.map((task) => (
              <Card
                key={task.id}
                title={task.title}
                description={task.description}
                id={task.id}
                status={task.status}
                priority={task.priority}
                onMove={handleMoveTask}
                onDelete={handleDeleteTask}
                onEdit={() => handleOpenEditModal(task)}
              />
            ))}
          </Column>
        </div>
      </main>

      {/* Modal Central de Criação / Edição (Pop-up estilo Samsung) */}
      {modalState.isOpen && (
        <TaskModal
          key={
            modalState.task?.id
              ? `edit-${modalState.task.id}`
              : `create-${modalState.defaultStatus}`
          }
          mode={modalState.mode}
          task={modalState.task}
          defaultStatus={modalState.defaultStatus}
          onClose={handleCloseModal}
          onSave={handleSaveModalTask}
        />
      )}
    </div>
  );
}
