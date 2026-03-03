
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  agent: string;
  output?: string;
}

const AGENTS = [
  { name: 'None', icon: 'fa-user', color: 'text-slate-400' },
  { name: 'Copywriter', icon: 'fa-pen-nib', color: 'text-pink-500' },
  { name: 'Coder', icon: 'fa-code', color: 'text-blue-500' },
  { name: 'Analyst', icon: 'fa-chart-line', color: 'text-green-500' },
  { name: 'Designer', icon: 'fa-palette', color: 'text-purple-500' },
];

const ProjectManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Draft Marketing Email', description: 'Write a launch email for the new product.', status: 'todo', agent: 'Copywriter' },
    { id: '2', title: 'Fix React Component', description: 'Debug the infinite loop in Sidebar.', status: 'inprogress', agent: 'Coder' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('None');
  const [loadingTask, setLoadingTask] = useState<string | null>(null);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'todo',
      agent: selectedAgent
    };
    setTasks([...tasks, task]);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const moveTask = (id: string, status: Task['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleAgentExecution = async (task: Task) => {
    if (task.agent === 'None') return;
    setLoadingTask(task.id);
    
    try {
      const prompt = `Act as a ${task.agent}. Complete the following task: ${task.description || task.title}. Be concise.`;
      const result = await generateText(prompt);
      
      setTasks(tasks.map(t => t.id === task.id ? { 
        ...t, 
        status: 'done', 
        output: result 
      } : t));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTask(null);
    }
  };

  const renderColumn = (status: Task['status'], title: string, color: string) => (
    <div className="flex-1 min-w-[300px] bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 backdrop-blur-sm flex flex-col h-full">
      <div className={`flex items-center justify-between mb-4 pb-2 border-b border-slate-200 ${color}`}>
        <h3 className="font-bold uppercase tracking-wide text-xs">{title}</h3>
        <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-md shadow-sm">
          {tasks.filter(t => t.status === status).length}
        </span>
      </div>
      
      <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
        {tasks.filter(t => t.status === status).map(task => (
          <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-800 text-sm leading-tight">{task.title}</h4>
              <div className={`text-xs ${AGENTS.find(a => a.name === task.agent)?.color}`}>
                <i className={`fa-solid ${AGENTS.find(a => a.name === task.agent)?.icon}`}></i>
              </div>
            </div>
            {task.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>}
            
            {task.output && (
              <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-600 font-mono mb-3 border border-slate-200 max-h-20 overflow-y-auto">
                <span className="font-bold text-xs text-indigo-500 block mb-1">AI Output:</span>
                {task.output}
              </div>
            )}

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
               <div className="flex gap-1">
                 {status !== 'todo' && (
                   <button onClick={() => moveTask(task.id, 'todo')} className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[10px] text-slate-500" title="Move to Todo"><i className="fa-solid fa-arrow-left"></i></button>
                 )}
                 {status !== 'done' && (
                   <button onClick={() => moveTask(task.id, status === 'todo' ? 'inprogress' : 'done')} className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[10px] text-slate-500" title="Move Forward"><i className="fa-solid fa-arrow-right"></i></button>
                 )}
               </div>
               
               {task.agent !== 'None' && status !== 'done' && (
                 <button 
                   onClick={() => handleAgentExecution(task)}
                   disabled={loadingTask === task.id}
                   className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                 >
                   {loadingTask === task.id ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-robot"></i>}
                   Run Agent
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Project Manager</h2>
          <p className="text-slate-500">Collaborate with AI agents to get things done.</p>
        </div>
        
        {/* Add Task Form */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
           <input 
             type="text" 
             placeholder="Task Title..." 
             value={newTaskTitle}
             onChange={(e) => setNewTaskTitle(e.target.value)}
             className="px-4 py-2 bg-transparent outline-none text-sm font-medium w-full md:w-48"
           />
           <input 
             type="text" 
             placeholder="Description (Optional)" 
             value={newTaskDesc}
             onChange={(e) => setNewTaskDesc(e.target.value)}
             className="px-4 py-2 bg-transparent outline-none text-sm font-medium w-full md:w-64 border-l border-slate-100"
           />
           <select 
             value={selectedAgent}
             onChange={(e) => setSelectedAgent(e.target.value)}
             className="px-2 py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 outline-none border border-slate-100 cursor-pointer"
           >
             {AGENTS.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
           </select>
           <button 
             onClick={addTask}
             disabled={!newTaskTitle.trim()}
             className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all ${!newTaskTitle.trim() ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
           >
             <i className="fa-solid fa-plus"></i>
           </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex overflow-x-auto gap-6 h-full pb-4 items-stretch">
        {renderColumn('todo', 'To Do', 'text-slate-500')}
        {renderColumn('inprogress', 'In Progress', 'text-blue-500')}
        {renderColumn('done', 'Completed', 'text-green-500')}
      </div>
    </div>
  );
};

export default ProjectManager;
