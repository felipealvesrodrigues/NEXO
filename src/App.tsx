import React, { useState, useEffect } from "react";
import type { Task, TaskStatus, TaskPriority } from "./types/task";
import { Column } from "./components/Column";
import { Card } from "./components/Card";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('nexo_tasks'); /* Aparentemente isso aq é uma const temporária só pra ver o que ta guardado */
    if (savedTasks) {
      return JSON.parse(savedTasks); /* Converte o texto JSON de volta para array de objetos JS que o React consegue entender, porque o localStorage so consegue guardar textos simples. */
    }
    return []; /* Se não houver nada salvo, inicia com um array vazio. Aq só é retornado um array vazio pq tasks é uma lista de tarefas. Se fosse um valor booleano tipo o dark mode, seria return true */
  })
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('nexo_theme');
    if (savedTheme) {
      return JSON.parse(savedTheme)
    }
    return true
  })


  useEffect(() => {
    localStorage.setItem('nexo_theme', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  
  const [newTaskTitle, setNewTaskTitle] = useState(''); /* Esse setNewTask vai pegar o que ta escrito lá no form. O setNewTask tbm está diretamente ligado ao campo de escrever o texto*/
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium')
  const handleAddTask = (e: React.FormEvent) => { /* handleAddTask, o parâmetro "e" e o setNewTaskTitle estão conctados. O setNewTaskTitle salva na memória do react o que o "e" capturou da digitação (por meio do e.target.value) e quando Enter ou o botão de enviar é apertado, o handle pega o que tá salvo SetNew e cria uma nova task com ele. */
    e.preventDefault(); /* Previne que a página recarregue ao enviar o formulário */
    if (!newTaskTitle.trim()) return; /* Não adiciona se o texto estiver vazio */
    const newTask: Task = {
      id: Date.now(), /* Gera um id baseado no tinmestamp atual */
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'to_do', /* Vai fazer com que toda nova task entre na aba de "A fazer" */
      priority: newTaskPriority
    };
    setTasks([...tasks, newTask]); /* Adiciona ua nova task mantendo as antigas */
    setNewTaskTitle('')/* Limpa o campo de texto depois de enviar */
    setNewTaskDescription('');
    setNewTaskPriority('medium')
  }
  const handleMoveTask = (id: number, newStatus: TaskStatus) => {
    setTasks(
      tasks.map((task) => 
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditTask = (
    id: number,
    editTitle: string,
    editDescription?: string,
    editPriority?: TaskPriority
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: editTitle,
              description: editDescription,
              ...(editPriority ? { priority: editPriority } : {}),
            }
          : task
      )
    );
  };

  useEffect(() => {
    localStorage.setItem('nexo_tasks', JSON.stringify(tasks)) /* o stringfy faz o inverso do parse, ele transforma o array de volta em um texto para que ele seja salvo no localStorage */
  }, [tasks]) /* Esse array aqui faz a funcção ser executada sempre que o array mudar */

  const todotasks = tasks.filter((task) => task.status === 'to_do')
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress')
  const doneTasks = tasks.filter((task) => task.status === 'done')


  return ( 
      <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
        <header className="flex justify-between items-center mb-8 border-b border-slate-300 dark:border-slate-800 p-4">
          <h1 className="text-3xl font-bold tracking-tight ">NEXO kanban</h1>
          <button onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition">
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </button>
        </header>
        <div>
          <form onSubmit={handleAddTask} className="flex flex-wrap gap-3 mb-8 p-4 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <input
              type="text" 
              placeholder="Digite o título da nova tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)} /* Toda vez que uma letra é digitada no input, o SetNewTaskTitle captura o evento e.target.value e atualiza o estado newTaskTitle.*/
              className="px-3 py-2 border bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72"
              />

              <textarea 
              placeholder="Descrição da tarefa (opcional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72 h-10 resize-none"
              />

              <select 
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                <option value="low">Baixo</option>
                <option value="medium">Médio</option>
                <option value="high">Alto</option>
              </select>

              <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition cursor-pointer shadow-sm">
                Adicionar
              </button>
          </form>

          <div className="flex items-start gap-6 overflow-x-auto pb-4"> {/* Englobei numa div para fazer eles ficarem lado a lado */}
            <Column title="A fazer" count={todotasks.length}>
              {todotasks.map((task) => ( /* O map pega os itens filtrados pelo filter e converte em um componente de react, uma tarefa de cada vez */
                <Card key={task.id} title={task.title} description={task.description} id={task.id} status={task.status} onMove={handleMoveTask} onDelete={handleDeleteTask} onEdit={handleEditTask} priority={task.priority}/>
              ))}
            </Column> 

            <Column title="Em progresso" count={inProgressTasks.length}>
              {inProgressTasks.map((task) => (
                <Card
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  id={task.id}
                  status={task.status}
                  priority={task.priority}
                  onMove={handleMoveTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </Column>

            <Column title="Concluído" count={doneTasks.length}>
              {doneTasks.map((task) => (
                <Card
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  id={task.id}
                  status={task.status}
                  priority={task.priority}
                  onMove={handleMoveTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </Column>
          </div>
        </div>
      </div>
  );
}
