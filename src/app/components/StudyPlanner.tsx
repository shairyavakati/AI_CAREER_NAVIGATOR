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
    <div className="space-y-3">
      {taskList.map(task => (
        <div key={task.id} onClick={() => toggleTask(task.id)}
          className="rounded-[14px] p-4 cursor-pointer transition-all duration-200 hover:shadow-[0_8px_24px_rgba(79,70,229,0.15)]"
          style={{ background: 'rgba(255, 255, 255, 0.9)', border: task.completed ? '2px solid #10B981' : type === 'revision' ? '2px solid #06B6D420' : '2px solid #4F46E520', opacity: task.completed ? 0.7 : 1 }}>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
              style={{ background: task.completed ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)', border: task.completed ? '2px solid #10B981' : '2px solid #D1D5DB' }}>
              {completing === task.id ? <Loader2 className="w-3 h-3 animate-spin text-[#4F46E5]" /> : task.completed && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
            </div>
            <div className="flex-1">
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</div>
              <div className="text-[#6B7280]" style={{ fontSize: '13px', marginTop: '2px' }}>{task.time}</div>
            </div>
          </div>
        </div>
      ))}
      {taskList.length === 0 && <p className="text-center text-[#6B7280] py-4" style={{ fontSize: '14px' }}>No {type} tasks for today</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Today's Study Plan</h2>
            <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>{today}</p>
          </div>
          <div className="px-6 py-3 rounded-[14px]" style={{ background: 'linear-gradient(135deg, #4F46E515 0%, #4F46E508 100%)', border: '2px solid #4F46E530' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#4F46E5' }}>{tasks.filter(t => t.completed).length}/{tasks.length}</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Completed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', fontWeight: 600, color: '#111827' }}>🆕 New Learning</h3>
            </div>
            {renderTaskList(learningTasks, 'learning')}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)' }}>
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', fontWeight: 600, color: '#111827' }}>🔁 Revision</h3>
            </div>
            {renderTaskList(revisionTasks, 'revision')}
          </div>
        </div>

        <button onClick={onContinue} className="w-full mt-10 py-4 rounded-[16px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(79,70,229,0.3)]" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', color: 'white', fontSize: '16px', fontWeight: 600, boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)' }}>
          View Full Dashboard
        </button>
      </div>
    </div>
  );
}
