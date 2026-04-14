import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDetalhamentoAcolito() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get(`/admin/acolytes/${id}/progress`).then(res => setData(res.data));
    }, [id]);

    if (!data) return <div className="p-10 text-center">Carregando detalhes...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="text-gray-500 font-bold mb-6 italic">← Voltar para Lista</button>
                
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black text-slate-800 mb-2">{data.user_name}</h2>
                    <p className="text-purple-600 font-bold mb-8">{data.total_points} Pontos Acumulados</p>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-400 uppercase text-xs">Desempenho por Nível</h3>
                        {data.levels_progress.length === 0 ? (
                            <p className="text-gray-400 italic">Este acólito ainda não respondeu nenhuma pergunta.</p>
                        ) : (
                            data.levels_progress.map(level => (
                                <div key={level.level} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <span className="font-bold text-slate-700">Nível {level.level}</span>
                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-black">
                                        {level.completed_questions} Perguntas Concluídas
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}