import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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

    // CREATE ou UPDATE
    async function handleSubmit(e) {
        e.preventDefault();
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
        }
    }

    // DELETE
    async function handleDelete(id) {
        if (!window.confirm("Deseja realmente excluir esta pergunta?")) return;
        try {
            await api.delete(`/admin/questions/${id}`);
            fetchQuestions();
        } catch (err) {
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
        <div className="min-h-screen bg-gray-50 p-8" translate="no">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-500 mb-6">
                    ← Voltar ao Painel
                </button>
                
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Banco de Perguntas</h1>
                    <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold">
                        {showForm ? 'Cancelar' : '+ Nova Pergunta'}
                    </button>
                </header>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 mb-8">
                        <h2 className="text-purple-600 font-bold mb-4 uppercase text-xs">{editingId ? 'Editando Pergunta' : 'Nova Pergunta'}</h2>
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

                            <button className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg">{editingId ? 'Salvar Alterações' : 'Cadastrar Pergunta'}</button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {questions.map(q => (
                        <div key={q.id} className="bg-white p-5 rounded-xl border flex justify-between items-start">
                            <div>
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-black mr-2 uppercase text-xs">Nível {q.level}</span>
                                <p className="text-slate-700 font-bold mt-1">{q.title}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleEdit(q)} className="text-blue-500 font-bold text-xs">EDITAR</button>
                                <button onClick={() => handleDelete(q.id)} className="text-red-400 font-bold text-xs">EXCLUIR</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}