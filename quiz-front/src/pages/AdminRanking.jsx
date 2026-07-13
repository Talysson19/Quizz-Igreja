import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';

export default function AdminRanking() {
    const navigate = useNavigate();
    const [data, setData] = useState({ church: '', ranking: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // AJUSTE DA ROTA: Removido o '/acolytes' para bater com o seu api.php
        api.get('/ranking')
            .then(res => {
                console.log("Ranking recebido pelo Admin:", res.data);
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro no ranking do admin:", err.response);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col" translate="no">
            <div className="max-w-2xl w-full mx-auto p-8 flex-grow">
                <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-slate-700 transition-all mb-6 group p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-semibold">Voltar ao Painel</span>
                </button>

                <header className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-800 uppercase italic">Ranking de Acólitos</h1>
                    <p className="text-slate-700 font-bold">{data.church || 'Sua Paróquia'}</p>
                </header>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <p className="p-10 text-center text-gray-400 font-bold animate-pulse">Carregando ranking...</p>
                    ) : data.ranking.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-gray-400">Nenhum acólito pontuou ainda nesta paróquia.</p>
                        </div>
                    ) : (
                        data.ranking.map((user, index) => (
                            <div key={index} className={`flex justify-between items-center p-6 border-b border-gray-50 ${index === 0 ? 'bg-amber-50/30' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <span className="font-black text-lg w-8 text-center">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </span>
                                    <div>
                                        <p className="font-bold text-slate-700">{user.name}</p>
                                        <p className="text-[9px] text-slate-400 font-semibold uppercase">{user.rank_title}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-black text-slate-700 text-lg">{user.points}</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase ml-1">pts</span>
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