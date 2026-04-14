import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await api.post('/login', { email, password });
            
            const { access_token, role, must_change_password, message } = response.data;

            localStorage.setItem('@QuizIgreja:token', access_token);

            const userData = {
                name: name,
                email: email,
                role: role,
                must_change_password: must_change_password
            };
            localStorage.setItem('@QuizIgreja:user', JSON.stringify(userData));

            alert(message || "Login realizado com sucesso!");

            // Lógica de Redirecionamento Corrigida
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                if (must_change_password) {
                    navigate('/change-password');
                } else {
                    // Agora aponta para a rota oficial do acólito
                    navigate('/acolito/dashboard');
                }
            }

        } catch (err) {
            console.error("Erro detalhado:", err.response?.data);
            alert('Falha no login. Verifique se o e-mail e senha estão corretos.');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" translate="no">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1b264f]">Quizizz Igreja</h1>
                    <p className="text-gray-400 mt-2 font-medium">Área de Acesso</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider italic">
                            E-mail de Acesso
                        </label>
                        <input 
                            type="email" 
                            required
                            className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-sm"
                            placeholder="exemplo@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider italic">
                            Senha
                        </label>
                        <input 
                            type="password" 
                            required
                            className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95"
                    >
                        Entrar no Portal
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-gray-400 text-xs mb-2">Sua paróquia ainda não está no sistema?</p>
                    <Link 
                        to="/register-church" 
                        className="text-purple-600 text-sm font-bold hover:text-purple-800 transition-colors underline decoration-purple-200 underline-offset-4"
                    >
                        Cadastrar Nova Igreja
                    </Link>
                </div>
            </div>
        </div>
    );
}