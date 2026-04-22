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
    const [isAnswered, setIsAnswered] = useState(false);

    // 1. Carregar perguntas do nível
    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await api.get(`/questions/level/${level}`);
                setQuestions(response.data);
            } catch (err) {
                alert(err.response?.data?.message || "Erro ao carregar perguntas.");
                navigate('/acolito/dashboard');
            }
        }
        fetchQuestions();
    }, [level, navigate]);

    // 2. Monitorar mudança de pergunta e status de resposta
    useEffect(() => {
        if (questions[currentIndex]) {
            setIsAnswered(questions[currentIndex].already_answered);
            // Se já foi respondida no passado, resetamos a explicação para não confundir
            setShowExplanation(false); 
        }
    }, [currentIndex, questions]);

    async function handleAnswer(option) {
        if (isAnswered) return; // Trava para não responder duas vezes na mesma sessão
        
        try {
            const response = await api.post('/questions/answer', {
                question_id: questions[currentIndex].id,
                selected_option: option,
                use_hint: useHint
            });
            setLastResult(response.data);
            setShowExplanation(true);
            setIsAnswered(true);
        } catch (err) {
            // Caso o backend negue porque já existe resposta no banco
            if (err.response?.status === 403) {
                setIsAnswered(true);
                setShowExplanation(true);
                setLastResult({ 
                    correct: false, 
                    explanation: err.response.data.explanation 
                });
            }
        }
    }

    if (questions.length === 0) return <div className="p-10 text-center font-bold">Carregando desafios...</div>;

    const currentQ = questions[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center" translate="no">
            <div className="max-w-2xl w-full">
                
                {/* BOTÃO VOLTAR */}
                <button 
                    onClick={() => navigate('/acolito/dashboard')} 
                    className="mb-6 text-gray-400 hover:text-purple-600 font-bold flex items-center gap-2 transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar ao Início
                </button>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <header className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                            Questão {currentIndex + 1} de {questions.length}
                        </span>
                        
                        {/* Só mostra botão de dica se ainda não respondeu */}
                        {!isAnswered && !useHint && (
                            <button 
                                onClick={() => setUseHint(true)} 
                                className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors uppercase"
                            >
                                💡 Dica (-5 pts)
                            </button>
                        )}
                    </header>

                    <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">
                        {currentQ.title}
                    </h2>

                    {useHint && !isAnswered && (
                        <div className="bg-amber-50 p-4 rounded-2xl text-sm text-amber-800 mb-6 italic border border-amber-100 animate-in fade-in slide-in-from-top-2">
                            <strong>Dica:</strong> {currentQ.hint}
                        </div>
                    )}

                    {/* OPÇÕES (Só aparecem se NÃO estiver respondido) */}
                    {!isAnswered ? (
                        <div className="grid gap-3">
                            {['a', 'b', 'c', 'd'].map(opt => (
                                <button 
                                    key={opt} 
                                    onClick={() => handleAnswer(opt)} 
                                    className="w-full text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition-all font-semibold text-slate-700"
                                >
                                    <span className="text-purple-300 mr-3 uppercase">{opt})</span> 
                                    {currentQ[`option_${opt}`]}
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* FEEDBACK E BOTÃO PRÓXIMA (Aparece se responder agora OU se já estava respondido) */
                        <div className="mt-4 p-6 bg-slate-50 rounded-3xl text-center border border-slate-100 animate-in zoom-in-95 duration-300">
                            {/* Se acabou de responder, mostra se acertou. Se já estava respondido, mostra aviso. */}
                            {showExplanation ? (
                                <>
                                    <div className="text-5xl mb-4">{lastResult?.correct ? '🎉' : '❌'}</div>
                                    <h3 className={`text-xl font-black mb-2 uppercase ${lastResult?.correct ? 'text-green-600' : 'text-red-500'}`}>
                                        {lastResult?.correct ? 'Acertou!' : 'Ops! Não foi dessa vez'}
                                    </h3>
                                </>
                            ) : (
                                <div className="mb-4">
                                    <span className="text-[10px] font-black bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase">Concluído</span>
                                    <p className="text-slate-500 text-sm mt-3 font-medium">Você já respondeu este desafio anteriormente.</p>
                                </div>
                            )}

                            <p className="text-slate-600 text-sm mb-8 leading-relaxed italic">
                                {showExplanation ? lastResult?.explanation : currentQ.explanation}
                            </p>

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
                                className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold w-full hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all active:scale-95"
                            >
                                {currentIndex + 1 < questions.length ? 'Ir para a Próxima' : 'Finalizar Nível'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}