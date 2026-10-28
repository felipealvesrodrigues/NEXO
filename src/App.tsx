import React, { useState, useEffect } from "react";


export interface task { /*  */
  id: number;
  title: string;
  description?: string;
  status: string;
}

function Header() {
  return (
    <header>
    </header>
  );
}

interface CardProps {
  id: number
  title: string
  description?: string
  status: string
  onMove: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, editTitle: string, editDescription?: string) => void /* A ? é pra deixar opcional */
}

function Card({ title, description, id, status, onMove, onDelete, onEdit }: CardProps) {
  const[isEditing, setIsEditing] = useState(false) /* O isEditing vai servir pra ativar o modo de edição, por padrão ele vem false. Lá em baixo tem a função que deixa ele true */
  const[editTitle, setEditTitle] = useState(title) /* editTitle e o editDescription guardam o que o usuário está digitando */
  const[editDescription, setEditDescription] = useState(description || '')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const  handleSave = () => { 
    if (!editTitle.trim()) return; // Não permite salvar se o nome tiver vazio
    onEdit(id, editTitle, editDescription); // chama a função do App passando o id, o novo titulo e a nova descrição
    setIsEditing(false) //fecha o modo de edição  
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80 relative">
      <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-1">
        {title}
      </p>

      <div className="absolute top-3 right-3">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10" >
          <button onClick={() => {setIsEditing(true); setIsMenuOpen(false)}}
           className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-700 ">

          </button>
        </div>
      )}

      {description && (
        <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </p>
      )}

      {/* Se tiver no modo edição, isso aq vai mostrar os inputs para serem alterados */}
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Descrição" 
          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
          <button onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 rounded text-white py-[2.3px] transition cursor-pointer w-24 self-center"> 
            Salvar
          </button>
        </div>
      ) : (
        /* Se não tiver no moddo de edição, mostra o botão de editar */
        <> {/* isso aq é pra substituir um div, permitindo retornar mais de um elemento pai de uma vez (tipo o button + a div) */}
        <button onClick={() => setIsEditing(true)} className="self-start text-indigo-600 dark:text-indigo-400 cursor-pointer mt-1">
          Editar
        </button>
        </>
      )}

      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
      <button onClick={() => onDelete(id)} 
      className="mr-auto px-3 py-1 text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded transition cursor-pointer">
        Excluir
      </button>

      {status === 'in_progress' && (
        <button onClick={() => onMove(id, 'to_do')}
        className="px-3 py-1 font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded cursor-pointer">
          Voltar
        </button>
      )}

      {status === 'to_do' && (
        <button onClick={() => onMove(id, 'in_progress')}
        className="px-3 py-1 font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 rounded cursor-pointer">
          Avançar
        </button>
      )}
      </div>
    </div>
  )
}

interface ColumnProps{
  title: string
  children: React.ReactNode /* Isso aqui permite que componentes sejam colocados dentro de um componente */
}

function Column({title, children}: ColumnProps ) {
  return(
    <div className="bg-slate-200/60 dark:bg-slate-800/60 rounded-xl p-4 w-80 min-h-30 border border-slate-300/50 dark:border-slate-700/50 flex flex-col gap-3">
      <h2 className="text-2xl text-slate-700 dark:text-slate-200 mb-2 font-bold">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const [tasks, setTasks] = useState<task[]>(() => {
    const savedTasks = localStorage.getItem('nexo_tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks); /* Converte o texto JSON de volta para array de objetos JS que o React consegue entender, porque o localStorage so consegue guardar textos simples. */
    }
    return []; /* Se não houver nada salvo, inicia com um array vazio */
  })
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  
  const [newTaskTitle, setNewTaskTitle] = useState(''); /* Esse setNewTask vai pegar o que ta escrito lá no form. O setNewTask tbm está diretamente ligado ao campo de escrever o texto*/
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const handleAddTask = (e: React.FormEvent) => { /* handleAddTask, o parâmetro "e" e o setNewTaskTitle estão conctados. O setNewTaskTitle salva na memória do react o que o "e" capturou da digitação (por meio do e.target.value) e quando Enter ou o botão de enviar é apertado, o handle pega o que tá salvo SetNew e cria uma nova task com ele. */
    e.preventDefault(); /* Previne que a página recarregue ao enviar o formulário */
    if (!newTaskTitle.trim()) return; /* Não adiciona se o texto estiver vazio */
    const newTask = {
      id: Date.now(), /* Gera um id baseado no tinmestamp atual */
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'to_do' /* Vai fazer com que toda nova task entre na aba de "A fazer" */
    };
    setTasks([...tasks, newTask]); /* Adiciona ua nova task mantendo as antigas */
    setNewTaskTitle('')/* Limpa o campo de texto depois de enviar */
    setNewTaskDescription('');
  }
  const handleMoveTask = (id: number, newStatus: string) => {
    setTasks(
      tasks.map((task) => 
        task.id === id ? { ...task, status: newStatus} : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditTask = (id: number, editTitle: string, editDescription?: string) => {
    setTasks(
      tasks.map((task) => /* percorre as task */
      task.id === id /* se o id for igual */
      ? {...task, title: editTitle, description: editDescription } /* muda as info titulo e descrição */
      : task /* se não, so deixa as tasks do mesmo jeito */
     )
    )
  }

  useEffect(() => {
    localStorage.setItem('nexo_tasks', JSON.stringify(tasks)) /* o stringfy faz o inverso do parse, ele transforma o array de volta em um texto para que ele seja salvo no localStorage */
  }, [tasks]) /* Esse array aqui faz a funcção ser executada sempre que o array mudar */

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
          <Header />
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

              <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition cursor-pointer shadow-sm">
                Adicionar
              </button>
          </form>

          <div className="flex items-start gap-6 overflow-x-auto pb-4"> {/* Englobei numa div para fazer eles ficarem lado a lado */}
            <Column title="A fazer">
              {tasks 
              .filter((task) => task.status === 'to_do')
              .map((task) => ( /* O map pega os itens filtrados pelo filter e converte em um componente de react, uma tarefa de cada vez */
                <Card key={task.id} title={task.title} description={task.description} id={task.id} status={task.status} onMove={handleMoveTask} onDelete={handleDeleteTask} onEdit={handleEditTask}/>
              ))}
            </Column> 

            <Column title="Em progresso">
            {tasks
              .filter((task) => task.status === 'in_progress')
              .map((task)=> ( /* O map pega os itens filtrados pelo filter e converte em um componente de react, uma tarefa de cada vez */
                <Card key={task.id} title={task.title} description={task.description} id={task.id} status={task.status} onMove={handleMoveTask} onDelete={handleDeleteTask} onEdit={handleEditTask}/>
              ))}
            </Column>
          </div>
        </div>
      </div>
  );
}
