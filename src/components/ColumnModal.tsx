import React, { useState } from "react";
import type { ColumnColor, ColumnData, ColumnWidth, TaskPriority } from "../types/task";

interface ColumnModalProps {
  mode: "create" | "edit";
  column?: ColumnData | null;
  onClose: () => void;
  onSave: (columnData: {
    id?: string;
    title: string;
    color: ColumnColor;
    width: ColumnWidth;
    priority?: TaskPriority;
  }) => void;
}

const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Paleta pré-selecionada com amostras visuais
const colorPalette: { id: ColumnColor; name: string; bgClass: string; borderClass: string }[] = [
  { id: "slate", name: "Cinza", bgClass: "bg-slate-500", borderClass: "ring-slate-400" },
  { id: "blue", name: "Azul", bgClass: "bg-blue-500", borderClass: "ring-blue-400" },
  { id: "purple", name: "Roxo", bgClass: "bg-purple-500", borderClass: "ring-purple-400" },
  { id: "emerald", name: "Esmeralda", bgClass: "bg-emerald-500", borderClass: "ring-emerald-400" },
  { id: "amber", name: "Âmbar", bgClass: "bg-amber-500", borderClass: "ring-amber-400" },
  { id: "rose", name: "Rosa", bgClass: "bg-rose-500", borderClass: "ring-rose-400" },
];

export function ColumnModal({
  mode,
  column,
  onClose,
  onSave,
}: ColumnModalProps) {
  const initialTitle = mode === "edit" && column ? column.title : "";
  const initialColor: ColumnColor = mode === "edit" && column?.color ? column.color : "slate";
  const initialWidth: ColumnWidth = mode === "edit" && column?.width ? column.width : "w-80";
  const initialPriority: TaskPriority | "none" =
    mode === "edit" && column?.priority ? column.priority : "none";

  const [title, setTitle] = useState(initialTitle);
  const [color, setColor] = useState<ColumnColor>(initialColor);
  const [width, setWidth] = useState<ColumnWidth>(initialWidth);
  const [priority, setPriority] = useState<TaskPriority | "none">(initialPriority);

  const hasChanges =
    mode === "edit"
      ? title !== initialTitle ||
        color !== initialColor ||
        width !== initialWidth ||
        priority !== initialPriority
      : title.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: column?.id,
      title: capitalizeFirstLetter(title.trim()),
      color,
      width,
      priority: priority === "none" ? undefined : priority,
    });
    onClose();
  };

  const handleCloseWithPrompt = () => {
    if (mode === "edit" && hasChanges) {
      const wantToSave = window.confirm(
        "Você tem alterações não salvas. Deseja salvar as alterações antes de sair?"
      );
      if (wantToSave) {
        if (!title.trim()) return;
        onSave({
          id: column?.id,
          title: capitalizeFirstLetter(title.trim()),
          color,
          width,
          priority: priority === "none" ? undefined : priority,
        });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {mode === "create" ? "Nova Coluna" : "Editar Coluna"}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {width === "w-72"
                ? "Compacta"
                : width === "w-80"
                ? "Padrão"
                : width === "w-96"
                ? "Larga"
                : "Extra Larga"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCloseWithPrompt}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Fechar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Nome da Coluna */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Nome da Coluna <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ex: Em Revisão, Backlog..."
              value={title}
              onChange={(e) => setTitle(capitalizeFirstLetter(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-normal"
            />
          </div>

          {/* Seletor de Cores Pré-Selecionadas */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Cor do Tema da Coluna
            </label>
            <div className="flex items-center gap-3">
              {colorPalette.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setColor(item.id)}
                  className={`w-9 h-9 rounded-xl ${item.bgClass} transition flex items-center justify-center cursor-pointer shadow-xs ${
                    color === item.id
                      ? "ring-3 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900 scale-105"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  title={item.name}
                >
                  {color === item.id && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Largura e Prioridade da Coluna */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Largura da Coluna
              </label>
              <select
                value={width}
                onChange={(e) => setWidth(e.target.value as ColumnWidth)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="w-72">Compacta (288px)</option>
                <option value="w-80">Padrão (320px)</option>
                <option value="w-96">Larga (384px)</option>
                <option value="w-[420px]">Extra Larga (420px)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Prioridade da Coluna
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority | "none")}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="none">Nenhuma</option>
                <option value="low">🟢 Baixa</option>
                <option value="medium">🟡 Média</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition cursor-pointer ${
                mode === "edit" && hasChanges
                  ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {mode === "edit" && hasChanges ? "Descartar mudanças" : "Sair"}
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition shadow-sm cursor-pointer"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
