import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>;
  if (questions.length === 0) return null;

  const question = questions[currentQ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-3xl rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
        <div className="flex justify-between items-center mb-8">
          <div className="px-6 py-3 rounded-[14px] flex items-center gap-3" style={{ background: timeLeft < 30 ? 'linear-gradient(135deg, #EF444415 0%, #EF444408 100%)' : 'linear-gradient(135deg, #4F46E515 0%, #4F46E508 100%)', border: timeLeft < 30 ? '2px solid #EF444430' : '2px solid #4F46E530' }}>
            <Clock className="w-5 h-5" style={{ color: timeLeft < 30 ? '#EF4444' : '#4F46E5' }} />
            <span style={{ fontSize: '20px', fontWeight: 700, color: timeLeft < 30 ? '#EF4444' : '#4F46E5' }}>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
          <div className="px-5 py-2 rounded-full" style={{ background: 'linear-gradient(135deg, #10B98115 0%, #10B98108 100%)', border: '2px solid #10B98130' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#10B981' }}>Question {currentQ + 1} of {questions.length}</span>
          </div>
        </div>

        <h3 className="mb-10" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '24px', fontWeight: 600, color: '#111827', lineHeight: '1.4' }}>{question.question}</h3>

        <div className="space-y-4 mb-10">
          {question.options.map((option: string, idx: number) => {
            const isSelected = selectedAnswer === idx;
            return (
              <button key={idx} onClick={() => !showResult && setSelectedAnswer(idx)} disabled={showResult}
                className="w-full rounded-[16px] p-5 text-left transition-all duration-200 flex items-center justify-between"
                style={{ background: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', boxShadow: isSelected && !showResult ? 'inset 2px 2px 6px rgba(0,0,0,0.06), inset -2px -2px 6px rgba(255,255,255,1), 0 0 0 2px rgba(79,70,229,0.3)' : 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)', border: isSelected ? '2px solid #4F46E5' : '2px solid transparent', cursor: showResult ? 'default' : 'pointer' }}>
                <span style={{ fontSize: '16px', fontWeight: isSelected ? 600 : 400, color: isSelected ? '#4F46E5' : '#111827' }}>{option}</span>
                {isSelected && !showResult && <CheckCircle2 className="w-5 h-5 text-[#4F46E5]" />}
              </button>
            );
          })}
        </div>

        {!showResult && (
          <button onClick={handleSubmit} disabled={selectedAnswer === null}
            className="w-full py-4 rounded-[16px] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: selectedAnswer !== null ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : '#D1D5DB', color: 'white', fontSize: '16px', fontWeight: 600, boxShadow: selectedAnswer !== null ? '0 8px 24px rgba(79,70,229,0.25)' : 'none' }}>
            {currentQ < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
          </button>
        )}

        {showResult && quizResult && (
          <div className="rounded-[16px] p-6 text-center" style={{ background: quizResult.score >= 60 ? 'linear-gradient(135deg, #10B98120 0%, #10B98110 100%)' : 'linear-gradient(135deg, #EF444420 0%, #EF444410 100%)', border: quizResult.score >= 60 ? '2px solid #10B98140' : '2px solid #EF444440' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: quizResult.score >= 60 ? '#10B981' : '#EF4444' }}>
              {quizResult.score >= 60 ? '✓ Great Job!' : '✗ Keep Practicing'}
            </div>
            <p className="mt-2" style={{ fontSize: '16px', color: '#111827', fontWeight: 600 }}>Score: {quizResult.score}% ({quizResult.correct}/{quizResult.total} correct)</p>
            <p className="mt-1" style={{ fontSize: '14px', color: '#6B7280' }}>Redirecting to planner...</p>
          </div>
        )}

        {/* Intelligent Redirection Modal */}
        {redirectionModal && quizResult?.needs_redirection && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
            <div className="max-w-md w-full mx-6 rounded-[20px] p-8 border border-white/30 shadow-xl" style={{ background: 'rgba(255,255,255,0.95)' }}>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>💡 Learning Suggestion</h3>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.7', marginBottom: '20px' }}>{quizResult.redirection_message}</p>
              <div className="flex gap-3">
                <button onClick={() => { setRedirectionModal(false); onComplete(); }} className="flex-1 py-3 rounded-[12px]" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', color: 'white', fontSize: '14px', fontWeight: 600 }}>Slow Down Pace</button>
                <button onClick={() => { setRedirectionModal(false); onComplete(); }} className="flex-1 py-3 rounded-[12px]" style={{ background: 'rgba(107,114,128,0.1)', border: '2px solid rgba(107,114,128,0.2)', color: '#6B7280', fontSize: '14px', fontWeight: 600 }}>Keep Current Pace</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
