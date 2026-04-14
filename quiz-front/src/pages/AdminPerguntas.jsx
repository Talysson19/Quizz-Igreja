import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminPerguntas() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        level: 1,
        title: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'a',
        hint: '',
        explanation: '' 
    });

    async function fetchQuestions() {
        try {
            const response = await api.get('/questions');
            setQuestions(response.data);
        } catch (err) {
            console.error("Erro ao buscar perguntas");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateQuestion(e) {
        e.preventDefault();
        try {
            await api.post('/admin/questions', formData);
            alert("Pergunta cadastrada com sucesso!");
            setShowForm(false);
            setFormData({ 
                level: 1, title: '', option_a: '', option_b: '', 
                option_c: '', option_d: '', correct_option: 'a', 
                hint: '', explanation: '' 
            });
            fetchQuestions();
        } catch (err) {
            console.error("Erro detalhado:", err.response?.data);
            alert("Erro ao salvar pergunta. Verifique se todos os campos estão preenchidos.");
        }
    }

    useEffect(() => { fetchQuestions(); }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8" translate="no">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-all mb-6 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-semibold">Voltar ao Painel</span>
                </button>
                
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Banco de Perguntas</h1>
                        <p className="text-gray-500 text-sm">Gerencie os desafios dos níveis 1 e 2.</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all shadow-md"
                    >
                        {showForm ? 'Fechar' : '+ Nova Pergunta'}
                    </button>
                </header>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 mb-8 animate-in slide-in-from-top duration-300">
                        <form onSubmit={handleCreateQuestion} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Enunciado</label>
                                <textarea required className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-purple-500" rows="2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['a', 'b', 'c', 'd'].map(opt => (
                                    <div key={opt}>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Opção {opt.toUpperCase()}</label>
                                        <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-purple-500" value={formData[`option_${opt}`]} onChange={e => setFormData({...formData, [`option_${opt}`]: e.target.value})} />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Correta</label>
                                    <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white" value={formData.correct_option} onChange={e => setFormData({...formData, correct_option: e.target.value})}>
                                        <option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nível</label>
                                    <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white" value={formData.level} onChange={e => setFormData({...formData, level: parseInt(e.target.value)})}>
                                        <option value="1">1</option><option value="2">2</option>
                                    </select>
                                </div>
                            </div>

                            {/* CAMPOS ADICIONADOS ABAIXO */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dica (Opcional)</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-purple-500" 
                                    placeholder="Ex: Pense na cor da esperança..."
                                    value={formData.hint} 
                                    onChange={e => setFormData({...formData, hint: e.target.value})} 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Explicação da Resposta</label>
                                <textarea 
                                    required 
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-purple-500" 
                                    rows="2" 
                                    placeholder="Explique por que esta é a alternativa correta..."
                                    value={formData.explanation} 
                                    onChange={e => setFormData({...formData, explanation: e.target.value})} 
                                />
                            </div>

                            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 shadow-lg transition-all">Salvar Pergunta</button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {loading ? <div className="text-center">Carregando...</div> : questions.map(q => (
                        <div key={q.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between">
                                <p className="text-slate-700 font-semibold">{q.title}</p>
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">NÍVEL {q.level}</span>
                            </div>
                            <p className="text-gray-400 text-xs mt-2 italic">{q.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}