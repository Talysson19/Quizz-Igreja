import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // IMPORTAÇÃO ADICIONADA
import api from '../services/api';

export default function AdminConfig() {
    const navigate = useNavigate(); // INSTÂNCIA ADICIONADA
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    async function handleUploadManual(e) {
        e.preventDefault();
        if (!selectedFile) return alert("Selecione um arquivo PDF primeiro.");

        const formData = new FormData();
        formData.append('manual', selectedFile);

        setUploading(true);
        try {
            await api.post('/admin/manual/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Manual atualizado com sucesso!");
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            alert("Erro ao subir o manual. Verifique o tamanho e o formato (PDF).");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-all mb-6 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-semibold">Voltar ao Painel</span>
                </button>
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Configurações da Paróquia</h1>
                    <p className="text-gray-500 text-sm">Gerencie a identidade da sua igreja e materiais de estudo.</p>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <section className="mb-10">
                        <h3 className="text-lg font-bold text-slate-700 mb-4">Manual de Instruções (PDF)</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Este arquivo ficará disponível para os acólitos estudarem antes do Quiz.
                        </p>
                        
                        <form onSubmit={handleUploadManual} className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-purple-300 transition-colors">
                                <input 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={e => setSelectedFile(e.target.files[0])}
                                    className="hidden" 
                                    id="manual-upload"
                                />
                                <label htmlFor="manual-upload" className="cursor-pointer">
                                    <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-xl">📄</span>
                                    </div>
                                    <span className="text-sm font-medium text-purple-600">
                                        {selectedFile ? selectedFile.name : 'Clique para selecionar o PDF'}
                                    </span>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all disabled:bg-gray-300"
                            >
                                {uploading ? 'Enviando...' : 'Atualizar Manual'}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}