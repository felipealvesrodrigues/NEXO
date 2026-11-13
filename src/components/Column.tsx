import React, { useState } from "react";
import type { ColumnColor, ColumnData, TaskPriority } from "../types/task";

interface ColumnProps {
  column: ColumnData;
  count: number;
  children: React.ReactNode;
  onAddTask: () => void;
  onEditColumn: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onDeleteColumn: () => void;
  // New callbacks for inserting columns
  onAddColumnLeft?: () => void;
  onAddColumnRight?: () => void;
}

const columnColorStyles: Record<
  ColumnColor,
  { bg: string; border: string; headerText: string; countBg: string }
> = {
  slate: {
    bg: "bg-slate-200/60 dark:bg-slate-800/60",
    border: "border-slate-300/50 dark:border-slate-700/50",
    headerText: "text-slate-800 dark:text-slate-100",
    countBg: "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
  },
  blue: {
    bg: "bg-blue-100/40 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-900/50",
    headerText: "text-blue-950 dark:text-blue-200",
    countBg: "bg-blue-200 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300",
  },
  purple: {
    bg: "bg-purple-100/40 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-900/50",
    headerText: "text-purple-950 dark:text-purple-200",
    countBg: "bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300",
  },
  emerald: {
    bg: "bg-emerald-100/40 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900/50",
    headerText: "text-emerald-950 dark:text-emerald-200",
    countBg: "bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300",
  },
  amber: {
    bg: "bg-amber-100/40 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900/50",
    headerText: "text-amber-950 dark:text-amber-200",
    countBg: "bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300",
  },
  rose: {
    bg: "bg-rose-100/40 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-900/50",
    headerText: "text-rose-950 dark:text-rose-200",
    countBg: "bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300",
  },
};

const priorityBadges: Record<TaskPriority, { label: string; badge: string }> = {
  low: {
    label: "Baixa",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
  },
  medium: {
    label: "Média",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800",
  },
  high: {
    label: "Alta",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800",
  },
};

export function Column({
  column,
  count,
  children,
  onAddTask,
  onEditColumn,
  onMoveLeft,
  onMoveRight,
  onDeleteColumn,
  onAddColumnLeft,
  onAddColumnRight,
}: ColumnProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const colorConfig =
    columnColorStyles[column.color || "slate"] || columnColorStyles.slate;
  const widthClass = column.width || "w-80";

  return (
    <div
      className={`${widthClass} ${colorConfig.bg} rounded-2xl p-4 min-h-100 border ${colorConfig.border} flex flex-col gap-3 shrink-0 transition-all duration-200 shadow-xs relative`}
    >
      {/* Cabeçalho da Coluna */}
      <div className="flex items-center justify-between mb-1 relative">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {/* Contador de tarefas */}
          <span
            className={`flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${colorConfig.countBg} shrink-0`}
          >
            {count}
          </span>

          {/* Nome da Coluna */}
          <h2
            className={`text-xl font-bold truncate ${colorConfig.headerText}`}
            title={column.title}
          >
            {column.title}
            {column.isCompleted && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 rounded">Concluído</span>
            )}
          </h2>

          {/* Prioridade da Coluna (se houver) */}
          {column.priority && (
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded border shrink-0 ${priorityBadges[column.priority].badge}`}
            >
              {priorityBadges[column.priority].label}
            </span>
          )}
        </div>

        {/* Ações da Coluna: Botão + à esquerda dos 3 pontos */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Botão + Adicionar Card */}
          <button
            onClick={onAddTask}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Adicionar tarefa nesta coluna"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Botão de 3 Pontinhos da Coluna */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Opções da coluna"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Menu Dropdown de Opções da Coluna */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-30 overflow-hidden">
  <button
    onClick={() => {
      setIsMenuOpen(false);
      onEditColumn();
    }}
    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
  >
    ✏️ Editar Coluna
  </button>

  {onAddColumnLeft && (
    <button
      onClick={() => {
        setIsMenuOpen(false);
        onAddColumnLeft();
      }}
      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
    >
      ➕ Coluna à esquerda
    </button>
  )}

  {onAddColumnRight && (
    <button
      onClick={() => {
        setIsMenuOpen(false);
        onAddColumnRight();
      }}
      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
    >
      ➕ Coluna à direita
    </button>
  )}

  {onMoveLeft && (
    <button
      onClick={() => {
        setIsMenuOpen(false);
        onMoveLeft();
      }}
      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
    >
      ⬅️ Mover para Esquerda
    </button>
  )}

  {onMoveRight && (
    <button
      onClick={() => {
        setIsMenuOpen(false);
        onMoveRight();
      }}
      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
    >
      ➡️ Mover para Direita
    </button>
  )}

  <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />

  <button
    onClick={() => {
      setIsMenuOpen(false);
      onDeleteColumn();
    }}
    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer flex items-center gap-2"
  >
    🗑️ Excluir Coluna
  </button>
</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Cards da Coluna */}
      <div className="flex flex-col gap-3 flex-1">{children}</div>
    </div>
  );
}
