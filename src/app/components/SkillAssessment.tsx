import { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Zap } from 'lucide-react';
import { getAssessmentQuestions, submitAssessment } from '../api';

interface SkillAssessmentProps {
  onComplete: (result: any) => void;
}

interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  type: string;
}

export function SkillAssessment({ onComplete }: SkillAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<{ question_id: number; selected_option: number }>>([]);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isInitial, setIsInitial] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getAssessmentQuestions();
      setQuestions(data.questions);
      setIsInitial(data.is_initial || !localStorage.getItem('chosen_role'));
    } catch (err) {
      console.error('Failed to load questions:', err);
      // Fallback questions
      setQuestions([
        { id: 0, question: 'What is your experience with React Hooks?', options: ['Never used', 'Basic understanding', 'Comfortable', 'Expert'], type: 'self_assess' },
        { id: 1, question: 'How familiar are you with TypeScript?', options: ['Never used', 'Basic types', 'Advanced types', 'Expert'], type: 'self_assess' },
        { id: 2, question: 'What is your experience with state management?', options: ['None', 'Local state only', 'Redux/Context', 'Advanced patterns'], type: 'self_assess' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleNext = async () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, { question_id: questions[currentQuestion].id, selected_option: selectedAnswer }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Submit assessment
      setSubmitting(true);
      try {
        const result = await submitAssessment(newAnswers);
        onComplete(result);
      } catch (err) {
        console.error('Failed to submit assessment:', err);
        onComplete({ score: 50 });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (questions.length === 0) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-transparent">
      <div className="w-full max-w-2xl rounded-[32px] p-12 backdrop-blur-[40px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-4">
             <Zap className="w-3 h-3" />
             Cognitive Sync
          </div>
          <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            {isInitial ? 'Neural Skill Scan' : 'Technical Validation'}
          </h2>
          <p className="text-slate-400 font-medium" style={{ fontSize: '15px' }}>
            {isInitial ? 'Synchronizing your cognitive profile with industry requirements.' : 'Validating proficiency parameters in your selected career trajectory.'}
          </p>
        </div>

        <div className="mb-10 relative z-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-500 font-bold uppercase tracking-wider" style={{ fontSize: '11px' }}>Sequence {currentQuestion + 1} / {questions.length}</span>
            <span className="text-indigo-400 font-bold" style={{ fontSize: '14px' }}>{Math.round(progress)}% SYNCED</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-slate-900 border border-white/5">
            <div className="h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(129,140,248,0.5)]" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)' }} />
          </div>
        </div>

        <h3 className="mb-10 text-white relative z-10 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700 }}>
          {questions[currentQuestion].question}
        </h3>

        <div className="space-y-4 mb-10 relative z-10">
          {questions[currentQuestion].options.map((option: string, idx: number) => {
            const isSelected = selectedAnswer === idx;
            return (
              <button key={idx} onClick={() => setSelectedAnswer(idx)}
                className="w-full rounded-[20px] p-5 text-left transition-all duration-300 flex items-center justify-between group relative overflow-hidden"
                style={{
                  background: isSelected ? 'rgba(129, 140, 248, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                  border: isSelected ? '1px solid rgba(129, 140, 248, 0.5)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isSelected ? '0 0 20px rgba(129, 140, 248, 0.1)' : 'none'
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`relative z-10 text-lg transition-colors ${isSelected ? 'text-white font-bold' : 'text-slate-300 font-medium group-hover:text-white'}`}>{option}</span>
                {isSelected && <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
              </button>
            );
          })}
        </div>

        <button onClick={handleNext} disabled={selectedAnswer === null || submitting}
          className="w-full py-4.5 rounded-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(129,140,248,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative z-10 shadow-xl"
          style={{
            background: selectedAnswer !== null ? 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)' : 'rgba(255,255,255,0.05)',
            color: 'white', fontSize: '16px', fontWeight: 700,
          }}>
          {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (currentQuestion < questions.length - 1 ? 'Next Sequence' : 'Finalize Profile')}
        </button>
      </div>
    </div>
  );
}
