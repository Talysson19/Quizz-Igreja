import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar o navigate
import api from '../services/api';

export default function AcolitoManuais() {
    const navigate = useNavigate(); // 2. Inicializar o hook
    const [manuals, setManuals] = useState([]);
    const [loading, setLoading] = useState(true);

    async function handleDownload(manualId, fileName) {
        try {
            const token = localStorage.getItem('token');

            const response = await api.get(`/manuals/${manualId}/download`, {
                responseType: 'blob', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}.pdf`); 
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Erro ao baixar o arquivo. Verifique se você ainda está logado.");
        }
    }

    async function loadManuals() {
        try {
            const response = await api.get('/manuals');
            setManuals(response.data);
        } catch (err) {
            console.error("Erro ao carregar manuais", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadManuals();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto" translate="no">
            {/* BOTÃO VOLTAR */}
            <button 
                onClick={() => navigate(-1)} // Volta para a tela anterior (Dashboard)
                className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-all mb-6 group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-semibold">Voltar ao Painel</span>
            </button>

            <header className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-black text-slate-800">Biblioteca de Manuais</h1>
                <p className="text-gray-500">Consulte as orientações da sua paróquia.</p>
            </header>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            ) : manuals.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <span className="text-5xl block mb-4">📚</span>
                    <h3 className="text-xl font-bold text-gray-700">Nenhum manual disponível</h3>
                    <p className="text-gray-400 mt-2">Sua paróquia ainda não disponibilizou materiais para download.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {manuals.map(manual => (
                        <div key={manual.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-100 p-3 rounded-xl text-2xl">📄</div>
                                <div>
                                    <h4 className="font-bold text-slate-700">{manual.display_name}</h4>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Formato: PDF</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDownload(manual.id, manual.display_name)}
                                className="bg-purple-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors active:scale-95 shadow-sm"
                            >
                                Baixar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}