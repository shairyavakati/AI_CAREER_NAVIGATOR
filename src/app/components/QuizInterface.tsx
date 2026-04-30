import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react';
import { generateQuiz, submitQuiz } from '../api';

interface QuizInterfaceProps { onComplete: () => void; }

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export function QuizInterface({ onComplete }: QuizInterfaceProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Array<{ question_id: number; selected_option: number }>>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [redirectionModal, setRedirectionModal] = useState(false);

  useEffect(() => { loadQuiz(); }, []);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showResult, loading]);

  const loadQuiz = async () => {
    try {
      const data = await generateQuiz();
      setQuestions(data.questions || []);
      setTimeLeft(data.time_limit || 120);
    } catch {
      setQuestions([{
        id: 0, question: 'What is the purpose of useEffect hook in React?',
        options: ['To manage component state', 'To handle side effects in functional components', 'To create custom hooks', 'To optimize rendering performance'],
      }]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, { question_id: questions[currentQ].id, selected_option: selectedAnswer }];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      try {
        const result = await submitQuiz(newAnswers, 120 - timeLeft);
        setQuizResult(result);
        if (result.needs_redirection) { setRedirectionModal(true); }
        else { setTimeout(() => onComplete(), 2500); }
      } catch { setTimeout(() => onComplete(), 2000); }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="w-10 h-10 animate-spin text-indigo-400" /></div>;
  if (questions.length === 0) return null;

  const question = questions[currentQ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-transparent">
      <div className="w-full max-w-3xl rounded-[32px] p-12 backdrop-blur-[40px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="px-6 py-3 rounded-[20px] flex items-center gap-3 shadow-lg" style={{ background: timeLeft < 30 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(129, 140, 248, 0.1)', border: timeLeft < 30 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(129, 140, 248, 0.3)' }}>
            <Clock className={`w-5 h-5 ${timeLeft < 30 ? 'text-rose-500 animate-pulse' : 'text-indigo-400'}`} />
            <span style={{ fontSize: '20px', fontWeight: 800, color: timeLeft < 30 ? '#EF4444' : '#818CF8', fontFamily: 'JetBrains Mono, monospace' }}>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
          <div className="px-5 py-2 rounded-full border border-white/5 bg-white/5">
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase {currentQ + 1} / {questions.length}</span>
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="mb-10 text-white leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontSize: '26px', fontWeight: 700 }}>{question.question}</h3>

          <div className="space-y-4 mb-12">
            {question.options.map((option: string, idx: number) => {
              const isSelected = selectedAnswer === idx;
              return (
                <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                  className="w-full rounded-[20px] p-5 text-left transition-all duration-300 flex items-center justify-between group relative overflow-hidden"
                  style={{ 
                    background: isSelected ? 'rgba(129, 140, 248, 0.1)' : 'rgba(30, 41, 59, 0.4)', 
                    border: isSelected ? '1px solid rgba(129, 140, 248, 0.5)' : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: isSelected ? '0 0 20px rgba(129, 140, 248, 0.1)' : 'none',
                    cursor: showResult ? 'default' : 'pointer' 
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className={`relative z-10 text-lg transition-colors ${isSelected ? 'text-white font-bold' : 'text-slate-300 font-medium group-hover:text-white'}`}>{option}</span>
                  {isSelected && !showResult && <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                </button>
              );
            })}
          </div>

          {!showResult && (
            <button onClick={handleSubmit} disabled={selectedAnswer === null}
              className="w-full py-4.5 rounded-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(129,140,248,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-xl"
              style={{ background: selectedAnswer !== null ? 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px', fontWeight: 700 }}>
              {currentQ < questions.length - 1 ? 'Next Phase' : 'Finalize Analysis'}
              <Zap className="w-4 h-4 group-hover:animate-pulse" />
            </button>
          )}

          {showResult && quizResult && (
            <div className="rounded-[24px] p-8 text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden" style={{ background: quizResult.score >= 60 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: quizResult.score >= 60 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div className="relative z-10">
                <div style={{ fontSize: '24px', fontWeight: 800, color: quizResult.score >= 60 ? '#10B981' : '#EF4444', marginBottom: '8px' }}>
                  {quizResult.score >= 60 ? 'PROTOTYPE SYNCHRONIZED' : 'SYNCHRONIZATION FAILURE'}
                </div>
                <p className="mb-4 text-white font-bold" style={{ fontSize: '18px' }}>Accuracy: {quizResult.score}% ({quizResult.correct}/{quizResult.total})</p>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating cognitive profile...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Intelligent Redirection Modal */}
        {redirectionModal && quizResult?.needs_redirection && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-950/60 backdrop-blur-md px-6">
            <div className="max-w-md w-full rounded-[32px] p-10 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500" />
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-indigo-400" />
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 800, color: '#F8FAFC' }}>Neural Insight</h3>
              </div>
              <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: '1.7', marginBottom: '32px' }}>{quizResult.redirection_message}</p>
              <div className="flex flex-col gap-4">
                <button onClick={() => { setRedirectionModal(false); onComplete(); }} className="w-full py-4 rounded-[16px] shadow-lg transition-all duration-300 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)', color: 'white', fontSize: '15px', fontWeight: 700 }}>Optimize Learning Pace</button>
                <button onClick={() => { setRedirectionModal(false); onComplete(); }} className="w-full py-4 rounded-[16px] border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-all duration-300" style={{ fontSize: '14px', fontWeight: 600 }}>Maintain Current Protocol</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
