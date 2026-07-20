import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoImg from '../logo-igreja.png';
import Footer from '../components/Footer';

export default function AcolitoDashboard() {
    const navigate = useNavigate();
    const userStorage = JSON.parse(localStorage.getItem('@QuizIgreja:user'));
    
    const [stats, setStats] = useState({
        user_name: userStorage?.name || 'Acólito',
        total_points: 0,
        total_questions_church: 0, 
        total_answered_user: 0,    
        certificate_enabled: false,
        levels_progress: [],
        streak_count: 0,
        rank_title: 'Aspirante',
        medals: []
    });

    const [loading, setLoading] = useState(true);
    const [downloadingCertificate, setDownloadingCertificate] = useState(false);

    async function loadAcolitoData() {
        try {
            const response = await api.get(`/user/progress?t=${Date.now()}`);
            setStats({
                user_name: response.data.user_name,
                total_points: response.data.total_points,
                total_questions_church: response.data.total_questions_church,
                total_answered_user: response.data.total_answered_user,
                certificate_enabled: Boolean(response.data.certificate_enabled),
                levels_progress: response.data.levels_progress,
                streak_count: response.data.streak_count || 0,
                rank_title: response.data.rank_title || 'Aspirante',
                medals: response.data.medals || []
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
        if (downloadingCertificate) return;
        setDownloadingCertificate(true);
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
            alert(err.response?.status === 403
                ? "O certificado ainda não foi liberado pela coordenação da sua igreja."
                : "Erro: Você precisa concluir todas as perguntas de todos os níveis primeiro!"
            );
        } finally {
            setDownloadingCertificate(false);
        }
    }

    async function handleDownloadManual(manualId, manualName, e) {
        e.stopPropagation();
        try {
            const response = await api.get(`/manuals/${manualId}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', manualName.endsWith('.pdf') ? manualName : `${manualName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            loadAcolitoData();
        } catch (err) {
            console.error("Erro ao baixar manual", err);
            alert("Não foi possível baixar o manual no momento.");
        }
    }

    const hasCompletedAllQuestions = stats.total_questions_church > 0 &&
                                     stats.total_answered_user >= stats.total_questions_church;
    const isCertificateReleased = hasCompletedAllQuestions && stats.certificate_enabled;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" translate="no">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Servir</h1>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quiz Litúrgico</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors">Sair</button>
            </nav>

            <main className="max-w-5xl mx-auto p-6">
                <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800">Olá, {stats.user_name}!</h2>
                        <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                            <span>⚜️</span> {stats.rank_title}
                        </p>
                    </div>
                    {stats.streak_count > 0 && (
                        <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-2xl flex items-center justify-center gap-2 self-center sm:self-auto shadow-sm animate-bounce">
                            <span className="text-xl">🔥</span>
                            <span className="text-sm font-black text-orange-600">{stats.streak_count} Dias de Ofensiva</span>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {/* PONTOS */}
                    <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-6 rounded-3xl shadow-lg text-white flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold uppercase opacity-80">Pontos</span>
                        <span className="text-4xl font-black">{stats.total_points}</span>
                    </div>

                    {/* RANKING */}
                    <div onClick={() => navigate('/acolito/ranking')} className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🏆</span>
                        <span className="font-bold text-sm text-slate-700">Ranking</span>
                    </div>

                    {/* CERTIFICADO DINÂMICO */}
                    {isCertificateReleased ? (
                        <div 
                            onClick={handleDownloadCertificate} 
                            className={`bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-3xl shadow-lg text-white flex flex-col items-center justify-center transition-all ${
                                downloadingCertificate ? 'opacity-80 cursor-wait' : 'cursor-pointer hover:scale-105'
                            }`}
                        >
                            {downloadingCertificate ? (
                                <>
                                    <svg className="animate-spin h-6 w-6 text-white mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-black text-sm uppercase tracking-tighter">Baixando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-2xl animate-bounce">🎓</span>
                                    <span className="font-black text-sm uppercase tracking-tighter">Certificado</span>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-100 p-6 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 opacity-70">
                            <span className="text-xl">🔒</span>
                            <span className="text-[10px] font-bold uppercase mt-1">
                                {hasCompletedAllQuestions
                                    ? 'Bloqueado pela coordenação'
                                    : `${stats.total_answered_user}/${stats.total_questions_church} Concluídas`
                                }
                            </span>
                        </div>
                    )}
                </div>

                {/* Quadro de Medalhas */}
                {stats.medals && stats.medals.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Medalhas Desbloqueadas</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {stats.medals.map(medal => (
                                <div 
                                    key={medal.id}
                                    className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                                        medal.unlocked 
                                            ? 'bg-white border-amber-200 shadow-sm' 
                                            : 'bg-slate-50 border-slate-100 opacity-50 select-none'
                                    }`}
                                    title={medal.description}
                                >
                                    <span className={`text-3xl mb-2 ${medal.unlocked ? '' : 'filter grayscale'}`}>{medal.icon}</span>
                                    <h4 className="font-bold text-xs text-slate-700 leading-tight">{medal.title}</h4>
                                    <span className="text-[9px] text-slate-400 mt-1">{medal.unlocked ? 'Desbloqueada' : 'Bloqueada'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Sua Jornada de Formação</h3>
                    
                    {loading ? (
                        <div className="text-center py-10 text-gray-400 font-medium animate-pulse">Carregando níveis...</div>
                    ) : (
                        stats.levels_progress.length > 0 ? (
                            stats.levels_progress.map((lvl, index) => {
                                // LÓGICA DE TRAVA LINEAR:
                                // 1. O Nível 1 (index 0) está sempre livre.
                                // 2. O Nível N só libera se o Nível N-1 estiver completo (is_completed === true).
                                const previousLevel = index > 0 ? stats.levels_progress[index - 1] : null;
                                const isLocked = index === 0 ? false : (previousLevel ? !previousLevel.is_completed : true);

                                return (
                                    <div 
                                        key={lvl.level}
                                        onClick={() => !isLocked && navigate(`/acolito/quiz/${lvl.level}`)}
                                        className={`bg-white p-7 rounded-3xl border-b-4 flex justify-between items-center transition-all ${
                                            isLocked 
                                            ? 'border-gray-200 opacity-60 cursor-not-allowed' 
                                            : 'border-slate-500 shadow-sm cursor-pointer hover:-translate-y-1 active:scale-[0.98]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${isLocked ? 'bg-gray-100 text-gray-400' : 'bg-slate-100 text-slate-700'}`}>
                                                {lvl.level}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-800">
                                                    {lvl.level === 1 ? 'Nível 1: Fundamentos' : 
                                                     lvl.level === 2 ? 'Nível 2: Mestre de Cerimônias' : 
                                                     `Nível ${lvl.level}: Formação Contínua`}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <p className="text-sm text-gray-400">
                                                        {isLocked 
                                                            ? `Bloqueado. Conclua o Nível ${lvl.level - 1} para liberar.` 
                                                            : lvl.is_completed 
                                                                ? '✅ Nível concluído!' 
                                                                : `${lvl.completed_questions} / ${lvl.total_questions} respondidas.`
                                                        }
                                                    </p>
                                                    {!isLocked && lvl.manual_id && (
                                                        <button
                                                            onClick={(e) => handleDownloadManual(lvl.manual_id, lvl.manual_name, e)}
                                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full transition-all border border-slate-200 flex items-center gap-1 shadow-sm"
                                                        >
                                                            📚 Baixar Manual de Estudo (PDF)
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-2xl font-black ${isLocked ? 'text-gray-300' : 'text-slate-600'}`}>
                                            {isLocked ? '🔒' : '→'}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white p-10 rounded-3xl text-center border border-gray-100 shadow-sm">
                                <p className="text-gray-400">Nenhuma pergunta disponível para sua paróquia ainda.</p>
                            </div>
                        )
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
