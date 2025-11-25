
import React, { useState, useEffect } from 'react';
import { generateQuestion } from '../utils/gameLogic';
import { getMentorMessage } from '../services/gemini';
import { Question, TabellinaId, ThemeConfig } from '../types';
import { ArrowLeft, XCircle, CheckCircle } from 'lucide-react';

interface GameSessionProps {
  tableId: TabellinaId;
  userName: string;
  theme: ThemeConfig;
  onComplete: (score: number, stars: number) => void;
  onBack: () => void;
}

const TOTAL_QUESTIONS = 10;

export const GameSession: React.FC<GameSessionProps> = ({ tableId, userName, theme, onComplete, onBack }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mentorText, setMentorText] = useState<string>('Caricamento...');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    // Initial load
    loadQuestion();
    getMentorMessage('welcome', userName, theme).then(setMentorText);
  }, []);

  const loadQuestion = () => {
    const q = generateQuestion(tableId);
    setQuestion(q);
    setSelectedOption(null);
    setFeedback(null);
  };

  const handleAnswer = async (answer: number) => {
    if (selectedOption !== null || !question) return; // Prevent double click
    
    setSelectedOption(answer);
    const isCorrect = answer === question.correctAnswer;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Every 3 correct in a row, get specific praise
      if (newStreak % 3 === 0) {
        getMentorMessage('correct', userName, theme, { question: `${question.factorA} x ${question.factorB}` }).then(setMentorText);
      }
    } else {
      setFeedback('wrong');
      setStreak(0);
      getMentorMessage('mistake', userName, theme, { 
        question: `${question.factorA} x ${question.factorB}`, 
        answer, 
        correctAnswer: question.correctAnswer 
      }).then(setMentorText);
    }

    // Wait and go next
    setTimeout(() => {
      if (currentQIndex < TOTAL_QUESTIONS - 1) {
        setCurrentQIndex(prev => prev + 1);
        loadQuestion();
        // Reset feedback text to neutral if it was an error explanation
        if (!isCorrect) {
           setMentorText("Forza, la prossima andrà meglio!");
        }
      } else {
        finishGame(score + (isCorrect ? 1 : 0));
      }
    }, 2500);
  };

  const finishGame = (finalScore: number) => {
    const percentage = finalScore / TOTAL_QUESTIONS;
    let stars = 0;
    if (percentage >= 0.9) stars = 3;
    else if (percentage >= 0.6) stars = 2;
    else if (percentage > 0) stars = 1;
    
    onComplete(finalScore, stars);
  };

  if (!question) return <div className="p-10 text-center animate-pulse">Generazione sfida...</div>;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 ${theme.primaryColor} text-white`}>
        <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
          <ArrowLeft />
        </button>
        <div className="font-bold text-xl">Domanda {currentQIndex + 1}/{TOTAL_QUESTIONS}</div>
        <div className={`${theme.secondaryColor} px-3 py-1 rounded-full text-sm`}>Punti: {score * 10}</div>
      </div>

      {/* Mentor Bubble */}
      <div className="p-4 bg-white shadow-sm z-10">
        <div className="flex gap-4 items-start">
          <div className="text-4xl">{theme.mentorEmoji}</div>
          <div className="bg-slate-50 p-3 rounded-r-xl rounded-bl-xl text-slate-700 text-sm leading-relaxed shadow-sm flex-1 animate-fade-in border border-slate-200">
            {mentorText}
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-slate-400 font-medium mb-4 uppercase tracking-widest text-sm">
          Quanto fa?
        </div>
        <div className="text-6xl font-black text-slate-800 mb-12 flex items-center gap-4">
          <span className="animate-bounce-short" style={{animationDelay: '0ms'}}>{question.factorA}</span>
          <span className={theme.accentText}>×</span>
          <span className="animate-bounce-short" style={{animationDelay: '100ms'}}>{question.factorB}</span>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {question.options.map((opt, idx) => {
            let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50";
            if (selectedOption !== null) {
              if (opt === question.correctAnswer) btnClass = "bg-green-500 border-green-600 text-white shadow-lg scale-105";
              else if (opt === selectedOption) btnClass = "bg-red-500 border-red-600 text-white opacity-50";
              else btnClass = "bg-slate-100 text-slate-300 border-transparent";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={selectedOption !== null}
                className={`h-24 rounded-2xl text-3xl font-bold transition-all duration-300 transform shadow-sm ${btnClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Overlay Animation */}
      {feedback === 'correct' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-green-500/10 z-20">
          <CheckCircle className="text-green-500 w-32 h-32 animate-ping" />
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-red-500/10 z-20">
          <XCircle className="text-red-500 w-32 h-32 animate-pulse" />
        </div>
      )}
    </div>
  );
};
