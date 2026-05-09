import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    const [questions, setQuestions] = useState([{ 
        questionText: '', 
        options: ['', '', '', ''], 
        correctAnswer: '' 
    }]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) return alert("Bhai, quiz ka title toh daal do!");
        
        const isValid = questions.every(q => 
            q.questionText.trim() !== '' && 
            q.options.every(opt => opt.trim() !== '') &&
            q.correctAnswer !== ''
        );

        if (!isValid) {
            alert("Har question, option aur correct answer bharna zaroori hai!");
            return;
        }

        try {
            // 🔥 Backend Schema ke hisaab se clean data format
            const formattedQuestions = questions.map(q => ({
                questionText: q.questionText,
                options: q.options,
                // Model sirf 'correctAnswerIndex' mang raha hai
                correctAnswerIndex: q.options.indexOf(q.correctAnswer)
            }));

            const quizData = { 
                title, 
                description: "Quiz by " + (user?.username || "User"),
                questions: formattedQuestions,
                // Database validation ke liye required field
                creator: user?._id || user?.id 
            }; 

            console.log("Sending Data:", quizData); // Debugging ke liye

            const response = await axios.post('http://localhost:5000/api/quizzes/create', quizData, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            if (response.status === 201 || response.status === 200) {
                alert("Quiz Created Successfully! 🎉");
                navigate('/'); 
            }
        } catch (err) {
            // Console mein exact error check karein
            console.error("Full Error Object:", err.response?.data || err);
            
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Server error occurred.";
            alert(`Error: ${errorMsg}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 text-white">
            <div className="max-w-3xl mx-auto bg-[#1e293b] p-6 md:p-10 rounded-3xl shadow-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-cyan-400">Create New Quiz</h2>
                    <span className="text-slate-500 text-sm">Logged in as {user?.username || 'User'}</span>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-slate-300 ml-1">Quiz Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g., MERN Stack Mastery" 
                            className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 focus:border-cyan-500 outline-none transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-6 rounded-3xl bg-slate-800/30 border border-slate-700 relative group">
                                {questions.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveQuestion(qIndex)}
                                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
                                    >
                                        Remove
                                    </button>
                                )}
                                
                                <label className="block text-cyan-500 font-bold mb-3">Question {qIndex + 1}</label>
                                <input 
                                    type="text" 
                                    placeholder="Question text here..."
                                    className="w-full bg-slate-800 p-4 mb-4 rounded-xl border border-slate-700 focus:border-slate-500 outline-none"
                                    value={q.questionText}
                                    onChange={(e) => {
                                        const newQuestions = [...questions];
                                        newQuestions[qIndex].questionText = e.target.value;
                                        setQuestions(newQuestions);
                                    }}
                                    required
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {q.options.map((opt, oIndex) => (
                                        <input 
                                            key={oIndex} 
                                            type="text" 
                                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                            className="bg-slate-900/50 p-3 border border-slate-700 rounded-xl focus:border-cyan-600 outline-none transition"
                                            value={opt}
                                            onChange={(e) => {
                                                const newQuestions = [...questions];
                                                newQuestions[qIndex].options[oIndex] = e.target.value;
                                                setQuestions(newQuestions);
                                            }}
                                            required
                                        />
                                    ))}
                                </div>

                                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                                    <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Select Correct Answer</label>
                                    <select 
                                        className="w-full bg-transparent text-cyan-400 font-medium outline-none cursor-pointer"
                                        value={q.correctAnswer}
                                        onChange={(e) => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].correctAnswer = e.target.value;
                                            setQuestions(newQuestions);
                                        }}
                                        required
                                    >
                                        <option value="" className="bg-slate-800 text-white">-- Choose the right option --</option>
                                        {q.options.map((opt, oIndex) => (
                                            <option key={oIndex} value={opt} className="bg-slate-800 text-white">
                                                {opt ? `Option ${String.fromCharCode(65 + oIndex)}: ${opt}` : `Type Option ${String.fromCharCode(65 + oIndex)} first`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-800">
                        <button 
                            type="button" 
                            onClick={handleAddQuestion} 
                            className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold transition-all border border-slate-600"
                        >
                            + Add Question
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-bold transition-all shadow-[0_10px_20px_rgba(8,145,178,0.2)]"
                        >
                            Publish Quiz
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuiz;