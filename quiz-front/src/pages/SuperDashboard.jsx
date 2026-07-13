import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoImg from '../logo-igreja.png';
import Footer from '../components/Footer';

export default function SuperDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('@QuizIgreja:user'));

    const [churches, setChurches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [churchName, setChurchName] = useState('');
    const [coordinatorName, setCoordinatorName] = useState('');
    const [coordinatorEmail, setCoordinatorEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Drill down state
    const [selectedChurch, setSelectedChurch] = useState(null);
    const [acolytes, setAcolytes] = useState([]);
    const [loadingAcolytes, setLoadingAcolytes] = useState(false);

    useEffect(() => {
        loadChurches();
    }, []);

    async function loadChurches() {
        try {
            setLoading(true);
            const response = await api.get('/super/churches');
            setChurches(response.data || []);
        } catch (err) {
            console.error("Erro ao buscar igrejas:", err);
            alert("Erro ao carregar lista de igrejas.");
        } finally {
            setLoading(false);
        }
    }

    async function handleRegisterChurch(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/super/churches', {
                church_name: churchName,
                coordinator_name: coordinatorName,
                coordinator_email: coordinatorEmail
            });
            alert("Igreja e coordenador cadastrados com sucesso! A senha temporária é: Senha123");
            setChurchName('');
            setCoordinatorName('');
            setCoordinatorEmail('');
            loadChurches();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Erro ao cadastrar igreja.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleViewAcolytes(church) {
        setSelectedChurch(church);
        setLoadingAcolytes(true);
        try {
            const response = await api.get(`/super/churches/${church.id}/acolytes`);
            setAcolytes(response.data || []);
        } catch (err) {
            console.error(err);
            alert("Erro ao carregar acólitos da paróquia.");
        } finally {
            setLoadingAcolytes(false);
        }
    }

    async function handleDeleteAcolyte(acolyteId) {
        if (!window.confirm("Deseja realmente excluir este acólito?")) return;
        try {
            await api.delete(`/super/users/${acolyteId}`);
            alert("Acólito excluído com sucesso!");
            if (selectedChurch) {
                handleViewAcolytes(selectedChurch);
            }
            loadChurches();
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir acólito.");
        }
    }

    async function handleDeleteChurch(churchId) {
        if (!window.confirm("ATENÇÃO: Excluir esta paróquia removerá todos os acólitos, coordenadores, manuais e perguntas vinculadas a ela de forma definitiva. Deseja continuar?")) return;
        try {
            await api.delete(`/super/churches/${churchId}`);
            alert("Paróquia e todos os dados vinculados excluídos!");
            if (selectedChurch?.id === churchId) {
                setSelectedChurch(null);
                setAcolytes([]);
            }
            loadChurches();
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir paróquia.");
        }
    }

    async function handleResetCoordinatorPassword(coordinatorId) {
        if (!window.confirm("Deseja resetar a senha deste coordenador para a padrão (Senha123)?")) return;
        try {
            const response = await api.post('/super/reset-coordinator-password', {
                coordinator_id: coordinatorId
            });
            alert(response.data.message || "Senha resetada!");
        } catch (err) {
            console.error(err);
            alert("Erro ao resetar senha.");
        }
    }

    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }

    // Cálculos de Estatísticas
    const totalAcolytesGlobal = churches.reduce((sum, c) => sum + (c.total_acolytes || 0), 0);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" translate="no">
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tighter leading-none">Servir</h1>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Painel Administrador Geral</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-slate-700 hidden sm:inline">{user?.email}</span>
                    <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-all">
                        Sair
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Cabeçalho */}
                <header>
                    <h2 className="text-3xl font-extrabold text-slate-800">Olá, Administrador!</h2>
                    <p className="text-gray-500">Gerencie todas as paróquias cadastradas no ecossistema.</p>
                </header>

                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-6 rounded-3xl shadow-md text-white flex flex-col items-center justify-center py-8">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-85">Total de Paróquias</span>
                        <span className="text-5xl font-black mt-2">{churches.length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-8">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Acólitos Cadastrados</span>
                        <span className="text-5xl font-black text-slate-800 mt-2">{totalAcolytesGlobal}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cadastrar Nova Igreja */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
                        <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Cadastrar Nova Paróquia</h3>
                        <form onSubmit={handleRegisterChurch} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Nome da Paróquia</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-500 outline-none transition-all text-sm"
                                    placeholder="Ex: Paróquia São João Batista"
                                    value={churchName}
                                    onChange={e => setChurchName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Nome do Coordenador (Admin)</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-500 outline-none transition-all text-sm"
                                    placeholder="Ex: Marcos Silva"
                                    value={coordinatorName}
                                    onChange={e => setCoordinatorName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">E-mail do Coordenador</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-500 outline-none transition-all text-sm"
                                    placeholder="coordenador@email.com"
                                    value={coordinatorEmail}
                                    onChange={e => setCoordinatorEmail(e.target.value)}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:bg-slate-300 mt-2 text-sm"
                            >
                                {submitting ? 'Cadastrando...' : 'Cadastrar Paróquia'}
                            </button>
                        </form>
                    </div>

                    {/* Lista de Igrejas */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Paróquias Cadastradas</h3>
                        
                        {loading ? (
                            <p className="text-slate-400 italic py-10 text-center animate-pulse">Carregando paróquias...</p>
                        ) : churches.length === 0 ? (
                            <p className="text-slate-400 text-center py-10">Nenhuma paróquia cadastrada no sistema.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase">Paróquia</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase">Coordenador</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase text-center">Acólitos</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {churches.map(c => (
                                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-4 font-bold text-slate-800">{c.name}</td>
                                                <td className="px-4 py-4">
                                                    <p className="font-semibold text-slate-700">{c.coordinator_name}</p>
                                                    <p className="text-xs text-slate-400">{c.coordinator_email}</p>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <button 
                                                        onClick={() => handleViewAcolytes(c)}
                                                        className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full font-bold text-xs hover:bg-slate-100 transition-colors"
                                                    >
                                                        {c.total_acolytes} Ver
                                                    </button>
                                                </td>
                                                <td className="px-4 py-4 text-right space-x-2">
                                                    {c.coordinator_id && (
                                                        <button 
                                                            onClick={() => handleResetCoordinatorPassword(c.coordinator_id)}
                                                            className="text-amber-600 hover:text-amber-800 font-bold text-xs uppercase"
                                                            title="Resetar Senha do Coordenador"
                                                        >
                                                            Resetar Senha
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDeleteChurch(c.id)}
                                                        className="text-red-500 hover:text-red-700 font-bold text-xs uppercase"
                                                        title="Excluir Paróquia"
                                                    >
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sub-view: Acólitos da Paróquia Selecionada */}
                {selectedChurch && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                                    Acólitos: {selectedChurch.name}
                                </h3>
                                <p className="text-xs text-slate-400">Gerencie a lista de jovens desta paróquia.</p>
                            </div>
                            <button 
                                onClick={() => setSelectedChurch(null)}
                                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase border border-slate-200 px-3 py-1 rounded-xl"
                            >
                                Fechar Lista
                            </button>
                        </div>

                        {loadingAcolytes ? (
                            <p className="text-slate-400 italic py-8 text-center animate-pulse">Carregando acólitos...</p>
                        ) : acolytes.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">Nenhum acólito cadastrado nesta paróquia.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase">Nome</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase">E-mail</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase text-center">Pontos</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {acolytes.map(a => (
                                            <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-4 font-bold text-slate-800">{a.name}</td>
                                                <td className="px-4 py-4 text-slate-600">{a.email}</td>
                                                <td className="px-4 py-4 text-center font-black text-slate-700">{a.points}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleDeleteAcolyte(a.id)}
                                                        className="text-red-400 hover:text-red-600 font-bold text-xs uppercase"
                                                    >
                                                        Excluir Acólito
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
