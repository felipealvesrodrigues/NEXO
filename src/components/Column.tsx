import React from "react";

interface ColumnProps {
  title: string;
  children: React.ReactNode; /* Isso aqui permite que componentes sejam colocados dentro de um componente */
  count?: number; /* Contador de tarefas */
  onAddTask?: () => void; /* Ação para abrir o modal de adicionar tarefa nesta coluna */
}

export function Column({ title, children, count, onAddTask }: ColumnProps) {
  return (
    <div className="bg-slate-200/60 dark:bg-slate-800/60 rounded-xl p-4 w-80 min-h-100 border border-slate-300/50 dark:border-slate-700/50 flex flex-col gap-3">
      {/* Cabeçalho da Coluna com título, contador e botão de adicionar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span className="flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-700/30 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {count}
            </span>
          )}
          <h2 className="text-xl text-slate-700 dark:text-slate-200 font-bold">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {onAddTask && (
            <button
              onClick={onAddTask}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Adicionar tarefa nesta coluna"
            >
              {/* Ícone de + estilizado */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
