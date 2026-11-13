import { useState } from "react";
import type { TaskPriority, CardColor } from "../types/task";

interface CardProps {
  id: number;
  title: string;
  description?: string;
  priority?: TaskPriority;
  color?: CardColor;
  onMovePrev?: () => void;
  onMoveNext?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onCompleteDirectly?: () => void;
  isNextLastColumn?: boolean;
  isLastColumn?: boolean;
  onDelete: (id: number) => void;
  onEdit: () => void;
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

const cardColorStyles: Record<CardColor, { bg: string; border: string }> = {
  default: {
    bg: "bg-white dark:bg-slate-900",
    border: "border-slate-200 dark:border-slate-700/80",
  },
  blue: {
    bg: "bg-blue-50/90 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800/80",
  },
  purple: {
    bg: "bg-purple-50/90 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800/80",
  },
  emerald: {
    bg: "bg-emerald-50/90 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800/80",
  },
  amber: {
    bg: "bg-amber-50/90 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/80",
  },
  rose: {
    bg: "bg-rose-50/90 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-800/80",
  },
};

export function Card({
  title,
  description,
  id,
  priority,
  color = "default",
  onMovePrev,
  onMoveNext,
  onMoveUp,
  onMoveDown,
  onCompleteDirectly,
  isNextLastColumn,
  isLastColumn,
  onDelete,
  onEdit,
}: CardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const colorConfig = cardColorStyles[color] || cardColorStyles.default;

  // Verifica se o texto é longo para exibir o botão de expandir/recolher
  const isTextLong =
    (title && title.length > 30) || (description && description.length > 50);

  return (
    <div
      className={`${colorConfig.bg} ${colorConfig.border} p-4 rounded-xl shadow-xs border relative transition hover:shadow-md flex flex-col justify-between`}
    >
      {/* Botão de 3 Pontinhos no Canto Superior Direito */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
          title="Opções do card"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Menu Dropdown de Opções */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-20 overflow-hidden">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onEdit(); // Abre o modal pop-up central
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              ✏️ Editar
            </button>

            {/* Opção rápida de concluir a partir do menu */}
            {onCompleteDirectly && !isLastColumn && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onCompleteDirectly();
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer flex items-center gap-2"
              >
                ⏭️ Avançar para Concluído
              </button>
            )}

            {onMoveUp && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onMoveUp();
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
              >
                ⬆️ Mover para Cima
              </button>
            )}

            {onMoveDown && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onMoveDown();
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
              >
                ⬇️ Mover para Baixo
              </button>
            )}

            <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />

            <button
              onClick={() => {
                setIsMenuOpen(false);
                onDelete(id);
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer flex items-center gap-2"
            >
              🗑️ Excluir
            </button>
          </div>
        </>
      )}

      {/* Conteúdo do Card */}
      <div className="pr-6">
        {/* Linha com Botão de Conclusão Rápida e Tag de Prioridade */}
        <div className="flex items-center gap-2 mb-2">
          {/* Botão Checkbox Rápido: Concluir ou Reabrir diretamente de qualquer coluna */}
          {(onCompleteDirectly || isLastColumn) && (
            <button
              type="button"
              onClick={isLastColumn ? onMovePrev : onCompleteDirectly}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition cursor-pointer shrink-0 ${
                isLastColumn
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-transparent hover:text-emerald-600"
              }`}
              title={isLastColumn ? "Reabrir tarefa" : "Marcar como concluído"}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}

          {/* Tag de Prioridade: Fica ACINZENTADA quando o card está em Concluído */}
          {priority && (
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border ${
                isLastColumn
                  ? "bg-slate-200/80 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                  : priorityStyles[priority].classes
              }`}
            >
              {priorityStyles[priority].label}
            </span>
          )}
        </div>

        {/* Título com botão de expandir/recolher ao lado */}
        <div className="flex items-start gap-1.5">
          <p
            className={`text-base font-bold text-slate-800 dark:text-slate-100 leading-snug break-words flex-1 ${
              isExpanded ? "" : "line-clamp-2"
            } ${isLastColumn ? "text-slate-500 dark:text-slate-400 line-through decoration-slate-400/60" : ""}`}
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
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
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
            className={`text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed break-words ${
              isExpanded ? "" : "line-clamp-3"
            } ${isLastColumn ? "text-slate-400 dark:text-slate-500" : ""}`}
          >
            {description}
          </p>
        )}
      </div>

      {/* Rodapé com botões de movimentação dinâmica entre colunas */}
      {(onMovePrev || onMoveNext) && (
        <div className="flex items-center gap-2 mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80">
          {onMovePrev && (
            <button
              onClick={onMovePrev}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
            >
              {isLastColumn ? "Reabrir" : "Voltar"}
            </button>
          )}

          {onMoveNext && (
            <button
              onClick={onMoveNext}
              className={`px-3 py-1.5 text-xs font-semibold ml-auto rounded-lg transition cursor-pointer ${
                isNextLastColumn
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              }`}
            >
              {isNextLastColumn ? "Concluir" : "Avançar"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
