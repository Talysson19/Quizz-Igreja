import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AcolitoDashboard() {
    const navigate = useNavigate();
    const userStorage = JSON.parse(localStorage.getItem('@QuizIgreja:user'));
    
    const [stats, setStats] = useState({
        user_name: userStorage?.name || 'Acólito',
        total_points: 0,
        levels_progress: []
    });

    const [loading, setLoading] = useState(true);

    async function loadAcolitoData() {
        try {
            // Rota que você criou no QuestionController.php (getProgress)
            const response = await api.get('/user/progress');
            setStats({
                user_name: response.data.user_name,
                total_points: response.data.total_points,
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

    async function handleDownloadManual() {
    try {
        // AJUSTE A ROTA AQUI:
        const response = await api.get('/user/manual', { responseType: 'blob' });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Nome que o arquivo terá ao baixar
        link.setAttribute('download', `Manual_Acolitos_${stats.church_name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove(); // Limpa o DOM
    } catch (err) {
        console.error(err);
        alert("O manual ainda não foi disponibilizado para sua paróquia.");
    }
}

    const level2Locked = stats.total_points < 50;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" translate="no">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-purple-700 uppercase tracking-tighter">Quizizz Igreja</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Área do Acólito</span>
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors">Sair</button>
            </nav>

            <main className="max-w-4xl mx-auto p-6">
                <header className="mb-8 text-center sm:text-left">
                    <h2 className="text-3xl font-extrabold text-slate-800">Olá, {stats.user_name}!</h2>
                    <p className="text-gray-500">Pronto para subir de nível no serviço do altar?</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-purple-200 text-white flex flex-col items-center justify-center">
                        <span className="text-xs font-bold uppercase opacity-80 mb-1">Sua Pontuação</span>
                        <span className="text-5xl font-black">{stats.total_points}</span>
                        <span className="text-xs mt-2 font-medium bg-white/20 px-3 py-1 rounded-full text-white uppercase tracking-tighter">Pontos Totais</span>
                    </div>

                    <div onClick={handleDownloadManual} className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group">
                        <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <span className="font-bold text-slate-700">Manual PDF</span>
                        <span className="text-[10px] text-gray-400 uppercase mt-1">Material de Estudo</span>
                    </div>

                    <div onClick={() => navigate('/acolito/ranking')} className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group">
                        <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-2.06 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946 2.06 3.42 3.42 0 010 4.606 3.42 3.42 0 00-1.946 2.06 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-2.06 3.42 3.42 0 010-4.606z" /></svg>
                        </div>
                        <span className="font-bold text-slate-700">Ranking</span>
                        <span className="text-[10px] text-gray-400 uppercase mt-1">Ver Colocação</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Selecione seu Desafio</h3>
                    
                    {/* CARD NÍVEL 1 */}
                    <div 
                        onClick={() => navigate('/acolito/quiz/1')}
                        className="bg-white p-8 rounded-3xl border-b-4 border-green-500 shadow-sm flex justify-between items-center cursor-pointer hover:-translate-y-1 transition-all"
                    >
                        <div>
                            <span className="text-[10px] font-black bg-green-100 text-green-600 px-3 py-1 rounded-full uppercase tracking-widest">Disponível</span>
                            <h4 className="text-xl font-bold text-slate-800 mt-2">Nível 1: Fundamentos</h4>
                            <p className="text-sm text-gray-500">Teste seus conhecimentos básicos sobre a Missa.</p>
                        </div>
                        <div className="text-green-500 font-black text-2xl">→</div>
                    </div>

                    {/* CARD NÍVEL 2 - COM TRAVA DE PONTOS */}
                    <div 
                        onClick={() => !level2Locked && navigate('/acolito/quiz/2')}
                        className={`bg-white p-8 rounded-3xl border-b-4 flex justify-between items-center transition-all ${level2Locked ? 'border-gray-300 opacity-60 cursor-not-allowed' : 'border-purple-500 shadow-sm cursor-pointer hover:-translate-y-1'}`}
                    >
                        <div>
                            {level2Locked ? (
                                <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 w-fit">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                    Bloqueado
                                </span>
                            ) : (
                                <span className="text-[10px] font-black bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase tracking-widest">Liberado</span>
                            )}
                            <h4 className="text-xl font-bold text-slate-800 mt-2">Nível 2: Mestre de Cerimônias</h4>
                            <p className="text-sm text-gray-500">
                                {level2Locked ? 'Alcance 50 pontos para desbloquear.' : 'Desafios avançados para acólitos experientes.'}
                            </p>
                        </div>
                        <div className={`font-black text-2xl ${level2Locked ? 'text-gray-300' : 'text-purple-500'}`}>
                            {level2Locked ? '🔒' : '→'}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}