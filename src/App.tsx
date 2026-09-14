import { useState } from "react";


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
  const [tasks, setTasks] = useState([ /*  */
    {id: 1, title: 'Aprender props e Children', status: 'todo'},
    {id: 2, title: 'Entender o useState', status: 'todo'},
    {id: 3, title: 'Montar a extrutura do NEXO', status: 'in_progress'},
  ])
  return (
    <div>
      <Header />

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
