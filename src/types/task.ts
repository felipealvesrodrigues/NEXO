export type TaskStatus = 'to_do' | 'in_progress' | 'done' /* Isso aqui ta especificando os valores que serão aceitos lá em status */

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
    id: number;
    title: string; 
    description?: string;
    priority?: TaskPriority;
    status: TaskStatus; /* Não colocar "string" aqui, pq se houver um erro de digitação, o typescript não vai detectar. Srting vai aceitar literalmente qualquer texto. Por isso o type TaskStatus foi criado, ele vai servir como um filtro, permitindo que somente as strings que estão dentro dele sejam aceitas. Além do autocomplete do vs conseguir ajudar */
}