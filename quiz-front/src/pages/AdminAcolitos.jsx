import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminAcolitos() {
    const navigate = useNavigate();
    const [acolitos, setAcolitos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [newName, setNewName] = useState(''); 
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('Senha123'); // Senha padrão sugerida

    async function fetchAcolitos() {
        try {
            const response = await api.get('/admin/dashboard'); 
            setAcolitos(response.data.data || []); 
        } catch (err) {
            console.error("Erro ao carregar lista.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateAcolito(e) {
        e.preventDefault();
        try {
            await api.post('/admin/acolytes', {
                name: newName,
                email: newEmail,
                password: newPassword,
            });
            alert("Cadastrado! A senha é: " + newPassword);
            setNewName(''); 
            setNewEmail('');
            setShowForm(false);
            fetchAcolitos(); 
        } catch (err) {
            alert("Erro ao cadastrar.");
        }
    }

    useEffect(() => { fetchAcolitos(); }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8" translate="no">
            <div className="max-w-6xl mx-auto">
                <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-all mb-6 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-semibold">Voltar ao Painel</span>
                </button>

                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Gestão de Acólitos</h1>
                    <button onClick={() => setShowForm(!showForm)} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold">
                        {showForm ? 'Fechar' : '+ Novo Acólito'}
                    </button>
                </header>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
                        <form onSubmit={handleCreateAcolito} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="Nome" className="border p-2 rounded" value={newName} onChange={e => setNewName(e.target.value)} required />
                            <input type="email" placeholder="E-mail" className="border p-2 rounded" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
                            <button className="bg-purple-600 text-white rounded font-bold">Salvar</button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">E-mail</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Senha p/ Acesso</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {acolitos.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 text-sm font-medium">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {/* Se for temporária, mostramos a senha padrão pra você copiar */}
                                        {user.must_change_password ? (
                                            <code className="bg-purple-50 text-purple-600 px-2 py-1 rounded font-bold text-xs">Senha123</code>
                                        ) : (
                                            <span className="text-gray-300 text-xs">Alterada pelo usuário</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${user.must_change_password ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                            {user.must_change_password ? 'Temporária' : 'Definitiva'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-purple-600 font-bold text-sm">Ver Progresso</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}