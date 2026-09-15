import React, { useState } from "react";


function Header() {
  return (
    <header>
      <h1>Nexo</h1>
    </header>
  );
}

interface CardProps {
  title: string
}

function Card({ title }: CardProps) {
  return (
    <div>
      <p>
        {title}
      </p>
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
      <h2>
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
    {id: 1, title: 'Aprender props e Children', status: 'todo'},
    {id: 2, title: 'Entender o useState', status: 'todo'},
    {id: 3, title: 'Montar a extrutura do NEXO', status: 'in_progress'},
  ])
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault(); /* Previne que a página recarregue ao enviar o formulário */

    if (!newTaskTitle.trim()) return; /* Não adiciona se o texto estiver vazio */

    const newTask = {
      id: Date.now(), /* Gera um id baseado no tinmestamp atual */
      title: newTaskTitle,
      status: 'todo' /* Vai fazer com que toda nova task entre na aba de "A fazer" */
    };

    setTasks([...tasks, newTask]); /* Adiciona ua nova task mantendo as antigas */
    setNewTaskTitle('')/* Limpa o campo de texto depois de enviar */
  }

  return (
    <div>
      <Header />
      
      <form onSubmit={handleAddTask} style={{padding: '16px', display: 'flex', gap: '8px'}}>
        <input
          type="text" 
          placeholder="Digite o título da nova tarefa..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)} /* Toda vez que uma letra é digitada no input, o evento e.target.value captura o texto atual e atualiza o estado newTaskTitle*/
          style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '300px'}}
          />

          <button type="submit" style={{padding: ' 8px 18px', cursor: 'pointer'}}>
            Adicionar
          </button>
      </form>

      <div style={{display: 'flex', gap: '16px', padding: '16px'}}> {/* Englobei numa div para fazer eles ficarem lado a lado */}
        <Column title="A fazer">
          {tasks 
          .filter((task) => task.status === 'todo')
          .map((task) => (
            <Card key={task.id} title={task.title} />
          ))}
        </Column> 
        
        <Column title="Em progresso">
        {tasks
          .filter((task) => task.status === 'in_progress')
          .map((task)=> (
            <Card key={task.id} title={task.title} />
          ))}
        </Column>
      </div>
    </div>
  );
}
