import { useState } from "react";
import type { TaskStatus } from "../types/task";

interface CardProps {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  onMove: (id: number, newStatus: TaskStatus) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    editTitle: string,
    editDescription?: string,
  ) => void; /* A ? é pra deixar opcional */
}

export function Card({
  title,
  description,
  id,
  status,
  onMove,
  onDelete,
  onEdit,
}: CardProps) {
  const [isEditing, setIsEditing] =
    useState(
      false,
    ); /* O isEditing vai servir pra ativar o modo de edição, por padrão ele vem false. Lá em baixo tem a função que deixa ele true */
  const [editTitle, setEditTitle] =
    useState(
      title,
    ); /* editTitle e o editDescription guardam o que o usuário está digitando */
  const [editDescription, setEditDescription] = useState(description || "");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSave = () => {
    if (!editTitle.trim()) return; // Não permite salvar se o nome tiver vazio
    onEdit(id, editTitle, editDescription); // chama a função do App passando o id, o novo titulo e a nova descrição
    setIsEditing(false); //fecha o modo de edição
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80 relative">
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <>
          {/* essa div aqui é uma div invisível que cobre toda a tela, quando o usuário clicar fora do menu o menu vai fechar pq o usuário vai estar clicando nessa div */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20">
            <button
              onClick={() => {
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => {
                onDelete(id);
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            >
              🗑️ Excluir
            </button>
          </div>
        </>
      )}

      {/* Se tiver no modo edição, isso aq vai mostrar os inputs para serem alterados */}
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Descrição"
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 rounded text-white py-[2.3px] transition cursor-pointer w-24 self-center"
          >
            Salvar
          </button>
        </div>
      ) : (
        <div className="pr-6">
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-1 ">
            {title}
          </p>
          {description && (
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Rodapé com os botões de mover pra outra coluna */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
        {/* EM PROGRESSO */}
        {status === "in_progress" && (
          <>
            <button
              onClick={() => onMove(id, "to_do")}
              className="px-3 py-1 font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded cursor-pointer"
            >
              Voltar
            </button>

            <button
              onClick={() => onMove(id, "done")}
              className="px-3 py-1 ml-auto bg-emerald-600 rounded hover:bg-emerald-700 transition text-white "
            >
              Concluir
            </button>
          </>
        )}

        {/* A FAZER */}
        {status === "to_do" && (
          <button
            onClick={() => onMove(id, "in_progress")}
            className="px-3 py-1 font-medium ml-auto bg-slate-200 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded cursor-pointer"
          >
            Avançar
          </button>
        )}

        {status === "done" && (
          <button
            onClick={() => onMove(id, "in_progress")}
            className="px-3 py-1 font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded cursor-pointer"
          >
            Reabrir
          </button>
        )}
      </div>
    </div>
  );
}
