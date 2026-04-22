import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AcolitoDashboard() {
    const navigate = useNavigate();
    const userStorage = JSON.parse(localStorage.getItem('@QuizIgreja:user'));
    
    const [stats, setStats] = useState({
        user_name: userStorage?.name || 'Acólito',
        total_points: 0,
        total_questions_church: 0, // Total de perguntas que existem na igreja
        total_answered_user: 0,    // Total que o usuário já respondeu
        levels_progress: []        // Lista de níveis vinda do banco
    });

    const [loading, setLoading] = useState(true);

    async function loadAcolitoData() {
        try {
            // Chamada para a rota que atualizamos no QuestionController
            const response = await api.get('/user/progress');
            setStats({
                user_name: response.data.user_name,
                total_points: response.data.total_points,
                total_questions_church: response.data.total_questions_church,
                total_answered_user: response.data.total_answered_user,
                levels_progress: response.data.levels_progress
            });
        } catch (err) {
            console.error("Erro ao carregar progresso:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadAcolitoData(); }, []);

    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }

    async function handleDownloadCertificate() {
        try {
            const response = await api.get('/user/certificate', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificado_${stats.user_name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            // Erro dinâmico vindo do Laravel
            alert("Você ainda não concluiu todas as perguntas disponíveis!");
        }
    }

    // Regra do Certificado: Só libera se houver perguntas e ele respondeu TODAS
    const isCertificateReleased = stats.total_questions_church > 0 && 
                                 stats.total_answered_user >= stats.total_questions_church;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" translate="no">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-purple-700 uppercase tracking-tighter">Quizizz Igreja</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Área do Acólito</span>
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors">Sair</button>
            </nav>

            <main className="max-w-5xl mx-auto p-6">
                <header className="mb-8 text-center sm:text-left">
                    <h2 className="text-3xl font-extrabold text-slate-800">Olá, {stats.user_name}!</h2>
                    <p className="text-gray-500">Pronto para subir de nível no serviço do altar?</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {/* CARD PONTUAÇÃO */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-3xl shadow-lg text-white flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold uppercase opacity-80">Pontos</span>
                        <span className="text-4xl font-black">{stats.total_points}</span>
                    </div>

                    {/* CARD MANUAL */}
                    <div onClick={() => navigate('/acolito/manuais')} className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📚</span>
                        <span className="font-bold text-sm text-slate-700">Manuais</span>
                    </div>

                    {/* CARD RANKING */}
                    <div onClick={() => navigate('/acolito/ranking')} className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🏆</span>
                        <span className="font-bold text-sm text-slate-700">Ranking</span>
                    </div>

                    {/* CARD CERTIFICADO DINÂMICO */}
                    {isCertificateReleased ? (
                        <div onClick={handleDownloadCertificate} className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-3xl shadow-lg text-white flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all">
                            <span className="text-2xl animate-bounce">🎓</span>
                            <span className="font-black text-sm uppercase tracking-tighter">Certificado</span>
                        </div>
                    ) : (
                        <div className="bg-gray-100 p-6 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 opacity-70">
                            <span className="text-xl">🔒</span>
                            <span className="text-[10px] font-bold uppercase mt-1">
                                {stats.total_answered_user}/{stats.total_questions_church} Concluídas
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Selecione seu Desafio</h3>
                    
                    {loading ? (
                        <div className="text-center py-10 text-gray-400 font-medium">Carregando níveis...</div>
                    ) : (
                        stats.levels_progress.length > 0 ? (
                            stats.levels_progress.map((lvl) => {
                                // Lógica de Trava: Nível 1 livre, Nível 2 precisa de 50 pontos.
                                // Você pode adicionar regras para Nível 3, 4 etc aqui.
                                const isLocked = lvl.level === 2 && stats.total_points < 50;

                                return (
                                    <div 
                                        key={lvl.level}
                                        onClick={() => !isLocked && navigate(`/acolito/quiz/${lvl.level}`)}
                                        className={`bg-white p-7 rounded-3xl border-b-4 flex justify-between items-center transition-all ${
                                            isLocked 
                                            ? 'border-gray-200 opacity-60 cursor-not-allowed' 
                                            : 'border-purple-500 shadow-sm cursor-pointer hover:-translate-y-1 active:scale-[0.98]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${isLocked ? 'bg-gray-100 text-gray-400' : 'bg-purple-100 text-purple-600'}`}>
                                                {lvl.level}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-800">
                                                    {lvl.level === 1 ? 'Nível 1: Fundamentos' : 
                                                     lvl.level === 2 ? 'Nível 2: Mestre de Cerimônias' : 
                                                     `Nível ${lvl.level}: Desafio Avançado`}
                                                </h4>
                                                <p className="text-sm text-gray-400">
                                                    {isLocked ? 'Alcance 50 pontos para desbloquear.' : `${lvl.completed_questions} questões respondidas.`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-2xl font-black ${isLocked ? 'text-gray-300' : 'text-purple-500'}`}>
                                            {isLocked ? '🔒' : '→'}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white p-10 rounded-3xl text-center border border-gray-100">
                                <p className="text-gray-400">Nenhuma pergunta disponível no momento.</p>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}