import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar o navigate
import api from '../services/api';
import Footer from '../components/Footer';

export default function AdminConfig() {
    const navigate = useNavigate(); // 2. Inicializar o hook
    const [manuals, setManuals] = useState([]);
    const [displayName, setDisplayName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [certificateEnabled, setCertificateEnabled] = useState(false);
    const [savingCertificate, setSavingCertificate] = useState(false);
    const [level, setLevel] = useState(1);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadManuals();
        loadCertificateStatus();
    }, []);

    async function loadCertificateStatus() {
        try {
            const response = await api.get(`/admin/dashboard?t=${Date.now()}`);
            setCertificateEnabled(Boolean(response.data.certificate_enabled));
        } catch (err) {
            console.error("Erro ao carregar status do certificado", err);
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

    async function handleUpload(e) {
        e.preventDefault();
        if (!selectedFile || !displayName) return alert("Preencha o nome e selecione um arquivo!");

        const formData = new FormData();
        formData.append('manual', selectedFile);
        formData.append('display_name', displayName);
        formData.append('level', level);

        setSaving(true);
        try {
            await api.post('/manuals', formData);
            alert("Manual adicionado com sucesso!");
            setDisplayName('');
            setSelectedFile(null);
            setLevel(1);
            loadManuals();
        } catch {
            alert("Erro ao subir manual.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Tem certeza que deseja excluir este manual?")) return;
        try {
            await api.delete(`/manuals/${id}`);
            setManuals(manuals.filter(m => m.id !== id));
        } catch {
            alert("Erro ao excluir.");
        }
    }

    async function handleToggleCertificate() {
        const nextValue = !certificateEnabled;
        setCertificateEnabled(nextValue);
        setSavingCertificate(true);

        try {
            const response = await api.put('/admin/church/toggle-certificate', {
                certificate_enabled: nextValue,
            });
            setCertificateEnabled(Boolean(response.data.certificate_enabled));
        } catch {
            setCertificateEnabled(!nextValue);
            alert("Erro ao atualizar a liberação do certificado.");
        } finally {
            setSavingCertificate(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col" translate="no">
            <div className="max-w-4xl w-full mx-auto p-8 flex-grow">
                {/* 3. BOTÃO VOLTAR ADICIONADO */}
            <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="flex items-center gap-2 text-gray-400 hover:text-slate-700 font-bold mb-6 transition-colors group"
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

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-bold text-gray-700 text-lg">Liberação de Certificados</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Controle se os acólitos que concluíram a formação podem baixar o certificado.
                    </p>
                </div>

                <button
                    type="button"
                    role="switch"
                    aria-checked={certificateEnabled}
                    disabled={savingCertificate}
                    onClick={handleToggleCertificate}
                    className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
                        certificateEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                            certificateEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                    />
                    <span className="sr-only">
                        {certificateEnabled ? 'Bloquear certificados' : 'Liberar certificados'}
                    </span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
                <h2 className="font-bold text-gray-700 mb-4 text-lg">Adicionar Novo Manual</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input 
                                type="text"
                                placeholder="Nome do Manual (Ex: Manual de Missa)"
                                className="w-full p-3 border rounded-xl outline-slate-500"
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                            />
                        </div>
                        <div className="sm:w-32">
                            <select 
                                className="w-full p-3 border rounded-xl outline-slate-500 bg-white"
                                value={level}
                                onChange={e => setLevel(Number(e.target.value))}
                            >
                                <option value="1">Nível 1</option>
                                <option value="2">Nível 2</option>
                                <option value="3">Nível 3</option>
                                <option value="4">Nível 4</option>
                                <option value="5">Nível 5</option>
                            </select>
                        </div>
                    </div>
                    <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={e => setSelectedFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-800 hover:file:bg-slate-100"
                    />
                    <button 
                        type="submit" 
                        disabled={saving}
                        className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-white flex items-center justify-center gap-2 ${
                            saving ? 'bg-slate-500 cursor-not-allowed opacity-80' : 'bg-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                            </>
                        ) : 'Atualizar Biblioteca'}
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
                                <span className="font-bold text-slate-700">
                                    {manual.display_name}
                                    <span className="ml-2 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                        Nível {manual.level || 1}
                                    </span>
                                </span>
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
            <Footer />
        </div>
    );
}
