import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
        <div className="min-h-screen bg-gray-50 p-8" translate="no">
            <div className="max-w-2xl mx-auto">
                <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-all mb-6 group p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-semibold">Voltar ao Painel</span>
                </button>

                <header className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-800 uppercase italic">Ranking de Acólitos</h1>
                    <p className="text-purple-600 font-bold">{data.church || 'Sua Paróquia'}</p>
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
                            <div key={index} className={`flex justify-between items-center p-6 border-b border-gray-50 ${index === 0 ? 'bg-amber-50/50' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                                        index === 0 ? 'bg-amber-400 text-white shadow-md' : 
                                        index === 1 ? 'bg-slate-300 text-white' :
                                        index === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-bold text-slate-700">{user.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Acólito</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-black text-purple-600 text-lg">{user.points}</span>
                                    <span className="text-[10px] text-purple-400 font-bold uppercase ml-1">pts</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}