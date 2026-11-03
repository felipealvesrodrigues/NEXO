import React from "react";

interface ColumnProps {
  title: string;
  children: React.ReactNode; /* Isso aqui permite que componentes sejam colocados dentro de um componente */
  count?: number; /* Contador de tarefas */
}

export function Column({ title, children, count }: ColumnProps) {
  return (
    <div className="bg-slate-200/60 dark:bg-slate-800/60 rounded-xl p-4 w-80 min-h-100 border border-slate-300/50 dark:border-slate-700/50 flex flex-col gap-3">
      <h2 className="flex justify-between items-center text-2xl text-slate-700 dark:text-slate-200 mb-2 font-bold">
        {title}
        {count !== undefined && (
          <span className="px-2.5 py-0.5 text-[17px] font-semibold rounded-full bg-slate-700/30 dark:bg-slate-700 text-slate-700 dark:text-slate-300 ">
            {count}
          </span>
        )}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
