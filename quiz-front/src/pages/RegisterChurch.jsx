import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function RegisterChurch() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        church_name: '',
        name: '',
        email: '',
        password: ''
    });

    async function handleRegister(e) {
        e.preventDefault();
        try {
            // Chamada para o método registerChurch do seu Laravel
            const response = await api.post('/register-church', formData);
            
            alert("Igreja e Administrador cadastrados com sucesso!");
            
            // Após cadastrar, podemos mandar direto para o login 
            // ou já salvar o token e logar (o seu back retorna access_token)
            localStorage.setItem('@QuizIgreja:token', response.data.access_token);
            navigate('/admin/dashboard');
            
        } catch (err) {
            console.error(err.response?.data);
            alert(err.response?.data?.message || "Erro ao cadastrar igreja. Verifique os dados.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-purple-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1b264f]">Nova Paróquia</h1>
                    <p className="text-gray-500 mt-2 text-sm">Registe a sua igreja no sistema de acólitos.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Nome da Igreja/Paróquia</label>
                        <input 
                            type="text" 
                            required
                            className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 outline-none transition-all"
                            placeholder="Ex: Paróquia São José"
                            value={formData.church_name}
                            onChange={e => setFormData({...formData, church_name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Nome do Responsável (Admin)</label>
                        <input 
                            type="text" 
                            required
                            className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 outline-none transition-all"
                            placeholder="Seu nome completo"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">E-mail de Acesso</label>
                        <input 
                            type="email" 
                            required
                            className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 outline-none transition-all"
                            placeholder="exemplo@email.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Senha</label>
                        <input 
                            type="password" 
                            required
                            minLength="6"
                            className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button 
    onClick={() => navigate('/')}
    className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6"
>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    <span className="text-xs uppercase tracking-widest font-bold">Voltar ao Login</span>
</button>

                    <button 
                        type="submit" 
                        className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg mt-4"
                    >
                        Criar Conta Admin
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-purple-600 text-sm font-bold hover:underline">
                        Já tem conta? Faça Login
                    </Link>
                </div>
            </div>
        </div>
    );
}