export type TaskPriority = 'low' | 'medium' | 'high';

// O status agora é flexível (string) para suportar qualquer ID de coluna dinâmica
export type TaskStatus = string;

export interface Task {
  id: number;
  title: string; 
  description?: string;
  priority?: TaskPriority;
  status: TaskStatus;
}

// Cores pré-selecionadas para as colunas
export type ColumnColor = 'slate' | 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';

// Opções de largura para as colunas
export type ColumnWidth = 'w-72' | 'w-80' | 'w-96' | 'w-[420px]';

export interface ColumnData {
  id: string;
  title: string;
  color?: ColumnColor;
  width?: ColumnWidth;
  priority?: TaskPriority;
}
