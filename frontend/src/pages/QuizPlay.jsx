import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // LocalStorage se user check karne ke liye
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        // Corrected API URL
        const res = await axios.get('http://localhost:5000/api/quizzes/all');
        const foundQuiz = res.data.find(q => String(q._id) === String(id));
        
        if (foundQuiz) {
          setQuiz(foundQuiz);
        } else {
          setError("Quiz not found in database.");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Server connection failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // 🔥 Result save karne ka function
  const saveScoreToDB = async (finalScore) => {
    if (!user || !user.token) {
        console.log("User not logged in, score not saved.");
        return;
    }

    try {
      await axios.post('http://localhost:5000/api/results/save', {
        quizId: id,
        score: finalScore,
        totalQuestions: quiz.questions.length
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log("✅ Score saved to Leaderboard!");
    } catch (err) {
      console.error("❌ Score save error:", err);
    }
  };

  const handleAnswerClick = (selectedOption) => {
    if (!quiz || !quiz.questions[currentQuestion]) return;

    const currentQ = quiz.questions[currentQuestion];
    const correctAns = typeof currentQ.correctAnswer === 'string'
      ? currentQ.correctAnswer
      : currentQ.options[currentQ.correctAnswerIndex];

    let newScore = score;
    if (String(selectedOption).trim() === String(correctAns).trim()) {
      newScore = score + 1;
      setScore(newScore);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quiz.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      // 🔥 Quiz khatam hote hi result save karo
      saveScoreToDB(newScore);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400 mb-4"></div>
        <div className="text-white text-xl font-mono animate-pulse">Loading Quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold text-red-500 mb-4">Oops!</h2>
        <p className="text-slate-400 mb-8">{error}</p>
        <button onClick={() => navigate('/')} className="bg-slate-700 px-8 py-3 rounded-xl hover:bg-slate-600 transition">Back to Home</button>
      </div>
    );
  }

  const currentQuizData = quiz?.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-[#1e293b] p-8 rounded-3xl shadow-2xl border border-slate-700">
        
        {showScore ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="text-5xl mb-4">
               {score === quiz.questions.length ? '🏆' : score > 0 ? '🎉' : '😟'}
            </div>
            <h2 className="text-4xl font-bold text-cyan-400 mb-2">
              {score === quiz.questions.length ? 'Perfect Score!' : 'Quiz Finished!'}
            </h2>
            <p className="text-slate-400 mb-6 italic">Great effort in {quiz.title}!</p>
            
            <div className="bg-slate-800/50 p-8 rounded-2xl mb-8 border border-slate-700 shadow-inner">
              <p className="text-7xl font-black text-white">{score} <span className="text-3xl text-slate-500">/ {quiz.questions.length}</span></p>
              <p className="text-cyan-500/80 mt-2 text-lg font-medium tracking-widest uppercase">Correct Answers</p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.3)]"
            >
              Play Another Quiz
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <div className="mb-8 border-b border-slate-700 pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-cyan-400 leading-tight">{quiz.title}</h1>
                <p className="text-slate-500 text-sm mt-1">Read carefully before selecting</p>
              </div>
              <span className="bg-cyan-900/30 text-cyan-400 border border-cyan-800 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                QUESTION {currentQuestion + 1} OF {quiz.questions.length}
              </span>
            </div>

            <div className="mb-10 min-h-[80px] flex items-center">
              <h2 className="text-2xl font-semibold leading-snug text-slate-100">
                {currentQuizData?.questionText}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQuizData?.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className="group w-full text-left p-5 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700 rounded-2xl transition-all hover:border-cyan-500/50 hover:translate-x-1 active:scale-[0.99]"
                >
                  <div className="flex items-center">
                    <span className="w-10 h-10 flex-shrink-0 bg-slate-800 group-hover:bg-cyan-600 rounded-xl text-center flex items-center justify-center mr-4 text-cyan-400 group-hover:text-white font-bold transition-colors border border-slate-700">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlay;