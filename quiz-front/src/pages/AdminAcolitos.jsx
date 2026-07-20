import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';

export default function AdminAcolitos() {
    const navigate = useNavigate();
    const [acolitos, setAcolitos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // States para Criação/Edição
    const [editingAcolito, setEditingAcolito] = useState(null);
    const [newName, setNewName] = useState(''); 
    const [newEmail, setNewEmail] = useState('');
    const [newPassword] = useState('Senha123');
    const [saving, setSaving] = useState(false);

    async function fetchAcolitos() {
        try {
            const response = await api.get(`/admin/dashboard?t=${Date.now()}`);
            setAcolitos(response.data.data || []); 
        } catch (err) {
            console.error("Erro ao carregar lista.", err);
        } finally {
            setLoading(false);
        }
    }

    // CREATE / UPDATE
    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingAcolito) {
                // Lógica de Edição
                await api.put(`/admin/acolytes/${editingAcolito.id}`, {
                    name: newName,
                    email: newEmail,
                });
                alert("Acólito atualizado!");
            } else {
                // Lógica de Criação
                await api.post('/admin/acolytes', {
                    name: newName,
                    email: newEmail,
                    password: newPassword,
                });
                alert("Cadastrado! A senha é: " + newPassword);
            }
            
            resetForm();
            fetchAcolitos(); 
        } catch (err) {
            alert(err.response?.data?.error || "Erro ao salvar.");
        } finally {
            setSaving(false);
        }
    }

    // DELETE
    async function handleDelete(id) {
        if (!window.confirm("Tem certeza que deseja remover este acólito da paróquia?")) return;
        
        try {
            await api.delete(`/admin/acolytes/${id}`);
            alert("Acólito removido!");
            fetchAcolitos();
        } catch {
            alert("Erro ao excluir.");
        }
    }

    async function handleResetPassword(id) {
        if (!window.confirm("Tem certeza que deseja resetar a senha deste acólito para a padrão (Senha123)?")) return;
        try {
            const response = await api.post('/admin/reset-acolyte-password', {
                acolyte_id: id
            });
            alert(response.data.message || "Senha resetada com sucesso!");
            fetchAcolitos();
        } catch (err) {
            console.error(err);
            alert("Erro ao resetar senha.");
        }
    }

    function handleEdit(user) {
        setEditingAcolito(user);
        setNewName(user.name);
        setNewEmail(user.email);
        setShowForm(true);
    }

    function resetForm() {
        setNewName('');
        setNewEmail('');
        setEditingAcolito(null);
        setShowForm(false);
    }

    useEffect(() => { fetchAcolitos(); }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col" translate="no">
            <div className="max-w-6xl w-full mx-auto p-8 flex-grow">
                <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-slate-700 transition-all mb-6 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-semibold">Voltar ao Painel</span>
                </button>

                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Gestão de Acólitos</h1>
                    <button 
                        onClick={() => { showForm ? resetForm() : setShowForm(true) }} 
                        className={`${showForm ? 'bg-gray-400' : 'bg-slate-700'} text-white px-6 py-2 rounded-lg font-bold transition-colors`}
                    >
                        {showForm ? 'Cancelar' : '+ Novo Acólito'}
                    </button>
                </header>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-slate-200">
                        <h2 className="text-sm font-bold text-slate-700 uppercase mb-4">
                            {editingAcolito ? 'Editar Acólito' : 'Novo Cadastro'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="Nome" className="border p-2 rounded" value={newName} onChange={e => setNewName(e.target.value)} required />
                            <input type="email" placeholder="E-mail" className="border p-2 rounded" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
                            <button 
                                type="submit"
                                disabled={saving}
                                className={`text-white rounded font-bold transition-all flex items-center justify-center gap-2 py-2 px-4 ${
                                    saving ? 'bg-slate-500 cursor-not-allowed opacity-80' : 'bg-slate-700 hover:bg-slate-800'
                                }`}
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {editingAcolito ? 'Salvando...' : 'Cadastrando...'}
                                    </>
                                ) : (
                                    editingAcolito ? 'Salvar Alterações' : 'Cadastrar'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-gray-400 italic">Carregando acólitos...</p>
                    ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Nome / E-mail</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Senha</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {acolitos.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-700">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.must_change_password ? (
                                            <code className="bg-slate-50 text-slate-700 px-2 py-1 rounded font-bold text-xs">Senha123</code>
                                        ) : (
                                            <span className="text-gray-300 text-xs italic">Alterada</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${user.must_change_password ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                            {user.must_change_password ? 'Temporária' : 'Definitiva'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button 
                                            onClick={() => navigate(`/admin/acolitos/${user.id}/progress`)}
                                            className="text-slate-700 hover:text-slate-900 font-bold text-xs uppercase"
                                        >
                                            Progresso
                                        </button>
                                        <button 
                                            onClick={() => handleResetPassword(user.id)}
                                            className="text-amber-600 hover:text-amber-700 font-bold text-xs uppercase"
                                        >
                                            Resetar Senha
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(user)}
                                            className="text-blue-500 hover:text-blue-700 font-bold text-xs uppercase"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-400 hover:text-red-600 font-bold text-xs uppercase"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
