import React, { useState } from "react";


function Header() {
  return (
    <header>
      <h1>Nexo</h1>
    </header>
  );
}

interface CardProps {
  id: number
  title: string
  status: string
  onMove: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void
}

function Card({ title }: CardProps) {
  return (
    <div style={{border: '1px solid #475569', padding: '10px 8px 8px 8px', marginBottom: '10px', borderRadius: '5px'}}>
      <p style={{margin: '0'}}>
        {title}
      </p>

      <div style={{display: 'flex', gap: '8px', marginTop: '8px' }}>

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
    <div style={{border: '1px solid #fbfcff', padding: '16px', margin: '10px', borderRadius: '8px', minWidth: '250px'}}>
      <h2 style={{marginBottom: '10px'}}>
        {title}
      </h2>
      <div>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const [tasks, setTasks] = useState([ 
    {id: 1, title: 'Aprender props e Children', status: 'to_do'},
    {id: 2, title: 'Entender o useState', status: 'to_do'},
    {id: 3, title: 'Montar a extrutura do NEXO', status: 'in_progress'},
  ])
  const [newTaskTitle, setNewTaskTitle] = useState(''); /* Esse setNewTask vai pegar o que ta escrito lá no form. O setNewTask tbm está diretamente ligado ao campo de escrever o texto*/
  const handleAddTask = (e: React.FormEvent) => { /* handleAddTask, o parâmetro "e" e o setNewTaskTitle estão conctados. O setNewTaskTitle salva na memória do react o que o "e" capturou da digitação (por meio do e.target.value) e quando Enter ou o botão de enviar é apertado, o handle pega o que tá salvo SetNew e cria uma nova task com ele. */
    e.preventDefault(); /* Previne que a página recarregue ao enviar o formulário */

    if (!newTaskTitle.trim()) return; /* Não adiciona se o texto estiver vazio */

    const newTask = {
      id: Date.now(), /* Gera um id baseado no tinmestamp atual */
      title: newTaskTitle,
      status: 'to_do' /* Vai fazer com que toda nova task entre na aba de "A fazer" */
    };

    setTasks([...tasks, newTask]); /* Adiciona ua nova task mantendo as antigas */
    setNewTaskTitle('')/* Limpa o campo de texto depois de enviar */
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

  return (
    <div>
      <Header />
      <form onSubmit={handleAddTask} style={{padding: '16px', display: 'flex', gap: '8px'}}>
        <input
          type="text" 
          placeholder="Digite o título da nova tarefa..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)} /* Toda vez que uma letra é digitada no input, o SetNewTaskTitle captura o evento e.target.value e atualiza o estado newTaskTitle.*/
          style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '300px'}}
          />

          <button type="submit" style={{padding: ' 8px 18px', cursor: 'pointer'}}>
            Adicionar
          </button>
      </form>

      <div style={{display: 'flex', gap: '16px', padding: '16px'}}> {/* Englobei numa div para fazer eles ficarem lado a lado */}
        <Column title="A fazer">
          {tasks 
          .filter((task) => task.status === 'to_do')
          .map((task) => ( /* O map pega os itens filtrados pelo filter e converte em um componente de react, uma tarefa de cada vez */
            <Card key={task.id} title={task.title} />
          ))}
        </Column> 
        
        <Column title="Em progresso">
        {tasks
          .filter((task) => task.status === 'in_progress')
          .map((task)=> ( /* O map pega os itens filtrados pelo filter e converte em um componente de react, uma tarefa de cada vez */
            <Card key={task.id} title={task.title} />
          ))}
        </Column>
      </div>
    </div>
  );
}
