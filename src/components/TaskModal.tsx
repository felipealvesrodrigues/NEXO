import React, { useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "../types/task";

interface TaskModalProps {
  mode: "create" | "edit";
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onClose: () => void;
  onSave: (taskData: {
    id?: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
  }) => void;
}

// Função utilitária para garantir a primeira letra maiúscula
const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export function TaskModal({
  mode,
  task,
  defaultStatus = "to_do",
  onClose,
  onSave,
}: TaskModalProps) {
  // Valores iniciais calculados diretamente na montagem (Padrão idiomático do React 19)
  const initialTitle = mode === "edit" && task ? task.title : "";
  const initialDescription =
    mode === "edit" && task ? task.description || "" : "";
  const initialPriority: TaskPriority =
    mode === "edit" && task ? task.priority || "medium" : "medium";
  const initialStatus: TaskStatus =
    mode === "edit" && task ? task.status : defaultStatus;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState<TaskPriority>(initialPriority);
  const [status, setStatus] = useState<TaskStatus>(initialStatus);

  // Verifica se o usuário alterou algum campo
  const hasChanges =
    mode === "edit"
      ? title !== initialTitle ||
        description !== initialDescription ||
        priority !== initialPriority ||
        status !== initialStatus
      : title.trim().length > 0 || description.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: task?.id,
      title: capitalizeFirstLetter(title.trim()),
      description: description.trim()
        ? capitalizeFirstLetter(description.trim())
        : "",
      priority,
      status,
    });
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(capitalizeFirstLetter(e.target.value));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(capitalizeFirstLetter(e.target.value));
  };

  return (
    // Fundo escuro com blur que BLOQUEIA cliques fora acidentais
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabeçalho do Modal estilo Samsung One UI */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {mode === "create" ? "Nova Tarefa" : "Editar Tarefa"}
          </h3>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {status === "to_do"
              ? "A fazer"
              : status === "in_progress"
              ? "Em progresso"
              : "Concluído"}
          </span>
        </div>

        {/* Formulário Central */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Campo Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Título da Tarefa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Digite o título..."
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Campo Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Detalhes adicionais da tarefa..."
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          {/* Seletores: Prioridade e Coluna (Status) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="low">🟢 Baixa</option>
                <option value="medium">🟡 Média</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Coluna
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="to_do">A fazer</option>
                <option value="in_progress">Em progresso</option>
                <option value="done">Concluído</option>
              </select>
            </div>
          </div>

          {/* Rodapé com os dois únicos botões permitidos para sair */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition cursor-pointer ${
                hasChanges
                  ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {hasChanges ? "Descartar mudanças" : "Sair"}
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
