import React from "react";

interface ColumnProps {
  title: string;
  children: React.ReactNode; /* Isso aqui permite que componentes sejam colocados dentro de um componente */
  count?: number; /* Contador de tarefas */
}

export function Column({ title, children, count }: ColumnProps) {
  return (
    <div className="bg-slate-200/60 dark:bg-slate-800/60 rounded-xl p-4 w-80 min-h-100 border border-slate-300/50 dark:border-slate-700/50 flex flex-col gap-3">
      <div className="flex items-center">
          {count !== undefined && (
            <span className="flex items-center justify-center mb-2 mr-2 px-2.5 py-0.5 text-[14px] font-sbold rounded-full bg-slate-700/30 dark:bg-slate-700 text-slate-700 dark:text-slate-300 ">
              {count}
            </span>
          )}
          <h2 className="text-2xl text-slate-700 dark:text-slate-200 mb-2 font-bold">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
