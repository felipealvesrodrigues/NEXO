import React from "react";

interface ColumnProps{
  title: string
  children: React.ReactNode /* Isso aqui permite que componentes sejam colocados dentro de um componente */
}

export function Column({title, children}: ColumnProps ) {
  return(
    <div className="bg-slate-200/60 dark:bg-slate-800/60 rounded-xl p-4 w-80 min-h-100 border border-slate-300/50 dark:border-slate-700/50 flex flex-col gap-3">
      <h2 className="text-2xl text-slate-700 dark:text-slate-200 mb-2 font-bold">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  )
}