import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('@QuizIgreja:user'));
    
    // Estado para armazenar os dados do backend
    const [stats, setStats] = useState({
        church_name: 'Carregando...',
        total_acolytes: 0
    });

    // Busca os dados assim que a tela abre
    useEffect(() => {
        async function loadDashboardData() {
            try {
                const response = await api.get('/admin/dashboard');
                // De acordo com o seu Controller: { church_name, total_acolytes, data }
                setStats({
                    church_name: response.data.church_name,
                    total_acolytes: response.data.total_acolytes
                });
            } catch (err) {
                console.error("Erro ao carregar dados do dashboard:", err);
            }
        }
        loadDashboardData();
    }, []);

    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans" translate="no">
            {/* Header ADM */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-purple-700">Quizizz Igreja</h1>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Painel Administrativo</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                        <p className="text-xs text-purple-600 font-semibold italic">{stats.church_name}</p>
                    </div>
                    <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-all">
                        Sair
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Painel do Coordenador</h2>
                    <p className="text-gray-500">Gerencie a **{stats.church_name}** e acompanhe os seus **{stats.total_acolytes}** acólitos.</p>
                </header>

                {/* Grid de Ações do ADM - Ajustado para 4 colunas em telas grandes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Card: Gestão de Acólitos */}
                    <div 
                        onClick={() => navigate('/admin/acolitos')}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4z" />
                             </svg>
                        </div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-800">Acólitos</h3>
                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{stats.total_acolytes}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Cadastre novos jovens e gerencie acessos.</p>
                    </div>

                    {/* Card: Banco de Perguntas */}
                    <div 
                        onClick={() => navigate('/admin/perguntas')}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="bg-green-100 text-green-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Banco de Perguntas</h3>
                        <p className="text-sm text-gray-500 mt-2">Crie novas questões para os níveis 1 e 2.</p>
                    </div>

                    {/* NOVO CARD: Ranking da Igreja */}
                    <div 
                        onClick={() => navigate('/admin/ranking')}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="bg-amber-100 text-amber-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Ranking Geral</h3>
                        <p className="text-sm text-gray-500 mt-2">Acompanhe os melhores colocados da paróquia.</p>
                    </div>

                    {/* Card: Configurar Paróquia / Manual */}
                    <div 
                        onClick={() => navigate('/admin/config')}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="bg-gray-100 text-gray-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Manual e Igreja</h3>
                        <p className="text-sm text-gray-500 mt-2">Suba o manual em PDF e altere dados da paróquia.</p>
                    </div>

                </div>
            </main>
        </div>
    );
}