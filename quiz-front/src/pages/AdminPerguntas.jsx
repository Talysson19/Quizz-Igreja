import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';

export default function AdminPerguntas() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null); // Para saber se estamos editando

    const initialForm = {
        level: 1,
        title: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'a',
        hint: '',
        explanation: '' 
    };

    const [formData, setFormData] = useState(initialForm);
    const [activeFilter, setActiveFilter] = useState('all');
    const [saving, setSaving] = useState(false);

    async function fetchQuestions() {
        try {
            const response = await api.get('/questions');
            setQuestions(response.data);
        } catch (err) {
            console.error("Erro ao buscar perguntas", err);
        } finally {
            setLoading(false);
        }
    }

    // CREATE ou UPDATE
    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await api.put(`/admin/questions/${editingId}`, formData);
                alert("Pergunta atualizada!");
            } else {
                await api.post('/admin/questions', formData);
                alert("Pergunta cadastrada!");
            }
            
            resetForm();
            fetchQuestions();
        } catch (err) {
            alert(err.response?.data?.error || "Erro ao salvar pergunta.");
        } finally {
            setSaving(false);
        }
    }

    // DELETE
    async function handleDelete(id) {
        if (!window.confirm("Deseja realmente excluir esta pergunta?")) return;
        try {
            await api.delete(`/admin/questions/${id}`);
            fetchQuestions();
        } catch {
            alert("Erro ao excluir.");
        }
    }

    function handleEdit(q) {
        setEditingId(q.id);
        setFormData({
            level: q.level,
            title: q.title,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option,
            hint: q.hint,
            explanation: q.explanation
        });
        setShowForm(true);
        window.scrollTo(0, 0); // Sobe a tela para o form
    }

    function resetForm() {
        setFormData(initialForm);
        setEditingId(null);
        setShowForm(false);
    }

    useEffect(() => { fetchQuestions(); }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col" translate="no">
            <div className="max-w-4xl w-full mx-auto p-8 flex-grow">
                <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-500 mb-6">
                    ← Voltar ao Painel
                </button>
                
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Banco de Perguntas</h1>
                    <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="bg-slate-700 text-white px-6 py-2 rounded-lg font-bold">
                        {showForm ? 'Cancelar' : '+ Nova Pergunta'}
                    </button>
                </header>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 mb-8">
                        <h2 className="text-slate-700 font-bold mb-4 uppercase text-xs">{editingId ? 'Editando Pergunta' : 'Nova Pergunta'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea placeholder="Enunciado" className="w-full border p-2 rounded" rows="2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            
                            <div className="grid grid-cols-2 gap-4">
                                {['a', 'b', 'c', 'd'].map(opt => (
                                    <input key={opt} type="text" placeholder={`Opção ${opt.toUpperCase()}`} className="border p-2 rounded" value={formData[`option_${opt}`]} onChange={e => setFormData({...formData, [`option_${opt}`]: e.target.value})} required />
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-400 font-bold">CORRETA</label>
                                    <select className="w-full border p-2 rounded" value={formData.correct_option} onChange={e => setFormData({...formData, correct_option: e.target.value})}>
                                        <option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-400 font-bold">NÍVEL</label>
                                    <input type="number" className="w-full border p-2 rounded" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
                                </div>
                            </div>

                            <input type="text" placeholder="Dica (opcional)" className="w-full border p-2 rounded" value={formData.hint} onChange={e => setFormData({...formData, hint: e.target.value})} />
                            <textarea placeholder="Explicação" className="w-full border p-2 rounded" rows="2" value={formData.explanation} onChange={e => setFormData({...formData, explanation: e.target.value})} required />

                             <button 
                                 type="submit"
                                 disabled={saving}
                                 className={`w-full text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                     saving ? 'bg-slate-500 cursor-not-allowed opacity-80' : 'bg-slate-700 hover:bg-slate-800'
                                 }`}
                             >
                                 {saving ? (
                                     <>
                                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                         </svg>
                                         {editingId ? 'Salvando...' : 'Cadastrando...'}
                                     </>
                                 ) : (
                                     editingId ? 'Salvar Alterações' : 'Cadastrar Pergunta'
                                 )}
                             </button>
                         </form>
                    </div>
                )}

                {/* Filtro por Nível */}
                {!loading && (
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button 
                            onClick={() => setActiveFilter('all')} 
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                activeFilter === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white border text-slate-600 hover:bg-gray-50'
                            }`}
                        >
                            Todas ({questions.length})
                        </button>
                        {[1, 2, 3, 4, 5].map(lvl => {
                            const count = questions.filter(q => q.level === lvl).length;
                            return (
                                <button 
                                    key={lvl}
                                    onClick={() => setActiveFilter(String(lvl))} 
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                        activeFilter === String(lvl) ? 'bg-slate-700 text-white shadow-sm' : 'bg-white border text-slate-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Nível {lvl} ({count})
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="space-y-4">
                    {loading ? (
                        <p className="bg-white p-6 rounded-xl border text-gray-400 italic">Carregando perguntas...</p>
                    ) : (
                        (activeFilter === 'all' ? questions : questions.filter(q => q.level === Number(activeFilter))).map(q => (
                            <div key={q.id} className="bg-white p-5 rounded-xl border flex justify-between items-start shadow-sm">
                                <div>
                                    <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-black mr-2 uppercase text-xs">Nível {q.level}</span>
                                    <p className="text-slate-700 font-bold mt-1">{q.title}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleEdit(q)} className="text-blue-500 font-bold text-xs uppercase hover:underline">EDITAR</button>
                                    <button onClick={() => handleDelete(q.id)} className="text-red-400 font-bold text-xs uppercase hover:underline">EXCLUIR</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
