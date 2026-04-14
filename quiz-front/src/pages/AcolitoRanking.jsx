import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // IMPORTANTE
import api from '../services/api';

export default function AcolitoRanking() {
    const navigate = useNavigate(); // Inicializa o navigate
    const [data, setData] = useState({ church: '', ranking: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/ranking')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8" translate="no"> {/* translate="no" evita nomes mudarem */}
            <div className="max-w-2xl mx-auto">
                
                {/* BOTÃO VOLTAR - Z-index alto para garantir o clique */}
                <button 
                    onClick={() => navigate('/acolito/dashboard')}
                    className="relative z-50 flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold mb-6 transition-all cursor-pointer p-2 rounded-lg hover:bg-white shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar ao Painel
                </button>

                <header className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-800 uppercase italic">Hall da Fama</h1>
                    <p className="text-purple-600 font-bold">{data.church || 'Sua Paróquia'}</p>
                </header>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <p className="p-10 text-center text-gray-400 font-bold italic">Carregando placar...</p>
                    ) : (
                        data.ranking.map((user, index) => (
                            <div key={index} className="flex justify-between items-center p-6 border-b border-gray-50">
                                <div className="flex items-center gap-4">
                                    <span className="font-black text-slate-300">#{index + 1}</span>
                                    <span className="font-bold text-slate-700">{user.name}</span>
                                </div>
                                <span className="font-black text-purple-600">{user.points} pts</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}