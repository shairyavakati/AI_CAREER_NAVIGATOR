import { BookOpen, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTodayPlan, completeTask } from '../api';

interface StudyPlannerProps {
  onContinue: () => void;
}

interface Task {
  id: string;
  title: string;
  type: 'learning' | 'revision';
  completed: boolean;
  time: string;
}

export function StudyPlanner({ onContinue }: StudyPlannerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => { loadPlan(); }, []);

  const loadPlan = async () => {
    try {
      const data = await getTodayPlan();
      setTasks((data.plan || []).map((t: any) => ({
        id: t.id, title: t.title, type: t.type, completed: t.completed, time: t.time
      })));
    } catch {
      setTasks([
        { id: '1', title: 'Complete TypeScript Advanced Types', type: 'learning', completed: false, time: '45 min' },
        { id: '2', title: 'Revise React Hooks Fundamentals', type: 'revision', completed: false, time: '30 min' },
        { id: '3', title: 'Practice State Management Quiz', type: 'learning', completed: true, time: '20 min' },
        { id: '4', title: 'Day 3 Revision: TypeScript Basics', type: 'revision', completed: false, time: '25 min' },
        { id: '5', title: 'Read Performance Optimization Docs', type: 'learning', completed: false, time: '40 min' }
      ]);
    } finally { setLoading(false); }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;

    setCompleting(id);
    try {
      await completeTask(id);
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t));
    } catch (err) {
      console.error('Failed to complete task:', err);
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: false } : t));
    } finally { setCompleting(null); }
  };

  const learningTasks = tasks.filter(t => t.type === 'learning');
  const revisionTasks = tasks.filter(t => t.type === 'revision');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>;

  const renderTaskList = (taskList: Task[], type: 'learning' | 'revision') => (
    <div className="space-y-4">
      {taskList.map(task => (
        <div key={task.id} onClick={() => toggleTask(task.id)}
          className="rounded-[18px] p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg"
          style={{ 
            background: task.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.6)', 
            border: task.completed ? '1px solid rgba(16, 185, 129, 0.3)' : type === 'revision' ? '1px solid rgba(45, 212, 191, 0.2)' : '1px solid rgba(129, 140, 248, 0.2)', 
            opacity: task.completed ? 0.8 : 1,
            boxShadow: task.completed ? '0 0 20px rgba(16, 185, 129, 0.05)' : 'none'
          }}>
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
              style={{ background: task.completed ? '#10B981' : 'rgba(15, 23, 42, 0.8)', border: task.completed ? 'none' : '2px solid rgba(255,255,255,0.1)' }}>
              {completing === task.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1">
              <div style={{ fontSize: '16px', fontWeight: 600, color: task.completed ? '#10B981' : '#F8FAFC', textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>{task.title}</div>
              <div className="text-slate-400 font-medium" style={{ fontSize: '13px', marginTop: '3px' }}>{task.time}</div>
            </div>
          </div>
        </div>
      ))}
      {taskList.length === 0 && <p className="text-center text-[#6B7280] py-4" style={{ fontSize: '14px' }}>No {type} tasks for today</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-transparent">
      <div className="w-full max-w-5xl rounded-[32px] p-12 backdrop-blur-[40px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
          <div>
            <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 800, marginBottom: '6px' }}>Neural Study Sequence</h2>
            <p className="text-slate-400" style={{ fontSize: '16px' }}>{today}</p>
          </div>
          <div className="px-6 py-4 rounded-[20px] shadow-lg relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
            <div className="absolute inset-0 bg-indigo-500/5" />
            <div className="relative z-10 text-center">
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#818CF8' }}>{tasks.filter(t => t.completed).length}/{tasks.length}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modules Active</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)', boxShadow: '0 0 20px rgba(129, 140, 248, 0.3)' }}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: '#F8FAFC' }}>New Protocols</h3>
            </div>
            {renderTaskList(learningTasks, 'learning')}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #2DD4BF 100%)', boxShadow: '0 0 20px rgba(45, 212, 191, 0.3)' }}>
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: '#F8FAFC' }}>Revision Cycle</h3>
            </div>
            {renderTaskList(revisionTasks, 'revision')}
          </div>
        </div>

        <button onClick={onContinue} className="w-full mt-12 py-4.5 rounded-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(129,140,248,0.4)] shadow-xl" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)', color: 'white', fontSize: '16px', fontWeight: 700 }}>
          Access Central Hub
        </button>
      </div>
    </div>
  );
}
