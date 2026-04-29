import { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getAssessmentQuestions();
      setQuestions(data.questions);
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" />
      </div>
    );
  }

  if (questions.length === 0) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#6B7280]" style={{ fontSize: '14px', fontWeight: 500 }}>Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-[#4F46E5]" style={{ fontSize: '14px', fontWeight: 600 }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)' }} />
          </div>
        </div>

        <h3 className="mb-8" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '22px', fontWeight: 600, color: '#111827' }}>
          {questions[currentQuestion].question}
        </h3>

        <div className="space-y-4 mb-8">
          {questions[currentQuestion].options.map((option: string, idx: number) => {
            const isSelected = selectedAnswer === idx;
            return (
              <button key={idx} onClick={() => setSelectedAnswer(idx)}
                className="w-full rounded-[14px] p-4 text-left transition-all duration-200 flex items-center justify-between"
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                  boxShadow: isSelected ? 'inset 2px 2px 6px rgba(0,0,0,0.06), inset -2px -2px 6px rgba(255,255,255,1), 0 0 0 2px rgba(79,70,229,0.3)' : 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)',
                  border: isSelected ? '2px solid #4F46E5' : '2px solid transparent'
                }}>
                <span style={{ fontSize: '16px', fontWeight: isSelected ? 600 : 400, color: isSelected ? '#4F46E5' : '#111827' }}>{option}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-[#4F46E5]" />}
              </button>
            );
          })}
        </div>

        <button onClick={handleNext} disabled={selectedAnswer === null || submitting}
          className="w-full py-4 rounded-[16px] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: selectedAnswer !== null ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : '#D1D5DB',
            color: 'white', fontSize: '16px', fontWeight: 600,
            boxShadow: selectedAnswer !== null ? '0 8px 24px rgba(79, 70, 229, 0.25)' : 'none'
          }}>
          {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Assessment')}
        </button>
      </div>
    </div>
  );
}
