import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AcolitoQuiz() {
    const { level } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [useHint, setUseHint] = useState(false);

    useEffect(() => {
        async function fetchQuestions() {
    try {
        // MUDE DE: api.get(`/acolytes/questions/${level}`)
        // PARA:
        const response = await api.get(`/questions/level/${level}`);
        setQuestions(response.data);
    } catch (err) {
        console.error(err.response?.data);
        alert(err.response?.data?.message || "Erro ao carregar perguntas.");
        navigate('/acolito/dashboard');
    }
}
        fetchQuestions();
    }, [level]);

    async function handleAnswer(option) {
        try {
            const response = await api.post('/questions/answer', {
                question_id: questions[currentIndex].id,
                selected_option: option,
                use_hint: useHint
            });
            setLastResult(response.data);
            setShowExplanation(true);
        } catch (err) {
            alert(err.response?.data?.error || "Erro ao responder.");
        }
    }

    if (questions.length === 0) return <div className="p-10 text-center">Carregando...</div>;

    const currentQ = questions[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                {!showExplanation ? (
                    <>
                        <header className="flex justify-between items-center mb-6">
                            <span className="text-xs font-black text-purple-600 uppercase">Pergunta {currentIndex + 1} de {questions.length}</span>
                            <button onClick={() => setUseHint(true)} className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full hover:bg-amber-100">💡 Usar Dica (-5 pts)</button>
                        </header>
                        
                        <h2 className="text-2xl font-bold text-slate-800 mb-8">{currentQ.title}</h2>
                        {useHint && <p className="bg-amber-50 p-3 rounded-lg text-sm text-amber-800 mb-6 italic">Dica: {currentQ.hint}</p>}

                        <div className="grid gap-3">
                            {['a', 'b', 'c', 'd'].map(opt => (
                                <button key={opt} onClick={() => handleAnswer(opt)} className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition-all font-medium">
                                    <span className="font-black mr-2 uppercase">{opt})</span> {currentQ[`option_${opt}`]}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center animate-in zoom-in duration-300">
                        <div className={`text-6xl mb-4`}>{lastResult.correct ? '🎉' : '❌'}</div>
                        <h3 className={`text-2xl font-black mb-2 ${lastResult.correct ? 'text-green-600' : 'text-red-600'}`}>
                            {lastResult.correct ? 'Você acertou!' : 'Quase lá!'}
                        </h3>
                        <p className="text-slate-600 mb-6">{lastResult.explanation}</p>
                        <button 
                            onClick={() => {
                                if (currentIndex + 1 < questions.length) {
                                    setCurrentIndex(currentIndex + 1);
                                    setShowExplanation(false);
                                    setUseHint(false);
                                } else {
                                    navigate('/acolito/dashboard');
                                }
                            }}
                            className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700"
                        >
                            {currentIndex + 1 < questions.length ? 'Próxima Pergunta' : 'Finalizar Desafio'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}