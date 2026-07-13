import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';

export default function AdminDetalhamentoAcolito() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get(`/admin/acolytes/${id}/progress?t=${Date.now()}`).then(res => setData(res.data));
    }, [id]);

    if (!data) return <div className="p-10 text-center text-gray-400 italic animate-pulse">Carregando evolução...</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col" translate="no">
            <div className="max-w-3xl w-full mx-auto p-6 sm:p-8 flex-grow space-y-6">
                <button onClick={() => navigate(-1)} className="text-slate-500 font-bold hover:text-slate-700 transition-colors flex items-center gap-1">
                    ← Voltar para Lista
                </button>
                
                {/* Perfil & Ranks */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Evolução do Acólito</span>
                        <h2 className="text-2xl font-black text-slate-800">{data.user_name}</h2>
                        <p className="text-xs text-slate-400 font-medium mt-1">{data.email}</p>
                        <p className="text-sm font-semibold text-slate-500 mt-2 flex items-center gap-1">
                            <span>⚜️ Patente:</span> <span className="text-slate-700 font-bold">{data.rank_title}</span>
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-slate-800 text-white px-5 py-3 rounded-2xl flex flex-col items-center justify-center min-w-24 shadow">
                            <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">Pontos</span>
                            <span className="text-2xl font-black">{data.total_points}</span>
                        </div>
                        {data.streak_count > 0 && (
                            <div className="bg-orange-50 border border-orange-200 text-orange-600 px-5 py-3 rounded-2xl flex flex-col items-center justify-center min-w-24 shadow-sm">
                                <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">Ofensiva</span>
                                <span className="text-2xl font-black flex items-center gap-1">🔥 {data.streak_count}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quadro de Medalhas */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">Medalhas e Conquistas</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {data.medals && data.medals.map(medal => (
                            <div 
                                key={medal.id}
                                className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                                    medal.unlocked 
                                        ? 'bg-white border-amber-200 shadow-sm' 
                                        : 'bg-slate-50 border-slate-100 opacity-40 select-none'
                                }`}
                                title={medal.description}
                            >
                                <span className={`text-3xl mb-2 ${medal.unlocked ? '' : 'filter grayscale'}`}>{medal.icon}</span>
                                <h4 className="font-bold text-xs text-slate-700 leading-tight">{medal.title}</h4>
                                <span className="text-[8px] text-slate-400 mt-1 uppercase font-bold">{medal.unlocked ? 'Desbloqueada' : 'Bloqueada'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desempenho por Nível */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h3 className="font-bold text-slate-800 text-lg">Desempenho da Trilha de Ensino</h3>
                    {data.levels_progress && data.levels_progress.length === 0 ? (
                        <p className="text-gray-400 italic">Nenhum nível cadastrado na paróquia.</p>
                    ) : (
                        <div className="space-y-4">
                            {data.levels_progress.map(level => {
                                const percent = level.total_questions > 0 
                                    ? Math.round((level.completed_questions / level.total_questions) * 100) 
                                    : 0;
                                return (
                                    <div key={level.level} className="p-5 border rounded-2xl hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-700">Nível {level.level}</h4>
                                                <p className="text-xs text-gray-400">
                                                    {level.level === 1 ? 'Fundamentos' : level.level === 2 ? 'Mestre de Cerimônias' : 'Formação Contínua'}
                                                </p>
                                            </div>
                                            <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-black">
                                                {level.completed_questions} / {level.total_questions} respondidas ({percent}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-500 ${level.is_completed ? 'bg-green-500' : 'bg-slate-700'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}