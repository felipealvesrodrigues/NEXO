import React, { useState } from "react";

export interface task { /*  */
  id: number;
  title: string;
  description?: string;
  status: string;
}

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
  description?: string
  status: string
  onMove: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, editTitle: string, editDescription?: string) => void 
}

function Card({ title, description, id, status, onMove, onDelete, onEdit }: CardProps) {
  const[isEditing, setIsEditing] = useState(false)
  const[editTitle, setEditTitle] = useState(title)
  const[editDescription, setEditDescription] = useState(description || '')

  const  handleSave = () => {
    if (!editTitle.trim()) return; // Não permite salvar
    onEdit(id, editTitle, editDescription); // chama a função do App
    setIsEditing(false) //fecha o modo de edição  
  }

  return (
    <div style={{border: '1px solid #475569', padding: '8px', marginBottom: '10px', borderRadius: '5px'}}>
      <p style={{margin: '0', marginTop: '6px', color: '#f8fafc'}}>
        {title}
      </p>

      {description && (
        <p style={{margin: '4px 0', fontSize: '0.9rem', color: '#94a3b8'}}>
          {description}
        </p>
      )}

      {/* Se tiver no modo edição, isso aq vai mostrar os inputs para serem alterados */}
      {isEditing ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px'}}>
          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Descrição" 
          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
          <button onClick={handleSave} style={{ cursor: 'pointer', padding: '4px' }}>
            Salvar
          </button>
        </div>
      ) : (
        /* Se não tiver no moddo de edição, mostra o botão de editar */
        <> 
        <button onClick={() => setIsEditing(true)} style={{cursor: 'pointer', padding: '2px 6px', marginTop: '4px'}}>
          Editar
        </button>
        </>
      )}

      <div style={{display: 'flex', gap: '8px', marginTop: '9px' }}>
      {status === 'to_do' && (
        <button onClick={() => onMove(id, 'in_progress')}
        style={{ cursor: 'pointer', padding: '4px 8px'}}>
          Avançar
        </button>
      )} 

      {status === 'in_progress' && (
        <button onClick={() => onMove(id, 'to_do')}
        style={{ cursor: 'pointer', padding: '4px 8px'}}>
          Voltar
        </button>
      )}

      <button onClick={() => onDelete(id)} 
      style={{ cursor: 'pointer', padding: '4px 8px', backgroundColor: '#ef4444',color: '#fff' , border: 'none', borderRadius: '4px'}}>
        Excluir
      </button>

      
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
  const [tasks, setTasks] = useState<task[]>([ /* settask é o que muda as tasks em si, e as task são as tasks né mano */
    {id: 1, title: 'Aprender props e Children', description: '', status: 'to_do'},
    {id: 2, title: 'Entender o useState', description: '', status: 'to_do'},
    {id: 3, title: 'Montar a extrutura do NEXO', description: '', status: 'in_progress'},
  ])
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
      ? {...task, title: editTitle, description: editDescription } /* muda as info */
      : task /* se não, so deixa as tasks do mesmo jeito */
     )
    )
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

          <textarea 
          placeholder="Descrição da tarefa (opcional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '300px', resize: 'vertical'}}
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
  );
}
