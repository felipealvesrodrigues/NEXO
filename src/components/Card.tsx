import { useState } from "react";
import type { TaskStatus, TaskPriority } from "../types/task";

interface CardProps {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  onMove: (id: number, newStatus: TaskStatus) => void;
  onDelete: (id: number) => void;
  onEdit: () => void; // Abre o modal centralizado de edição
}

const priorityStyles: Record<TaskPriority, { label: string; classes: string }> = {
  low: {
    label: "Baixa",
    classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  medium: {
    label: "Média",
    classes: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  high: {
    label: "Alta",
    classes: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
};

export function Card({
  title,
  description,
  id,
  status,
  priority,
  onMove,
  onDelete,
  onEdit,
}: CardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Verifica se o texto é longo para exibir o botão de expandir/recolher
  const isTextLong =
    (title && title.length > 30) || (description && description.length > 50);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/80 relative transition hover:shadow-md">
      {/* Botão de 3 Pontinhos no Canto Superior Direito */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Opções do card"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Menu Kebab Dropdown */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 overflow-hidden">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onEdit(); // Abre o modal pop-up central
              }}
              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onDelete(id);
              }}
              className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            >
              🗑️ Excluir
            </button>
          </div>
        </>
      )}

      {/* Conteúdo do Card */}
      <div className="pr-6">
        {/* Tag de Prioridade */}
        {priority && (
          <span
            className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border mb-2 ${priorityStyles[priority].classes}`}
          >
            {priorityStyles[priority].label}
          </span>
        )}

        {/* Título com botão de expandir/recolher ao lado */}
        <div className="flex items-start gap-1.5">
          <p
            className={`text-base font-bold text-slate-800 dark:text-slate-100 leading-snug break-words flex-1 ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            {title}
          </p>

          {isTextLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition cursor-pointer shrink-0 mt-0.5"
              title={isExpanded ? "Recolher texto" : "Ver texto completo"}
            >
              {isExpanded ? (
                // Ícone Recolher (Chevron Up)
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                // Ícone Expandir (Chevron Down)
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Descrição com limite configurado ou expandido */}
        {description && (
          <p
            className={`text-sm text-slate-500 dark:text-slate-400 mt-1.5 break-words ${
              isExpanded ? "" : "line-clamp-3"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {/* Rodapé com botões de movimentação */}
      <div className="flex items-center gap-2 mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
        {status === "in_progress" && (
          <>
            <button
              onClick={() => onMove(id, "to_do")}
              className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
            >
              Voltar
            </button>

            <button
              onClick={() => onMove(id, "done")}
              className="px-3 py-1 text-xs font-medium ml-auto bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-lg cursor-pointer"
            >
              Concluir
            </button>
          </>
        )}

        {status === "to_do" && (
          <button
            onClick={() => onMove(id, "in_progress")}
            className="px-3 py-1 text-xs font-medium ml-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
          >
            Avançar
          </button>
        )}

        {status === "done" && (
          <button
            onClick={() => onMove(id, "in_progress")}
            className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
          >
            Reabrir
          </button>
        )}
      </div>
    </div>
  );
}
