import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar o navigate
import api from '../services/api';

export default function AdminConfig() {
    const navigate = useNavigate(); // 2. Inicializar o hook
    const [manuals, setManuals] = useState([]);
    const [displayName, setDisplayName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadManuals();
    }, []);

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

    async function handleUpload(e) {
        e.preventDefault();
        if (!selectedFile || !displayName) return alert("Preencha o nome e selecione um arquivo!");

        const formData = new FormData();
        formData.append('manual', selectedFile);
        formData.append('display_name', displayName);

        try {
            await api.post('/manuals', formData);
            alert("Manual adicionado com sucesso!");
            setDisplayName('');
            setSelectedFile(null);
            loadManuals();
        } catch (err) {
            alert("Erro ao subir manual.");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Tem certeza que deseja excluir este manual?")) return;
        try {
            await api.delete(`/manuals/${id}`);
            setManuals(manuals.filter(m => m.id !== id));
        } catch (err) {
            alert("Erro ao excluir.");
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto" translate="no">
            {/* 3. BOTÃO VOLTAR ADICIONADO */}
            <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="flex items-center gap-2 text-gray-400 hover:text-purple-600 font-bold mb-6 transition-colors group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar ao Painel
            </button>

            <header className="mb-8">
                <h1 className="text-3xl font-black text-slate-800">Configurações da Paróquia</h1>
                <p className="text-gray-500">Gerencie a biblioteca de manuais para os acólitos.</p>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
                <h2 className="font-bold text-gray-700 mb-4 text-lg">Adicionar Novo Manual</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <input 
                        type="text"
                        placeholder="Nome do Manual (Ex: Manual de Missa)"
                        className="w-full p-3 border rounded-xl outline-purple-500"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                    />
                    <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={e => setSelectedFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md active:scale-95">
                        Atualizar Biblioteca
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <h2 className="p-6 font-bold text-gray-700 border-b border-gray-50">Manuais Disponíveis</h2>
                {loading ? (
                    <p className="p-6 text-gray-400 italic">Carregando biblioteca...</p>
                ) : manuals.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                        <span className="text-4xl block mb-2">📂</span>
                        <p>Nenhum manual cadastrado.</p>
                    </div>
                ) : (
                    manuals.map(manual => (
                        <div key={manual.id} className="flex justify-between items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📄</span>
                                <span className="font-bold text-slate-700">{manual.display_name}</span>
                            </div>
                            <button 
                                onClick={() => handleDelete(manual.id)}
                                className="text-red-400 hover:text-red-600 font-bold p-2 text-xs uppercase tracking-widest transition-colors"
                            >
                                Excluir
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}