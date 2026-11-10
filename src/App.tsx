import { useState, useEffect } from "react";
import type { Task, TaskStatus, TaskPriority, ColumnData, ColumnColor, ColumnWidth } from "./types/task";
import { Column } from "./components/Column";
import { Card } from "./components/Card";
import { TaskModal } from "./components/TaskModal";
import { ColumnModal } from "./components/ColumnModal";

// Colunas iniciais padrão
const defaultColumns: ColumnData[] = [
  { id: "to_do", title: "A fazer", color: "slate", width: "w-80" },
  { id: "in_progress", title: "Em progresso", color: "blue", width: "w-80" },
  { id: "done", title: "Concluído", color: "emerald", width: "w-80" },
];

export default function App() {
  // Lista de tarefas salvas no localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("nexo_tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });

  // Lista de colunas dinâmicas salvas no localStorage
  const [columns, setColumns] = useState<ColumnData[]>(() => {
    const savedColumns = localStorage.getItem("nexo_columns");
    if (savedColumns) {
      return JSON.parse(savedColumns);
    }
    return defaultColumns;
  });

  // Tema Dark / Light
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("nexo_theme");
    if (savedTheme) {
      return JSON.parse(savedTheme);
    }
    return true;
  });

  // Estado do Modal de Tarefa (Criar / Editar)
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    task?: Task | null;
    defaultStatus: TaskStatus;
  }>({
    isOpen: false,
    mode: "create",
    task: null,
    defaultStatus: columns[0]?.id || "to_do",
  });

  // Estado do Modal de Coluna (Criar / Editar)
  const [columnModalState, setColumnModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    column?: ColumnData | null;
  }>({
    isOpen: false,
    mode: "create",
    column: null,
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

  // Sincroniza tarefas com o localStorage
  useEffect(() => {
    localStorage.setItem("nexo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Sincroniza colunas com o localStorage
  useEffect(() => {
    localStorage.setItem("nexo_columns", JSON.stringify(columns));
  }, [columns]);

  // Gerenciamento de Tarefas
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

  const handleOpenCreateModal = (status: TaskStatus) => {
    setModalState({
      isOpen: true,
      mode: "create",
      task: null,
      defaultStatus: status,
    });
  };

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

  // Gerenciamento de Colunas
  const handleOpenCreateColumnModal = () => {
    setColumnModalState({
      isOpen: true,
      mode: "create",
      column: null,
    });
  };

  const handleOpenEditColumnModal = (column: ColumnData) => {
    setColumnModalState({
      isOpen: true,
      mode: "edit",
      column,
    });
  };

  const handleCloseColumnModal = () => {
    setColumnModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveColumnModal = (columnData: {
    id?: string;
    title: string;
    color: ColumnColor;
    width: ColumnWidth;
    priority?: TaskPriority;
  }) => {
    if (columnModalState.mode === "create") {
      const newCol: ColumnData = {
        id: `col_${Date.now()}`,
        title: columnData.title,
        color: columnData.color,
        width: columnData.width,
        priority: columnData.priority,
      };
      setColumns((prev) => [...prev, newCol]);
    } else if (columnModalState.mode === "edit" && columnData.id) {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnData.id
            ? {
                ...col,
                title: columnData.title,
                color: columnData.color,
                width: columnData.width,
                priority: columnData.priority,
              }
            : col
        )
      );
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const columnTasks = tasks.filter((t) => t.status === columnId);
    const confirmMessage =
      columnTasks.length > 0
        ? `Esta coluna possui ${columnTasks.length} tarefa(s). Tem certeza que deseja excluí-la junto com suas tarefas?`
        : "Tem certeza que deseja excluir esta coluna?";

    if (window.confirm(confirmMessage)) {
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
      setTasks((prev) => prev.filter((t) => t.status !== columnId));
    }
  };

  const handleMoveColumn = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= columns.length) return;

    setColumns((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center mb-6 border-b border-slate-300 dark:border-slate-800 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            NEXO Kanban
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gerenciamento dinâmico de tarefas e colunas personalizáveis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateColumnModal}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nova Coluna
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer shadow-sm"
          >
            {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
          </button>
        </div>
      </header>

      {/* Área do Kanban com Colunas Dinâmicas */}
      <main className="px-6 pb-8">
        <div className="flex items-start gap-6 overflow-x-auto pb-6">
          {columns.map((column, colIndex) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);
            const prevColumn = colIndex > 0 ? columns[colIndex - 1] : null;
            const nextColumn = colIndex < columns.length - 1 ? columns[colIndex + 1] : null;
            const isNextLastColumn = colIndex + 1 === columns.length - 1;
            const isLastColumn = colIndex === columns.length - 1;

            return (
              <Column
                key={column.id}
                column={column}
                count={columnTasks.length}
                onAddTask={() => handleOpenCreateModal(column.id)}
                onEditColumn={() => handleOpenEditColumnModal(column)}
                onMoveLeft={colIndex > 0 ? () => handleMoveColumn(colIndex, "left") : undefined}
                onMoveRight={
                  colIndex < columns.length - 1
                    ? () => handleMoveColumn(colIndex, "right")
                    : undefined
                }
                onDeleteColumn={() => handleDeleteColumn(column.id)}
              >
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    id={task.id}
                    priority={task.priority}
                    onMovePrev={
                      prevColumn ? () => handleMoveTask(task.id, prevColumn.id) : undefined
                    }
                    onMoveNext={
                      nextColumn ? () => handleMoveTask(task.id, nextColumn.id) : undefined
                    }
                    isNextLastColumn={isNextLastColumn}
                    isLastColumn={isLastColumn}
                    onDelete={handleDeleteTask}
                    onEdit={() => handleOpenEditModal(task)}
                  />
                ))}
              </Column>
            );
          })}

          {/* Botão em formato de Card para Criar Nova Coluna */}
          <button
            onClick={handleOpenCreateColumnModal}
            className="w-80 min-h-60 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-white/40 dark:hover:bg-slate-800/20 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-bold">Adicionar nova coluna</span>
          </button>
        </div>
      </main>

      {/* Modal Central de Tarefa (Pop-up estilo Samsung) */}
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
          columns={columns}
          onClose={handleCloseModal}
          onSave={handleSaveModalTask}
        />
      )}

      {/* Modal Central de Coluna */}
      {columnModalState.isOpen && (
        <ColumnModal
          key={
            columnModalState.column?.id
              ? `edit-col-${columnModalState.column.id}`
              : "create-column"
          }
          mode={columnModalState.mode}
          column={columnModalState.column}
          onClose={handleCloseColumnModal}
          onSave={handleSaveColumnModal}
        />
      )}
    </div>
  );
}
